/* ==========================================================
   ALDHARVISIO — Echo-reeks
   Eén lijst voor de galerij (aldharvisio.html) én de
   detailpagina (project-detail-art.html?echo=001).
   Nieuw werk toevoegen = één regel bijzetten.
   ========================================================== */

const A4 = "A4 (2480 × 3508 px)";
const A4_LIGGEND = "A4 landscape (3508 × 2480 px)";
const echos = [
  { id: "001", bestand: "echo-001.webp", formaat: A4 },
  { id: "002", bestand: "echo-002.webp", formaat: A4 },
  { id: "003", bestand: "echo-003.webp", formaat: A4 },
  { id: "004", bestand: "echo-004.webp", formaat: A4 },
  { id: "005", bestand: "echo-005.webp", formaat: A4 },
  { id: "006", bestand: "echo-006.webp", formaat: A4_LIGGEND },
  { id: "007", bestand: "echo-007.webp", formaat: A4 },
  { id: "009", bestand: "echo-009-zwart.webp", formaat: A4_LIGGEND },
  { id: "009-wit", bestand: "echo-009-wit.webp", formaat: A4_LIGGEND },
  { id: "010", bestand: "echo-010-v1.webp", formaat: "2221 × 3055 px" },
  { id: "010-v2", bestand: "echo-010-v2.webp", formaat: "2221 × 3055 px" },
  { id: "011", bestand: "echo-011.webp", formaat: A4 },
  { id: "012", bestand: "echo-012.webp", formaat: A4 },
  { id: "013", bestand: "echo-013.webp", formaat: A4 },
  { id: "014", bestand: "echo-014.webp", formaat: "1668 × 2420 px" },
];

const map = "assets/images/artwork/aldharvisio-echo/";
const titel = (echo) => `Echo // ${echo.id.replace("-", " ")}`;

// Galerij vullen
const galerij = document.getElementById("echo-galerij");
if (galerij) {
  galerij.innerHTML = echos
    .map(
      (echo) => `
      <a href="project-detail-art.html?echo=${echo.id}" data-naam="${titel(echo)}">
        <img src="${map}${echo.bestand}" alt="${titel(echo)}" loading="lazy">
      </a>`
    )
    .join("");
}

// Detailpagina vullen
const detail = document.getElementById("echo-detail");
if (detail) {
  const gevraagd = new URLSearchParams(location.search).get("echo") || "001";
  const echo = echos.find((e) => e.id === gevraagd) || echos[0];

  document.title = `${titel(echo)} — Harald Kerkhof`;
  document.querySelectorAll("[data-echo-titel]").forEach((el) => (el.textContent = titel(echo)));
  const beeld = document.getElementById("echo-beeld");
  beeld.src = map + echo.bestand;
  beeld.alt = titel(echo);
  document.querySelectorAll("[data-echo-formaat]").forEach((el) => (el.textContent = echo.formaat));
  // liggende werken krijgen een breed kader
  detail.classList.toggle("echo--liggend", echo.formaat === A4_LIGGEND);
}
