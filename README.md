# Titans Compendium

A dark-themed, spoiler-aware compendium for the Nine Titans and every inheritor. The project is built entirely with vanilla HTML, CSS, and JavaScript so it can be hosted anywhere or opened directly from disk.

## Pages
- `index.html` – Landing page with featured Titans and theme toggle.
- `titans.html` – Searchable cards with filters and detailed modal view.
- `about.html` – Project background, accessibility commitments, and disclaimer.
- `404.html` – Branded not-found page for static hosting.

## Running locally
- Double-click `index.html` or open it via `file://` in your browser. Inline fallbacks keep the experience working even when `fetch` is blocked by local file policies.
- For full network-style loading, run a lightweight static server such as `python3 -m http.server` from the project root and visit `http://localhost:8000/`.

## Deploying
- **GitHub Pages:** push this folder to a repository and enable Pages (root directory). `index.html` will serve automatically and `404.html` handles unknown routes.
- **Netlify / Vercel:** drag-and-drop or connect the repository; no build step required because everything is static assets.

## Extending the dataset
- Add or edit entries in `data/titans.json`. Each Titan requires a unique `slug`, metadata, and a list of inheritors.
- Create a matching silhouette SVG in `assets/img/titans/` (`currentColor` fills).
- For each inheritor you add, include a corresponding SVG in `assets/img/inheritors/` and reference it inside the Titan’s `inheritors` array.
- Keep filenames, slugs, and image paths consistent so fallbacks and filters continue to work.

## Accessibility & resilience
- Semantic structure, keyboard-navigation on cards/buttons, and focus-visible outlines.
- Modals trap focus and close with Escape; cards open with click, Enter, or Space.
- Respects `prefers-reduced-motion` and supports theme persistence.
- Offline-friendly: when `fetch` fails, the site uses inline fallback data and generated SVG replacements for missing images.

## Disclaimer
Attack on Titan and associated names belong to their respective rights holders. All silhouettes in this project are original abstract artwork intended for non-commercial, educational use.
