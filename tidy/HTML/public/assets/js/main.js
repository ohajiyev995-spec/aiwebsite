import { HOUSES, WIZARDS } from "./data.js";

const focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "details",
  "[tabindex]:not([tabindex='-1'])"
].join(", ");

const colorLookup = {
  Scarlet: "#ae0001",
  Gold: "#d4af37",
  "Emerald Green": "#046307",
  Silver: "#c0c0c0",
  Blue: "#0e1a40",
  Bronze: "#b08d57",
  Yellow: "#ecb939",
  Black: "#372e29"
};

const houseLookup = new Map(HOUSES.map((house) => [house.id, house]));
const wizardLookup = new Map(WIZARDS.map((wizard) => [wizard.id, wizard]));

const timelineEvents = [
  {
    year: 1991,
    title: "The Sorting and a New Era Begins",
    summary:
      "Harry Potter, Hermione Granger, and Ron Weasley begin their Hogwarts journey, reshaping Gryffindor's legacy while Slytherin plots to restore Salazar's vision.",
    related: [
      { type: "wizard", id: "harry-potter" },
      { type: "house", id: "gryffindor" }
    ],
    spoilerLevel: "low"
  },
  {
    year: 1992,
    title: "Chamber Secrets Reopened",
    summary:
      "The Heir of Slytherin unleashes the basilisk, forcing both Gryffindor courage and Slytherin history into sharp relief as students rally to protect Hogwarts.",
    related: [
      { type: "wizard", id: "harry-potter" },
      { type: "house", id: "slytherin" }
    ],
    spoilerLevel: "high"
  },
  {
    year: 1995,
    title: "Dumbledore's Army Rises",
    summary:
      "Under Dolores Umbridge's regime, students gather in the Room of Requirement to master defensive magic, cementing friendships across houses and igniting resistance.",
    related: [
      { type: "wizard", id: "hermione-granger" },
      { type: "wizard", id: "neville-longbottom" },
      { type: "house", id: "ravenclaw" }
    ],
    spoilerLevel: "low"
  },
  {
    year: 1996,
    title: "The Half-Blood Prince Reveals His Loyalties",
    summary:
      "Severus Snape's hidden past and Draco Malfoy's mission collide, testing Slytherin identity while Dumbledore and Harry pursue Horcrux clues around the world.",
    related: [
      { type: "wizard", id: "severus-snape" },
      { type: "wizard", id: "draco-malfoy" }
    ],
    spoilerLevel: "high"
  },
  {
    year: 1997,
    title: "The Horcrux Hunt",
    summary:
      "With Hogwarts under new rule, the trio leaves school to dismantle Voldemort's Horcruxes, relying on help from Luna, Hagrid, and allies across every house.",
    related: [
      { type: "wizard", id: "harry-potter" },
      { type: "wizard", id: "luna-lovegood" },
      { type: "wizard", id: "rubeus-hagrid" }
    ],
    spoilerLevel: "high"
  },
  {
    year: 1998,
    title: "Battle of Hogwarts",
    summary:
      "Students, professors, and creatures unite to defend the castle. Neville Longbottom leads the charge inside the castle while McGonagall coordinates defenses.",
    related: [
      { type: "wizard", id: "neville-longbottom" },
      { type: "wizard", id: "minerva-mcgonagall" },
      { type: "house", id: "hufflepuff" }
    ],
    spoilerLevel: "high"
  },
  {
    year: 2017,
    title: "Legacies of the Houses",
    summary:
      "In the years following the war, Hogwarts embraces a renewed focus on unity, as alumni like Draco Malfoy and Luna Lovegood rebuild bonds between the houses.",
    related: [
      { type: "wizard", id: "draco-malfoy" },
      { type: "wizard", id: "luna-lovegood" },
      { type: "house", id: "ravenclaw" }
    ],
    spoilerLevel: "low"
  }
];

let modalInstance;

document.addEventListener("DOMContentLoaded", () => {
  updateCurrentYear();
  initNav();
  initMobileNav();
  initFeatured();
  initHouses();
  initWizards();
  initTimeline();
  initSpoilerBanner();
  initRevealObserver();
});

function initNav() {
  const page = document.body.dataset.page;
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    const target = link.getAttribute("href");
    if (!target) return;
    const normalized = target.replace("./", "");
    if (
      (page === "home" && normalized.includes("index")) ||
      normalized.includes(`${page}.html`)
    ) {
      link.classList.add("is-active");
    }
  });
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  if (!toggle || !navList) return;
  toggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  navList.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      navList.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function updateCurrentYear() {
  const currentYearEl = document.getElementById("current-year");
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
}

