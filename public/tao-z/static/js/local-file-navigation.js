(function () {
  if (window.location.protocol !== "file:") return;

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    var link = event.target.closest("a[href]");
    if (!link || link.target || link.hasAttribute("download")) return;

    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#" || /^(mailto:|tel:|javascript:)/i.test(href)) return;

    var destination = new URL(href, window.location.href);
    if (destination.protocol !== "file:") return;

    // Barba intercepts links but cannot fetch file:// documents in Chromium.
    event.preventDefault();
    event.stopPropagation();
    window.location.assign(destination.href);
  }, true);
})();
