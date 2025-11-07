Prompts used for the build (paste into your DOCX)

You are an AI code editor. Create or REPLACE the following project as specified. No frameworks or build tools; vanilla HTML/CSS/JS only. All links must be relative and work on GitHub Pages/Netlify. Use only original, abstract SVG silhouettes (no copyrighted images).

0) Project structure

Create exactly:

index.html

inheritors.html

about.html

404.html

css/main.css

scripts/main.js

scripts/inheritors.js

data/attack_titans.json

assets/favicon.ico (create a minimal ICO placeholder)

assets/img/

eren.svg, grisha.svg, kruger.svg, historical-1.svg, historical-2.svg, historical-3.svg

README.md

LICENSE (MIT)

report/Prompts_Used.md (auto-fill with THIS prompt content verbatim so the student can paste into their DOCX)

1) Global design & accessibility

Google Fonts: Inter (400,600) for UI; DM Serif Display (700) for headings (fallbacks: system-ui, serif).

Theme vars:
--bg:#0f1420; --surface:#121a2b; --text:#e9eefb; --muted:#9fb0d1; --accent:#2c7be5

Mobile-first responsive; test 360/768/1024/1440.

Visible outline using var(--accent).

Respect prefers-reduced-motion.

All images have meaningful alt text.

2) index.html (landing) — FULL CONTENT

Requirements:

Header with brand “Attack Titan Lineage” and nav: Home, Inheritors, About, Theme toggle button.

Hero with title, one-paragraph description, CTAs to inheritors.html and about.html.

“Featured” grid: 3 cards (Eren, Grisha, Kruger) pulled at runtime from data/attack_titans.json (fallback to inline data if fetch fails).

Footer with social links (LinkedIn, GitHub, Email).

Unique and meta description; OG tags; link favicon.

Load scripts/main.js (defer). Use a small inline script to populate featured cards from the same global fallback function.

3) inheritors.html (interactive page) — FULL CONTENT

Layout:

Header/nav identical to index (current page highlighted).

Controls row: search input (label can be sr-only).

Two-column area:






Clicking a name (or Enter/Space) populates the detail panel with: image, name, era, firstAppearance, summary, abilities, weaknesses, notableEvents, heightMeters, affiliations.

Also open a modal dialog with the same content (accessible: role="dialog", aria-modal, labeled title, ESC closes, backdrop click closes, tab trap).

Deep linking: if URL hash is present (e.g., inheritors.html#eren-yeager), auto-select and render that entry on load; update hash on selection.

Scripts: include scripts/main.js and scripts/inheritors.js (both defer).

Unique and meta description; favicon.

4) about.html — FULL CONTENT

Explain it’s a small, spoiler-light fan site about Attack Titan inheritors.

How it’s built (vanilla HTML/CSS/JS, JSON + fallback).

Accessibility notes (keyboard navigation, focus styles, reduced motion).

Disclaimer: AoT IP belongs to respective rights holders; silhouettes are original abstract art.

Your social links placeholders.

Unique and meta description.

5) 404.html — FULL CONTENT

Simple branded card with “Not found”, a short sentence, and a button back to Home.

Minimal CSS from css/main.css; keep it working standalone.

6) css/main.css — FULL CONTENT

Implement:

Base styles with variables listed above.

.container max width layout.

Header/footer layout; nav link active state via [aria-current="page"].

Buttons (.btn, .btn-primary); inputs (.input).

Grid utilities for cards; card hover elevate (respect reduced motion).

Two-column layout on inheritors.html (sidebar min 260px); stack at < 860px.

Tooltip styles not needed (we use click + modal).

Modal styles: backdrop, centered panel, close button.

.sr-only utility; .muted text.

Strong focus ring via .

7) scripts/main.js — FULL CONTENT

Provide:

Theme toggle (html[data-theme="dark"|"light"]) with localStorage persistence; default dark.

fetchJSON(url): returns parsed JSON or throws.

fallbackAttackData(): returns an array with Eren/Grisha/Kruger minimal objects; used when fetch fails (e.g., file://).

selectFeatured(ids): helper to map slugs → objects.

applyHashScroll(el): ensures selected list item scrolled into view.

Expose window.ATTACK_FALLBACK = fallbackAttackData for reuse.

On index.html only: populate #featured with three cards linking to inheritors.html#slug. Use progressive enhancement.

8) scripts/inheritors.js — FULL CONTENT

