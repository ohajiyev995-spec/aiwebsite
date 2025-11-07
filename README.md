# Attack Titan Lineage — Titans Compendium

Attack Titan Lineage has expanded into a spoiler-light Titans Compendium covering both the Attack Titan inheritors and a curated set of Nine Titans plus notable pure/abnormal forms. Everything is built with a lightweight vanilla HTML/CSS/JS stack, ships original abstract silhouettes, and is ready to drop onto static hosts like GitHub Pages or Netlify.

## Project overview
- Responsive layout with dedicated pages for the landing experience, interactive inheritor browser, titan compendium grid, about section, and a custom 404 page.
- Dark/light theme toggle powered by CSS custom properties and `localStorage`, defaulting to the dark palette listed in the design spec.
- Inheritor data sourced from `data/attack_titans.json` and titan profiles from `data/titans.json`, each paired with fallback datasets so the UI still renders if `fetch` fails (e.g., when opened via `file://`).
- Accessible modal dialogs for both the lineage and titan pages so mobile and keyboard users can read focused details comfortably.

## Run locally
1. Clone or download this repository.
2. Open `index.html` directly in your browser *or* serve the folder with a lightweight static server such as:
   ```bash
   python3 -m http.server
   ```
3. Visit `http://localhost:8000/index.html` (or whichever port you used). The scripts will attempt to fetch both `data/attack_titans.json` and `data/titans.json`; if either request is blocked, the fallback datasets defined in `scripts/main.js` keep the site functional.

## Deploy
- All links and assets use relative paths, so you can upload the folder as-is to GitHub Pages, Netlify, Render, or any static host.
- No build process is required—just commit the files or drag-and-drop the directory into your host’s dashboard.
- Update social/profile links in the header/footer and `about.html` with your preferred handles before publishing.

## Add or edit inheritors
1. Open `data/attack_titans.json` and duplicate one of the existing objects.
2. Adjust the required fields (`slug`, `name`, `era`, `summary`, etc.). Keep descriptions concise and spoiler-light.
3. Create a corresponding silhouette in `assets/img/` using simple shapes and `currentColor`. Reference the new SVG via the `image` property.
4. Reload `inheritors.html`. The list, detail panel, modal, and search will automatically display the new entry.

## Add or edit titans
1. Open `data/titans.json` and duplicate an existing titan object.
2. Update the fields (`slug`, `name`, `type`, `category`, `abilities`, `funFact`, etc.) while keeping summaries spoiler-light.
3. Add or update the matching SVG silhouette inside `assets/img/`, ensuring it uses `currentColor` so themes can style it.
4. Reload `titans.html`. The grid, filters, and modal will automatically reflect the updated dataset.

## Accessibility features
- Visible focus outlines using the accent color, plus keyboard-accessible navigation, search, list items, and dialogs.
- Modal dialogs trap focus, support Escape/backdrop dismissal, and restore focus to the trigger control.
- Motion-reduced experience thanks to `@media (prefers-reduced-motion: reduce)` for hover lifts and transitions.
- All imagery includes descriptive alt text; error handling swaps missing silhouettes with a generated fallback.

## License & IP notice
The code in this project is released under the MIT License (see `LICENSE`). *Attack on Titan* and related names remain the property of their respective rights holders. All silhouettes included here are original abstract artwork created solely for non-commercial fan use.
