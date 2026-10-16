/* ==========================================================
   Nefertari Travel (project-egypte-website.html)
   1. Browservensters: de echte site staat in een iframe van 1440px
      breed en wordt verkleind tot de breedte van het venster.
   2. Beweeg over een venster en de pagina erin scrolt rustig naar
      beneden; ga eraf en hij schuift terug naar boven.
      (Werkt via Live Server of online, niet via file://.)
   3. Vijf bestemmingen: de vier foto's per plek wisselen om de beurt,
      net zoals op de site zelf.
   ========================================================== */

(() => {
  const zonderBeweging = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Vensters op schaal ---------- */
  const vensters = document.querySelectorAll(".egy-venster");
  const schaal = new ResizeObserver((items) => {
    items.forEach((item) => {
      item.target.closest(".egy-venster").style.setProperty("--schaal", item.contentRect.width / 1440);
    });
  });
  vensters.forEach((venster) => schaal.observe(venster.querySelector(".egy-scherm")));

  /* ---------- 2. Scrollen bij hover ---------- */
  const SNELHEID_OMLAAG = 650;    // pixels (in de site) per seconde
  const SNELHEID_OMHOOG = 4000;

  vensters.forEach((venster) => {
    const iframe = venster.querySelector("iframe");
    let richting = 0;
    let vorige = 0;
    let bezig = false;

    const pagina = () => {
      try { return iframe.contentDocument && iframe.contentDocument.scrollingElement; }
      catch (fout) { return null; }   // file:// of andere oorsprong: niet scrollen
    };

    const stap = (tijd) => {
      const el = pagina();
      if (!el || richting === 0) { bezig = false; return; }
      const dt = Math.min((tijd - vorige) / 1000, .05);
      vorige = tijd;
      const max = el.scrollHeight - el.clientHeight;
      const doel = el.scrollTop + richting * (richting > 0 ? SNELHEID_OMLAAG : SNELHEID_OMHOOG) * dt;
      el.scrollTo({ top: Math.max(0, Math.min(max, doel)), behavior: "instant" });   // de site zelf heeft scroll-behavior: smooth
      if ((richting > 0 && el.scrollTop >= max) || (richting < 0 && el.scrollTop <= 0)) { bezig = false; return; }
      requestAnimationFrame(stap);
    };

    const start = (r) => {
      richting = r;
      if (zonderBeweging) { const el = pagina(); if (el) el.scrollTo({ top: 0, behavior: "instant" }); return; }
      if (!bezig) { bezig = true; vorige = performance.now(); requestAnimationFrame(stap); }
    };

    venster.addEventListener("mouseenter", () => start(1));
    venster.addEventListener("mouseleave", () => start(-1));
  });

  /* ---------- 3. Wisselende foto's per bestemming ---------- */
  if (zonderBeweging) return;
  document.querySelectorAll(".egy-wissel").forEach((wissel, nr) => {
    const fotos = wissel.querySelectorAll("img");
    if (fotos.length < 2) return;
    let huidige = 0;
    let klok = null;

    const volgende = () => {
      const nieuw = (huidige + 1) % fotos.length;
      if (!fotos[nieuw].complete) { fotos[nieuw].loading = "eager"; return; }   // nog niet geladen: volgende keer
      fotos[huidige].classList.remove("actief");
      huidige = nieuw;
      fotos[huidige].classList.add("actief");
    };

    // alleen wisselen als de foto in beeld is; elke plek start iets later
    new IntersectionObserver((items) => {
      items.forEach((item) => {
        clearTimeout(klok); clearInterval(klok);
        if (item.isIntersecting) {
          klok = setTimeout(() => { volgende(); klok = setInterval(volgende, 3500); }, 1500 + nr * 600);
        }
      });
    }).observe(wissel);
  });
})();
