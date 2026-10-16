/* ==========================================================
   Verschijn-effect bij het scrollen
   Elke [data-verschijn-groep] die in beeld komt, laat zijn
   [data-verschijn]-onderdelen vervagend omhoog verschijnen
   (met hun eigen --vertraging). Gebeurt één keer per bezoek,
   behalve bij data-verschijn-groep="herhaal" (dan elke keer opnieuw).
   ========================================================== */

(() => {
  const zonderBeweging = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (zonderBeweging || !("IntersectionObserver" in window)) return;

  const html = document.documentElement;
  // meteen verbergen zonder zichtbaar weg te vagen
  html.classList.add("verschijn-stil", "verschijn-aan");
  html.offsetWidth;
  html.classList.remove("verschijn-stil");

  const kijker = new IntersectionObserver(
    (items) => {
      items.forEach((item) => {
        const delen = item.target.querySelectorAll("[data-verschijn]");
        // data-verschijn-groep="herhaal": bij het terugscrollen weer verdwijnen
        // en bij het opnieuw in beeld komen weer verschijnen
        const herhaal = item.target.dataset.verschijnGroep === "herhaal";
        if (!item.isIntersecting) {
          if (herhaal) delen.forEach((el) => el.classList.remove("in-beeld"));
          return;
        }
        if (item.intersectionRatio < 0.2) return;   // pas verschijnen als 20% in beeld is
        delen.forEach((el) => el.classList.add("in-beeld"));
        if (!herhaal) kijker.unobserve(item.target);
      });
    },
    { threshold: [0, 0.2] }
  );

  document.querySelectorAll("[data-verschijn-groep]").forEach((groep) => kijker.observe(groep));
})();
