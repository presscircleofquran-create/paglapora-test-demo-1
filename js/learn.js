import { first, patSvg, bnAttrs, getProf } from './pats.js';
import { logoSvg, getOnb, SUBJECTS } from './onboard.js';
// হোম পাতা (নতুন, সরল): ইউনিট-কার্ড (বড় শিরোনাম + গাইডবই বাটন) ও ৩ডি গোল বোতামের আঁকাবাঁকা পথ
import { getLang, num } from './i18n.js';
import { play } from './sfx.js';
import { coverFlat, coverRot } from './books.js';
import { signOut } from './supabase.js';
import { cardsHtml, wireCards } from './cards.js';
import { GEM_NAV, HEART_NAV, HEART_NAV_GREY } from './icons.js';
import { getHearts } from './hearts.js';

const $ = (s, r = document) => r.querySelector(s), IX = { bn: 0, en: 1, ar: 2 }, L = (a) => a[IX[getLang()]];
const T = { lockT: ['লেভেল ', 'Level ', 'المستوى '], lockF: ['চূড়ান্ত পরীক্ষা', 'Final exam', 'الاختبار النهائي'], lockM: ['এটি আনলক করার জন্য উপরের সবগুলো লেভেল কমপ্লিট করুন!', 'Complete all the levels above to unlock this one!', 'أكمل جميع المستويات أعلاه لفتح هذا المستوى!'], lockB: ['লক করা', 'Locked', 'مقفل'], guide: ['গাইডবই', 'Guide', 'الدليل'], start: ['শুরু করুন', 'Start', 'ابدأ'], jump: ['সরাসরি এখানে আসবেন?', 'Jump straight here?', 'تريد القفز إلى هنا؟'], les: ['লেসন ', 'Lesson ', 'الدرس '], go: ['শুরু করুন', 'START', 'ابدأ'], pr: ['আবার অনুশীলন', 'PRACTICE AGAIN', 'تدرب مرة أخرى'], xp: ['পয়েন্ট', 'XP', 'نقطة'] };
export const UNITS = [
  { t: ['শুরুর পাঠ', 'First steps', 'الخطوات الأولى'], c: '#52bbee', d: '#2299d6' },
  { t: ['মহারাজার বাড়ি', "Maharaja's house", 'بيت المهراجا'], c: '#cd7cf8', d: '#a65bd6' },
  { t: ['তৃতীয় গল্প', 'Third story', 'القصة الثالثة'], c: '#58cc02', d: '#46a302' },
  { t: ['চতুর্থ গল্প', 'Fourth story', 'القصة الرابعة'], c: '#ff9600', d: '#d97f00' },
  { t: ['পঞ্চম গল্প', 'Fifth story', 'القصة الخامسة'], c: '#f472c8', d: '#cc4fa3' },
  { t: ['ষষ্ঠ গল্প', 'Sixth story', 'القصة السادسة'], c: '#1fc7a8', d: '#14a086' }
];
// মসৃণ আঁকাবাঁকা সাপের পথ: ১ম বোতাম মাঝে, ৩য় বামের চূড়ায়, ৭ম ডানের চূড়ায়... (সাইন-ঢেউ)
// আঁকাবাঁকা পথ (Duolingo-র মতো): প্রতি গল্পের প্রথম ও শেষ বাটন ঠিক মাঝখানে, মাঝেরগুলো মসৃণ অর্ধ-ঢেউ।
// গল্প বদলালে দিক উল্টে যায় (বাঁ → ডান → বাঁ ...), তাই পুরো পথ সাপের মতো; বাটন যত বেশিই হোক নিয়ম একই।
const AMPK = 1.0, DST = 1.09; // DST: দুই বাটনের কেন্দ্রের সোজা দূরত্ব (বাটন-প্রস্থের গুণ) — সবসময় সমান
// প্রতি গল্পের বিন্যাস: সমান কেন্দ্র-দূরত্বে বসানো, প্রথম ও শেষ বাটন মাঝখানে, মসৃণ S-বাঁক।
// ফেরত: [{x (বাটন-প্রস্থ এককে), dy (পরের বাটনের কেন্দ্র পর্যন্ত খাড়া দূরত্ব)}]
const LAY = {};
function layout(n) {
  if (LAY[n]) return LAY[n];
  if (n < 3) return (LAY[n] = Array.from({ length: n }, () => ({ x: 0, dy: DST })));
  const m = Math.max(1, Math.round((n - 1) / 3.5)), X = (y, w) => AMPK * Math.sin(Math.PI * y / w);
  const walk = (w) => { const ys = [0]; let y = 0; for (let i = 1; i < n; i++) { let lo = y, hi = y + DST; for (let j = 0; j < 40; j++) { const mid = (lo + hi) / 2; (Math.hypot(X(mid, w) - X(y, w), mid - y) < DST ? lo = mid : hi = mid); } y = (lo + hi) / 2; ys.push(y); } return ys; };
  const T = (n - 1) * DST / m; let lo = T * .3, hi = T;
  for (let j = 0; j < 50; j++) { const mid = (lo + hi) / 2, ys = walk(mid); (ys[n - 1] - m * mid > 0 ? lo = mid : hi = mid); }
  const w = (lo + hi) / 2, ys = walk(w);
  return (LAY[n] = ys.map((y, i) => ({ x: i === 0 || i === n - 1 ? 0 : X(y, w), dy: i < n - 1 ? ys[i + 1] - y : DST })));
}
const KOF = (ui, k, n) => (ui % 2 ? 1 : -1) * layout(n)[k].x;
const PLAYS = { 3: 4, 10: 3, 15: 2, 30: 1 };
export const CNT = [5, 7, 5, 6, 8, 7]; // প্রতি গল্পে বাটন সংখ্যা (শেষটি ট্রফি)
export const ST = CNT.map((_, i) => CNT.slice(0, i).reduce((a, b) => a + b, 0)); export const TOT = CNT.reduce((a, b) => a + b, 0);
const unitOf = (g) => { let i = 0; while (i + 1 < CNT.length && g >= ST[i + 1]) i++; return i; };
const GUIDE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="4.200" cy="6.500" r="1.500" fill="#fff"/><circle cx="4.200" cy="12" r="1.500" fill="#fff"/><circle cx="4.200" cy="17.500" r="1.500" fill="#fff"/><rect x="6.500" y="2.500" width="14" height="19" rx="3" fill="#fff"/><path d="M9.500 8H17.500M9.500 12H17.500M9.500 16H14.500" stroke="var(--g)" stroke-width="2" stroke-linecap="round"/></svg>';
const FWD_NOTE = 0;
// বোতাম: ছবির মতো ৩ডি চাকতি (ওপরে হালকা মুখ, নিচে গাঢ় পুরুত্ব) + সাদা আইকন
const STAR_P = "M12.00 5.20 L14.41 9.28 L19.04 10.31 L15.90 13.87 L16.35 18.59 L12.00 16.70 L7.65 18.59 L8.10 13.87 L4.96 10.31 L9.59 9.28Z";
const WING = 'M9 17C6 16 4.500 18 5.500 21C6 22.500 8 23.500 7 25C6 26.500 4 27 4.500 28.500C5 30 7 30.500 9 30C10.500 33 12 34.500 13 34C14 33.500 13.500 31 12.500 29C11.500 27 12 25 12 23C12 20 11 18 9 17Z';
const CUP = 'M17 6C21 5 24 8.500 30 8.500C36 8.500 39 5 43 6C45 6.500 45.500 8 45.500 10V24C45.500 33 39 38 33 39.500C31.500 40 31 41 31 42.500C31 44 32.500 44.500 34.500 45C37 45.500 40 46.500 41 48.500C41.500 49.500 41 50.500 39.500 50.500H20.500C19 50.500 18.500 49.500 19 48.500C20 46.500 23 45.500 25.500 45C27.500 44.500 29 44 29 42.500C29 41 28.500 40 27 39.500C21 38 14.500 33 14.500 24V10C14.500 8 15 6.500 17 6Z';
let nid = 0;
// পাঠের প্রতীক (২৪×২৪ বাক্সে আঁকা, সাদা): বই, ধারণা, শোনা, লেখা, আলোচনা, প্রশ্ন, বলা
const ICO = {
  book: (c) => `<path d="M2.600 6.800C5.400 5.400 8.600 5.500 10.800 7.200V19C8.600 17.400 5.400 17.300 2.600 18.600Z M21.400 6.800C18.600 5.400 15.400 5.500 13.200 7.200V19C15.400 17.400 18.600 17.300 21.400 18.600Z" fill="${c}" stroke="${c}" stroke-width=".9" stroke-linejoin="round"/>`,
  bulb: (c) => `<path d="M12 3.200A6.200 6.200 0 0 0 8.300 14.400C9 15 9.400 15.700 9.400 16.500V17H14.600V16.500C14.600 15.700 15 15 15.700 14.400A6.200 6.200 0 0 0 12 3.200Z M9.800 19H14.200V19.800A1.600 1.600 0 0 1 12.600 21.400H11.400A1.600 1.600 0 0 1 9.800 19.800Z" fill="${c}" stroke="${c}" stroke-width="1.100" stroke-linejoin="round"/>`,
  phones: (c) => `<path d="M5.200 14.500V12.500A6.800 6.800 0 0 1 18.800 12.500V14.500" fill="none" stroke="${c}" stroke-width="2.300" stroke-linecap="round"/><path d="M3.800 13.600H7.200V19.200H5.400A1.600 1.600 0 0 1 3.800 17.600Z M20.200 13.600H16.800V19.200H18.600A1.600 1.600 0 0 0 20.200 17.600Z" fill="${c}" stroke="${c}" stroke-width="1.100" stroke-linejoin="round"/>`,
  pen: (c) => `<path d="M6.400 14.700L16.500 4.600A2 2 0 0 1 19.300 4.600L19.600 4.900A2 2 0 0 1 19.600 7.700L9.500 17.800Z M5.300 15.900L8.400 19L4.200 20.100Z" fill="${c}" stroke="${c}" stroke-width="1.100" stroke-linejoin="round"/>`,
  chat: (c) => `<path d="M12 4.200C7.400 4.200 3.800 7.200 3.800 11C3.800 13.100 4.900 15 6.600 16.200L6 19.800L9.600 17.900C10.400 18.100 11.200 18.200 12 18.200C16.600 18.200 20.200 15.200 20.200 11.400C20.200 7.200 16.600 4.200 12 4.200Z" fill="${c}" stroke="${c}" stroke-width="1.100" stroke-linejoin="round"/>`,
  ask: (c) => `<path d="M8.800 9.200A3.200 3.200 0 1 1 13.700 12C12.600 12.700 12 13.300 12 14.600" fill="none" stroke="${c}" stroke-width="2.700" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="19" r="1.700" fill="${c}"/>`,
  mic: (c) => `<path d="M9 5.400A3 3 0 0 1 15 5.400V11A3 3 0 0 1 9 11Z" fill="${c}" stroke="${c}" stroke-width="1.100" stroke-linejoin="round"/><path d="M5.800 11A6.200 6.200 0 0 0 18.200 11M12 17.200V20.600" fill="none" stroke="${c}" stroke-width="2.100" stroke-linecap="round"/>`
};
ICO.star = (c) => `<path d="${STAR_P}" fill="${c}" stroke="${c}" stroke-width="3.400" stroke-linejoin="round"/>`;
const LES = ['star'];