Behavior:

Try const data = await fetchJSON('data/attack_titans.json'); on error use window.ATTACK_FALLBACK().

Build items for each entry (data-slug). Buttons are keyboard-activatable.

Search (#q) filters the visible list (case-insensitive match on name, era, summary, abilities).

selectBySlug(slug): renders detail panel + opens modal (on mobile the modal is helpful).

Render detail: image (from item.image), heading, dl or paragraphs for fields listed in #3.

Update location.hash = slug on selection; on load, if hash present and known, preselect; else select first entry.

Modal: trap focus in dialog; ESC/backdrop closes; restore focus to last button.

Prevent broken images; if image missing, show a simple silhouette fallback SVG (generate on the fly).

Add small help text for keyboard users (sr-only).

9) data/attack_titans.json — FULL CONTENT (spoiler-light)

[
{
"slug": "eren-yeager",
"name": "Eren Yeager",
"era": "Paradise Island Era",
"firstAppearance": "Season 1",
"abilities": ["Aggressive close-quarters combat", "Exceptional resolve"],
"weaknesses": ["Stamina management", "Emotional overextension"],
"image": "assets/img/eren.svg",
"summary": "A determined inheritor associated with relentless forward motion.",
"notableEvents": ["Defense of Trost (context)", "Key confrontations across seasons"],
"heightMeters": 15,
"affiliations": ["Various (avoid spoilers)"],
"spoilerLevel": "low"
},
{
"slug": "grisha-yeager",
"name": "Grisha Yeager",
"era": "Prior Generation",
"firstAppearance": "Season 1 (backstory)",
"abilities": ["Resolve", "Passing of power"],
"weaknesses": ["Limited on-screen combat"],
"image": "assets/img/grisha.svg",
"summary": "A pivotal predecessor tied to major lineage events.",
"notableEvents": ["Important decisions affecting later eras"],
"heightMeters": 15,
"affiliations": ["Various"],
"spoilerLevel": "low"
},
{
"slug": "eren-kruger",
"name": "Eren Kruger",
"era": "Historical",
"firstAppearance": "Season 3 (backstory)",
"abilities": ["Espionage", "Long-term planning"],
"weaknesses": ["Limited direct combat depiction"],
"image": "assets/img/kruger.svg",
"summary": "Shadowy figure whose actions shaped the lineage path.",
"notableEvents": ["Critical transfer in history"],
"heightMeters": 15,
"affiliations": ["Historical associations"],
"spoilerLevel": "low"
},
{
"slug": "historical-inheritor-1",
"name": "Historical Inheritor I",
"era": "Pre-Modern",
"firstAppearance": "Historical (lore)",
"abilities": ["Battlefield tenacity"],
"weaknesses": ["Era-limited tactics"],
"image": "assets/img/historical-1.svg",
"summary": "A lesser-documented bearer recognized in archives.",
"notableEvents": ["Regional conflict accounts"],
"heightMeters": 15,
"affiliations": ["Eldian lineage (historical)"],
"spoilerLevel": "none"
},
{
"slug": "historical-inheritor-2",
"name": "Historical Inheritor II",
"era": "Pre-Modern",
"firstAppearance": "Historical (lore)",
"abilities": ["Adaptability"],
"weaknesses": ["Fragmentary records"],
"image": "assets/img/historical-2.svg",
"summary": "Referenced in fragmented materials from earlier eras.",
"notableEvents": ["Border skirmishes (records)"],
"heightMeters": 15,
"affiliations": ["Eldian lineage (historical)"],
"spoilerLevel": "none"
},
{
"slug": "historical-inheritor-3",
"name": "Historical Inheritor III",
"era": "Pre-Modern",
"firstAppearance": "Historical (lore)",
"abilities": ["Operational cunning"],
"weaknesses": ["Sparse documentation"],
"image": "assets/img/historical-3.svg",
"summary": "An obscure but acknowledged member of the lineage.",
"notableEvents": ["Unverified engagements in chronicles"],
"heightMeters": 15,
"affiliations": ["Eldian lineage (historical)"],
"spoilerLevel": "none"
}
]

