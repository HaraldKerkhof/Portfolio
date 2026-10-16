/* ==========================================================
   Slider op de home page: Aldharvisio <-> Digital work
   Elke .slider-pagina heeft data-titel en data-link.
   Bij het wisselen schuiven de beelden, de titel in de zwarte strook
   en de tekst tegelijk en even soepel opzij; de knop-link wisselt mee.
   ========================================================== */

document.querySelectorAll("[data-slider-sectie]").forEach((sectie) => {
  const baan = sectie.querySelector(".slider-baan");
  const paginas = [...sectie.querySelectorAll(".slider-pagina")];
  const vorige = sectie.querySelector("[data-vorige]");
  const volgende = sectie.querySelector("[data-volgende]");
  const bolletjesVak = sectie.querySelector("[data-bolletjes]");
  const knop = sectie.querySelector("[data-slider-knop]");
  // titel (in de zwarte strook) en tekst: elk heeft één .wissel-optie per pagina
  const opties = [...document.querySelectorAll(".wissel-optie[data-pagina]")];
  let huidige = 0;

  // één bolletje per pagina
  const bolletjes = paginas.map((pagina, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Ga naar ${pagina.dataset.titel}`);
    b.addEventListener("click", () => toon(i));
    bolletjesVak.appendChild(b);
    return b;
  });

  function toon(index) {
    huidige = Math.max(0, Math.min(index, paginas.length - 1));

    // beelden, titel en tekst bewegen tegelijk en even lang
    baan.style.transform = `translateX(-${huidige * 100}%)`;
    opties.forEach((optie) => {
      const nr = Number(optie.dataset.pagina);
      optie.classList.toggle("actief", nr === huidige);
      optie.classList.toggle("links", nr < huidige);   // vorige pagina's liggen links
      optie.classList.toggle("rechts", nr > huidige);  // volgende pagina's liggen rechts
      optie.setAttribute("aria-hidden", nr !== huidige);
    });

    if (knop) knop.href = paginas[huidige].dataset.link;
    bolletjes.forEach((b, i) => b.classList.toggle("actief", i === huidige));
    vorige.hidden = huidige === 0;
    volgende.hidden = huidige === paginas.length - 1;
  }

  vorige.addEventListener("click", () => toon(huidige - 1));
  volgende.addEventListener("click", () => toon(huidige + 1));
  toon(0);
});

/* ==========================================================
   Verschijn-effect: zodra het werk-scherm voor een deel in beeld
   komt, verschijnen de beelden één voor één en schuift de tekst
   vervagend omhoog. Gebeurt één keer per bezoek.
   ========================================================== */
const zonderBeweging = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".werk-scherm").forEach((scherm) => {
  if (zonderBeweging || !("IntersectionObserver" in window)) return;
  // meteen verbergen, zonder dat je het ziet wegvagen
  scherm.classList.add("stil", "anim", "onthullen");
  scherm.offsetWidth;
  scherm.classList.remove("stil");

  const kijker = new IntersectionObserver(
    (items) => {
      if (!items[0].isIntersecting) return;
      scherm.classList.add("in-beeld");
      kijker.disconnect();
      // vertragingen weghalen als alles er staat, zodat hover en wisselen meteen reageren
      setTimeout(() => scherm.classList.remove("onthullen"), 2200);
    },
    { threshold: 0.35 }
  );
  kijker.observe(scherm);
});
