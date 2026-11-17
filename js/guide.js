import { getLang } from './i18n.js';
import { navHtml, stHtml, goNav, UNITS } from './learn.js';
import { cardsHtml, wireCards } from './cards.js';
import { guideFor } from './guide-data.js';

// গাইডবই পেইজ: পাশের মেনু ও ডানের কার্ড একই থাকে, মাঝের অংশ বদলে গাইডের লেখা আসে
const $ = (s, r = document) => r.querySelector(s), IX = { bn: 0, en: 1, ar: 2 }, L = (a) => a[IX[getLang()]];
const T = { back: ['ফিরে যান', 'Go back', 'رجوع'] };
const esc = (s) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
export function showGuide() {
  const root = $('#v-guide'); let ui = 0; try { ui = +sessionStorage.getItem('pp_gu') || 0; } catch (e) {} ui = Math.max(0, Math.min(UNITS.length - 1, ui));
  const g = guideFor(ui), AR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5M11 5.500L4.500 12L11 18.500" fill="none" stroke="currentColor" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  root.innerHTML = navHtml('learn') + stHtml('rc') + `<aside class="ln-rc">${cardsHtml()}</aside><div class="ln-scroll gd" id="ln-sc"><div class="gd-wrap"><button type="button" class="gd-bk t" data-back>${AR}<span>${L(T.back)}</span></button><div class="gd-hd"><span class="gd-tg t">${L(g.tag)}</span><h1 class="t">${esc(L(UNITS[ui].t))}</h1></div>${g.sections.map((s) => `<section class="gd-sc"><h2 class="t">${esc(L(s.h))}</h2>${s.p.map((p) => `<p class="t">${esc(L(p))}</p>`).join('')}</section>`).join('')}</div></div>`;
  root.onclick = (e) => { const nv = e.target.closest('[data-nv]'); if (nv) { goNav(nv.dataset.nv); return; } if (e.target.closest('[data-back]')) location.hash = '#/learn'; };
  wireCards(root);
}
