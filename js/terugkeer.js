/* ==========================================================
   Terugkomen op de Portfolio-pagina
   Geladen op portfolio.html (vóór js/welkom.js) en op de detailpagina's.
   - Klik je op de portfolio-pagina op een werk of project, dan
     onthouden we waar je was.
   - Een detailpagina laat een briefje achter: "ik was op een detailpagina".
   - Kom je daarna terug op de portfolio-pagina (terug-link of terug-knop
     van de browser), dan sta je weer op dezelfde plek en blijft het
     welkomstkader weg. Herlaad je de portfolio-pagina zelf, dan begint
     hij gewoon bovenaan met het welkomstkader.
   Werkt ook zonder Live Server (file://), want het gebruikt geen referrer.
   ========================================================== */

(() => {
  const PLEK = "portfolio-plek";
  const DETAIL = "op-detailpagina";
  const lees = (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
  const zet = (k, v) => { try { v === null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch (e) {} };

  // ---- op een detailpagina: alleen het briefje achterlaten ----
  if (!document.querySelector(".welkom")) {
    zet(DETAIL, "1");
    return;
  }

  // ---- op de portfolio-pagina ----
  const soort = (performance.getEntriesByType("navigation")[0] || {}).type;
  const vanDetail = lees(DETAIL) === "1" && soort !== "reload";
  let plek = null;
  try { plek = JSON.parse(lees(PLEK)); } catch (e) {}
  zet(DETAIL, null);

  if (vanDetail) {
    document.documentElement.dataset.terug = "";      // welkom.js toont dan geen kader
    if (plek) {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      const ga = () => window.scrollTo({ top: plek.y, behavior: "instant" });
      ga();
      requestAnimationFrame(ga);
      addEventListener("load", ga, { once: true });
      setTimeout(ga, 300);                             // na het laden van lettertypes en beelden
    }
  } else {
    zet(PLEK, null);
  }

  // terug-knop van de browser met bewaarde pagina (bfcache): niets te doen,
  // maar zorg dat het briefje van de detailpagina weg is
  addEventListener("pageshow", (e) => { if (e.persisted) zet(DETAIL, null); });

  // bij het openen van een werk of project: plek onthouden
  document.addEventListener("click", (e) => {
    if (e.target.closest('a[href^="project-"]')) zet(PLEK, JSON.stringify({ y: scrollY }));
  });
})();