function initFeatured() {
  const houseContainer = document.getElementById("featured-house");
  const wizardContainer = document.getElementById("featured-wizard");
  if (!houseContainer || !wizardContainer) return;

  const featuredHouse = HOUSES[0];
  const featuredWizard = WIZARDS.find((wizard) => wizard.spoilerLevel === "low") || WIZARDS[0];

  houseContainer.innerHTML = renderFeaturedHouse(featuredHouse);
  wizardContainer.innerHTML = renderFeaturedWizard(featuredWizard);

  houseContainer.querySelector("button")?.addEventListener("click", () =>
    openModal({ type: "house", payload: featuredHouse })
  );
  wizardContainer.querySelector("button")?.addEventListener("click", () =>
    openModal({ type: "wizard", payload: featuredWizard })
  );
}

function initHouses() {
  const grid = document.querySelector("[data-houses-grid]");
  if (!grid) return;

  const searchInput = document.getElementById("house-search");
  const traitSelect = document.getElementById("house-trait");
  const resultsCount = document.getElementById("house-results-count");

  const render = () => {
    const term = searchInput?.value.trim().toLowerCase() ?? "";
    const trait = traitSelect?.value ?? "all";
    const filtered = HOUSES.filter((house) => {
      const matchesName = house.name.toLowerCase().includes(term);
      const matchesTrait =
        trait === "all" || house.traits.some((t) => t.toLowerCase() === trait.toLowerCase());
      return matchesName && matchesTrait;
    });

    grid.innerHTML = filtered.length
      ? filtered.map((house) => renderHouseCard(house)).join("")
      : `<div class="empty-state">No houses match that search just yet. Try another trait or keyword.</div>`;

    resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? "house" : "houses"} found`;

    grid.querySelectorAll("[data-action='view-house']").forEach((button) => {
      button.addEventListener("click", (event) => {
        const id = event.currentTarget.getAttribute("data-id");
        const house = houseLookup.get(id);
        if (house) {
          openModal({ type: "house", payload: house });
        }
      });
    });
  };

  searchInput?.addEventListener("input", render);
  traitSelect?.addEventListener("change", render);
  render();
}

function initWizards() {
  const grid = document.querySelector("[data-wizards-grid]");
  if (!grid) return;

  const searchInput = document.getElementById("wizard-search");
  const houseSelect = document.getElementById("wizard-house");
  const yearSelect = document.getElementById("wizard-year");
  const spoilerToggle = document.getElementById("spoiler-toggle");
  const resultsCount = document.getElementById("wizard-results-count");

  const render = () => {
    const term = searchInput?.value.trim().toLowerCase() ?? "";
    const houseFilter = houseSelect?.value ?? "all";
    const yearFilter = yearSelect?.value ?? "all";
    const spoilersOn = spoilerToggle?.checked ?? false;

    const filtered = WIZARDS.filter((wizard) => {
      const matchesName = wizard.name.toLowerCase().includes(term);
      const matchesHouse = houseFilter === "all" || wizard.house === houseFilter;
      const matchesYear = yearFilter === "all" || wizard.years.includes(Number(yearFilter));
      return matchesName && matchesHouse && matchesYear;
    });

    grid.innerHTML = filtered.length
      ? filtered
          .map((wizard) => renderWizardCard(wizard, { spoilersOn }))
          .join("")
      : `<div class="empty-state">No wizards match that combination. Try adjusting the filters or enabling spoilers.</div>`;

    resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? "wizard" : "wizards"} found`;

    grid.querySelectorAll("[data-action='view-wizard']").forEach((button) => {
      button.addEventListener("click", (event) => {
        const id = event.currentTarget.getAttribute("data-id");
        const wizard = wizardLookup.get(id);
        if (wizard) {
          openModal({ type: "wizard", payload: wizard });
        }
      });
    });
  };

  searchInput?.addEventListener("input", render);
  houseSelect?.addEventListener("change", render);
  yearSelect?.addEventListener("change", render);
  spoilerToggle?.addEventListener("change", render);
  render();
}

