# Prompts used for the build (paste into your DOCX)

Cursor/Windsurf Mega Prompt — “Titans Compendium (ALL Titans + ALL Inheritors) — From Scratch”

You are an AI code editor. Create a brand-new project (no frameworks, no build tools): vanilla HTML/CSS/JS only. Everything must use relative paths and work on GitHub Pages/Netlify and file:// (via inline fallbacks).
Goal: A multipage site showing all Nine Titans and every inheritor for each Titan, with images (abstract silhouettes), search/filters, and an accessible modal.

0) Project structure (create exactly these)
index.html
titans.html
about.html
404.html

css/
  main.css

scripts/
  main.js
  titans.js

data/
  titans.json

assets/
  favicon.ico
  img/
    titans/
      founding.svg
      attack.svg
      colossal.svg
      armored.svg
      female.svg
      beast.svg
      jaw.svg
      cart.svg
      warhammer.svg
    inheritors/
      ymir-fritz.svg
      karl-fritz.svg
      uri-reiss.svg
      frieda-reiss.svg
      grisha-yeager.svg
      eren-yeager.svg
      eren-kruger.svg
      bertholdt-hoover.svg
      armin-arlert.svg
      reiner-braun.svg
      tom-ksaver.svg
      zeke-yeager.svg
      annie-leonhart.svg
      ymir.svg
      marcel-galliard.svg
      porco-galliard.svg
      falco-grice.svg
      pieck-finger.svg
      lara-tybur.svg


All SVGs must be original, abstract silhouettes (no copyrighted art), using currentColor, readable at small sizes. If any image fails, JS must replace it with a generated inline SVG.

1) Visual & accessibility

Fonts: Google Fonts Inter (400,600) for UI and DM Serif Display (700) for headings (fallbacks: system-ui, serif).

Dark theme (default) variables:

--bg:#0f1420; --surface:#121a2b; --text:#e9eefb; --muted:#9fb0d1; --accent:#2c7be5

Mobile-first responsive; test 360/768/1024/1440 widths.

Keyboard: tabbable cards/buttons; visible :focus-visible outline; ESC closes modal; Enter/Space activates cards.

Respect prefers-reduced-motion.

All links must work (no broken links).

2) Data — data/titans.json (REQUIRED, FULL CONTENT)

Create this JSON (spoiler-light but complete inheritor lists for the Nine):

