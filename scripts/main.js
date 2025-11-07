(() => {
  // Theme toggle
  const apply = (mode) => {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem('theme', mode);
  };
  const saved = localStorage.getItem('theme') || 'dark';
  apply(saved);
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        apply(next);
      });
    }
  });

  // Helpers
  window.fetchJSON = async (url) => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return response.json();
  };

  // Fallback data (minimal subset) so file:// works
  window.TITANS_FALLBACK = () => ([
    {
      slug: 'attack',
      name: 'Attack Titan',
      heightMeters: 15,
      type: 'Attack',
      category: 'Nine',
      image: 'assets/img/titans/attack.svg',
      summary: 'Balanced fighter with drive.',
      abilities: ['Fighting spirit'],
      weaknesses: [],
      firstAppearance: 'S1',
      affiliations: ['Various'],
      spoilerLevel: 'low',
      inheritors: [
        { slug: 'eren-kruger', name: 'Eren Kruger', image: 'assets/img/inheritors/eren-kruger.svg' },
        { slug: 'grisha-yeager', name: 'Grisha Yeager', image: 'assets/img/inheritors/grisha-yeager.svg' },
        { slug: 'eren-yeager', name: 'Eren Yeager', image: 'assets/img/inheritors/eren-yeager.svg' }
      ]
    },
    {
      slug: 'colossal',
      name: 'Colossal Titan',
      heightMeters: 60,
      type: 'Colossal',
      category: 'Nine',
      image: 'assets/img/titans/colossal.svg',
      summary: 'Catastrophic steam and explosive entry.',
      abilities: ['Steam', 'Explosive transform'],
      weaknesses: ['Slow'],
      firstAppearance: 'S1E1',
      affiliations: ['Various'],
      spoilerLevel: 'low',
      inheritors: [
        { slug: 'bertholdt-hoover', name: 'Bertholdt Hoover', image: 'assets/img/inheritors/bertholdt-hoover.svg' },
        { slug: 'armin-arlert', name: 'Armin Arlert', image: 'assets/img/inheritors/armin-arlert.svg' }
      ]
    },
    {
      slug: 'beast',
      name: 'Beast Titan',
      heightMeters: 17,
      type: 'Beast',
      category: 'Nine',
      image: 'assets/img/titans/beast.svg',
      summary: 'Ranged dominance with precision throws.',
      abilities: ['Throws', 'Royal scream potential'],
      weaknesses: ['Close range vulnerability'],
      firstAppearance: 'S2',
      affiliations: ['Various'],
      spoilerLevel: 'medium',
      inheritors: [
        { slug: 'tom-ksaver', name: 'Tom Ksaver', image: 'assets/img/inheritors/tom-ksaver.svg' },
        { slug: 'zeke-yeager', name: 'Zeke Yeager', image: 'assets/img/inheritors/zeke-yeager.svg' }
      ]
    },
    {
      slug: 'armored',
      name: 'Armored Titan',
      heightMeters: 15,
      type: 'Armored',
      category: 'Nine',
      image: 'assets/img/titans/armored.svg',
      summary: 'Heavily plated for assault/defense.',
      abilities: ['Armor plates'],
      weaknesses: ['Joint gaps'],
      firstAppearance: 'S1',
      affiliations: ['Various'],
      spoilerLevel: 'low',
      inheritors: [
        { slug: 'reiner-braun', name: 'Reiner Braun', image: 'assets/img/inheritors/reiner-braun.svg' }
      ]
    }
  ]);

  // Index: populate featured
  document.addEventListener('DOMContentLoaded', async () => {
    const wrap = document.getElementById('featuredTitans');
    if (!wrap) return;
    let data;
    try {
      data = await fetchJSON('data/titans.json');
    } catch (err) {
      data = window.TITANS_FALLBACK();
    }
    const wanted = ['colossal', 'armored', 'beast'];
    let items = wanted
      .map((slug) => data.find((t) => t.slug === slug))
      .filter(Boolean);
    if (!items.length) {
      items = window.TITANS_FALLBACK();
    }
    wrap.innerHTML = items
      .map(
        (t) => `
      <article class="card">
        <img src="${t.image}" alt="${t.name} silhouette" loading="lazy"
             onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,${encodeURIComponent(fallbackSVG(t.name))}'">
        <h3>${t.name}</h3>
        <p class="muted">${t.summary}</p>
        <a class="btn" href="titans.html#${t.slug}">View</a>
      </article>`
      )
      .join('');
  });

  // Inline fallback SVG generator (used by onerror)
  window.fallbackSVG = (label = 'Titan') => `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160' role='img' aria-label='${label} silhouette'>
  <rect width='160' height='160' rx='18' fill='currentColor' opacity='.12'/>
  <path d='M80 26c22 0 40 18 40 40v16h10v52H30V82h10V66c0-22 18-40 40-40Z' fill='currentColor'/>
</svg>`.trim();
})();
