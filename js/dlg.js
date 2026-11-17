// ছোট নিশ্চিতকরণ বাক্স: ফোনে নিচ থেকে ওঠা শিট, বড় পর্দায় মাঝের কার্ড
export function dlg(root, o) {
  const el = document.createElement('div'); el.className = 'pf-ov dg-ov';
  el.innerHTML = `<div class="dg" role="dialog" aria-modal="true"><h3 class="t">${o.title}</h3><p class="t">${o.text}</p><button type="button" class="btn ${o.danger ? 'btn-danger' : 'btn-primary'}" data-ok>${o.ok}</button>${o.no ? `<button type="button" class="dg-no t${o.noDanger === false ? ' soft' : ''}" data-no>${o.no}</button>` : ''}</div>`;
  root.appendChild(el);
  el.onclick = (e) => {
    if (e.target.closest('[data-ok]')) { el.remove(); if (o.onOk) o.onOk(); }
    else if (e.target.closest('[data-no]')) { el.remove(); if (o.onNo) o.onNo(); }
    else if (e.target === el) { el.remove(); if (o.onOk) o.onOk(); }
  };
  return el;
}