[
  {
    "slug": "founding",
    "name": "Founding Titan",
    "heightMeters": 13,
    "type": "Founding",
    "category": "Nine",
    "image": "assets/img/titans/founding.svg",
    "summary": "Origin Titan linked to the Coordinate; can command Titans and affect Eldians’ memories/bodies.",
    "abilities": [
      "Controls other Titans",
      "Manipulates Eldians’ memories and bodies",
      "Full power only usable with royal blood"
    ],
    "weaknesses": ["Royal-blood requirement to fully access power"],
    "firstAppearance": "Lore (early), revealed later",
    "affiliations": ["Eldia (historical)"],
    "spoilerLevel": "medium",
    "inheritors": [
      { "slug": "ymir-fritz", "name": "Ymir Fritz", "image": "assets/img/inheritors/ymir-fritz.svg", "notes": "Origin point of Titan powers (lore)." },
      { "slug": "karl-fritz", "name": "Karl Fritz", "image": "assets/img/inheritors/karl-fritz.svg", "notes": "Royal line (historical)." },
      { "slug": "uri-reiss", "name": "Uri Reiss", "image": "assets/img/inheritors/uri-reiss.svg", "notes": "Royal inheritor (Reiss)." },
      { "slug": "frieda-reiss", "name": "Frieda Reiss", "image": "assets/img/inheritors/frieda-reiss.svg", "notes": "Last royal holder inside the Walls." },
      { "slug": "grisha-yeager", "name": "Grisha Yeager", "image": "assets/img/inheritors/grisha-yeager.svg", "notes": "Briefly held after taking it from Frieda." },
      { "slug": "eren-yeager", "name": "Eren Yeager", "image": "assets/img/inheritors/eren-yeager.svg", "notes": "Later inheritor; special conditions apply." }
    ]
  },
  {
    "slug": "attack",
    "name": "Attack Titan",
    "heightMeters": 15,
    "type": "Attack",
    "category": "Nine",
    "image": "assets/img/titans/attack.svg",
    "summary": "Balanced fighter defined by relentless drive; connected to future/past memory fragments (lore).",
    "abilities": [
      "Fighting spirit / freedom-leaning nature",
      "Can see memories of future inheritors"
    ],
    "weaknesses": ["Typical stamina/steam limits"],
    "firstAppearance": "Season 1",
    "affiliations": ["Various"],
    "spoilerLevel": "low",
    "inheritors": [
      { "slug": "eren-kruger", "name": "Eren Kruger", "image": "assets/img/inheritors/eren-kruger.svg", "notes": "Historical predecessor." },
      { "slug": "grisha-yeager", "name": "Grisha Yeager", "image": "assets/img/inheritors/grisha-yeager.svg", "notes": "Inherited from Kruger." },
      { "slug": "eren-yeager", "name": "Eren Yeager", "image": "assets/img/inheritors/eren-yeager.svg", "notes": "Inherited from Grisha." }
    ]
  },
  {
    "slug": "colossal",
    "name": "Colossal Titan",
    "heightMeters": 60,
    "type": "Colossal",
    "category": "Nine",
    "image": "assets/img/titans/colossal.svg",
    "summary": "Skyscraper-class Titan with catastrophic steam and explosive transformation.",
    "abilities": ["Releases intense heat", "Explosive transformation"],
    "weaknesses": ["Very slow movement", "Heavy stamina drain"],
    "firstAppearance": "S1E1",
    "affiliations": ["Various"],
    "spoilerLevel": "low",
    "inheritors": [
      { "slug": "bertholdt-hoover", "name": "Bertholdt Hoover", "image": "assets/img/inheritors/bertholdt-hoover.svg", "notes": "Initial wielder in the story era." },
      { "slug": "armin-arlert", "name": "Armin Arlert", "image": "assets/img/inheritors/armin-arlert.svg", "notes": "Later inheritor." }
    ]
  },
  {
    "slug": "armored",
    "name": "Armored Titan",
    "heightMeters": 15,
    "type": "Armored",
    "category": "Nine",
    "image": "assets/img/titans/armored.svg",
    "summary": "Heavily plated; excels at defense and close combat.",
    "abilities": ["Hardened armor plates", "Powerful charges"],
    "weaknesses": ["Joints less protected", "Weight reduces speed"],
    "firstAppearance": "Season 1",
    "affiliations": ["Various"],
    "spoilerLevel": "low",
    "inheritors": [
      { "slug": "reiner-braun", "name": "Reiner Braun", "image": "assets/img/inheritors/reiner-braun.svg", "notes": "Primary wielder in the story era." }
    ]
  },
  {
    "slug": "beast",
    "name": "Beast Titan",
    "heightMeters": 17,
    "type": "Beast",
    "category": "Nine",
    "image": "assets/img/titans/beast.svg",
    "summary": "Ranged dominance; inheritor physiology can vary. Special effects with royal-blood scream (context).",
    "abilities": [
      "Deadly precision throws",
      "Potential to transform Eldians via scream (royal blood context)"
    ],
    "weaknesses": ["Vulnerable in close quarters"],
    "firstAppearance": "Season 2",
    "affiliations": ["Various"],
    "spoilerLevel": "medium",
    "inheritors": [
      { "slug": "tom-ksaver", "name": "Tom Ksaver", "image": "assets/img/inheritors/tom-ksaver.svg", "notes": "Predecessor and mentor." },
      { "slug": "zeke-yeager", "name": "Zeke Yeager", "image": "assets/img/inheritors/zeke-yeager.svg", "notes": "Main wielder in the story era." }
    ]
  },
  {
    "slug": "female",
    "name": "Female Titan",
    "heightMeters": 14,
    "type": "Female",
    "category": "Nine",
    "image": "assets/img/titans/female.svg",
    "summary": "Versatile, balanced, capable of selective hardening and luring Pure Titans.",
    "abilities": ["Selective hardening", "Luring scream (situational)"],
    "weaknesses": ["Susceptible to anti-hardening tactics"],
    "firstAppearance": "Season 1",
    "affiliations": ["Various"],
    "spoilerLevel": "low",
    "inheritors": [
      { "slug": "annie-leonhart", "name": "Annie Leonhart", "image": "assets/img/inheritors/annie-leonhart.svg", "notes": "Known wielder in story era." }
    ]
  },
  {
    "slug": "jaw",
    "name": "Jaw Titan",
    "heightMeters": 5,
    "type": "Jaw",
    "category": "Nine",
    "image": "assets/img/titans/jaw.svg",
    "summary": "Smallest and fastest; devastating claws and bite force.",
    "abilities": ["Extreme bite force", "High agility"],
    "weaknesses": ["Light frame; lower endurance"],
    "firstAppearance": "Season 2",
    "affiliations": ["Various"],
    "spoilerLevel": "medium",
    "inheritors": [
      { "slug": "marcel-galliard", "name": "Marcel Galliard", "image": "assets/img/inheritors/marcel-galliard.svg", "notes": "Earlier known holder." },
      { "slug": "ymir", "name": "Ymir", "image": "assets/img/inheritors/ymir.svg", "notes": "Brief wielder." },
      { "slug": "porco-galliard", "name": "Porco Galliard", "image": "assets/img/inheritors/porco-galliard.svg", "notes": "Later wielder." },
      { "slug": "falco-grice", "name": "Falco Grice", "image": "assets/img/inheritors/falco-grice.svg", "notes": "Subsequent wielder." }
    ]
  },
  {
    "slug": "cart",
    "name": "Cart Titan",
    "heightMeters": 4,
    "type": "Cart",
    "category": "Nine",
    "image": "assets/img/titans/cart.svg",
    "summary": "Quadrupedal endurance; speed and transport; can mount heavy gear.",
    "abilities": ["Endurance", "Payload support", "Quadrupedal speed"],
    "weaknesses": ["Low offense without equipment"],
    "firstAppearance": "Season 3",
    "affiliations": ["Various"],
    "spoilerLevel": "low",
    "inheritors": [
      { "slug": "pieck-finger", "name": "Pieck Finger", "image": "assets/img/inheritors/pieck-finger.svg", "notes": "Known wielder with long transformation endurance." }
    ]
  },
  {
    "slug": "war-hammer",
    "name": "War Hammer Titan",
    "heightMeters": 15,
    "type": "War Hammer",
    "category": "Nine",
    "image": "assets/img/titans/warhammer.svg",
    "summary": "Creates weapons/structures via hardening; can be controlled remotely in special conditions.",
    "abilities": ["Externalized hardening weapons", "Unique remote control (lore)"],
    "weaknesses": ["Exposure of remote control link/cable"],
    "firstAppearance": "Season 4",
    "affiliations": ["Tybur family"],
    "spoilerLevel": "medium",
    "inheritors": [
      { "slug": "lara-tybur", "name": "Lara Tybur", "image": "assets/img/inheritors/lara-tybur.svg", "notes": "Tybur family bearer." },
      { "slug": "eren-yeager", "name": "Eren Yeager", "image": "assets/img/inheritors/eren-yeager.svg", "notes": "Later wielder." }
    ]
  }
]

