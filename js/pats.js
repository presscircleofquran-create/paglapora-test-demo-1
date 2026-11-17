const J = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
export const first = (s) => { try { const r = [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s || '')][0]; return r ? r.segment : ''; } catch (e) { return Array.from(s || '')[0] || ''; } };
export const ink = (h) => { const n = parseInt(h.slice(1), 16), l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; return l > 0.68 ? '#2b3a42' : '#fff'; };
const STP = 'M12.00 5.20 L14.41 9.28 L19.04 10.31 L15.90 13.87 L16.35 18.59 L12.00 16.70 L7.65 18.59 L8.10 13.87 L4.96 10.31 L9.59 9.28Z';
export const PATS = ['none', 'dots', 'stripes', 'rings', 'waves', 'stars', ...Array.from({ length: 38 }, (_, i) => 'q' + (i + 1))];
export const SZ = [.78, 1, 1.25];
export const DEF = { bg: '#1CB0F6', ch: '', lc: 'auto', sz: 1, pt: 'none' };

// নতুন ৩৮টি নকশা (১০০x৬৩ ক্যানভাস, currentColor)
const SH = {
  plus: (x, y, s) => `<path d="M${x - s} ${y}H${x + s}M${x} ${y - s}V${y + s}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`,
  cross: (x, y, s) => `<path d="M${x - s} ${y - s}L${x + s} ${y + s}M${x + s} ${y - s}L${x - s} ${y + s}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`,
  dia: (x, y, s) => `<path d="M${x} ${y - s}L${x + s} ${y}L${x} ${y + s}L${x - s} ${y}Z"/>`,
  diaO: (x, y, s) => `<path d="M${x} ${y - s}L${x + s} ${y}L${x} ${y + s}L${x - s} ${y}Z" fill="none" stroke="currentColor" stroke-width="2"/>`,
  tri: (x, y, s) => `<path d="M${x} ${y - s}L${x + s} ${y + s * .8}L${x - s} ${y + s * .8}Z"/>`,
  triO: (x, y, s) => `<path d="M${x} ${y - s}L${x + s} ${y + s * .8}L${x - s} ${y + s * .8}Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`,
  sqO: (x, y, s) => `<rect x="${x - s}" y="${y - s}" width="${2 * s}" height="${2 * s}" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/>`,
  sq: (x, y, s) => `<rect x="${x - s}" y="${y - s}" width="${2 * s}" height="${2 * s}" rx="1.5"/>`,
  hex: (x, y, s) => { let d = ''; for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i + Math.PI / 6; d += (i ? 'L' : 'M') + (x + s * Math.cos(a)).toFixed(1) + ' ' + (y + s * Math.sin(a)).toFixed(1); } return `<path d="${d}Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`; },
  circO: (x, y, s) => `<circle cx="${x}" cy="${y}" r="${s}" fill="none" stroke="currentColor" stroke-width="2"/>`,
  circ: (x, y, s) => `<circle cx="${x}" cy="${y}" r="${s}"/>`,
  dring: (x, y, s) => `<circle cx="${x}" cy="${y}" r="${s}" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="${x}" cy="${y}" r="${s * .5}" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
  star4: (x, y, s) => `<path d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z"/>`,
  star8: (x, y, s) => `<rect x="${x - s * .7}" y="${y - s * .7}" width="${s * 1.4}" height="${s * 1.4}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><rect x="${x - s * .7}" y="${y - s * .7}" width="${s * 1.4}" height="${s * 1.4}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" transform="rotate(45 ${x} ${y})"/>`,
  moon: (x, y, s) => `<path d="M${x + s * .2} ${y - s * .95}A${s} ${s} 0 1 0 ${x + s * .2} ${y + s * .95}A${s * 1.1} ${s * 1.1} 0 0 0 ${x + s * .2} ${y - s * .95}Z"/>`,
  heart: (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s / 10})" d="M0 8C-12 0 -8 -9 -3.500 -8C-1.500 -7.500 0 -6 0 -4C0 -6 1.500 -7.500 3.500 -8C8 -9 12 0 0 8Z"/>`,
  leaf: (x, y, s) => `<path transform="translate(${x} ${y}) rotate(-35) scale(${s / 10})" d="M0 -10C9 -4 9 6 0 10C-9 6 -9 -4 0 -10Z"/>`,
  chev: (x, y, s) => `<path d="M${x - s} ${y - s * .5}L${x} ${y + s * .5}L${x + s} ${y - s * .5}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  petal: (x, y, s) => [0, 90, 180, 270].map((a) => `<ellipse cx="${x}" cy="${y - s * .55}" rx="${s * .32}" ry="${s * .55}" transform="rotate(${a} ${x} ${y})"/>`).join('')
};
const tile = (f, s, dx, dy, st = 0, o = 0) => { let r = ''; for (let j = 0, y = dy / 2; y < 70; j++, y += dy) for (let x = (st && j % 2 ? dx : dx / 2) + o - (st ? dx / 2 : 0); x < 108; x += dx) r += SH[f](+x.toFixed(1), +y.toFixed(1), s); return r; };
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const lines = (d) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
const more = (n) => {
  const t = [
    () => tile('plus', 3.2, 14, 14), () => tile('cross', 3, 14, 14, 1), () => tile('dia', 4.2, 16, 14, 1), () => tile('diaO', 5.5, 18, 18, 1),
    () => tile('tri', 4.5, 16, 14, 1), () => tile('sqO', 4, 16, 16, 1), () => tile('hex', 6, 18, 16, 1), () => tile('circO', 4.5, 14, 14, 1),
    () => tile('circ', 4, 16, 16, 1), () => tile('circ', 1.2, 7, 7), () => tile('star4', 6, 18, 16, 1), () => tile('star8', 8, 26, 22, 1),
    () => tile('moon', 6, 22, 20, 1), () => tile('heart', 5.5, 18, 16, 1), () => tile('leaf', 6, 18, 16, 1), () => tile('chev', 4.5, 14, 11, 1),
    () => tile('dring', 7, 24, 20, 1), () => tile('plus', 2, 9, 9), () => tile('sq', 5, 20, 20, 1), () => tile('triO', 6, 20, 18, 1),
    () => { let s = ''; for (let y = 5; y < 70; y += 11) s += lines(`M0 ${y}H100`); return s; },
    () => { let s = ''; for (let x = 5; x < 105; x += 11) s += lines(`M${x} 0V70`); return s; },
    () => { let s = ''; for (let y = 6; y < 70; y += 14) s += lines(`M0 ${y}H100`); for (let x = 6; x < 105; x += 14) s += lines(`M${x} 0V70`); return s; },
    () => { let s = ''; for (let i = -8; i < 20; i++) s += lines(`M${i * 10} 70L${i * 10 + 70} 0M${i * 10} 0L${i * 10 + 70} 70`); return s; },
    () => { let s = ''; for (let y = 8; y < 70; y += 14) { let d = `M0 ${y}`; for (let x = 0; x < 100; x += 10) d += `L${x + 5} ${y - 4}L${x + 10} ${y}`; s += lines(d); } return s; },
    () => { let s = ''; for (let j = 0; j < 8; j++) for (let i = 0; i < 13; i++) if ((i + j) % 2 === 0) s += `<rect x="${i * 8}" y="${j * 8}" width="8" height="8"/>`; return s; },
    () => { let s = ''; for (let j = 0; j < 7; j++) for (let i = -1; i < 7; i++) { const x = i * 18 + (j % 2 ? 9 : 0), y = j * 9; s += `<path d="M${x - 9} ${y + 9}A9 9 0 0 1 ${x + 9} ${y + 9}" fill="none" stroke="currentColor" stroke-width="2"/>`; } return s; },
    () => { let s = ''; for (let j = 0; j < 7; j++) { const y = j * 10; s += lines(`M0 ${y}H100`); for (let x = (j % 2 ? 0 : 10); x < 100; x += 20) s += lines(`M${x} ${y}V${y + 10}`); } return s; },
    () => { let s = ''; for (let j = 0; j < 7; j++) for (let i = 0; i < 12; i++) s += lines(`M${i * 10 + (j % 2) * 5} ${j * 10 + 2}l5 -2`); return s; },
    () => { let s = ''; for (let i = 0; i < 9; i++) { let d = `M${i * 12 + 3} 0`; for (let y = 0; y < 70; y += 10) d += `Q${i * 12 + 9} ${y + 5} ${i * 12 + 3} ${y + 10}`; s += lines(d); } return s; },
    () => [[20, 32], [70, 20], [92, 58]].map(([x, y]) => [4, 9, 14, 19].map((r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="currentColor" stroke-width="1.8"/>`).join('')).join(''),
    () => { let s = ''; for (let i = -6; i < 18; i++) s += lines(`M0 70L${i * 7} 0`); return s; },
    () => { let s = ''; for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) { const x = i * 18, y = j * 18, r = (i * 3 + j) % 4; s += `<path d="${r === 0 ? `M${x} ${y + 9}A9 9 0 0 0 ${x + 9} ${y}` : r === 1 ? `M${x + 9} ${y}A9 9 0 0 0 ${x + 18} ${y + 9}` : r === 2 ? `M${x + 18} ${y + 9}A9 9 0 0 0 ${x + 9} ${y + 18}` : `M${x + 9} ${y + 18}A9 9 0 0 0 ${x} ${y + 9}`}" fill="none" stroke="currentColor" stroke-width="2.4"/>`; } return s; },
    () => { seed = 11; let s = ''; for (let i = 0; i < 34; i++) { const x = rnd() * 100, y = rnd() * 63, k = i % 4; s += k === 0 ? SH.circ(+x.toFixed(1), +y.toFixed(1), 1.8) : k === 1 ? SH.plus(+x.toFixed(1), +y.toFixed(1), 2.6) : k === 2 ? SH.triO(+x.toFixed(1), +y.toFixed(1), 3) : SH.sqO(+x.toFixed(1), +y.toFixed(1), 2.4); } return s; },
    () => { seed = 5; let s = ''; for (let i = 0; i < 20; i++) s += SH.circO(+(rnd() * 100).toFixed(1), +(rnd() * 63).toFixed(1), +(2 + rnd() * 7).toFixed(1)); return s; },
    () => { seed = 3; let s = ''; for (let i = 0; i < 18; i++) s += `<path transform="translate(${(rnd() * 100).toFixed(1)} ${(rnd() * 63).toFixed(1)}) scale(${(.35 + rnd() * .35).toFixed(2)}) translate(-12 -12)" d="${STP}"/>`; return s; },
    () => { let s = ''; for (let j = 0; j < 4; j++) { let d = `M0 ${j * 18 + 10}`; for (let x = 0; x < 100; x += 12) d += `L${x + 6} ${j * 18 + 2}L${x + 12} ${j * 18 + 10}`; s += lines(d); } return s; },
    () => tile('petal', 7, 24, 22, 1)
  ];
  return t[n - 1]();
};
export const patSvg = (k) => {
  if (!k || k === 'none') return '';
  let s = '';
  if (k === 'dots') for (let j = 0; j < 7; j++) for (let i = 0; i < 11; i++) s += `<circle cx="${i * 10 + (j % 2 ? 5 : 0)}" cy="${j * 10 + 3}" r="1.9"/>`;
  if (k === 'stripes') for (let i = -8; i < 14; i++) s += `<path d="M${i * 9} 70L${i * 9 + 70} 0" stroke="currentColor" stroke-width="3.5" fill="none"/>`;
  if (k === 'rings') [[12, 14, 9], [40, 50, 13], [70, 16, 10], [92, 52, 8], [58, -2, 7], [14, 62, 6]].forEach(([x, y, r]) => { s += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="currentColor" stroke-width="2.6"/>`; });
  if (k === 'waves') for (let j = 0; j < 6; j++) { const y = j * 12 + 6; s += `<path d="M0 ${y}Q12.5 ${y - 8} 25 ${y}T50 ${y}T75 ${y}T100 ${y}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>`; }
  if (k === 'stars') [[10, 10, .7], [34, 40, .9], [62, 12, .6], [86, 36, .8], [18, 56, .6], [52, 58, .7], [92, 8, .5]].forEach(([x, y, z]) => { const m = z * .9; s += `<path transform="translate(${(x - 12 * m).toFixed(2)} ${(y - 12 * m).toFixed(2)}) scale(${m})" d="${STP}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`; });
  if (k[0] === 'q') s = more(+k.slice(1));
  return `<svg class="pf-pt" viewBox="0 0 100 63" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="currentColor">${s}</svg>`;
};
export const bnAttrs = (p) => `background:${p.bg};color:${p.lc && p.lc !== 'auto' ? p.lc : ink(p.bg)};--sz:${SZ[p.sz == null ? 1 : p.sz]}`;
export const getProf = () => ({ ...DEF, ...(J('pp_prof', null) || {}) });
