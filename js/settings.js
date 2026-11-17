import { getLang, setLang, num, LANG_LIST } from './i18n.js';
import { play } from './sfx.js';
import { navHtml, goNav } from './learn.js';
import { first, getProf, bnAttrs } from './profile.js';
import { dlg } from './dlg.js';
import { configured, checkPassword, updateUser, signOut, loadUser } from './supabase.js';

// সেটিংস: হাব (ফোন/ছোট পর্দা) + প্রেফারেন্স / প্রোফাইল / নোটিফিকেশন / প্রাইভেসি; বড় পর্দায় ডানে মেনু কার্ড
const $ = (s, r = document) => r.querySelector(s), IX = { bn: 0, en: 1, ar: 2 }, L = (a) => a[IX[getLang()]];
export const pref = (k, d = '1') => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
const setP = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
export function applyPrefs() { document.documentElement.toggleAttribute('data-noanim', pref('pp_anim') === '0'); }

const T = {
  set: ['সেটিংস', 'Settings', 'الإعدادات'], dn: ['শেষ', 'Done', 'تم'], acc: ['অ্যাকাউন্ট', 'Account', 'الحساب'], back: ['ফিরে যান', 'Back', 'رجوع'],
  pref: ['প্রেফারেন্স', 'Preferences', 'التفضيلات'], profile: ['প্রোফাইল', 'Profile', 'الملف الشخصي'], notif: ['নোটিফিকেশন', 'Notifications', 'الإشعارات'], privacy: ['প্রাইভেসি সেটিংস', 'Privacy settings', 'إعدادات الخصوصية'],
  lo: ['লগ আউট করুন', 'Log out', 'تسجيل الخروج'],
  exp: ['শেখার অভিজ্ঞতা', 'Learning experience', 'تجربة التعلم'], snd: ['সাউন্ড ইফেক্টস', 'Sound effects', 'المؤثرات الصوتية'], anim: ['অ্যানিমেশন', 'Animations', 'الحركات'], vib: ['কম্পন (ভাইব্রেশন)', 'Vibration', 'الاهتزاز'],
  lang: ['ভাষা', 'Language', 'اللغة'], langl: ['অ্যাপের ভাষা', 'App language', 'لغة التطبيق'], goal: ['দৈনিক লক্ষ্য', 'Daily goal', 'الهدف اليومي'], goall: ['প্রতিদিন পড়ার সময়', 'Study time per day', 'وقت الدراسة يوميا'],
  theme: ['ডার্ক/লাইট মোড', 'Dark/light mode', 'الوضع الداكن/الفاتح'], themel: ['থিম', 'Theme', 'المظهر'], dark: ['ডার্ক মোড', 'Dark mode', 'الوضع الداكن'], light: ['লাইট মোড', 'Light mode', 'الوضع الفاتح'], sys: ['সিস্টেম ডিফল্ট', 'System default', 'افتراضي النظام'],
  rem: ['রিমাইন্ডার', 'Reminders', 'التذكيرات'], nrem: ['প্রতিদিন পড়ার রিমাইন্ডার', 'Daily study reminder', 'تذكير الدراسة اليومي'], ntime: ['রিমাইন্ডারের সময়', 'Reminder time', 'وقت التذكير'],
  upd: ['আপডেট', 'Updates', 'التحديثات'], nnot: ['নতুন নোটিশ', 'New notices', 'إشعارات جديدة'], nlb: ['লিডারবোর্ডের খবর', 'Leaderboard news', 'أخبار المتصدرين'], nwk: ['সাপ্তাহিক অগ্রগতি', 'Weekly progress', 'التقدم الأسبوعي'],
  nnote: ['এই পছন্দগুলো সংরক্ষিত থাকবে; ফোনে পুশ নোটিফিকেশন চালু হলে এগুলো অনুযায়ী কাজ করবে।', 'These choices are saved and will apply once push notifications are switched on.', 'تُحفظ هذه الخيارات وتُطبّق عند تفعيل الإشعارات.'],
  vis: ['দৃশ্যমানতা', 'Visibility', 'الظهور'], ppub: ['আমার প্রোফাইল সবাই দেখতে পাবে', 'Everyone can see my profile', 'يمكن للجميع رؤية ملفي'], plb: ['লিডারবোর্ডে আমার নাম দেখান', 'Show my name on the leaderboard', 'أظهر اسمي في لوحة المتصدرين'],
  dat: ['তথ্য', 'Data', 'البيانات'], pan: ['অ্যাপ ভালো করতে ব্যবহারের তথ্য পাঠান', 'Send usage data to improve the app', 'أرسل بيانات الاستخدام لتحسين التطبيق'],
  avc: ['অ্যাভেটার পরিবর্তন করুন', 'Change avatar', 'تغيير الصورة'], avt: ['অ্যাভেটার', 'Avatar', 'الصورة الرمزية'], nm: ['নাম', 'Name', 'الاسم'], un: ['ইউজারনেইম', 'Username', 'اسم المستخدم'], em: ['ইমেইল', 'Email', 'البريد الإلكتروني'],
  cp: ['বর্তমান পাসওয়ার্ড', 'Current password', 'كلمة المرور الحالية'], np: ['নতুন পাসওয়ার্ড', 'New password', 'كلمة المرور الجديدة'], sv: ['পরিবর্তন সেভ করুন', 'Save changes', 'حفظ التغييرات'],
  ex: ['আমার ডেটা এক্সপোর্ট করতে চাই', 'I want to export my data', 'أريد تصدير بياناتي'], del: ['আমার অ্যাকাউন্ট ডিলিট করতে চাই', 'I want to delete my account', 'أريد حذف حسابي'],
  saved: ['সেভ হয়েছে', 'Saved', 'تم الحفظ'], e1: ['নতুন পাসওয়ার্ডের জন্য বর্তমান পাসওয়ার্ড দিন', 'Enter your current password to set a new one', 'أدخل كلمة المرور الحالية لتعيين جديدة'],
  e2: ['পাসওয়ার্ডে কমপক্ষে ৬ অক্ষর, বড় ও ছোট হাতের অক্ষর, সংখ্যা এবং চিহ্ন লাগবে', 'Password needs 6+ characters with upper and lower case, a number and a symbol', 'يجب أن تحتوي على 6 أحرف مع كبيرة وصغيرة ورقم ورمز'],
  e3: ['বর্তমান পাসওয়ার্ড ভুল', 'Current password is wrong', 'كلمة المرور الحالية خاطئة'], e4: ['সেভ করা গেল না, আবার চেষ্টা করুন', 'Could not save, try again', 'تعذّر الحفظ، حاول مجددا'],
  dt: ['অ্যাকাউন্ট ডিলিট করবেন?', 'Delete your account?', 'حذف حسابك؟'], dp: ['এই ডিভাইসের সব তথ্য মুছে যাবে এবং আপনি লগ আউট হবেন।', 'All data on this device will be erased and you will be logged out.', 'ستُمحى كل البيانات على هذا الجهاز وسيتم تسجيل خروجك.'], dk: ['না, থাকুক', 'No, keep it', 'لا، أبقِه'], dd: ['ডিলিট করুন', 'Delete', 'احذف'],
  guest: ['অতিথি', 'Guest', 'ضيف']
};
const MENU = ['pref', 'profile', 'notif', 'privacy'], SECR = { hub: '/settings', pref: '/settings-pref', profile: '/settings-profile', notif: '/settings-notif', privacy: '/settings-privacy' };
const ic = (c) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round">${c}</svg>`;
const CHEV = ic('<path d="M9 5L16 12L9 19"/>'), ARW = ic('<path d="M20 12H5M11 6L5 12L11 18"/>'), PEN = ic('<path d="M4 20L5 15L16 4L20 8L9 19Z"/>'), EYE = ic('<path d="M2 12C4.500 7.500 8 5.500 12 5.500S19.500 7.500 22 12C19.500 16.500 16 18.500 12 18.500S4.500 16.500 2 12Z"/><circle cx="12" cy="12" r="3"/>');
const acct = () => { try { return JSON.parse(localStorage.getItem('pp_last')) || {}; } catch (e) { return {}; } };
const strong = (p) => p.length >= 6 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p);

