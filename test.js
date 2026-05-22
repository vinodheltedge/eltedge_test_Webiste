/* ============================================================
   test.js — Stacked Scroll Cards with GSAP + ScrollTrigger
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ── DOM refs ─────────────────────────────────────────────── */
const section = document.getElementById('sc-section');
const wrapper = document.getElementById('sc-wrapper');
const cards   = gsap.utils.toArray('.sc-card');
const dots    = gsap.utils.toArray('.sc-progress-dot');
const N       = cards.length; // 3

/* ── Progress dots ────────────────────────────────────────── */
function setActiveDot(index) {
  dots.forEach((dot, i) =>
    dot.classList.toggle('sc-progress-dot--active', i === index)
  );
}

/* ── Responsive animation via matchMedia ──────────────────── */
const mm = gsap.matchMedia();

/* ============================================================
   DESKTOP (≥ 768px) — stacked, pinned scroll
   ============================================================ */
mm.add('(min-width: 768px)', () => {

  /* CSS hook: switches .sc-card to position: absolute */
  document.body.classList.add('sc-desktop');

  /* Center all cards absolutely within the pinned wrapper */
  gsap.set(cards, {
    xPercent: -50,
    yPercent: -50,
    top: '50%',
    left: '50%',
    width: 'min(90vw, 1080px)',
  });

  /*
   * Z-index strategy:
   * Later cards have HIGHER z-index so they slide OVER earlier ones.
   * cards[0] = 1, cards[1] = 2, cards[2] = 3
   * Where a retreated card overlaps the active card, the active
   * card (higher z-index) covers it — the retreated card peeks
   * only above the active card's top edge, which is correct.
   */
  cards.forEach((card, i) => gsap.set(card, { zIndex: i + 1 }));

  /* Cards 1 & 2 start below the viewport, invisible */
  gsap.set(cards.slice(1), {
    y: () => window.innerHeight,
    opacity: 0,
    scale: 0.96,
  });

  /* ── Stacking timeline ─────────────────────────────────── */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      /* 2 transitions × 110vh of scroll each */
      end: () => '+=' + (N - 1) * window.innerHeight * 1.1,
      scrub: 1.5,
      pin: wrapper,
      anticipatePin: 1,
      onUpdate(self) {
        /* Update progress dots */
        const segSize = 1 / (N - 1);
        const idx = Math.min(N - 1, Math.floor(self.progress / segSize + 0.05));
        setActiveDot(idx);
      },
    },
  });

  /* ── Transition 0 → 1 (timeline t: 0 → 1) ───────────── */
  tl
    /* Card 0 retreats: nudges up, scales down, dims */
    .to(cards[0], {
      y: () => -window.innerHeight * 0.08,
      scale: 0.91,
      opacity: 0.40,
      duration: 1,
      ease: 'none',
    })
    /* Card 1 enters from below */
    .to(cards[1], {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<');  /* '<' = start at same position in timeline */

  /* ── Transition 1 → 2 (timeline t: 1 → 2) ───────────── */
  tl
    /* Card 0 retreats further into the background */
    .to(cards[0], {
      y: () => -window.innerHeight * 0.15,
      scale: 0.83,
      opacity: 0.18,
      duration: 1,
      ease: 'none',
    })
    /* Card 1 retreats to mid-stack */
    .to(cards[1], {
      y: () => -window.innerHeight * 0.08,
      scale: 0.91,
      opacity: 0.40,
      duration: 1,
      ease: 'none',
    }, '<')
    /* Card 2 enters from below */
    .to(cards[2], {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<');

  /* ── Intro fade on scroll ──────────────────────────────── */
  gsap.to('.sc-intro-inner', {
    opacity: 0,
    y: -24,
    ease: 'none',
    scrollTrigger: {
      trigger: '.sc-intro',
      start: 'center center',
      end: 'bottom top',
      scrub: true,
    },
  });

  /* ── Hide scroll hint after first scroll movement ─────── */
  ScrollTrigger.create({
    start: '80px top',
    onEnter: () =>
      gsap.to('.sc-intro-scroll-hint', { opacity: 0, duration: 0.4 }),
    once: true,
  });

  /* Return cleanup function — fires when matchMedia no longer matches */
  return () => {
    document.body.classList.remove('sc-desktop');
    gsap.set(cards, { clearProps: 'all' });
  };
});

/* ============================================================
   MOBILE (< 768px) — vertical stack, simple fade-up reveals
   ============================================================ */
mm.add('(max-width: 767px)', () => {

  cards.forEach((card) => {
    gsap.fromTo(card,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
});

/* ============================================================
   SHARED — Outro CTA fade-up (all breakpoints)
   ============================================================ */
gsap.fromTo('.sc-outro-inner',
  { opacity: 0, y: 48 },
  {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.sc-outro',
      start: 'top 82%',
      toggleActions: 'play none none none',
    },
  }
);

/* Recalculate pin positions once all assets (fonts, images) are loaded */
window.addEventListener('load', () => ScrollTrigger.refresh());
