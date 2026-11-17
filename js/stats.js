import { getLang, num, setLang, LANG_LIST } from './i18n.js';
import { play } from './sfx.js';
import { navHtml, stHtml, goNav, SI, LS, chestImg } from './learn.js';
import { SUBJECTS } from './onboard.js';
import { coverUp, coverRot } from './books.js';
import { GEM, GEM_NAV, GEM_GREY, CHEST_GEMS, HEART_RED, HEART_EMPTY, HEART_RING, HEART_GROW, HEART_NAV, HEART_NAV_GREY, TICK, PLUS } from './icons.js';
import { cardsHtml, wireCards } from './cards.js';
import { getHearts, setHearts, nextIn, HOUR } from './hearts.js';

// উপরের সারির পপআপ (বই / কয়েন / জেম / হার্ট), দোকান পাতা ও কোর্স যোগের পাতা
const $ = (s, r = document) => r.querySelector(s), IX = { bn: 0, en: 1, ar: 2 }, L = (a) => a[IX[getLang()]];
const T = {
  hr: ['হার্ট', 'Hearts', 'القلوب'], hrAll: ['আপনার কাছে সবগুলো হার্ট আছে', 'You have all your hearts', 'لديك كل القلوب'], hrSome: ['আপনার কাছে হার্ট আছে: ', 'Hearts left: ', 'القلوب المتبقية: '], hrNone: ['আপনার কোনো হার্ট নেই', 'You have no hearts left', 'لا توجد لديك قلوب'],
  refill: ['হার্ট রিফিল করুন', 'Refill hearts', 'إعادة ملء القلوب'], full: ['পরিপূর্ণ', 'Full', 'ممتلئ'], few: ['জেম যথেষ্ট নেই', 'Not enough gems', 'لا تكفي الجواهر'], fewC: ['কয়েন যথেষ্ট নেই', 'Not enough coins', 'لا تكفي العملات'],
  gm: ['জেমস্টোন', 'Gems', 'الجواهر'], gmT: ['আপনার সংগ্রহে %n টি জেম আছে', 'You have %n gems in your collection', 'لديك %n جوهرة في مجموعتك'], co: ['কয়েন', 'Coins', 'العملات'], coT: ['আপনার কাছে %n টি কয়েন আছে', 'You have %n coins', 'لديك %n عملة'], lang: ['ভাষা', 'Language', 'اللغة'], go: ['শপে যান', 'Go to shop', 'اذهب إلى المتجر'],
  my: ['আমার বই', 'My books', 'كتبي'], nw: ['নতুন বই', 'New book', 'كتاب جديد'],
  nxh: ['পরবর্তী হার্ট পাবেন %t পর', 'Next heart in %t', 'القلب التالي بعد %t'], keep: ['আপনার কাছে এখনও কিছু হার্ট রয়েছে! শিখতে থাকুন', 'You still have some hearts! Keep learning', 'لا تزال لديك بعض القلوب! واصل التعلم'], none: ['আপনার সব হার্ট শেষ হয়ে গেছে', 'You are out of hearts', 'نفدت قلوبك'], rfAll: ['সম্পূর্ণ হার্ট রিফিল করুন', 'Refill all hearts', 'إعادة ملء كل القلوب'], rfOne: ['একটি হার্ট রিফিল করুন', 'Refill one heart', 'املأ قلبا واحدا'], hh: ['ঘণ্টা', 'hour', 'ساعة'], mm: ['মিনিট', 'minutes', 'دقيقة'],
  hh: ['হার্ট কিনুন', 'Buy hearts', 'اشترِ القلوب'], ch: ['কয়েন কিনুন', 'Buy coins', 'اشترِ العملات'], gh: ['জেমস্টোন কিনুন', 'Buy gemstones', 'اشترِ الجواهر'], bnc: ['%n টি কয়েন কিনুন', 'Buy %n coins', 'اشترِ %n عملة'], bng: ['%n টি জেমস্টোন কিনুন', 'Buy %n gemstones', 'اشترِ %n جوهرة'], myH: ['আপনার হার্ট', 'Your hearts', 'قلوبك'], myC: ['আপনার কয়েন', 'Your coins', 'عملاتك'], myG: ['আপনার জেমস', 'Your gems', 'جواهرك'], title: ['আপনার প্রয়োজনীয় জিনিসপত্র কিনুন', 'Buy what you need', 'اشترِ ما تحتاجه'], shop: ['শপ', 'Shop', 'المتجر'], hrs: ['হার্ট', 'Hearts', 'القلوب'], one: ['একটি হার্ট রিফিল করুন', 'Refill 1 heart', 'املأ قلبا واحدا'], oneD: ['একটি করে হার্ট ফিরিয়ে আনুন', 'Get your hearts back one at a time', 'استعد قلوبك واحدا تلو الآخر'], all: ['সম্পূর্ণ হার্ট রিফিল করুন', 'Refill all hearts', 'املأ كل القلوب'], allD: ['সবগুলো হার্ট থাকলে দুশ্চিন্তা ছাড়াই অনুশীলন করা যায়', 'With every heart full you can practise without worry', 'مع القلوب الممتلئة تتدرب دون قلق'],
  ex: ['কয়েন ও জেম', 'Coins and gems', 'العملات والجواهر'], bc: ['জেম দিয়ে কয়েন কিনুন', 'Buy coins with gems', 'اشتر العملات بالجواهر'], bg: ['কয়েন দিয়ে জেম কিনুন', 'Buy gems with coins', 'اشتر الجواهر بالعملات'], buy: ['কিনুন', 'Buy', 'اشتر'], bought: ['কেনা হয়েছে', 'Purchase complete', 'تمت العملية'],
  wal: ['আপনার সম্বল', 'Your wallet', 'رصيدك'], tip: ['চেস্ট খুলে ও লেভেল শেষ করে জেম ও কয়েন জমান।', 'Open chests and finish levels to earn gems and coins.', 'افتح الصناديق وأنهِ المستويات لتكسب الجواهر والعملات.'],
  courses: ['বই', 'Books', 'الكتب'], pick: ['যে বইটি শিখতে চান বেছে নিন', 'Pick a book to learn', 'اختر كتابا للتعلم'], back: ['ফিরে যান', 'Back', 'رجوع']
};
const RT = 20, PH = 10, PALL = 40, PK = [[5, 100], [20, 450]], PG = [[100, 3], [500, 18]];
const sv = (k, v) => { try { localStorage.setItem(k, String(v)); } catch (e) {} };
const hearts = () => getHearts();
const myList = () => { let a = []; try { a = JSON.parse(localStorage.getItem('pp_courses')) || []; } catch (e) {} const cur = (() => { try { return localStorage.getItem('pp_subj'); } catch (e) { return ''; } })() || 'bangla1'; if (!a.includes(cur)) a.unshift(cur); return a.filter((id) => SUBJECTS.some((s) => s.id === id)); };
const curId = () => { try { return localStorage.getItem('pp_subj') || 'bangla1'; } catch (e) { return 'bangla1'; } };
const HRT = (on) => (on ? HEART_RED : HEART_EMPTY);
const BIG = (svg) => svg.replace('<svg ', '<svg class="sp-big" ');
// ---------- সংখ্যা সতেজ করা ----------
export function refreshSt() {
  document.querySelectorAll('.ln-st').forEach((e) => { const f = (c, v) => { const b = e.querySelector(c + ' b'); if (b) b.textContent = num(v); }; f('.st-co', LS('pp_coin', 0)); f('.st-gm', LS('pp_gem', 0)); f('.st-hr', hearts()); { const hz = e.querySelector('.st-hr'); if (hz) { const z = !hearts(); if (z !== hz.classList.contains('z')) { hz.classList.toggle('z', z); const sv0 = hz.querySelector('svg'); if (sv0) sv0.outerHTML = z ? HEART_NAV_GREY : HEART_NAV; } } } const sb = e.querySelector('.st-bk b'); if (sb) { let np = {}; try { np = JSON.parse(localStorage.getItem('pp_np')) || {}; } catch (x) {} sb.textContent = num(Object.values(np).reduce((a, v) => a + (+v || 0), 0)); } });
}
let tm = 0, pin = false, curK = '';
let lv = 0; const close = (now) => { clearInterval(lv); lv = 0; clearTimeout(tm); pin = false; curK = '';
  // বন্ধ হওয়ার সময়ও অ্যানিমেশন: 'out' ক্লাস দিয়ে মিলিয়ে তারপর সরানো (নতুন পপআপ খুললে সঙ্গে সঙ্গে সরে যায়)
  const gone = (el) => { if (!el) return; if (now) { el.remove(); return; } el.classList.add('out'); el.removeAttribute('id'); setTimeout(() => el.remove(), 180); };
  gone(document.getElementById('st-pop')); gone(document.getElementById('st-dim'));
  document.querySelectorAll('.st-i[data-open]').forEach((x) => x.removeAttribute('data-open')); };
