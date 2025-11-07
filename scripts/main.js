(() => {
  const THEME_KEY = 'tc-theme';

  const prefersDark = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const storeTheme = (theme) => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
      console.warn('Unable to persist theme preference', err);
    }
  };

  const readTheme = () => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (err) {
      return null;
    }
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    const finalTheme = theme || (prefersDark() ? 'dark' : 'light');
    root.setAttribute('data-theme', finalTheme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', finalTheme === 'dark' ? 'true' : 'false');
      toggle.dataset.theme = finalTheme;
    }
  };

  const setupThemeToggle = () => {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      storeTheme(next);
    });
    toggle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle.click();
      }
    });
  };

  window.fetchJSON = async (url) => {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }
    return res.json();
  };

  const svgTemplate = (label) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="28" fill="currentColor" opacity="0.08" />
      <path fill="currentColor" d="M60 18c14 0 28 11 28 30 0 15-10 27-21 27-4 0-7-2-7-5 0-4 5-8 5-13 0-5-3-9-8-9s-8 4-8 9c0 5 5 9 5 13 0 3-3 5-7 5-11 0-21-12-21-27 0-19 14-30 28-30z" opacity="0.85"/>
      <path fill="currentColor" d="M42 78h36l18 24H24z" opacity="0.6"/>
      <text x="60" y="64" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" fill="currentColor" opacity="0.75">${label.slice(0, 3).toUpperCase()}</text>
    </svg>
  `;

  const svgToDataUrl = (svg) => {
    const minified = svg.replace(/\s{2,}/g, ' ').trim();
    return `data:image/svg+xml;base64,${btoa(minified)}`;
  };

  window.fallbackSVG = (label = 'TC') => svgToDataUrl(svgTemplate(label));

  const handleImageFallback = (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;
    img.removeEventListener('error', handleImageFallback);
    const label = img.getAttribute('data-fallback-label') || 'TC';
    img.setAttribute('src', window.fallbackSVG(label));
  };

  document.addEventListener('error', handleImageFallback, true);

  window.TITANS_FALLBACK = () => [
    {
      slug: 'attack',
      name: 'Attack Titan',
      heightMeters: 15,
      type: 'Attack',
      category: 'Nine',
      image: 'assets/img/titans/attack.svg',
      summary: 'Balanced fighter defined by relentless drive; connected to future/past memory fragments (lore).',
      abilities: [
        'Fighting spirit / freedom-leaning nature',
        'Can see memories of future inheritors'
      ],
      weaknesses: ['Typical stamina/steam limits'],
      firstAppearance: 'Season 1',
      affiliations: ['Various'],
      spoilerLevel: 'low',
      inheritors: [
        {
          slug: 'eren-kruger',
          name: 'Eren Kruger',
          image: 'assets/img/inheritors/eren-kruger.svg',
          notes: 'Historical predecessor.'
        },
        {
          slug: 'grisha-yeager',
          name: 'Grisha Yeager',
          image: 'assets/img/inheritors/grisha-yeager.svg',
          notes: 'Inherited from Kruger.'
        },
        {
          slug: 'eren-yeager',
          name: 'Eren Yeager',
          image: 'assets/img/inheritors/eren-yeager.svg',
          notes: 'Inherited from Grisha.'
        }
      ]
    },
    {
      slug: 'colossal',
      name: 'Colossal Titan',
      heightMeters: 60,
      type: 'Colossal',
      category: 'Nine',
      image: 'assets/img/titans/colossal.svg',
      summary: 'Skyscraper-class Titan with catastrophic steam and explosive transformation.',
      abilities: ['Releases intense heat', 'Explosive transformation'],
      weaknesses: ['Very slow movement', 'Heavy stamina drain'],
      firstAppearance: 'S1E1',
      affiliations: ['Various'],
      spoilerLevel: 'low',
      inheritors: [
        {
          slug: 'bertholdt-hoover',
          name: 'Bertholdt Hoover',
          image: 'assets/img/inheritors/bertholdt-hoover.svg',
          notes: 'Initial wielder in the story era.'
        },
        {
          slug: 'armin-arlert',
          name: 'Armin Arlert',
          image: 'assets/img/inheritors/armin-arlert.svg',
          notes: 'Later inheritor.'
        }
      ]
    },
    {
      slug: 'armored',
      name: 'Armored Titan',
      heightMeters: 15,
      type: 'Armored',
      category: 'Nine',
      image: 'assets/img/titans/armored.svg',
      summary: 'Heavily plated; excels at defense and close combat.',
      abilities: ['Hardened armor plates', 'Powerful charges'],
      weaknesses: ['Joints less protected', 'Weight reduces speed'],
      firstAppearance: 'Season 1',
      affiliations: ['Various'],
      spoilerLevel: 'low',
      inheritors: [
        {
          slug: 'reiner-braun',
          name: 'Reiner Braun',
          image: 'assets/img/inheritors/reiner-braun.svg',
          notes: 'Primary wielder in the story era.'
        }
      ]
    }
  ];

  const sampleFeaturedSlugs = ['colossal', 'armored', 'beast'];

  const renderFeaturedCards = (titans) => {
    const target = document.getElementById('featuredTitans');
    if (!target) return;
    target.innerHTML = '';
    sampleFeaturedSlugs.forEach((slug) => {
      const titan = titans.find((item) => item.slug === slug) || titans[Math.floor(Math.random() * titans.length)];
      if (!titan) return;
      const card = document.createElement('article');
      card.className = 'card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'listitem');
      card.innerHTML = `
        <div class="card__img">
          <img src="${titan.image}" alt="${titan.name} silhouette" data-fallback-label="${titan.name}" loading="lazy">
        </div>
        <h3 class="card__title">${titan.name}</h3>
        <p class="card__summary">${titan.summary}</p>
        <a class="btn card__link" href="titans.html#${titan.slug}">View details</a>
      `;
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          window.location.href = `titans.html#${titan.slug}`;
        }
      });
      target.appendChild(card);
    });
  };

  const initFeaturedSection = async () => {
    try {
      const data = await window.fetchJSON('data/titans.json');
      renderFeaturedCards(data);
    } catch (error) {
      console.warn('Using fallback titan data', error);
      renderFeaturedCards(window.TITANS_FALLBACK());
    }
  };

  const init = () => {
    applyTheme(readTheme());
    setupThemeToggle();
    const page = document.body.dataset.page;
    if (page === 'home') {
      initFeaturedSection();
    }
  };

  document.addEventListener('DOMContentLoaded', init);
})();
