
document.addEventListener('DOMContentLoaded', () => {
    initDestinationClicks();
    initHeroReveal();
    initScrollReveal();
    initWipePhotos();
    initPhotoCycle();
});



// INTERACTIE 1: Klik op foto -> navigeer naar bestemming
// (click-event + conditionele logica)

function initDestinationClicks() {
    const clickablePhotos = document.querySelectorAll('.clickable-photo');

    clickablePhotos.forEach((foto) => {
        foto.style.cursor = 'pointer';

        foto.addEventListener('click', () => {
            const bestemming = foto.getAttribute('data-dest');
            if (bestemming) {
                window.location.href = `destination.html#${bestemming}`;
            }
        });
    });
}



// INTERACTIE 2: HERO REVEAL
// Tekst in de hero komt later tevoorschijn dan de achtergrond,
// en beweegt tegelijk een stukje omhoog. (timer + class toggle)

function initHeroReveal() {
    const heroTitle = document.querySelector('.hero__title, .hero__title_book');
    const heroCards = document.querySelectorAll('.hero__card');

    if (!heroTitle) return;

    heroTitle.classList.add('js-hidden');
    heroCards.forEach((card) => card.classList.add('js-hidden'));

    setTimeout(() => {
        heroTitle.classList.remove('js-hidden');
    }, 300);

    heroCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.remove('js-hidden');
        }, 700 + index * 250);
    });
}



// INTERACTIE 3: SCROLL REVEAL
// Tekst en foto's vervagen in (en weer uit) terwijl je scrollt,
// zowel naar beneden als naar boven. (IntersectionObserver +
// conditionele logica met if/else)

function initScrollReveal() {

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.15
    });

    const revealElements = document.querySelectorAll('.reveal, .reveal-left');
    revealElements.forEach((el) => observer.observe(el));
}



// INTERACTIE 4: WIPE PHOTOS
// Foto's worden van links naar rechts onthuld, met een fade
// van 0% naar 100%, exact gekoppeld aan hoe ver je gescrold
// hebt. (scroll-event + doorlopende berekening, geen aan/uit)

function initWipePhotos() {
    const wipePhotos = document.querySelectorAll('.wipe-photo img');
    if (!wipePhotos.length) return;

    function updateWipe() {
        const viewportHeight = window.innerHeight;

        wipePhotos.forEach((img) => {
            const rect = img.getBoundingClientRect();
            const raw = (viewportHeight - rect.top) / (viewportHeight * 0.6);
            const progress = Math.min(Math.max(raw, 0), 1);
            const revealPercent = progress * 100;

            img.style.opacity = progress;
            img.style.clipPath = `inset(0 ${100 - revealPercent}% 0 0)`;
        });
    }

    window.addEventListener('scroll', updateWipe);
    window.addEventListener('resize', updateWipe);
    updateWipe();
}



// INTERACTIE 5: PHOTO CYCLE
// De 4 foto's per bestemming wisselen om de beurt, met een
// pure fade (geen beweging), via een herhalende timer.
// (setInterval + conditionele logica met modulo %)

function initPhotoCycle() {
    const cycles = document.querySelectorAll('.photo-cycle');

    cycles.forEach((cycle) => {
        const items = cycle.querySelectorAll('.cycle-item');
        if (!items.length) return;

        let currentIndex = 0;

        setInterval(() => {
            items[currentIndex].classList.remove('is-active');
            currentIndex = (currentIndex + 1) % items.length;
            items[currentIndex].classList.add('is-active');
        }, 5000);
    });
}