3) Pages — full content & behavior
index.html

Header/nav brand “Titans Compendium”: Home, Titans, About, Theme toggle.

Hero with title + paragraph; CTAs to titans.html and about.html.

Featured Titans: a grid #featuredTitans with three cards (e.g., Colossal, Armored, Beast) populated at runtime from JSON (fallback if fetch fails). Cards link to titans.html#slug.

Footer with social links (LinkedIn/GitHub/Email).

Unique <title> and <meta name="description">, OG tags, favicon.

Load scripts/main.js (defer). Use a small inline hook if needed by main.js.

titans.html

Header/nav (current page highlighted with aria-current="page").

Controls row:

Search input #q (matches titan name/type/category/summary, and inheritor names).

Category select #category (All / Nine).

Type select #type (Founding, Attack, Colossal, Armored, Female, Beast, Jaw, Cart, War Hammer).

Height min/max number inputs.

Spoilers select #spoilers (none/low/medium) hiding items where spoilerLevel exceeds the choice.

Grid #titanGrid: cards rendered from data/titans.json. Each card shows: image, name, short summary, and inheritor chips (from inheritors[].name).

Click/Enter opens an accessible modal with full details:

Type, Category, Height, Abilities, Weaknesses, First Appearance, Affiliations, Inheritors (as chips with small avatar silhouettes).

