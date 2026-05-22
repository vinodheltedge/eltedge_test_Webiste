(function () {
  'use strict';

  /* ====================================================================
     HERO SHOWCASE SLIDER
  ==================================================================== */
  var slides     = Array.prototype.slice.call(document.querySelectorAll('.showcase-slide'));
  var dots       = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var labelEl    = document.getElementById('showcaseLabelText');

  var LABELS   = ['Code Design', 'Prototype Design', 'Product Engineering', 'Manufacturing & Deployment'];
  var INTERVAL = 4600;
  var current  = 0;
  var autoTimer      = null;
  var transitioning  = false;

  function goTo(idx) {
    if (transitioning || idx === current || slides.length < 2) return;
    transitioning = true;

    var prev = current;
    current  = idx;

    /* Exit */
    slides[prev].classList.remove('is-active');
    slides[prev].classList.add('is-leaving');
    var leaving = slides[prev];
    setTimeout(function () {
      leaving.classList.remove('is-leaving');
      transitioning = false;
    }, 750);

    /* Enter */
    slides[current].classList.add('is-active');

    /* Dots */
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });

    /* Label fade-swap */
    if (labelEl) {
      labelEl.classList.add('is-changing');
      setTimeout(function () {
        labelEl.textContent = LABELS[current] || '';
        labelEl.classList.remove('is-changing');
      }, 280);
    }
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function () {
      goTo((current + 1) % slides.length);
    }, INTERVAL);
  }

  /* Initialise */
  if (slides.length > 0) {
    slides[0].classList.add('is-active');
    startAuto();
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goTo(i);
      startAuto();
    });
  });

  /* ====================================================================
     SUBTLE SCROLL PARALLAX
     Showcase column moves at ~16 % of hero scroll speed → depth illusion
  ==================================================================== */
  var showcaseCol = document.getElementById('heroShowcaseCol');
  var heroSection = document.getElementById('worksHero');

  function onScroll() {
    if (!showcaseCol || !heroSection) return;
    var top     = heroSection.getBoundingClientRect().top;
    var scrolled = Math.max(0, -top);
    if (scrolled > heroSection.offsetHeight) return;
    showcaseCol.style.transform = 'translateY(' + (scrolled * 0.16) + 'px)';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
