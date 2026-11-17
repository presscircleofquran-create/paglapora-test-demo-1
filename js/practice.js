// অনুশীলন (ডেমো): নতুন শব্দ চেনা — ৩টি ছবির কার্ড, যাচাই, সঠিক/ভুলের প্যানেল, হার্ট।
// ছবিগুলো নিজের আঁকা SVG। শব্দ: কার্ড বাছলে হালকা 'soft', যাচাইয়ে correct/wrong (প্রেস-শব্দ এই পাতায় বন্ধ)।
import { getLang, num } from './i18n.js';
import { buzz, play } from './sfx.js';
import { getHearts, setHearts } from './hearts.js';
const BZW = [80, 45, 80], BZC = 55;
const $ = (s, r = document) => r.querySelector(s);
const IX = { bn: 0, en: 1, ar: 2 }, L = (a) => a[IX[getLang()]];
const S = {
  rfT: ['আপনার সব হার্ট ফুরিয়ে গেছে। থেমে না গিয়ে এগিয়ে চলতে পাচ্ছেন পাঁচটি হার্টের একটি ফ্রি রিফিল!', 'You have run out of hearts. To keep going without a break, here is a free refill of 5 hearts!', 'نفدت قلوبك. لتواصل دون توقف، إليك إعادة تعبئة مجانية لخمسة قلوب!'],
  rfG: ['বিনা মূল্যে রিফিল করুন', 'Refill for free', 'أعد التعبئة مجانًا'],
  newQ: ['নতুন প্রশ্ন', 'New question', 'سؤال جديد'], fq: ['শূন্যস্থান পূরণ করুন', 'Fill in the blank', 'أكمل الفراغ'], tq: ['এটি কি সত্য, না মিথ্যা?', 'Is this true or false?', 'هل هذا صحيح أم خطأ؟'], tr: ['সত্য', 'True', 'صحيح'], fa: ['মিথ্যা', 'False', 'خطأ'],
  newWord: ['নতুন শব্দ', 'New word', 'كلمة جديدة'],
  check: ['যাচাই করুন', 'Check', 'تحقق'],
  cont: ['চালিয়ে যান', 'Continue', 'متابعة'],
  sol: ['সঠিক সমাধান:', 'Correct solution:', 'الحل الصحيح:'],
  easier: ['বেশি সহজ', 'Easier', 'أسهل'], harder: ['বেশি কঠিন', 'Harder', 'أصعب'], report: ['রিপোর্ট করুন', 'Report', 'إبلاغ'],
  hwT: ['প্রতিটি ভুলে ১টি হার্ট খোয়া যায়!', 'Every mistake costs 1 heart!', 'كل خطأ يكلّفك قلبًا واحدًا!'],
  hwX: ['মনোযোগ দিয়ে প্র্যাকটিস করুন যেন খামোখা হার্ট খোয়াতে না হয়। আপনি চাইলেই পারবেন!', 'Practise carefully so you never lose hearts for nothing. You can do it!', 'تدرّب بتركيز حتى لا تخسر قلوبك بلا داعٍ. أنت قادر على ذلك!'],
  exT: ['দাঁড়ান, আগেই যাবেন না! এখন চলে গেলে প্রগ্রেসের হিসাব হারিয়ে যাবে', 'Wait, don\u2019t go yet! If you leave now, your progress will be lost', 'انتظر، لا تغادر الآن! إذا خرجت فستفقد تقدّمك'],
  exK: ['শিখতে থাকুন', 'Keep learning', 'واصل التعلّم'], exE: ['সেশন শেষ করুন', 'End session', 'إنهاء الجلسة'],
  wr: ['বাংলা ভাষায় লিখুন', 'Write in Bangla', 'اكتب بالبنغالية'], mt: ['বাম ও ডান পাশের জোড়া মেলান', 'Match the left and right pairs', 'طابق الأزواج بين اليمين واليسار'],
  rd: ['উদ্দীপক পড়ে পরের প্রশ্নের উত্তর দিন', 'Read the passage, then answer the next question', 'اقرأ النص ثم أجب عن السؤال التالي'], rdone: ['আমার পড়া শেষ', 'I have finished reading', 'أنهيت القراءة'],
  prev: ['আগের ভুল', 'Previous mistake', 'خطأ سابق'], hard: ['কঠিন প্রশ্ন', 'Hard question', 'سؤال صعب'],
  go: ['এগিয়ে যান', 'Keep going', 'واصل'], close: ['বন্ধ করুন', 'Close', 'إغلاق'], hearts: ['হার্ট', 'Hearts', 'القلوب'],
};
const PRAISE = [['দারুণ কাজ!', 'Great job!', 'عمل رائع!'], ['চমৎকার উত্তর!', 'Excellent answer!', 'إجابة ممتازة!'], ['অসাধারণ কাজ!', 'Wonderful work!', 'عمل مذهل!']];
const QTXT = (w) => { w = "\u2068" + w + "\u2069"; return L([`এগুলোর মধ্যে কোনটি "${w}"?`, `Which of these is "${w}"?`, `أيٌّ من هذه هو "${w}"؟`]); };