function initTimeline() {
  const timelineRoot = document.querySelector("[data-timeline]");
  if (!timelineRoot) return;

  const spoilersOn = document.getElementById("timeline-spoiler-toggle");
  const render = () => {
    const showSpoilers = spoilersOn?.checked ?? false;
    const grouped = timelineEvents.reduce((acc, event) => {
      const key = event.year;
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    }, {});

    const sortedYears = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b);

    const markup = sortedYears
      .map((year) => {
        const items = grouped[year]
          .map((event) =>
            renderTimelineItem(event, {
              showSpoilers
            })
          )
          .join("");
        return `<div class="timeline-group">
            <h3 class="visually-muted">${year}</h3>
            ${items}
          </div>`;
      })
      .join("");

    timelineRoot.innerHTML = markup;

    timelineRoot.querySelectorAll("[data-action='open-modal']").forEach((button) => {
      button.addEventListener("click", (event) => {
        const type = event.currentTarget.getAttribute("data-type");
        const id = event.currentTarget.getAttribute("data-id");
        if (type === "wizard") {
          const wizard = wizardLookup.get(id);
          wizard && openModal({ type: "wizard", payload: wizard });
        } else if (type === "house") {
          const house = houseLookup.get(id);
          house && openModal({ type: "house", payload: house });
        }
      });
    });
  };

  spoilersOn?.addEventListener("change", render);
  render();
}

function initSpoilerBanner() {
  const banner = document.querySelector("[data-spoiler-banner]");
  if (!banner) return;
  const storageKey = "hogwartsSpoilerDismissed";
  const hasDismissed = window.localStorage?.getItem(storageKey) === "true";

  if (hasDismissed) {
    banner.hidden = true;
    return;
  }

  const dismissButton = banner.querySelector("[data-action='dismiss-banner']");
  dismissButton?.addEventListener("click", () => {
    banner.hidden = true;
    try {
      window.localStorage.setItem(storageKey, "true");
    } catch (error) {
      console.warn("Unable to access localStorage", error);
    }
  });
}

function initRevealObserver() {
  const elements = document.querySelectorAll(".fade-in-up");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));
}

function renderFeaturedHouse(house) {
  return `
    <div class="surface surface-glow featured-item fade-in-up">
      <span class="badge">Featured House</span>
      <h3>${house.name}</h3>
      <p>${house.summary}</p>
      <div class="house-colors" aria-label="House colors">
        ${house.colors
          .map(
            (color) =>
              `<span class="house-color-swatch" style="background:${colorLookup[color] ?? "#8ab4f8"}" title="${color}"></span>`
          )
          .join("")}
      </div>
      <button class="button button-outline" type="button">View House Profile</button>
    </div>
  `;
}

function renderFeaturedWizard(wizard) {
  return `
    <div class="surface surface-glow featured-item fade-in-up">
      <span class="badge">Featured Wizard</span>
      <h3>${wizard.name}</h3>
      <p>${wizard.summary}</p>
      <div class="house-badge" data-house="${wizard.house}">${wizard.house}</div>
      <button class="button button-outline" type="button">View Wizard Profile</button>
    </div>
  `;
}

function renderHouseCard(house) {
  return `
    <article class="surface surface-glow card fade-in-up">
      <img src="${house.img}" alt="${house.name} crest" loading="lazy" width="480" height="320">
      <header>
        <h3>${house.name}</h3>
        <p>${house.summary}</p>
      </header>
      <ul class="meta-list">
        <li><strong>Founder:</strong> ${house.founder}</li>
        <li><strong>Mascot:</strong> ${house.mascot}</li>
      </ul>
      <div class="house-colors" aria-label="House colors">
        ${house.colors
          .map(
            (color) =>
              `<span class="house-color-swatch" style="background:${colorLookup[color] ?? "#8ab4f8"}" title="${color}"></span>`
          )
          .join("")}
      </div>
      <div class="list-inline" aria-label="House traits">
        ${house.traits.map((trait) => `<li>${trait}</li>`).join("")}
      </div>
      <button class="button button-ghost" type="button" data-action="view-house" data-id="${house.id}">
        View Details
      </button>
    </article>
  `;
}

function renderWizardCard(wizard, { spoilersOn }) {
  const summary = wizard.summary;
  const truncated = truncate(summary, 30);
  const spoilerGate =
    wizard.spoilerLevel === "high" && !spoilersOn
      ? `<p class="visually-muted">Spoiler hidden. Toggle spoilers to reveal this wizard's story.</p>`
      : `<p>${truncated}</p>`;

  return `
    <article class="surface surface-glow card fade-in-up">
      <img src="${wizard.img}" alt="${wizard.name} portrait" loading="lazy" width="480" height="320">
      <header>
        <h3>${wizard.name}</h3>
        <span class="house-badge" data-house="${wizard.house}">${wizard.house}</span>
      </header>
      ${spoilerGate}
      <button class="button button-ghost" type="button" data-action="view-wizard" data-id="${wizard.id}">
        View Details
      </button>
    </article>
  `;
}

