'use strict';
/* ==========================================================
   우리의 TWA — 앱 스크립트
   설정은 index.html 상단의 <script id="twa-config"> 에 있습니다.
   ========================================================== */
const DATA = migrate(JSON.parse(document.getElementById('twa-data').textContent));
const CONFIG = window.TWA_CONFIG || {};
const API = (CONFIG.API_URL || '/api/twa').trim();
const DEMO_PW = CONFIG.DEMO_PASSWORDS || null;

const L = {
  ko: {
    'nav.home':'전체 팀', 'nav.channels':'전체 소통 채널', 'channels.all':'전체 소통 채널', 'channels.all.edit':'전체 소통 채널 (선생님만 편집)',
    'teams.h':'팀별 TWA', 'channels.h':'우리가 쓰는 소통 채널', 'update.h':'Update', 'counter.h':'Counter', 'stat.meetings':'팀별 회의 횟수',
    'stat.teams':'팀', 'stat.principle':'"결과물에 대한 피드백" 원칙 동의', 'stat.revisions':'해보고 나서 고친 횟수',
    'upd.first':'『{team}』 TWA 최초 작성', 'upd.rev':'『{team}』 제{n}차 개정',
    'sec.comm':'우리는 이렇게 소통한다', 'sec.feedback':'피드백은 이렇게 준다', 'sec.decision':'결정이 안 날 때',
    'sec.cards':'각자의 카드', 'sec.work':'일하는 방식', 'sec.promises':'우리 팀의 약속 3가지',
    'f.channels':'주 소통 채널', 'f.replyTime':'답장 기대 시간', 'chan.addrow':'행 추가', 'chan.name':'채널 이름', 'chan.url':'링크 (선택)', 'chan.url.ph':'https://…', 'chan.open':'새 탭에서 열기', 'f.urgent':'급한 일은 이렇게 알린다',
    'f.preferred':'피드백 받고 싶은 방식', 'f.principle':'피드백은 사람이 아니라 결과물에 대해 한다는 원칙에 동의합니까?', 'f.rules':'우리 팀만의 피드백 규칙',
    'f.split':'의견이 갈리면 이렇게 결정한다', 'f.after':'최종 결정 후에는 이렇게 행동한다',
    'f.confident':'내가 자신 있는 것', 'f.notYet':'내가 아직 자신 없는 것', 'f.hard':'내가 협업에서 힘들어하는 상황', 'f.learn':'이 팀에서 배워가고 싶은 것 한 가지',
    'f.shareWhere':'작업 공유는 어디에, 얼마나 자주', 'f.doneMeans':'"완성됐다"의 기준은?', 'f.deadline':'마감 못 지킬 것 같으면 언제, 어떻게 말한다',
    'yes':'예', 'yes.long':'예, 동의합니다', 'no.long':'아직 동의하지 않았습니다', 'empty':'아직 비어 있음',
    'sign.text':'위 모든 기재 사항은 사실과 다름이 없음을 확인하며, 만약 위반 사항이 있을 경우 이에 따른 모든 책임을 감수할 것을 동의합니다.',
    'sign.h':'서명', 'sign.date':'작성일', 'sign.by':'작성자', 'seal':'인',
    'sign.pad':'서명하기', 'sign.hint':'마우스나 손가락으로 서명해주세요', 'sign.clear':'지우기', 'sign.save':'서명 저장', 'sign.remove':'서명 지우기', 'sign.tap':'눌러서 서명', 'sign.empty':'서명이 비어 있어요.',
    'leave.confirm':'편집 중인 내용이 저장되지 않았어요. 이 페이지를 나가면 사라져요. 나갈까요?',
    'notes.h':'회의 기록', 'notes.empty':'아직 회의 기록이 없어요. 첫 기록을 남겨보세요!', 'notes.ph':'오늘 회의에서 정한 것, 다음에 할 일을 간단히 적어주세요', 'notes.post':'등록', 'notes.date':'회의 날짜', 'notes.by':'작성자', 'notes.by.none':'팀 전체', 'notes.del':'삭제', 'notes.del.confirm':'이 회의 기록을 지울까요?', 'notes.need':'내용을 적어주세요.', 'notes.ok':'회의 기록을 남겼어요!', 'notes.forbidden':'우리 팀 회의 기록만 쓸 수 있어요.', 'notes.login':'등록을 누르면 팀 비밀번호를 물어봐요.', 'notes.editing':'편집을 끝내면 회의 기록을 쓸 수 있어요.', 'notes.fail':'등록하지 못했어요. 잠시 후 다시 시도해주세요.', 'notes.count':'{n}개',
    'confirm.h':'확인', 'confirm.yes':'네, 나갈게요', 'confirm.no':'계속 편집', 'confirm.ok':'네', 'confirm.cancel':'아니오',
    'ver':'제{n}차', 'ver.short':'{n}차', 'ver.first':'최초 작성', 'ver.history':'변화 과정',
    'diff.toggle':'변경 사항 보기', 'diff.sum':'이전 버전에서 {n}개 항목이 바뀌었어요', 'diff.none':'이전 버전과 같아요', 'prev':'이전',
    'notice.h':'공지사항', 'notice.empty':'아직 공지가 없어요.', 'edit.notice':'공지사항 (선생님만 편집)', 'teams.empty':'아직 등록된 팀이 없어요.',
    'demo.banner':'데모 모드예요. 편집은 해볼 수 있지만 새로고침하면 사라져요. 데모 비밀번호: 선생님 teacher',
    'loading':'불러오는 중…',
    'auto':'자동 번역', 'auto.pending':'번역 대기', 'auto.hint':'한국어를 고치고 저장하면 일본어는 자동으로 번역돼요. 일본어 칸을 직접 고치면 그 내용이 우선이에요.',
    'member':'팀원', 'member.role':'역할', 'member.name':'이름', 'member.add':'팀원 추가', 'member.remove':'이 팀원 빼기', 'member.former':'이전 팀원', 'member.min':'팀원은 최소 2명이에요.', 'member.max':'팀원은 최대 4명이에요.',
    'role.designer':'디자이너', 'role.developer':'개발자',
    'edit':'편집', 'edit.on':'편집 중', 'edit.on.team':'{team} 팀 편집 중', 'logout':'로그아웃', 'logged.team':'{team} 팀', 'logged.teacher':'선생님',
    'edit.langhint':'지금은 한국어 내용을 편집하고 있어요. 위의 언어를 日로 바꾸면 일본어 내용을 편집해요.',
    'edit.langhint.ja':'지금은 일본어 내용을 편집하고 있어요. 비워두면 저장할 때 자동 번역돼요.',
    'edit.changed':'바뀐 팀 {n}', 'edit.cancel':'취소', 'edit.save':'저장…', 'edit.json':'JSON 복사', 'edit.addteam':'팀 추가', 'edit.delteam':'이 팀 삭제',
    'edit.teamname':'팀명', 'site.name':'우리의 TWA', 'edit.sitetitle':'대문 제목 (Welcome 아래)', 'edit.intro':'대문 소개 문장', 'edit.program':'프로그램명 (상단 배너)',
    'edit.teampw':'팀 비밀번호 (학생용)', 'edit.teampw.ph':'비워두면 학생 편집 불가', 'edit.teamid':'팀 ID',
    'edit.onlyown':'{team} 팀 페이지만 편집할 수 있어요.',
    'login.h':'비밀번호', 'login.d':'선생님 비밀번호 또는 우리 팀 비밀번호를 넣어주세요.', 'login.go':'들어가기', 'login.wrong':'비밀번호가 맞지 않아요.', 'login.fail':'서버에 연결하지 못했어요. 잠시 후 다시 시도해주세요.', 'login.ok.team':'{team} 팀으로 들어왔어요.', 'login.ok.teacher':'선생님으로 들어왔어요.',
    'save.h':'저장하기', 'save.new':'새 버전으로 기록', 'save.new.d':'바뀐 팀마다 "제n차"가 하나씩 늘고, 변화 과정에 남아요. 팀이 규칙을 실제로 고쳤을 때.',
    'save.over':'현재 버전만 고치기', 'save.over.d':'오타나 빠진 내용을 채울 때. 새 버전으로 남지 않아요.',
    'save.note':'개정 메모 (왜 바꿨나요?)', 'save.note.ph':'예: 2주 해보니 답장 시간이 너무 느슨했음', 'save.date':'개정일', 'save.go':'저장', 'save.nothing':'바뀐 내용이 없어요.',
    'save.ok':'저장했어요!', 'save.demo':'데모 모드라 화면에만 반영됐어요. 새로고침하면 사라져요.', 'save.fail':'저장하지 못했어요. 잠시 후 다시 시도해주세요.', 'save.forbidden':'이 팀을 편집할 권한이 없어요.', 'save.pw':'비밀번호가 바뀐 것 같아요. 다시 로그인해주세요.',
    'del.confirm':'"{name}" 팀과 모든 버전 기록을 지울까요? 저장하면 되돌릴 수 없어요.',
    'member.confirm':'"{name}" 팀원을 뺄까요? 이 팀원의 카드도 현재 버전에서 사라져요.',
    'newteam.name':'새 팀', 'json.h':'현재 데이터 (JSON)', 'json.d':'복사해서 보관하거나 다른 곳에 붙여넣을 수 있어요.', 'close':'닫기',
    'foot':'Team Working Agreement ☆ 팀이 스스로 정하고, 해보고, 고친 기록'
  },
  ja: {
    'nav.home':'全チーム', 'nav.channels':'全体の連絡チャンネル', 'channels.all':'全体の連絡チャンネル', 'channels.all.edit':'全体の連絡チャンネル（先生のみ編集）',
    'teams.h':'チーム別TWA', 'channels.h':'使っている連絡チャンネル', 'update.h':'Update', 'counter.h':'Counter', 'stat.meetings':'チーム別ミーティング回数',
    'stat.teams':'チーム', 'stat.principle':'「成果物へのフィードバック」原則に同意', 'stat.revisions':'やってみて直した回数',
    'upd.first':'『{team}』TWA 初回作成', 'upd.rev':'『{team}』第{n}版に改訂',
    'sec.comm':'私たちはこうコミュニケーションする', 'sec.feedback':'フィードバックはこう伝える', 'sec.decision':'決まらないとき',
    'sec.cards':'それぞれのカード', 'sec.work':'仕事の進め方', 'sec.promises':'私たちのチームの約束3つ',
    'f.channels':'主な連絡チャンネル', 'f.replyTime':'返信の目安時間', 'chan.addrow':'行を追加', 'chan.name':'チャンネル名', 'chan.url':'リンク（任意）', 'chan.url.ph':'https://…', 'chan.open':'新しいタブで開く', 'f.urgent':'急ぎの用件はこう知らせる',
    'f.preferred':'受けたいフィードバックの形', 'f.principle':'「フィードバックは人ではなく成果物に対して行う」という原則に同意しますか？', 'f.rules':'私たちのチームだけのフィードバックルール',
    'f.split':'意見が分かれたらこう決める', 'f.after':'最終決定のあとはこう動く',
    'f.confident':'自信があること', 'f.notYet':'まだ自信がないこと', 'f.hard':'協働でつらいと感じる場面', 'f.learn':'このチームで学びたいことをひとつ',
    'f.shareWhere':'作業の共有はどこで、どのくらいの頻度で', 'f.doneMeans':'「完成」の基準は？', 'f.deadline':'締切に間に合わなそうなとき、いつ・どう伝える',
    'yes':'はい', 'yes.long':'はい、同意します', 'no.long':'まだ同意していません', 'empty':'まだ空欄',
    'sign.text':'上記の記載事項がすべて事実と相違ないことを確認し、違反があった場合はそれに伴うすべての責任を負うことに同意します。',
    'sign.h':'署名', 'sign.date':'作成日', 'sign.by':'作成者', 'seal':'印',
    'sign.pad':'署名する', 'sign.hint':'マウスや指で署名してください', 'sign.clear':'消す', 'sign.save':'署名を保存', 'sign.remove':'署名を削除', 'sign.tap':'押して署名', 'sign.empty':'署名が空です。',
    'leave.confirm':'編集中の内容が保存されていません。このページを離れると消えます。離れますか？',
    'notes.h':'ミーティング記録', 'notes.empty':'まだ記録がありません。最初の記録を残しましょう！', 'notes.ph':'今日のミーティングで決めたこと、次にやることを簡単に書いてください', 'notes.post':'投稿', 'notes.date':'ミーティングの日', 'notes.by':'書いた人', 'notes.by.none':'チーム全員', 'notes.del':'削除', 'notes.del.confirm':'この記録を削除しますか？', 'notes.need':'内容を書いてください。', 'notes.ok':'記録を残しました！', 'notes.forbidden':'自分のチームの記録だけ書けます。', 'notes.login':'投稿を押すとチームのパスワードを聞かれます。', 'notes.editing':'編集を終えると記録を書けます。', 'notes.fail':'投稿できませんでした。しばらくしてからもう一度お試しください。', 'notes.count':'{n}件',
    'confirm.h':'確認', 'confirm.yes':'はい、離れます', 'confirm.no':'編集を続ける', 'confirm.ok':'はい', 'confirm.cancel':'いいえ',
    'ver':'第{n}版', 'ver.short':'第{n}版', 'ver.first':'初回作成', 'ver.history':'変化の記録',
    'diff.toggle':'変更点を表示', 'diff.sum':'前の版から{n}項目が変わりました', 'diff.none':'前の版と同じです', 'prev':'前回',
    'notice.h':'お知らせ', 'notice.empty':'まだお知らせはありません。', 'edit.notice':'お知らせ（先生のみ編集）', 'teams.empty':'まだ登録されたチームはありません。',
    'demo.banner':'デモモードです。編集は試せますが、再読み込みすると消えます。デモ用パスワード：先生 teacher',
    'loading':'読み込み中…',
    'auto':'自動翻訳', 'auto.pending':'翻訳待ち', 'auto.hint':'韓国語を直して保存すると日本語は自動で翻訳されます。日本語欄を直接直した場合はその内容が優先されます。',
    'member':'メンバー', 'member.role':'役割', 'member.name':'名前', 'member.add':'メンバーを追加', 'member.remove':'このメンバーを外す', 'member.former':'元メンバー', 'member.min':'メンバーは最低2人です。', 'member.max':'メンバーは最大4人です。',
    'role.designer':'デザイナー', 'role.developer':'開発者',
    'edit':'編集', 'edit.on':'編集中', 'edit.on.team':'{team}チーム 編集中', 'logout':'ログアウト', 'logged.team':'{team}チーム', 'logged.teacher':'先生',
    'edit.langhint':'いま韓国語の内容を編集しています。上の言語を「日」に切り替えると日本語の内容を編集します。',
    'edit.langhint.ja':'いま日本語の内容を編集しています。空欄のままにすると保存時に自動翻訳されます。',
    'edit.changed':'変更したチーム {n}', 'edit.cancel':'キャンセル', 'edit.save':'保存…', 'edit.json':'JSONをコピー', 'edit.addteam':'チームを追加', 'edit.delteam':'このチームを削除',
    'edit.teamname':'チーム名', 'site.name':'私たちのTWA', 'edit.sitetitle':'トップの見出し（Welcomeの下）', 'edit.intro':'トップの紹介文', 'edit.program':'プログラム名（上のバナー）',
    'edit.teampw':'チームのパスワード（生徒用）', 'edit.teampw.ph':'空欄なら生徒は編集不可', 'edit.teamid':'チームID',
    'edit.onlyown':'{team}チームのページだけ編集できます。',
    'login.h':'パスワード', 'login.d':'先生のパスワード、または自分のチームのパスワードを入れてください。', 'login.go':'入る', 'login.wrong':'パスワードが違います。', 'login.fail':'サーバーに接続できませんでした。しばらくしてからもう一度お試しください。', 'login.ok.team':'{team}チームとして入りました。', 'login.ok.teacher':'先生として入りました。',
    'save.h':'保存する', 'save.new':'新しい版として記録', 'save.new.d':'変更したチームごとに「第n版」が増え、変化の記録に残ります。チームが実際にルールを直したとき。',
    'save.over':'現在の版だけ直す', 'save.over.d':'誤字や抜けを埋めるとき。新しい版としては残りません。',
    'save.note':'改訂メモ（なぜ変えましたか？）', 'save.note.ph':'例：2週間やってみて返信時間がゆるすぎた', 'save.date':'改訂日', 'save.go':'保存', 'save.nothing':'変更がありません。',
    'save.ok':'保存しました！', 'save.demo':'デモモードのため画面にだけ反映されました。再読み込みすると消えます。', 'save.fail':'保存できませんでした。しばらくしてからもう一度お試しください。', 'save.forbidden':'このチームを編集する権限がありません。', 'save.pw':'パスワードが変わったようです。もう一度ログインしてください。',
    'del.confirm':'「{name}」チームとすべての版の記録を削除しますか？保存すると元に戻せません。',
    'member.confirm':'「{name}」を外しますか？このメンバーのカードも現在の版から消えます。',
    'newteam.name':'新しいチーム', 'json.h':'現在のデータ（JSON）', 'json.d':'コピーして保管したり、別の場所に貼り付けたりできます。', 'close':'閉じる',
    'foot':'Team Working Agreement ☆ チームが自分で決め、やってみて、直した記録'
  }
};

