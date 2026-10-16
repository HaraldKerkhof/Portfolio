/* ==========================================================
   Muis als ster
   De ster volgt de muis. Elk stukje van de ster krijgt de kleur
   die past bij de achtergrond eronder: staat de ster half op wit
   en half op zwart, dan is hij half blauw en half rood.
     zwart        -> rood
     blauw / rood -> wit
     wit / grijs  -> blauw
   Een kleur forceren kan met data-muis="rood" | "blauw" | "wit".
   Alle afbeeldingen (artworks, foto's, iconen, hero-art) worden pixel
   per pixel bekeken: blauw op wit, wit op blauw, rood op zwart.
   Grote titels (bv. ABOUT, ME) tellen ook mee: op de letter zelf
   kijkt de ster naar de kleur van de letter.
   (werkt via Live Server; bij een los geopend bestand valt dit terug
   op de achtergrondkleur)
   ========================================================== */

(() => {
  // alleen op computers met een muis (niet op gsm of tablet)
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const KLEUR = { blauw: "#0088ff", rood: "#710000", wit: "#ffffff" };
  const MAAT = 32;                       // grootte van de ster in px
  const dpr = window.devicePixelRatio || 1;

  const canvas = document.createElement("canvas");
  canvas.className = "muis-ster weg";
  canvas.width = canvas.height = MAAT * dpr;
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  document.documentElement.classList.add("ster-muis");
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // stervorm met ronde hoeken, één keer getekend als "masker"
  const sterVorm = new Path2D(
    "M16 6 L18.7 12.3 L25.5 12.9 L20.4 17.4 L21.9 24.1 L16 20.6 L10.1 24.1 L11.6 17.4 L6.5 12.9 L13.3 12.3Z"
  );
  const masker = document.createElement("canvas");
  masker.width = masker.height = MAAT * dpr;
  const mctx = masker.getContext("2d");
  mctx.scale(dpr, dpr);
  mctx.lineJoin = "round";
  mctx.lineWidth = 4;
  mctx.fill(sterVorm);
  mctx.stroke(sterVorm);

  // vlakkleur -> sterkleur
  function kleurVoor(r, g, b) {
    if (r < 60 && g < 60 && b < 60) return "rood";                         // zwart
    if (b > 150 && b > r + 60 && b > g + 40) return "wit";                 // alle blauwtinten
    if (r > 60 && g < 40 && b < 40) return "wit";                          // (donker)rood: knoppen, iconen
    if (r > 200 && g > 80 && g < 140 && b < 60) return "wit";              // oranje (hover)
    return "blauw";                                                        // wit / grijs
  }
  function rgb(tekst) {
    const m = tekst.match(/[\d.]+/g);
    if (!m || (m.length === 4 && Number(m[3]) === 0)) return null;        // doorzichtig
    return m.slice(0, 3).map(Number);
  }

  // grote titels (40px of meer) één keer opzoeken, zodat niet elk punt gecontroleerd moet worden
  let titels = [];
  function zoekTitels() {
    titels = [...document.querySelectorAll("body *")].filter((el) =>
      el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.data.trim()) &&
      parseFloat(getComputedStyle(el).fontSize) >= 40);
  }
  window.addEventListener("load", zoekTitels);
  window.addEventListener("resize", zoekTitels);
  zoekTitels();

  // grote letter (titel) op dit punt? dan telt de kleur van die letter
  function letterOp(px, py) {
    let node, offset;
    if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(px, py);
      if (!pos) return null;
      node = pos.offsetNode; offset = pos.offset;
    } else if (document.caretRangeFromPoint) {
      const rng = document.caretRangeFromPoint(px, py);
      if (!rng) return null;
      node = rng.startContainer; offset = rng.startOffset;
    }
    if (!node || node.nodeType !== 3 || !node.parentElement) return null;
    const stijl = getComputedStyle(node.parentElement);
    if (parseFloat(stijl.fontSize) < 40) return null;                      // alleen grote titels
    const c = rgb(stijl.color);
    if (!c) return null;                                                   // omlijnde (doorzichtige) letters
    for (const i of [offset, offset - 1]) {
      if (i < 0 || i >= node.length) continue;
      const rng = document.createRange();
      rng.setStart(node, i); rng.setEnd(node, i + 1);
      const r = rng.getBoundingClientRect();
      if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom && node.data[i].trim()) {
        return { el: node.parentElement, rect: r, kleur: kleurVoor(...c), sleutel: node.parentElement.textContent + i + r.left };
      }
    }
    return null;
  }

  // bovenste laag met een eigen kleur op dit punt
  function laagOp(px, py) {
    let pixelBeeld = null;   // afbeelding die pixel per pixel bekeken wordt
    for (const e of document.elementsFromPoint(px, py)) {
      if (e === canvas) continue;
      if (e.dataset && e.dataset.muis) return { el: e, kleur: e.dataset.muis, voorrang: true };
      if (e.tagName === "IMG") { pixelBeeld = pixelBeeld || e; continue; }
      // vormen in een svg (bv. het Procreate-icoon): hun vulkleur telt
      if (e instanceof SVGGeometryElement) {
        const c = rgb(getComputedStyle(e).fill || "");
        if (c) return { el: e, kleur: kleurVoor(...c), pixelBeeld };
        continue;
      }
      // artwork met oranje hover-laag: ster wit
      if (e.matches(".slider-kaart:hover, .galerij a:hover, .ald-werk:hover")) return { el: e, kleur: "wit" };
      const c = rgb(getComputedStyle(e).backgroundColor);
      if (!c) continue;
      return { el: e, kleur: kleurVoor(...c), pixelBeeld };
    }
    return pixelBeeld ? { pixelBeeld } : null;
  }

  // volgorde om te schilderen: onderste lagen eerst
  function volgorde(a, b) {
    if (a.voorrang !== b.voorrang) return a.voorrang ? 1 : -1;
    if (!!a.rect !== !!b.rect) return a.rect ? 1 : -1;   // letters altijd bovenop
    if (a.el.contains(b.el)) return -1;
    if (b.el.contains(a.el)) return 1;
    return a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  }

  // pixelkleur -> sterkleur (r, g, b van de afbeelding)
  function sterKleurVoorPixel(r, g, b) {
    if (r < 60 && g < 60 && b < 60) return [0x71, 0x00, 0x00];        // zwart -> rood
    if (r > 170 && g > 170 && b > 170) return [0x00, 0x88, 0xff];     // wit / lichtgrijs -> blauw
    return [0xff, 0xff, 0xff];                                        // blauw, rood, kleur -> wit
  }

  const hulp = document.createElement("canvas");
  hulp.width = hulp.height = MAAT * dpr;
  const hctx = hulp.getContext("2d", { willReadFrequently: true });
  let pixelsMogelijk = true;

  // afbeelding onder de ster pixel per pixel inkleuren
  // waar staat het beeld zelf binnen het <img>-vak? (zonder rand en opvulling,
  // en rekening houdend met object-fit: contain / cover)
  function beeldVak(img) {
    const r = img.getBoundingClientRect();
    const st = getComputedStyle(img);
    const px = (v) => parseFloat(v) || 0;
    const binnen = {
      x: r.left + px(st.borderLeftWidth) + px(st.paddingLeft),
      y: r.top + px(st.borderTopWidth) + px(st.paddingTop),
    };
    binnen.w = r.right - px(st.borderRightWidth) - px(st.paddingRight) - binnen.x;
    binnen.h = r.bottom - px(st.borderBottomWidth) - px(st.paddingBottom) - binnen.y;
    let w = binnen.w, h = binnen.h;
    const fit = st.objectFit;
    if (fit === "contain" || fit === "cover" || fit === "scale-down") {
      const schaal = (fit === "cover" ? Math.max : Math.min)(binnen.w / img.naturalWidth, binnen.h / img.naturalHeight);
      w = img.naturalWidth * schaal; h = img.naturalHeight * schaal;
    }
    return { r, st, binnen, beeld: { x: binnen.x + (binnen.w - w) / 2, y: binnen.y + (binnen.h - h) / 2, w, h } };
  }

  // afbeelding onder de ster pixel per pixel inkleuren
  function tekenPixels(img, links, boven) {
    if (!pixelsMogelijk || !img.complete || !img.naturalWidth) return false;
    const { r, st, binnen, beeld } = beeldVak(img);

    // rand van de <img> zelf (bv. het kader rond een foto) in zijn eigen kleur
    if (parseFloat(st.borderTopWidth) > 0) {
      const c = rgb(st.borderTopColor);
      if (c) {
        ctx.fillStyle = KLEUR[kleurVoor(...c)];
        ctx.beginPath();
        ctx.rect(r.left - links, r.top - boven, r.width, r.height);
        ctx.rect(binnen.x - links, binnen.y - boven, binnen.w, binnen.h);
        ctx.fill("evenodd");
      }
    }

    // alleen het stuk dat echt beeld is én onder de ster ligt
    const x1 = Math.max(links, binnen.x, beeld.x), y1 = Math.max(boven, binnen.y, beeld.y);
    const x2 = Math.min(links + MAAT, binnen.x + binnen.w, beeld.x + beeld.w);
    const y2 = Math.min(boven + MAAT, binnen.y + binnen.h, beeld.y + beeld.h);
    if (x2 <= x1 || y2 <= y1) return true;
    const sx = img.naturalWidth / beeld.w, sy = img.naturalHeight / beeld.h;
    hctx.clearRect(0, 0, hulp.width, hulp.height);
    hctx.drawImage(img,
      (x1 - beeld.x) * sx, (y1 - beeld.y) * sy, (x2 - x1) * sx, (y2 - y1) * sy,
      (x1 - links) * dpr, (y1 - boven) * dpr, (x2 - x1) * dpr, (y2 - y1) * dpr);
    let data;
    try {
      data = hctx.getImageData(0, 0, hulp.width, hulp.height);
    } catch (fout) {
      pixelsMogelijk = false;   // los geopend bestand: browser blokkeert dit
      return false;
    }
    const d = data.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 20) { d[i + 3] = 0; continue; }   // doorzichtig of geen beeld: laag eronder telt
      const [nr, ng, nb] = sterKleurVoorPixel(d[i], d[i + 1], d[i + 2]);
      d[i] = nr; d[i + 1] = ng; d[i + 2] = nb; d[i + 3] = 255;
    }
    hctx.putImageData(data, 0, 0);
    ctx.drawImage(hulp, 0, 0, MAAT, MAAT);
    return true;
  }


  let x = -100, y = -100, bezig = false;

  function teken() {
    bezig = false;
    canvas.style.transform = `translate(${x}px, ${y}px)`;
    const links = x - MAAT / 2, boven = y - MAAT / 2;

    // titels die (deels) onder de ster liggen
    const titelsHier = titels.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.right > links && r.left < links + MAAT && r.bottom > boven && r.top < boven + MAAT;
    });

    // achtergrond onder de ster aftasten (raster van 5 x 5 punten)
    const lagen = new Map();
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const px = links + 3 + i * 6.5, py = boven + 3 + j * 6.5;
        const letter = titelsHier.length ? letterOp(px, py) : null;
        if (letter && !lagen.has(letter.sleutel)) lagen.set(letter.sleutel, letter);
        const laag = laagOp(px, py);
        if (!laag) continue;
        if (laag.el && !lagen.has(laag.el)) lagen.set(laag.el, laag);
        if (laag.pixelBeeld && !lagen.has(laag.pixelBeeld)) lagen.set(laag.pixelBeeld, { el: laag.pixelBeeld, pixels: true });
      }
    }

    // elke laag in zijn kleur schilderen, precies tot op zijn randen
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, MAAT, MAAT);
    ctx.fillStyle = KLEUR.blauw;
    ctx.fillRect(0, 0, MAAT, MAAT);
    [...lagen.values()].sort(volgorde).forEach((laag) => {
      if (laag.pixels) return tekenPixels(laag.el, links, boven);
      const r = laag.rect || laag.el.getBoundingClientRect();
      ctx.fillStyle = KLEUR[laag.kleur] || KLEUR.blauw;
      ctx.fillRect(r.left - links, r.top - boven, r.width, r.height);
    });

    // alleen de stervorm (met ronde hoeken) overhouden
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(masker, 0, 0, MAAT, MAAT);
  }

  function plan() {
    if (!bezig) { bezig = true; requestAnimationFrame(teken); }
  }

  window.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
    canvas.classList.remove("weg");
    plan();
  }, { passive: true });
  // tijdens het scrollen hoogstens om de 120 ms hertekenen, zodat het scrollen vloeiend blijft,
  // en één keer meteen nadat het scrollen stopt
  let laatsteScroll = 0, naScroll = null;
  window.addEventListener("scroll", () => {
    const nu = performance.now();
    if (nu - laatsteScroll > 120) { laatsteScroll = nu; plan(); }
    clearTimeout(naScroll);
    naScroll = setTimeout(plan, 130);
  }, { passive: true });
  document.addEventListener("transitionend", plan);                // bv. knop die van kleur wisselt
  document.addEventListener("mouseleave", () => canvas.classList.add("weg"));
})();
