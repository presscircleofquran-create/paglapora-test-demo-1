import { getLang, num } from './i18n.js';
import { navHtml, stHtml, goNav, LS, totalXp } from './learn.js';
import { first, patSvg, bnAttrs, getProf } from './pats.js';
import { SUBJECTS } from './onboard.js';
import { coverRot } from './books.js';
import { curSubject } from './subj.js';
import { LG_SVG, LG_LOCK, LG_LOCK_LIGHT, MEDALS, STATUS, STATUS_EMPTY } from './lg-assets.js';

// লিডারবোর্ড: ৯টি লিগ, মোট XP থেকে লিগ ঠিক হয় (সাপ্তাহিক নয়)
const $ = (s, r = document) => r.querySelector(s), IX = { bn: 0, en: 1, ar: 2 }, L = (a) => a[IX[getLang()]];
export const LEAGUES = [
  { n: ['ব্রোঞ্জ', 'Bronze', 'البرونز'] }, { n: ['সিলভার', 'Silver', 'الفضة'] }, { n: ['গোল্ড', 'Gold', 'الذهب'] },
  { n: ['স্যাফায়ার', 'Sapphire', 'الياقوت الأزرق'] }, { n: ['রুবি', 'Ruby', 'الياقوت الأحمر'] }, { n: ['পান্না', 'Emerald', 'الزمرد'] },
  { n: ['অ্যামেথিস্ট', 'Amethyst', 'الجمشت'] }, { n: ['মুক্তা', 'Pearl', 'اللؤلؤ'] }, { n: ['ডায়মন্ড', 'Diamond', 'الألماس'] }
];
let uq = 0; // প্রতিবার আলাদা id, যাতে একই SVG একাধিক জায়গায় থাকলেও না ভাঙে
const U = (s) => { const ids = [...s.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]); if (!ids.length) return s; const k = 'u' + (++uq) + '_'; let o = s; ids.forEach((i) => { o = o.split('id="' + i + '"').join('id="' + k + i + '"').split('url(#' + i + ')').join('url(#' + k + i + ')').split('href="#' + i + '"').join('href="#' + k + i + '"'); }); return o; };
export const leagueSvg = (i, st) => U(st === 'lock' ? LG_LOCK : LG_SVG[i]);
// প্রয়োজনীয় XP = মোট XP × (ধাপ ÷ ৮)²; ধাপ ১..৮ (ব্রোঞ্জের জন্য ০)
export const leagueReqs = () => { const t = totalXp(); return [0, ...Array.from({ length: 8 }, (_, k) => Math.ceil(t * Math.pow((k + 1) / 8, 2)))]; };
export function leagueInfo(xp) {
  const rq = leagueReqs(); let li = 0; for (let s = 1; s <= 8; s++) if (xp >= rq[s]) li = s;
  return { li, lo: rq[li], hi: li < 8 ? rq[li + 1] : null, need: li < 8 ? Math.max(0, rq[li + 1] - xp) : 0, total: totalXp() };
}
export const myXp = () => LS('pp_xp', 0);
export const getStatus = () => { try { return localStorage.getItem('pp_status') || ''; } catch (e) { return ''; } };
const setStatus = (v) => { try { v ? localStorage.setItem('pp_status', v) : localStorage.removeItem('pp_status'); } catch (e) {} };