const CHANNELS = [
  {ko:'카카오톡', ja:'カカオトーク'}, {ko:'라인', ja:'LINE'}, {ko:'디스코드', ja:'Discord'}, {ko:'노션', ja:'Notion'},
  {ko:'구글 클래스룸', ja:'Google Classroom'}, {ko:'슬랙', ja:'Slack'}, {ko:'깃허브', ja:'GitHub'}, {ko:'인스타 DM', ja:'InstagramのDM'},
  {ko:'전화·문자', ja:'電話・SMS'}, {ko:'직접 만나서', ja:'直接会って'}
];
const SECTIONS = [
  {key:'comm', n:1, fields:['channels','replyTime','urgent']},
  {key:'feedback', n:2, fields:['preferred','principle','rules']},
  {key:'decision', n:3, fields:['split','after']},
  {key:'cards', n:4, person:true, fields:['confident','notYet','hard','learn']},
  {key:'work', n:5, fields:['shareWhere','doneMeans','deadline']},
  {key:'promises', n:6, list:true, fields:['p1','p2','p3']}
];
const CIRCLED = ['➀','➁','➂'];
const MIN_MEMBERS = 2, MAX_MEMBERS = 4;

const state = {
  lang: (()=>{ try { return localStorage.getItem('twa-lang') || 'ko'; } catch(e){ return 'ko'; } })(),
  editing:false, draft:null, diff:true, ver:{},
  auth: (()=>{ try { return JSON.parse(sessionStorage.getItem('twa-auth') || 'null'); } catch(e){ return null; } })(),
  pwEdits:{}, loading:true, demo:null, saveMode:'new', saveNote:'', noteDraft:{}
};
const $app = document.getElementById('app');