let cur = 'hub', wideNow = false, who = { name: '', email: '', uname: '' };
const isWide = () => matchMedia('(min-width:80em)').matches;
const tg = (k, lab, d = '1') => `<label class="se-r"><span class="t">${L(lab)}</span><input type="checkbox" class="se-cb" data-k="${k}"${pref(k, d) === '1' ? ' checked' : ''}><i class="se-tg"></i></label>`;
const blk = (lab, inner) => `<div class="se-blk">${lab ? `<span class="se-bl t">${L(lab)}</span>` : ''}${inner}</div>`;
const grp = (inner) => `<div class="se-grp">${inner}</div>`;
const hd = (lab) => `<h2 class="se-h t">${L(lab)}</h2>`;
const opts = (arr, v) => arr.map(([val, lab, dis]) => `<option value="${val}"${String(val) === String(v) ? ' selected' : ''}${dis ? ' disabled' : ''}>${lab}</option>`).join('');
const goalT = (m) => getLang() === 'bn' ? num(m) + ' মিনিট / দিন' : getLang() === 'ar' ? num(m) + ' دقائق يوميا' : m + ' min / day';
const timeT = (h) => { const v = ((h + 11) % 12) + 1, ap = h < 12 ? (getLang() === 'bn' ? 'সকাল' : getLang() === 'ar' ? 'ص' : 'AM') : (getLang() === 'bn' ? (h < 17 ? 'দুপুর' : 'সন্ধ্যা') : getLang() === 'ar' ? 'م' : 'PM'); return getLang() === 'bn' ? ap + ' ' + num(v) + ':০০' : num(v) + ':00 ' + ap; };

