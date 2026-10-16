/* ==========================================================
   Portfolio-hero: wisselen tussen Aldharvisio en Digital work
   Pijlen en bolletjes werken zoals de slider op de home page.
   Alles met data-hero-pagina="0" hoort bij Digital work (eerst),
   "1" bij Aldharvisio; ze liggen op elkaar en schuiven vloeiend opzij.
   ========================================================== */

document.querySelectorAll("[data-hero-wissel]").forEach((hero) => {
  const opties = [...hero.querySelectorAll("[data-hero-pagina]")];
  const namen = ["Digital work", "Aldharvisio"];   // eerst Digital work
  const vorige = hero.querySelector("[data-hero-vorige]");
  const volgende = hero.querySelector("[data-hero-volgende]");
  const bolletjesVak = hero.querySelector("[data-hero-bolletjes]");
  let huidige = 0;

  const bolletjes = namen.map((naam, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Toon ${naam}`);
    b.addEventListener("click", () => toon(i));
    bolletjesVak.appendChild(b);
    return b;
  });

  function toon(index) {
    huidige = Math.max(0, Math.min(index, namen.length - 1));
    opties.forEach((optie) => {
      const nr = Number(optie.dataset.heroPagina);
      optie.classList.toggle("actief", nr === huidige);
      optie.classList.toggle("links", nr < huidige);
      optie.classList.toggle("rechts", nr > huidige);
      optie.setAttribute("aria-hidden", nr !== huidige);
    });
    bolletjes.forEach((b, i) => b.classList.toggle("actief", i === huidige));
    // inhoud onder de hero wisselt mee (vervaagt zacht in)
    document.querySelectorAll("[data-hero-paneel]").forEach((paneel) => {
      paneel.hidden = Number(paneel.dataset.heroPaneel) !== huidige;
    });
    // onthoud de keuze in de link, zodat "Back to Aldharvisio" hier terugkomt
    history.replaceState(null, "", huidige === 1 ? "#aldharvisio" : location.pathname + location.search);
    vorige.hidden = huidige === 0;
    volgende.hidden = huidige === namen.length - 1;
  }

  vorige.addEventListener("click", () => toon(huidige - 1));
  volgende.addEventListener("click", () => toon(huidige + 1));
  toon(location.hash === "#aldharvisio" ? 1 : 0);
});