/* ---------- data shape / migration ---------- */
function migrate(d){
  if (!d || !Array.isArray(d.teams)) return d;
  if (!d.site) d.site = {};
  if (!d.site.notice || typeof d.site.notice !== 'object') d.site.notice = {ko:'', ja:''};
  if (!Array.isArray(d.site.channels)) d.site.channels = [];
  d.teams.forEach(team => {
    team.versions.forEach(v => {
      const c = v.fields && v.fields.comm; if (!c) return;
      if (!Array.isArray(c.channels)){
        const txt = c.channel || {ko:'', ja:''};
        const kos = (txt.ko || '').split(/[+,·/、＋]/).map(x => x.trim()).filter(Boolean);
        const jas = (txt.ja || '').split(/[+,/、＋]/).map(x => x.trim()).filter(Boolean);
        c.channels = kos.map((ko, i) => { const pre = CHANNELS.find(x => x.ko === ko); return {ko, ja: (pre && pre.ja) || jas[i] || ''}; });
        delete c.channel;
      }
    });
    if (!team.members){
      team.members = [];
      if (team.designer) team.members.push({key:'m1', role:{ko:'디자이너', ja:'デザイナー'}, name:team.designer});
      if (team.developer) team.members.push({key:'m2', role:{ko:'개발자', ja:'開発者'}, name:team.developer});
      delete team.designer; delete team.developer;
      team.versions.forEach(v => {
        const c = v.fields.cards || {};
        if (c.designer || c.developer){
          const pref = v.fields.feedback && v.fields.feedback.preferred;
          v.fields.cards = {};
          if (c.designer) v.fields.cards.m1 = Object.assign({}, c.designer, {preferred: pref || {ko:'', ja:''}});
          if (c.developer) v.fields.cards.m2 = Object.assign({}, c.developer, {preferred: {ko:'', ja:''}});
        }
        if (v.fields.feedback) delete v.fields.feedback.preferred;
      });
    }
  });
  return d;
}
const bl = () => ({ko:'', ja:''});
const emptyCard = () => ({confident:bl(), notYet:bl(), hard:bl(), learn:bl(), preferred:bl()});
function emptyFields(memberKeys){
  const cards = {}; memberKeys.forEach(k => { cards[k] = emptyCard(); });
  return {
    comm:{channels:[], replyTime:bl(), urgent:bl()},
    feedback:{principle:false, rules:bl()},
    decision:{split:bl(), after:bl()},
    cards,
    work:{shareWhere:bl(), doneMeans:bl(), deadline:bl()},
    promises:{p1:bl(), p2:bl(), p3:bl()}
  };
}

/* ---------- helpers ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t = o => { if (o == null) return ''; if (typeof o === 'string') return o; return o[state.lang] || o.ko || o.ja || ''; };
const isPending = o => state.lang === 'ja' && o && typeof o === 'object' && !o.ja && o.auto === true && !!o.ko;
const tv = o => { // text with translation badges (view mode)
  const s = t(o); if (!s) return `<span class="empty">${lbl('empty')}</span>`;
  let h = esc(s);
  if (isPending(o)) h += ` <span class="chip auto pending">${lbl('auto.pending')}</span>`;
  else if (state.lang === 'ja' && o.auto === true && o.ja) h += ` <span class="chip auto">${lbl('auto')}</span>`;
  return h;
};
const lbl = (k, vars) => { let s = (L[state.lang] && L[state.lang][k]) ?? L.ko[k] ?? k; if (vars) for (const v in vars) s = s.replace('{'+v+'}', vars[v]); return s; };
const clone = o => JSON.parse(JSON.stringify(o));
const data = () => state.editing ? state.draft : DATA;
const today = () => { const d = new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
const fmtDate = s => { if (!s) return ''; const [y,m,d] = s.split('-'); return state.lang === 'ja' ? `${y}年${+m}月${+d}日` : `${y}.${+m}.${+d}`; };
const latest = team => team.versions[team.versions.length - 1];
const isNew = s => { if (!s) return false; const d = (Date.now() - new Date(s).getTime()) / 86400000; return d >= -1 && d <= 14; };
const isTeacher = () => !!(state.auth && state.auth.role === 'teacher');
const myTeamId = () => (state.auth && state.auth.role === 'team') ? state.auth.teamId : null;
const canEditTeam = id => isTeacher() || myTeamId() === id;
const teamName = id => { const tm = DATA.teams.find(x => x.id === id); return tm ? (t(tm.name) || lbl('newteam.name')) : id; };
const roleClass = r => { const s = (t(r) || '').toLowerCase(); if (/디자|デザ|design/.test(s)) return 'des'; if (/개발|開発|dev|프로그|코딩/.test(s)) return 'dev'; return 'etc'; };
const memberOf = (team, key) => team.members.find(m => m.key === key);
function saveAuth(a){ state.auth = a; try { if (a) sessionStorage.setItem('twa-auth', JSON.stringify(a)); else sessionStorage.removeItem('twa-auth'); } catch(e){} }

function getPath(obj, path){ return path.split('/').reduce((o,k) => (o == null ? undefined : o[k]), obj); }
function setPath(obj, path, val){
  const ks = path.split('/'); let o = obj;
  for (let i = 0; i < ks.length - 1; i++){ if (o[ks[i]] == null || typeof o[ks[i]] !== 'object') o[ks[i]] = {}; o = o[ks[i]]; }
  o[ks[ks.length-1]] = val;
}
function route(){
  const m = location.hash.match(/^#\/t\/(.+)$/);
  return m ? {page:'team', id:decodeURIComponent(m[1])} : {page:'home'};
}
function fieldText(v){ if (Array.isArray(v)) return v.map(t).join(', '); return typeof v === 'boolean' ? (v ? 'Y' : 'N') : t(v); }
const chanKey = c => (c.ko || c.ja || '').trim().toLowerCase();
const safeUrl = u => { u = (u || '').trim(); if (!u) return ''; if (!/^https?:\/\//i.test(u)) u = 'https://' + u; try { const x = new URL(u); return (x.protocol === 'http:' || x.protocol === 'https:') ? x.href : ''; } catch(e){ return ''; } };
const chanChip = c => { const u = safeUrl(c.url); const name = esc(t(c)) || '—'; return u ? `<a class="chip link" href="${esc(u)}" target="_blank" rel="noopener" title="${lbl('chan.open')}">${name} ↗</a>` : `<span class="chip">${name}</span>`; };
function changedCount(cur, prev){
  if (!prev) return 0; let n = 0;
  for (const s of SECTIONS){
    if (s.person){ for (const k of Object.keys(cur.cards)) for (const f of s.fields.concat(['preferred'])) if (fieldText(cur.cards[k] && cur.cards[k][f]) !== fieldText(prev.cards[k] && prev.cards[k][f])) n++; }
    else for (const f of s.fields){ if (f === 'preferred') continue; if (fieldText(cur[s.key][f]) !== fieldText(prev[s.key][f])) n++; }
  }
  return n;
}
const digits = (n, w) => `<span class="digits">${String(n).padStart(w || 3,'0').split('').map(c => `<span>${c}</span>`).join('')}</span>`;

/* mark fields whose Korean changed (and Japanese wasn't hand-edited) for auto-translation */
function markTranslations(out, orig){
  const isText = o => o && typeof o === 'object' && !Array.isArray(o) && 'ko' in o && 'ja' in o;
  const walk = (a, b) => {
    if (isText(a)){
      const bko = b && isText(b) ? b.ko : undefined, bja = b && isText(b) ? b.ja : '';
      const koChanged = (a.ko || '') !== (bko || '');
      const jaEdited = (a.ja || '') !== (bja || '');
      if (jaEdited && a.ja){ delete a.auto; return; }
      if (a.ko && (koChanged || !a.ja) && (!a.ja || (b && b.auto))){ a.ja = ''; a.auto = true; }
      if (!a.ko && !a.ja) delete a.auto;
      return;
    }
    if (Array.isArray(a)){ a.forEach((x,i) => walk(x, Array.isArray(b) ? b.find(y => y && x && y.key && y.key === x.key) || b[i] : undefined)); return; }
    if (a && typeof a === 'object') for (const k of Object.keys(a)) walk(a[k], b && typeof b === 'object' ? b[k] : undefined);
  };
  walk(out, orig);
}

/* ---------- server ---------- */
async function apiPost(body){
  const r = await fetch(API, {method:'POST', redirect:'follow', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify(body)});
  return r.json();
}
function applyRemote(d){ migrate(d); DATA.site = d.site; DATA.teams = d.teams; }
async function loadRemote(){
  try {
    const r = await fetch(API + (API.includes('?') ? '&' : '?') + 'action=get&_=' + Date.now(), {method:'GET', redirect:'follow'});
    if (r.status === 404){ state.demo = true; }
    else {
      const res = await r.json();
      if (res && res.ok){ state.demo = false; if (res.data && Array.isArray(res.data.teams)) applyRemote(res.data); }
      else throw new Error('bad');
    }
  } catch(e){ state.demo = true; }
  state.loading = false;
  if (!state.editing) render();
}

