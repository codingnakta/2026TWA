// 우리의 TWA — 저장 서버 (Netlify Function + Netlify Blobs)
//
// 경로: /api/twa
//   GET  → { ok, data }                       누구나 읽기
//   POST { action:'login', password }         → { ok, role:'teacher'|'team', teamId?, passwords? }
//   POST { action:'save', password, data }    선생님: 전체 저장 (+ passwords: 팀 비밀번호 변경)
//   POST { action:'save', password, team }    팀: 자기 팀만 저장
//   POST { action:'note', password, teamId, note }   회의 기록 추가 (서버가 덧붙임)
//   POST { action:'note-del', password, teamId, id } 회의 기록 삭제
//
import { getStore } from '@netlify/blobs';

// 선생님 비밀번호 (하드코딩). 팀 비밀번호는 선생님이 편집 화면에서 정하고 Blobs 에 저장됩니다.
const TEACHER_PASSWORD = 'teacher';
// DeepL API 키 (하드코딩). 한국어를 고쳐 저장하면 일본어를 자동 번역합니다. ':fx' 로 끝나면 무료 API 주소를 씁니다.
const DEEPL_API_KEY = '84bf8db4-3065-4dbc-86c7-b8ad4d49804d:fx';

const json = (o, status = 200) => new Response(JSON.stringify(o), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

export default async (req) => {
  const store = getStore('twa');

  if (req.method === 'GET') {
    const data = await store.get('data', { type: 'json' });
    return json({ ok: true, data: data || null });
  }
  if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }

  const pw = String(body.password || '').trim();
  const teacherPw = TEACHER_PASSWORD;
  const passwords = (await store.get('passwords', { type: 'json' })) || {};

  let auth = null;
  if (pw && pw === teacherPw) auth = { role: 'teacher' };
  else if (pw) {
    const id = Object.keys(passwords).find(k => passwords[k] && String(passwords[k]).trim() === pw);
    if (id) auth = { role: 'team', teamId: id };
  }
  if (!auth) return json({ ok: false, error: 'wrong_password' }, 401);

  if (body.action === 'login') {
    const r = { ok: true, ...auth };
    if (auth.role === 'teacher') r.passwords = passwords;
    return json(r);
  }

  if (body.action === 'note' || body.action === 'note-del') {
    const data = await store.get('data', { type: 'json' });
    if (!data) return json({ ok: false, error: 'no_data' }, 409);
    const teamId = String(body.teamId || '');
    if (auth.role === 'team' && auth.teamId !== teamId) return json({ ok: false, error: 'forbidden' }, 403);
    const tm = data.teams.find(x => x.id === teamId);
    if (!tm) return json({ ok: false, error: 'not_found' }, 404);
    if (!Array.isArray(tm.notes)) tm.notes = [];
    if (body.action === 'note-del') {
      tm.notes = tm.notes.filter(n => n.id !== String(body.id || ''));
    } else {
      const n = body.note || {};
      const txt = n.text && typeof n.text === 'object' ? n.text : {};
      const ko = String(txt.ko || '').slice(0, 2000), ja = String(txt.ja || '').slice(0, 2000);
      if (!ko.trim() && !ja.trim()) return json({ ok: false, error: 'empty' }, 400);
      const text = { ko, ja }; if (ko.trim() && !ja.trim()) text.auto = true;
      tm.notes.push({
        id: 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        date: /^\d{4}-\d{2}-\d{2}$/.test(String(n.date || '')) ? n.date : new Date().toISOString().slice(0, 10),
        by: String(n.by || '').slice(0, 20), at: new Date().toISOString(), text
      });
      if (tm.notes.length > 300) tm.notes = tm.notes.slice(-300);
    }
    await translatePending(data);
    await store.setJSON('data', data);
    return json({ ok: true, data });
  }

  if (body.action === 'save') {
    let data = await store.get('data', { type: 'json' });
    const serverNotes = {}; (data && data.teams || []).forEach(x => { serverNotes[x.id] = x.notes || []; });
    if (auth.role === 'teacher') {
      if (!body.data || !Array.isArray(body.data.teams)) return json({ ok: false, error: 'bad_data' }, 400);
      data = body.data;
      // 회의 기록은 note 액션으로만 바뀝니다. 편집 저장이 덮어쓰지 않게 서버 것을 유지합니다.
      data.teams.forEach(x => { if (serverNotes[x.id]) x.notes = serverNotes[x.id]; });
      if (body.passwords && typeof body.passwords === 'object') {
        for (const [k, v] of Object.entries(body.passwords)) passwords[k] = String(v || '').trim();
        await store.setJSON('passwords', passwords);
      }
    } else {
      if (!data) return json({ ok: false, error: 'no_data' }, 409);
      const tm = body.team;
      if (!tm || tm.id !== auth.teamId) return json({ ok: false, error: 'forbidden' }, 403);
      const i = data.teams.findIndex(x => x.id === tm.id);
      if (i < 0) return json({ ok: false, error: 'not_found' }, 404);
      tm.notes = serverNotes[tm.id] || [];
      data.teams[i] = tm;
    }
    await translatePending(data);
    await store.setJSON('data', data);
    return json({ ok: true, data });
  }

  return json({ ok: false, error: 'unknown_action' }, 400);
};

export const config = { path: '/api/twa' };

/* ---------- 일본어 자동 번역 (DeepL) ----------
   페이지는 한국어를 고쳐 저장할 때 {ko:'…', ja:'', auto:true} 로 표시해 둡니다.
   그 칸만 골라 한 번에 번역하고, 결과를 ja 에 채웁니다 (auto:true 는 유지 → 화면에 '자동 번역' 칩). */
async function translatePending(data) {
  const key = DEEPL_API_KEY.trim();
  if (!key) return;
  const targets = [];
  const walk = (o) => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if ('ko' in o && 'ja' in o) {
      if (o.auto === true && !o.ja && o.ko && String(o.ko).trim()) targets.push(o);
      return;
    }
    for (const k of Object.keys(o)) walk(o[k]);
  };
  walk(data);
  if (!targets.length) return;

  const host = key.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
  for (let i = 0; i < targets.length; i += 40) {
    const chunk = targets.slice(i, i + 40);
    try {
      const r = await fetch(host + '/v2/translate', {
        method: 'POST',
        headers: { 'Authorization': 'DeepL-Auth-Key ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: chunk.map(o => String(o.ko)), source_lang: 'KO', target_lang: 'JA' })
      });
      if (!r.ok) { console.error('DeepL error', r.status, await r.text()); continue; }
      const out = await r.json();
      (out.translations || []).forEach((tr, j) => { if (tr && tr.text) chunk[j].ja = tr.text; });
    } catch (e) { console.error('DeepL failed', e); }
  }
}