/* ---- নিজের আঁকা ছবি ---- */
const ART = {
  car: `<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="28" y="96" width="16" height="16" rx="4.5" fill="#4a5a64"/><rect x="76" y="96" width="16" height="16" rx="4.5" fill="#4a5a64"/><path d="M24 50Q26 20 60 20Q94 20 96 50L98 90H22Z" fill="#f25a5a"/><path d="M33 50Q35 28 60 28Q85 28 87 50L89 66H31Z" fill="#6fd3f7"/><path d="M40 33L58 28 50 66H36Z" fill="#a8e6fb" opacity=".7"/><rect x="42" y="38" width="36" height="16" rx="6" fill="#4fb7e8" opacity=".55"/><rect x="12" y="52" width="14" height="10" rx="4.5" fill="#f25a5a"/><rect x="94" y="52" width="14" height="10" rx="4.5" fill="#f25a5a"/><rect x="25" y="68" width="18" height="13" rx="4.5" fill="#fff"/><rect x="77" y="68" width="18" height="13" rx="4.5" fill="#fff"/><rect x="46" y="68" width="28" height="16" rx="3" fill="#7d8b94"/><path d="M50 72H70M50 76H70M50 80H70" stroke="#5a6770" stroke-width="1.6"/><rect x="18" y="88" width="84" height="10" rx="5" fill="#d9e0e5"/></svg>`,
  water: `<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="48" y="6" width="24" height="11" rx="3" fill="#1c9ad6"/><path d="M50 17H70V27Q88 33 88 52V104Q88 114 78 114H42Q32 114 32 104V52Q32 33 50 27Z" fill="#cdf1ff" stroke="#8fd8f5" stroke-width="2.5" stroke-linejoin="round"/><path d="M35 58Q35 54 40 54H80Q85 54 85 58V104Q85 111 78 111H42Q35 111 35 104Z" fill="#3cc8f4"/><rect x="44" y="34" width="32" height="9" rx="4.5" fill="#fff"/><path d="M41 62V100" stroke="#a6e6fb" stroke-width="4" stroke-linecap="round"/></svg>`,
  house: `<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="80" y="14" width="12" height="26" rx="2" fill="#f08a24"/><rect x="77" y="11" width="18" height="7" rx="2.5" fill="#b9601a"/><rect x="24" y="52" width="72" height="52" fill="#8a5cd0"/><path d="M10 58L60 24L110 58" fill="none" stroke="#3a3f45" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 56L60 28L104 56" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="60" cy="46" r="8" fill="#cfeeff" stroke="#fff" stroke-width="3"/><rect x="30" y="64" width="26" height="22" rx="2" fill="#3a3f45"/><rect x="35" y="66" width="16" height="18" fill="#4fb7e8" stroke="#fff" stroke-width="2"/><rect x="68" y="66" width="20" height="38" rx="2" fill="#a8643a"/><circle cx="83" cy="86" r="2" fill="#ffd54a"/><rect x="28" y="102" width="34" height="8" rx="2" fill="#7ac70c"/><rect x="68" y="104" width="20" height="5" rx="1.5" fill="#cfd6db"/></svg>`,
};
const W = { car: ['car', 'গাড়ি'], water: ['water', 'পানি'], house: ['house', 'বাড়ি'] };
// সব প্রশ্ন এখানে সংরক্ষিত (পরে আবার যোগ করার জন্য); এখন পরীক্ষার সুবিধায় শুধু প্রথম TEST_N টি চলে
const DECK_ALL = [
  { t: 'img', a: 'car', o: ['car', 'water', 'house'] },
  { t: 'mcq', w: 'বাড়ি', a: 'house', o: ['small', 'house', 'big', 'car'] },
  { t: 'fill', nq: true, s: 'তিনি যেতে যেতে ___ পড়ে গেলেন।', o: ['হোঁচট খেয়ে', 'গান শুনে', 'ছবি এঁকে', 'ভাত রেঁধে'], a: 'হোঁচট খেয়ে' },
  { t: 'build', hard: true, qt: ['মানুষ কীভাবে বাঁচে?', 'How do people live?', 'كيف يعيش الناس؟'], words: ['মানুষ', 'পানি', 'গাড়ি', 'বাঁচে', 'খেয়ে'], ans: ['মানুষ', 'পানি', 'খেয়ে', 'বাঁচে'] },
  { t: 'match', pairs: [['ছোট', 'small'], ['বড়', 'big'], ['বাড়ি', 'house'], ['গাড়ি', 'car']], right: ['car', 'big', 'small', 'house'] },
  { t: 'tf', nq: true, st: ['house শব্দের অর্থ বাড়ি', 'The word house means home', 'كلمة house تعني بيت'], ai: 0 },
  { t: 'read', txt: 'রহিম সাহেব ঢাকার একটি মাদরাসায় ইংরেজি পড়ান। প্রতিদিন সকালে তিনি পাঁচটি নতুন ইংরেজি শব্দ ছাত্রদের শেখান। ছাত্ররা সেগুলো খাতায় লিখে রাখে এবং বিকেলে একে অপরকে প্রশ্ন করে। গত সপ্তাহে তারা car, house, water, big ও small শব্দ শিখেছে। রহিম সাহেব বলেন, প্রতিদিন অল্প অল্প করে শিখলে কোনো শব্দই ভোলা যায় না। তাই তিনি ছাত্রদের প্রতিদিন নিয়মিত অনুশীলন করতে বলেন।' },
  { t: 'mcq', qt: ['উদ্দীপক অনুযায়ী রহিম সাহেব প্রতিদিন সকালে কয়টি নতুন শব্দ শেখান?', 'According to the passage, how many new words does Rahim teach each morning?', 'بحسب النص، كم كلمة جديدة يعلّمها رحيم كل صباح؟'], a: '৫টি', o: ['৩টি', '৫টি', '১০টি', '২টি'] },
  { t: 'img', a: 'house', o: ['water', 'house', 'car'] },
];
const TEST_N = 2;
// প্রতিটি বোতামের ৪টি সেশনে আলাদা আলাদা প্রশ্ন; এখন পরীক্ষার ৯টি প্রশ্ন ঘুরিয়ে বসানো হচ্ছে, পরে প্রতিটি বোতামের নিজস্ব প্রশ্ন আসবে
const deckFor = () => { let g = 0, s = 0; try { g = +sessionStorage.getItem('pp_node') || 0; s = ((JSON.parse(localStorage.getItem('pp_np')) || {})[g] || 0) % 4; } catch (e) {} return Array.from({ length: TEST_N }, (_, i) => DECK_ALL[(s * TEST_N + i + g) % DECK_ALL.length]); };