function secHtml(sec) {
  if (sec === 'pref') return hd(T.exp) + grp(tg('pp_sound', T.snd) + tg('pp_anim', T.anim) + tg('pp_vib', T.vib))
    + hd(T.lang) + grp(blk(T.langl, `<select class="se-sel" data-lang>${opts(LANG_LIST.map((x) => [x.id, x.name]), getLang())}</select>`))
    + hd(T.goal) + grp(blk(T.goall, `<select class="se-sel" data-goal>${opts([3, 10, 15, 30].map((m) => [m, goalT(m)]), pref('pp_goal', '10'))}</select>`))
    + hd(T.theme) + grp(blk(T.themel, `<select class="se-sel" data-theme>${opts([['sys', L(T.sys)], ['dark', L(T.dark)], ['light', L(T.light)]], pref('pp_theme', 'dark'))}</select>`));
  if (sec === 'notif') return hd(T.rem) + grp(tg('pp_n_rem', T.nrem) + blk(T.ntime, `<select class="se-sel" data-time>${opts(Array.from({ length: 17 }, (_, i) => [i + 6, timeT(i + 6)]), pref('pp_n_time', '18'))}</select>`))
    + hd(T.upd) + grp(tg('pp_n_not', T.nnot) + tg('pp_n_lb', T.nlb) + tg('pp_n_wk', T.nwk)) + `<p class="se-note t">${L(T.nnote)}</p>`;
  if (sec === 'privacy') return hd(T.vis) + grp(tg('pp_p_pub', T.ppub) + tg('pp_p_lb', T.plb)) + hd(T.dat) + grp(tg('pp_p_an', T.pan));
  // profile
  const p = getProf(), nm = who.name || L(T.guest), eye = `<button type="button" class="se-eye" data-eye aria-label="show">${EYE}</button>`;
  return `<div class="se-avw"><span class="se-avt t">${L(T.avt)}</span><div class="se-av" style="${bnAttrs(p)}"><span>${p.ch || first(nm)}</span><button type="button" class="se-pen" data-pe aria-label="${L(T.avc)}">${PEN}</button></div><button type="button" class="se-avl t" data-pe>${L(T.avc)}</button></div>
<div class="se-fm"><label class="se-fl t">${L(T.nm)}</label><input class="se-in" id="se-nm" value="${nm.replace(/"/g, '&quot;')}" autocomplete="off">
<label class="se-fl t">${L(T.un)}</label><input class="se-in" id="se-un" value="${who.uname}" autocomplete="off" spellcheck="false">
<label class="se-fl t">${L(T.em)}</label><input class="se-in ro" id="se-em" value="${who.email}" readonly>
<label class="se-fl t">${L(T.cp)}</label><div class="se-pw"><input class="se-in" id="se-cp" type="password" autocomplete="current-password">${eye}</div>
<label class="se-fl t">${L(T.np)}</label><div class="se-pw"><input class="se-in" id="se-np" type="password" autocomplete="new-password">${eye}</div>
<p class="se-er t" id="se-er" hidden></p><button type="button" class="btn btn-primary se-sv" id="se-sv" disabled>${L(T.sv)}</button></div>
<button type="button" class="se-lk t" data-export>${L(T.ex)}</button><button type="button" class="se-lk del t" data-del>${L(T.del)}</button>`;
}