/* ---------- render: shared ---------- */
function banner(){
  const D = data();
  let right = '';
  if (state.editing){
    right = `<span class="chip sample">✎ ${myTeamId() ? lbl('edit.on.team',{team:esc(teamName(myTeamId()))}) : lbl('edit.on')}</span>`;
  } else {
    right = `<button class="btn" data-action="edit">✎ ${lbl('edit')}</button>`;
    if (state.auth) right += `<button class="btn mint" data-action="logout" title="${state.auth.role === 'teacher' ? lbl('logged.teacher') : lbl('logged.team',{team:esc(teamName(state.auth.teamId))})}">${lbl('logout')}</button>`;
  }
  const sparks = [[8,12],[30,70],[52,18],[70,60],[86,30],[95,75],[18,88],[42,40]].map(([x,y]) => `<span class="spark" style="left:${x}%;top:${y}%">✦</span>`).join('');
  return `<header class="banner">
    ${sparks}
    <div class="top">
      <a class="logo" href="#/">
        <div class="prog">☆ ${esc(t(D.site.program))} ☆</div>
        <h1>${lbl('site.name')}</h1>
        <div class="en">♡ Team Working Agreement ♡</div>
      </a>
      <div class="tools">
        <div class="seg" role="group" aria-label="language">
          <button data-action="lang" data-lang="ko" aria-pressed="${state.lang==='ko'}">한</button>
          <button data-action="lang" data-lang="ja" aria-pressed="${state.lang==='ja'}">日</button>
        </div>
        ${right}
      </div>
    </div>
    <div class="flowers" aria-hidden="true"><span>🌸</span><span>🍓</span><span>🎀</span><span>🍄</span></div>
  </header>
  <nav class="nav">
    <a href="#/">${lbl('nav.home')}</a>
    <a class="pink" href="#/" data-action="goto" data-target="channels">${lbl('nav.channels')}</a>
    <span class="spacer"></span>
    <span class="status">${state.loading ? lbl('loading') : 'since 2026.9.16'}</span>
  </nav>`;
}
function members(team){
  return `<div class="members">${team.members.map(m => `<span><span class="role ${roleClass(m.role)}">${esc(t(m.role)) || lbl('member')}</span><b>${esc(t(m.name)) || '—'}</b></span>`).join('')}</div>`;
}
function sticker(team){
  const v = latest(team);
  return `<div class="sticker" aria-label="${lbl('ver',{n:v.v})}"><span>${lbl('ver',{n:v.v})}</span><small>${fmtDate(v.date)}</small></div>`;
}
function changedTeams(){
  return state.draft.teams.filter(tm => { const o = DATA.teams.find(x => x.id === tm.id); return !o || JSON.stringify(tm) !== JSON.stringify(o); }).length;
}
function editbar(){
  if (!state.editing) return '';
  return `<div class="editbar">
    <span class="lang-hint">${state.lang === 'ja' ? lbl('edit.langhint.ja') : lbl('edit.langhint')}</span>
    <span class="spacer"></span>
    <span class="saveopts">
      <select class="fi sel" id="savemode" data-save="mode" title="${lbl('save.new.d')}">
        <option value="new" ${state.saveMode === 'new' ? 'selected' : ''}>${lbl('save.new')}</option>
        <option value="over" ${state.saveMode === 'over' ? 'selected' : ''}>${lbl('save.over')}</option>
      </select>
      <input class="fi note" type="text" id="savenote" data-save="note" value="${esc(state.saveNote)}" placeholder="${esc(lbl('save.note.ph'))}" ${state.saveMode === 'over' ? 'hidden' : ''}>
    </span>
    <span class="cnt" id="cnt">${lbl('edit.changed',{n:changedTeams()})}</span>
    ${isTeacher() ? `<button class="btn" data-action="json">${lbl('edit.json')}</button>` : ''}
    <button class="btn" data-action="cancel">${lbl('edit.cancel')}</button>
    <button class="btn save" data-action="save">${lbl('save.go')}</button>
  </div>`;
}
function textField(path, val, opts){
  const p = `${path}/${state.lang}`;
  const v = (val && typeof val === 'object') ? (val[state.lang] || '') : (val || '');
  const id = 'f-' + p.replace(/\//g,'-');
  const ph = state.lang === 'ja' && val && val.ko ? ` placeholder="${esc(val.ko)}"` : '';
  return opts && opts.short
    ? `<input class="fi" type="text" id="${id}" data-path="${p}" value="${esc(v)}"${ph}>`
    : `<textarea class="fi" id="${id}" data-path="${p}" rows="${(opts && opts.rows) || 2}"${ph}>${esc(v)}</textarea>`;
}
function footer(){ return `<footer class="foot"><div class="lace">♡ ✿ ♡ ✿ ♡ ✿ ♡ ✿ ♡</div>${lbl('foot')}</footer>`; }
function banners(){
  const D = data();
  let h = '';
  if (state.demo) h += `<div class="edit-banner">★ ${lbl('demo.banner')}</div>`;
  return h;
}

/* ---------- render: home ---------- */
const MEETING_ORDER = ['T','Z','O','B'];
function meetingCells(teams){
  const initial = tm => ((tm.name && (tm.name.ko || tm.name.ja)) || '?').trim().charAt(0).toUpperCase() || '?';
  const rank = tm => { const i = MEETING_ORDER.indexOf(initial(tm)); return i < 0 ? MEETING_ORDER.length : i; };
  return teams.map((tm, idx) => ({tm, idx})).sort((a,b) => rank(a.tm) - rank(b.tm) || a.idx - b.idx)
    .map(({tm}) => `<a class="mcell" href="#/t/${encodeURIComponent(tm.id)}" title="${esc(t(tm.name))}"><span class="ml">${esc(initial(tm))}</span><span class="mn">${(tm.notes || []).length}</span></a>`).join('');
}
function renderHome(){
  const D = data();
  const teams = D.teams;
  const cards = teams.map(team => {
    const v = latest(team);
    const ps = ['p1','p2','p3'].map((k,i) => `<li><span class="n">${CIRCLED[i]}</span><span>${tv(v.fields.promises[k])}</span></li>`).join('');
    return `<a class="card" href="#/t/${encodeURIComponent(team.id)}">
      <span class="tape tl"></span>
      <div class="head"><div>
        <h3>${esc(t(team.name)) || lbl('newteam.name')} ${isNew(v.date) ? `<span class="tag-new">NEW!</span>` : ''}</h3>
        ${members(team)}
      </div>${sticker(team)}</div>
      <ul class="promises">${ps}</ul>
    </a>`;
  }).join('');
  const addCard = state.editing && isTeacher() ? `<button class="card add" data-action="addteam">＋ ${lbl('edit.addteam')}</button>` : '';
  const noTeams = !teams.length && !addCard ? `<div class="none">${lbl('teams.empty')}</div>` : '';

  const noticeBody = state.editing && isTeacher()
    ? `<div class="team-edit" style="margin-top:0"><div style="grid-column:1/-1"><label>${lbl('edit.notice')}</label>${textField('site/notice', D.site.notice, {rows:5})}</div></div>`
    : (t(D.site.notice) ? tv(D.site.notice) : `<span class="empty">${lbl('notice.empty')}</span>`);
  const notice = `<div class="sec-head" style="margin-top:0"><span class="ribbon kedu">${lbl('notice.h')}</span></div>
        <div class="notice"><span class="tape tl"></span>${noticeBody}</div>`;

  const nTeams = teams.length;
  const nAgree = teams.filter(x => latest(x).fields.feedback.principle === true).length;
  const nRev = teams.reduce((a,x) => a + x.versions.length - 1, 0);

  const events = teams.flatMap(team => team.versions.map(v => ({date:v.date, team, v}))).sort((a,b) => (b.date||'').localeCompare(a.date||'')).slice(0,4);
  const upd = events.map(e => `<li><span class="d">${esc(e.date || '')}${isNew(e.date) ? `<span class="tag-new">NEW!</span>` : ''}</span>
      <span class="w"><a href="#/t/${encodeURIComponent(e.team.id)}"><b>${e.v.v === 1 ? lbl('upd.first',{team:esc(t(e.team.name))}) : lbl('upd.rev',{team:esc(t(e.team.name)), n:e.v.v})}</b></a>${e.v.v > 1 && t(e.v.note) ? `<small>${esc(t(e.v.note))}</small>` : ''}</span></li>`).join('');

  const chips = teams.map(team => { const arr = latest(team).fields.comm.channels || []; return `<div class="chanrow"><a class="tn" href="#/t/${encodeURIComponent(team.id)}">${esc(t(team.name)) || lbl('newteam.name')}</a><span class="chips">${arr.length ? arr.map(chanChip).join('') : `<span style="color:var(--ink-3);font-size:13px">${lbl('empty')}</span>`}</span></div>`; }).join('');

  const allArr = D.site.channels || [];
  const allChan = state.editing && isTeacher()
    ? `<div class="chanrow all edit"><span class="tn">${lbl('channels.all.edit')}</span><div class="chan-edit">
        <div class="chan-head"><span>${lbl('chan.name')}</span><span>${lbl('chan.url')}</span><span></span></div>
        ${allArr.map((c,i) => `<div class="chan-row">
            <input class="fi" type="text" list="chanlist" data-chan="${i}/name" value="${esc(c[state.lang] || '')}" placeholder="${lbl('chan.name')}"${state.lang === 'ja' && c.ko ? ` title="${esc(c.ko)}"` : ''}>
            <input class="fi" type="url" data-chan="${i}/url" value="${esc(c.url || '')}" placeholder="${lbl('chan.url.ph')}">
            <button class="btn danger sm" data-action="chan-del" data-i="${i}" title="✕">✕</button>
          </div>`).join('')}
        <datalist id="chanlist">${CHANNELS.map(c => `<option value="${esc(t(c))}">`).join('')}</datalist>
        <div><button class="btn sm" data-action="chan-addrow">＋ ${lbl('chan.addrow')}</button></div>
      </div></div>`
    : `<div class="chanrow all"><span class="tn">${lbl('channels.all')}</span><span class="chips">${allArr.filter(c => t(c)).length ? allArr.filter(c => t(c)).map(chanChip).join('') : `<span style="color:var(--ink-3);font-size:13px">${lbl('empty')}</span>`}</span></div>`;

  const siteEdit = state.editing && isTeacher() ? `<div class="team-edit" style="margin-top:18px">
      <div><label>${lbl('edit.program')}</label>${textField('site/program', D.site.program, {short:true})}</div>
      <div><label>${lbl('edit.sitetitle')}</label>${textField('site/title', D.site.title, {short:true})}</div>
      <div style="grid-column:1/-1"><label>${lbl('edit.intro')}</label>${textField('site/intro', D.site.intro)}</div>
    </div>` : '';

  return `<div class="page">${banner()}${banners()}
  <main class="wrap">
    <section class="hero frame">
      <span class="tape tl"></span><span class="tape br"></span>
      <div class="inner">
        <div class="en">☆ Welcome ☆</div>
        <h2>${esc(t(D.site.title))}</h2>
        <p>${tv(D.site.intro)}</p>
        <div class="hearts">♡ ♡ ♡</div>
        ${siteEdit}
      </div>
    </section>
    <div class="cols">
      <aside class="side">
        <div class="box"><span class="ribbon mint">${lbl('update.h')}</span><ul class="upd">${upd}</ul></div>
        <div class="box"><span class="ribbon lav">${lbl('counter.h')}</span>
          <div class="counter">
            <div class="row"><span class="k">${lbl('stat.teams')}</span>${digits(nTeams)}</div>
            <div class="row"><span class="k">${lbl('stat.principle')}</span><span class="digits">${digits(nAgree).replace(/^<span class="digits">|<\/span>$/g,'')}<small>/ ${nTeams}</small></span></div>
            <div class="row"><span class="k">${lbl('stat.revisions')}</span>${digits(nRev)}</div>
            <div class="row"><span class="k">${lbl('stat.meetings')}</span><div class="mgrid">${meetingCells(teams)}</div></div>
          </div>
        </div>
      </aside>
      <div>
        ${notice}
        <div class="sec-head"><span class="ribbon kedu">${lbl('teams.h')}</span><span class="count">${nTeams}</span></div>
        <div class="grid">${cards}${addCard}${noTeams}</div>
        <div class="sec-head" id="channels"><span class="ribbon lav">${lbl('channels.h')}</span></div>
        <div class="chanlist">${allChan}${chips}</div>
      </div>
    </div>
    ${footer()}
  </main>
  ${editbar()}</div>`;
}

/* ---------- render: team ---------- */
function renderTeam(team){
  const ti = data().teams.indexOf(team);
  const editable = state.editing && canEditTeam(team.id);
  const vi = editable ? team.versions.length - 1 : Math.min(state.ver[team.id] ?? team.versions.length - 1, team.versions.length - 1);
  const ver = team.versions[vi];
  const prev = vi > 0 ? team.versions[vi-1] : null;
  const showDiff = !editable && state.diff && !!prev;
  const base = `teams/${ti}/versions/${vi}/fields`;
  const memberLabel = key => { const m = memberOf(team, key); return m ? `<span class="role ${roleClass(m.role)}">${esc(t(m.role)) || lbl('member')}</span><b>${esc(t(m.name)) || '—'}</b>` : `<span class="role etc">${lbl('member.former')}</span><b>—</b>`; };

  const chanChips = arr => (arr && arr.length) ? arr.map(chanChip).join(' ') : `<span class="empty">${lbl('empty')}</span>`;
  const row = (path, label, cur, prevVal, isBool) => {
    const id = 'f-' + path.replace(/\//g,'-');
    if (Array.isArray(cur) || (editable && path.endsWith('/channels'))){
      const arr = cur || [];
      if (editable){
        const rows = arr.map((c,i) => `<div class="chan-row">
            <input class="fi" type="text" list="chanlist" data-chan="${i}/name" value="${esc(c[state.lang] || '')}" placeholder="${lbl('chan.name')}"${state.lang === 'ja' && c.ko ? ` title="${esc(c.ko)}"` : ''}>
            <input class="fi" type="url" data-chan="${i}/url" value="${esc(c.url || '')}" placeholder="${lbl('chan.url.ph')}">
            <button class="btn danger sm" data-action="chan-del" data-i="${i}" title="✕">✕</button>
          </div>`).join('');
        return `<div class="row-f"><div class="k">${label}</div><div class="v chan-edit">
          <div class="chan-head"><span>${lbl('chan.name')}</span><span>${lbl('chan.url')}</span><span></span></div>
          ${rows}
          <datalist id="chanlist">${CHANNELS.map(c => `<option value="${esc(t(c))}">`).join('')}</datalist>
          <div><button class="btn sm mint" data-action="chan-addrow">＋ ${lbl('chan.addrow')}</button></div>
        </div></div>`;
      }
      const changed = showDiff && fieldText(arr) !== fieldText(prevVal);
      return `<div class="row-f ${changed ? 'changed' : ''}"><div class="k">${label}</div><div class="v">${chanChips(arr)}${changed ? `<span class="prev">${lbl('prev')}: <s>${esc(fieldText(prevVal) || lbl('empty'))}</s></span>` : ''}</div></div>`;
    }
    if (editable){
      if (isBool) return `<div class="row-f"><div class="k">${label}</div><div class="v"><label class="check ${cur ? 'on' : ''}"><input type="checkbox" id="${id}" data-path="${path}" data-type="bool" ${cur ? 'checked' : ''}> ${lbl('yes')}</label></div></div>`;
      return `<div class="row-f"><div class="k"><label for="${id}-${state.lang}">${label}</label></div><div class="v">${textField(path, cur)}</div></div>`;
    }
    const changed = showDiff && fieldText(cur) !== fieldText(prevVal);
    let vhtml;
    if (isBool) vhtml = `<span class="check ${cur ? 'on' : ''}"><span class="box">${cur ? '✓' : ''}</span>${cur ? lbl('yes.long') : lbl('no.long')}</span>`;
    else vhtml = tv(cur);
    let ph = '';
    if (changed){ const p = isBool ? (prevVal ? lbl('yes.long') : lbl('no.long')) : (t(prevVal) || lbl('empty')); ph = `<span class="prev">${lbl('prev')}: <s>${esc(p)}</s></span>`; }
    return `<div class="row-f ${changed ? 'changed' : ''}"><div class="k">${label}</div><div class="v ${!isBool && !t(cur) ? 'empty' : ''}">${vhtml}${ph}</div></div>`;
  };
  const cardKeys = Object.keys(ver.fields.cards);
  const orderedKeys = team.members.map(m => m.key).filter(k => cardKeys.includes(k)).concat(cardKeys.filter(k => !memberOf(team, k)));

  const secs = SECTIONS.map(s => {
    let body;
    if (s.person){
      body = `<div class="persons">${orderedKeys.map(k => { const m = memberOf(team, k); return `<div class="person ${m ? roleClass(m.role) : 'etc'}"><div class="in">
        <div class="who">${memberLabel(k)}</div>
        <div class="rows">${s.fields.map(f => row(`${base}/cards/${k}/${f}`, lbl('f.'+f), ver.fields.cards[k][f], prev && prev.fields.cards[k] && prev.fields.cards[k][f])).join('')}</div>
      </div></div>`; }).join('')}</div>`;
    } else if (s.key === 'feedback'){
      const prefRows = orderedKeys.map(k => row(`${base}/cards/${k}/preferred`, memberLabel(k), ver.fields.cards[k].preferred, prev && prev.fields.cards[k] && prev.fields.cards[k].preferred)).join('');
      body = `<div class="rows">
        <div class="row-f"><div class="k">${lbl('f.preferred')}</div><div class="v"><div class="rows sub">${prefRows}</div></div></div>
        ${row(`${base}/feedback/principle`, lbl('f.principle'), ver.fields.feedback.principle, prev && prev.fields.feedback.principle, true)}
        ${row(`${base}/feedback/rules`, lbl('f.rules'), ver.fields.feedback.rules, prev && prev.fields.feedback.rules)}
      </div>`;
    } else if (s.list){
      body = editable
        ? `<div class="rows">${s.fields.map((f,i) => `<div class="row-f"><div class="k">${CIRCLED[i]}</div><div class="v">${textField(`${base}/promises/${f}`, ver.fields.promises[f])}</div></div>`).join('')}</div>`
        : `<ul class="plist">${s.fields.map((f,i) => {
            const cur = ver.fields.promises[f], pv = prev && prev.fields.promises[f];
            const changed = showDiff && t(cur) !== t(pv);
            return `<li class="${changed ? 'changed' : ''}"><span class="n">${CIRCLED[i]}</span><span>${tv(cur)}${changed ? `<span class="prev">${lbl('prev')}: <s>${esc(t(pv) || lbl('empty'))}</s></span>` : ''}</span></li>`;
          }).join('')}</ul>`;
    } else {
      body = `<div class="rows">${s.fields.map(f => row(`${base}/${s.key}/${f}`, lbl('f.'+f), ver.fields[s.key][f], prev && prev.fields[s.key][f])).join('')}</div>`;
    }
    const cls = ['', 'mint', 'lav'][(s.n - 1) % 3];
    return `<section class="sec"><span class="ribbon ${cls}"><span class="num">${s.n}</span>${lbl('sec.'+s.key)}</span>${body}</section>`;
  }).join('');

  const pills = team.versions.map((v,i) => `<button class="vpill" data-action="ver" data-i="${i}" aria-pressed="${i===vi}" ${editable ? 'disabled' : ''}>${lbl('ver.short',{n:v.v})}<small>${fmtDate(v.date)}</small></button>`).join('<span class="arrow">→</span>');
  const nChanged = prev ? changedCount(ver.fields, prev.fields) : 0;
  const timeline = `<div class="timeline">
    <div class="row"><span class="lbl">✿ ${lbl('ver.history')}</span>${pills}
      ${prev && !editable ? `<label class="toggle"><input type="checkbox" id="difftoggle" data-action="diff" ${state.diff ? 'checked' : ''}>${lbl('diff.toggle')}</label>` : ''}</div>
    <div class="row"><span class="vnote"><b>${lbl('ver',{n:ver.v})} · ${fmtDate(ver.date)}</b> — ${esc(t(ver.note)) || lbl('ver.first')}</span>
      ${showDiff ? `<span class="diffsum">${nChanged ? lbl('diff.sum',{n:nChanged}) : lbl('diff.none')}</span>` : ''}</div>
  </div>`;

  let teamEdit = '';
  if (editable){
    const memberRows = team.members.map((m, i) => `<div class="member-edit">
        <div><label>${lbl('member.role')}</label>${textField(`teams/${ti}/members/${i}/role`, m.role, {short:true})}</div>
        <div><label>${lbl('member.name')}</label>${textField(`teams/${ti}/members/${i}/name`, m.name, {short:true})}</div>
        <button class="btn danger sm" data-action="delmember" data-key="${esc(m.key)}" title="${lbl('member.remove')}">✕</button>
      </div>`).join('');
    const pwField = isTeacher() ? `<div><label>${lbl('edit.teampw')}</label><input class="fi" type="text" id="pw-${esc(team.id)}" data-pw="${esc(team.id)}" value="${esc(state.pwEdits[team.id] ?? ((state.auth && state.auth.passwords && state.auth.passwords[team.id]) || ''))}" placeholder="${esc(lbl('edit.teampw.ph'))}" autocomplete="off"></div>` : '';
    teamEdit = `<div class="team-edit">
      <div><label>${lbl('edit.teamname')}</label>${textField(`teams/${ti}/name`, team.name, {short:true})}</div>
      ${pwField}
      ${isTeacher() ? `<div><label>${lbl('edit.teamid')}</label><input class="fi" type="text" value="${esc(team.id)}" readonly></div>` : ''}
    </div>
    <div class="members-edit"><label>${lbl('member')} (${team.members.length})</label>${memberRows}
      ${team.members.length < MAX_MEMBERS ? `<button class="btn sm" data-action="addmember">＋ ${lbl('member.add')}</button>` : ''}</div>
    <div class="edit-banner" style="margin-top:12px;border-radius:10px">✿ ${lbl('auto.hint')}</div>`;
  }
  const notMine = state.editing && !editable ? `<div class="edit-banner" style="margin-top:14px;border-radius:10px">★ ${lbl('edit.onlyown',{team:esc(teamName(myTeamId()))})}</div>` : '';

  const sign = `<section class="sec sign"><span class="ribbon">${lbl('sign.h')}</span>
    <p>${lbl('sign.text')}</p>
    <div class="line">
      <span><span class="k">${lbl('sign.date')}</span>${fmtDate(ver.date)}</span>
      <span class="signers"><span class="k">${lbl('sign.by')}</span>${team.members.map(m => `<span class="signer">${esc(t(m.name)) || '—'}${sealHtml(ver, m.key, editable)}</span>`).join('')}</span>
    </div>
  </section>`;

  return `<div class="page">${banner()}${banners()}
  <main class="wrap">
    <div class="team-head">
      <h1>${esc(t(team.name)) || lbl('newteam.name')}</h1>
      ${members(team)}
      ${notMine}
      ${teamEdit}
      ${timeline}
    </div>
    <div class="doc">${secs}${sign}${notesHtml(DATA.teams.find(x => x.id === team.id) || team)}</div>
    ${state.editing && isTeacher() ? `<div class="danger-zone"><button class="btn danger" data-action="delteam">${lbl('edit.delteam')}</button></div>` : ''}
    ${footer()}
  </main>
  ${editbar()}</div>`;
}

function notesHtml(team){
  const notes = (team.notes || []).slice().sort((a,b) => (b.date || '').localeCompare(a.date || '') || (b.at || '').localeCompare(a.at || ''));
  const canDel = !state.editing && state.auth && canEditTeam(team.id);
  const list = notes.length ? notes.map(n => {
    const m = n.by ? memberOf(team, n.by) : null;
    const who = m ? `<span class="role ${roleClass(m.role)}">${esc(t(m.role)) || lbl('member')}</span><b>${esc(t(m.name)) || '—'}</b>` : `<span class="role etc">${lbl('notes.by.none')}</span>`;
    return `<li class="note-item"><div class="note-meta"><span class="d">${fmtDate(n.date)}</span>${who}${canDel ? `<button class="x" data-action="note-del" data-id="${esc(n.id)}" title="${lbl('notes.del')}">✕</button>` : ''}</div><div class="note-body">${tv(n.text)}</div></li>`;
  }).join('') : `<li class="note-empty">${lbl('notes.empty')}</li>`;
  const d = state.noteDraft[team.id] || {};
  const form = state.editing
    ? `<div class="note-hint">✿ ${lbl('notes.editing')}</div>`
    : `<div class="note-form">
        <div class="note-form-top">
          <label>${lbl('notes.date')}<input class="fi" type="date" id="note-date" data-note="date" value="${esc(d.date || today())}"></label>
          <label>${lbl('notes.by')}<select class="fi" id="note-by" data-note="by"><option value="">${lbl('notes.by.none')}</option>${team.members.map(m => `<option value="${esc(m.key)}" ${d.by === m.key ? 'selected' : ''}>${esc(t(m.name)) || '—'}</option>`).join('')}</select></label>
        </div>
        <textarea class="fi" id="note-text" data-note="text" rows="3" placeholder="${esc(lbl('notes.ph'))}">${esc(d.text || '')}</textarea>
        <div class="note-form-bottom"><span class="note-hint">${state.auth && canEditTeam(team.id) ? '' : '✿ ' + lbl('notes.login')}</span><button class="btn primary" data-action="note-post">✎ ${lbl('notes.post')}</button></div>
      </div>`;
  return `<section class="sec notes" id="notes"><span class="ribbon mint">${lbl('notes.h')} <small>${lbl('notes.count',{n:notes.length})}</small></span>${form}<ul class="note-list">${list}</ul></section>`;
}
async function postNote(teamId){
  const team = DATA.teams.find(x => x.id === teamId); if (!team) return;
  const d = state.noteDraft[teamId] || {};
  const text = (d.text || '').trim();
  if (!text){ toast(lbl('notes.need')); const ta = document.getElementById('note-text'); if (ta) ta.focus(); return; }
  if (state.demo === null){ toast(lbl('loading')); return; }
  if (!state.auth){
    if (state.demo && !DEMO_PW) saveAuth({role:'teacher', password:'', passwords:{}});
    else { openLogin(() => postNote(teamId)); return; }
  }
  if (!canEditTeam(teamId)){ toast(lbl('notes.forbidden'), 5000); return; }
  const note = { id:'n' + Date.now().toString(36) + Math.random().toString(36).slice(2,6), date: d.date || today(), by: d.by || '', at: new Date().toISOString(),
    text: state.lang === 'ja' ? {ko:'', ja:text} : {ko:text, ja:'', auto:true} };
  const btn = document.querySelector('[data-action="note-post"]'); if (btn) btn.disabled = true;
  try {
    if (state.demo){ (team.notes || (team.notes = [])).push(note); }
    else {
      const res = await apiPost({action:'note', password: state.auth.password, teamId, note});
      if (!(res && res.ok && res.data)){
        if (res && res.error === 'wrong_password'){ saveAuth(null); toast(lbl('save.pw'), 6000); render(); return; }
        toast(res && res.error === 'forbidden' ? lbl('notes.forbidden') : lbl('notes.fail'), 5000); if (btn) btn.disabled = false; return;
      }
      applyRemote(res.data);
    }
    delete state.noteDraft[teamId];
    render(); toast(lbl('notes.ok'));
  } catch(e){ toast(lbl('notes.fail'), 5000); if (btn) btn.disabled = false; }
}
async function deleteNote(teamId, id){
  const team = DATA.teams.find(x => x.id === teamId); if (!team || !state.auth || !canEditTeam(teamId)) return;
  if (!await askConfirm(lbl('notes.del.confirm'))) return;
  try {
    if (state.demo){ team.notes = (team.notes || []).filter(n => n.id !== id); }
    else {
      const res = await apiPost({action:'note-del', password: state.auth.password, teamId, id});
      if (!(res && res.ok && res.data)){ toast(lbl('notes.fail'), 5000); return; }
      applyRemote(res.data);
    }
    render();
  } catch(e){ toast(lbl('notes.fail'), 5000); }
}
function sealHtml(ver, key, editable){
  const sig = ver.sig && ver.sig[key];
  if (sig) return `<span class="seal signed ${editable ? 'can' : ''}" ${editable ? `role="button" tabindex="0" data-action="signpad" data-key="${esc(key)}" title="${lbl('sign.pad')}"` : ''}><i>${lbl('seal')}</i><img src="${sig}" alt="${lbl('sign.h')}"></span>`;
  if (editable) return `<button class="seal can" data-action="signpad" data-key="${esc(key)}" title="${lbl('sign.tap')}">${lbl('seal')}</button>`;
  return `<span class="seal">${lbl('seal')}</span>`;
}
function openSignPad(team, key){
  const m = memberOf(team, key); const ver = latest(team);
  const existing = ver.sig && ver.sig[key];
  openModal(`<h3>✎ ${lbl('sign.pad')} · ${esc(t(m && m.name) || '')}</h3>
    <p style="margin:0;font-size:13px;color:var(--ink-2)">${lbl('sign.hint')}</p>
    <canvas id="pad" class="pad" width="720" height="280"></canvas>
    <div class="actions" style="justify-content:space-between">
      <span><button class="btn" data-action="pad-clear">${lbl('sign.clear')}</button>${existing ? ` <button class="btn danger" data-action="pad-remove">${lbl('sign.remove')}</button>` : ''}</span>
      <span><button class="btn" data-action="modal-close">${lbl('edit.cancel')}</button> <button class="btn primary" data-action="pad-save">${lbl('sign.save')}</button></span>
    </div>`);
  const c = document.getElementById('pad'); const ctx = c.getContext('2d');
  ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#D43A6E';
  let drawing = false, drew = false, last = null;
  const pos = e => { const r = c.getBoundingClientRect(); return {x:(e.clientX - r.left) * c.width / r.width, y:(e.clientY - r.top) * c.height / r.height}; };
  c.addEventListener('pointerdown', e => { drawing = true; last = pos(e); c.setPointerCapture(e.pointerId); ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(last.x + .1, last.y); ctx.stroke(); drew = true; });
  c.addEventListener('pointermove', e => { if (!drawing) return; const p = pos(e); ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); last = p; });
  const up = () => { drawing = false; };
  c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up); c.addEventListener('pointerleave', up);
  state.pad = {
    clear(){ ctx.clearRect(0,0,c.width,c.height); drew = false; },
    save(){
      if (!drew){ toast(lbl('sign.empty')); return; }
      const img = ctx.getImageData(0,0,c.width,c.height).data; let x0=c.width,y0=c.height,x1=0,y1=0;
      for (let y=0;y<c.height;y++) for (let x=0;x<c.width;x++){ if (img[(y*c.width+x)*4+3] > 10){ if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; } }
      const pad=10; x0=Math.max(0,x0-pad); y0=Math.max(0,y0-pad); x1=Math.min(c.width,x1+pad); y1=Math.min(c.height,y1+pad);
      const out = document.createElement('canvas'); const scale = Math.min(1, 240/(x1-x0)); out.width = Math.round((x1-x0)*scale); out.height = Math.round((y1-y0)*scale);
      out.getContext('2d').drawImage(c, x0, y0, x1-x0, y1-y0, 0, 0, out.width, out.height);
      if (!ver.sig) ver.sig = {}; ver.sig[key] = out.toDataURL('image/png');
      closeModal(); render(); updateCount();
    },
    remove(){ if (ver.sig) delete ver.sig[key]; closeModal(); render(); updateCount(); }
  };
}
function render(){
  const r = route();
  document.documentElement.lang = state.lang;
  if (r.page === 'team'){
    const team = data().teams.find(x => x.id === r.id);
    if (!team){ location.hash = '#/'; return; }
    $app.innerHTML = renderTeam(team);
  } else {
    $app.innerHTML = renderHome();
  }
}

