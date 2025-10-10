(function () {
  const GRID_ID = "project-grid";
  const FILTER_LABEL_ID = "filter-label";
  const ACTIVE_TAG_ID = "active-tag";
  const CLEAR_BTN_ID = "clear-filter";
  const DATA_URL = "./projects.json";

  let activeTag = null;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function el(tag, classes = [], attrs = {}) {
    const n = document.createElement(tag);
    if (classes.length) n.className = classes.join(" ");
    for (const [k, v] of Object.entries(attrs)) if (v != null) n.setAttribute(k, v);
    return n;
  }

  function tagChip(text) {
    const chip = el("span", ["badge", "badge-secondary", "tag-chip"], {
      "data-tag": text, role: "button", tabindex: "0", title: `Filter by: ${text}`
    });
    chip.textContent = text;
    chip.addEventListener("click", () => setFilter(text));
    chip.addEventListener("keypress", (e) => e.key === "Enter" && setFilter(text));
    return chip;
  }

  function buildCard(p) {
    const col = el("div", ["col-md-4", "col-sm-6", "col-12", "p-2"]);
    col.dataset.tags = JSON.stringify(p.tags || []);

    const card = el("div", ["card", "card-ac", "p-2", "h-100"]);

    const img = el("img", ["card-img-top", "pic-ac"], {
      src: p.image || "", alt: p.alt || p.title || "Project image", loading: "lazy"
    });

    const body = el("div", ["card-body", "px-2", "py-3"]);

    const h3 = el("h3"); h3.textContent = p.title || "Untitled";

    const primary = p.primary?.href
      ? (() => {
          const a = el("a", ["primary-link"], { href: p.primary.href, target: "_blank", rel: "noopener" });
          a.textContent = p.primary.label || p.primary.href;
          return a;
        })()
      : null;

    const desc = el("p", ["desc"], { title: p.description || "" });
    desc.textContent = p.description || "";

    const tagWrap = el("div", ["mt-2"]);
    (p.tags || []).forEach(t => tagWrap.appendChild(tagChip(t)));

    body.append(h3);
    if (primary) body.appendChild(primary);
    body.append(desc, tagWrap);

    card.append(img, body);
    col.appendChild(card);
    return col;
  }

  function render(list) {
    const grid = $("#" + GRID_ID);
    grid.innerHTML = "";
    list.forEach(p => grid.appendChild(buildCard(p)));
    applyFilter(); // in case a filter is active on reload
  }

  function setFilter(tag) {
    activeTag = tag;
    updateFilterBar();
    applyFilter();
  }

  function clearFilter() {
    activeTag = null;
    updateFilterBar();
    applyFilter();
  }

  function updateFilterBar() {
    const label = $("#" + FILTER_LABEL_ID);
    const badge = $("#" + ACTIVE_TAG_ID);
    const clearBtn = $("#" + CLEAR_BTN_ID);

    if (activeTag) {
      label.classList.remove("d-none");
      badge.classList.remove("d-none");
      clearBtn.classList.remove("d-none");
      badge.textContent = activeTag;
      clearBtn.onclick = clearFilter;
    } else {
      label.classList.add("d-none");
      badge.classList.add("d-none");
      clearBtn.classList.add("d-none");
    }
  }

  function applyFilter() {
    const cards = $$("#" + GRID_ID + " > div");
    if (!activeTag) { cards.forEach(c => c.classList.remove("d-none")); return; }
    cards.forEach(c => {
      const tags = JSON.parse(c.dataset.tags || "[]");
      c.classList.toggle("d-none", !tags.includes(activeTag));
    });
  }

  function loadInlineJSON() {
    const node = $("#project-data");
    if (!node) return null;
    try { return JSON.parse(node.textContent.trim()); } catch { return null; }
  }

  async function init() {
    updateFilterBar();
    const inline = loadInlineJSON();
    if (Array.isArray(inline)) { render(inline); return; }

    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("projects.json must be an array");
      render(data);
    } catch (e) {
      console.error(e);
      const grid = $("#" + GRID_ID);
      const alert = el("div", ["alert", "alert-warning", "w-100"], { role: "alert" });
      const reason = location.protocol === "file:" ?
        "Your browser blocked fetch() from local files. Run a local server or use the inline JSON fallback." :
        "Couldn’t load projects.json (check path/filename and hosting).";
      alert.textContent = reason;
      grid.innerHTML = "";
      grid.appendChild(alert);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