export function showSettings(sec = 'hub') {
  const root = $('#v-settings'), wide = isWide(); wideNow = wide; if (wide && sec === 'hub') sec = 'pref'; cur = sec;
  const a = acct(); who.name = who.name || a.name || ''; who.email = who.email || a.email || ''; who.uname = pref('pp_uname', '') || (who.email ? who.email.split('@')[0] : '');
  const title = sec === 'hub' ? L(T.set) : L(T[sec]);
  const menu = MENU.map((k) => wide ? `<a href="#${SECR[k]}" class="se-lkr${k === sec ? ' on' : ''} t" data-go="${k}">${L(T[k])}</a>` : `<a href="#${SECR[k]}" class="se-r t" data-go="${k}"><span class="t">${L(T[k])}</span>${CHEV}</a>`).join('');
  let body;
  if (wide) body = `<h1 class="se-h1 t">${title}</h1>${secHtml(sec)}`;
  else if (sec === 'hub') body = hd(T.acc) + grp(menu) + `<button type="button" class="btn btn-outline se-lo" data-logout>${L(T.lo)}</button>`;
  else body = secHtml(sec);
  const top = wide ? '' : `<header class="se-top">${sec === 'hub' ? '' : `<button type="button" class="se-bk" data-back aria-label="${L(T.back)}">${ARW}</button>`}<h1 class="t">${title}</h1>${sec === 'hub' ? `<button type="button" class="se-dn t" data-done>${L(T.dn)}</button>` : ''}</header>`;
  const rc = wide ? `<aside class="se-rc"><div class="se-card"><h2 class="t">${L(T.acc)}</h2>${menu}</div><button type="button" class="btn btn-outline se-lo" data-logout>${L(T.lo)}</button></aside>` : '';
  root.innerHTML = navHtml('more') + rc + `<div class="ln-scroll se" id="ln-sc"><div class="se-wrap">${top}<main class="se-main">${body}</main></div></div><div class="se-toast" id="se-toast" hidden></div>`;
  if (sec === 'profile') wireProfile(root);
  root.onclick = (e) => {
    const nv = e.target.closest('[data-nv]'); if (nv) { goNav(nv.dataset.nv); return; }
    const go = e.target.closest('[data-go]'); if (go) { e.preventDefault(); play('press', .4); location.hash = '#' + SECR[go.dataset.go]; return; }
    if (e.target.closest('[data-back]')) { location.hash = '#/settings'; return; }
    if (e.target.closest('[data-done]')) { location.hash = '#/profile'; return; }
    if (e.target.closest('[data-pe]')) { location.hash = '#/pedit'; return; }
    if (e.target.closest('[data-logout]')) { play('press'); (async () => { await signOut(); location.hash = acct().email ? '#/welcome' : '#/login'; })(); return; }
    if (e.target.closest('[data-export]')) { exportData(); return; }
    if (e.target.closest('[data-del]')) { dlg(root, { title: L(T.dt), text: L(T.dp), ok: L(T.dk), no: L(T.dd), onNo: wipe }); return; }
    const ey = e.target.closest('[data-eye]'); if (ey) { const i = ey.parentNode.querySelector('input'); i.type = i.type === 'password' ? 'text' : 'password'; }
  };
  root.onchange = (e) => {
    const t = e.target;
    if (t.matches('.se-cb')) { setP(t.dataset.k, t.checked ? '1' : '0'); applyPrefs(); if (t.dataset.k === 'pp_sound' && t.checked) play('press', .6); return; }
    if (t.matches('[data-lang]')) { setLang(t.value); showSettings(cur); return; }
    if (t.matches('[data-goal]')) { setP('pp_goal', t.value); return; }
    if (t.matches('[data-theme]')) { setP('pp_theme', t.value); if (window.ppTheme) window.ppTheme(); return; }
    if (t.matches('[data-time]')) { setP('pp_n_time', t.value); }
  };
  loadUser().then((u) => { if (!u || location.hash.indexOf('#/settings') !== 0) return; const m = u.user_metadata || {}; let ch = false; const nm = m.name || m.full_name || ''; if (nm && nm !== who.name) { who.name = nm; ch = true; } if (u.email && u.email !== who.email) { who.email = u.email; ch = true; } if (m.username && !pref('pp_uname', '')) { setP('pp_uname', m.username); ch = true; } if (ch && cur === 'profile' && !$('#se-cp', root).value && !$('#se-np', root).value) showSettings(cur); }).catch(() => {});
}
addEventListener('resize', () => { const r = $('#v-settings'); if (r && !r.hidden && isWide() !== wideNow && !document.activeElement.matches('input')) showSettings(cur); });

