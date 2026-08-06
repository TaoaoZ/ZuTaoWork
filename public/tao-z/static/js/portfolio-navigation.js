(function () {
  var script = document.currentScript;
  var homeUrl = script ? new URL("../../index.html", script.src).href : "index.html";
  var menuToggle = document.querySelector(".header-toggle");

  document.querySelectorAll(".header-logo-ic").forEach(function (logo) {
    logo.href = homeUrl;
    logo.setAttribute("aria-label", "Back to homepage");
  });

  if (!menuToggle) return;

  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggle.setAttribute("aria-expanded", "false");

  function syncMenuState() {
    var isOpen = menuToggle.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  }

  menuToggle.addEventListener("click", function () {
    window.requestAnimationFrame(syncMenuState);
  });

  document.querySelectorAll(".ic-easter").forEach(function (trigger) {
    trigger.setAttribute("aria-label", "Open navigation");
    trigger.setAttribute("title", "Menu");
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      menuToggle.click();
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuToggle.classList.contains("active")) menuToggle.click();
  });
})();