Deep link: titans.html#war-hammer opens that titan’s modal on load and scrolls its card into view.

Load scripts/main.js + scripts/titans.js (both defer).

Modal markup must include IDs used by titans.js:
#modal, #modalTitle, #modalImg, #modalType, #modalCategory, #modalHeight, #modalAbilities, #modalWeaknesses, #modalFirst, #modalAff, #modalShifters.

about.html

Explain purpose (fan/educational), how built (vanilla, JSON-driven, fallbacks), a11y notes (keyboard nav, reduced motion).

Disclaimer: Attack on Titan IP belongs to rights holders; silhouettes are original abstract art; non-commercial fan site.

Social links placeholders.

Unique <title>/meta description.

404.html

Simple branded card with message + button to return Home; works using css/main.css.

4) CSS — css/main.css (complete stylesheet)

Implement:

Base/theme:

:root{ --bg:#0f1420; --surface:#121a2b; --text:#e9eefb; --muted:#9fb0d1; --accent:#2c7be5; --radius:16px; --shadow:0 10px 30px rgba(0,0,0,.35) }
body{ margin:0; background:var(--bg); color:var(--text); font:16px/1.6 Inter,system-ui,-apple-system,Segoe UI,Roboto }
h1,h2,h3{ font-family:"DM Serif Display",serif; margin:.25em 0 .4em }
.container{ width:min(1100px,92%); margin-inline:auto }
.site-header,.site-footer{ display:flex; align-items:center; justify-content:space-between; gap:.75rem; padding:1rem 0 }
.brand,.nav a{ color:var(--text); text-decoration:none }
.nav a[aria-current="page"]{ text-decoration:underline }
.btn{ border:1px solid rgba(255,255,255,.15); padding:.5rem .9rem; border-radius:999px; background:transparent; color:var(--text); cursor:pointer }
.btn-primary{ background:var(--accent); border-color:var(--accent); color:#fff }
.input{ background:#0b1322; color:var(--text); border:1px solid rgba(255,255,255,.12); border-radius:10px; padding:.55rem .7rem }
:focus-visible{ outline:3px solid var(--accent); outline-offset:2px }
@media (prefers-reduced-motion:reduce){ *{ transition:none!important; animation:none!important } }


Hero, grids, cards:

.hero{ text-align:center; padding:6rem 0 3rem }
.display{ font-size:clamp(2rem,6vw,3.2rem) }
.tagline{ color:var(--muted) }
.actions{ display:flex; gap:.75rem; justify-content:center; margin-top:1rem }

.grid{ display:grid; gap:1rem; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)) }
.card{ background:var(--surface); border-radius:var(--radius); padding:1rem; box-shadow:var(--shadow); transition:transform .2s ease }
.card:hover{ transform:translateY(-4px) }
.card img{ width:100%; height:160px; object-fit:contain; filter:drop-shadow(0 6px 12px rgba(0,0,0,.35)) }
.muted{ color:var(--muted) }


Controls row:

.controls{ display:grid; gap:.6rem; grid-template-columns:1fr 180px 200px 110px 110px 170px; align-items:center; margin:1rem 0 1.5rem }
@media (max-width:900px){ .controls{ grid-template-columns:1fr 1fr } }


Chips:

.chips{ display:flex; flex-wrap:wrap; gap:.35rem; margin-top:.5rem }
.chip{ padding:.18rem .6rem; border-radius:999px; background:rgba(255,255,255,.08); font-size:.85rem }
.chip img{ width:16px; height:16px; object-fit:cover; border-radius:50%; margin-right:.35rem; vertical-align:middle }


Modal:

.modal{ position:fixed; inset:0; display:grid; place-items:center; background:rgba(0,0,0,.55); z-index:1000 }
.modal[hidden]{ display:none }
.modal__panel{ width:min(900px,92%); background:var(--surface); border-radius:var(--radius); box-shadow:var(--shadow); padding:1rem 1.2rem }
.modal__close{ float:right; background:none; border:none; color:var(--text); font-size:1.8rem; cursor:pointer }
.modal__panel img{ width:100%; height:220px; object-fit:contain; margin:.5rem 0 1rem }
.specs p{ margin:.25rem 0 }

5) JS — scripts/main.js (full content)

Implement:

