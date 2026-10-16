/* ==========================================================
   Foto vergroten op de detailpagina's
   Klik op een werk: het komt draaiend tevoorschijn, groot over
   het scherm op een donkere, doorschijnende achtergrond.
   Sluiten: klik ergens, het kruisje of Escape.
   Werkt op project-detail-art.html, project-eurobiljetten.html,
   project-vivienne-westwood.html, project-the-marias-nobody-new.html
   project-chris-schoenherstel.html, project-yakskusha.html en
   project-egypte-website.html.
   ========================================================== */

(() => {
  const fotos = document.querySelectorAll(".echo-beeld img, .dw-reeks img, .dw-biljet-beelden img, .vw-foto img, .vw-intro-beelden img, .mn-frame img, .mn-moodboard-beeld img, .cs-zoom img, .yak-zoom img, .egy-zoom img");
  if (!fotos.length) return;

  const laag = document.createElement("div");
  laag.className = "vergroot";
  laag.hidden = true;
  laag.innerHTML = '<img class="vergroot-foto" alt=""><button class="vergroot-sluit" type="button" aria-label="Close">&times;</button>';
  document.body.appendChild(laag);
  const groot = laag.querySelector(".vergroot-foto");

  const open = (foto) => {
    groot.src = foto.currentSrc || foto.src;
    groot.alt = foto.alt;
    laag.hidden = false;
    laag.offsetWidth;                         // eerst tekenen, dan pas het effect starten
    laag.classList.add("open");
    document.documentElement.classList.add("vergroot-aan");
  };

  const sluit = () => {
    if (laag.hidden || !laag.classList.contains("open")) return;
    laag.classList.remove("open");
    document.documentElement.classList.remove("vergroot-aan");
    setTimeout(() => { if (!laag.classList.contains("open")) laag.hidden = true; }, 450);
  };

  fotos.forEach((foto) => {
    foto.classList.add("vergrootbaar");
    foto.addEventListener("click", () => open(foto));
  });
  laag.addEventListener("click", sluit);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") sluit(); });
  // niet de pagina laten scrollen zolang de foto open staat (ook niet via glad-scrollen.js)
  laag.addEventListener("wheel", (e) => { e.preventDefault(); e.stopPropagation(); }, { passive: false });
})();