const GEAR = '<path fill-rule="evenodd" d="M16 7.500A8.500 8.500 0 1 1 16 24.500A8.500 8.500 0 0 1 16 7.500ZM16 12.400A3.600 3.600 0 1 0 16 19.600A3.600 3.600 0 0 0 16 12.400Z"/><rect x="14" y="2.800" width="4" height="5.500" rx="1.500" transform="rotate(0 16 16)"/><rect x="14" y="2.800" width="4" height="5.500" rx="1.500" transform="rotate(45 16 16)"/><rect x="14" y="2.800" width="4" height="5.500" rx="1.500" transform="rotate(90 16 16)"/><rect x="14" y="2.800" width="4" height="5.500" rx="1.500" transform="rotate(135 16 16)"/><rect x="14" y="2.800" width="4" height="5.500" rx="1.500" transform="rotate(180 16 16)"/><rect x="14" y="2.800" width="4" height="5.500" rx="1.500" transform="rotate(225 16 16)"/><rect x="14" y="2.800" width="4" height="5.500" rx="1.500" transform="rotate(270 16 16)"/><rect x="14" y="2.800" width="4" height="5.500" rx="1.500" transform="rotate(315 16 16)"/>';
const NV = [
  ['learn', ['শিখুন', 'Learn', 'تعلّم'], '<path d="M16 8.500L24.800 15.500L22.800 26Q22.600 27.500 21 27.500H11Q9.400 27.500 9.200 26L7.200 15.500Z" fill="#ffc800" stroke="#ffc800" stroke-width="1" stroke-linejoin="round"/><path d="M3.800 15.200L16 4.800L28.200 15.200" fill="none" stroke="#ff4b4b" stroke-width="4.600" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="17.800" r="3.400" fill="#9b5858"/><rect x="12.600" y="23" width="6.800" height="1.900" rx=".95" fill="#cf9a1e"/>'],
  ['board', ['লিডারবোর্ড', 'Leaderboard', 'لوحة المتصدرين'], '<defs><clipPath id="nvsh"><path d="M6.500 4.500H25.500Q27.500 4.500 27.500 6.500V16.500Q27.500 27.500 16 29Q4.500 27.500 4.500 16.500V6.500Q4.500 4.500 6.500 4.500Z"/></clipPath></defs><path d="M6.500 4.500H25.500Q27.500 4.500 27.500 6.500V16.500Q27.500 27.500 16 29Q4.500 27.500 4.500 16.500V6.500Q4.500 4.500 6.500 4.500Z" fill="#ffc800"/><path clip-path="url(#nvsh)" d="M19 3H30V9L11 31H3V25Z" fill="#ffd94d"/>'],
  ['shop', ['শপ', 'Shop', 'المتجر'], '<g transform="scale(.6957)"><path d="M40 36V17H6V36C6 38.2091 7.73969 40 9.88571 40H36.1143C38.2603 40 40 38.2091 40 36Z" fill="#A56644"/><path d="M4 10C4 7.79086 5.79086 6 8 6H17V17H4V10Z" fill="#EA2B2B"/><path d="M4 17H17V17.5C17 21.0899 14.0899 24 10.5 24C6.91015 24 4 21.0899 4 17.5V17Z" fill="#FF4945"/><path d="M17 17H29V17.5C29 21.0899 26.3137 24 23 24C19.6863 24 17 21.0899 17 17.5V17Z" fill="white"/><path d="M29 17H42V17.5C42 21.0899 39.0899 24 35.5 24C31.9101 24 29 21.0899 29 17.5V17Z" fill="#FF4945"/><path d="M17 6H29V17H17V6Z" fill="#D0D0D0"/><path d="M29 6H38C40.2091 6 42 7.79086 42 10V17H29V6Z" fill="#EA2B2B"/><path d="M11 30C11 28.8954 11.8954 28 13 28H18C19.1046 28 20 28.8954 20 30V40H11V30Z" fill="#B9E8FF"/><path d="M24 30C24 28.8954 24.8954 28 26 28H34C35.1046 28 36 28.8954 36 30V34C36 35.1046 35.1046 36 34 36H26C24.8954 36 24 35.1046 24 34V30Z" fill="#B9E8FF"/></g>'],
  ['chests', ['চেস্ট', 'Chests', 'الصناديق'], ''],
  ['me', ['প্রোফাইল', 'Profile', 'الملف الشخصي'], ''],
  ['more', ['অন্যান্য', 'More', 'المزيد'], '<circle cx="16" cy="16" r="13" fill="#cd7cf8"/><circle cx="10.500" cy="16" r="1.900" fill="#fff"/><circle cx="16" cy="16" r="1.900" fill="#fff"/><circle cx="21.500" cy="16" r="1.900" fill="#fff"/>']
];
const SIL = '<svg viewBox="0 0 32 32" aria-hidden="true"><defs><clipPath id="nvme"><circle cx="16" cy="16" r="13.500"/></clipPath></defs><circle cx="16" cy="16" r="13.500" fill="#e9a655"/><g clip-path="url(#nvme)"><ellipse cx="16" cy="30.500" rx="8.500" ry="6" fill="#b57edc"/></g><rect x="13.200" y="21" width="5.600" height="6" fill="#6e3b3b"/><circle cx="8.800" cy="15.500" r="1.900" fill="#75423f"/><circle cx="23.200" cy="15.500" r="1.900" fill="#75423f"/><rect x="9.300" y="7.500" width="13.400" height="15" rx="3.200" fill="#75423f"/><path d="M9.300 13V10Q9.300 6.500 13 6.300Q15.500 4.600 19.500 5.800Q22.700 6.800 22.700 10.500V13Q20 11 16 10.800Q11.500 10.600 9.300 13Z" fill="#404040"/></svg>';
// প্রোফাইল সাজানো না থাকলে মানুষের ছায়া-আইকন; সাজানো থাকলে নিজের অ্যাভাটার
const meIcon = () => {
  let p = null, a = null; try { p = JSON.parse(localStorage.getItem('pp_prof')); a = JSON.parse(localStorage.getItem('pp_last')); } catch (e) {}
  if (!p) return SIL;
  p = getProf(); const ch = p.ch || first((a && a.name) || '') || 'P';
  return `<em class="nv-av" style="${bnAttrs(p)}">${patSvg(p.pt)}<b>${ch.replace(/[<>&]/g, '')}</b></em>`;
};
let NVK = 0;
export const navHtml = (act = 'learn') => (++NVK, `<nav class="nv" aria-label="menu"><div class="nv-lg">${logoSvg('wm')}</div>${NV.map((n) => `<button type="button" class="nv-i${n[0] === act ? ' on' : ''}" data-nv="${n[0]}" aria-label="${L(n[1])}"${n[0] === act ? ' aria-current="page"' : ''}>${n[0] === 'me' ? meIcon() : n[0] === 'chests' ? `<svg viewBox="0 0 32 32" aria-hidden="true"><g transform="translate(-.4 2.900) scale(.039)">${CH_CB.replace(/<rect x="30"[^>]*\/>/, '')}</g></svg>` : `<svg viewBox="0 0 32 32" aria-hidden="true">${n[2]}</svg>`}<span>${L(n[1])}</span></button>`).join('')}</nav>`).replace(/nv(sh|me)/g, (m) => m + NVK);