// আমার আঁকা বাড়তি স্ট্যাটাস আইকন (মোট ১৩টি = দেওয়া ৭টি + ৫টি + এখনকার বইয়ের ছবি)
const X = (b) => `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">${b}</svg>`;
const EXTRA = [
  { id: 'h100', svg: X('<text x="24" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-size="21" font-weight="900" fill="#ff4b4b">100</text><path d="M8 36h32M12 41h24" stroke="#ff4b4b" stroke-width="3" stroke-linecap="round" fill="none"/>') },
  { id: 'heart', svg: X('<path d="M24 41C10 31 6 24 6 17.5 6 12 10 8.5 14.6 8.5c3.8 0 7.2 2.3 9.4 6 2.2-3.7 5.6-6 9.4-6C38 8.5 42 12 42 17.5 42 24 38 31 24 41z" fill="#ff4b4b"/><path d="M13 15c1.2-1.6 3-2.3 4.6-1.9" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".75"/>') },
  { id: 'star', svg: X('<path d="M24 5l5.6 11.6 12.7 1.7-9.3 8.8 2.3 12.6L24 33.6 12.7 39.7 15 27.1l-9.3-8.8 12.7-1.7z" fill="#ffc800" stroke="#e5a900" stroke-width="2" stroke-linejoin="round"/><path d="M19 15l5-7" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>') },
  { id: 'bolt', svg: X('<path d="M27 4L10 27h11l-3 17 19-25H26z" fill="#ffc800" stroke="#e5a900" stroke-width="2" stroke-linejoin="round"/>') },
  { id: 'flame', svg: X('<path d="M24 5c2 8 11 12 11 24a11 11 0 0 1-22 0c0-5 3-8 5-11 .5 4 2.5 5 4 5-2-6-1-12 2-18z" fill="#ff9600"/><path d="M24 24c1.5 3 5 5 5 9a5 5 0 0 1-10 0c0-3 3-4 5-9z" fill="#ffc800"/>') },
  { id: 'crown', svg: X('<path d="M7 36L5 14l11 9 8-14 8 14 11-9-2 22z" fill="#ffc800" stroke="#e5a900" stroke-width="2" stroke-linejoin="round"/><rect x="7" y="37" width="34" height="5" rx="2" fill="#e5a900"/><circle cx="24" cy="30" r="2.6" fill="#ff4b4b"/>') },
  { id: 'rainbow', svg: X('<g fill="none" stroke-width="4.5" stroke-linecap="round"><path d="M6 36a18 18 0 0 1 36 0" stroke="#ff4b4b"/><path d="M11 36a13 13 0 0 1 26 0" stroke="#ffc800"/><path d="M16 36a8 8 0 0 1 16 0" stroke="#1cb0f6"/></g>') },
  { id: 'smile', svg: X('<circle cx="24" cy="24" r="18" fill="#ffc800" stroke="#e5a900" stroke-width="2"/><circle cx="17.5" cy="20" r="2.6" fill="#7a4b00"/><circle cx="30.5" cy="20" r="2.6" fill="#7a4b00"/><path d="M14.5 28c2.5 6 16.5 6 19 0" stroke="#7a4b00" stroke-width="3" stroke-linecap="round" fill="none"/>') },
  { id: 'moon', svg: X('<path d="M31 6a18 18 0 1 0 11 25A14 14 0 0 1 31 6z" fill="#ffc800" stroke="#e5a900" stroke-width="2" stroke-linejoin="round"/><circle cx="36" cy="12" r="2" fill="#ffc800"/>') },
  { id: 'gem', svg: X('<path d="M24 5l13 7v16L24 43 11 28V12z" fill="#1cb0f6" stroke="#1899d6" stroke-width="2" stroke-linejoin="round"/><path d="M24 5v38M11 12l13 8 13-8" stroke="#fff" stroke-width="2" opacity=".55" fill="none"/>') }
];
// স্ট্যাটাস নেই: নীল বাবলে হাসিমুখ + প্লাস (ছোট পর্দায় এতে চাপলে স্ট্যাটাস শিট খোলে)
const ADD_SVG = X('<circle cx="21" cy="27" r="14.5" fill="none" stroke="#fff" stroke-width="4"/><circle cx="16.5" cy="24.5" r="2.1" fill="#fff"/><circle cx="25.5" cy="24.5" r="2.1" fill="#fff"/><path d="M14.5 31c2.4 4 8.6 4 11 0" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M38 5v13M31.5 11.5h13" stroke="#fff" stroke-width="4" stroke-linecap="round"/>');
const ALL = () => [...STATUS, ...EXTRA, { id: 'book' }];
const stSvg = (id) => { if (id === 'book') { const sj = SUBJECTS.find((x) => x.id === curSubject()) || SUBJECTS[0]; return coverRot(sj); } const x = ALL().find((s) => s.id === id); return x ? U(x.svg) : ''; };
export const statusBubble = (cls = '') => { const id = getStatus(); return id ? `<span class="bd-sb ${cls}">${stSvg(id)}</span>` : ''; };
const T = {
  t: ['লিডারবোর্ড', 'Leaderboard', 'لوحة المتصدرين'], lg: ['লিগ', 'League', 'دوري'], pt: ['পয়েন্ট', 'XP', 'نقطة'],
  nxt: ['পরবর্তী লিগ: %n', 'Next league: %n', 'الدوري التالي: %n'], left: ['আর %n পয়েন্ট বাকি', '%n XP to go', 'تبقى %n نقطة'], top: ['আপনি সর্বোচ্চ লিগে আছেন', 'You are in the top league', 'أنت في أعلى دوري'],
  guest: ['শিক্ষার্থী', 'Learner', 'متعلم'], yr: ['আপনার অবস্থান', 'Your position', 'ترتيبك'], rk: ['র‌্যাংক', 'Rank', 'المركز'],
  ss: ['স্ট্যাটাস সিলেক্ট করুন', 'Select a status', 'اختر حالة'], rm: ['সরিয়ে ফেলুন', 'Remove', 'إزالة'], done: ['শেষ', 'Done', 'تم'], clr: ['স্ট্যাটাস ক্লিয়ার করুন', 'Clear status', 'مسح الحالة'],
  note: ['এই তালিকার বাকি সদস্যরা পরীক্ষামূলক, আসল ব্যবহারকারী পরে যোগ হবে।', 'The other members here are placeholders until real users join.', 'بقية الأعضاء هنا تجريبيون حتى ينضم المستخدمون الحقيقيون.']
};
const NAMES = ['Rahim', 'Nusrat J.', 'Tanvir', 'Sadia Islam', 'Mehedi H.', 'Farhana', 'Imran', 'Sumaiya', 'Rafi Ahmed', 'Jannat', 'Hasan', 'Mim Akter', 'Siam', 'Tamanna', 'Ayesha', 'Omar F.', 'Zayed', 'Maryam', 'Yusuf', 'Safiya', 'Bilal', 'Hafsa', 'Anas', 'Khadija', 'Zubair', 'Ruqayyah', 'Hamza', 'Aisha R.', 'Talha', 'Rubaiya', 'Nabil', 'Samiha', 'Fahim', 'Labiba'];
const COL = ['#58cc02', '#1cb0f6', '#ff9600', '#ce82ff', '#ff4b4b', '#00cd9c', '#ffc800', '#e04fb4', '#2b70c9'];
const rnd = (s) => () => (s = (s * 16807) % 2147483647) / 2147483647;
const myName = () => { let nm = ''; try { const a = JSON.parse(localStorage.getItem('pp_last')); nm = (a && a.name) || ''; } catch (e) {} return nm || localStorage.getItem('pp_uname') || L(T.guest); };
// একই লিগের সদস্য: XP ওই লিগের সীমার ভেতরে (অন্যরা পরীক্ষামূলক)
function build(inf, xp, me) {
  const r = rnd(inf.li * 977 + 31 + [...curSubject()].reduce((a, c) => a + c.charCodeAt(0), 0)), names = NAMES.slice().sort(() => r() - .5), lo = inf.lo, hi = inf.hi == null ? Math.ceil(inf.total * 1.12) : inf.hi, span = Math.max(1, hi - lo);
  const rows = Array.from({ length: 29 }, (_, i) => ({ nm: names[i % names.length], xp: lo + Math.floor(span * Math.pow(r(), 1.4)), c: COL[Math.floor(r() * COL.length)], st: r() < .22 ? STATUS[Math.floor(r() * STATUS.length)].id : '' }));
  rows.push({ nm: me, xp, me: true }); rows.sort((a, b) => b.xp - a.xp || (a.me ? -1 : 1)); return rows;
}
export function standing() {
  const xp = myXp(), inf = leagueInfo(xp), rows = build(inf, xp, myName());
  return { li: inf.li, xp, rank: rows.findIndex((x) => x.me) + 1, name: L(LEAGUES[inf.li].n), need: inf.need };
}
// স্ট্যাটাস বক্স: আবতারের গায়ে বাবল (খালি হলে হাসিমুখ)
function statusBox(p, nm, cur, pop) {
  const ch = (p.ch || first(nm)).replace(/[<>&]/g, '');
  return `<section class="ch-bx sb-bx"><div class="sb-hd"><h2 class="t">${L(T.ss)}</h2>${cur ? `<button type="button" class="sb-rm t" data-sbrm>${L(T.rm)}</button>` : ''}</div><div class="sb-av"><span class="bd-aw big"><span class="bd-av" style="${bnAttrs(p)}">${patSvg(p.pt)}<b>${ch}</b></span><span class="bd-sb${cur ? '' : ' e'}${pop ? ' pop' : ''}">${cur ? stSvg(cur) : U(STATUS_EMPTY)}</span><i class="bd-on"></i></span></div><div class="sb-gr">${ALL().map((s) => `<button type="button" class="sb-t${s.id === cur ? ' on' : ''}" data-sb="${s.id}">${stSvg(s.id)}</button>`).join('')}</div></section>`;
}
// ছোট পর্দা: নিচ থেকে উঠে আসা স্ট্যাটাস শিট (শেষ = সংরক্ষণ, ক্লিয়ার = মুছে ফেলা, বাইরে চাপলে বাতিল)
let pend = '';
function sheetPn(p, nm, sel, pop) {
  const ch = (p.ch || first(nm)).replace(/[<>&]/g, '');
  return `<h2 class="t">${L(T.ss)}</h2><div class="sb-av"><span class="bd-aw big"><span class="bd-av" style="${bnAttrs(p)}">${patSvg(p.pt)}<b>${ch}</b></span><span class="bd-sb${sel ? '' : ' e'}${pop ? ' pop' : ''}">${sel ? stSvg(sel) : U(STATUS_EMPTY)}</span><i class="bd-on"></i></span></div><div class="sb-gr">${ALL().map((s) => `<button type="button" class="sb-t${s.id === sel ? ' on' : ''}" data-sp="${s.id}">${stSvg(s.id)}</button>`).join('')}</div><button type="button" class="btn btn-primary sb-done t" data-spdone>${L(T.done)}</button><button type="button" class="sb-clr t" data-spclr>${L(T.clr)}</button>`;
}
function openSheet() { const sh = $('#sb-sh'); if (!sh) return; pend = getStatus(); $('#sb-pn').innerHTML = sheetPn(getProf(), myName(), pend); sh.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => sh.classList.add('in'))); }
function closeSheet() { const sh = $('#sb-sh'); if (!sh) return; sh.classList.remove('in'); setTimeout(() => { sh.hidden = true; }, 300); }
// ক্লিকে পুরো পাতা নয়, শুধু দরকারি অংশ বদলায় (ঝিলিক দেয় না)
function paint() {
  const root = $('#v-board'), p = getProf(), nm = myName(), cur = getStatus();
  root.querySelectorAll('.sb-bx').forEach((el) => { el.outerHTML = statusBox(p, nm, cur, true); });
  const aw = $('.bd-r.me .bd-aw', root); if (aw) { const o = $('.bd-sb', aw); if (o) o.remove(); aw.insertAdjacentHTML('beforeend', cur ? `<span class="bd-sb pop" data-sbopen>${stSvg(cur)}</span>` : `<span class="bd-sb add e" data-sbopen>${U(STATUS_EMPTY)}</span>`); }
}
export function showBoard() {
  const root = $('#v-board'), xp = myXp(), inf = leagueInfo(xp), li = inf.li, nm = myName(), p = getProf(), cur = getStatus();
  const rows = build(inf, xp, nm), mine = rows.findIndex((x) => x.me) + 1;
  const lock = (xo) => `<span class="bd-s sm lk${xo ? ' xo' : ''}"><span class="lk-d">${U(LG_LOCK)}</span><span class="lk-l">${U(LG_LOCK_LIGHT)}</span></span>`;
  const strip = `<div class="bd-sl">${[li - 3, li - 2, li - 1].filter((k) => k >= 0).map((k, i, a) => `<span class="bd-s sm${a.length === 3 && i === 0 ? ' xo' : ''}">${leagueSvg(k, 'on')}</span>`).join('')}</div><span class="bd-s cur">${leagueSvg(li, 'on')}</span><div class="bd-sr">${[1, 2, 3].filter((k) => li + k < LEAGUES.length).map((k) => lock(k === 3)).join('')}</div>`;
  const bub = (id) => id ? `<span class="bd-sb">${stSvg(id)}</span>` : '';
  const av = (x) => x.me ? `<span class="bd-aw"><span class="bd-av me" style="${bnAttrs(p)}">${patSvg(p.pt)}<b>${(p.ch || first(nm)).replace(/[<>&]/g, '')}</b></span>${cur ? `<span class="bd-sb" data-sbopen>${stSvg(cur)}</span>` : `<span class="bd-sb add e" data-sbopen>${U(STATUS_EMPTY)}</span>`}<i class="bd-on"></i></span>` : `<span class="bd-aw"><span class="bd-av" style="background:${x.c}"><b>${first(x.nm)}</b></span>${bub(x.st)}</span>`;
  const list = rows.map((x, i) => { const n = i + 1; return `<div class="bd-r${x.me ? ' me' : ''}"><span class="bd-rk">${n <= 3 ? U(MEDALS[n - 1]) : `<i>${num(n)}</i>`}</span>${av(x)}<b class="bd-nm">${x.nm.replace(/[<>&]/g, '')}</b><span class="bd-xp t">${num(x.xp)} ${L(T.pt)}</span></div>`; }).join('');
  const sbx = statusBox(p, nm, cur);
  const box = `<section class="ch-bx"><h2 class="t">${L(T.yr)}</h2><div class="ch-sg bd-sg"><div class="ch-sm"><b>${num(mine)}</b><span class="t">${L(T.rk)}</span></div><div class="ch-sm"><b>${num(xp)}</b><span class="t">${L(T.pt)}</span></div></div></section><p class="se-note t bd-nt">${L(T.note)}</p>`;
  const sub = li < LEAGUES.length - 1 ? `<p class="bd-sub t">${L(T.nxt).replace('%n', L(LEAGUES[li + 1].n))}</p><b class="bd-tm t">${L(T.left).replace('%n', num(inf.need))}</b>` : `<p class="bd-sub t">${L(T.top)}</p>`;
  root.innerHTML = navHtml('board') + stHtml('rc') + `<aside class="ch-rc">${sbx}</aside><div class="ln-scroll ch bdp" id="ln-sc"><div class="ch-wrap bd"><div class="bd-hd"><div class="bd-st" id="bd-st">${strip}</div><h1 class="bd-t t">${L(LEAGUES[li].n)} ${L(T.lg)}</h1>${sub}</div><div class="bd-ls" id="bd-ls">${list}</div></div></div><div class="sb-sh" id="sb-sh" hidden><div class="sb-dim" data-spx></div><div class="sb-pn" id="sb-pn"></div></div>`;
  const ls = $('#bd-ls', root), me = $('.bd-r.me', root); if (ls && me) ls.scrollTop = Math.max(0, me.offsetTop - ls.clientHeight / 2 + me.offsetHeight / 2);
  root.onclick = (e) => {
    const nv = e.target.closest('[data-nv]'); if (nv) { goNav(nv.dataset.nv); return; }
    const sb = e.target.closest('[data-sb]'); if (sb) { setStatus(sb.dataset.sb); paint(); return; }
    if (e.target.closest('[data-sbrm]')) { setStatus(''); paint(); return; }
    if (e.target.closest('.bd-r.me .bd-av')) { goNav('me'); return; }
    if (e.target.closest('[data-sbopen]')) { if (!matchMedia('(min-width:80em)').matches) openSheet(); return; }
    const sp = e.target.closest('[data-sp]'); if (sp) { pend = sp.dataset.sp; $('#sb-pn').innerHTML = sheetPn(getProf(), myName(), pend, true); return; }
    if (e.target.closest('[data-spdone]')) { setStatus(pend); paint(); closeSheet(); return; }
    if (e.target.closest('[data-spclr]')) { setStatus(''); paint(); closeSheet(); return; }
    if (e.target.closest('[data-spx]')) closeSheet();
  };
}
