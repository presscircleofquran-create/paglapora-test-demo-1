import { getLang, num } from './i18n.js';
import { play } from './sfx.js';
import { UNITS, CNT, ST, chestMap, chestImg, daysPlayed, ldate } from './learn.js';
import { leagueSvg, standing } from './board.js';

// হোমের ডান পাশের কার্ড: লিগ, ধারাবাহিকতা (সপ্তাহ + ক্যালেন্ডার), পরের চেস্ট
const IX = { bn: 0, en: 1, ar: 2 }, L = (a) => a[IX[getLang()]], LOC = { bn: 'bn-BD', en: 'en', ar: 'ar' };
const T = {
  lg: ['লিগ', 'League', 'دوري'], det: ['বিস্তারিত তথ্য', 'League details', 'تفاصيل الدوري'], pos: ['আপনি #%n অবস্থানে আছেন', 'You are in position #%n', 'أنت في المركز #%n'], pts: ['মোট %n পয়েন্ট পেয়েছেন', 'You have earned %n XP in total', 'كسبت %n نقطة في المجموع'],
  sk: ['ধারাবাহিকতা', 'Consistency', 'الاستمرارية'], dt: ['বিস্তারিত', 'Details', 'التفاصيل'], cal: ['ক্যালেন্ডার', 'Calendar', 'التقويم'], cl: ['বন্ধ করুন', 'Close', 'إغلاق'],
  nx: ['পরের চেস্ট', 'Next chest', 'الصندوق التالي'], all: ['চেস্টগুলো দেখুন', 'See all', 'عرض الكل'], left: ['চেস্ট খুলতে আর %n টি লেসন খেলুন', 'Play %n more lessons to open the chest', 'العب %n دروسا أخرى لفتح الصندوق'], left1: ['চেস্ট খুলতে আর ১টি লেসন খেলুন', 'Play 1 more lesson to open the chest', 'العب درسا واحدا آخر لفتح الصندوق'], fin: ['সব চেস্ট খোলার জন্য প্রস্তুত!', 'Every chest is ready!', 'كل الصناديق جاهزة!']
};
const NEED = 4, cnt0 = () => { try { return JSON.parse(localStorage.getItem('pp_np')) || {}; } catch (e) { return {}; } };
const fmt = (d, o) => new Intl.DateTimeFormat(LOC[getLang()] || 'en', o).format(d);
const CHK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.500 12.500L10 17L18.500 7.500" fill="none" stroke="#fff" stroke-width="3.400" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CRS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7L17 17M17 7L7 17" fill="none" stroke="#fff" stroke-width="3.200" stroke-linecap="round"/></svg>';
const joined = () => { let j = 0; try { j = +localStorage.getItem('pp_joined') || 0; if (!j) { j = Date.now(); localStorage.setItem('pp_joined', String(j)); } } catch (e) { j = Date.now(); } const d = new Date(j); d.setHours(0, 0, 0, 0); return d; };
function leagueCard() {
  const s = standing();
  return `<section class="rc-cd"><div class="rc-hd"><h2 class="t">${s.name} ${L(T.lg)}</h2><a href="#/board" class="rc-lk t">${L(T.det)}</a></div><div class="rc-lg"><span class="rc-sh">${leagueSvg(s.li, 'on')}</span><div><b class="t">${L(T.pos).replace('%n', num(s.rank))}</b><p class="t">${L(T.pts).replace('%n', num(s.xp))}</p></div></div></section>`;
}
function weekCard() {
  const ds = daysPlayed(), now = new Date(); now.setHours(0, 0, 0, 0); const st = new Date(now); st.setDate(now.getDate() - ((now.getDay() + 1) % 7)); const jn = joined();
  const cols = Array.from({ length: 7 }, (_, i) => { const d = new Date(st); d.setDate(st.getDate() + i); const k = ldate(d), played = ds.includes(k), isT = d.getTime() === now.getTime(), miss = !played && d < now && d >= jn;
    return `<div class="rc-dy${isT ? ' tdy' : ''}"><span class="t">${fmt(d, { weekday: 'short' })}</span><i class="${played ? 'ok' : miss ? 'no' : ''}">${played ? CHK : miss ? CRS : ''}</i></div>`; }).join('');
  return `<section class="rc-cd"><div class="rc-hd"><h2 class="t">${L(T.sk)}</h2><button type="button" class="rc-lk t" data-cal>${L(T.dt)}</button></div><div class="rc-wk">${cols}</div></section>`;
}
function chestCard() {
  const np = cnt0(); let ui = -1, done = 0, tot = 0;
  for (let u = 0; u < UNITS.length; u++) { if (!Object.keys(chestMap(u)).length) continue; let d = 0, t = 0; for (let k = 0; k < CNT[u]; k++) { const nd = k === CNT[u] - 1 ? 1 : NEED, c = Math.min(nd, +np[ST[u] + k] || 0); d += c; t += nd; } if (d < t) { ui = u; done = d; tot = t; break; } }
  if (ui < 0) return `<section class="rc-cd"><div class="rc-hd"><h2 class="t">${L(T.nx)}</h2><a href="#/chests" class="rc-lk t">${L(T.all)}</a></div><p class="rc-tx t">${L(T.fin)}</p></section>`;
  const left = tot - done, pc = Math.round(done / tot * 100);
  return `<section class="rc-cd"><div class="rc-hd"><h2 class="t">${L(T.nx)}</h2><a href="#/chests" class="rc-lk t">${L(T.all)}</a></div><div class="rc-nx"><span class="rc-ch">${chestImg(false)}</span><div><b class="t">${left === 1 ? L(T.left1) : L(T.left).replace('%n', num(left))}</b><div class="rc-bar"><i style="width:${pc}%"></i><span>${num(pc)}%</span></div></div></div></section>`;
}
export const cardsHtml = () => leagueCard() + weekCard() + chestCard();
// ---------- ক্যালেন্ডার ----------
let cm = null;
function calHtml() {
  const ds = daysPlayed(), y = cm.getFullYear(), m = cm.getMonth(), first = new Date(y, m, 1), nd = new Date(y, m + 1, 0).getDate(), off = (first.getDay() + 1) % 7, today = ldate();
  const wd = Array.from({ length: 7 }, (_, i) => { const d = new Date(2023, 0, 7 + i); return `<span class="t">${fmt(d, { weekday: 'short' })}</span>`; }).join('');
  let cells = ''; for (let i = 0; i < off; i++) cells += '<span></span>';
  for (let d = 1; d <= nd; d++) { const k = ldate(new Date(y, m, d)), pl = ds.includes(k), pv = d > 1 && ds.includes(ldate(new Date(y, m, d - 1))) && pl && (off + d - 1) % 7 !== 0, nx = pl && d < nd && ds.includes(ldate(new Date(y, m, d + 1))) && (off + d) % 7 !== 0;
    cells += `<span class="cl${pl ? ' pl' : ''}${pl && (pv || nx) ? ' bd' : ''}${pv ? ' pv' : ''}${nx ? ' nx' : ''}${k === today ? ' td' : ''}"><b>${num(d)}</b></span>`; }
  return `<div class="cl-hd"><h3 class="t">${L(T.cal)}</h3></div><div class="cl-bx"><div class="cl-mn"><button type="button" data-mv="-1" aria-label="prev">&#8249;</button><b class="t">${fmt(cm, { month: 'long' })} ${num(y)}</b><button type="button" data-mv="1" aria-label="next">&#8250;</button></div><div class="cl-wd">${wd}</div><div class="cl-gd">${cells}</div></div>`;
}
const closeCal = () => { const o = document.getElementById('cl-ov'); if (o) o.remove(); };
function openCal() {
  closeCal(); cm = new Date(); cm.setDate(1); const o = document.createElement('div'); o.id = 'cl-ov'; o.innerHTML = `<div class="cl-sh" role="dialog">${calHtml()}</div>`; document.body.appendChild(o);
  o.onclick = (e) => { if (e.target === o) { closeCal(); return; } const mv = e.target.closest('[data-mv]'); if (mv) { cm.setMonth(cm.getMonth() + +mv.dataset.mv); $0(o).innerHTML = calHtml(); } };
}
const $0 = (o) => o.querySelector('.cl-sh');
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCal(); });
addEventListener('hashchange', closeCal);
export function wireCards(root) { root.querySelectorAll('[data-cal]').forEach((b) => { b.onclick = (e) => { e.stopPropagation(); play('press', .5); openCal(); }; }); }
