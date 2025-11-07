(() => {
  const focusableSelectors = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  const escapeHTML = (str = '') => str.replace(/[&<>"']/g, (ch) => (
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])
  ));

  const listOrDash = (value) => {
    if (Array.isArray(value) && value.length) return value.join(', ');
    if (typeof value === 'string' && value.trim()) return value;
    return '—';
  };

  const createFallbackSilhouette = (label = '') => {
    const initial = escapeHTML(label.trim().charAt(0) || 'T');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect x="6" y="6" width="116" height="116" rx="28" ry="28" fill="none" stroke="currentColor" stroke-width="8"/><circle cx="64" cy="52" r="26" fill="currentColor"/><path d="M36 108c8-26 28-38 28-38s20 12 28 38" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><text x="64" y="68" text-anchor="middle" fill="var(--bg)" font-family='Inter, sans-serif' font-size="28">${initial}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  const escapeSelector = (value) => {
    if (window.CSS && typeof window.CSS.escape === 'function') {
      return window.CSS.escape(value);
    }
    return value.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  };

  document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('titanGrid');
    if (!grid) return;

    const emptyState = document.getElementById('titanEmpty');
    const searchInput = document.getElementById('q');
    const categorySelect = document.getElementById('category');
    const typeSelect = document.getElementById('type');
    const heightMin = document.getElementById('heightMin');
    const heightMax = document.getElementById('heightMax');
    const spoilersSelect = document.getElementById('spoilers');
    const modal = document.getElementById('titanModal');
    const modalContent = document.getElementById('titanModalContent');
    const modalClose = modal?.querySelector('.modal__close');

    let dataset;
    try {
      dataset = await fetchJSON('data/titans.json');
    } catch {
      dataset = window.TITANS_FALLBACK();
    }

    const titansBySlug = new Map(dataset.map(item => [item.slug, item]));
    const spoilerRank = { none: 0, low: 1, medium: 2 };

    let filtered = dataset.slice();
    let lastTrigger = null;
    let releaseFocusFn = null;

    function attachImageFallback(img, label) {
      if (!img) return;
      img.addEventListener('error', () => {
        if (img.dataset.fallbackApplied) return;
        img.dataset.fallbackApplied = 'true';
        img.src = createFallbackSilhouette(label);
      }, { once: true });
    }

    function render(list) {
      if (!list.length) {
        grid.innerHTML = '';
        if (emptyState) emptyState.hidden = false;
        return;
      }
      if (emptyState) emptyState.hidden = true;
      grid.innerHTML = list.map(item => {
        const chips = (item.shifters || []).map(shifter => `<span class="chip">${escapeHTML(shifter)}</span>`).join('');
        const chipsMarkup = chips ? `<div class="chips">${chips}</div>` : '';
        return `
          <button class="card titan-card" type="button" data-slug="${item.slug}" role="listitem">
            <img src="${escapeHTML(item.image || '')}" alt="${escapeHTML(item.name)} silhouette" loading="lazy">
            <h3>${escapeHTML(item.name)}</h3>
            <p class="muted">${escapeHTML(item.summary || '')}</p>
            ${chipsMarkup}
          </button>
        `;
      }).join('');
      grid.querySelectorAll('button[data-slug]').forEach((button) => {
        const item = titansBySlug.get(button.dataset.slug);
        const img = button.querySelector('img');
        attachImageFallback(img, item?.name || button.dataset.slug);
      });
    }

    function matches(item) {
      const query = (searchInput?.value || '').trim().toLowerCase();
      const category = categorySelect?.value || '';
      const type = typeSelect?.value || '';
      const min = Number(heightMin?.value ?? '');
      const max = Number(heightMax?.value ?? '');
      const spoilers = spoilersSelect?.value || 'medium';

      if (category && item.category !== category) return false;
      if (type && item.type !== type) return false;

      if (!Number.isNaN(min) && min !== 0 && item.heightMeters < min) return false;
      if (!Number.isNaN(max) && max !== 0 && item.heightMeters > max) return false;

      const titanRank = spoilerRank[item.spoilerLevel || 'none'] ?? 0;
      if (titanRank > (spoilerRank[spoilers] ?? 2)) return false;

      if (!query) return true;
      const haystack = [
        item.name,
        item.type,
        item.category,
        item.summary,
        listOrDash(item.abilities),
        listOrDash(item.shifters)
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    }

    function applyFilters() {
      filtered = dataset.filter(matches);
      render(filtered);
    }

    let debounceTimer = null;
    const scheduleFilters = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyFilters, 120);
    };

    [searchInput, categorySelect, typeSelect, heightMin, heightMax, spoilersSelect].forEach(el => {
      if (!el) return;
      const eventName = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(eventName, scheduleFilters);
    });

    grid.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-slug]');
      if (!button) return;
      const slug = button.dataset.slug;
      lastTrigger = button;
      openModal(slug);
    });

    grid.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const button = event.target.closest('button[data-slug]');
      if (!button) return;
      event.preventDefault();
      const slug = button.dataset.slug;
      lastTrigger = button;
      openModal(slug);
    });

    modalClose?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal && modal.hidden === false) {
        closeModal();
      }
    });

    function openModal(slug) {
      const titan = titansBySlug.get(slug);
      if (!titan || !modal || !modalContent) return;
      modalContent.innerHTML = buildModalMarkup(titan);
      modal.hidden = false;
      const modalImg = modalContent.querySelector('img');
      attachImageFallback(modalImg, titan.name);
      trapFocus(modal);
      if (location.hash !== `#${slug}`) {
        history.replaceState(null, '', `#${slug}`);
      }
    }

    function closeModal() {
      if (!modal) return;
      modal.hidden = true;
      modalContent.innerHTML = '';
      releaseFocus();
      if (lastTrigger && document.body.contains(lastTrigger)) {
        lastTrigger.focus();
      }
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    function buildModalMarkup(item) {
      const height = item.heightMeters != null ? `${item.heightMeters} m` : '—';
      const chips = (item.shifters || []).map(shifter => `<span class="chip">${escapeHTML(shifter)}</span>`).join('');
      const chipsMarkup = chips ? `<div class="chips">${chips}</div>` : '';
      return `
        <article class="detail">
          <img src="${escapeHTML(item.image || '')}" alt="${escapeHTML(item.name)} silhouette">
          <div>
            <h2 id="titanModalTitle">${escapeHTML(item.name)}</h2>
            <p class="muted">${escapeHTML(item.summary || '')}</p>
            ${chipsMarkup}
            <dl>
              <dt>Type</dt><dd>${escapeHTML(item.type || '—')}</dd>
              <dt>Category</dt><dd>${escapeHTML(item.category || '—')}</dd>
              <dt>Height</dt><dd>${escapeHTML(height)}</dd>
              <dt>Inheritors</dt><dd>${escapeHTML(listOrDash(item.shifters))}</dd>
              <dt>Abilities</dt><dd>${escapeHTML(listOrDash(item.abilities))}</dd>
              <dt>Weaknesses</dt><dd>${escapeHTML(listOrDash(item.weaknesses))}</dd>
              <dt>First appearance</dt><dd>${escapeHTML(item.firstAppearance || '—')}</dd>
              <dt>Affiliations</dt><dd>${escapeHTML(listOrDash(item.affiliations))}</dd>
              <dt>Fun fact</dt><dd>${escapeHTML(item.funFact || '—')}</dd>
            </dl>
          </div>
        </article>
      `;
    }

    function trapFocus(scope) {
      const focusables = Array.from(scope.querySelectorAll(focusableSelectors));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      first.focus();
      const handler = (event) => {
        if (event.key !== 'Tab') return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };
      scope.addEventListener('keydown', handler);
      releaseFocusFn = () => scope.removeEventListener('keydown', handler);
    }

    function releaseFocus() {
      releaseFocusFn?.();
      releaseFocusFn = null;
    }

    applyFilters();

    const initialSlug = decodeURIComponent((location.hash || '').replace('#', ''));
    if (initialSlug && titansBySlug.has(initialSlug)) {
      requestAnimationFrame(() => {
        const trigger = grid.querySelector(`button[data-slug="${escapeSelector(initialSlug)}"]`);
        if (trigger) {
          lastTrigger = trigger;
          openModal(initialSlug);
          trigger.scrollIntoView({ block: 'nearest' });
        } else {
          openModal(initialSlug);
        }
      });
    }
  });
})();