/* ---------- modals / toast ---------- */
let toastTimer;
function toast(msg, ms){
  let el = document.getElementById('toast');
  if (!el){ el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, ms || 3200);
}
function openModal(html){
  closeModal();
  const ov = document.createElement('div'); ov.className = 'overlay'; ov.id = 'overlay';
  ov.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  ov.addEventListener('click', e => { if (e.target === ov) closeModal(); });
  document.body.appendChild(ov);
  const f = ov.querySelector('input,textarea,button'); if (f) f.focus();
}
function closeModal(){ const ov = document.getElementById('overlay'); if (ov) ov.remove(); if (state.confirmResolve){ const r = state.confirmResolve; state.confirmResolve = null; r(false); } }
function askConfirm(msg, yes, no){
  return new Promise(resolve => {
    openModal(`<h3>♡ ${lbl('confirm.h')}</h3><p style="margin:0;font-size:14px;line-height:1.7">${esc(msg)}</p>
      <div class="actions"><button class="btn" data-action="confirm-no">${no || lbl('confirm.cancel')}</button><button class="btn primary" data-action="confirm-yes">${yes || lbl('confirm.ok')}</button></div>`);
    state.confirmResolve = resolve;
    const b = document.querySelector('[data-action="confirm-yes"]'); if (b) b.focus();
  });
}
function settleConfirm(v){ const r = state.confirmResolve; state.confirmResolve = null; const ov = document.getElementById('overlay'); if (ov) ov.remove(); if (r) r(v); }

