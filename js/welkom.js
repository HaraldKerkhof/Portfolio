/* ==========================================================
   Welkomstkader op de Portfolio-pagina
   Verschijnt bij het openen van de pagina en legt uit dat je met
   de pijl in de hero wisselt tussen Digital work en Aldharvisio.
   Sluiten: de knop, naast het kader klikken of Escape.
   Komt niet terug als je van een detailpagina terugkeert.
   ========================================================== */

(() => {
  const welkom = document.querySelector(".welkom");
  if (!welkom) return;
  const knop = welkom.querySelector("[data-welkom-sluit]");

  // Niet tonen als je terugkomt van een detailpagina (terug-link of terug-knop
  // van de browser). Wel bij herladen en wanneer je de pagina gewoon opent.
  const soort = (performance.getEntriesByType("navigation")[0] || {}).type;
  const vanDetail = /\/project-[^/]*\.html/.test(document.referrer);
  if (soort === "back_forward" || (soort !== "reload" && vanDetail)) return;
  if (document.documentElement.dataset.terug !== undefined) return;   // gezet door js/terugkeer.js

  function sluit() {
    welkom.classList.remove("open");
    document.documentElement.classList.remove("welkom-open");
    setTimeout(() => (welkom.hidden = true), 400);   // na het wegvagen
  }

  welkom.hidden = false;
  document.documentElement.classList.add("welkom-open");
  requestAnimationFrame(() => requestAnimationFrame(() => welkom.classList.add("open")));

  knop.addEventListener("click", sluit);
  welkom.addEventListener("click", (e) => { if (e.target === welkom) sluit(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !welkom.hidden) sluit(); });
})();