const HEART = (c = '') => `<svg class="hs ${c}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6.1C10.9 4.6 9.3 3.8 7.5 3.8 4.3 3.8 1.8 6.3 1.8 9.3c0 1.9.8 3.4 2.1 4.5l6.7 6c.8.7 2 .7 2.8 0l6.7-6c1.3-1.1 2.1-2.6 2.1-4.5 0-3-2.5-5.5-5.7-5.5-1.8 0-3.4.8-4.5 2.3z"/><circle cx="7.3" cy="9.2" r="2.6" class="gl"/></svg>`;
const ICO = {
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5L19 19M19 5L5 19" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" fill="none"/></svg>',
  ok: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 25L19 35L39 12" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  no: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 9L39 39M39 9L9 39" stroke="currentColor" stroke-width="9" stroke-linecap="round" fill="none"/></svg>',
  zz: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5H9L3 11H9M12 13H17L12 18H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  mt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 19L9.5 6L13 12.5L15 9.5L21.5 19Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/></svg>',
  fl: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4.5H17.5L15 9L17.5 13.5H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  retry: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#f9a13a"/><path d="M6.6 11.2V10a3.6 3.6 0 0 1 3.6-3.6h5.2M13.4 4.2l2.4 2.2-2.4 2.2M17.4 12.8V14a3.6 3.6 0 0 1-3.6 3.6H8.6M10.6 19.8l-2.4-2.2 2.4-2.2" fill="none" stroke="#131f24" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  hard: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#e5584f"/><g transform="rotate(-45 12 12)" fill="none" stroke="#131f24" stroke-width="1.9" stroke-linecap="round"><path d="M8.6 12h6.8"/><path d="M7.4 9v6M5.4 10.2v3.6M16.6 9v6M18.6 10.2v3.6"/></g></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#cd7cf8"/><rect x="7.4" y="6.6" width="5" height="5" rx="1.3" transform="rotate(45 9.9 9.1)" fill="#131f24"/><rect x="13.85" y="11.15" width="3.1" height="3.1" rx=".9" transform="rotate(45 15.4 12.7)" fill="#131f24"/><rect x="10.2" y="15.9" width="2" height="2" rx=".6" transform="rotate(45 11.2 16.9)" fill="#131f24"/></svg>',
};

let startAt = 0, tick = 0, total = 5, tally = { r: 0, w: 0 }, root, q, sel, phase, hearts, done, praise, built = false, st = {};
const HW = 'pp_hw';
const cur = () => q[0];
const shuf = (a) => a.slice();