/* ---------- login ---------- */
function localLogin(pw){
  if (!DEMO_PW) return {ok:true, role:'teacher', passwords:{}};
  if (pw && pw === DEMO_PW.teacher) return {ok:true, role:'teacher', passwords: Object.fromEntries(Object.entries(DEMO_PW).filter(([k]) => k !== 'teacher'))};
  const id = Object.keys(DEMO_PW).find(k => k !== 'teacher' && DEMO_PW[k] && DEMO_PW[k] === pw);
  return id ? {ok:true, role:'team', teamId:id} : {ok:false, error:'wrong_password'};
}
function openLogin(after){
  openModal(`<h3>♡ ${lbl('login.h')}</h3><p style="margin:0;font-size:13px;color:var(--ink-2)">${lbl('login.d')}</p>
    <form id="loginform"><input class="fi" type="password" id="pw" autocomplete="current-password" style="font-size:18px;letter-spacing:.1em">
    <div id="loginerr" class="err" hidden></div>
    <div class="actions"><button type="button" class="btn" data-action="modal-close">${lbl('edit.cancel')}</button><button type="submit" class="btn primary" id="loginbtn">${lbl('login.go')}</button></div></form>`);
  document.getElementById('loginform').addEventListener('submit', async e => {
    e.preventDefault();
    const pw = document.getElementById('pw').value;
    const btn = document.getElementById('loginbtn'); btn.disabled = true;
    const err = document.getElementById('loginerr');
    try {
      const res = state.demo ? localLogin(pw) : await apiPost({action:'login', password: pw});
      if (res && res.ok){
        saveAuth({role: res.role, teamId: res.teamId || null, password: pw, passwords: res.passwords || null});
        closeModal();
        toast(res.role === 'teacher' ? lbl('login.ok.teacher') : lbl('login.ok.team',{team: teamName(res.teamId)}));
        if (typeof after === 'function') after(); else startEdit();
      } else { err.textContent = lbl('login.wrong'); err.hidden = false; btn.disabled = false; }
    } catch(ex){ err.textContent = lbl('login.fail'); err.hidden = false; btn.disabled = false; }
  });
}
function logout(){ saveAuth(null); state.pwEdits = {}; if (state.editing) cancelEdit(); else render(); }