(() => {
  // Theme toggle
  const apply = m => { document.documentElement.dataset.theme = m; localStorage.setItem('theme', m); };
  const saved = localStorage.getItem('theme') || 'dark'; apply(saved);
  document.addEventListener('DOMContentLoaded', () => {
    const t = document.getElementById('themeToggle');
    if (t) t.addEventListener('click', () => apply(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'));
  });

  // Helpers
  window.fetchJSON = async (url) => {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP '+r.status);
    return r.json();
  };

  // Fallback data (minimal subset) so file:// works
  window.TITANS_FALLBACK = () => ([
    {
      slug:'attack', name:'Attack Titan', heightMeters:15, type:'Attack', category:'Nine',
      image:'assets/img/titans/attack.svg', summary:'Balanced fighter with drive.',
      abilities:['Fighting spirit'], weaknesses:[], firstAppearance:'S1', affiliations:['Various'], spoilerLevel:'low',
      inheritors:[{slug:'eren-kruger',name:'Eren Kruger',image:'assets/img/inheritors/eren-kruger.svg'},
                  {slug:'grisha-yeager',name:'Grisha Yeager',image:'assets/img/inheritors/grisha-yeager.svg'},
                  {slug:'eren-yeager',name:'Eren Yeager',image:'assets/img/inheritors/eren-yeager.svg'}]
    },
    {
      slug:'colossal', name:'Colossal Titan', heightMeters:60, type:'Colossal', category:'Nine',
      image:'assets/img/titans/colossal.svg', summary:'Catastrophic steam and explosive entry.',
      abilities:['Steam','Explosive transform'], weaknesses:['Slow'], firstAppearance:'S1E1', affiliations:['Various'], spoilerLevel:'low',
      inheritors:[{slug:'bertholdt-hoover',name:'Bertholdt Hoover',image:'assets/img/inheritors/bertholdt-hoover.svg'},
                  {slug:'armin-arlert',name:'Armin Arlert',image:'assets/img/inheritors/armin-arlert.svg'}]
    },
    {
      slug:'armored', name:'Armored Titan', heightMeters:15, type:'Armored', category:'Nine',
      image:'assets/img/titans/armored.svg', summary:'Heavily plated for assault/defense.',
      abilities:['Armor plates'], weaknesses:['Joint gaps'], firstAppearance:'S1', affiliations:['Various'], spoilerLevel:'low',
      inheritors:[{slug:'reiner-braun',name:'Reiner Braun',image:'assets/img/inheritors/reiner-braun.svg'}]
    }
  ]);

  // Index: populate featured
  document.addEventListener('DOMContentLoaded', async () => {
    const wrap = document.getElementById('featuredTitans');
    if (!wrap) return;
    let data;
    try { data = await fetchJSON('data/titans.json'); } catch { data = window.TITANS_FALLBACK(); }
    const wanted = ['colossal','armored','beast'];
    const subset = data.filter(t => wanted.includes(t.slug));
    wrap.innerHTML = subset.map(t => `
      <article class="card">
        <img src="${t.image}" alt="${t.name} silhouette" loading="lazy"
             onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,${encodeURIComponent(fallbackSVG(t.name))}'">
        <h3>${t.name}</h3>
        <p class="muted">${t.summary}</p>
        <a class="btn" href="titans.html#${t.slug}">View</a>
      </article>`).join('');
  });

  // Inline fallback SVG generator (used by onerror)
  window.fallbackSVG = (label='Titan') => `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160' role='img' aria-label='${label} silhouette'>
  <rect width='160' height='160' rx='18' fill='currentColor' opacity='.12'/>
  <path d='M80 26c22 0 40 18 40 40v16h10v52H30V82h10V66c0-22 18-40 40-40Z' fill='currentColor'/>
</svg>`.trim();
})();

6) JS — scripts/titans.js (full content)

Implement:

function $(id){ return document.getElementById(id); }
function esc(s){ return (s??'').toString().replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }
function clamp(v,a,b){ return Math.min(b, Math.max(a, v)); }

document.addEventListener('DOMContentLoaded', async () => {
  const grid = $('titanGrid'), empty = $('empty');
  const q = $('q'), category = $('category'), type = $('type');
  const hMin = $('heightMin'), hMax = $('heightMax'), spoilers = $('spoilers');

  const modal = $('modal'), closeBtn = modal.querySelector('.modal__close');

  let data;
  try { data = await fetchJSON('data/titans.json'); }
  catch { data = window.TITANS_FALLBACK(); }

  const bySlug = new Map(data.map(t => [t.slug, t]));
  const rank = { none:0, low:1, medium:2 };

  const renderCards = list => {
    grid.innerHTML = list.map(t => {
      const chips = (t.inheritors||[]).map(h => `
        <span class="chip">
          <img src="${esc(h.image)}" alt="" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,${encodeURIComponent(fallbackSVG(h.name))}'">
          ${esc(h.name)}
        </span>`).join('');
      return `
        <button class="card titan-card" data-slug="${esc(t.slug)}" id="${esc(t.slug)}" aria-describedby="gridLabel">
          <img src="${esc(t.image)}" alt="${esc(t.name)} silhouette" loading="lazy"
               onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,${encodeURIComponent(fallbackSVG(t.name))}'">
          <h3>${esc(t.name)}</h3>
          <p class="muted">${esc(t.summary)}</p>
          <div class="chips">${chips}</div>
        </button>`;
    }).join('');
    empty.hidden = list.length > 0;
  };

  const matches = t => {
    const term = (q.value||'').toLowerCase().trim();
    const cat = category.value, ty = type.value;
    const min = hMin.value === '' ? -Infinity : Number(hMin.value);
    const max = hMax.value === '' ?  Infinity : Number(hMax.value);
    const sp = spoilers.value || 'low';
    if (cat && t.category !== cat) return false;
    if (ty && t.type !== ty) return false;
    if (t.heightMeters < min) return false;
    if (t.heightMeters > max) return false;
    const tRank = rank[t.spoilerLevel||'none'] ?? 0;
    if (tRank > rank[sp]) return false;
    if (!term) return true;
    const blob = [
      t.name, t.type, t.category, t.summary,
      ...(t.abilities||[]), ...(t.weaknesses||[]),
      ...((t.inheritors||[]).map(h => h.name))
    ].join(' ').toLowerCase();
    return blob.includes(term);
  };

  function apply(){ renderCards(data.filter(matches)); }
  apply();
  let to=null; const deb=fn=>{ clearTimeout(to); to=setTimeout(fn,120); };
  [q,category,type,hMin,hMax,spoilers].forEach(el => {
    el.addEventListener('input', ()=>deb(apply));
    el.addEventListener('change', ()=>deb(apply));
  });

  // Modal controls
  let lastFocus=null;
  function openModal(t){
    $('modalTitle').textContent = t.name;
    const img = $('modalImg');
    img.src = t.image; img.alt = `${t.name} silhouette`;
    img.onerror = ()=>{ img.onerror=null; img.src='data:image/svg+xml;utf8,'+encodeURIComponent(fallbackSVG(t.name)); };
    $('modalType').textContent = t.type || '—';
    $('modalCategory').textContent = t.category || '—';
    $('modalHeight').textContent = t.heightMeters ?? '—';
    $('modalAbilities').textContent = (t.abilities||[]).join(', ') || '—';
    $('modalWeaknesses').textContent = (t.weaknesses||[]).join(', ') || '—';
    $('modalFirst').textContent = t.firstAppearance || '—';
    $('modalAff').textContent = (t.affiliations||[]).join(', ') || '—';
    $('modalShifters').innerHTML = (t.inheritors||[]).map(h =>
      `<span class="chip"><img src="${esc(h.image)}" alt="" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,${encodeURIComponent(fallbackSVG(h.name))}'">${esc(h.name)}</span>`
    ).join(' ') || '—';

    lastFocus = document.activeElement;
    modal.hidden = false;
    trapFocus(modal);
  }
  function closeModal(){ modal.hidden = true; releaseFocus(modal); lastFocus?.focus(); }

  grid.addEventListener('click', e => {
    const card = e.target.closest('.titan-card'); if (!card) return;
    const t = bySlug.get(card.dataset.slug); if (!t) return;
    location.hash = t.slug; openModal(t);
  });
  grid.addEventListener('keydown', e => {
    const card = e.target.closest('.titan-card'); if (!card) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault();
      const t = bySlug.get(card.dataset.slug); if (!t) return;
      location.hash = t.slug; openModal(t);
    }
  });
  $('modal').addEventListener('click', e => { if (e.target === $('modal')) closeModal(); });
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  // Deep link
  if (location.hash) {
    const slug = location.hash.slice(1);
    const t = bySlug.get(slug);
    if (t) { openModal(t); document.getElementById(slug)?.scrollIntoView({block:'nearest'}); }
  }
});