function build() {
  root = $('#v-practice');
  root.innerHTML = `
  <div class="pr-top"><div class="pr-topin">
    <button class="pr-x" id="pr-x" type="button">${ICO.x}</button>
    <div class="pr-barw"><div class="pr-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"><i id="pr-fill"></i></div></div>
    <div class="pr-hp" id="pr-hp"><span class="pr-hi">${HEART()}</span><b id="pr-hn"></b></div>
  </div></div>
  <div class="pr-main" id="pr-main"><div class="pr-col" id="pr-col"></div></div>
  <div class="pr-foot" id="pr-foot">
    <div class="pr-chk"><div class="pr-chkin"><button class="btn btn-primary" id="pr-chk" type="button" disabled></button></div></div>
    <div class="pr-panel" id="pr-panel" aria-live="polite"><div class="pr-pin">
      <div class="pr-ic" id="pr-ic"></div>
      <div class="pr-pt"><div class="pr-tt" id="pr-tt"></div><div class="pr-ans" id="pr-ans" data-notr></div></div>
      <div class="pr-act"><button type="button" class="pr-a">${ICO.zz}<span id="pr-a1"></span></button><button type="button" class="pr-a">${ICO.mt}<span id="pr-a2"></span></button><button type="button" class="pr-a">${ICO.fl}<span id="pr-a3"></span></button></div>
      <button class="btn pr-go" id="pr-go" type="button"></button>
    </div></div>
  </div>
  <div class="pr-ov" id="pr-ov" hidden><div class="pr-md" role="dialog" aria-modal="true">
    <div class="pr-mh" id="pr-mh"></div><h2 id="pr-mt"></h2><p id="pr-mx"></p>
    <button class="btn btn-primary" id="pr-mg" type="button"></button>
  </div></div>
  <div class="pr-ov pr-rf" id="pr-rf" hidden><div class="pr-md pr-rfm" role="dialog" aria-modal="true"><div class="pr-rfh" id="pr-rfh"></div><h2 id="pr-rft"></h2><button class="btn btn-primary" id="pr-rfg" type="button"></button></div></div>
  <div class="pr-toast" id="pr-toast" hidden></div>
  <div class="pr-ov pr-rp" id="pr-rp" hidden><div class="pr-md pr-rm" role="dialog" aria-modal="true"><button class="pr-rx" id="pr-rx" type="button" aria-label="close">${ICO.x}</button>
    <div class="pr-rl" id="pr-rl"></div><button class="btn btn-primary" id="pr-rs" type="button" disabled></button></div></div>
  <div class="pr-ov pr-ex" id="pr-ex" hidden><div class="pr-md" role="dialog" aria-modal="true">
    <h2 id="pr-et"></h2>
    <button class="btn btn-primary" id="pr-ek" type="button"></button>
    <button class="pr-ee" id="pr-ee" type="button"></button>
  </div></div>`;
  $('#pr-x').addEventListener('click', openExit);
  $('#pr-a3').parentElement.addEventListener('click', openReport);
  $('#pr-rx').addEventListener('click', closeReport);
  $('#pr-rp').addEventListener('click', (e) => { if (e.target.id === 'pr-rp') closeReport(); });
  $('#pr-rl').addEventListener('change', () => { $('#pr-rs').disabled = !$('#pr-rl input:checked'); });
  $('#pr-rs').addEventListener('click', sendReport);
  $('#pr-ek').addEventListener('click', closeExit);
  $('#pr-ee').addEventListener('click', () => { closeExit(); let fl = false; try { fl = sessionStorage.getItem('pp_from') === 'learn'; } catch (e) {} location.hash = fl ? '#/learn' : '#/ready'; });
  $('#pr-col').addEventListener('click', onCol);
  $('#pr-chk').addEventListener('click', check);
  $('#pr-go').addEventListener('click', next);
  $('#pr-mg').addEventListener('click', closeModal);
  $('#pr-rfg').addEventListener('click', refill);
  document.addEventListener('keydown', (e) => {
    if (root.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    if (!$('#pr-rf').hidden) { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); refill(); } return; }
    if (!$('#pr-rp').hidden) { if (e.key === 'Escape') { e.preventDefault(); closeReport(); } return; }
    if (!$('#pr-ex').hidden) { if (e.key === 'Escape') { e.preventDefault(); closeExit(); } return; }
    if (!$('#pr-ov').hidden) { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); closeModal(); } return; }
    if (e.key === 'Escape') { openExit(); return; }
    const it = cur(); if (!it) return;
    if (phase === 'ask' && (it.t === 'img' || it.t === 'mcq' || it.t === 'fill' || it.t === 'tf') && /^[1-4]$/.test(e.key) && +e.key <= (it.t === 'tf' ? 2 : it.o.length)) { pick(+e.key - 1); play('soft'); }
    else if (e.key === 'Enter') { e.preventDefault(); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); phase === 'ask' ? check() : next(); }
  });
  built = true;
}
const RPT = [['প্রশ্নটি **ঠিক আছে** বলে মনে হচ্ছে না।', 'The **question** does not look right.', 'يبدو أن **السؤال** غير صحيح.'],
  ['আমার **উত্তর সঠিক** হিসেবে ধরা উচিত ছিল।', 'My **answer** should have been counted as correct.', 'كان يجب احتساب **إجابتي** صحيحة.'],
  ['দেখানো **সঠিক উত্তরটি** ভুল মনে হচ্ছে।', 'The **correct answer** shown looks wrong.', 'تبدو **الإجابة الصحيحة** المعروضة خاطئة.'],
  ['**ছবিটি** ঠিকমতো দেখা যাচ্ছে না।', 'The **picture** is not showing properly.', '**الصورة** لا تظهر بشكل صحيح.'],
  ['**শব্দ বা বানানে** ভুল আছে।', 'There is a mistake in the **words or spelling**.', 'هناك خطأ في **الكلمات أو الإملاء**.'],
  ['**অন্য কোথাও** সমস্যা হয়েছে।', 'There is a problem **somewhere else**.', 'هناك مشكلة في **مكان آخر**.']];
const RS = { send: ['জমা দিন', 'Submit', 'إرسال'], thx: ['ধন্যবাদ, আপনার জানানো সমস্যাটি জমা হয়েছে।', 'Thanks, your report has been submitted.', 'شكرًا، تم إرسال بلاغك.'] };
function openReport() {
  const o = $('#pr-rp'); $('#pr-rl').innerHTML = RPT.map((r, i) => `<label class="pr-rr"><input type="checkbox" value="${i}"><i class="pr-cb"></i><span>${L(r).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')}</span></label>`).join('');
  $('#pr-rs').textContent = L(RS.send); $('#pr-rs').disabled = true; o.hidden = false; void o.offsetWidth; o.classList.add('on');
}
function closeReport() { const o = $('#pr-rp'); o.classList.remove('on'); setTimeout(() => { o.hidden = true; }, 180); }
function sendReport() {
  const v = [...document.querySelectorAll('#pr-rl input:checked')].map((x) => +x.value); if (!v.length) return;
  try { const a = JSON.parse(localStorage.getItem('pp_reports')) || []; a.push({ at: Date.now(), q: cur() ? (cur().id || cur().t) : '', r: v }); localStorage.setItem('pp_reports', JSON.stringify(a.slice(-50))); } catch (e) { /* ignore */ }
  closeReport(); const t = $('#pr-toast'); t.textContent = L(RS.thx); t.hidden = false; void t.offsetWidth; t.classList.add('on'); setTimeout(() => { t.classList.remove('on'); setTimeout(() => { t.hidden = true; }, 250); }, 2400);
}
function openExit() { const o = $('#pr-ex'); o.hidden = false; void o.offsetWidth; o.classList.add('on'); setTimeout(() => $('#pr-ek').focus({ preventScroll: true }), 30); }
function closeExit() { const o = $('#pr-ex'); o.classList.remove('on'); setTimeout(() => { o.hidden = true; }, 180); }