10) SVGs in assets/img/*.svg — FULL CONTENT

For each file, generate an original, abstract silhouette with currentColor and consistent style. Keep it simple and readable in small sizes. Example pattern (adjust shapes for each titan so they differ):

Example (eren.svg template — vary shapes per file):





For grisha.svg/kruger.svg/historical-*.svg, keep the rounded-rect background but change the inner path to distinct simple shapes (combinations of arcs/lines) to avoid duplication.

11) scripts/main.js — IMPLEMENTATION DETAILS

Implement theme toggle:

const btn = document.getElementById('themeToggle'); toggle html.dataset.theme between 'dark' and 'light'; store in localStorage('theme').

Default to 'dark' if nothing set.

Implement:
async function fetchJSON(url){ const r = await fetch(url, {cache:'no-store'}); if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); }
function fallbackAttackData(){ return [ /* minimal Eren, Grisha, Kruger objects mirroring the JSON schema above */ ]; }
function selectFeatured(data, slugs){ return data.filter(x => slugs.includes(x.slug)); }
function applyHashScroll(el){ el?.scrollIntoView({block:'nearest'}); }
window.ATTACK_FALLBACK = fallbackAttackData;

On index.html only:

DOMContentLoaded: let data; try data = await fetchJSON('data/attack_titans.json'); catch { data = fallbackAttackData(); }

const picks = selectFeatured(data, ['eren-yeager','grisha-yeager','eren-kruger']);

Render #featured with cards linking to inheritors.html#slug (img, h3, summary, “View” button).

12) scripts/inheritors.js — IMPLEMENTATION DETAILS

DOMContentLoaded:

let data; try fetchJSON('data/attack_titans.json'); else ATTACK_FALLBACK().

Build for each entry in #inheritorList; set data-slug and aria-controls="detail".

Search (#q): filter list by (name + era + summary + abilities). Debounce 120ms.

On button click or keydown (Enter/Space): selectBySlug(slug).

selectBySlug(slug):

Find item; if missing, return.

Update location.hash = slug.

Render #detail:

Image at top (alt: “[Name] silhouette”), then h2, then a description list or paragraphs for: era, firstAppearance, summary, abilities (comma-joined), weaknesses, notableEvents, heightMeters, affiliations.

Open modal with duplicate content for easy reading on mobile:





Close on ESC/backdrop/close button.

Trap focus inside while open; restore focus to the last clicked name on close.

On load: if location.hash matches an item, preselect it; else select the first item. After building list, call applyHashScroll on the active button.

Robustness:

If an image fails to load, replace src with a generated inline SVG (data URL) showing a generic silhouette.

Guard all DOM reads; no uncaught errors in console.

13) css/main.css — IMPLEMENTATION DETAILS

Include:

.container with width(1100px,92%); centered.

.site-header/.site-footer: flex layout; brand & nav; active link via [aria-current].

.btn/.btn-primary and .input styles.

.grid utilities and .card with hover lift (reduced motion respects).

.list (sidebar) styles: sticky at top on wide screens; list buttons full width, left-aligned, with prominent focus state.

.detail card: image on top (object-fit: contain), content spacing.

.modal & .modal__panel with backdrop; .modal__close (“×”) top-right.

.sr-only class for visually hidden labels.

Media query @media (max-width: 860px) to stack columns.

14) README.md — CONTENT

Explain:

Project overview and purpose.

How to run locally (just open index.html or use a static server for fetch).

How to deploy to GitHub Pages/Netlify (relative paths already set).

How to add/edit entries: edit data/attack_titans.json and add matching SVGs to assets/img/.

Accessibility features.

License note + IP disclaimer.

15) LICENSE — CONTENT

MIT license for the code. Add a paragraph noting that Attack on Titan and related names are property of their respective owners; silhouettes here are original abstract art for non-commercial fan use.

16) report/Prompts_Used.md — CONTENT

Paste this entire mega prompt verbatim, prefixed by a heading “Prompts used for the build (paste into your DOCX)”.

Also append a short checklist the student can copy: pages done, no broken links, responsive verified, dataset present, modal/keyboard ok.

17) Finishing step

After generating all files, output at the end of your response:

