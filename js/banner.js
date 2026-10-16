/* ==========================================================
   About: banner-wissel
   1. De zwarte sectie komt in beeld: banner bovenaan, de
      ervaring (Sales Assistant, Fashion Intern) eronder.
   2. Het blok blijft even staan zodat je de tekst kunt lezen.
   3. Scroll je verder, dan schuift de banner naar onder, de
      ervaring verdwijnt en de volgende tekst verschijnt erboven.
   4. Daarna scrol je gewoon verder naar de iconen.
   Op smalle schermen of met 'minder beweging' staat alles
   gewoon onder elkaar.
   ========================================================== */

const wisselSectie = document.querySelector(".about-ervaring");
const pin = document.querySelector(".ervaring-pin");
const podium = pin?.querySelector(".ervaring-podium");
const banner = pin?.querySelector(".ervaring-banner");
const laagA = pin?.querySelector(".ervaring-laag--a");
const laagB = pin?.querySelector(".ervaring-laag--b");
const rustig = window.matchMedia("(prefers-reduced-motion: reduce)");
const breed = window.matchMedia("(min-width: 800px)");

if (pin && banner && laagA && laagB) {
  let maat = null;
  let gepland = false;

  const zacht = (t) => t * t * (3 - 2 * t);               // vloeiend begin en einde
  const tussen = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));

  function wis() {
    [banner, laagA, laagB].forEach((el) => { el.style.transform = ""; el.style.opacity = ""; });
    pin.style.height = "";
  }

  function meet() {
    wis();
    const aan = breed.matches && !rustig.matches;
    wisselSectie.classList.toggle("banner-wissel-aan", aan);
    if (!aan) { maat = null; return; }
    const kop = podium.getBoundingClientRect().top - pin.getBoundingClientRect().top; // 0
    const podiumH = podium.offsetHeight;
    const afstand = Math.round(innerHeight * 1.7);           // zo lang blijft het blok staan
    pin.style.height = podiumH + afstand + "px";
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-hoogte")) || 0;
    maat = {
      start: pin.getBoundingClientRect().top + scrollY - header + kop,
      afstand,
      bannerWeg: podiumH - banner.offsetHeight,               // van boven naar onder
    };
    teken();
  }

  function teken() {
    gepland = false;
    if (!maat) return;
    const p = tussen(scrollY - maat.start, 0, maat.afstand);
    // eerst stilstaan (lezen), dan wisselen, op het einde nog even stil
    const e = zacht(tussen(p, 0.3, 0.8));
    banner.style.transform = `translateY(${maat.bannerWeg * e}px)`;
    const weg = tussen(e, 0, 0.55);                           // ervaring verdwijnt
    laagA.style.opacity = 1 - weg;
    laagA.style.transform = `translateY(${-40 * weg}px)`;
    const erbij = zacht(tussen(e, 0.45, 1));                  // volgende tekst verschijnt
    laagB.style.opacity = erbij;
    laagB.style.transform = `translateY(${40 * (1 - erbij)}px)`;
  }

  function plan() {
    if (!gepland) { gepland = true; requestAnimationFrame(teken); }
  }

  addEventListener("scroll", plan, { passive: true });
  addEventListener("resize", meet);
  addEventListener("load", meet);
  meet();
}
