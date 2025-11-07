(() => {
  const storageKey = 'theme';
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');

  const applyTheme = (mode) => {
    root.dataset.theme = mode;
    localStorage.setItem(storageKey, mode);
  };

  const saved = localStorage.getItem(storageKey);
  if (saved) {
    applyTheme(saved);
  } else {
    root.dataset.theme = root.dataset.theme || 'dark';
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      applyTheme(next);
    });
  }

  async function fetchJSON(url) {
    const response = await fetch(url, { cache:'no-store' });
    if (!response.ok) throw new Error('HTTP '+response.status);
    return response.json();
  }

  function fallbackAttackData() {
    return [
      {
        slug: 'eren-yeager',
        name: 'Eren Yeager',
        era: 'Paradise Island Era',
        firstAppearance: 'Season 1',
        abilities: ['Aggressive close-quarters combat', 'Exceptional resolve'],
        weaknesses: ['Stamina management', 'Emotional overextension'],
        image: 'assets/img/eren.svg',
        summary: 'A determined inheritor associated with relentless forward motion.',
        notableEvents: ['Defense of Trost (context)', 'Key confrontations across seasons'],
        heightMeters: 15,
        affiliations: ['Various (avoid spoilers)'],
        spoilerLevel: 'low'
      },
      {
        slug: 'grisha-yeager',
        name: 'Grisha Yeager',
        era: 'Prior Generation',
        firstAppearance: 'Season 1 (backstory)',
        abilities: ['Resolve', 'Passing of power'],
        weaknesses: ['Limited on-screen combat'],
        image: 'assets/img/grisha.svg',
        summary: 'A pivotal predecessor tied to major lineage events.',
        notableEvents: ['Important decisions affecting later eras'],
        heightMeters: 15,
        affiliations: ['Various'],
        spoilerLevel: 'low'
      },
      {
        slug: 'eren-kruger',
        name: 'Eren Kruger',
        era: 'Historical',
        firstAppearance: 'Season 3 (backstory)',
        abilities: ['Espionage', 'Long-term planning'],
        weaknesses: ['Limited direct combat depiction'],
        image: 'assets/img/kruger.svg',
        summary: 'Shadowy figure whose actions shaped the lineage path.',
        notableEvents: ['Critical transfer in history'],
        heightMeters: 15,
        affiliations: ['Historical associations'],
        spoilerLevel: 'low'
      }
    ];
  }

  function selectFeatured(data, slugs) {
    return data.filter(entry => slugs.includes(entry.slug));
  }

  function applyHashScroll(element) {
    if (!element) return;
    element.scrollIntoView({ block:'nearest' });
  }

  window.fetchJSON = fetchJSON;
  window.ATTACK_FALLBACK = fallbackAttackData;
  window.selectFeatured = selectFeatured;
  window.applyHashScroll = applyHashScroll;
})();
