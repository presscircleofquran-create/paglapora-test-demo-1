import { getOnb, SUBJECTS } from './onboard.js';
import { getLang, num } from './i18n.js';
import { play } from './sfx.js';
import { coverFlat } from './books.js';
import { navHtml, stHtml, goNav, LS, UNITS, CNT, ST, TOT, full } from './learn.js';
import { loadUser } from './supabase.js';
import { standing } from './board.js';
import { first, ink, PATS, SZ, DEF, patSvg, bnAttrs, getProf } from './pats.js';
export { first, ink, PATS, SZ, DEF, patSvg, bnAttrs, getProf };

// প্রোফাইল পাতা: রঙিন ব্যানার (নামের প্রথম অক্ষর), নাম, যোগদান, বিষয়, পরিসংখ্যান, সেশনের হিসাব
const $ = (s, r = document) => r.querySelector(s), IX = { bn: 0, en: 1, ar: 2 }, L = (a) => a[IX[getLang()]];
const J = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
const T = {
  hd: ['প্রোফাইল', 'Profile', 'الملف الشخصي'], st: ['পরিসংখ্যান', 'Statistics', 'الإحصائيات'],
  streak: ['দিনের ধারাবাহিকতা', 'Day streak', 'أيام متتالية'], pts: ['মোট পয়েন্ট', 'Total points', 'مجموع النقاط'],
  lg: ['ব্রোঞ্জ', 'Bronze', 'برونزي'], lgl: ['বর্তমান লিগ', 'Current league', 'الدوري الحالي'], wk: ['সপ্তাহ ', 'Week ', 'أسبوع '],
  top: ['বার সেরা ৩-এ স্থান পেয়েছে', 'Times in the top 3', 'مرات في المراكز الثلاثة الأولى'],
  guest: ['অতিথি', 'Guest', 'ضيف'], set: ['সেটিংস', 'Settings', 'الإعدادات'], ed: ['প্রোফাইল সাজান', 'Customise profile', 'تخصيص الملف'],
  bg: ['ব্যাকগ্রাউন্ডের রং', 'Background colour', 'لون الخلفية'], ch: ['অক্ষর', 'Letter', 'الحرف'], sv: ['সংরক্ষণ করুন', 'Save', 'حفظ'], cn: ['বাতিল', 'Cancel', 'إلغاء'],
  ses: ['সেশন', 'Sessions', 'الجلسات'], sesd: ['সেশন সম্পন্ন', 'sessions completed', 'جلسة مكتملة'], editA: ['প্রোফাইল সাজান', 'Customise profile', 'تخصيص الملف']
};
const MON = [
  ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
];
const joinedT = (d) => { const m = MON[IX[getLang()]][d.getMonth()], y = num(d.getFullYear()); return getLang() === 'bn' ? m + ' ' + y + '-এ যোগ দিয়েছে' : getLang() === 'ar' ? 'انضم في ' + m + ' ' + y : 'Joined ' + m + ' ' + y; };
// রঙের প্যালেট (ব্যবহারকারীর দেওয়া ছবি অনুযায়ী): প্রতি পরিবারে গাঢ়, মাঝারি, হালকা
export const PAL = [['#7AC70C', '#8EE000', '#BFF199'], ['#1CB0F6', '#14D4F4', '#BCE9FF'], ['#D33131', '#E53B3B', '#FF9797'], ['#FFB020', '#FFC300', '#FFF277'], ['#FA811B', '#FF9400', '#FFCF7A'], ['#8549BA', '#A560EB', '#CA94FF'], ['#864E1B', '#A86425', '#DEAC5F'], ['#4C4C4C', '#777777', '#AFAFAF'], ['#CFCFCF', '#DDDDDD', '#F0F0F0'], ['#FFFFFF']];
const IC = {
  flame: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2.500C17 8 24.500 11.500 24.500 20A8.500 8.500 0 0 1 7.500 20C7.500 15.500 10 13 11.500 10.500C12.500 12.500 13 13.500 14 14C14.500 9.500 14.500 6 16 2.500Z" fill="#ff9600"/><path d="M16 17C17.500 19 20 20 20 23A4 4 0 0 1 12 23C12 20.500 14.500 19.500 16 17Z" fill="#ffc800"/></svg>',
  bolt: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M18.500 2L7 18H14.500L12.500 30L25 13H17.500Z" fill="#ffc800" stroke="#ffc800" stroke-width="2" stroke-linejoin="round"/></svg>',
  league: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 5.500Q5 4 6.500 4H25.500Q27 4 27 5.500V16Q27 26 16 29Q5 26 5 16Z" fill="#e8a870"/><path d="M12 22C12 17 15.500 12.500 21 10.500C20.500 15.500 17.500 20.500 12 22Z" fill="#c4783d"/><path d="M11 23.500L17 17" stroke="#c4783d" stroke-width="1.600" stroke-linecap="round"/></svg>',
  medal: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M10 3H15L16 11H10Z" fill="#5d6d77"/><path d="M22 3H17L16 11H22Z" fill="#46545c"/><circle cx="16" cy="20" r="9" fill="#4a5963"/><circle cx="16" cy="20" r="5.500" fill="#5d6d77"/></svg>',
  pen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.500 20.500L4.600 15.600L8.400 19.400Z" fill="currentColor"/><path d="M6 13.900L15.300 4.600L19.400 8.700L10.100 18Z" fill="currentColor"/><path d="M16.700 3.200Q18 1.900 19.300 3.200L20.800 4.700Q22.100 6 20.800 7.300L20.300 7.800L16.200 3.700Z" fill="currentColor"/></svg>',
  gear: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#b5c2ca" fill-rule="evenodd" d="M13.500 3H18.500L19.200 6.600Q20.600 7.100 21.800 7.900L25.200 6.500L27.700 10.800L24.800 13.100Q25 14.500 24.800 15.900L27.700 18.200L25.200 22.500L21.800 21.100Q20.600 21.900 19.200 22.400L18.500 26H13.500L12.800 22.400Q11.400 21.900 10.200 21.100L6.800 22.500L4.300 18.200L7.200 15.900Q7 14.500 7.200 13.100L4.300 10.800L6.800 6.500L10.200 7.900Q11.400 7.100 12.800 6.600ZM16 10.500A4 4 0 1 0 16 18.500A4 4 0 1 0 16 10.500Z" transform="translate(0 1.500)"/></svg>'
};
const acct = () => { try { return JSON.parse(localStorage.getItem('pp_last')) || {}; } catch (e) { return {}; } };
let prof, who = { name: '', email: '', joined: null };