/* ---------- editing ---------- */
function onEditClick(){
  if (state.demo === null){ toast(lbl('loading')); return; }
  if (state.demo && !DEMO_PW){ if (!state.auth) saveAuth({role:'teacher', password:'', passwords:{}}); startEdit(); return; }
  if (!state.auth){ openLogin(); return; }
  startEdit();
}
function startEdit(){
  state.draft = clone(DATA); state.editing = true;
  const mine = myTeamId();
  if (mine && route().id !== mine){ location.hash = '#/t/' + encodeURIComponent(mine); return; }
  render();
}
function cancelEdit(){ state.editing = false; state.draft = null; state.pwEdits = {}; state.saveNote = ''; render(); }
function updateCount(){ const el = document.getElementById('cnt'); if (el && state.draft) el.textContent = lbl('edit.changed',{n:changedTeams()}); }
function addTeam(){
  const id = 't' + Date.now().toString(36);
  const members = [
    {key:'m1', role:{ko:'디자이너', ja:'デザイナー'}, name:bl()},
    {key:'m2', role:{ko:'개발자', ja:'開発者'}, name:bl()},
    {key:'m3', role:{ko:'개발자', ja:'開発者'}, name:bl()}
  ];
  state.draft.teams.push({ id, name:bl(), members,
    versions:[{ v:1, date:today(), note:{ko:L.ko['ver.first'], ja:L.ja['ver.first']}, fields:emptyFields(members.map(m => m.key)) }] });
  location.hash = '#/t/' + encodeURIComponent(id);
}
async function deleteTeam(team){
  if (!await askConfirm(lbl('del.confirm',{name:t(team.name) || lbl('newteam.name')}))) return;
  state.draft.teams = state.draft.teams.filter(x => x.id !== team.id);
  state.navGuard = false; location.hash = '#/';
}
function addMember(team){
  if (team.members.length >= MAX_MEMBERS){ toast(lbl('member.max')); return; }
  let n = 1; while (team.members.some(m => m.key === 'm'+n) || latest(team).fields.cards['m'+n]) n++;
  const key = 'm'+n;
  team.members.push({key, role:{ko:'개발자', ja:'開発者'}, name:bl()});
  latest(team).fields.cards[key] = emptyCard();
  render(); updateCount();
}
async function delMember(team, key){
  if (team.members.length <= MIN_MEMBERS){ toast(lbl('member.min')); return; }
  const m = memberOf(team, key); if (!m) return;
  if (!await askConfirm(lbl('member.confirm',{name:t(m.name) || lbl('member')}))) return;
  team.members = team.members.filter(x => x.key !== key);
  delete latest(team).fields.cards[key];
  render(); updateCount();
}
function openSave(){
  const siteChanged = JSON.stringify(state.draft.site) !== JSON.stringify(DATA.site);
  const removed = DATA.teams.some(o => !state.draft.teams.find(x => x.id === o.id));
  const pwChanged = Object.keys(state.pwEdits).length > 0;
  if (!changedTeams() && !siteChanged && !removed && !pwChanged){ toast(lbl('save.nothing')); return; }
  doSave();
}
async function doSave(){
  const mode = state.saveMode || 'new';
  const note = state.saveNote || '';
  const date = today();
  const out = clone(state.draft);
  out.teams.forEach(team => {
    const orig = DATA.teams.find(x => x.id === team.id);
    if (!orig) return;
    const last = latest(team), origLast = latest(orig);
    if (JSON.stringify(last.fields) === JSON.stringify(origLast.fields)) return;
    if (mode === 'new'){
      const newSig = {}; const oldSig = origLast.sig || {};
      for (const k of Object.keys(last.sig || {})) if (last.sig[k] !== oldSig[k]) newSig[k] = last.sig[k];
      team.versions[team.versions.length - 1] = clone(origLast);
      const noteObj = state.lang === 'ja' ? {ko:'', ja:note.trim(), auto: !!note.trim()} : {ko:note.trim(), ja:'', auto: !!note.trim()};
      team.versions.push({ v: origLast.v + 1, date, note: noteObj, fields: last.fields, sig: newSig });
    }
  });
  markTranslations(out, DATA);
  if (state.demo){
    applyRemote(out);
    if (DEMO_PW && isTeacher()) Object.assign(DEMO_PW, state.pwEdits);
    if (isTeacher() && state.auth){ state.auth.passwords = Object.assign({}, state.auth.passwords || {}, state.pwEdits); saveAuth(state.auth); }
    state.editing = false; state.draft = null; state.pwEdits = {}; state.saveNote = ''; render();
    toast(lbl('save.demo'), 5000); return;
  }
  const btn = document.querySelector('[data-action="save"]'); if (btn) btn.disabled = true;
  try {
    let body;
    if (isTeacher()) body = {action:'save', password: state.auth.password, data: out, passwords: state.pwEdits};
    else { const mine = out.teams.find(x => x.id === myTeamId()); body = {action:'save', password: state.auth.password, team: mine}; }
    const res = await apiPost(body);
    if (res && res.ok && res.data){
      applyRemote(res.data);
      if (isTeacher() && state.auth && Object.keys(state.pwEdits).length){ state.auth.passwords = Object.assign({}, state.auth.passwords || {}, state.pwEdits); saveAuth(state.auth); }
      state.editing = false; state.draft = null; state.pwEdits = {}; state.saveNote = ''; render();
      toast(lbl('save.ok'));
    } else {
      const err = res && res.error;
      if (err === 'wrong_password'){ toast(lbl('save.pw'), 6000); saveAuth(null); cancelEdit(); }
      else if (err === 'forbidden') toast(lbl('save.forbidden'), 6000);
      else toast(lbl('save.fail'), 5000);
      if (btn) btn.disabled = false;
    }
  } catch(ex){ toast(lbl('save.fail'), 5000); if (btn) btn.disabled = false; }
}
function showJson(){
  const txt = JSON.stringify(state.draft || DATA, null, 2);
  openModal(`<h3>${lbl('json.h')}</h3><p style="margin:0;font-size:13px;color:var(--ink-2)">${lbl('json.d')}</p>
    <textarea class="fi json" id="jsonout" readonly>${esc(txt)}</textarea>
    <div class="actions"><button class="btn primary" data-action="modal-close">${lbl('close')}</button></div>`);
  const ta = document.getElementById('jsonout'); ta.focus(); ta.select();
  try { navigator.clipboard && navigator.clipboard.writeText(txt); } catch(e){}
}

