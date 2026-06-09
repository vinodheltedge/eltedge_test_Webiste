(function () {
  "use strict";

  /* ====================================================================
     PREMIUM VERTICAL CAROUSEL — Images Only
     ===================================================================
     REQUIREMENT: Left content MUST remain completely frozen/static.
     ONLY right-side images animate in a smooth vertical carousel.
  ==================================================================== */

  var slides = Array.prototype.slice.call(
    document.querySelectorAll(".showcase-slide"),
  );
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var labelEl = document.getElementById("showcaseLabelText");

  var LABELS = [
    "Code Design",
    "Prototype Design",
    "Product Engineering",
    "Manufacturing & Deployment",
  ];
  var CYCLE_TIME = 5000; // 5 seconds per image
  var ANIMATION_DURATION = 1600; // milliseconds for smooth transition
  var current = 0;
  var autoTimer = null;
  var isAnimating = false;

  /**
   * Get the carousel position class for a slide based on its offset from current
   * offset: 0 = active, 1 = next, 2 = far, 3 = farfar
   */
  function getCarouselPosClass(offset) {
    switch (offset) {
      case 0:
        return "carousel-pos--active";
      case 1:
        return "carousel-pos--next";
      case 2:
        return "carousel-pos--far";
      case 3:
        return "carousel-pos--farfar";
      default:
        return "";
    }
  }

  /**
   * Update all slides to their correct carousel positions
   * based on the current active slide index
   */
  function updateCarouselPositions() {
    slides.forEach(function (slide, idx) {
      // Calculate offset from current slide (wrapping around)
      var offset = (idx - current + slides.length) % slides.length;

      // Remove all position classes
      slide.classList.remove(
        "carousel-pos--active",
        "carousel-pos--next",
        "carousel-pos--far",
        "carousel-pos--farfar",
        "carousel-animate",
      );

      // Add animation trigger class
      slide.classList.add("carousel-animate");

      // Add the correct position class
      var posClass = getCarouselPosClass(offset);
      if (posClass) {
        slide.classList.add(posClass);
      }
    });
  }

  /**
   * Advance to the next slide in the carousel
   * This animates only the images, NOT the left content
   */
  function cycleNext() {
    if (isAnimating || slides.length < 2) return;
    isAnimating = true;

    current = (current + 1) % slides.length;
    updateCarouselPositions();

    // Update dots
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === current);
    });

    // After animation completes, allow next cycle
    setTimeout(function () {
      isAnimating = false;
    }, ANIMATION_DURATION);
  }

  /**
   * Jump to a specific slide via dot click
   */
  function goToSlide(idx) {
    if (isAnimating || idx === current || slides.length < 2) return;
    isAnimating = true;

    current = idx;
    updateCarouselPositions();

    // Update dots
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === current);
    });

    // After animation completes, allow next cycle
    setTimeout(function () {
      isAnimating = false;
    }, ANIMATION_DURATION);
  }

  /**
   * Start the automatic carousel cycle
   */
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(cycleNext, CYCLE_TIME);
  }

  /**
   * Initialize carousel on page load
   */
  function init() {
    if (slides.length > 0) {
      // Set all slides to initial positions
      updateCarouselPositions();

      // Start auto-cycling
      startAuto();
    }
  }

  /**
   * Attach dot click handlers
   */
  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      goToSlide(i);
      startAuto();
    });
  });

  /* Initialize on load */
  init();

  /* ====================================================================
     SUBTLE SCROLL PARALLAX
     Showcase column moves at ~16% of hero scroll speed → depth illusion
  ==================================================================== */
  var showcaseCol = document.getElementById("heroShowcaseCol");
  var heroSection = document.getElementById("worksHero");

  function onScroll() {
    if (!showcaseCol || !heroSection) return;
    var top = heroSection.getBoundingClientRect().top;
    var scrolled = Math.max(0, -top);
    if (scrolled > heroSection.offsetHeight) return;
    showcaseCol.style.transform = "translateY(" + scrolled * 0.16 + "px)";
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();
