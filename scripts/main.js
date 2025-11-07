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

  function TITANS_FALLBACK() {
    return [
      {
        slug: 'founding',
        name: 'Founding Titan',
        heightMeters: 13,
        type: 'Founding',
        category: 'Nine',
        shifters: ['(varies; royal line context)'],
        abilities: ['Coordinate', 'Influence Subjects of Ymir (conditional)'],
        weaknesses: ['Royal-blood conditions'],
        firstAppearance: 'S1 (lore), later revealed',
        affiliations: ['Eldia (historical)'],
        image: 'assets/img/founding.svg',
        summary: 'Origin titan tied to the Coordinate; central to the lore.',
        funFact: 'Certain conditions can amplify its reach.',
        spoilerLevel: 'low'
      },
      {
        slug: 'attack',
        name: 'Attack Titan',
        heightMeters: 15,
        type: 'Attack',
        category: 'Nine',
        shifters: ['(various across eras)'],
        abilities: ['Agile combat', 'Future memory fragments (lore)'],
        weaknesses: ['Standard stamina limits'],
        firstAppearance: 'S1',
        affiliations: ['Various'],
        image: 'assets/img/attack.svg',
        summary: 'Balanced fighter known for relentless drive.',
        funFact: 'Associated with moving forward.',
        spoilerLevel: 'low'
      },
      {
        slug: 'colossal',
        name: 'Colossal Titan',
        heightMeters: 60,
        type: 'Colossal',
        category: 'Nine',
        shifters: ['Bertholdt', 'Armin'],
        abilities: ['Steam emission', 'Explosive transformation'],
        weaknesses: ['Very slow', 'High stamina drain'],
        firstAppearance: 'S1E1',
        affiliations: ['Various'],
        image: 'assets/img/colossal.svg',
        summary: 'Skyscraper-class titan with catastrophic steam output.',
        funFact: 'Transformation can be explosive.',
        spoilerLevel: 'low'
      },
      {
        slug: 'armored',
        name: 'Armored Titan',
        heightMeters: 15,
        type: 'Armored',
        category: 'Nine',
        shifters: ['Reiner'],
        abilities: ['Hardened plates', 'Powerful charges'],
        weaknesses: ['Exposed joints', 'Weight reduces speed'],
        firstAppearance: 'S1',
        affiliations: ['Various'],
        image: 'assets/img/armored.svg',
        summary: 'Heavily plated titan for assault/defense.',
        funFact: 'Armor can be selectively shed.',
        spoilerLevel: 'low'
      },
      {
        slug: 'beast',
        name: 'Beast Titan',
        heightMeters: 17,
        type: 'Beast',
        category: 'Nine',
        shifters: ['Zeke'],
        abilities: ['Devastating throws', 'Command presence (situational)'],
        weaknesses: ['CQC vulnerability'],
        firstAppearance: 'S2',
        affiliations: ['Various'],
        image: 'assets/img/beast.svg',
        summary: 'Ranged dominance and battlefield control.',
        funFact: 'Physiology varies by inheritor.',
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
  window.TITANS_FALLBACK = TITANS_FALLBACK;
  window.selectFeatured = selectFeatured;
  window.applyHashScroll = applyHashScroll;

  document.addEventListener('DOMContentLoaded', async () => {
    const featuredInheritors = document.getElementById('featured');
    if (featuredInheritors) {
      const status = featuredInheritors.querySelector('[data-status]');
      let dataset;
      try {
        dataset = await fetchJSON('data/attack_titans.json');
      } catch {
        dataset = window.ATTACK_FALLBACK();
      }
      const picks = selectFeatured(dataset, ['eren-yeager', 'grisha-yeager', 'eren-kruger']);
      if (status) status.remove();
      featuredInheritors.innerHTML = picks.map(item => `
        <article class="card">
          <img src="${item.image}" alt="${item.name} silhouette" loading="lazy">
          <h3>${item.name}</h3>
          <p class="muted">${item.summary}</p>
          <a class="btn btn-primary" href="inheritors.html#${item.slug}">View</a>
        </article>
      `).join('') || '<p class="muted">No featured inheritors available.</p>';
    }

    const featuredTitans = document.getElementById('featuredTitans');
    if (featuredTitans) {
      const status = featuredTitans.querySelector('[data-status]');
      let dataset;
      try {
        dataset = await fetchJSON('data/titans.json');
      } catch {
        dataset = window.TITANS_FALLBACK();
      }
      const picks = selectFeatured(dataset, ['colossal', 'armored', 'beast']);
      if (status) status.remove();
      featuredTitans.innerHTML = picks.map(item => `
        <article class="card">
          <img src="${item.image}" alt="${item.name} silhouette" loading="lazy">
          <h3>${item.name}</h3>
          <p class="muted">${item.summary}</p>
          <a class="btn btn-primary" href="titans.html#${item.slug}">View</a>
        </article>
      `).join('') || '<p class="muted">No featured titans available.</p>';
    }
  });
})();
