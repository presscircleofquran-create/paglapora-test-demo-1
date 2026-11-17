// প্রতিটি বইয়ের (বিষয়ের) আলাদা অগ্রগতি: XP, লিডারবোর্ড, হার্ট, চেস্ট, সেশন।
// প্রোফাইল, কয়েন, জেম, স্ট্রিক সব বইয়ে এক। বই বদলালে এই কী-গুলো আপনাআপনি ওই বইয়ের ঘরে যায়।
// অন্য ফাইলকে বদলাতে হয় না: localStorage-এর পড়া/লেখা এখানে থেকেই `কী@বই` নামে যায়।
const PER = ['pp_np', 'pp_ch', 'pp_sk', 'pp_xp', 'pp_xpd', 'pp_xpw', 'pp_lessons', 'pp_hearts', 'pp_hts'];
const ls = window.localStorage, P = Storage.prototype, get = P.getItem, set = P.setItem, del = P.removeItem;
export const curSubject = () => {
  let s = null; try { s = get.call(ls, 'pp_subj'); } catch (e) {}
  if (!s) { try { s = (JSON.parse(sessionStorage.getItem('pp_onb')) || {}).subject; } catch (e) {} }
  return s || 'bangla1';
};
const map = (k) => (PER.includes(k) ? k + '@' + curSubject() : k);
P.getItem = function (k) { return this === ls ? get.call(this, map(k)) : get.call(this, k); };
P.setItem = function (k, v) { return this === ls ? set.call(this, map(k), v) : set.call(this, k, v); };
P.removeItem = function (k) { return this === ls ? del.call(this, map(k)) : del.call(this, k); };
// আগের (এক বইয়ের) তথ্য এখনকার বইয়ে সরিয়ে নেওয়া — একবারই
try {
  if (!get.call(ls, 'pp_mig_subj')) {
    const cs = curSubject(); PER.forEach((k) => { const v = get.call(ls, k); if (v !== null) { if (get.call(ls, k + '@' + cs) === null) set.call(ls, k + '@' + cs, v); del.call(ls, k); } });
    set.call(ls, 'pp_mig_subj', '1');
  }
} catch (e) {}