/* ---------- events ---------- */
const hasUnsaved = () => state.editing && (changedTeams() > 0 || JSON.stringify(state.draft.site) !== JSON.stringify(DATA.site) || DATA.teams.length !== state.draft.teams.length || Object.keys(state.pwEdits).length > 0);
function leaveEditing(){ state.editing = false; state.draft = null; state.pwEdits = {}; state.saveNote = ''; }
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (link && state.editing && !link.dataset.action){
    const target = link.getAttribute('href');
    if (target !== location.hash && !(target === '#/' && location.hash === '')){
      e.preventDefault();
      goAfterConfirm(target);
      return;
    }
  }
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action;
  const curTeam = () => state.draft && state.draft.teams.find(x => x.id === route().id);
  if (a === 'lang'){ state.lang = el.dataset.lang; try { localStorage.setItem('twa-lang', state.lang); } catch(err){} render(); }
  else if (a === 'goto'){ e.preventDefault();
    const scrollTo = () => { const s = document.getElementById(el.dataset.target); if (s) s.scrollIntoView({behavior:'smooth', block:'start'}); };
    if (state.editing && route().page !== 'home'){ goAfterConfirm('#/', () => setTimeout(scrollTo, 60)); return; }
    if (route().page !== 'home'){ location.hash = '#/'; }
    setTimeout(() => { const s = document.getElementById(el.dataset.target); if (s) s.scrollIntoView({behavior:'smooth', block:'start'}); }, 30); }
  else if (a === 'edit') onEditClick();
  else if (a === 'logout') logout();
  else if (a === 'cancel') cancelEdit();
  else if (a === 'save') openSave();
  else if (a === 'save-go') doSave();
  else if (a === 'json') showJson();
  else if (a === 'modal-close') closeModal();
  else if (a === 'addteam') addTeam();
  else if (a === 'delteam'){ const team = curTeam(); if (team) deleteTeam(team); }
  else if (a === 'chan-addrow' || a === 'chan-del'){
    let arr;
    if (route().page === 'home'){ if (!state.draft || !isTeacher()) return; arr = state.draft.site.channels || (state.draft.site.channels = []); }
    else { const team = curTeam(); if (!team || !canEditTeam(team.id)) return; arr = latest(team).fields.comm.channels || (latest(team).fields.comm.channels = []); }
    if (a === 'chan-del') arr.splice(+el.dataset.i, 1); else arr.push({ko:'', ja:'', url:''});
    render(); updateCount();
    if (a === 'chan-addrow'){ const inputs = document.querySelectorAll('[data-chan$="/name"]'); const last = inputs[inputs.length-1]; if (last) last.focus(); }
  }
  else if (a === 'note-post') postNote(route().id);
  else if (a === 'note-del') deleteNote(route().id, el.dataset.id);
  else if (a === 'confirm-yes') settleConfirm(true);
  else if (a === 'confirm-no') settleConfirm(false);
  else if (a === 'addmember'){ const team = curTeam(); if (team) addMember(team); }
  else if (a === 'delmember'){ const team = curTeam(); if (team) delMember(team, el.dataset.key); }
  else if (a === 'signpad'){ const team = curTeam(); if (team && canEditTeam(team.id)) openSignPad(team, el.dataset.key); }
  else if (a === 'pad-clear'){ state.pad && state.pad.clear(); }
  else if (a === 'pad-save'){ state.pad && state.pad.save(); }
  else if (a === 'pad-remove'){ state.pad && state.pad.remove(); }
  else if (a === 'ver'){ const r = route(); state.ver[r.id] = +el.dataset.i; render(); }
});
document.addEventListener('input', e => {
  const n = e.target && e.target.dataset && e.target.dataset.note;
  if (n){ const id = route().id; if (id){ (state.noteDraft[id] || (state.noteDraft[id] = {}))[n] = e.target.value; } return; }
  const el = e.target; if (!el.dataset || !state.draft) return;
  if (el.dataset.chan){
    let arr;
    if (route().page === 'home'){ if (!isTeacher()) return; arr = state.draft.site.channels || []; }
    else { const team = state.draft.teams.find(x => x.id === route().id); if (!team) return; arr = latest(team).fields.comm.channels; }
    const [i, f] = el.dataset.chan.split('/'); const c = arr[+i]; if (!c) return;
    if (f === 'url') c.url = el.value;
    else {
      c[state.lang] = el.value;
      const pre = CHANNELS.find(x => x.ko === el.value.trim() || x.ja === el.value.trim());
      if (pre){ c.ko = pre.ko; c.ja = pre.ja; delete c.auto; }
      else if (state.lang === 'ja') delete c.auto;
    }
    updateCount(); return;
  }
  if (el.dataset.save === 'note'){ state.saveNote = el.value; return; }
  if (el.dataset.save === 'mode'){ state.saveMode = el.value; const n = document.getElementById('savenote'); if (n) n.hidden = el.value !== 'new'; return; }
  if (el.dataset.pw){ state.pwEdits[el.dataset.pw] = el.value; return; }
  if (!el.dataset.path) return;
  if (el.dataset.type === 'bool'){ setPath(state.draft, el.dataset.path, !!el.checked); el.closest('.check').classList.toggle('on', el.checked); }
  else {
    setPath(state.draft, el.dataset.path, el.value);
    if (el.dataset.path.endsWith('/ja')){ const parent = getPath(state.draft, el.dataset.path.slice(0, -3)); if (parent) delete parent.auto; }
  }
  updateCount();
});
document.addEventListener('change', e => { if (e.target.dataset && e.target.dataset.action === 'diff'){ state.diff = e.target.checked; render(); } });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
let lastHash = location.hash;
async function goAfterConfirm(target, after){
  if (hasUnsaved()){ const ok = await askConfirm(lbl('leave.confirm'), lbl('confirm.yes'), lbl('confirm.no')); if (!ok) return; }
  leaveEditing();
  if (target === location.hash || (target === '#/' && location.hash === '')){ render(); window.scrollTo({top:0}); }
  else location.hash = target;
  if (after) after();
}
window.addEventListener('hashchange', () => {
  if (state.editing && state.navGuard !== false){
    const mine = myTeamId();
    const stillMine = mine && route().id === mine;
    const isNewTeamPage = state.draft && state.draft.teams.find(x => x.id === route().id) && !DATA.teams.find(x => x.id === route().id);
    if (!stillMine && !isNewTeamPage){
      const target = location.hash;
      state.navGuard = false; location.hash = lastHash;   // stay, then ask
      goAfterConfirm(target);
      return;
    }
  }
  state.navGuard = true; lastHash = location.hash;
  render(); window.scrollTo({top:0});
});
window.addEventListener('beforeunload', e => { if (hasUnsaved()){ e.preventDefault(); e.returnValue = ''; } });

render();
loadRemote();
