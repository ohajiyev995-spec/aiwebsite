# Titans Compendium

A spoiler-light, static fan reference that catalogs every Nine Titan alongside all known inheritors. Built entirely with vanilla HTML, CSS, and JavaScript, the site ships original abstract silhouettes, responsive layouts, and keyboard-friendly interactions.

## Pages
- `index.html` – Landing page with hero copy and featured titans pulled from the dataset.
- `titans.html` – Interactive grid of the Nine Titans with search, filters, inheritor chips, and an accessible modal.
- `about.html` – Project overview, build notes, accessibility highlights, and disclaimers.
- `404.html` – Branded not-found page with a quick route back home.

## Running locally
1. Clone or download this repository.
2. Double-click `index.html` to open it in a browser **or** serve the folder with a static server (e.g. `python3 -m http.server`).
3. The scripts fetch `data/titans.json`; if the request fails (such as `file://` browsing), a built-in fallback dataset keeps the site functional.

## Deployment
- Everything uses relative paths so you can deploy to GitHub Pages, Netlify, Render, or any static host with no build step.
- Commit/push the repo as-is, or drag-and-drop the folder into your host’s dashboard.

## Extending the dataset
1. Edit `data/titans.json`. Add a new Titan object or append to an existing titan’s `inheritors` array.
2. Place the matching SVG silhouette in `assets/img/titans/` or `assets/img/inheritors/` as appropriate. Keep the artwork abstract and ensure filenames match the JSON paths exactly.
3. Refresh `titans.html`. The UI will automatically render the new entries.

## Accessibility features
- Visible focus rings, keyboard-activatable cards, and ESC/backdrop-friendly modals with focus trapping.
- `prefers-reduced-motion` respected to tone down hover elevations and transitions.
- Fallback silhouettes and polite announcements ensure the experience works even when images fail.

## Disclaimer
Attack on Titan and related intellectual property belong to their respective rights holders. The silhouettes in this project are original abstract artwork created solely for non-commercial, educational fan use.