// Focus trap helpers
function trapFocus(scope){
  const f = scope.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
  if (!f.length) return; const first=f[0], last=f[f.length-1];
  scope._trap = e => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
  };
  scope.addEventListener('keydown', scope._trap); first.focus();
}
function releaseFocus(scope){ if (scope._trap) scope.removeEventListener('keydown', scope._trap); }

7) HTML files — full content skeletons
index.html

Build with brand/nav, hero, Featured Titans container #featuredTitans, footer, OG meta, fonts, favicon.

Include <script src="scripts/main.js" defer></script>.

titans.html

Brand/nav (mark Titans link with aria-current="page").

Controls row with #q, #category, #type, #heightMin, #heightMax, #spoilers.

Section:

<h1 id="gridLabel">Titans</h1>
<div id="titanGrid" class="grid"></div>
<p id="empty" hidden>No results. Try different filters.</p>


Modal markup:

<div id="modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" hidden>
  <div class="modal__panel" role="document">
    <button class="modal__close" aria-label="Close">&times;</button>
    <h2 id="modalTitle"></h2>
    <img id="modalImg" alt="" loading="lazy">
    <div class="specs">
      <p><strong>Type:</strong> <span id="modalType"></span></p>
      <p><strong>Category:</strong> <span id="modalCategory"></span></p>
      <p><strong>Height:</strong> <span id="modalHeight"></span> m</p>
      <p><strong>Abilities:</strong> <span id="modalAbilities"></span></p>
      <p><strong>Weaknesses:</strong> <span id="modalWeaknesses"></span></p>
      <p><strong>First appearance:</strong> <span id="modalFirst"></span></p>
      <p><strong>Affiliations:</strong> <span id="modalAff"></span></p>
      <p><strong>Inheritors:</strong> <span id="modalShifters"></span></p>
    </div>
  </div>
