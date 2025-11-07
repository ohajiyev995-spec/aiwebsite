(() => {
  const grid = document.getElementById('titanGrid');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalImg = document.getElementById('modalImg');
  const modalType = document.getElementById('modalType');
  const modalCategory = document.getElementById('modalCategory');
  const modalHeight = document.getElementById('modalHeight');
  const modalAbilities = document.getElementById('modalAbilities');
  const modalWeaknesses = document.getElementById('modalWeaknesses');
  const modalFirst = document.getElementById('modalFirst');
  const modalAff = document.getElementById('modalAff');
  const modalShifters = document.getElementById('modalShifters');
  const closeBtn = modal.querySelector('[data-close-modal]');

  const fieldSearch = document.getElementById('q');
  const fieldCategory = document.getElementById('category');
  const fieldType = document.getElementById('type');
  const fieldHeightMin = document.getElementById('heightMin');
  const fieldHeightMax = document.getElementById('heightMax');
  const fieldSpoilers = document.getElementById('spoilers');

  const spoilerRank = { none: 0, low: 1, medium: 2, high: 3 };

  let allTitans = [];
  let filteredTitans = [];
  let lastFocused = null;
  let focusableModalItems = [];

  const debounce = (fn, delay = 120) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const matchesSearch = (titan, term) => {
    if (!term) return true;
    const blob = [
      titan.name,
      titan.type,
      titan.category,
      titan.summary,
      titan.abilities.join(' '),
      titan.weaknesses.join(' '),
      titan.inheritors.map(({ name, notes }) => `${name} ${notes}`).join(' ')
    ]
      .join(' ')
      .toLowerCase();
    return blob.includes(term.toLowerCase());
  };

  const withinCategory = (titan, category) =>
    category === 'all' ? true : titan.category === category;

  const withinType = (titan, type) => (type === 'all' ? true : titan.type === type);

  const withinHeight = (titan, min, max) => {
    const { heightMeters } = titan;
    if (!Number.isNaN(min) && min !== null && heightMeters < min) return false;
    if (!Number.isNaN(max) && max !== null && heightMeters > max) return false;
    return true;
  };

  const withinSpoiler = (titan, ceiling) => {
    const targetRank = spoilerRank[titan.spoilerLevel] ?? spoilerRank.medium;
    const limitRank = spoilerRank[ceiling] ?? spoilerRank.medium;
    return targetRank <= limitRank;
  };

  const renderEmptyState = () => {
    grid.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'card card--placeholder';
    card.innerHTML = `<p class="muted">No Titans match your filters. Try lowering spoiler sensitivity or clearing search terms.</p>`;
    grid.appendChild(card);
  };

  const setHash = (slug) => {
    const base = window.location.pathname.split('#')[0];
    const query = window.location.search;
    const newUrl = slug ? `${base}${query}#${slug}` : `${base}${query}`;
    history.replaceState(null, '', newUrl);
  };

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleCardActivate = (titan) => {
    openModal(titan);
  };

  const createChip = (inheritor) => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.innerHTML = `
      <img src="${inheritor.image}" alt="" aria-hidden="true" data-fallback-label="${inheritor.name}">
      <span>${inheritor.name}</span>
    `;
    chip.title = inheritor.notes;
    return chip;
  };

  const createCard = (titan) => {
    const card = document.createElement('article');
    card.className = 'card card--titan';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.dataset.slug = titan.slug;
    card.innerHTML = `
      <div class="card__img">
        <img src="${titan.image}" alt="${titan.name} silhouette" data-fallback-label="${titan.name}" loading="lazy">
      </div>
      <div>
        <h3 class="card__title">${titan.name}</h3>
        <p class="card__summary">${titan.summary}</p>
        <div class="chips" aria-label="Inheritors">
          ${titan.inheritors
            .map(
              (inheritor) => `
              <span class="chip">
                <img src="${inheritor.image}" alt="" aria-hidden="true" data-fallback-label="${inheritor.name}">
                <span>${inheritor.name}</span>
              </span>
            `
            )
            .join('')}
        </div>
      </div>
    `;

    card.addEventListener('click', () => handleCardActivate(titan));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleCardActivate(titan);
      }
    });

    return card;
  };

  const renderTitans = (titans) => {
    grid.innerHTML = '';
    if (!titans.length) {
      renderEmptyState();
      return;
    }
    const fragment = document.createDocumentFragment();
    titans.forEach((titan) => {
      fragment.appendChild(createCard(titan));
    });
    grid.appendChild(fragment);
  };

  const applyFilters = () => {
    const term = fieldSearch.value.trim();
    const category = fieldCategory.value;
    const type = fieldType.value;
    const min = fieldHeightMin.value ? Number(fieldHeightMin.value) : null;
    const max = fieldHeightMax.value ? Number(fieldHeightMax.value) : null;
    const spoiler = fieldSpoilers.value;

    filteredTitans = allTitans.filter(
      (titan) =>
        matchesSearch(titan, term) &&
        withinCategory(titan, category) &&
        withinType(titan, type) &&
        withinHeight(titan, min, max) &&
        withinSpoiler(titan, spoiler)
    );

    renderTitans(filteredTitans);

    const currentHash = window.location.hash.replace('#', '');
    if (currentHash) {
      const next = filteredTitans.find((t) => t.slug === currentHash);
      if (!next && modal.getAttribute('aria-hidden') === 'false') {
        closeModal();
      }
    }
  };

  const debouncedFilter = debounce(applyFilters, 140);

  const populateList = (container, items) => {
    container.innerHTML = '';
    if (!items || !items.length) {
      const li = document.createElement('li');
      li.textContent = 'No data available.';
      container.appendChild(li);
      return;
    }
    const fragment = document.createDocumentFragment();
    items.forEach((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      fragment.appendChild(li);
    });
    container.appendChild(fragment);
  };

  const populateChips = (container, inheritors) => {
    container.innerHTML = '';
    inheritors.forEach((inheritor) => {
      container.appendChild(createChip(inheritor));
    });
  };

  const trapFocus = (event) => {
    if (event.key !== 'Tab' || !focusableModalItems.length) return;
    const firstEl = focusableModalItems[0];
    const lastEl = focusableModalItems[focusableModalItems.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === firstEl) {
      event.preventDefault();
      lastEl.focus();
    } else if (!event.shiftKey && active === lastEl) {
      event.preventDefault();
      firstEl.focus();
    }
  };

  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
    }
  };

  const openModal = (titan) => {
    if (!modal) return;
    lastFocused = document.activeElement;
    modalTitle.textContent = titan.name;
    modalImg.src = titan.image;
    modalImg.alt = `${titan.name} silhouette`;
    modalImg.setAttribute('data-fallback-label', titan.name);
    modalType.textContent = titan.type;
    modalCategory.textContent = titan.category;
    modalHeight.textContent = `${titan.heightMeters} m`;
    populateList(modalAbilities, titan.abilities);
    populateList(modalWeaknesses, titan.weaknesses);
    modalFirst.textContent = titan.firstAppearance;
    modalAff.textContent = titan.affiliations.join(', ');
    populateChips(modalShifters, titan.inheritors);

    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    focusableModalItems = Array.from(
      modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');

    if (focusableModalItems.length) {
      focusableModalItems[0].focus();
    }

    modal.addEventListener('keydown', trapFocus);
    document.addEventListener('keydown', handleEscape);

    setHash(titan.slug);

    const card = grid.querySelector(`[data-slug="${titan.slug}"]`);
    if (card && !prefersReducedMotion()) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  var closeModal = () => {
    if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
    modal.setAttribute('aria-hidden', 'true');
    modalImg.removeAttribute('src');
    document.body.style.overflow = '';
    modal.removeEventListener('keydown', trapFocus);
    document.removeEventListener('keydown', handleEscape);
    setHash('');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  };

  closeBtn.addEventListener('click', closeModal);
  closeBtn.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      closeModal();
    }
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  const attachFilterListeners = () => {
    ['input', 'change'].forEach((evt) => {
      fieldSearch.addEventListener(evt, debouncedFilter);
      fieldCategory.addEventListener(evt, debouncedFilter);
      fieldType.addEventListener(evt, debouncedFilter);
      fieldSpoilers.addEventListener(evt, debouncedFilter);
    });
    ['input', 'change'].forEach((evt) => {
      fieldHeightMin.addEventListener(evt, debouncedFilter);
      fieldHeightMax.addEventListener(evt, debouncedFilter);
    });
  };

  const findTitanBySlug = (slug) => allTitans.find((titan) => titan.slug === slug);

  const openByHash = () => {
    const slug = window.location.hash.replace('#', '');
    if (!slug) return;
    const titan = filteredTitans.find((t) => t.slug === slug) || findTitanBySlug(slug);
    if (titan) {
      const card = grid.querySelector(`[data-slug="${titan.slug}"]`);
      if (card) {
        card.focus({ preventScroll: true });
      }
      openModal(titan);
    }
  };

  window.addEventListener('hashchange', () => {
    const slug = window.location.hash.replace('#', '');
    if (!slug) {
      closeModal();
      return;
    }
    const titan = filteredTitans.find((t) => t.slug === slug);
    if (titan) {
      openModal(titan);
    } else {
      setTimeout(openByHash, 0);
    }
  });

  const loadTitans = async () => {
    try {
      const data = await window.fetchJSON('data/titans.json');
      return data;
    } catch (error) {
      console.warn('Falling back to inline titan dataset', error);
      return window.TITANS_FALLBACK();
    }
  };

  const init = async () => {
    if (!grid) return;
    attachFilterListeners();
    allTitans = await loadTitans();
    filteredTitans = [...allTitans];
    renderTitans(filteredTitans);
    applyFilters();
    openByHash();
  };

  document.addEventListener('DOMContentLoaded', init);
})();
