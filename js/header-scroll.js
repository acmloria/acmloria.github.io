(function () {
  const header = document.querySelector('.header');
  if (!header) return;

  const root = document.documentElement;
  let ticking = false;

  function updateHeaderHeight() {
    root.style.setProperty('--header-current-height', header.offsetHeight + 'px');
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrolled = window.scrollY > 12;
      header.classList.toggle('header--scrolled', scrolled);
      updateHeaderHeight();
      ticking = false;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    onScroll();
    updateHeaderHeight();
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateHeaderHeight);
})();
