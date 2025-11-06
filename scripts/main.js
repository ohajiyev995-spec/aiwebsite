/* Titans Atlas shared utilities and global UI behaviors */

(function () {
  const THEME_KEY = "titans-atlas-theme";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const docEl = document.documentElement;
  let storedTheme = localStorage.getItem(THEME_KEY);
  let helpDialogTrapRelease = null;

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  const themeToggle = document.getElementById("theme-toggle");
  const helpToggle = document.getElementById("help-toggle");
  const helpDialog = document.getElementById("keyboard-help");
  const helpCloseButton = helpDialog ? helpDialog.querySelector("[data-close-help]") : null;
  const currentYearTargets = document.querySelectorAll("[data-current-year]");

  const cache = new Map();

  function getSystemTheme() {
    return prefersDark.matches ? "dim" : "light";
  }

  function applyTheme(theme, { persist } = { persist: false }) {
    const normalized = theme === "light" ? "light" : "dim";
    docEl.setAttribute("data-theme", normalized);
    if (persist) {
      localStorage.setItem(THEME_KEY, normalized);
      storedTheme = normalized;
    }
    syncThemeToggle(normalized);
  }

  function syncThemeToggle(theme) {
    if (!themeToggle) return;
    const pressed = theme === "dim";
    themeToggle.setAttribute("aria-pressed", String(pressed));
    const label = themeToggle.querySelector(".button-label") || themeToggle;
    label.textContent = theme === "light" ? "Switch to Dim" : "Switch to Light";
  }

  function toggleTheme() {
    const current = docEl.getAttribute("data-theme") || getSystemTheme();
    const next = current === "light" ? "dim" : "light";
    applyTheme(next, { persist: true });
  }

  function initTheme() {
    const theme = storedTheme || getSystemTheme();
    applyTheme(theme);
    if (!storedTheme) {
      prefersDark.addEventListener("change", (event) => {
        if (localStorage.getItem(THEME_KEY)) return;
        applyTheme(event.matches ? "dim" : "light");
      });
    }
    themeToggle?.addEventListener("click", toggleTheme);
  }

  function initCurrentYear() {
    const year = new Date().getFullYear();
    currentYearTargets.forEach((node) => {
      node.textContent = String(year);
    });
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function trapFocus(container) {
    if (!container) return () => {};
    const previous = document.activeElement;
    const focusables = Array.from(container.querySelectorAll(focusableSelector)).filter((node) =>
      node.offsetParent !== null || container === node
    );
    const first = focusables[0] || container;
    const last = focusables[focusables.length - 1] || container;

    function handleKeydown(event) {
      if (event.key !== "Tab") return;
      if (focusables.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", handleKeydown);
    window.requestAnimationFrame(() => first.focus());

    return () => {
      container.removeEventListener("keydown", handleKeydown);
      if (previous && typeof previous.focus === "function") {
        window.requestAnimationFrame(() => previous.focus());
      }
    };
  }

  async function fetchJSON(url) {
    if (cache.has(url)) {
      return cache.get(url);
    }
    const response = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    cache.set(url, data);
    return data;
  }

  function renderFeatured() {
    const container = document.getElementById("featured-titans");
    if (!container) return;
    const featuredAttr = container.getAttribute("data-featured") || "";
    const featuredSlugs = featuredAttr
      .split(",")
      .map((slug) => slug.trim())
      .filter(Boolean);

    fetchJSON("data/titans.json")
      .then((titans) => {
        const matches = featuredSlugs.length
          ? titans.filter((titan) => featuredSlugs.includes(titan.slug))
          : titans.slice(0, 3);
        container.innerHTML = "";
        matches.slice(0, 3).forEach((titan) => {
          const card = document.createElement("article");
          card.className = "featured-card";
          card.innerHTML = `
            <img src="${titan.image}" alt="${titan.name} silhouette" loading="lazy" />
            <h3>${titan.name}</h3>
            <p>${titan.summary}</p>
            <p><small><strong>Signature:</strong> ${titan.abilities[0] || "Unknown"}</small></p>
          `;
          container.appendChild(card);
        });
        if (!matches.length) {
          container.innerHTML = `<p class="no-results">Could not load featured titans at this time.</p>`;
        }
      })
      .catch((error) => {
        console.error(error);
        container.innerHTML = `<p class="no-results">Unable to load featured titans. Please try again later.</p>`;
      });
  }

  function openHelp() {
    if (!helpDialog) return;
    helpDialog.hidden = false;
    helpDialog.setAttribute("aria-modal", "true");
    helpToggle?.setAttribute("aria-expanded", "true");
    helpDialogTrapRelease = trapFocus(helpDialog);
  }

  function closeHelp() {
    if (!helpDialog) return;
    helpDialog.hidden = true;
    helpDialog.setAttribute("aria-modal", "false");
    helpToggle?.setAttribute("aria-expanded", "false");
    if (helpDialogTrapRelease) {
      helpDialogTrapRelease();
      helpDialogTrapRelease = null;
    }
  }

  function handleGlobalKeydown(event) {
    if (event.key === "?" && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      if (helpDialog?.hidden) {
        openHelp();
      } else {
        closeHelp();
      }
    }
    if (event.key === "Escape") {
      if (!helpDialog?.hidden) {
        closeHelp();
      }
      document.dispatchEvent(new CustomEvent("titans:escape"));
    }
  }

  function initHelp() {
    if (!helpDialog) return;
    helpDialog.setAttribute("aria-modal", "false");
    helpDialog.hidden = true;
    helpToggle?.addEventListener("click", () => {
      if (helpDialog.hidden) {
        openHelp();
      } else {
        closeHelp();
      }
    });
    helpCloseButton?.addEventListener("click", closeHelp);
    document.addEventListener("keydown", handleGlobalKeydown);
    helpDialog.addEventListener("click", (event) => {
      if (event.target === helpDialog) {
        closeHelp();
      }
    });
  }

  function init() {
    initTheme();
    initHelp();
    initCurrentYear();
    renderFeatured();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.TitansAtlas = Object.freeze({
    fetchJSON,
    trapFocus,
    prefersReducedMotion
  });
})();
