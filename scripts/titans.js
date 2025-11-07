function $(id) {
  return document.getElementById(id);
}

function esc(value) {
  return (value ?? '').toString().replace(/[&<>"]/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[c]));
}

function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}

document.addEventListener('DOMContentLoaded', async () => {
  const grid = $('titanGrid');
  const empty = $('empty');
  const q = $('q');
  const category = $('category');
  const type = $('type');
  const hMin = $('heightMin');
  const hMax = $('heightMax');
  const spoilers = $('spoilers');

  const modal = $('modal');
  const closeBtn = modal.querySelector('.modal__close');

  let data;
  try {
    data = await fetchJSON('data/titans.json');
  } catch (err) {
    data = window.TITANS_FALLBACK();
  }

  const bySlug = new Map(data.map((t) => [t.slug, t]));
  const rank = { none: 0, low: 1, medium: 2 };

  const renderCards = (list) => {
    grid.innerHTML = list
      .map((t) => {
        const chips = (t.inheritors || [])
          .map(
            (h) => `
        <span class="chip">
          <img src="${esc(h.image)}" alt="" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,${encodeURIComponent(fallbackSVG(h.name))}'">
          ${esc(h.name)}
        </span>`
          )
          .join('');
        return `
        <button class="card titan-card" type="button" data-slug="${esc(t.slug)}" id="${esc(t.slug)}" aria-describedby="gridLabel">
          <img src="${esc(t.image)}" alt="${esc(t.name)} silhouette" loading="lazy"
               onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,${encodeURIComponent(fallbackSVG(t.name))}'">
          <h3>${esc(t.name)}</h3>
          <p class="muted">${esc(t.summary)}</p>
          <div class="chips">${chips}</div>
        </button>`;
      })
      .join('');
    empty.hidden = list.length > 0;
  };

  const matches = (t) => {
    const term = (q.value || '').toLowerCase().trim();
    const cat = category.value;
    const ty = type.value;
    const min = hMin.value === '' ? -Infinity : Number(hMin.value);
    const max = hMax.value === '' ? Infinity : Number(hMax.value);
    const sp = spoilers.value || 'low';
    if (cat && t.category !== cat) return false;
    if (ty && t.type !== ty) return false;
    if (t.heightMeters < min) return false;
    if (t.heightMeters > max) return false;
    const tRank = rank[t.spoilerLevel || 'none'] ?? 0;
    if (tRank > rank[sp]) return false;
    if (!term) return true;
    const blob = [
      t.name,
      t.type,
      t.category,
      t.summary,
      ...(t.abilities || []),
      ...(t.weaknesses || []),
      ...((t.inheritors || []).map((h) => h.name))
    ]
      .join(' ')
      .toLowerCase();
    return blob.includes(term);
  };

  function apply() {
    renderCards(data.filter(matches));
  }

  apply();

  let to = null;
  const deb = (fn) => {
    clearTimeout(to);
    to = setTimeout(fn, 120);
  };

  [q, category, type, hMin, hMax, spoilers].forEach((el) => {
    el.addEventListener('input', () => deb(apply));
    el.addEventListener('change', () => deb(apply));
  });

  // Modal controls
  let lastFocus = null;
  function openModal(t) {
    $('modalTitle').textContent = t.name;
    const img = $('modalImg');
    img.src = t.image;
    img.alt = `${t.name} silhouette`;
    img.onerror = () => {
      img.onerror = null;
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(fallbackSVG(t.name));
    };
    $('modalType').textContent = t.type || '—';
    $('modalCategory').textContent = t.category || '—';
    $('modalHeight').textContent = t.heightMeters ?? '—';
    $('modalAbilities').textContent = (t.abilities || []).join(', ') || '—';
    $('modalWeaknesses').textContent = (t.weaknesses || []).join(', ') || '—';
    $('modalFirst').textContent = t.firstAppearance || '—';
    $('modalAff').textContent = (t.affiliations || []).join(', ') || '—';
    $('modalShifters').innerHTML = (t.inheritors || [])
      .map(
        (h) =>
          `<span class="chip"><img src="${esc(h.image)}" alt="" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,${encodeURIComponent(fallbackSVG(h.name))}'">${esc(h.name)}</span>`
      )
      .join(' ') || '—';

    lastFocus = document.activeElement;
    modal.hidden = false;
    trapFocus(modal);
  }

  function closeModal() {
    modal.hidden = true;
    releaseFocus(modal);
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  grid.addEventListener('click', (event) => {
    const card = event.target.closest('.titan-card');
    if (!card) return;
    const titan = bySlug.get(card.dataset.slug);
    if (!titan) return;
    location.hash = titan.slug;
    openModal(titan);
  });

  grid.addEventListener('keydown', (event) => {
    const card = event.target.closest('.titan-card');
    if (!card) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const titan = bySlug.get(card.dataset.slug);
      if (!titan) return;
      location.hash = titan.slug;
      openModal(titan);
    }
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });

  // Deep link
  if (location.hash) {
    const slug = location.hash.slice(1);
    const titan = bySlug.get(slug);
    if (titan) {
      openModal(titan);
      const el = document.getElementById(slug);
      if (el) {
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }
});

// Focus trap helpers
function trapFocus(scope) {
  const focusables = scope.querySelectorAll(
    'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  scope._trap = (event) => {
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  scope.addEventListener('keydown', scope._trap);
  first.focus();
}

function releaseFocus(scope) {
  if (scope._trap) {
    scope.removeEventListener('keydown', scope._trap);
    scope._trap = null;
  }
}
