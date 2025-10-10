async function injectPartials() {
  const nodes = document.querySelectorAll("[data-include]");
  await Promise.all(Array.from(nodes).map(async el => {
    const url = el.getAttribute("data-include");
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(url + " " + res.status);
      el.innerHTML = await res.text();
    } catch (e) {
      console.error("Include failed:", e);
      el.innerHTML = "<!-- include failed: " + url + " -->";
    }
  }));
}

function highlightActiveNav() {
  // Determine current section by path
  const path = location.pathname.replace(/\/+$/, "");
  const map = [
    { key: "timeline", match: /\/timeline\.html$/ },
    { key: "about",    match: /\/about\.html$/ },
    { key: "blog",     match: /\/blog\.html$/ },
    { key: "home",     match: /(\/|\/index\.html)$/ }
  ];

  const found = map.find(m => m.match.test(path));
  const activeKey = found?.key;

  // Apply to any injected header on the page
  document.querySelectorAll(".navlink").forEach(a => {
    if (activeKey && a.dataset.nav === activeKey) {
      a.classList.add("navlink--active");
      a.setAttribute("aria-current", "page");
    } else if (!activeKey && a.getAttribute("href")?.endsWith("/index.html")) {
      a.classList.add("navlink--active");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await injectPartials();
  highlightActiveNav();
});