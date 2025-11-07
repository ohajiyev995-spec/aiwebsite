# Titans Compendium

Titans Compendium is a lightweight, spoiler-aware reference site covering all Nine Titans and every known inheritor. It is built entirely with vanilla HTML, CSS, and JavaScript so it runs anywhere, including simple static hosts and the local filesystem.

## Pages
- `index.html` — landing page with hero content and featured Titans pulled from the dataset.
- `titans.html` — searchable, filterable grid of all Titans with an accessible detail modal.
- `about.html` — background on the project, accessibility notes, and legal disclaimers.
- `404.html` — branded not-found page for static hosting.

## Data Source
All Titan and inheritor information lives in `data/titans.json`. The same dataset powers every page, and a minimal inline fallback keeps the site functional when JSON cannot be fetched (e.g., offline or `file://` usage).

## Running Locally
Double-click `index.html` or open it with any modern browser. No build tools are required. Because everything uses relative paths, the site also works when served by a lightweight static server such as `python -m http.server`.

## Deployment
Upload the repository to GitHub and enable GitHub Pages (root deployment) or deploy the folder to Netlify, Vercel, or any static host. All assets use relative paths, so no additional configuration is necessary.

## Extending the Compendium
To add a new Titan or inheritor:
1. Edit `data/titans.json` and append a new Titan object or add an inheritor to an existing Titan’s `inheritors` array.
2. Place a matching silhouette SVG in `assets/img/titans/` or `assets/img/inheritors/` and reference it in the JSON.
3. Optional: update featured selections or copy variations for offline fallbacks in `scripts/main.js`.

## Accessibility Features
- Keyboard navigation for every interactive control and card.
- Visible `:focus-visible` outlines and focus trapping in the modal dialog.
- Escape key closes the modal; Enter/Space activate cards.
- `prefers-reduced-motion` respected across animations and transitions.
- Dark and light themes with persistent user preference via localStorage.

## Disclaimer
Attack on Titan and related intellectual property belong to their respective rights holders. All silhouettes in this project are original abstract artwork designed solely for non-commercial, fan, and educational purposes.