function renderTimelineItem(event, { showSpoilers }) {
  const isHidden = event.spoilerLevel === "high" && !showSpoilers;
  const relatedButtons = event.related
    .map((item) => {
      const label =
        item.type === "wizard"
          ? wizardLookup.get(item.id)?.name ?? "Wizard"
          : houseLookup.get(item.id)?.name ?? "House";
      return `<button class="button button-outline" data-action="open-modal" data-type="${item.type}" data-id="${item.id}" type="button">
          ${label}
        </button>`;
    })
    .join("");

  return `
    <div class="timeline-item fade-in-up">
      <span class="timeline-marker" aria-hidden="true"></span>
      <div class="surface surface-glow timeline-card">
        <h4>${event.title}</h4>
        ${
          isHidden
            ? `<p class="visually-muted">Details hidden to avoid spoilers. Enable the toggle to reveal the full story.</p>`
            : `<p>${event.summary}</p>`
        }
        <div class="timeline-actions">${relatedButtons}</div>
      </div>
    </div>
  `;
}

function truncate(text, wordCount) {
  const words = text.split(/\s+/);
  if (words.length <= wordCount) return text;
  return `${words.slice(0, wordCount).join(" ")}…`;
}

function createModalInstance() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `
    <div class="modal-content" role="document">
      <button type="button" class="modal-close" aria-label="Close dialog">
        <span aria-hidden="true">&times;</span>
      </button>
      <div class="modal-body"></div>
    </div>
  `;

  document.body.appendChild(modal);
  const body = modal.querySelector(".modal-body");
  const closeBtn = modal.querySelector(".modal-close");
  let lastFocused;

  const close = () => {
    modal.classList.remove("is-visible");
    document.body.classList.remove("modal-open");
    setTimeout(() => {
      modal.setAttribute("aria-hidden", "true");
      body.innerHTML = "";
      if (lastFocused) lastFocused.focus();
    }, 180);
    document.removeEventListener("keydown", onKeyDown);
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      trapFocus(modal, event);
    }
  };

  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      close();
    }
  });

  return {
    open(content, label) {
      lastFocused = document.activeElement;
      body.innerHTML = content;
      modal.setAttribute("aria-hidden", "false");
      modal.setAttribute("aria-label", label);
      modal.classList.add("is-visible");
      document.body.classList.add("modal-open");
      document.addEventListener("keydown", onKeyDown);
      requestAnimationFrame(() => {
        closeBtn.focus();
      });
    }
  };
}

function openModal({ type, payload }) {
  if (!modalInstance) {
    modalInstance = createModalInstance();
  }
  let content = "";
  let label = "";
  if (type === "house") {
    content = buildHouseModal(payload);
    label = `${payload.name} house details`;
  } else if (type === "wizard") {
    content = buildWizardModal(payload);
    label = `${payload.name} profile`;
  }
  modalInstance.open(content, label);
}

function buildHouseModal(house) {
  return `
    <header>
      <h2>${house.name}</h2>
      <p>${house.summary}</p>
    </header>
    <section>
      <ul class="meta-list">
        <li><strong>Founder:</strong> ${house.founder}</li>
        <li><strong>Mascot:</strong> ${house.mascot}</li>
        <li><strong>Relic:</strong> ${house.relic}</li>
        <li><strong>House Ghost:</strong> ${house.ghost}</li>
      </ul>
    </section>
    <section>
      <h3>Traits</h3>
      <div class="list-inline">
        ${house.traits.map((trait) => `<li>${trait}</li>`).join("")}
      </div>
      <div class="house-colors" aria-label="House colors">
        ${house.colors
          .map(
            (color) =>
              `<span class="house-color-swatch" style="background:${colorLookup[color] ?? "#8ab4f8"}" title="${color}"></span>`
          )
          .join("")}
      </div>
    </section>
  `;
}

function buildWizardModal(wizard) {
  return `
    <header>
      <h2>${wizard.name}</h2>
      <div class="house-badge" data-house="${wizard.house}">${wizard.house}</div>
    </header>
    <section>
      <h3>Biography</h3>
      <p>${wizard.summary}</p>
    </section>
    <section>
      <h3>Aliases</h3>
      <div class="list-inline">
        ${wizard.aliases.map((alias) => `<li>${alias}</li>`).join("")}
      </div>
    </section>
    <section>
      <h3>Notable Events</h3>
      <ul class="meta-list">
        ${wizard.notableEvents.map((event) => `<li>${event}</li>`).join("")}
      </ul>
    </section>
    <section>
      <h3>School Years</h3>
      <p>${wizard.years.join(", ")}</p>
    </section>
  `;
}

function trapFocus(container, event) {
  const focusable = container.querySelectorAll(focusableSelector);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === first) {
      last.focus();
      event.preventDefault();
    }
  } else if (document.activeElement === last) {
    first.focus();
    event.preventDefault();
  }
}
