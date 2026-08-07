(function () {
  function initHeroColorFade() {
    var loader = document.querySelector(".loader");
    if (loader) loader.style.pointerEvents = "none";

    var portrait = document.querySelector(".home-hero-vid-wrap");
    var colorLayer = loader && loader.querySelector(".loader-imgs");
    if (!portrait || !colorLayer) return;

    // The coloured card belongs to the loader's image layer, not the whole loader.
    // Tie its exit to the portrait entering the viewport so it cannot cover the intro copy.
    if (!window.gsap || !window.ScrollTrigger) return;

    window.gsap.set(colorLayer, { pointerEvents: "none", willChange: "opacity" });

    if (window.innerWidth < 768) {
      var mobileFade = function () {
        var rect = portrait.getBoundingClientRect();
        var height = window.innerHeight || document.documentElement.clientHeight;
        // Fade across the final part of the portrait reveal on small screens.
        var progress = (height * 0.68 - rect.top) / (height * 0.5);
        progress = Math.max(0, Math.min(1, progress));
        window.gsap.set(colorLayer, { autoAlpha: 1 - progress });
      };

      var ticking = false;
      var updateMobileFade = function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          mobileFade();
          ticking = false;
        });
      };

      window.addEventListener("scroll", updateMobileFade, { passive: true });
      window.addEventListener("resize", updateMobileFade, { passive: true });
      mobileFade();
      return;
    }

    window.gsap.to(colorLayer, {
      autoAlpha: 0,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: portrait,
        start: "top 72%",
        end: "top 18%",
        scrub: 0.25,
        invalidateOnRefresh: true
      }
    });

    window.ScrollTrigger.refresh();
  }

  window.addEventListener("load", function () {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(initHeroColorFade);
    });
  }, { once: true });
})();
