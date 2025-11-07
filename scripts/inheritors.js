(() => {
  const LIST_SELECTOR = '#inheritorList';
  const DETAIL_SELECTOR = '#detail';
  const MODAL_SELECTOR = '#modal';
  const MODAL_CONTENT_SELECTOR = '#modalContent';
  const SEARCH_SELECTOR = '#q';

  const join = (value) => Array.isArray(value) ? value.join(', ') : (value ?? '—');
  const escapeHTML = (str = '') => str.replace(/[&<>"']/g, (ch) => (
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])
  ));

  const createFallbackSilhouette = (label = '') => {
    const initial = escapeHTML(label.trim().charAt(0) || 'A');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="32" fill="none" stroke="currentColor" stroke-width="8"/><circle cx="64" cy="56" r="26" fill="currentColor"/><path d="M32 110c8-24 24-36 32-36s24 12 32 36" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><text x="64" y="68" text-anchor="middle" fill="var(--bg)" font-family=\'Inter, sans-serif\' font-size="28">${initial}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  const focusableSelectors = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  document.addEventListener('DOMContentLoaded', async () => {
    const listEl = document.querySelector(LIST_SELECTOR);
    const detailEl = document.querySelector(DETAIL_SELECTOR);
    const modal = document.querySelector(MODAL_SELECTOR);
    const modalContent = document.querySelector(MODAL_CONTENT_SELECTOR);
    const searchInput = document.querySelector(SEARCH_SELECTOR);

    if (!listEl || !detailEl || !modal || !modalContent) return;

    let data;
    try {
      data = await fetchJSON('data/attack_titans.json');
    } catch (error) {
      data = window.ATTACK_FALLBACK();
    }

    const mapBySlug = new Map();
    data.forEach(entry => mapBySlug.set(entry.slug, entry));

    const state = {
      buttons: new Map(),
      currentSlug: null,
      lastTrigger: null,
      modalReleaseFn: null
    };

    buildList(data);

    const initialSlug = decodeURIComponent(location.hash.replace('#','')) || (data[0]?.slug ?? null);
    if (initialSlug && mapBySlug.has(initialSlug)) {
      selectBySlug(initialSlug, { openModal: false, scroll: true });
    }

    listEl.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-slug]');
      if (!button) return;
      event.preventDefault();
      state.lastTrigger = button;
      selectBySlug(button.dataset.slug, { openModal: true, scroll: false });
    });

    listEl.addEventListener('keydown', (event) => {
      const button = event.target.closest('button[data-slug]');
      if (!button) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        state.lastTrigger = button;
        selectBySlug(button.dataset.slug, { openModal: true, scroll: false });
      }
    });

    if (searchInput) {
      let timeout = null;
      const handleSearch = () => {
        const term = (searchInput.value || '').trim().toLowerCase();
        let firstVisible = null;
        listEl.querySelectorAll('button[data-slug]').forEach((btn) => {
          const entry = mapBySlug.get(btn.dataset.slug);
          const haystack = [
            entry.name,
            entry.era,
            entry.summary,
            (entry.abilities || []).join(' ')
          ].join(' ').toLowerCase();
          const matches = haystack.includes(term);
          btn.hidden = !matches;
          if (matches && !firstVisible) firstVisible = btn;
        });

        if (firstVisible && firstVisible.hidden === false && (!state.currentSlug || listEl.querySelector(`button[data-slug="${state.currentSlug}"]`)?.hidden)) {
          state.lastTrigger = firstVisible;
          selectBySlug(firstVisible.dataset.slug, { openModal: false, scroll: true });
        }
      };
      searchInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(handleSearch, 120);
      });
    }

    const modalClose = modal.querySelector('.modal__close');
    modalClose?.addEventListener('click', () => closeModal());
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.hidden === false) {
        closeModal();
      }
    });

    function buildList(entries) {
      listEl.innerHTML = '';
      const fragment = document.createDocumentFragment();

      entries.forEach((entry) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'list__item';
        button.dataset.slug = entry.slug;
        button.role = 'option';
        button.setAttribute('aria-selected', 'false');
        button.innerHTML = `
          <span>${escapeHTML(entry.name)}</span>
          <span>${escapeHTML(entry.era || '')}</span>
        `;
        fragment.appendChild(button);
        state.buttons.set(entry.slug, button);
      });

      listEl.appendChild(fragment);
    }

    function selectBySlug(slug, options = {}) {
      if (!mapBySlug.has(slug)) return;
      const entry = mapBySlug.get(slug);
      const button = state.buttons.get(slug);
      if (!button) return;

      if (state.currentSlug) {
        const prev = state.buttons.get(state.currentSlug);
        if (prev) {
          prev.classList.remove('is-active');
          prev.setAttribute('aria-selected', 'false');
        }
      }

      state.currentSlug = slug;
      button.classList.add('is-active');
      button.setAttribute('aria-selected', 'true');

      if (location.hash !== `#${slug}`) {
        history.replaceState(null, '', `#${slug}`);
      }
      if (options.scroll) {
        window.applyHashScroll(button);
      }

      renderDetail(entry);
      if (options.openModal) {
        openModal(entry);
      }
    }

    function renderDetail(entry) {
      const abilities = join(entry.abilities);
      const weaknesses = join(entry.weaknesses);
      const notable = join(entry.notableEvents);
      const affiliations = join(entry.affiliations);
      const height = entry.heightMeters != null ? `${entry.heightMeters} m` : '—';
      const summary = escapeHTML(entry.summary || '—');

      detailEl.innerHTML = `
        <img src="${escapeHTML(entry.image || '')}" alt="${escapeHTML(entry.name)} silhouette" id="${escapeHTML(entry.slug)}-img">
        <div class="detail__content">
          <h2>${escapeHTML(entry.name)}</h2>
          <p class="muted">${summary}</p>
          <dl>
            <dt>Era</dt><dd>${escapeHTML(entry.era || '—')}</dd>
            <dt>First appearance</dt><dd>${escapeHTML(entry.firstAppearance || '—')}</dd>
            <dt>Abilities</dt><dd>${escapeHTML(abilities)}</dd>
            <dt>Weaknesses</dt><dd>${escapeHTML(weaknesses)}</dd>
            <dt>Notable events</dt><dd>${escapeHTML(notable)}</dd>
            <dt>Height</dt><dd>${escapeHTML(height)}</dd>
            <dt>Affiliations</dt><dd>${escapeHTML(affiliations)}</dd>
          </dl>
        </div>
      `;

      const detailImg = detailEl.querySelector('img');
      attachImageFallback(detailImg, entry.name);
    }

    function openModal(entry) {
      modalContent.innerHTML = renderModalContent(entry);
      modal.hidden = false;
      const modalImg = modalContent.querySelector('img');
      attachImageFallback(modalImg, entry.name);
      trapFocus(modal);
    }

    function closeModal() {
      modal.hidden = true;
      modalContent.innerHTML = '';
      releaseFocus();
      if (state.lastTrigger && document.body.contains(state.lastTrigger)) {
        state.lastTrigger.focus();
      }
    }

    function renderModalContent(entry) {
      const abilities = join(entry.abilities);
      const weaknesses = join(entry.weaknesses);
      const notable = join(entry.notableEvents);
      const affiliations = join(entry.affiliations);
      const height = entry.heightMeters != null ? `${entry.heightMeters} m` : '—';

      return `
        <article class="detail">
          <img src="${escapeHTML(entry.image || '')}" alt="${escapeHTML(entry.name)} silhouette">
          <div>
            <h2 id="modalTitle">${escapeHTML(entry.name)}</h2>
            <p class="muted">${escapeHTML(entry.summary || '—')}</p>
            <dl>
              <dt>Era</dt><dd>${escapeHTML(entry.era || '—')}</dd>
              <dt>First appearance</dt><dd>${escapeHTML(entry.firstAppearance || '—')}</dd>
              <dt>Abilities</dt><dd>${escapeHTML(abilities)}</dd>
              <dt>Weaknesses</dt><dd>${escapeHTML(weaknesses)}</dd>
              <dt>Notable events</dt><dd>${escapeHTML(notable)}</dd>
              <dt>Height</dt><dd>${escapeHTML(height)}</dd>
              <dt>Affiliations</dt><dd>${escapeHTML(affiliations)}</dd>
            </dl>
          </div>
        </article>
      `;
    }

    function attachImageFallback(img, label) {
      if (!img) return;
      img.addEventListener('error', () => {
        if (img.dataset.fallbackApplied) return;
        img.dataset.fallbackApplied = 'true';
        img.src = createFallbackSilhouette(label);
      }, { once:true });
    }

    let previousFocus = null;
    function trapFocus(scope) {
      previousFocus = document.activeElement;
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
      state.modalReleaseFn = () => scope.removeEventListener('keydown', handler);
    }

    function releaseFocus() {
      state.modalReleaseFn?.();
      state.modalReleaseFn = null;
      if (previousFocus && document.body.contains(previousFocus)) {
        previousFocus.focus();
      }
      previousFocus = null;
    }
  });
})();
