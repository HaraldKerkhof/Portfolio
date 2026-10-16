/* ==========================================================
   Vloeiend scrollen
   Een muiswiel schuift de pagina niet meer in stapjes, maar
   glijdt vloeiend door en loopt zacht uit.
   Een trackpad (zoals op een MacBook) houdt zijn eigen vloeiende
   vaart (geen naloop, die voelt haperig), maar scrollt trager en
   kan niet te snel gaan.
   Scrollbalk, toetsenbord en links werken gewoon zoals altijd.
   Uit bij 'minder beweging' en op aanraakschermen.
   ZACHTHEID: kleiner = trager en zachter, groter = sneller.
   ========================================================== */

(() => {
  const ZACHTHEID = 0.09;
  const TRACKPAD_SNELHEID = 0.6;   // trackpad: 1 = normaal, kleiner = trager
  const TRACKPAD_MAX = 45;         // trackpad: hoogste stap per beweging (px)
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  let doel = scrollY;     // waar de pagina naartoe moet
  let nu = scrollY;       // waar de pagina nu is
  let bezig = false;

  const max = () => document.documentElement.scrollHeight - innerHeight;

  // mag dit element zelf scrollen (bv. een tekstvak)? dan niet ingrijpen
  function kanZelfScrollen(el, dy) {
    for (; el && el !== document.body; el = el.parentElement) {
      const stijl = getComputedStyle(el);
      if (!/(auto|scroll)/.test(stijl.overflowY) || el.scrollHeight <= el.clientHeight) continue;
      if (dy < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight) return true;
    }
    return false;
  }

  // trackpad herkennen: kleine of gebroken stapjes, of ook zijwaarts
  let trackpadTot = 0;
  function isTrackpad(e) {
    const t = performance.now();
    const klein = e.deltaMode === 0 && (Math.abs(e.deltaY) < 40 || !Number.isInteger(e.deltaY) || e.deltaX !== 0);
    if (klein) trackpadTot = t + 400;
    return t < trackpadTot;
  }

  addEventListener("wheel", (e) => {
    if (e.ctrlKey || e.defaultPrevented) return;                 // inzoomen met trackpad
    if (document.documentElement.classList.contains("welkom-open")) return;   // welkomstkader open: niet scrollen
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;        // horizontaal: gewoon laten
    if (kanZelfScrollen(e.target, e.deltaY)) return;
    if (isTrackpad(e)) {
      // trackpad: meteen meebewegen (geen naloop, dus geen haperen),
      // maar trager en met een maximum per stapje
      e.preventDefault();
      bezig = false;
      const dy = Math.max(-TRACKPAD_MAX, Math.min(TRACKPAD_MAX, e.deltaY * TRACKPAD_SNELHEID));
      window.scrollTo({ top: scrollY + dy, behavior: "instant" });
      doel = nu = scrollY;
      return;
    }
    e.preventDefault();
    const stap = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? innerHeight : 1;
    if (!bezig) nu = doel = scrollY;
    doel = Math.min(max(), Math.max(0, doel + e.deltaY * stap));
    if (!bezig) { bezig = true; requestAnimationFrame(stapje); }
  }, { passive: false });

  function stapje() {
    if (!bezig) return;                                          // onderbroken
    nu += (doel - nu) * ZACHTHEID;
    if (Math.abs(doel - nu) < 0.5) nu = doel;
    window.scrollTo({ top: nu, behavior: "instant" });
    if (nu !== doel) requestAnimationFrame(stapje);
    else bezig = false;
  }

  // ander scrollen (scrollbalk, toetsen, links): meteen overnemen
  addEventListener("keydown", () => { bezig = false; doel = nu = scrollY; });
  addEventListener("mousedown", () => { bezig = false; doel = nu = scrollY; });
})();