const LAB = (it) => { const k = it.retry ? 'retry' : it.hard ? 'hard' : 'nw'; return `<div class="pr-lab ${k}">${k === 'retry' ? ICO.retry : k === 'hard' ? ICO.hard : ICO.star}<span>${L(k === 'retry' ? S.prev : k === 'hard' ? S.hard : it.nq ? S.newQ : S.newWord)}</span></div>`; };
const HEAD = (it, qt) => LAB(it) + `<h1 class="pr-q" data-notr>${qt}</h1>`;
const opts = (arr) => `<div class="pr-opts" role="radiogroup">${arr.map((k, i) => `<button type="button" class="pr-opt pr-snd" role="radio" aria-checked="false" data-i="${i}"><kbd aria-hidden="true">${i + 1}</kbd><span data-notr>${k}</span></button>`).join('')}</div>`;
const isA = (it, i) => it.t === 'tf' ? i === it.ai : it.o[i] === it.a;
const YN = () => [L(S.tr), L(S.fa)];
function body(it) {
  if (it.t === 'img') {
    const w = W[it.a];
    return HEAD(it, QTXT(w[1])) + `<div class="pr-cards" role="radiogroup">${it.o.map((k, i) => `<button type="button" class="pr-card pr-snd" role="radio" aria-checked="false" data-i="${i}"><span class="pr-art">${ART[k]}</span><span class="pr-cl"><em data-notr>${W[k][0]}</em><kbd aria-hidden="true">${i + 1}</kbd></span></button>`).join('')}</div>`;
  }
  if (it.t === 'mcq') {
    return HEAD(it, it.qt ? L(it.qt) : QTXT(it.w)) + `<div class="pr-opts" role="radiogroup">${it.o.map((k, i) => `<button type="button" class="pr-opt pr-snd" role="radio" aria-checked="false" data-i="${i}"><kbd aria-hidden="true">${i + 1}</kbd><span data-notr>${k}</span></button>`).join('')}</div>`;
  }
  if (it.t === 'fill') {
    const [a, b] = it.s.split('___');
    return LAB(it) + `<h1 class="pr-q pr-fq" data-notr>${a}<span class="pr-bl" id="pr-bl">\u200b</span>${b}</h1>` + opts(it.o);
  }
  if (it.t === 'tf') return HEAD(it, L(it.st)) + opts(YN());
  if (it.t === 'build') {
    return HEAD(it, L(it.qt)) + `<div class="pr-area" id="pr-area"></div><div class="pr-bank" id="pr-bank"></div>`;
  }
  if (it.t === 'read') {
    return HEAD(it, L(S.rd)) + `<div class="pr-pass"><p data-notr>${it.txt}</p><div class="pr-tm" id="pr-tmw"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" class="tb"/><circle cx="18" cy="18" r="15" class="tf" id="pr-tr" pathLength="100"/></svg><b id="pr-tt2">--:--</b></div></div>`;
  }
  return HEAD(it, L(S.mt)) + `<div class="pr-pairs"><div class="pr-pc">${it.pairs.map((p, i) => `<button type="button" class="pr-mb pr-snd" data-s="l" data-k="${i}"><span data-notr>${p[0]}</span></button>`).join('')}</div><div class="pr-pc">${it.right.map((r) => { const k = it.pairs.findIndex((p) => p[1] === r); return `<button type="button" class="pr-mb pr-snd" data-s="r" data-k="${k}"><span data-notr>${r}</span></button>`; }).join('')}</div></div>`;
}
function paint() {
  const it = cur();
  const ps = $('#pr-fill'); const pct = Math.min(100, Math.round(done / total * 100)); ps.style.width = pct ? 'max(' + pct + '%,1.1rem)' : '0';
  ps.parentNode.setAttribute('aria-valuenow', pct);
  $('#pr-hn').textContent = num(hearts); $('#pr-x').setAttribute('aria-label', L(S.close));
  $('#pr-hp').setAttribute('aria-label', L(S.hearts) + ' ' + num(hearts));
  $('#pr-col').innerHTML = body(it);
  $('#pr-chk').textContent = L(cur().t === 'read' ? S.rdone : S.check); $('#pr-go').textContent = L(S.cont);
  $('#pr-a1').textContent = L(S.easier); $('#pr-a2').textContent = L(S.harder); $('#pr-a3').textContent = L(S.report);
  $('#pr-rft').textContent = L(S.rfT); $('#pr-rfg').textContent = L(S.rfG); $('#pr-mt').textContent = L(S.hwT); $('#pr-mx').textContent = L(S.hwX); $('#pr-mg').textContent = L(S.go);
  $('#pr-et').textContent = L(S.exT); $('#pr-ek').textContent = L(S.exK); $('#pr-ee').textContent = L(S.exE);
  $('#pr-main').scrollTop = 0;
  clearInterval(tick); if (it.t === 'build') paintBuild();
  if (it.t === 'match') paintMatch();
  if (it.t === 'read') startTimer(it);
  mark();
}
const ansText = (it) => it.t === 'img' ? W[it.a][0] : it.t === 'tf' ? YN()[it.ai] : (it.t === 'mcq' || it.t === 'fill') ? it.a : it.t === 'build' ? it.ans.join(' ') : '';
function mark() {
  const it = cur(), foot = $('#pr-foot'), main = $('#pr-main');
  if (it.t === 'img' || it.t === 'mcq' || it.t === 'fill' || it.t === 'tf') {
    [...document.querySelectorAll('#pr-col .pr-card, #pr-col .pr-opt')].forEach((c, i) => {
      const on = sel === i; c.classList.toggle('sel', on && phase === 'ask'); c.setAttribute('aria-checked', on);
      c.classList.toggle('ok', phase !== 'ask' && on && isA(it, i)); c.classList.toggle('bad', phase === 'bad' && on && !isA(it, i));
      c.disabled = phase !== 'ask';
    });
  }
  if (it.t === 'fill') { const bl = $('#pr-bl'); if (bl) { bl.textContent = sel != null ? it.o[sel] : '\u200b'; bl.className = 'pr-bl' + (sel != null ? ' f' : '') + (phase === 'ok' ? ' ok' : phase === 'bad' ? ' bad' : ''); } }
  const can = it.t === 'read' ? true : it.t === 'match' ? false : it.t === 'build' ? st.placed.length > 0 : sel != null;
  $('#pr-chk').disabled = !can || phase !== 'ask';
  foot.classList.toggle('ok', phase === 'ok'); foot.classList.toggle('bad', phase === 'bad'); foot.classList.toggle('show', phase !== 'ask');
  main.classList.toggle('padp', phase !== 'ask');
  if (phase === 'ok') { $('#pr-tt').textContent = L(PRAISE[praise % PRAISE.length]); $('#pr-ans').textContent = ''; $('#pr-ic').innerHTML = ICO.ok; }
  if (phase === 'bad') { $('#pr-tt').textContent = L(S.sol); $('#pr-ans').textContent = ansText(it); $('#pr-ic').innerHTML = ICO.no; }
}
/* শব্দ সাজানো: চাপা শব্দটিই শুধু উড়ে লাইনে যায় (FLIP); বাকি শব্দ নড়ে না, ঝিলিকও দেয় না */
function paintBuild() {
  const it = cur(), area = $('#pr-area'), bank = $('#pr-bank'); st.placed = [];
  area.innerHTML = ''; bank.innerHTML = '';
  it.words.forEach((w, i) => {
    const slot = document.createElement('span'); slot.className = 'pr-slot'; slot.dataset.s = i;
    const c = document.createElement('button'); c.type = 'button'; c.className = 'pr-chip pr-snd'; c.dataset.c = i; c.innerHTML = `<span data-notr>${w}</span>`;
    slot.appendChild(c); bank.appendChild(slot);
  });
}
function moveChip(c) {
  const it = cur(), i = +c.dataset.c, slot = $(`#pr-bank .pr-slot[data-s="${i}"]`), area = $('#pr-area'), r0 = c.getBoundingClientRect();
  const inArea = c.parentNode === area;
  if (inArea) { st.placed = st.placed.filter((x) => x !== i); slot.style.width = slot.style.height = ''; slot.classList.remove('empty'); slot.appendChild(c); }
  else { slot.style.width = r0.width + 'px'; slot.style.height = r0.height + 'px'; slot.classList.add('empty'); st.placed.push(i); area.appendChild(c); }
  const r1 = c.getBoundingClientRect(), dx = r0.left - r1.left, dy = r0.top - r1.top;
  c.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.2,.8,.3,1)' });
}
/* জোড়া মেলানো */
function paintMatch() {
  document.querySelectorAll('#pr-col .pr-mb').forEach((b) => {
    const k = +b.dataset.k, s = b.dataset.s;
    b.classList.toggle('done', st.m.includes(k)); b.disabled = st.m.includes(k) || phase !== 'ask';
    b.classList.toggle('sel', st.sl === (s === 'l' ? k : -9) && s === 'l' || st.sr === k && s === 'r');
  });
}
function onCol(e) {
  if (phase !== 'ask') return; const it = cur();
  if (it.t === 'img' || it.t === 'mcq' || it.t === 'fill' || it.t === 'tf') { const c = e.target.closest('.pr-card,.pr-opt'); if (c) pick(+c.dataset.i); return; }
  if (it.t === 'build') {
    const c = e.target.closest('.pr-chip[data-c]'); if (!c) return; moveChip(c); mark(); return;
  }
  const b = e.target.closest('.pr-mb'); if (!b) return; const k = +b.dataset.k;
  if (b.dataset.s === 'l') st.sl = st.sl === k ? -1 : k; else st.sr = st.sr === k ? -1 : k;
  if (st.sl >= 0 && st.sr >= 0) {
    const l = st.sl, r = st.sr; st.sl = st.sr = -1;
    if (l === r) {
      tally.r++; buzz(BZC); st.m.push(l); paintMatch(); if (st.m.length < it.pairs.length) play('m' + Math.max(1, Math.min(10, Math.round(st.m.length / (it.pairs.length - 1) * 10)))); document.querySelectorAll('#pr-col .pr-mb').forEach((x) => { if (+x.dataset.k === l) sparkle(x); });
      if (st.m.length === it.pairs.length) setTimeout(() => finish(true), 650);
    } else {
      document.querySelectorAll('#pr-col .pr-mb').forEach((x) => { if ((x.dataset.s === 'l' && +x.dataset.k === l) || (x.dataset.s === 'r' && +x.dataset.k === r)) { x.classList.remove('sel'); x.classList.add('wrong'); setTimeout(() => x.classList.remove('wrong'), 600); } });
      tally.w++; st.bad.add(l); st.bad.add(r); st.mis++; play(st.mis <= 3 || it.pairs.length > 5 ? 'w' + Math.min(10, st.mis) : 'wrong'); buzz(BZW); loseHeart();
    }
  }
  paintMatch();
}
function pick(i) { if (phase !== 'ask') return; sel = i; mark(); }
/* সঠিক হলে: বক্সের ভেতরেই, কোণে কোণে এলোমেলো ক্রমে গোল-ধারের তারা-কণা (বাইরে কিছুই নয়) */
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2C12.9 8 16 11.1 21.8 12 16 12.9 12.9 16 12 21.8 11.1 16 8 12.9 2.2 12 8 11.1 11.1 8 12 2.2Z" fill="currentColor" stroke="currentColor" stroke-width="3.6" stroke-linejoin="round"/></svg>';
function sparkle(el) {
  const box = document.createElement('span'); box.className = 'pr-sps'; box.setAttribute('aria-hidden', 'true');
  const R = el.getBoundingClientRect(), W0 = R.width, H0 = R.height, big = H0 > 90, f = big ? 1 : .8, pad = 3;
  // লেখা, ছবি ও নম্বর-বক্সের আসল মাপ (কার্ড-সাপেক্ষে); তারা এগুলোর ওপর পড়বে না
  const hit = [], add = (r) => { if (r.width > 0 && r.height > 0) hit.push([r.left - R.left - pad, r.top - R.top - pad, r.right - R.left + pad, r.bottom - R.top + pad]); };
  const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode());) { if (!n.nodeValue.trim()) continue; const rg = document.createRange(); rg.selectNodeContents(n); [...rg.getClientRects()].forEach(add); }
  el.querySelectorAll('svg, kbd').forEach((x) => { if (!x.closest('.pr-sps')) add(x.getBoundingClientRect()); });
  const placed = [], ov = (a, b2) => a[0] < b2[2] && a[2] > b2[0] && a[1] < b2[3] && a[3] > b2[1];
  // এলোমেলো ভাগ: লম্বা কার্ডে ওপরে ১/নিচে ২ বা ওপরে ২/নিচে ১; চওড়া বক্সে বামে ১/ডানে ২ বা উল্টো
  const wide = W0 > H0 * 1.6, first = Math.random() < .5, zones = [first ? 1 : 2, first ? 2 : 1], sizes = [25, 22, 12].sort(() => Math.random() - .5);
  let si = 0;
  zones.forEach((cnt, zi) => {
    const z = wide ? [zi ? W0 / 2 : 0, 0, zi ? W0 : W0 / 2, H0] : [0, zi ? H0 / 2 : 0, W0, zi ? H0 : H0 / 2];
    for (let c = 0; c < cnt; c++) {
      const sz0 = sizes[si++] * f;
      for (let k = 0, sz = sz0; k < 4; k++, sz *= .82) {
        let best = null, bs = -1;
        for (let i = 0; i < 80; i++) {
          const x = Math.max(4, z[0]) + Math.random() * Math.max(0, Math.min(W0 - 4, z[2]) - Math.max(4, z[0]) - sz), y = Math.max(4, z[1]) + Math.random() * Math.max(0, Math.min(H0 - 4, z[3]) - Math.max(4, z[1]) - sz), r = [x, y, x + sz, y + sz];
          if (x + sz > W0 - 4 || y + sz > H0 - 4) continue;
          if (hit.some((h) => ov(r, h)) || placed.some((h) => ov(r, [h[0] - 4, h[1] - 4, h[2] + 4, h[3] + 4]))) continue;
          const sc = Math.random(); if (sc > bs) { bs = sc; best = r; }
        }
        if (best) { placed.push(best); const s2 = document.createElement('i'); s2.innerHTML = STAR; s2.style.cssText = `width:${sz}px;height:${sz}px;left:${best[0]}px;top:${best[1]}px;animation-delay:${(placed.length - 1) * .08}s`; box.appendChild(s2); break; }
      }
    }
  });
  el.appendChild(box); setTimeout(() => box.remove(), 1500);
}
function ring() {
  const w = $('.pr-barw'), pct = Math.min(100, Math.round(done / total * 100)), r = document.createElement('span'); r.className = 'pr-ring';
  r.style.left = `calc(${pct}% - .55rem)`; r.innerHTML = '<b></b><i></i><i></i><i></i>'; w.appendChild(r); setTimeout(() => r.remove(), 900);
}
function matchRetry(it, st0) {
  const idx = [...st0.bad]; for (let i = 0; i < it.pairs.length && idx.length < 3; i++) if (!idx.includes(i)) idx.push(i);
  const pairs = idx.map((i) => it.pairs[i]); let right = pairs.map((p) => p[1]).sort(() => Math.random() - .5);
  if (right.every((r, i) => r === pairs[i][1])) right = right.slice(1).concat(right[0]);
  return { t: 'match', retry: true, pairs, right };
}
function finish(ok) {
  if (phase !== 'ask') return;
  if (ok && cur().t === 'match' && st.bad.size) { q.push(matchRetry(cur(), st)); total++; }
  phase = ok ? 'ok' : 'bad'; play(ok ? 'correct' : 'wrong'); buzz(ok ? BZC : BZW);
  if (ok) {
    if (cur().t !== 'match') tally.r++; done++; praise++; const ps = $('#pr-fill'), pct = Math.min(100, Math.round(done / total * 100)); ps.style.width = 'max(' + pct + '%,1.1rem)';
    setTimeout(ring, 340);
  } else { if (cur().t !== 'match') tally.w++; loseHeart(); }
  if (cur().t === 'match') paintMatch();
  mark();
  if (ok) { const t = document.querySelector('#pr-col .pr-card.ok, #pr-col .pr-opt.ok'); if (t) sparkle(t); }
}
/* উদ্দীপক পড়ার সময়: শব্দসংখ্যা অনুযায়ী (সর্বনিম্ন ৫ মিনিট); টেস্টের জন্য localStorage pp_timer = সেকেন্ড */
function readSecs(it) {
  let o = 0; try { o = +localStorage.getItem('pp_timer') || 0; } catch (e) {}
  if (o) return o; const words = it.txt.trim().split(/\s+/).length; return Math.max(300, Math.ceil(words * 4));
}
const fmt = (sec) => num(String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0'));
function startTimer(it) {
  if (!st.end) { st.tot = readSecs(it); st.end = Date.now() + st.tot * 1000; }
  const upd = () => {
    const left = Math.max(0, Math.ceil((st.end - Date.now()) / 1000)), a = $('#pr-tt2'), r = $('#pr-tr');
    if (a) a.textContent = fmt(left); if (r) r.style.strokeDashoffset = String(100 - left / st.tot * 100);
    if (root.hidden) { clearInterval(tick); return; }
    if (left <= 0) { clearInterval(tick); readDone(); }
  };
  upd(); tick = setInterval(upd, 250);
}
function readDone() {
  if (phase !== 'ask' || cur().t !== 'read') return;
  clearInterval(tick); done++; q.shift();
  if (!q.length) { end(); return; }
  reset(); paint();
}
function end() { try { sessionStorage.setItem('pp_res', JSON.stringify(Object.assign({}, tally, { ms: Date.now() - startAt }))); } catch (e) {} location.hash = '#/result'; }
function check() {
  const it = cur(); if (phase !== 'ask') return;
  if (it.t === 'read') { readDone(); return; }
  if (it.t === 'build') { if (!st.placed.length) return; finish(st.placed.map((i) => it.words[i]).join(' ') === it.ans.join(' ')); return; }
  if (it.t === 'match' || sel == null) return;
  finish(isA(it, sel));
}
function reset() { sel = null; const it = cur(); st = { placed: [], m: [], sl: -1, sr: -1, mis: 0, end: 0, bad: new Set() }; }
function next() {
  if (phase === 'ask') return;
  const was = phase; phase = 'ask';
  if (was === 'ok') q.shift(); else q.push(Object.assign({}, q.shift(), { retry: true }));
  if (!q.length) { end(); return; }
  reset(); paint();
}
/* হার্ট: প্রথম ভুলে সতর্কবার্তা (ডিভাইসে একবারই), তারপর শুধু ঝরে পড়ে */
function loseHeart() {
  hearts = Math.max(0, hearts - 1); setHearts(hearts);
  let seen = false; try { seen = !!localStorage.getItem(HW); localStorage.setItem(HW, '1'); } catch (e) {}
  if (hearts === 0) { fall(); setTimeout(openRefill, 900); return; }
  if (seen) { fall(); return; }
  setTimeout(() => {
    const ov = $('#pr-ov'); $('#pr-mh').innerHTML = [1, 2, 3, 4, 5].map((n) => HEART(n <= hearts + 1 ? '' : 'off')).join('');
    ov.hidden = false; $('#pr-hp').classList.add('hl'); $('#pr-hn').textContent = num(hearts + 1); void ov.offsetWidth; ov.classList.add('on');
    setTimeout(() => { const hs = $('#pr-mh').querySelectorAll('.hs'); const h = hs[hearts]; if (h) { const r = h.getBoundingClientRect(), c = document.createElement('span'); c.className = 'pr-mfall'; c.innerHTML = HEART(); c.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`; document.body.appendChild(c); setTimeout(() => c.remove(), 1300); h.classList.add('off'); } fall(true); }, 500);
    setTimeout(() => $('#pr-mg').focus({ preventScroll: true }), 50);
  }, 420);
}
// সব হার্ট শেষ হলে (কয়েন-ব্যবস্থা আসার আগে) বিনা মূল্যে আবার ৫টি
function openRefill() {
  const ov = $('#pr-rf'); if (!ov.hidden) return; $('#pr-rfh').innerHTML = HEART(); ov.hidden = false; void ov.offsetWidth; ov.classList.add('on'); setTimeout(() => $('#pr-rfg').focus({ preventScroll: true }), 50);
}
function refill() {
  const ov = $('#pr-rf'); if (ov.hidden) return; hearts = 5; setHearts(5); ov.classList.remove('on'); setTimeout(() => { ov.hidden = true; }, 180);
  const hi = $('.pr-hi'); $('#pr-hn').textContent = num(hearts); hi.classList.remove('pop'); void hi.offsetWidth; hi.classList.add('pop'); play('correct'); buzz(30);
}
function closeModal() { const ov = $('#pr-ov'); ov.classList.remove('on'); $('#pr-hp').classList.remove('hl'); setTimeout(() => { ov.hidden = true; }, 180); }
function fall() {
  const hi = $('.pr-hi'), r = hi.getBoundingClientRect(), c = document.createElement('span');
  c.className = 'pr-hfall'; c.innerHTML = HEART(); c.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;
  document.body.appendChild(c); setTimeout(() => c.remove(), 1100);
  hi.classList.remove('pop'); void hi.offsetWidth; hi.classList.add('pop'); $('#pr-hn').textContent = num(hearts);
}

export function showPractice(fresh) {
  if (!built) build();
  if (fresh || !q) { const dk = deckFor(); q = dk.slice(); total = dk.length; tally = { r: 0, w: 0 }; startAt = Date.now(); phase = 'ask'; hearts = Math.max(1, getHearts()); done = 0; praise = 0; reset(); $('#pr-ov').hidden = true; $('#pr-ex').hidden = true; $('#pr-rp').hidden = true; $('#pr-rf').hidden = true; }
  paint();
}
