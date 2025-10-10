(function () {
  const DATA_URL = "./blog.json";
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const listEl = $("#blog-list");
  const postEl = $("#blog-post");
  const searchEl = $("#blog-search");
  const tagCloudEl = $("#tag-cloud");
  const clearBtn = $("#clear-blog-filter");

  let posts = [];
  let activeTag = null;
  let q = "";

  function fmtDate(d) {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function badges(tags) {
    const wrap = document.createElement("div");
    tags.forEach(t => {
      const span = document.createElement("span");
      span.className = "badge badge-light tag-chip";
      span.textContent = t;
      span.tabIndex = 0;
      span.addEventListener("click", () => setTag(t));
      span.addEventListener("keypress", (e) => e.key === "Enter" && setTag(t));
      wrap.appendChild(span);
    });
    return wrap;
  }

  function listItem(p) {
    const art = document.createElement("article");
    art.className = "blog-item";
    art.innerHTML = `
      <div class="bi-head">
        <h2 class="bi-title"><a class="bi-link" href="./blog.html?post=${encodeURIComponent(p.id)}">${p.title}</a></h2>
        <time class="bi-date">${fmtDate(p.date)}</time>
      </div>
      ${p.cover ? `<img class="bi-cover" src="${p.cover}" alt="">` : ""}
      <p class="bi-excerpt" title="${p.excerpt.replace(/"/g,'&quot;')}">${p.excerpt}</p>
    `;
    art.appendChild(badges(p.tags || []));
    return art;
  }

  function renderList() {
    const filtered = posts.filter(p => {
      const inTag = !activeTag || (p.tags || []).includes(activeTag);
      const inQ = !q || (p.title.toLowerCase().includes(q) || (p.tags||[]).join(" ").toLowerCase().includes(q));
      return inTag && inQ;
    });

    listEl.innerHTML = "";
    postEl.classList.add("d-none");
    listEl.classList.remove("d-none");

    if (!filtered.length) {
      listEl.innerHTML = `<p class="text-muted">No posts found.</p>`;
      return;
    }
    filtered
      .sort((a,b) => (a.date < b.date ? 1 : -1))
      .forEach(p => listEl.appendChild(listItem(p)));

    // center if 1 or 2 items
    listEl.classList.toggle("centered", filtered.length <= 2);
  }

  function renderPost(id) {
    const p = posts.find(x => x.id === id);
    if (!p) { history.replaceState(null, "", "./blog.html"); renderList(); return; }

    listEl.classList.add("d-none");
    postEl.classList.remove("d-none");

    postEl.innerHTML = `
      <h1 class="post-title">${p.title}</h1>
      <div class="post-meta"><time>${fmtDate(p.date)}</time> · ${(p.tags||[]).join(", ")}</div>
      ${p.cover ? `<img class="post-cover" src="${p.cover}" alt="">` : ""}
      <div class="post-body">${(p.contentHtml||[]).join("")}</div>
      <a href="./blog.html" class="btn btn-link mt-3">&larr; Back to all posts</a>
    `;
  }

  function buildTagCloud() {
    const tagCounts = {};
    posts.forEach(p => (p.tags||[]).forEach(t => tagCounts[t] = (tagCounts[t]||0)+1));
    tagCloudEl.innerHTML = "";
    Object.entries(tagCounts)
      .sort((a,b)=> b[1]-a[1])
      .forEach(([t,c])=>{
        const span = document.createElement("span");
        span.className = "badge badge-secondary tag-chip mr-1 mb-1";
        span.textContent = `${t}`;
        span.title = `${c} post${c>1?"s":""}`;
        span.addEventListener("click", ()=> setTag(t));
        tagCloudEl.appendChild(span);
      });
  }

  function setTag(tag) {
    activeTag = tag;
    clearBtn.classList.remove("d-none");
    renderList();
  }
  function clearTag() {
    activeTag = null;
    clearBtn.classList.add("d-none");
    renderList();
  }

  function handleRoute() {
    const u = new URL(location.href);
    const id = u.searchParams.get("post");
    if (id) renderPost(id); else renderList();
  }

  function loadInlineJSON() {
    const node = document.getElementById("blog-data");
    if (!node) return null;
    try { return JSON.parse(node.textContent.trim()); } catch { return null; }
  }

  async function init() {
    clearBtn.addEventListener("click", clearTag);
    searchEl.addEventListener("input", (e)=> { q = e.target.value.trim().toLowerCase(); renderList(); });

    // Load data
    const inline = loadInlineJSON();
    if (Array.isArray(inline)) { posts = inline; buildTagCloud(); handleRoute(); return; }

    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      posts = await res.json();
      buildTagCloud();
      handleRoute();
    } catch (e) {
      console.error(e);
      listEl.innerHTML = `<div class="alert alert-warning">Couldn’t load blog.json. If you’re on file://, run a local server or use inline JSON.</div>`;
    }

    window.addEventListener("popstate", handleRoute);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
