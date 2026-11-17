import { getLang, num } from './i18n.js';
import { play } from './sfx.js';
import { navHtml, stHtml, goNav, UNITS, CNT, ST, full, chestMap, CH_GEMS, chestImg, SI } from './learn.js';

// চেস্ট পাতা: সব গল্পের সব চেস্ট — বন্ধ / খোলার জন্য প্রস্তুত / খোলা হয়েছে
const $ = (s, r = document) => r.querySelector(s), IX = { bn: 0, en: 1, ar: 2 }, L = (a) => a[IX[getLang()]];
const J = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
const T = {
  t: ['চেস্ট', 'Chests', 'الصناديق'], left: ['বাকি', 'Left', 'متبقية'], ready: ['খোলার জন্য প্রস্তুত', 'Ready to open', 'جاهزة للفتح'], opened: ['খোলা হয়েছে', 'Opened', 'مفتوحة'], tot: ['মোট', 'Total', 'الإجمالي'],
  ch: ['চেস্ট', 'Chest', 'صندوق'], open: ['খুলুন', 'Open', 'افتح'], done: ['খোলা হয়েছে', 'Opened', 'تم الفتح'], lk: ['লেভেল শেষ হলে খুলবে', 'Opens when the levels are done', 'يُفتح عند إنهاء المستويات'],
  of: [' / ', ' / ', ' / '], lv: ['লেভেল শেষ', 'levels done', 'مستويات منتهية'], sec: ['সব চেস্ট', 'All chests', 'كل الصناديق'], mine: ['আপনার চেস্ট', 'Your chests', 'صناديقك'], earn: ['চেস্ট থেকে পাওয়া জেম', 'Gems from chests', 'الجواهر من الصناديق'], next: ['পরের চেস্ট', 'Next chest', 'الصندوق التالي'], alld: ['সব চেস্ট খোলার জন্য প্রস্তুত বা খোলা হয়েছে!', 'Every chest is ready or opened!', 'كل الصناديق جاهزة أو مفتوحة!'], how: ['একটি গল্পের সবগুলো লেভেল শেষ করলে সেই গল্পের চেস্ট খুলবে। প্রতিটি চেস্টে ১২টি জেম।', 'Finish every level of a story to unlock its chests. Each chest holds 12 gems.', 'أكمل كل مستويات القصة لفتح صناديقها. كل صندوق يحوي 12 جوهرة.'], none: ['এখনও কোনো চেস্ট নেই', 'No chests yet', 'لا صناديق بعد']
};
function data() {
  const np = J('pp_np', {}), clm = J('pp_ch', {}), out = [];
  UNITS.forEach((u, ui) => {
    const cm = chestMap(ui), ks = Object.keys(cm); if (!ks.length) return;
    const total = CNT[ui] - 0, dn = Array.from({ length: CNT[ui] }, (_, k) => full(np, ST[ui] + k)).filter(Boolean).length, all = dn === CNT[ui];
    ks.forEach((k) => { const j = cm[k].j, key = ui + '-' + j; out.push({ ui, j, key, u, ok: all, got: !!clm[key], dn, total }); });
  });
  return out;
}
export function showChests() {
  const root = $('#v-chests'), ds = data(), got = ds.filter((d) => d.got).length, rd = ds.filter((d) => d.ok && !d.got).length, left = ds.length - got, nx = ds.find((d) => !d.ok);
  const stat = (n, lab) => `<div class="ch-sm"><b>${num(n)}</b><span class="t">${L(lab)}</span></div>`;
  const box1 = `<section class="ch-bx"><h2 class="t">${L(T.mine)}</h2><div class="ch-sg">${stat(left, T.left)}${stat(rd, T.ready)}${stat(got, T.opened)}</div><div class="ch-gt"><span class="t">${L(T.earn)}</span><span class="ch-g">${SI.gem}<i>${num(got * CH_GEMS)}</i></span></div></section>`;
  const box2 = `<section class="ch-bx"><h2 class="t">${L(T.next)}</h2>${nx ? `<div class="ch-nx"><div class="ch-im sm">${chestImg(false)}</div><b class="t">${L(nx.u.t)}</b><div class="ch-pb"><i style="width:${Math.round(nx.dn / nx.total * 100)}%"></i></div><span class="t ch-pt">${num(nx.dn)}${L(T.of)}${num(nx.total)} ${L(T.lv)}</span><span class="ch-g">${SI.gem}<i>${num(CH_GEMS)}</i></span></div>` : `<p class="se-note t">${L(T.alld)}</p>`}<p class="se-note t">${L(T.how)}</p></section>`;
  const card = (d) => `<article class="ch-cd ${d.got ? 'dn' : d.ok ? 'rd' : 'lk'}"><div class="ch-im">${chestImg(d.ok)}${d.ok && !d.got ? `<span class="ch-cb">${SI.gem}<b>${num(CH_GEMS)}</b></span>` : ''}</div><div class="ch-dt"><b class="t">${L(d.u.t)}</b><span class="t ch-sb">${L(T.ch)} ${num(d.j + 1)}</span>${d.got ? `<span class="ch-st t">${L(T.done)}</span>` : d.ok ? `<button type="button" class="btn btn-primary ch-bt" data-k="${d.key}">${L(T.open)}</button>` : `<div class="ch-pb"><i style="width:${Math.round(d.dn / d.total * 100)}%"></i></div><span class="t ch-pt">${num(d.dn)}${L(T.of)}${num(d.total)} ${L(T.lv)}</span>`}</div></article>`;
  root.innerHTML = navHtml('chests') + stHtml('rc') + `<aside class="ch-rc">${box1}${box2}</aside><div class="ln-scroll ch" id="ln-sc">${stHtml('in')}<div class="ch-wrap"><header class="se-top"><h1 class="t">${L(T.t)}</h1></header><h1 class="ch-h1 t">${L(T.t)}</h1><div class="ch-gd">${ds.map(card).join('') || `<p class="se-note t">${L(T.none)}</p>`}</div><div class="ch-nr">${box1}${box2}</div></div></div>`;
  root.onclick = (e) => {
    const nv = e.target.closest('[data-nv]'); if (nv) { goNav(nv.dataset.nv); return; }
    const b = e.target.closest('[data-k]'); if (!b) return;
    const c = J('pp_ch', {}); if (c[b.dataset.k]) return; c[b.dataset.k] = 1;
    try { localStorage.setItem('pp_ch', JSON.stringify(c)); localStorage.setItem('pp_gem', String((+localStorage.getItem('pp_gem') || 0) + CH_GEMS)); } catch (x) {}
    play('press', .6); showChests();
  };
}
