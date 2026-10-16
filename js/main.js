/* ==========================================================
   Gedeelde header en footer
   Pas de menu-items of de footer hier aan: ze veranderen dan
   op alle pagina's tegelijk.
   ========================================================== */

const header = `
  <header class="site-header">
    <div class="container">
      <button class="menu-knop" aria-expanded="false" aria-controls="nav">Menu</button>
      <ul class="nav" id="nav">
        <li><a href="index.html" data-pagina="home">Home</a></li>
        <li><a href="portfolio.html" data-pagina="portfolio">Portfolio</a></li>
        <li><a href="about.html" data-pagina="about">About me</a></li>
        <li><a href="contact.html" data-pagina="contact">Contact</a></li>
      </ul>
      <a class="logo" href="index.html" aria-label="Home">
        <img src="assets/images/logo/logo-hk-rood.png" alt="Logo Harald Kerkhof">
      </a>
    </div>
    <div class="scroll-balk" aria-hidden="true"></div>
  </header>
`;

const footer = `
  <footer class="site-footer" data-verschijn-groep>
    <div class="container">
      <div class="footer-boven" data-verschijn>
        <div>
          <p class="footer-titel">Let's work together!</p>
          <p>Open to internship opportunities</p>
        </div>
        <div class="footer-knoppen">
          <a class="knop" href="contact.html">Contact</a>
          <a class="knop knop--rand" href="about.html">About me</a>
        </div>
      </div>
      <p class="footer-locatie" data-verschijn style="--vertraging:.2s">Based in Gent and Kortrijk</p>
      <p class="copyright" data-verschijn style="--vertraging:.35s">&copy; ${new Date().getFullYear()} Harald Kerkhof</p>
    </div>
  </footer>
`;

document.getElementById("site-header")?.insertAdjacentHTML("afterbegin", header);
document.getElementById("site-footer")?.insertAdjacentHTML("afterbegin", footer);

// Actieve pagina in het menu kleuren (zet data-pagina op <body>)
const huidigePagina = document.body.dataset.pagina;
document
  .querySelector(`.nav a[data-pagina="${huidigePagina}"]`)
  ?.classList.add("actief");

// Op de contactpagina zelf hoeft de Contact-knop in de footer niet
if (huidigePagina === "contact") {
  document.querySelector('.footer-knoppen a[href="contact.html"]')?.remove();
}

// Mobiel menu open/dicht
const menuKnop = document.querySelector(".menu-knop");
const nav = document.querySelector(".nav");
menuKnop?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuKnop.setAttribute("aria-expanded", open);
});

// Blauwe scroll-lijn onder de menubalk: groeit van 0 tot de volle breedte
const scrollBalk = document.querySelector(".scroll-balk");
function updateScrollBalk() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const deel = max > 0 ? window.scrollY / max : 0;
  scrollBalk.style.transform = `scaleX(${Math.min(1, deel)})`;
}
if (scrollBalk) {
  window.addEventListener("scroll", updateScrollBalk, { passive: true });
  window.addEventListener("resize", updateScrollBalk);
  updateScrollBalk();
}