// উপরের সারি: শেখা বই (সমতল), কয়েন, জেম, হার্ট — কার্টুন ধাঁচের আইকন
export const goNav = (k) => { const r = { learn: '/learn', me: '/profile', chests: '/chests', shop: '/shop', board: '/board' }[k]; if (r) location.hash = '#' + r; };

// "অন্যান্য" বাটনের মেনু (বড় পর্দা): মাউস রাখলে বা ক্লিক করলে ডানে বাক্স — উপরে অ্যাপের নাম, রেখা, তারপর সেটিংস / হেল্প / লগ আউট
const MN = { set: ['সেটিংস', 'Settings', 'الإعدادات'], help: ['হেল্প', 'Help', 'المساعدة'], out: ['লগ আউট করুন', 'Log out', 'تسجيل الخروج'], soon: ['সহায়তা পাতা শীঘ্রই আসছে', 'Help page is coming soon', 'صفحة المساعدة قريبا'] };
let mnPin = false, mnTm = 0;
const closeMenu = () => { clearTimeout(mnTm); mnPin = false; const m = document.getElementById('nv-mn'); if (m) m.remove(); document.querySelectorAll('.nv-i[data-nv="more"]').forEach((b) => b.removeAttribute('data-open')); };
const openMenu = (b) => {
  if (document.getElementById('nv-mn')) return;
  const r = b.getBoundingClientRect(), nv = b.closest('.nv').getBoundingClientRect(), m = document.createElement('div'); m.id = 'nv-mn'; m.setAttribute('role', 'menu');
  m.innerHTML = `<div class="mn-h t">paglapora</div><button type="button" role="menuitem" data-mn="set" class="t">${L(MN.set)}</button><button type="button" role="menuitem" data-mn="help" class="t">${L(MN.help)}</button><button type="button" role="menuitem" data-mn="out" class="t">${L(MN.out)}</button>`;
  m.style.cssText = `left:${nv.right + 10}px;top:${Math.max(8, Math.min(r.top - 12, innerHeight - 270))}px`;
  document.body.appendChild(m); b.setAttribute('data-open', '');
};
const soon = () => { let t = document.getElementById('nv-ts'); if (!t) { t = document.createElement('div'); t.id = 'nv-ts'; document.body.appendChild(t); } t.textContent = L(MN.soon); t.hidden = false; clearTimeout(soon.h); soon.h = setTimeout(() => { t.hidden = true; }, 2200); };
const isMore = (e) => e.target.closest && e.target.closest('.nv-i[data-nv="more"]');
document.addEventListener('mouseover', (e) => { if (!matchMedia('(hover:hover)').matches) return; const b = isMore(e); if (b) { clearTimeout(mnTm); openMenu(b); } else if (e.target.closest && e.target.closest('#nv-mn')) clearTimeout(mnTm); });
document.addEventListener('mouseout', (e) => { if (mnPin || !matchMedia('(hover:hover)').matches) return; if ((isMore(e) || (e.target.closest && e.target.closest('#nv-mn'))) && !(e.relatedTarget && e.relatedTarget.closest && (e.relatedTarget.closest('#nv-mn') || e.relatedTarget.closest('.nv-i[data-nv="more"]')))) { clearTimeout(mnTm); mnTm = setTimeout(closeMenu, 220); } });
document.addEventListener('click', (e) => {
  const it = e.target.closest('#nv-mn [data-mn]');
  if (it) { const k = it.dataset.mn; closeMenu(); if (k === 'set') location.hash = '#/settings'; else if (k === 'help') soon(); else (async () => { await signOut(); let a = null; try { a = JSON.parse(localStorage.getItem('pp_last')); } catch (x) {} location.hash = a && a.email ? '#/welcome' : '#/login'; })(); return; }
  const b = isMore(e);
  if (!b) { if (!e.target.closest('#nv-mn')) closeMenu(); return; }
  e.stopPropagation(); if (mnPin) { closeMenu(); return; }
  closeMenu(); openMenu(b); mnPin = true;
}, true);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
addEventListener('hashchange', closeMenu);
export const LS = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : +v || 0; } catch (e) { return d; } };
const STDEFS = '';
const HP = 'M12 6.100C10.900 4.600 9.300 3.800 7.500 3.800 4.300 3.800 1.800 6.300 1.800 9.300c0 1.900.8 3.400 2.100 4.500l6.700 6c.8.7 2 .7 2.800 0l6.700-6c1.300-1.100 2.100-2.600 2.100-4.500 0-3-2.500-5.500-5.700-5.500-1.800 0-3.400.8-4.500 2.300z';
export const SI = {
  coin: '<svg viewBox="0 0 34 34" aria-hidden="true" focusable="false"><circle cx="17" cy="17" r="14.500" fill="#FFC800" stroke="white" stroke-width="2"/><circle cx="17" cy="17" r="9.400" fill="none" stroke="#F0A500" stroke-width="2"/><path d="M9.800 12.600C11.200 9.700 13.700 8.100 16.300 7.700C17.400 7.600 17.800 8.900 16.900 9.500C14.700 10.900 13.200 12.600 12.200 14.700C11.700 15.800 9.400 13.800 9.800 12.600Z" fill="#FFF3B8"/></svg>',
  gem: GEM_NAV,
  heart: HEART_NAV,
  heartZ: HEART_NAV_GREY
};
export const stHtml = (cls) => {
  const sj = SUBJECTS.find((x) => x.id === ((() => { try { return localStorage.getItem('pp_subj'); } catch (e) { return ''; } })() || (getOnb() || {}).subject)) || SUBJECTS.find((x) => x.id === 'bangla1') || SUBJECTS[0];
  const hr = getHearts(), sess = Object.values((() => { try { return JSON.parse(localStorage.getItem('pp_np')) || {}; } catch (e) { return {}; } })()).reduce((a, v) => a + (+v || 0), 0);
  return `<div class="ln-st ${cls}"><span class="st-i st-bk" title="${L(sj.n)}" aria-label="${L(sj.n)}">${coverRot(sj)}<b>${num(sess)}</b></span><span class="st-i st-co">${SI.coin}<b>${num(LS('pp_coin', 0))}</b></span><span class="st-i st-gm">${SI.gem}<b>${num(LS('pp_gem', 0))}</b></span><span class="st-i st-hr${hr ? '' : ' z'}">${hr ? SI.heart : SI.heartZ}<b>${num(hr)}</b></span></div>`;
};
function nodeSvg(kind, st, c, d, frac) {
  const LT = document.documentElement.dataset.theme === 'light', lock = st === 'lock', top = lock ? (LT ? '#e5e5e5' : '#37464f') : c, dk = lock ? (LT ? '#b7b7b7' : '#26343b') : d, ic = lock ? (LT ? '#afafaf' : '#52656d') : '#fff', id = 'nc' + (++nid);
  const cur = st === 'cur' && !!ICO[kind], SP = (cx, cy, f) => `translate(${(cx - 12 * f).toFixed(2)} ${(cy - 12 * f).toFixed(2)}) scale(${f})`;
  let ico = '';
  if (kind === 'check') ico = `<path d="M35 42L46 53L66 32" fill="none" stroke="${ic}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
  else if (kind === 'trophy') ico = `<g transform="translate(31.400 25.600) scale(.62)" fill="${ic}"><path d="${CUP}"/><path d="${WING}"/><path d="${WING}" transform="translate(60 0) scale(-1 1)"/></g>`;
  else if (kind === 'jump') ico = `<g transform="translate(0 3)" fill="${ic}" stroke="${ic}" stroke-width="4.500" stroke-linejoin="round"><path d="M32 28V52L52 40Z"/><path d="M48 28V52L70 40Z"/></g>`;
  else if (cur) ico = `<g transform="translate(50 51)"><g class="stsh"><g class="rt"><g transform="translate(-24.600 -24.600) scale(2.050)">${ICO[kind](d)}</g></g></g></g><g transform="translate(50 43)"><g class="stj"><g class="rt"><g transform="translate(-24.600 -24.600) scale(2.050)">${ICO[kind]('#fff')}</g></g></g></g>`;
  else ico = `<g transform="${SP(50, 43, 2.05)}">${(ICO[kind] || ICO.book)(ic)}</g>`;
  let ring = '';
  if (st === 'cur') { const dn = Math.max(0, Math.min(4, frac || 0)), RT = LT ? '#e5e5e5' : '#37464f'; for (let i = 0; i < 4; i++) { const a0 = (-90 + 90 * i + 5) * Math.PI / 180, a1 = (-90 + 90 * (i + 1) - 5) * Math.PI / 180, P = (a) => `${(50 + 51.5 * Math.cos(a)).toFixed(2)} ${(47.5 + 49 * Math.sin(a)).toFixed(2)}`; ring += `<path d="M${P(a0)}A51.5 49 0 0 1 ${P(a1)}" fill="none" stroke="${i < dn ? c : RT}" stroke-width="9" stroke-linecap="round"/>`; } }
  return `<svg viewBox="10 10 80 75" overflow="visible" aria-hidden="true">${ring}<ellipse cx="50" cy="52" rx="40" ry="33" fill="${dk}"/><g class="tp"><ellipse cx="50" cy="43" rx="40" ry="33" fill="${top}"/>${ico}</g></svg>`;
}
const rd = (k) => { try { return +localStorage.getItem(k) || 0; } catch (e) { return 0; } };
const today = () => new Date().toISOString().slice(0, 10);
const J = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
const SV = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const need = () => 4; // একটি বোতাম ৪ বার খেলতে হয় (৪ সেশন)
export const SESS_XP = 10;
const nodeNeed = (g) => (g === ST[unitOf(g)] + CNT[unitOf(g)] - 1 ? 1 : need());
export const totalXp = () => { let t = 0; for (let g = 0; g < TOT; g++) t += nodeNeed(g) * SESS_XP; return t; }; // সব বোতামের XP-র যোগফল (কনটেন্ট বদলালে নিজে হিসাব হয়)
const cnt = (np, g) => np[g] || 0;
export const full = (np, g) => cnt(np, g) >= nodeNeed(g);
const SK = () => J('pp_sk', []);
const curNode = (np) => { const sk = SK(); for (let g = 0; g < TOT; g++) if (!full(np, g) && !sk.includes(g)) return g; return -1; };
const ld = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
export const weekKey = () => { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 1) % 7)); return ld(d); }; // সপ্তাহ শনিবার থেকে শুরু
export const weekXp = () => { const o = J('pp_xpw', {}); return o.w === weekKey() ? (+o.xp || 0) : 0; };
export const daysPlayed = () => J('pp_days', []);
export const ldate = ld;
export function addLesson(xp) {
  try {
    const np = J('pp_np', {}), c = curNode(np), g = +sessionStorage.getItem('pp_node'); if (c >= 0 && g === c) { np[c] = cnt(np, c) + 1; SV('pp_np', np); }
    localStorage.setItem('pp_lessons', String(rd('pp_lessons') + 1)); localStorage.setItem('pp_xp', String(rd('pp_xp') + xp));
    const d = ld(); let o = J('pp_xpd', {}); if (o.d !== d) o = { d, xp: 0 }; o.xp += xp; SV('pp_xpd', o);
    let w = J('pp_xpw', {}); if (w.w !== weekKey()) w = { w: weekKey(), xp: 0 }; w.xp += xp; SV('pp_xpw', w);
    const ds = daysPlayed(); if (!ds.includes(d)) { ds.push(d); SV('pp_days', ds); }
    let n = 0; const t = new Date(); if (!ds.includes(ld(t))) t.setDate(t.getDate() - 1); while (ds.includes(ld(t))) { n++; t.setDate(t.getDate() - 1); } localStorage.setItem('pp_streak', String(n));
  } catch (e) {}
}

// চেস্ট: প্রতিটি অর্ধ-বাঁকের উল্টো দিকের ফাঁকা জায়গায়; গল্পের সব লেভেল শেষ হলে সোনালি ও খোলা, না হলে ধূসর ও বন্ধ
export const CH_GEMS = 12;
const CHT = { t: ['চেস্ট', 'Chest', 'الصندوق'], m: (n) => ['এই গল্পের সবগুলো লেভেল শেষ করলে চেস্ট খুলবে এবং ' + num(n) + 'টি জেম পাবেন!', 'Finish every level of this story to open the chest and win ' + n + ' gems!', 'أكمل جميع مستويات هذه القصة لفتح الصندوق والفوز بـ ' + num(n) + ' جوهرة!'] };
// ছবি দেখে আঁকা: বন্ধ (ধূসর-নীল) ও খোলা (সোনালি) চেস্ট; ছবির পিক্সেল মাপে আঁকা, গ্রুপ-স্কেলে ১০০x৯০-এ বসানো
const CH_LB = '<defs><clipPath id="cqa"><rect x="93" y="40" width="140" height="590" rx="16"/></clipPath><clipPath id="cqb"><rect x="605" y="40" width="140" height="590" rx="16"/></clipPath></defs><rect x="30" y="295" width="780" height="390" rx="34" fill="#2a3238"/><rect x="233" y="70" width="372" height="300" fill="#414d55"/><rect x="233" y="150" width="372" height="32" fill="#2e4351"/><rect x="233" y="182" width="372" height="83" fill="#3e4a52"/><rect x="233" y="265" width="372" height="105" fill="#2d4150"/><rect x="62" y="170" width="64" height="312" rx="26" fill="#6a8296"/><rect x="716" y="170" width="64" height="312" rx="26" fill="#6a8296"/><rect x="233" y="480" width="372" height="125" fill="#3b4a55"/><rect x="233" y="522" width="372" height="26" fill="#2d3f4c"/><rect x="233" y="576" width="372" height="30" fill="#2d3f4c"/><rect x="233" y="335" width="372" height="40" fill="#7a94a8"/><rect x="62" y="372" width="718" height="110" rx="8" fill="#5b7487"/><rect x="62" y="470" width="718" height="12" fill="#4d6376"/><g clip-path="url(#cqa)"><rect x="93" y="40" width="140" height="590" fill="#5a7084"/><rect x="93" y="40" width="140" height="195" fill="#6c869b"/><path d="M93 165L233 125V235H93Z" fill="#7c97ac"/><rect x="93" y="484" width="140" height="146" fill="#6d8599"/></g><g clip-path="url(#cqb)"><rect x="605" y="40" width="140" height="590" fill="#5a7084"/><rect x="605" y="40" width="140" height="195" fill="#6d8699"/><path d="M605 155L745 100V235H605Z" fill="#7d98ad"/><rect x="605" y="484" width="140" height="146" fill="#6d8599"/></g><rect x="316" y="295" width="202" height="100" rx="24" fill="#6e869a"/><rect x="316" y="295" width="46" height="100" rx="24" fill="#8ba2b5"/><rect x="316" y="345" width="202" height="170" rx="26" fill="#5d7488" stroke="#4d6275" stroke-width="8"/><circle cx="417" cy="405" r="37" fill="#2d3d4b"/><path d="M391 438H443L452 480H382Z" fill="#2d3d4b"/>';
const CH_CB = CH_LB.replace(/#[0-9a-f]{6}/g, (c) => ({ '#2a3238': '#3a464b', '#414d55': '#8a5200', '#2e4351': '#6b3d00', '#3e4a52': '#7a4800', '#2d4150': '#6b3d00', '#6a8296': '#f2b400', '#3b4a55': '#8a5200', '#2d3f4c': '#5e3700', '#7a94a8': '#ffe94d', '#5b7487': '#ffe400', '#4d6376': '#f1c600', '#5a7084': '#f2b400', '#6c869b': '#ffd419', '#7c97ac': '#ffe14d', '#6d8599': '#e0a000', '#6d8699': '#fff200', '#7d98ad': '#fff56a', '#6e869a': '#ffe84d', '#8ba2b5': '#fff59a', '#5d7488': '#ffd60a', '#4d6275': '#d9a000', '#2d3d4b': '#b8780a' }[c] || c));
const CH_OB = '<rect x="33" y="125" width="240" height="148" rx="16" fill="#414b4f"/><rect x="55" y="5" width="44" height="64" rx="5" fill="#f4b800"/><path d="M55 10Q55 5 60 5H94Q99 5 99 10V16L55 36Z" fill="#ffd419"/><rect x="211" y="5" width="44" height="64" rx="5" fill="#fff200"/><path d="M211 10Q211 5 216 5H250Q255 5 255 10V16L211 36Z" fill="#fffa8c"/><rect x="99" y="28" width="112" height="40" fill="#d08800"/><rect x="55" y="104" width="195" height="102" rx="6" fill="#f2b600"/><rect x="72" y="106" width="163" height="40" fill="#7a4800"/><rect x="72" y="146" width="163" height="44" fill="#a86100"/><rect x="72" y="190" width="163" height="16" fill="#f7c100"/><rect x="55" y="190" width="195" height="16" rx="5" fill="#eaa900"/><rect x="100" y="206" width="110" height="46" fill="#d88a00"/><rect x="100" y="224" width="110" height="5" fill="#bd7400"/><rect x="55" y="206" width="44" height="46" rx="4" fill="#f2b400"/><rect x="211" y="206" width="44" height="46" rx="4" fill="#f2b400"/><rect x="42" y="58" width="220" height="48" rx="9" fill="#ffe400"/><path d="M262 66Q262 58 254 58H190L148 106H254Q262 106 262 98Z" fill="#fff35a"/><rect x="42" y="98" width="220" height="8" rx="4" fill="#f1c600"/><rect x="42" y="58" width="220" height="6" rx="3" fill="#fff06a"/><rect x="125" y="48" width="66" height="60" rx="13" fill="#ffd60a"/><rect x="125" y="48" width="66" height="9" rx="4" fill="#ffe84d"/><circle cx="158" cy="76" r="10" fill="#b8780a"/><path d="M152 81H164L167 96H149Z" fill="#b8780a"/>';
const CH_LOCK = `<svg viewBox="0 0 100 90" aria-hidden="true"><g transform="translate(0 1.700) scale(.1195)">${CH_LB}</g></svg>`;
const CH_OPEN = `<svg viewBox="0 0 100 90" aria-hidden="true"><g transform="translate(2.100 0) scale(.318)">${CH_OB}</g></svg>`;
export const chestClosedColor = () => `<svg viewBox="0 0 100 90" aria-hidden="true"><g transform="translate(0 1.700) scale(.1195)">${CH_CB}</g></svg>`;
export const chestImg = (open) => open ? CH_OPEN : CH_LOCK;
const chestHtml = (ui, j, ok, got) => `<button type="button" class="ln-ch ${ok ? (got ? 'dn' : 'rd') : 'lk'}" data-ch="${ui}-${j}" aria-label="${L(CHT.t)}">${ok ? CH_OPEN : CH_LOCK}${ok && !got ? `<span class="ln-cb">${SI.gem}<b>${num(CH_GEMS)}</b></span>` : ''}</button>`;
export const chestMap = (ui) => {
  const n = CNT[ui], m = {}; if (n < 3) return m;
  const Ly = layout(n), s = ui % 2 ? 1 : -1; let grp = [];
  const flush = () => { if (!grp.length) return; let p = grp[0]; grp.forEach((k) => { if (Math.abs(Ly[k].x) > Math.abs(Ly[p].x)) p = k; }); const j = Object.keys(m).length; m[p] = { cx: -Math.sign(s * Ly[p].x) * 1.5, j }; grp = []; };
  for (let k = 1; k < n - 1; k++) { if (grp.length && Math.sign(Ly[k].x) !== Math.sign(Ly[grp[0]].x)) flush(); grp.push(k); }
  flush(); return m;
};

export function showLearn() {
  const root = $('#v-learn'), o = getOnb();
  try { if (o.goal) localStorage.setItem('pp_goal', String(o.goal)); } catch (e) {}
  const np = J('pp_np', {}), cur = curNode(np);
  let path = '';
  const clm = J('pp_ch', {});
  UNITS.forEach((u, ui) => {
    const cm = chestMap(ui), udone = Array.from({ length: CNT[ui] }, (_, k) => full(np, ST[ui] + k)).every(Boolean);
    path += ui ? `<div class="ln-sep" data-u="${ui}"><i></i><span>${L(u.t)}</span><i></i></div>` : `<div class="ln-sep" data-u="0"></div>`;
    for (let k = 0; k < CNT[ui]; k++) {
      const g = ST[ui] + k, kx = KOF(ui, k, CNT[ui]), rb = layout(CNT[ui])[k].dy - .9375, trophy = k === CNT[ui] - 1, dn = full(np, g), isCur = g === cur, jmp = !dn && !isCur && k === 0 && ui > 0 && !SK().includes(g), stt = dn ? 'done' : isCur ? 'cur' : jmp ? 'jmp' : 'lock';
      const bub = isCur ? `<div class="ln-bub st" style="color:${u.c}">${L(T.start)}</div>` : jmp ? `<div class="ln-bub jb" style="color:${u.c}">${L(T.jump)}</div>` : '';
      const att = stt === 'lock' ? `data-lk="${trophy ? L(T.lockF) : L(T.lockT) + num(g + 1)}"` : stt === 'jmp' ? `data-jump="${g}"` : `data-go="${g}"`;
      path += `<div class="ln-r${trophy ? ' tr' : ''}${isCur ? ' cr' : ''}${k === 0 && ui ? ' af' : ''}" style="--k:${kx.toFixed(4)};--rb:${rb.toFixed(4)}${cm[k] ? ';--cdx:calc(' + (cm[k].cx - kx).toFixed(4) + '*var(--bt)*var(--u))' : ''}">${bub}<button type="button" class="ln-nd ${stt}" ${att} aria-label="${L(T.start)}">${nodeSvg(dn ? 'check' : jmp ? 'jump' : trophy ? 'trophy' : LES[(k - (ui ? 0 : 0)) % LES.length], stt, u.c, u.d, stt === 'cur' ? cnt(np, g) : null)}</button>${cm[k] ? chestHtml(ui, cm[k].j, udone, !!clm[ui + '-' + cm[k].j]) : ''}</div>`;
    }
  });
  root.innerHTML = STDEFS + navHtml() + stHtml('rc') + `<aside class="ln-rc">${cardsHtml()}</aside><div class="ln-scroll" id="ln-sc"><div class="ln-wrap"><div class="ln-uw">${stHtml('in')}<div class="ln-unit" id="ln-unit" style="--c:${UNITS[0].c};--d:${UNITS[0].d};--g:${UNITS[0].c}"><b class="ln-ub" id="ln-ub">${L(UNITS[0].t)}</b><button class="ln-gd" type="button" aria-label="${L(T.guide)}">${GUIDE}<span>${L(T.guide)}</span></button></div></div><div class="ln-path${cur === 0 ? ' f0' : ''}">${path}</div><div class="ln-upw"><button type="button" class="ln-up" id="ln-up" aria-label="up"><svg viewBox="0 0 24 24"><path d="M12 20V5M5.500 11.500L12 5L18.500 11.500" fill="none" stroke="currentColor" stroke-width="3.200" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div></div>`;
  root.onclick = (e) => {
    const nv = e.target.closest('[data-nv]'); if (nv) { goNav(nv.dataset.nv); return; }
    root.querySelectorAll('.ln-pop').forEach((p) => { p.parentNode.classList.remove('pp'); p.remove(); });
    const ch = e.target.closest('[data-ch]');
    if (ch) {
      const row = ch.parentNode;
      if (ch.classList.contains('lk')) {
        play('press', .5); row.classList.add('pp');
        row.insertAdjacentHTML('beforeend', `<div class="ln-pop"><i style="left:calc(50% + var(--x) + var(--cdx))"></i><b>${L(CHT.t)}</b><p>${L(CHT.m(CH_GEMS))}</p><div class="pb">${L(T.lockB)}</div></div>`);
        const sc2 = $('#ln-sc'), pr = $('.ln-pop', row).getBoundingClientRect(), br = sc2.getBoundingClientRect();
        if (pr.bottom > br.bottom - 10) sc2.scrollTop += pr.bottom - br.bottom + 20;
      } else if (ch.classList.contains('rd')) {
        const key = ch.dataset.ch, c2 = J('pp_ch', {}); if (c2[key]) return; c2[key] = 1; SV('pp_ch', c2);
        try { localStorage.setItem('pp_gem', String(rd('pp_gem') + CH_GEMS)); } catch (x) {}
        play('correct'); ch.classList.remove('rd'); ch.classList.add('dn', 'op'); const bd = $('.ln-cb', ch); if (bd) bd.remove();
        row.insertAdjacentHTML('beforeend', `<span class="ln-gf" style="--cdx:${ch.parentNode.style.getPropertyValue('--cdx')}">+${num(CH_GEMS)}${SI.gem}</span>`);
        const gf = $('.ln-gf', row); setTimeout(() => gf && gf.remove(), 1500);
        root.querySelectorAll('.st-gm b').forEach((b) => { b.textContent = num(rd('pp_gem')); });
      }
      return;
    }
    if (e.target.closest('.ln-gd')) { try { sessionStorage.setItem('pp_gu', String(cu)); } catch (x) {} play('press', .5); location.hash = '#/guide'; return; }
    const st0 = e.target.closest('[data-start]');
    if (st0) { const g0 = +st0.dataset.start; play('press'); try { sessionStorage.setItem('pp_from', 'learn'); sessionStorage.setItem('pp_node', String(g0)); sessionStorage.setItem('pp_pts', String(g0 === curNode(J('pp_np', {})) ? 10 : 5)); sessionStorage.removeItem('pp_res'); } catch (x) {} location.hash = '#/practice'; return; }
    const lk = e.target.closest('[data-lk]');
    if (lk) {
      play('press', .5); const row = lk.parentNode; row.classList.add('pp');
      row.insertAdjacentHTML('beforeend', `<div class="ln-pop"><i></i><b>${lk.dataset.lk}</b><p>${L(T.lockM)}</p><div class="pb">${L(T.lockB)}</div></div>`);
      const sc2 = $('#ln-sc'), pr = $('.ln-pop', row).getBoundingClientRect(), br = sc2.getBoundingClientRect();
      if (pr.bottom > br.bottom - 10) sc2.scrollTop += pr.bottom - br.bottom + 20;
      return;
    }
    const jp = e.target.closest('[data-jump]');
    if (jp) { const t = +jp.dataset.jump, np2 = J('pp_np', {}), sk = SK(); for (let i = 0; i < t; i++) if (!full(np2, i) && !sk.includes(i)) sk.push(i); SV('pp_sk', sk); play('press'); try { sessionStorage.setItem('pp_from', 'learn'); sessionStorage.setItem('pp_node', String(t)); sessionStorage.removeItem('pp_res'); } catch (x) {} location.hash = '#/practice'; return; }
    const g = e.target.closest('[data-go]'); if (!g) return;
    const g1 = +g.dataset.go, ui1 = unitOf(g1), u1 = UNITS[ui1], np3 = J('pp_np', {}), isDone = full(np3, g1), tro = g1 === ST[ui1] + CNT[ui1] - 1, tot1 = nodeNeed(g1), s1 = isDone ? tot1 : cnt(np3, g1) + 1, row1 = g.parentNode;
    play('press', .5); row1.classList.add('pp');
    row1.insertAdjacentHTML('beforeend', `<div class="ln-pop go" style="--pc:${u1.c}"><i></i><b>${tro ? L(T.lockF) : L(u1.t)}</b><p>${L(T.les)}${num(s1)}/${num(tot1)}</p><button type="button" class="pb go" data-start="${g1}">${isDone ? L(T.pr) + ' +5' : L(T.go) + ' +10'} ${L(T.xp)}</button></div>`);
    const sc3 = $('#ln-sc'), pr3 = $('.ln-pop', row1).getBoundingClientRect(), br3 = sc3.getBoundingClientRect(); if (pr3.bottom > br3.bottom - 10) sc3.scrollTop += pr3.bottom - br3.bottom + 20;
    return;
  };
  const sc = $('#ln-sc'), uw = $('.ln-uw', root), seps = [...root.querySelectorAll('.ln-sep')], card = $('#ln-unit'); let cu = 0;
  const trs = [...root.querySelectorAll('.ln-r.tr')];
  const upd = () => { const lim = uw.getBoundingClientRect().bottom; let a = 0; trs.forEach((r, i) => { if (r.getBoundingClientRect().bottom <= lim + 2) a = i + 1; }); if (a >= UNITS.length) a = UNITS.length - 1; if (a !== cu) { cu = a; const u = UNITS[a]; card.style.setProperty('--c', u.c); card.style.setProperty('--g', u.c); card.style.setProperty('--d', u.d); $('#ln-ub').textContent = L(u.t); } };
  const up = $('#ln-up'), cnn = $('.ln-nd.cur', root);
  const upv = () => { if (!cnn) { up.classList.remove('on'); return; } const r = cnn.getBoundingClientRect(), b = sc.getBoundingClientRect(), above = r.bottom < b.top + 80, below = r.top > b.bottom - 10; up.classList.toggle('on', above || below); up.classList.toggle('dn', below); };
  up.onclick = () => { const r = cnn.getBoundingClientRect(), b = sc.getBoundingClientRect(); sc.scrollTo({ top: sc.scrollTop + r.top - b.top - b.height / 2 + r.height / 2, behavior: 'smooth' }); };
  sc.onscroll = () => { upd(); upv(); }; upd(); upv(); wireCards(root);
  const cn = $('.ln-nd.cur', root); if (cn) { const r = cn.getBoundingClientRect(), b = sc.getBoundingClientRect(); if (r.bottom > b.bottom - 90) sc.scrollTop += r.bottom - b.bottom + 140; }
}
