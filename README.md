# Titans Atlas

Titans Atlas is a lightweight, multi-page fan site for *Attack on Titan*. It showcases the Nine Titans with responsive layouts, accessible interactions, and zero build tooling — ready to drop onto services like GitHub Pages or Netlify.

## Features

- **Vanilla stack**: Semantic HTML, modular CSS, and plain JavaScript with no build step.
- **Interactive Titans roster**: Client-side search, filters, hover tooltips, and accessible modals populated from JSON.
- **Expanded dataset**: Includes categories, spoiler comfort levels, and notable variants beyond the Nine Titans.
- **Original artwork**: Custom SVG silhouettes rendered with `currentColor` to blend into any theme.
- **Adaptive theming**: Dim/light toggle that honours `prefers-color-scheme` and persists via `localStorage`.
- **Keyboard-first UX**: Skip links, focus styles, focus trapping, and a `?` shortcut that opens an in-page help sheet.
- **404 fallback**: Branded not-found page that links visitors back into the experience.

## Getting Started

1. Clone or download the repository.
2. Open `index.html` directly in your browser, or serve the directory with any static web server (e.g. `python3 -m http.server`).
3. Explore `titans.html` for the interactive grid and `about.html` for project details.

### Customising Titan Data

All lore content lives in `data/titans.json`. To add or edit entries:

1. Duplicate an existing object and update the fields (`slug`, `name`, `heightMeters`, `category`, `spoilerLevel`, `abilities`, etc.).
2. Place a matching SVG silhouette in `assets/img/` and reference it via the `image` property.
3. Keep summaries concise and spoiler-light when possible.
4. Reload `titans.html`; the grid will automatically render the new Titan with full search/filter support.

## Accessibility & Keyboard Controls

- `Tab` / `Shift + Tab`: Move between navigation, chips, cards, and controls.
- `Enter` / `Space`: Activate focused buttons or open Titan modals.
- `Esc`: Close tooltips (when applicable), modals, and the help sheet.
- `?`: Toggle the keyboard help popover.
- Tooltips are announced politely for focused cards and respect `prefers-reduced-motion`.

## Deployment

- All assets use relative paths, making the site compatible with GitHub Pages, Netlify, Vercel, or any static host.
- Update the Open Graph URLs (`og:url`, `og:image`) if you serve from a custom domain.
- Replace the placeholder social handles and contact details in the footer and `about.html` with your own links.

## License

This project’s code is released under the MIT License (see `LICENSE`). *Attack on Titan* and associated intellectual property belong to their respective owners; Titans Atlas provides original silhouettes and educational summaries for non-commercial fan use only.
