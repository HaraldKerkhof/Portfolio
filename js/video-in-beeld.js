/* ==========================================================
   Video speelt vanzelf af (zonder geluid) zodra hij in beeld komt
   en pauzeert weer als je verder scrolt.
   Gebruikt voor <video data-speel-in-beeld> op de portfolio-pagina
   en de detailpagina van The Marías. De webversie van de clip heeft
   geen geluidsspoor (geen toestemming voor het liedje); het origineel
   in 05-digital-work blijft ongewijzigd.
   ========================================================== */

(() => {
  const videos = document.querySelectorAll("video[data-speel-in-beeld]");
  if (!videos.length) return;

  const kijker = new IntersectionObserver((items) => {
    items.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) { v.muted = true; v.play().catch(() => {}); }
      else v.pause();
    });
  }, { threshold: 0.5 });

  videos.forEach((v) => kijker.observe(v));
})();