function toast(m) { const t = $('#se-toast'); if (!t) return; t.textContent = m; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => { t.hidden = true; }, 2800); }
function wireProfile(root) {
  const nm = $('#se-nm', root), un = $('#se-un', root), cp = $('#se-cp', root), np = $('#se-np', root), sv = $('#se-sv', root), er = $('#se-er', root);
  const n0 = nm.value, u0 = un.value;
  const upd = () => { sv.disabled = !(nm.value.trim() && nm.value !== n0 || un.value !== u0 || np.value); er.hidden = true; };
  [nm, un, cp, np].forEach((i) => { i.oninput = upd; });
  const bad = (m) => { er.textContent = L(m); er.hidden = false; };
  sv.onclick = async () => {
    const newPw = np.value;
    if (newPw) { if (!cp.value) return bad(T.e1); if (!strong(newPw)) return bad(T.e2); if (configured()) { try { await checkPassword(who.email, cp.value); } catch (e) { return bad(T.e3); } } }
    sv.disabled = true;
    try { if (configured()) await updateUser(Object.assign(newPw ? { password: newPw } : {}, { data: { name: nm.value.trim(), username: un.value.trim() } })); } catch (e) { sv.disabled = false; return bad(T.e4); }
    who.name = nm.value.trim(); setP('pp_uname', un.value.trim()); who.uname = un.value.trim();
    const a = acct(); if (a.email) { a.name = who.name; setP('pp_last', JSON.stringify(a)); }
    showSettings('profile'); toast(L(T.saved)); play('press', .5);
  };
}
function exportData() {
  const o = {}; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.indexOf('pp_') === 0 && k !== 'pp_session' && !/token|sess/i.test(k)) o[k] = localStorage.getItem(k); } } catch (e) {}
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(o, null, 2)], { type: 'application/json' })); a.download = 'paglapora-data.json'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
async function wipe() {
  try { await signOut(); } catch (e) {}
  try { const ks = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.indexOf('pp_') === 0 && k !== 'pp_lang') ks.push(k); } ks.forEach((k) => localStorage.removeItem(k)); sessionStorage.clear(); } catch (e) {}
  location.hash = '#/start'; location.reload();
}