const subjTile = () => { let sid = ''; try { sid = localStorage.getItem('pp_subj') || (getOnb() || {}).subject || ''; } catch (e) {} const sj = SUBJECTS.find((x) => x.id === sid) || SUBJECTS.find((x) => x.id === 'bangla1') || SUBJECTS[0]; return `<span class="pf-sj" title="${L(sj.n)}" aria-label="${L(sj.n)}">${coverFlat(sj)}</span>`; };
const sessions = (np) => {
  const done = Array.from({ length: TOT }, (_, g) => full(np, g)).filter(Boolean).length;
  const rows = UNITS.map((u, ui) => { const d = Array.from({ length: CNT[ui] }, (_, k) => full(np, ST[ui] + k)).filter(Boolean).length; return `<li><i class="dt" style="background:${u.c}"></i><em class="t">${L(u.t)}</em><b>${num(d)}/${num(CNT[ui])}</b><span class="mb"><i style="width:${(d / CNT[ui] * 100).toFixed(1)}%;background:${u.c}"></i></span></li>`; }).join('');
  return `<h3 class="t">${L(T.ses)}</h3><div class="pf-big"><b>${num(done)}</b><span>/ ${num(TOT)}</span></div><div class="pf-lab t">${L(T.sesd)}</div><div class="pf-bar"><i style="width:${(done / TOT * 100).toFixed(1)}%"></i></div><ul class="pf-ul">${rows}</ul>`;
};

