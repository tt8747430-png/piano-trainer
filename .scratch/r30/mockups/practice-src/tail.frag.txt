// ——— strips: the frame takes the scaled height of what it holds ———
document.querySelectorAll('.dev[data-fit]').forEach(d => { const sc = d.firstElementChild; const k = parseFloat(getComputedStyle(d).getPropertyValue('--s')); d.style.height = (sc.offsetHeight * k + 18) + 'px' });
window.addEventListener('resize', () => document.querySelectorAll('.dev[data-fit]').forEach(d => { const sc = d.firstElementChild; const k = parseFloat(getComputedStyle(d).getPropertyValue('--s')); d.style.height = (sc.offsetHeight * k + 18) + 'px' }));

// ——— theme toggle ———
document.getElementById('themeBtn').onclick = () => { const r = document.documentElement; const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; r.dataset.theme = dark ? 'light' : 'dark' };

// ——— feedback under every screen ———
(function () {
  const figs = Array.from(document.querySelectorAll('figure[data-fb]')); const answers = {}; let db = null, local = {};
  try { local = JSON.parse(localStorage.getItem('r30-practice-feedback') || '{}') } catch (e) {}
  const key = n => 's' + n.replace(/\./g, '-');
  function render(id) { const f = document.querySelector('[data-key="' + id + '"]'); if (!f) return; const a = answers[id] || {};
    f.querySelectorAll('.fb button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === a.verdict)));
    const ta = f.querySelector('textarea'); if (ta && document.activeElement !== ta) ta.value = a.note || '';
    const link = document.querySelector('.toc a[href="#' + f.closest('section').id + '"]');
    if (link) link.classList.toggle('done', Array.from(f.closest('section').querySelectorAll('figure[data-key]')).some(x => (answers[x.dataset.key] || {}).verdict)) }
  async function save(id, patch) { answers[id] = Object.assign({}, answers[id], patch, { at: new Date().toISOString() }); render(id);
    const st = document.querySelector('[data-key="' + id + '"] .saved');
    try { local[id] = answers[id]; localStorage.setItem('r30-practice-feedback', JSON.stringify(local)) } catch (e) {}
    if (!db) { st.textContent = 'Kept in this browser only.'; return }
    try { await db.doc('feedback/' + id).set(answers[id]); st.textContent = 'Saved.' } catch (e) { st.textContent = 'Could not save; kept in this browser.' } }
  figs.forEach(f => { const id = key(f.dataset.fb); f.dataset.key = id;
    const box = document.createElement('div'); box.className = 'fb';
    [['ok', 'Looks right'], ['change', 'Change it'], ['remove', 'Not needed']].forEach(([v, l]) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.v = v; b.textContent = l; b.setAttribute('aria-pressed', 'false'); b.onclick = () => save(id, { verdict: v, screen: f.dataset.fb + ' ' + f.dataset.title }); box.appendChild(b) });
    const ta = document.createElement('textarea'); ta.id = 'fb-' + id; ta.placeholder = 'What to change on ' + f.dataset.fb + '…'; ta.setAttribute('aria-label', 'Feedback on screen ' + f.dataset.fb);
    let t; ta.oninput = () => { clearTimeout(t); t = setTimeout(() => save(id, { note: ta.value, screen: f.dataset.fb + ' ' + f.dataset.title }), 700) };
    const st = document.createElement('span'); st.className = 'saved'; f.append(box, ta, st); if (local[id]) { answers[id] = local[id]; render(id) } });
  const note = document.getElementById('storeNote');
  const timer = setTimeout(() => { if (!db) note.textContent = 'Your feedback is kept in this browser; tell me in the chat when you are done.' }, 10000);
  (window.claude && window.claude.use ? window.claude.use('db') : Promise.resolve(null)).then(d => { clearTimeout(timer); db = d;
    if (!db) { note.textContent = 'Your feedback is kept in this browser; tell me in the chat when you are done.'; return }
    note.textContent = 'Your feedback is saved with this page; I read it from here.';
    db.collection('feedback').onSnapshot(snap => (snap.docs || snap).forEach(doc => { answers[doc.id] = doc.data ? doc.data() : doc; render(doc.id) }), () => {}) }).catch(() => {});
})();
</script>