A short summary (what was created, how to add/edit inheritors, how the deep link #slug works).

A quick test checklist (open inheritors.html, click names, try hash link, try search).

Confirm that report/Prompts_Used.md was created with this prompt content.

Now generate every file with complete, working code and placeholder SVGs. Ensure the site still renders if data/attack_titans.json can’t be fetched by using the fallback dataset in scripts/main.js.~~~

Checklist the student can copy:
- Pages generated and content matches spec
- Internal links tested (no broken links)
- Responsive layout verified at 360/768/1024/1440
- Dataset file present with matching SVG assets
- Modal interactions and keyboard navigation confirmed

---

Cursor/Windsurf Mega Prompt — Upgrade to “Titans Compendium” (adds all Titan kinds)

You are an AI code editor. Extend the existing “Attack Titan Lineage” project into a broader “Titans Compendium” while keeping all current files working. Use vanilla HTML/CSS/JS only; no frameworks/build tools. All links must be relative. If a fetch fails (e.g., running under file://), the UI must still render via inline fallbacks.

0) Add/Update Project Structure

Create or replace the following (do not delete existing attack-only files):

index.html                (update: add Titans section)
inheritors.html           (keep working)
about.html                (update: mention full compendium)
titans.html               (NEW — interactive grid of Titans)
404.html                  (keep working)

css/
  main.css                (update: minor styles used by titans.html)

scripts/
  main.js                 (update: add TITANS_FALLBACK + shared helpers)
  inheritors.js           (keep working)
  titans.js               (NEW — page logic for titans.html)

data/
  attack_titans.json      (keep)
  titans.json             (NEW — Nine Titans + a few notable variants)

assets/
  favicon.ico             (keep)
  img/
    founding.svg attack.svg colossal.svg armored.svg female.svg
    beast.svg jaw.svg cart.svg warhammer.svg
    smiling.svg rodreiss.svg pure-small.svg pure-standard.svg pure-tall.svg


All SVGs must be original abstract silhouettes using currentColor (no copyrighted images). Keep them readable at small sizes.

1) titans.html — FULL CONTENT (NEW)

Header/nav identical to other pages; “Titans” link has aria-current="page".

Controls row:

Search input (#q) — matches name/type/category/summary/abilities.

Category select (#category): “All / Nine / Variant / Notable Pure/Abnormal”.

Type select (#type): Founding, Attack, Colossal, Armored, Female, Beast, Jaw, Cart, War Hammer, Pure, Abnormal, plus “Variant” types.

Height min/max number inputs (meters).

Spoilers select: none/low/medium (filter by spoilerLevel).

Grid of cards (#titanGrid) rendered from data/titans.json.

Card: image + name + short summary.

Click/Enter: opens an accessible modal with full details (type, category, height, abilities, weaknesses, firstAppearance, affiliations, funFact). ESC/backdrop closes; focus is trapped; last focused returns on close.

Deep link: titans.html#colossal preselects/open modal for that titan.

If fetch('data/titans.json') fails, use window.TITANS_FALLBACK().

2) data/titans.json — FULL CONTENT (NEW)

Create spoiler-light entries for the Nine + a few notables:

[
  { "slug":"founding","name":"Founding Titan","heightMeters":13,"type":"Founding","category":"Nine","shifters":["(varies; royal line context)"],"abilities":["Coordinate","Influence Subjects of Ymir (conditional)"],"weaknesses":["Royal-blood conditions"],"firstAppearance":"S1 (lore), later revealed","affiliations":["Eldia (historical)"],"image":"assets/img/founding.svg","summary":"Origin titan tied to the Coordinate; central to the lore.","funFact":"Certain conditions can amplify its reach.","spoilerLevel":"low" },
  { "slug":"attack","name":"Attack Titan","heightMeters":15,"type":"Attack","category":"Nine","shifters":["(various across eras)"],"abilities":["Agile combat","Future memory fragments (lore)"],"weaknesses":["Standard stamina limits"],"firstAppearance":"S1","affiliations":["Various"],"image":"assets/img/attack.svg","summary":"Balanced fighter known for relentless drive.","funFact":"Associated with moving forward.","spoilerLevel":"low" },
  { "slug":"colossal","name":"Colossal Titan","heightMeters":60,"type":"Colossal","category":"Nine","shifters":["Bertholdt","Armin"],"abilities":["Steam emission","Explosive transformation"],"weaknesses":["Very slow","High stamina drain"],"firstAppearance":"S1E1","affiliations":["Various"],"image":"assets/img/colossal.svg","summary":"Skyscraper-class titan with catastrophic steam output.","funFact":"Transformation can be explosive.","spoilerLevel":"low" },
  { "slug":"armored","name":"Armored Titan","heightMeters":15,"type":"Armored","category":"Nine","shifters":["Reiner"],"abilities":["Hardened plates","Powerful charges"],"weaknesses":["Exposed joints","Weight reduces speed"],"firstAppearance":"S1","affiliations":["Various"],"image":"assets/img/armored.svg","summary":"Heavily plated titan for assault/defense.","funFact":"Armor can be selectively shed.","spoilerLevel":"low" },
  { "slug":"female","name":"Female Titan","heightMeters":14,"type":"Female","category":"Nine","shifters":["Annie"],"abilities":["Selective hardening","Versatile tactics"],"weaknesses":["Anti-hardening strategies"],"firstAppearance":"S1","affiliations":["Various"],"image":"assets/img/female.svg","summary":"Adaptive fighter emphasizing technique.","funFact":"High combat intelligence.","spoilerLevel":"low" },
  { "slug":"beast","name":"Beast Titan","heightMeters":17,"type":"Beast","category":"Nine","shifters":["Zeke"],"abilities":["Devastating throws","Command presence (situational)"],"weaknesses":["CQC vulnerability"],"firstAppearance":"S2","affiliations":["Various"],"image":"assets/img/beast.svg","summary":"Ranged dominance and battlefield control.","funFact":"Physiology varies by inheritor.","spoilerLevel":"low" },
  { "slug":"jaw","name":"Jaw Titan","heightMeters":5,"type":"Jaw","category":"Nine","shifters":["Ymir","Porco","Falco"],"abilities":["Extreme bite force","High agility"],"weaknesses":["Low endurance"],"firstAppearance":"S2","affiliations":["Various"],"image":"assets/img/jaw.svg","summary":"Smallest but ferocious—fast and deadly.","funFact":"Can damage hardened structures.","spoilerLevel":"low" },
  { "slug":"cart","name":"Cart Titan","heightMeters":4,"type":"Cart","category":"Nine","shifters":["Pieck"],"abilities":["Endurance","Quadrupedal mobility","Payload support"],"weaknesses":["Low offense without equipment"],"firstAppearance":"S3","affiliations":["Various"],"image":"assets/img/cart.svg","summary":"Long-duration support titan for transport/gear.","funFact":"Can stay transformed very long.","spoilerLevel":"low" },
  { "slug":"war-hammer","name":"War Hammer Titan","heightMeters":15,"type":"War Hammer","category":"Nine","shifters":["(Tybur family context)"],"abilities":["Externalized hardening weapons","Remote control (lore)"],"weaknesses":["Control link exposure"],"firstAppearance":"S4","affiliations":["Tybur family"],"image":"assets/img/warhammer.svg","summary":"Forms weapons/structures with hardening.","funFact":"Unique remote control method.","spoilerLevel":"low" },

  { "slug":"smiling","name":"Smiling Titan","heightMeters":15,"type":"Pure","category":"Notable Pure/Abnormal","shifters":["—"],"abilities":["Abnormal behavior (narrative impact)"],"weaknesses":["Standard pure weaknesses"],"firstAppearance":"S1","affiliations":["N/A"],"image":"assets/img/smiling.svg","summary":"Iconic grinning pure titan from early events.","funFact":"Recognized by the fixed smile.","spoilerLevel":"low" },
  { "slug":"rod-reiss","name":"Rod Reiss Titan","heightMeters":120,"type":"Abnormal","category":"Notable Pure/Abnormal","shifters":["— (unique case)"],"abilities":["Colossal crawl","Extreme heat/steam"],"weaknesses":["Low mobility","Structural instability"],"firstAppearance":"S3","affiliations":["Reiss family"],"image":"assets/img/rodreiss.svg","summary":"Massive distorted form that crawls forward.","funFact":"Scorches the ground while moving.","spoilerLevel":"low" },
  { "slug":"pure-small","name":"Pure Titan (Small)","heightMeters":3,"type":"Pure","category":"Notable Pure/Abnormal","shifters":["—"],"abilities":["Basic aggression"],"weaknesses":["Easily dispatched when targeted"],"firstAppearance":"S1","affiliations":["N/A"],"image":"assets/img/pure-small.svg","summary":"Common small pure titan near the walls.","funFact":"Numbers can overwhelm.","spoilerLevel":"none" },
  { "slug":"pure-standard","name":"Pure Titan (Standard)","heightMeters":7,"type":"Pure","category":"Notable Pure/Abnormal","shifters":["—"],"abilities":["Basic aggression"],"weaknesses":["Nape vulnerability"],"firstAppearance":"S1","affiliations":["N/A"],"image":"assets/img/pure-standard.svg","summary":"Most common height among pure titans.","funFact":"Behavior is direct and simple.","spoilerLevel":"none" },
  { "slug":"pure-tall","name":"Pure Titan (Tall)","heightMeters":12,"type":"Pure","category":"Notable Pure/Abnormal","shifters":["—"],"abilities":["Extended reach"],"weaknesses":["Slower reactions"],"firstAppearance":"S1","affiliations":["N/A"],"image":"assets/img/pure-tall.svg","summary":"Towering pure titan threatening rooftops.","funFact":"Requires multi-angle tactics.","spoilerLevel":"none" }
]

3) scripts/titans.js — FULL CONTENT (NEW)

Implement:

Load data/titans.json; on error use window.TITANS_FALLBACK().

Build cards in #titanGrid.

Wire search/filters (debounced ~120ms).

Click/Enter opens modal with details; ESC/backdrop closes; trap focus; restore on close.

Deep-link: if location.hash matches a slug, pre-open its modal on load.

Prevent broken images: if an image fails to load, swap to a generated inline SVG data URL.

4) scripts/main.js — UPDATE

Keep previous functionality and add:

async function fetchJSON(url){...} (already present; keep).

function TITANS_FALLBACK(){ return [a minimal subset: colossal/armored/beast/attack/founding with same schema as titans.json] }

Expose as window.TITANS_FALLBACK = TITANS_FALLBACK.

On index.html: add a second “Featured Titans” row (#featuredTitans).

Try to load titans.json; else fallback; show 3 cards (e.g., Colossal, Armored, Beast) linking to titans.html#slug.

5) index.html — UPDATE

Keep the existing hero/featured Inheritors section.

Add a “Featured Titans” section with a grid #featuredTitans populated by main.js from titans.json (or fallback).

Ensure nav includes Home / Inheritors / Titans / About / Theme (and no broken links).

6) about.html — UPDATE

