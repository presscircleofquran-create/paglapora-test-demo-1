import { getLang, num } from './i18n.js';
import { play } from './sfx.js';
import { navHtml, goNav } from './learn.js';
import { dlg } from './dlg.js';
import { PAL, first, patSvg, PATS, bnAttrs, getProf, DEF } from './profile.js';

// প্রোফাইল সাজানোর পাতা: ব্যাকগ্রাউন্ডের রং, অক্ষর, অক্ষরের রং, আকার, নকশা
const $ = (s, r = document) => r.querySelector(s), IX = { bn: 0, en: 1, ar: 2 }, L = (a) => a[IX[getLang()]];
const T = {
  ti: ['প্রোফাইল সাজান', 'Customise profile', 'تخصيص الملف'], dn: ['শেষ', 'Done', 'تم'], back: ['ফিরে যান', 'Back', 'رجوع'],
  bg: ['ব্যাকগ্রাউন্ডের রং', 'Background colour', 'لون الخلفية'], ch: ['অক্ষর', 'Letter', 'الحرف'], lc: ['অক্ষরের রং', 'Letter colour', 'لون الحرف'], sz: ['আকার', 'Size', 'الحجم'], pt: ['নকশা', 'Pattern', 'النقش'],
  auto: ['স্বয়ংক্রিয়', 'Auto', 'تلقائي'], s: ['ছোট', 'Small', 'صغير'], m: ['মাঝারি', 'Medium', 'متوسط'], l: ['বড়', 'Large', 'كبير'], none: ['নকশা নেই', 'No pattern', 'بلا نقش'],
  ptn: { dots: ['বিন্দু', 'Dots', 'نقاط'], stripes: ['ডোরা', 'Stripes', 'خطوط'], rings: ['বলয়', 'Rings', 'حلقات'], waves: ['ঢেউ', 'Waves', 'أمواج'], stars: ['তারা', 'Stars', 'نجوم'] },
  xt: ['আপনি কি সত্যিই চলে যেতে চান?', 'Do you really want to leave?', 'هل تريد المغادرة فعلا؟'], xp: ['আপনি যতটুকু ডিজাইন করেছেন, তার পুরোটা হারিয়ে যাবে।', 'Everything you have designed so far will be lost.', 'سيضيع كل ما صممته حتى الآن.'], xk: ['সম্পাদনা করতে থাকুন', 'Keep editing', 'واصل التعديل'], xd: ['বাদ দিন', 'Discard', 'تجاهل'],
  ph: ['একটি অক্ষর লিখুন', 'Type one letter', 'اكتب حرفا واحدا'], guest: ['অতিথি', 'Guest', 'ضيف']
};
const ALPHA = ['অআইঈউঊঋএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'];
const SV = (c) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${c}</svg>`;
const TABS = [

  ['bg', SV('<path d="M12 3.500C12 3.500 5.500 10.500 5.500 14.500A6.500 6.500 0 0 0 18.500 14.500C18.500 10.500 12 3.500 12 3.500Z"/>')],
  ['ch', SV('<path d="M5 19L12 5L19 19M8 14.500H16"/>')],
  ['lc', SV('<path d="M12 4A8 8 0 1 0 12 20C13.500 20 14 19 13.500 18S13.500 15.500 15 15.500H17A3 3 0 0 0 20 12.500C20 7.500 16.500 4 12 4Z"/><circle cx="8.500" cy="11" r=".6"/><circle cx="12" cy="8" r=".6"/><circle cx="15.500" cy="10" r=".6"/>')],
  ['sz', SV('<path d="M4 7V5H14V7M9 5V19M13 12H20M16.500 12V19"/>')],
  ['pt', SV('<circle cx="6" cy="6" r="1.300"/><circle cx="12" cy="6" r="1.300"/><circle cx="18" cy="6" r="1.300"/><circle cx="6" cy="12" r="1.300"/><circle cx="12" cy="12" r="1.300"/><circle cx="18" cy="12" r="1.300"/><circle cx="6" cy="18" r="1.300"/><circle cx="12" cy="18" r="1.300"/><circle cx="18" cy="18" r="1.300"/>')]
].filter((t) => t[0] === 'bg' || t[0] === 'ch'); // এখন শুধু ব্যাকগ্রাউন্ড রং ও অক্ষর; বাকিগুলো পরে যোগ হবে
const X_IC = SV('<path d="M6 6L18 18M18 6L6 18"/>'), AR_IC = SV('<path d="M20 12H5M11 6L5 12L11 18"/>');
const acct = () => { try { return JSON.parse(localStorage.getItem('pp_last')) || {}; } catch (e) { return {}; } };
const FLAT = PAL.flat();

export function showPedit() {
  const root = $('#v-pedit'), base = getProf(), nm = acct().name || L(T.guest);
  const dflt = first(nm);
  let d = { ...base }, tab = 'bg';
  const dirty = () => JSON.stringify(d) !== JSON.stringify(base);
  const letter = () => d.ch || dflt;
  const pv = () => { const e = $('#pe-pv', root); e.setAttribute('style', bnAttrs(d)); e.innerHTML = patSvg(d.pt) + `<span class="pf-lt">${letter()}</span>`; const b = $('#pe-ok', root); if (b) b.disabled = !dirty(); };
  const tl = (on, inner, attrs, cls = '') => `<button type="button" class="tl${on ? ' on' : ''} ${cls}" ${attrs}>${inner}</button>`;
  const panel = () => {
    let g = '', cls = '';
    if (tab === 'bg') g = PAL.flat().map((h) => tl(h.toLowerCase() === d.bg.toLowerCase(), `<i class="sq" style="background:${h}"></i>`, `data-bg="${h}" aria-label="${h}"`)).join('');
    if (tab === 'lc') g = tl(d.lc === 'auto', `<i class="sq au" style="background:${d.bg}"><b>A</b></i>`, 'data-lc="auto" aria-label="' + L(T.auto) + '"') + FLAT.map((h) => tl(d.lc.toLowerCase() === h.toLowerCase(), `<i class="sq" style="background:${h}"></i>`, `data-lc="${h}" aria-label="${h}"`)).join('');
    if (tab === 'ch') { cls = 'chs'; g = [...ALPHA[IX[getLang()]]].map((c) => tl(letter() === c, `<b class="lt">${c}</b>`, `data-ch="${c}"`)).join(''); }
    if (tab === 'sz') g = [T.s, T.m, T.l].map((x, i) => tl(d.sz === i, `<b class="lt" style="font-size:${[1.2, 1.7, 2.3][i]}rem">${dflt}</b>`, `data-sz="${i}" aria-label="${L(x)}"`)).join('');
    if (tab === 'pt') g = PATS.map((k) => tl(d.pt === k, k === 'none' ? `<i class="sq no" style="background:${d.bg}"></i>` : `<i class="sq pp" style="${bnAttrs({ ...d, pt: k }).replace(/--sz:[^;]*/, '')}">${patSvg(k)}</i>`, `data-pt="${k}" aria-label="${k === 'none' ? L(T.none) : (T.ptn[k] ? L(T.ptn[k]) : L(['নকশা ','Pattern ','نمط ']) + num(k.slice(1)))}"`)).join('');
    $('#pe-pn', root).innerHTML = `<div class="pe-tabs">${TABS.map((t) => `<button type="button" class="pe-tb${t[0] === tab ? ' on' : ''}" data-tab="${t[0]}" aria-label="${L(T[t[0]])}">${t[1]}</button>`).join('')}</div><div class="pe-bd"><h2 class="t">${L(T[tab])}</h2>${tab === 'ch' ? `<input class="pe-in" id="pe-in" value="${d.ch}" placeholder="${L(T.ph)}" autocomplete="off" spellcheck="false">` : ''}<div class="pe-grid ${cls}">${g}</div></div>`;
    const inp = $('#pe-in', root);
    if (inp) inp.oninput = () => { const v = first(inp.value); if (inp.value !== v) inp.value = v; d.ch = v; pv(); $$('.tl', root).forEach((x) => x.classList.toggle('on', x.dataset.ch === letter())); };
  };
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  root.innerHTML = navHtml('me') + `<div class="ln-scroll pe" id="ln-sc"><div class="pe-wrap">
<header class="pe-hd"><button type="button" class="pe-x" data-x aria-label="${L(T.back)}"><span class="xm">${X_IC}</span><span class="xd">${AR_IC}</span></button><h1 class="t">${L(T.ti)}</h1><button type="button" class="pe-dn t" data-done>${L(T.dn)}</button></header>
<div class="pe-card"><div class="pe-pvw"><div class="pf-bn pe-pv" id="pe-pv"></div></div><div class="pe-pn" id="pe-pn"></div></div>
<div class="pe-ft"><button type="button" class="btn btn-primary" id="pe-ok" disabled>${L(T.dn)}</button></div>
</div></div>`;
  pv(); panel();
  const done = (ok) => { if (ok && dirty()) { try { localStorage.setItem('pp_prof', JSON.stringify(d)); } catch (e) {} } location.hash = '#/profile'; };
  root.onclick = (e) => {
    const nv = e.target.closest('[data-nv]'); if (nv) { goNav(nv.dataset.nv); return; }
    if (e.target.closest('[data-x]')) { if (!dirty()) { done(false); return; } dlg(root, { title: L(T.xt), text: L(T.xp), ok: L(T.xk), no: L(T.xd), onNo: () => done(false) }); return; }
    if (e.target.closest('[data-done]') || e.target.closest('#pe-ok')) { play('press'); done(true); return; }
    const t = e.target.closest('[data-tab]'); if (t) { tab = t.dataset.tab; play('press', .3); panel(); return; }
    const c = e.target.closest('.tl'); if (!c) return;
    const k = c.dataset;
    if (k.bg) d.bg = k.bg; else if (k.lc) d.lc = k.lc; else if (k.sz) d.sz = +k.sz; else if (k.pt) d.pt = k.pt; else if (k.ch) { d.ch = k.ch === dflt && !base.ch ? '' : k.ch; }
    else return;
    play('press', .3); pv();
    const keep = $('#pe-in', root); if (keep) keep.value = d.ch;
    $$('.tl', root).forEach((x) => { const m = x.dataset; x.classList.toggle('on', m.bg ? m.bg.toLowerCase() === d.bg.toLowerCase() : m.lc ? m.lc.toLowerCase() === d.lc.toLowerCase() : m.sz ? +m.sz === d.sz : m.pt ? m.pt === d.pt : m.ch === letter()); });
    if (k.lc || k.bg) { const au = $('.sq.au', root); if (au) au.style.background = d.bg; }
  };
}
