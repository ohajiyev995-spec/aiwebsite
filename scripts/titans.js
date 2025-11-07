function clamp(v,min,max){ return Math.min(max, Math.max(min, v)); }
function $(id){ return document.getElementById(id); }
function esc(s){ return (s??'').toString().replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

document.addEventListener('DOMContentLoaded', initTitans);

async function initTitans(){
  const grid = $('titanGrid');
  const empty = $('empty');
  const q = $('q'), cat = $('category'), type = $('type');
  const hMin = $('heightMin'), hMax = $('heightMax'), spoilers = $('spoilers');

  const modal = $('modal');
  const closeBtn = modal.querySelector('.modal__close');

  // Load data with fallback
  let data;
  try { data = await fetchJSON('data/titans.json'); }
  catch { data = (window.TITANS_FALLBACK && window.TITANS_FALLBACK()) || []; }

  const bySlug = new Map(data.map(t => [t.slug, t]));

  const renderCards = (list) => {
    grid.innerHTML = list.map(t => {
      const chips = (t.shifters||[]).map(s => `<span class="chip">${esc(s)}</span>`).join('');
      return `
        <button class="card titan-card" data-slug="${esc(t.slug)}" id="${esc(t.slug)}" aria-describedby="gridLabel">
          <img src="${esc(t.image)}" alt="${esc(t.name)} silhouette" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,${encodeURIComponent(fallbackSVG(t.name))}'">
          <h3>${esc(t.name)}</h3>
          <p class="muted">${esc(t.summary)}</p>
          <div class="chips">${chips}</div>
        </button>
      `;
    }).join('');
    empty.hidden = list.length > 0;
  };

  const rank = { none:0, low:1, medium:2 };
  const matches = (t) => {
    const term = (q.value||'').trim().toLowerCase();
    const c = cat.value; const ty = type.value;
    const min = hMin.value === '' ? -Infinity : Number(hMin.value);
    const max = hMax.value === '' ?  Infinity : Number(hMax.value);
    const sp = spoilers.value || 'low';

    if (c && t.category !== c) return false;
    if (ty && t.type !== ty) return false;
    if (t.heightMeters < min) return false;
    if (t.heightMeters > max) return false;

    const tRank = rank[(t.spoilerLevel||'none')] ?? 0;
    if (tRank > rank[sp]) return false;

    if (!term) return true;
    const blob = [
      t.name, t.type, t.category, (t.summary||''),
      (t.abilities||[]).join(' '),
      (t.shifters||[]).join(' ')
    ].join(' ').toLowerCase();
    return blob.includes(term);
  };

  function applyFilters(){ renderCards(data.filter(matches)); }

  // Initial render
  applyFilters();

  // Debounced filtering
  let to=null; const deb = fn=>{ clearTimeout(to); to=setTimeout(fn,120); };
  [q,cat,type,hMin,hMax,spoilers].forEach(el=>{
    el.addEventListener('input', ()=>deb(applyFilters()));
    el.addEventListener('change', ()=>deb(applyFilters()));
  });

  // Modal helpers
  let lastFocus=null;
  function openModal(t){
    $('modalTitle').textContent = t.name;
    const img = $('modalImg');
    img.src = t.image;
    img.alt = `${t.name} silhouette`;
    img.onerror = ()=>{ img.onerror=null; img.src = 'data:image/svg+xml;utf8,'+encodeURIComponent(fallbackSVG(t.name)); };

    $('modalType').textContent = t.type || '—';
    $('modalCategory').textContent = t.category || '—';
    $('modalHeight').textContent = (t.heightMeters ?? '—');
    $('modalShifters').innerHTML = (t.shifters||[]).map(s=>`<span class="chip">${esc(s)}</span>`).join(' ') || '—';
    $('modalAbilities').textContent = (t.abilities||[]).join(', ') || '—';
    $('modalWeaknesses').textContent = (t.weaknesses||[]).join(', ') || '—';
    $('modalFirst').textContent = t.firstAppearance || '—';
    $('modalAff').textContent = (t.affiliations||[]).join(', ') || '—';
    $('modalFun').textContent = t.funFact || '—';

    lastFocus = document.activeElement;
    modal.hidden = false;
    trapFocus(modal);
  }
  function closeModal(){
    modal.hidden = true;
    releaseFocus(modal);
    lastFocus?.focus();
  }

  // Card interactions
  grid.addEventListener('click', (e)=>{
    const card = e.target.closest('.titan-card');
    if(!card) return;
    const t = bySlug.get(card.dataset.slug);
    if (t){ location.hash = t.slug; openModal(t); }
  });
  grid.addEventListener('keydown', (e)=>{
    const card = e.target.closest('.titan-card');
    if(!card) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const t = bySlug.get(card.dataset.slug);
      if (t){ location.hash = t.slug; openModal(t); }
    }
  });

  // Close modal
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && !modal.hidden) closeModal(); });

  // Deep-link open
  if (location.hash){
    const slug = location.hash.replace('#','');
    const t = bySlug.get(slug);
    if (t) { openModal(t); document.getElementById(slug)?.scrollIntoView({block:'nearest'}); }
  }
}

// Minimal focus trap helpers (no deps)
function trapFocus(scope){
  const f = scope.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
  if (!f.length) return;
  const first = f[0], last = f[f.length-1];
  scope._trapHandler = (e)=>{
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  };
  scope.addEventListener('keydown', scope._trapHandler);
  first.focus();
}
function releaseFocus(scope){
  if (scope._trapHandler) scope.removeEventListener('keydown', scope._trapHandler);
}

// Simple generated fallback SVG if icon missing
function fallbackSVG(label='Titan'){
  return `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160' role='img' aria-label='${label} silhouette'>
  <rect width='160' height='160' rx='18' fill='currentColor' opacity='.12'/>
  <path d='M80 26c22 0 40 18 40 40v16h10v52H30V82h10V66c0-22 18-40 40-40Z' fill='currentColor'/>
</svg>`.trim();
}