export function showProfile() {
  const root = $('#v-profile'), a = acct();
  who.name = who.name || a.name || ''; who.email = who.email || a.email || '';
  if (!who.joined) { let j = 0; try { j = +localStorage.getItem('pp_joined') || 0; if (!j) { j = Date.now(); localStorage.setItem('pp_joined', String(j)); } } catch (e) { j = Date.now(); } who.joined = new Date(j); }
  const dispName = () => who.name || L(T.guest);
  prof = getProf();
  const letter = () => prof.ch || first(dispName());
  const np = J('pp_np', {}), xp = LS('pp_xp', 0), streak = LS('pp_streak', 0), top3 = LS('pp_top3', 0);
  const handle = () => (who.email ? who.email.split('@')[0] : '');
  const draw = () => {
    root.innerHTML = navHtml('me') + stHtml('rc') + `<div class="pf-side rc" aria-label="${L(T.ses)}">${sessions(np)}</div><div class="ln-scroll pf" id="ln-sc"><div class="pf-wrap">
<header class="pf-top"><span class="pf-tt t">${L(T.hd)}</span><button type="button" class="pf-gr" data-set aria-label="${L(T.set)}">${IC.gear}</button></header>
<main class="pf-main">
<div class="pf-bn" id="pf-bn" style="${bnAttrs(prof)}">${patSvg(prof.pt)}<span class="pf-lt">${letter()}</span><button type="button" class="pf-pn" id="pf-pn" aria-label="${L(T.editA)}">${IC.pen}</button></div>
<div class="pf-info"><div class="pf-nm"><h1 class="t">${dispName()}</h1>${handle() ? `<p class="pf-us">${handle()}</p>` : ''}<p class="pf-jn t">${joinedT(who.joined)}</p></div><div class="pf-sjs">${subjTile()}</div></div>
<hr class="pf-hr">
<h2 class="pf-h2 t">${L(T.st)}</h2>
<div class="pf-grid">
<div class="pf-cd"><span class="pf-ic">${IC.flame}</span><div><b>${num(streak)}</b><p class="t">${L(T.streak)}</p></div></div>
<div class="pf-cd"><span class="pf-ic">${IC.bolt}</span><div><b>${num(xp)}</b><p class="t">${L(T.pts)}</p></div></div>
<div class="pf-cd pf-lgc"><span class="pf-ic">${IC.league}</span><div><b class="lgn t">${standing().name}</b><p class="t">${L(T.lgl)}</p></div></div>
<div class="pf-cd${top3 ? '' : ' dim'}"><span class="pf-ic">${IC.medal}</span><div><b>${num(top3)}</b><p class="t">${L(T.top)}</p></div></div>
</div>
<section class="pf-side in" aria-label="${L(T.ses)}">${sessions(np)}</section>
</main></div></div>`;
  };
  draw();
  root.onclick = (e) => {
    const nv = e.target.closest('[data-nv]'); if (nv) { goNav(nv.dataset.nv); return; }
    if (e.target.closest('[data-set]')) { location.hash = '#/settings'; return; }
    if (e.target.closest('#pf-pn')) { play('press', .5); location.hash = '#/pedit'; }
  };
  loadUser().then((u) => { if (!u) return; const m = u.user_metadata || {}, nm = m.name || m.full_name || ''; let ch = false; if (nm && nm !== who.name) { who.name = nm; ch = true; } if (u.email && u.email !== who.email) { who.email = u.email; ch = true; } if (u.created_at) { const d = new Date(u.created_at); if (!isNaN(d)) { who.joined = d; ch = true; } } if (ch && location.hash === '#/profile') draw(); }).catch(() => {});
}
