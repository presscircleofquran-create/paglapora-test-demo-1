/* head-এ আগে চলে (ঝলকানি ছাড়া থিম): এখন শুধু ডার্ক।
   পেজ খোলা থাকলেও সময় বদলালে নিজে থেকে বদলে যায়। ?theme=light|dark দিয়ে জোর করা যায় (পরীক্ষার জন্য)। */
(function () {
  var d = document.documentElement, q = /[?&]theme=(light|dark)/.exec(location.search), force = null;
  try { force = q ? q[1] : null; } catch (e) {}
  function pick() { if (force) return force; var v = null; try { v = localStorage.getItem('pp_theme'); } catch (e) {} if (v === 'light' || v === 'dark') return v; if (v === 'sys') { try { return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; } catch (e) {} } return 'dark'; } /* সেটিংসে বাছা থিম: dark (ডিফল্ট) / light / sys */
  window.ppTheme = function () { apply(); };
  try { matchMedia('(prefers-color-scheme: light)').addEventListener('change', apply); } catch (e) {}
  function apply() {
    var t = pick(); if (d.getAttribute('data-theme') !== t) d.setAttribute('data-theme', t);
    var m = document.querySelector('meta[name=theme-color]'); if (m) m.content = t === 'dark' ? '#131f24' : '#ffffff';
  }
  apply(); document.addEventListener('DOMContentLoaded', apply);
})();
