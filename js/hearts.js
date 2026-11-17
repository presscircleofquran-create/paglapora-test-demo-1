// হার্ট: সর্বোচ্চ ৫টি; কমলে প্রতি ১ ঘণ্টায় ১টি করে ফেরে (লোকাল স্টোরেজে pp_hearts ও pp_hts)
export const HOUR = 3600000;
const rd = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const wr = (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, String(v)); } catch (e) {} };
export function getHearts() {
  let h = rd('pp_hearts'); h = h === null ? 5 : Math.max(0, Math.min(5, +h || 0));
  let ts = +rd('pp_hts') || 0;
  if (h >= 5) { if (ts) wr('pp_hts', null); return 5; }
  if (!ts) { ts = Date.now(); wr('pp_hts', ts); }
  const k = Math.floor((Date.now() - ts) / HOUR);
  if (k > 0) { h = Math.min(5, h + k); wr('pp_hearts', h); if (h >= 5) wr('pp_hts', null); else wr('pp_hts', ts + k * HOUR); }
  return h;
}
export function setHearts(n) {
  const old = getHearts(); n = Math.max(0, Math.min(5, n));
  wr('pp_hearts', n);
  if (n >= 5) wr('pp_hts', null); else if (old >= 5 || !(+rd('pp_hts'))) wr('pp_hts', Date.now());
}
// পরের হার্ট আসতে বাকি মিলিসেকেন্ড (সব ভরা থাকলে ০)
export function nextIn() { const h = getHearts(); if (h >= 5) return 0; const ts = +rd('pp_hts') || Date.now(); return Math.max(0, ts + HOUR - Date.now()); }