</div>


Include CSS + scripts:

<link rel="stylesheet" href="css/main.css">
<script src="scripts/main.js" defer></script>
<script src="scripts/titans.js" defer></script>

about.html

Brand/nav, a paragraph describing the project, a11y notes, disclaimer, social links.

Include CSS + scripts/main.js.

404.html

Minimal branded card with back-to-Home button using CSS.

8) SVGs — generate original silhouettes

For every file listed in assets/img/, generate a simple consistent abstract silhouette.
Template to vary (change inner <path> so each is distinct):

9) README.md

Explain:

What the site is, pages included, and that all Nine Titans + all inheritors are present.

How to run locally (double-click index.html or use a static server).

How to deploy (GitHub Pages/Netlify).

How to add Titans or inheritors (edit data/titans.json and add matching SVGs).

Accessibility features and IP disclaimer.

10) LICENSE

MIT for code. Extra paragraph: Attack on Titan and related IP belong to their owners; silhouettes here are original abstract art; usage is non-commercial/fan/educational.

11) report/Prompts_Used.md

Paste this entire mega prompt verbatim, prefixed with # Prompts used for the build (paste into your DOCX), plus a short checklist: pages exist, links okay, responsive ok, modal/keyboard ok, fallbacks ok.

12) Finish by printing this short summary

At the end of your output, print:

What was created: pages, datasets, scripts, SVGs.

How to add/edit: open data/titans.json, append a Titan object or add to its inheritors array; place SVG in the right folder; filenames must match JSON.

Deep links: visit titans.html#attack or titans.html#war-hammer to open their modal instantly.

Quick test checklist:

Open titans.html → cards show inheritor chips.

Search “Pieck / Armin / Ymir / Reiss / Kruger” → correct Titan appears.

Click a card → modal shows full details + inheritor chips; ESC closes.

Try titans.html#colossal.

Disable network → site still renders (fallback).

Toggle theme.

Generate all files now with complete, working code and placeholder SVGs, with no console errors or broken links.

Checklist:
- Pages exist
- Links okay
- Responsive ok
- Modal/keyboard ok
- Fallbacks ok
