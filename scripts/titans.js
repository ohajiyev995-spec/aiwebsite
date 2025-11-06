/* Titans page interactive logic */

(function () {
  if (!window.TitansAtlas) return;

  const { fetchJSON, trapFocus, prefersReducedMotion } = window.TitansAtlas;
  const SPOILER_RANK = { none: 0, low: 1, medium: 2, high: 3 };

  const grid = document.getElementById("titan-grid");
  const resultCount = document.querySelector("[data-result-count]");
  const filtersForm = document.getElementById("titan-filters");
  const noResultsMessage = document.getElementById("no-results");
  const tooltip = document.getElementById("titan-tooltip");
  const modal = document.getElementById("titan-modal");
  const modalSurface = modal ? modal.querySelector(".modal__surface") : null;
  const modalImage = document.getElementById("titan-modal-image");
  const modalTitle = document.getElementById("titan-modal-title");
  const modalSummary = document.getElementById("titan-modal-summary");
  const modalType = document.getElementById("titan-modal-type");
  const modalHeight = document.getElementById("titan-modal-height");
  const modalShifters = document.getElementById("titan-modal-shifters");
  const modalAffiliations = document.getElementById("titan-modal-affiliations");
  const modalFirst = document.getElementById("titan-modal-first");
  const modalAbilities = document.getElementById("titan-modal-abilities");
  const modalWeaknesses = document.getElementById("titan-modal-weaknesses");
  const modalFact = document.getElementById("titan-modal-fact");
  const modalCategory = document.getElementById("titan-modal-category");
  const modalSpoiler = document.getElementById("titan-modal-spoiler");
  const modalWeaknessSummary = document.getElementById("titan-modal-weakness-summary");

  if (!grid || !filtersForm || !tooltip || !modal) return;

  const tooltipId = tooltip.getAttribute("id");
  const section = grid.closest("section[aria-live]");
  let titans = [];
  let filtered = [];
  let tooltipVisible = false;
  let tooltipFollowCursor = false;
  let activeCard = null;
  let pointerType = "mouse";
  let releaseModalTrap = null;
  let touchPreviewCard = null;

  tooltip.setAttribute("aria-live", "polite");

  function debounce(fn, delay = 200) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function titanMatchesFilters(titan, filters) {
    const query = filters.query.trim().toLowerCase();
    const typeMatch = !filters.type || titan.type === filters.type;
    const categoryMatch = !filters.category || titan.category === filters.category;
    const searchHaystack = [
      titan.name,
      titan.type,
      titan.summary,
      titan.category,
      titan.abilities.join(" "),
      titan.shifters.join(" "),
      titan.affiliations.join(" "),
      titan.funFact || ""
    ]
      .join(" ")
      .toLowerCase();
    const queryMatch = !query || searchHaystack.includes(query);

    const shifterKnown = hasKnownShifter(titan.shifters);
    const shifterMatch =
      !filters.shifterKnown ||
      (filters.shifterKnown === "yes" && shifterKnown) ||
      (filters.shifterKnown === "no" && !shifterKnown);

    const minHeight = Number(filters.minHeight || 0);
    const maxHeight = Number(filters.maxHeight || Number.POSITIVE_INFINITY);
    const height = Number(titan.heightMeters || 0);
    const heightMatch = height >= minHeight && height <= maxHeight;

    const titanSpoiler = String(titan.spoilerLevel || "medium").toLowerCase();
    const spoilerRank = SPOILER_RANK[titanSpoiler] ?? SPOILER_RANK.medium;
    const spoilerThreshold = SPOILER_RANK[filters.spoiler] ?? SPOILER_RANK.medium;
    const spoilerMatch = spoilerRank <= spoilerThreshold;

    return typeMatch && queryMatch && shifterMatch && heightMatch && categoryMatch && spoilerMatch;
  }

  function renderGrid(list) {
    grid.innerHTML = "";
    noResultsMessage.hidden = list.length > 0;
    resultCount.textContent = list.length
      ? `Showing ${list.length} titan${list.length === 1 ? "" : "s"}`
      : "No titans available";

    list.forEach((titan) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "titan-card";
      card.dataset.slug = titan.slug;
      card.setAttribute("aria-describedby", tooltipId);
      const spoilerLabel = formatSpoilerLabel(titan.spoilerLevel);
      const heightDisplay = titan.heightMeters != null ? `${titan.heightMeters}m` : "—";
      card.innerHTML = `
        <img src="${titan.image}" alt="${titan.name} silhouette" loading="lazy" />
        <div class="titan-card__body">
          <div class="titan-card__meta">
            <span class="chip chip-subtle">${titan.category || "Unclassified"}</span>
            <span class="chip chip-outline" data-spoiler="${(titan.spoilerLevel || "medium").toLowerCase()}">${spoilerLabel}</span>
          </div>
          <h3>${titan.name}</h3>
          <p class="titan-card__summary">${titan.summary}</p>
          <p class="titan-card__details"><small><strong>Type:</strong> ${titan.type} • <strong>Height:</strong> ${heightDisplay}</small></p>
        </div>
      `;

      const wrapper = document.createElement("div");
      wrapper.setAttribute("role", "listitem");
      wrapper.appendChild(card);
      grid.appendChild(wrapper);

      card.addEventListener("pointerenter", (event) => {
        pointerType = event.pointerType || "mouse";
        tooltipFollowCursor = pointerType === "mouse" || pointerType === "pen";
        showTooltip(card, event.clientX, event.clientY);
      });
      card.addEventListener("pointerleave", hideTooltip);

      card.addEventListener("pointermove", (event) => {
        if (!tooltipVisible || !tooltipFollowCursor) return;
        positionTooltip(event.clientX, event.clientY);
      });

      card.addEventListener("focus", (event) => {
        pointerType = "keyboard";
        tooltipFollowCursor = false;
        const rect = card.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        showTooltip(card, x, y);
      });

      card.addEventListener("blur", (event) => {
        if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget)) return;
        hideTooltip();
      });

      card.addEventListener("pointerdown", (event) => {
        if ((event.pointerType || "").toLowerCase() !== "touch") return;
        if (touchPreviewCard !== card) {
          event.preventDefault();
          touchPreviewCard = card;
          tooltipFollowCursor = false;
          showTooltip(card, event.clientX, event.clientY);
        } else {
          touchPreviewCard = null;
        }
      });

      card.addEventListener("click", (event) => {
        event.preventDefault();
        const slug = card.dataset.slug;
        const titanData = titans.find((item) => item.slug === slug);
        if (titanData) {
          openModal(titanData);
        }
      });

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          const slug = card.dataset.slug;
          const titanData = titans.find((item) => item.slug === slug);
          if (titanData) {
            openModal(titanData);
          }
        }
      });
    });

    section?.setAttribute("aria-busy", "false");
  }

  function showTooltip(card, clientX, clientY) {
    const slug = card.dataset.slug;
    const titan = titans.find((item) => item.slug === slug);
    if (!titan) return;
    activeCard = card;
    const heightDisplay = titan.heightMeters != null ? `${titan.heightMeters}m` : "—";
    const spoilerLabel = formatSpoilerLabel(titan.spoilerLevel);
    const detailLine = [titan.category, titan.type, heightDisplay, titan.abilities[0] || null, spoilerLabel]
      .filter(Boolean)
      .join(" • ");
    tooltip.innerHTML = `
      <h3>${titan.name}</h3>
      <p>${titan.summary}</p>
      <p><small>${detailLine}</small></p>
    `;
    tooltip.hidden = false;
    tooltipVisible = true;
    requestAnimationFrame(() => {
      positionTooltip(clientX, clientY);
    });
  }

  function hideTooltip() {
    tooltip.hidden = true;
    tooltipVisible = false;
    activeCard = null;
  }

  function positionTooltip(clientX, clientY) {
    if (!tooltipVisible) return;
    const padding = 16;
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = clientX + 16;
    let top = clientY + 16;

    if (left + tooltipRect.width + padding > window.innerWidth) {
      left = Math.max(padding, clientX - tooltipRect.width - 16);
    }
    if (top + tooltipRect.height + padding > window.innerHeight) {
      top = Math.max(padding, window.innerHeight - tooltipRect.height - padding);
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function openModal(titan) {
    hideTooltip();
    touchPreviewCard = null;
    modalImage.src = titan.image;
    modalImage.alt = `${titan.name} silhouette`;
    modalTitle.textContent = titan.name;
    modalSummary.textContent = titan.summary;
    modalCategory.textContent = titan.category || "Unclassified";
    const spoilerLevel = String(titan.spoilerLevel || "medium").toLowerCase();
    modalSpoiler.textContent = formatSpoilerLabel(spoilerLevel);
    modalSpoiler.dataset.level = spoilerLevel;
    modalType.textContent = titan.type;
    modalHeight.textContent = titan.heightMeters != null ? `${titan.heightMeters} meters` : "—";
    modalShifters.textContent = titan.shifters.join(", ");
    modalAffiliations.textContent = titan.affiliations.join(", ");
    modalFirst.textContent = titan.firstAppearance;
    populateList(modalAbilities, titan.abilities);
    populateList(modalWeaknesses, titan.weaknesses);
    const weaknessSummary = titan.weaknesses && titan.weaknesses.length ? titan.weaknesses.join(", ") : "—";
    modalWeaknessSummary.textContent = weaknessSummary;
    modalFact.textContent = titan.funFact;

    modal.hidden = false;
    modal.setAttribute("data-open", "true");
    releaseModalTrap = trapFocus(modalSurface || modal);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    modal.removeAttribute("data-open");
    if (releaseModalTrap) {
      releaseModalTrap();
      releaseModalTrap = null;
    }
    document.body.style.overflow = "";
  }

  function populateList(listElement, items) {
    listElement.innerHTML = "";
    if (!items || items.length === 0) {
      const li = document.createElement("li");
      li.textContent = "—";
      listElement.appendChild(li);
      return;
    }
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      listElement.appendChild(li);
    });
  }

  function hasKnownShifter(shifters = []) {
    return shifters.some((entry = "") => {
      const value = entry.trim().toLowerCase();
      if (!value) return false;
      if (value.startsWith("[")) return false;
      if (value.startsWith("—") || value.startsWith("-")) return false;
      if (value === "n/a") return false;
      return true;
    });
  }

  function formatSpoilerLabel(level = "medium") {
    const normalized = String(level).toLowerCase();
    switch (normalized) {
      case "none":
        return "Spoiler safe";
      case "low":
        return "Low spoilers";
      case "medium":
      default:
        return "Medium spoilers";
    }
  }

  function parseFilters() {
    const formData = new FormData(filtersForm);
    return {
      query: formData.get("query") || "",
      type: formData.get("type") || "",
      shifterKnown: formData.get("shifterKnown") || "",
      category: formData.get("category") || "",
      spoiler: (formData.get("spoiler") || "medium").toLowerCase(),
      minHeight: formData.get("minHeight") || "0",
      maxHeight: formData.get("maxHeight") || "150"
    };
  }

  function updateFilters() {
    filtered = titans.filter((titan) => titanMatchesFilters(titan, parseFilters()));
    renderGrid(filtered);
  }

  const debouncedUpdate = debounce(updateFilters, 180);

  function initFilters() {
    filtersForm.addEventListener("input", (event) => {
      if (event.target.id === "search-input") {
        debouncedUpdate();
      } else {
        updateFilters();
      }
    });
    filtersForm.addEventListener("change", updateFilters);
    filtersForm.addEventListener("reset", () => {
      requestAnimationFrame(updateFilters);
    });
  }

  function initModalListeners() {
    modal.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", closeModal);
    });
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.classList.contains("modal__backdrop")) {
        closeModal();
      }
    });
    document.addEventListener("titans:escape", closeModal);
  }

  function initOutsideTouchHandler() {
    document.addEventListener("pointerdown", (event) => {
      if ((event.pointerType || "").toLowerCase() !== "touch") return;
      if (!grid.contains(event.target)) {
        hideTooltip();
        touchPreviewCard = null;
      }
    });
  }

  function loadTitans() {
    section?.setAttribute("aria-busy", "true");
    fetchJSON("data/titans.json")
      .then((data) => {
        titans = data;
        filtered = [...titans];
        updateFilters();
      })
      .catch((error) => {
        console.error(error);
        resultCount.textContent = "Failed to load titans.";
        noResultsMessage.hidden = false;
        noResultsMessage.textContent = "We couldn\'t retrieve the titan data right now. Please refresh to try again.";
      });
  }

  function init() {
    initFilters();
    initModalListeners();
    initOutsideTouchHandler();
    loadTitans();
    if (prefersReducedMotion()) {
      tooltip.style.transition = "none";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
