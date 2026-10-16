/* ==========================================================
   Speelse effecten voor het project Chris Schoenherstel
   Geladen op project-chris-schoenherstel.html (en project-yakskusha.html voor de kleurstrepen).
   - [data-cs-teller]: leeftijden tellen op van 0 als ze in beeld komen.
   - .cs-kleur: klik = hexcode kopiëren.
   - [data-cs-gewicht]: de grote "Aa" volgt de muis van Light naar Extra Bold.
   - [data-cs-flip]: klik draait het visitekaartje om.
   ========================================================== */

(() => {
  const zonderBeweging = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- leeftijden laten optellen ----
  const tellers = document.querySelectorAll("[data-cs-teller]");
  if (tellers.length && !zonderBeweging && "IntersectionObserver" in window) {
    const tel = (el) => {
      const doel = +el.dataset.csTeller;
      const start = performance.now();
      const duur = 1400;
      const stap = (nu) => {
        const t = Math.min(1, (nu - start) / duur);
        el.textContent = Math.round(doel * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(stap);
      };
      el.textContent = "0";
      requestAnimationFrame(stap);
    };
    const kijker = new IntersectionObserver((items) => {
      items.forEach((item) => {
        if (!item.isIntersecting) return;
        tel(item.target);
        kijker.unobserve(item.target);
      });
    }, { threshold: 0.6 });
    tellers.forEach((el) => kijker.observe(el));
  }

  // ---- kleur kopiëren ----
  document.querySelectorAll(".cs-kleur").forEach((knop) => {
    knop.addEventListener("click", () => {
      const hex = knop.dataset.hex;
      const klaar = () => {
        knop.classList.add("gekopieerd");
        setTimeout(() => knop.classList.remove("gekopieerd"), 1200);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(hex).then(klaar, klaar);
      else klaar();
    });
  });

  // ---- de grote Aa volgt de muis: links dun, rechts extra vet ----
  document.querySelectorAll("[data-cs-gewicht]").forEach((vak) => {
    const aa = vak.querySelector(".cs-aa");
    if (!aa) return;
    vak.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = vak.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      aa.classList.add("cs-volgt");
      aa.style.fontWeight = Math.round(300 + t * 500);
    });
    vak.addEventListener("pointerleave", () => {
      aa.classList.remove("cs-volgt");
      aa.style.fontWeight = "";
    });
  });

  // ---- visitekaartje omdraaien ----
  document.querySelectorAll("[data-cs-flip]").forEach((knop) => {
    knop.addEventListener("click", () => knop.classList.toggle("om"));
  });
})();