Mention that the site now includes:

Inheritors (Attack Titan lineage)

Titans (the Nine + notable pure/abnormal)

Keep the fan site disclaimer and accessibility notes.

7) css/main.css — UPDATE

Reuse the existing design language.

Add/ensure styles used by titans.html:

.controls grid for filters (wrap on small screens)

.grid responsive card grid

.card hover lift (respect prefers-reduced-motion)

.modal, .modal__panel, .modal__close (same styling as inheritors modal)

.sr-only utility (if not already present)

8) SVGs in assets/img/*.svg — FULL CONTENT

Create simple, original silhouettes. Use this template and vary the inner <path> per file to make them distinct:

Make unique inner paths for: founding.svg, attack.svg, colossal.svg, armored.svg, female.svg, beast.svg, jaw.svg, cart.svg, warhammer.svg, smiling.svg, rodreiss.svg, pure-small.svg, pure-standard.svg, pure-tall.svg.

9) index.html (script hook) — UPDATE

At the bottom, ensure a small inline script (or logic in main.js) populates #featuredTitans just like #featured (inheritors). Cards should link to titans.html#<slug>.

10) Deep-link & Fallback Verification

inheritors.html#eren-yeager opens Eren in detail/modal.

titans.html#colossal opens the Colossal Titan in modal.

If fetch() fails, both pages render using their fallbacks with no console errors.

11) Optional (nice-to-have)

Add a “Compare” checkbox on each titan card; if 2 are selected, show a small floating drawer comparing height/type/category (no external libs). Keep code small/clean.

12) Finish with a short summary

After generating/updating all files, end your response with:

What was added/changed

How to add more Titans (edit data/titans.json + add SVGs)

How the hash deep-links work

Quick test checklist

Generate all code now. Ensure no broken links.
