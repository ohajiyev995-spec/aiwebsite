function clamp(v,min,max){ return Math.min(max, Math.max(min, v)); }
function byId(id){ return document.getElementById(id); }
function escapeHTML(s){ return (s||'').toString().replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

document.addEventListener('DOMContentLoaded', async () => {
  const grid = byId('titan-grid');
  const tooltip = byId('tooltip');
  const modal = byId('modal');
  const modalClose = modal.querySelector('.modal__close');

  const inputQ = byId('q');
  const selCategory = byId('category');
  const selType = byId('type');
  const heightMin = byId('heightMin');
  const heightMax = byId('heightMax');
  const spoilers = byId('spoilers');
  const empty = byId('empty');

  const data = await window.TITANS_FALLBACK_DATA().then(async d => {
    // try to load full JSON if fallback returned a subset
    if (d.length < 9) {
      try {
        const r = await fetch('data/titans.json', { cache:'no-store' });
        if (r.ok) return await r.json();
      } catch {}
    }
    return d;
  });

  const indexBySlug = new Map(data.map(t => [t.slug, t]));

  function render(list){
    grid.innerHTML = list.map(t => `
      <button class="card titan-card" data-slug="${t.slug}" id="${t.slug}" aria-describedby="tooltip">
        <img src="${escapeHTML(t.image)}" alt="${escapeHTML(t.name)} silhouette" loading="lazy">
        <h3>${escapeHTML(t.name)}</h3>
        <p class="muted">${escapeHTML(t.summary)}</p>
      </button>
    `).join('');
    empty.hidden = list.length !== 0;
  }

  function matches(t){
    const q = (inputQ.value||'').trim().toLowerCase();
    const cat = selCategory.value;
    const ty = selType.value;
    const min = Number(heightMin.value||'-Infinity');
    const max = Number(heightMax.value||'Infinity');
    const sp = spoilers.value;

    if (cat && t.category !== cat) return false;
    if (ty && t.type !== ty) return false;
    if (!Number.isNaN(min) && t.heightMeters < min) return false;
    if (!Number.isNaN(max) && t.heightMeters > max) return false;

    const spRank = {none:0, low:1, medium:2};
    const tRank = spRank[(t.spoilerLevel||'none')] ?? 0;
    if (tRank > spRank[sp]) return false;

    if (!q) return true;
    const blob = [
      t.name, t.type, t.category, (t.shifters||[]).join(' '),
      (t.abilities||[]).join(' '), t.summary
    ].join(' ').toLowerCase();
    return blob.includes(q);
  }

  function applyFilters(){
    render(data.filter(matches));
  }

  // Initial render
  applyFilters();

  // Debounce
  let to=null; const deb = fn => { clearTimeout(to); to=setTimeout(fn, 120); };
  [inputQ, selCategory, selType, heightMin, heightMax, spoilers].forEach(el => {
    el.addEventListener('input', () => deb(applyFilters()));
    el.addEventListener('change', () => deb(applyFilters()));
  });

  // Tooltip follow
  let tipVisible = false;
  function showTip(target, t){
    tooltip.innerHTML = `
      <strong>${escapeHTML(t.name)}</strong><br>
      Height: ${t.heightMeters} m · Type: ${escapeHTML(t.type)}<br>
      ${escapeHTML(t.summary)}
    `;
    tooltip.hidden = false;
    tipVisible = true;
  }
  function hideTip(){ tooltip.hidden = true; tipVisible = false; }

  // Reposition on mousemove
  document.addEventListener('mousemove', (e) => {
    if (!tipVisible) return;
    const pad = 16;
    const tw = tooltip.offsetWidth || 300;
    const th = tooltip.offsetHeight || 120;
    let x = e.clientX + 16;
    let y = e.clientY + 16;
    x = clamp(x, pad, window.innerWidth - tw - pad);
    y = clamp(y, pad, window.innerHeight - th - pad);
    tooltip.style.left = x + 'px';
    tooltip.style.top  = y + 'px';
    tooltip.style.transform = 'none';
  });

  // Card interactions
  grid.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.titan-card');
    if (!card) return;
    const t = indexBySlug.get(card.dataset.slug);
    if (t) showTip(card, t);
  });
  grid.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) hideTip();
  });
  grid.addEventListener('focusin', (e) => {
    const card = e.target.closest('.titan-card');
    if (!card) return;
    const t = indexBySlug.get(card.dataset.slug);
    if (t) showTip(card, t);
  });
  grid.addEventListener('focusout', () => hideTip());

  // Modal
  function openModal(t){
    byId('modalTitle').textContent = t.name;
    const img = byId('modalImg');
    img.src = t.image; img.alt = `${t.name} silhouette`;
    byId('modalType').textContent = t.type || '—';
    byId('modalCategory').textContent = t.category || '—';
    byId('modalHeight').textContent = t.heightMeters ?? '—';
    byId('modalShifters').textContent = (t.shifters||[]).join(', ') || '—';
    byId('modalAbilities').textContent = (t.abilities||[]).join(', ') || '—';
    byId('modalWeaknesses').textContent = (t.weaknesses||[]).join(', ') || '—';
    byId('modalFirst').textContent = t.firstAppearance || '—';
    byId('modalAff').textContent = (t.affiliations||[]).join(', ') || '—';
    byId('modalFun').textContent = t.funFact || '—';
    modal.hidden = false;
    trapFocus(modal);
  }
  function closeModal(){ modal.hidden = true; releaseFocus(); hideTip(); }

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.titan-card');
    if (!card) return;
    const t = indexBySlug.get(card.dataset.slug);
    if (t) openModal(t);
  });
  grid.addEventListener('keydown', (e) => {
    const card = e.target.closest('.titan-card');
    if (!card) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const t = indexBySlug.get(card.dataset.slug);
      if (t) openModal(t);
    }
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
});

// Minimal focus trap
let lastFocused=null;
function trapFocus(scope){
  lastFocused = document.activeElement;
  const focusables = scope.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
  const first = focusables[0], last = focusables[focusables.length-1];
  first?.focus();
  scope.addEventListener('keydown', scope._trapHandler = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}
function releaseFocus(){
  const scope = document.getElementById('modal');
  scope.removeEventListener('keydown', scope._trapHandler);
  lastFocused?.focus();
}