const cost = () => { const m = 5 - hearts(); return m <= 0 ? 0 : Math.min(PALL, m * PH); };
function popHtml(k) {
  if (k === 'hr') {
    const h = hearts(), m = 5 - h, can = (n) => LS('pp_gem', 0) >= n, call = cost(), tm = nextIn(), mins = Math.max(1, Math.ceil(tm / 60000)), ts = mins > 59 ? `1 ${L(T.hh)}` : `${num(mins)} ${L(T.mm)}`;
    const opt = (att, ic, label, price) => `<button type="button" class="sp-op" ${att}${m ? '' : ' disabled'}><span class="sp-oi">${ic}</span><span class="sp-ol t">${label}</span><span class="sp-pr${m && can(price) ? ' ok' : ''}">${m && can(price) ? GEM : GEM_GREY}<i>${num(price)}</i></span></button>`;
    return `<h3 class="t">${L(T.hr)}</h3><div class="sp-hs">${[0, 1, 2, 3, 4].map((i) => i < h ? `<span>${HEART_RED}</span>` : i === h ? `<span class="rg">${HEART_GROW}</span>` : `<span>${HEART_EMPTY}</span>`).join('')}</div>${m ? `<p class="sp-nx t">${L(T.nxh).replace('%t', `<em>${ts}</em>`)}</p><p class="sp-tx t">${h ? L(T.keep) : L(T.none)}</p>` : `<p class="sp-nx t">${L(T.hrAll)}</p>`}${opt('data-rf', HEART_RING, L(T.rfAll), call || PALL)}${opt('data-r1', HEART_EMPTY, L(T.rfOne), PH)}`;
  }
  if (k === 'gm') return `<div class="sp-row"><div class="sp-im">${CHEST_GEMS}</div><div><h3 class="t">${L(T.gm)}</h3><p class="sp-tx t">${L(T.gmT).replace('%n', num(LS('pp_gem', 0)))}</p><button type="button" class="sp-lk t" data-shop="gm">${L(T.go)}</button></div></div>`;
  if (k === 'co') return `<div class="sp-row"><div class="sp-im c">${BIG(SI.coin)}</div><div><h3 class="t">${L(T.co)}</h3><p class="sp-tx t">${L(T.coT).replace('%n', num(LS('pp_coin', 0)))}</p><button type="button" class="sp-lk t" data-shop="co">${L(T.go)}</button></div></div>`;
  const cur = curId();
  return `<div class="sp-hd t">${L(T.my)}</div><div class="sp-bg">${myList().map((id) => { const s = SUBJECTS.find((x) => x.id === id); return `<button type="button" class="sp-cr${id === cur ? ' on' : ''}" data-cs="${id}">${coverRot(s)}<b class="t">${L(s.n)}</b></button>`; }).join('')}</div><button type="button" class="sp-cr sp-nw" data-new><span class="sp-pl">${PLUS}</span><b class="t">${L(T.nw)}</b></button>`;
}
function open(it) {
  const k = it.classList.contains('st-hr') ? 'hr' : it.classList.contains('st-gm') ? 'gm' : it.classList.contains('st-co') ? 'co' : 'bk';
  if (curK === k && document.getElementById('st-pop')) return; close(true); curK = k;
  const p = document.createElement('div'); p.id = 'st-pop'; p.className = 'sp-' + k; p.innerHTML = popHtml(k); document.body.appendChild(p); it.setAttribute('data-open', ''); if (k === 'hr') lv = setInterval(() => { const q = document.getElementById('st-pop'); if (q && q.classList.contains('sp-hr') && !q.querySelector('.sp-er')) { q.innerHTML = popHtml('hr'); refreshSt(); } }, 20000);
  const r = it.getBoundingClientRect(), w = p.offsetWidth, m = 10; let x = r.left + r.width / 2 - w / 2; x = Math.max(m, Math.min(innerWidth - w - m, x));
  if (innerWidth < 704) {
    const row = it.closest('.ln-st').getBoundingClientRect(), top = Math.floor(row.bottom) - 1;
    p.classList.add('full'); p.style.left = '0px'; p.style.top = top + 'px'; p.style.setProperty('--ax', (r.left + r.width / 2) + 'px');
    const dm = document.createElement('div'); dm.id = 'st-dim'; dm.style.top = top + 'px'; document.body.appendChild(dm);
    return;
  }
  p.style.left = x + 'px'; p.style.top = r.bottom + 12 + 'px'; p.style.setProperty('--ax', (r.left + r.width / 2 - x) + 'px');
}
const item = (e) => e.target.closest && e.target.closest('.ln-st .st-i');
const inPop = (n) => n && n.closest && n.closest('#st-pop');
document.addEventListener('mouseover', (e) => { if (!matchMedia('(hover:hover)').matches) return; const it = item(e); if (it) { clearTimeout(tm); open(it); } else if (inPop(e.target)) clearTimeout(tm); });
document.addEventListener('mouseout', (e) => { if (pin || !matchMedia('(hover:hover)').matches) return; if ((item(e) || inPop(e.target)) && !(item({ target: e.relatedTarget }) || inPop(e.relatedTarget))) { clearTimeout(tm); tm = setTimeout(close, 200); } });
document.addEventListener('click', (e) => {
  const p = document.getElementById('st-pop');
  if (p && p.contains(e.target)) {
    const bt = e.target.closest('[data-rf],[data-r1]');
    if (bt) { if (bt.disabled) return; const one = bt.hasAttribute('data-r1'), c = one ? PH : cost(); if (!c) return; if (LS('pp_gem', 0) < c) { flash(p, L(T.few)); return; } sv('pp_gem', LS('pp_gem', 0) - c); setHearts(one ? hearts() + 1 : 5); play('press', .6); refreshSt(); p.innerHTML = popHtml('hr'); return; }
    { const sb = e.target.closest('[data-shop]'); if (sb) { try { sessionStorage.setItem('pp_shopto', sb.dataset.shop || ''); } catch (er) {} close(); if (location.hash === '#/shop') showShop(); else location.hash = '#/shop'; return; } }
    const cs = e.target.closest('[data-cs]'); if (cs) { sv('pp_subj', cs.dataset.cs); close(); play('press', .5); if (location.hash === '#/learn') window.dispatchEvent(new HashChangeEvent('hashchange')); else location.hash = '#/learn'; return; }
    if (e.target.closest('[data-new]')) { close(); location.hash = '#/courses'; return; }
    return;
  }
  const it = item(e);
  if (!it) { close(); return; }
  e.stopPropagation(); if (pin && curK && document.getElementById('st-pop')) { const same = (it.classList.contains('st-' + { hr: 'hr', gm: 'gm', co: 'co', bk: 'bk' }[curK])); if (same) { close(); return; } } close(); open(it); pin = true;
}, true);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
addEventListener('hashchange', close); addEventListener('scroll', (e) => { if (!inPop(e.target)) close(); }, true);
function flash(p, msg) { let n = p.querySelector('.sp-er'); if (!n) { n = document.createElement('p'); n.className = 'sp-er t'; p.appendChild(n); } n.textContent = msg; }
let tt = 0; function toast(m) { let t = document.getElementById('nv-ts'); if (!t) { t = document.createElement('div'); t.id = 'nv-ts'; document.body.appendChild(t); } t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(() => { t.hidden = true; }, 2200); }

