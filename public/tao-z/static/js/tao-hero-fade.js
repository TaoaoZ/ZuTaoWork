(function () {
  function initHeroColorFade() {
    var loader = document.querySelector(".loader");
    if (loader) loader.style.pointerEvents = "none";

    if (window.innerWidth < 768 || !window.gsap || !window.ScrollTrigger) return;

    var portrait = document.querySelector(".home-hero-vid-wrap");
    var colorLayer = loader && loader.querySelector(".loader-imgs");
    if (!portrait || !colorLayer) return;

    // The coloured card belongs to the loader's image layer, not the whole loader.
    // Tie its exit to the portrait entering the viewport so it cannot cover the intro copy.
    window.gsap.set(colorLayer, { pointerEvents: "none" });
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