// ---------- দোকান ----------
// ছবির মতো দোকানের চাঁদোয়া: ধূসর রড, তেরছা লাল-সাদা ডোরা, নিচে গোল-কিনারার ঝালর
const awn = (A, n = 13, hs = 1) => { const H = 253 * hs, yb = 317 + H, bw = 1602 / n, tw = 1236 / n, rx = bw / 2, ry = Math.min(rx, 61.65), f = (v) => v.toFixed(1); let d = '';
  for (let i = 0; i < n; i++) { const r = i % 2 === 0, tx = 297 + tw * i, bx = 114 + bw * i, tx2 = tx + tw, bx2 = bx + bw;
    d += `<path d="M${f(tx)} 317L${f(tx2)} 317L${f(bx2)} ${f(yb)}L${f(bx)} ${f(yb)}Z" fill="${r ? A[0] : '#F1F1F1'}"/><path d="M${f(bx)} ${f(yb)}H${f(bx2)}V${f(yb + 58)}A${f(rx)} ${f(ry)} 0 0 1 ${f(bx)} ${f(yb + 58)}Z" fill="${r ? A[1] : '#E3E3E3'}"/>`; }
  return `<svg class="sh-aw" aria-hidden="true" focusable="false" viewBox="100 280 1630 ${f(yb + 58 + ry - 280 + 8)}" xmlns="http://www.w3.org/2000/svg"><rect x="287" y="289" width="1254" height="27" rx="13" fill="#D4D4D4"/>${d}</svg>`; };
const AWN = awn(['#EB1C24', '#E8000B']);
const AW_H = awn(['#FF6B9A', '#F0407A'], 11, .55), AW_C = awn(['#FFC800', '#EDAA00'], 11, .55), AW_G = awn(['#1CB0F6', '#0E95D8'], 11, .55);

export function showShop(keep) {
  const root = $('#v-shop'), top0 = keep ? ($('#ln-sc', root) || {}).scrollTop || 0 : 0, h = hearts(), c = cost(), gm = LS('pp_gem', 0), co = LS('pp_coin', 0);
  // দোকানে কয়েন ও জেমের সাদা বর্ডার নেই
  const nb = (x) => x.replace(/ stroke="(?:white|#fff|#FFF|#ffffff)"(?: stroke-width="[^"]*")?/g, ''), COIN = nb(SI.coin), GEMI = nb(SI.gem), HRTN = nb(SI.heart);
  // কয়েন ও জেমের বড় আইকনের চারপাশে হার্টের মতো ফাঁক রেখে পাতলা বর্ডার
  const inner = (x) => x.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const COINR = `<svg aria-hidden="true" focusable="false" viewBox="0 0 37 36"><circle cx="18.500" cy="18" r="17.200" fill="none" stroke="#FFE7A0" stroke-width="1.100"/><g transform="translate(.600 .100) scale(1.055)">${inner(COIN)}</g></svg>`;
  const GEMR = `<svg aria-hidden="true" focusable="false" viewBox="-1 -1 26 32"><path transform="translate(11.860 15.200) scale(1.130) translate(-11.860 -15.200)" d="M3.12035 6.45972C1.80438 7.25391 1 8.67887 1 10.2159V19.8822C1 21.4192 1.80438 22.8442 3.12035 23.6384L9.59501 27.5458C10.9891 28.3872 12.7345 28.3872 14.1287 27.5459L20.6037 23.6384C21.9197 22.8442 22.7241 21.4192 22.7241 19.8821V10.216C22.7241 8.67889 21.9197 7.2539 20.6037 6.45972L14.1287 2.55221C12.7345 1.71089 10.9891 1.71091 9.59501 2.55226L3.12035 6.45972Z" fill="none" stroke="#B8E6FF" stroke-width=".85"/>${inner(GEMI)}</svg>`;
  const row = (ic, ti, de, btn) => `<div class="sh-r"><div class="sh-ic">${ic}</div><div class="sh-tx"><b class="t">${ti}</b><p class="t">${de}</p></div>${btn}</div>`;
  const pb = (label, price, icon, att, ok = true) => `<button type="button" class="sh-bt${ok ? '' : ' no'}" ${att}${price === null || !ok ? ' disabled' : ''}>${price === null ? `<span class="t">${label}</span>` : `<span class="sh-p${ok ? '' : ' no'}">${icon}<i>${num(price)}</i></span>`}</button>`;
  const two = (g, cn, ag, ac) => `<div class="sh-bs">${pb('', g, GEMI, ag, gm >= g)}${pb('', cn, COIN, ac, co >= cn)}</div>`;
  const sec = (ti, body, id, aw) => `<section class="sh-sec" id="${id}"><div class="sh-sa">${aw}</div><h2 class="sh-h t">${ti}</h2><div class="sh-card">${body}</div></section>`;
  const wt = (ic, v, lb) => `<div class="ch-sm"><div class="sh-wr">${ic}<b>${num(v)}</b></div><span class="sh-wn t">${L(lb)}</span></div>`;
  const wal = `<div class="ch-sg sh-wl">${wt(HRTN, h, T.myH)}${wt(COIN, co, T.myC)}${wt(GEMI, gm, T.myG)}</div>`;
  const rOne = row(`<span class="sh-hr">${HRT(true)}</span>`, L(T.one), L(T.oneD), h >= 5 ? pb(L(T.full), null, '', '') : two(PH, PH * RT, 'data-act="one"', 'data-act="onec"'));
  const rAll = row(`<span class="sh-hr rg">${HEART_RING}</span>`, L(T.all), L(T.allD), h >= 5 ? pb(L(T.full), null, '', '') : two(c, c * RT, 'data-act="all"', 'data-act="allc"'));
  const hs = sec(L(T.hh), rOne + rAll, 'sh-hr', AW_H);
  const cs = sec(L(T.ch), PK.map(([g, n], i) => row(`<span class="sh-hr">${i ? COINR : COIN}</span>`, L(T.bnc).replace('%n', num(n)), L(T.bc), `<button type="button" class="sh-bt${gm >= g ? '' : ' no'}" data-act="c${i}"${gm >= g ? '' : ' disabled'}><span class="sh-p${gm >= g ? '' : ' no'}">${GEMI}<i>${num(g)}</i></span></button>`)).join(''), 'sh-co', AW_C);
  const gs = sec(L(T.gh), PG.map(([c2, g], i) => row(`<span class="sh-hr">${i ? GEMR : GEMI}</span>`, L(T.bng).replace('%n', num(g)), L(T.bg), `<button type="button" class="sh-bt${co >= c2 ? '' : ' no'}" data-act="g${i}"${co >= c2 ? '' : ' disabled'}><span class="sh-p${co >= c2 ? '' : ' no'}">${COIN}<i>${num(c2)}</i></span></button>`)).join(''), 'sh-gm', AW_G);
  root.innerHTML = navHtml('shop') + stHtml('rc') + `<aside class="ch-rc">${cardsHtml()}</aside><div class="ln-scroll ch" id="ln-sc">${stHtml('in')}<div class="ch-wrap sh"><div class="sh-sf">${AWN}<div class="sh-bd"><h1 class="sh-ti t">${L(T.title)}</h1>${wal}</div></div>${hs}${cs}${gs}</div></div>`;
  wireCards(root);
  if (keep) { const k = $('#ln-sc', root); if (k) k.scrollTop = top0; }
  { let to = ''; try { to = sessionStorage.getItem('pp_shopto') || ''; sessionStorage.removeItem('pp_shopto'); } catch (er) {}
    const el = to && root.querySelector('#sh-' + to), sc = $('#ln-sc', root);
    if (el && sc) { let y = 0, n = el; while (n && n !== sc) { y += n.offsetTop; n = n.offsetParent; } const bar = $('.ln-st.in', root); sc.scrollTop = Math.max(0, y - (bar ? bar.offsetHeight : 0) - 6); } }
  root.onclick = (e) => {
    const nv = e.target.closest('[data-nv]'); if (nv) { goNav(nv.dataset.nv); return; }
    const b = e.target.closest('[data-act]'); if (!b || b.disabled) return; const a = b.dataset.act, G = LS('pp_gem', 0), C = LS('pp_coin', 0);
    let ok = true;
    if (a === 'one') { if (G < PH) ok = false; else { sv('pp_gem', G - PH); setHearts(hearts() + 1); } }
    else if (a === 'onec') { if (C < PH * RT) ok = false; else { sv('pp_coin', C - PH * RT); setHearts(hearts() + 1); } }
    else if (a === 'allc') { const k = cost() * RT; if (C < k) ok = false; else { sv('pp_coin', C - k); setHearts(5); } }
    else if (a === 'all') { const k = cost(); if (G < k) ok = false; else { sv('pp_gem', G - k); setHearts(5); } }
    else if (a[0] === 'c') { const [g, n] = PK[+a[1]]; if (G < g) ok = false; else { sv('pp_gem', G - g); sv('pp_coin', C + n); } }
    else if (a[0] === 'g') { const [c2, g] = PG[+a[1]]; if (C < c2) ok = false; else { sv('pp_coin', C - c2); sv('pp_gem', G + g); } }
    if (!ok) return;
    play('press', .6); showShop(true);
  };
}
// ---------- নতুন কোর্স ----------
export function showCourses() {
  const root = $('#v-courses'), mine = myList(), cur = curId();
  const AR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5M11 5.500L4.500 12L11 18.500" fill="none" stroke="currentColor" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const LN = LANG_LIST.find((x) => x.id === getLang()) || LANG_LIST[0];
  const lang = `<div class="cs-lg"><button type="button" class="cs-lb" data-lg aria-haspopup="listbox"><span class="t">${L(T.lang)}: ${LN.name}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="cs-lm" hidden>${LANG_LIST.map((x) => `<button type="button" class="${x.id === LN.id ? 'on' : ''}" data-ln="${x.id}">${x.name}</button>`).join('')}</div></div>`;
  root.innerHTML = navHtml('learn') + `<div class="ln-scroll ch" id="ln-sc"><div class="ch-wrap cs">${stHtml('in')}<div class="cs-hd"><h1 class="t">${L(T.pick)}</h1>${lang}</div><div class="cs-gd">${SUBJECTS.map((s) => `<button type="button" class="cs-cd${mine.includes(s.id) ? ' my' : ''}${s.id === cur ? ' on' : ''}" data-cs="${s.id}">${mine.includes(s.id) ? `<span class="cs-ck">${TICK}</span>` : ''}${coverUp(s)}<b class="t">${L(s.n)}</b></button>`).join('')}</div></div></div>`;
  root.onclick = (e) => {
    const nv = e.target.closest('[data-nv]'); if (nv) { goNav(nv.dataset.nv); return; }
    if (e.target.closest('[data-back]')) { location.hash = '#/learn'; return; }
    const lb = e.target.closest('[data-lg]'); if (lb) { const m = root.querySelector('.cs-lm'); m.hidden = !m.hidden; return; }
    const ln = e.target.closest('[data-ln]'); if (ln) { setLang(ln.dataset.ln); showCourses(); return; }
    const mm = root.querySelector('.cs-lm'); if (mm && !mm.hidden) mm.hidden = true;
    const c = e.target.closest('[data-cs]'); if (!c) return; const a = myList(); if (!a.includes(c.dataset.cs)) a.push(c.dataset.cs);
    sv('pp_courses', JSON.stringify(a)); sv('pp_subj', c.dataset.cs); play('press', .6); location.hash = '#/learn';
  };
}
