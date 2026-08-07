(function () {
  const mail = "tizu@foxmail.com";
  const portfolioRoot = "static/tao-portfolio/extracted/";

  const setText = (selector, value, index = 0) => {
    const node = document.querySelectorAll(selector)[index];
    if (node) node.textContent = value;
  };

  const setHTML = (selector, value, index = 0) => {
    const node = document.querySelectorAll(selector)[index];
    if (node) node.innerHTML = value;
  };

  const replaceExact = (from, to) => {
    document.querySelectorAll("a, div, p, h1, h2, h3, span").forEach((node) => {
      if (node.children.length === 0 && node.textContent.trim() === from) node.textContent = to;
    });
  };

  const style = document.createElement("style");
  style.textContent = `
    .tao-wordmark { font: 500 22px/1 inherit; letter-spacing: 0; color: currentColor; white-space: nowrap; }
    .header-logo-img.tao-hidden-logo { display: none !important; }
    .tao-hero-portrait { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 68% center; }
  `;
  document.head.appendChild(style);

  document.title = "Tao.z | HarmonyOS Product & UI Systems";
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute(
      "content",
      "Tao.z is a HarmonyOS product manager and UI systems designer focused on smart city products, AI governance and complex B/G-side systems."
    );
  }

  const barba = document.querySelector("[data-barba-title]");
  if (barba) barba.setAttribute("data-barba-title", "Tao.z");

  setHTML(".home-hero-title", '\u4ea7\u54c1\u7b56\u7565<br><span class="txt-purple">UI \u7cfb\u7edf</span>');
  setText(".home-hero-sub", "8 \u5e74 B/G \u7aef\u4ea7\u54c1\u4e0e\u89e3\u51b3\u65b9\u6848\u7ecf\u9a8c\uff0c\u4ea4\u4e92\u51fa\u8eab\u3002\u805a\u7126\u9e3f\u8499\u751f\u6001\u3001AI \u57ce\u5e02\u6cbb\u7406\u4e0e\u590d\u6742\u4e1a\u52a1\u7cfb\u7edf\u4f53\u9a8c\u8bbe\u8ba1\u3002");
  setHTML(".home-hero-cap", '\u9e3f\u8499\u751f\u6001<br><span class="txt-500">AI \u00d7 \u57ce\u5e02\u6cbb\u7406</span>');
  setText(".home-hero-label", "\u7acb\u8db3\u4e2d\u56fd / \u8ba9\u590d\u6742\u7cfb\u7edf\u66f4\u6e05\u6670");
  setText(".home-hero-thumb-mobile-txt", "\u7cbe\u9009\u4f5c\u54c1");

  document.querySelectorAll(".header-logo-img").forEach((img) => img.classList.add("tao-hidden-logo"));
  document.querySelectorAll(".header-logo-ic").forEach((logo) => {
    if (!logo.querySelector(".tao-wordmark")) logo.insertAdjacentHTML("afterbegin", '<div class="tao-wordmark">Tao.z</div>');
  });

  const portrait = portfolioRoot + "tao-001.jpg";
  document.querySelectorAll("[data-video='to-play']").forEach((link) => {
    link.removeAttribute("data-video");
    link.setAttribute("href", "#selected-work");
    link.setAttribute("aria-label", "\u67e5\u770b\u7cbe\u9009\u4f5c\u54c1");
  });
  document.querySelectorAll(".home-hero-vid-video source").forEach((source) => source.remove());
  document.querySelectorAll(".home-hero-thumb-mobile-img").forEach((img) => {
    img.src = portrait;
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.alt = "Tao.z";
  });
  document.querySelectorAll(".home-hero-vid-thumbnail").forEach((wrap) => {
    wrap.innerHTML = '<img class="tao-hero-portrait" src="' + portrait + '" alt="Tao.z">';
  });

  setText(".home-abt-title", "Tao.z \u5c06\u590d\u6742\u4e1a\u52a1\u3001\u8bbe\u5907\u4e0e AI \u80fd\u529b\u8f6c\u5316\u4e3a\u6e05\u6670\u7684\u4ea7\u54c1\u67b6\u6784\u3001\u4ea4\u4e92\u6d41\u7a0b\u4e0e\u53ef\u843d\u5730\u7684 UI \u7cfb\u7edf\u3002");
  setText(".home-abt-label", "\u4e2a\u4eba\u5b9a\u4f4d");
  setText(".txt-btn", "\u8054\u7cfb\u6731\u97ec");
  setText(".home-abt-sub-wrap-p", "\u6211\u4ece\u4ea4\u4e92\u4e0e\u89c6\u89c9\u8bbe\u8ba1\u8fdb\u5165\u6570\u5b57\u4ea7\u54c1\u9886\u57df\uff0c\u9010\u6b65\u8f6c\u5411\u4ea7\u54c1\u89c4\u5212\u3001\u89e3\u51b3\u65b9\u6848\u8bbe\u8ba1\u4e0e\u653f\u4f01\u9879\u76ee\u4ea4\u4ed8\u3002\u957f\u671f\u53c2\u4e0e\u667a\u6167\u57ce\u5e02\u3001\u91d1\u878d\u4fe1\u6258\u3001\u5eb7\u517b\u670d\u52a1\u3001\u96c6\u56e2\u4e1a\u52a1\u7cfb\u7edf\u548c\u6570\u5b57\u4ea4\u4e92\u88c5\u7f6e\u7b49\u9879\u76ee\u3002", 0);
  setText(".home-abt-sub-wrap-p", "\u73b0\u5728\u6211\u66f4\u5173\u6ce8\u9e3f\u8499\u751f\u6001\u3001AI \u667a\u80fd\u4f53\u4e0e\u57ce\u5e02\u6cbb\u7406\u573a\u666f\u7684\u7ed3\u5408\uff0c\u7528\u66f4\u6e05\u6670\u7684\u4ea7\u54c1\u7ed3\u6784\u3001\u66f4\u7a33\u5b9a\u7684 UI \u7cfb\u7edf\u548c\u66f4\u9ad8\u6548\u7684 AI \u5de5\u4f5c\u6d41\uff0c\u8ba9\u590d\u6742\u7cfb\u7edf\u53ef\u7406\u89e3\u3001\u53ef\u843d\u5730\u3001\u53ef\u6301\u7eed\u8fed\u4ee3\u3002", 1);

  setText(".home-ser-title", "\u80fd\u529b\u65b9\u5411");
  const capabilities = [
    ["\u4ea7\u54c1\u7b56\u7565", "\u4ea7\u54c1\u89c4\u5212\u3001\u9700\u6c42\u5b9a\u4e49\u3001\u7248\u672c\u8def\u7ebf\u4e0e\u653f\u4f01\u4ea4\u4ed8\u3002\u628a\u590d\u6742\u4e1a\u52a1\u62c6\u6210\u53ef\u843d\u5730\u7684\u7cfb\u7edf\u7ed3\u6784\u548c\u534f\u4f5c\u8def\u5f84\u3002"],
    ["\u9e3f\u8499\u89e3\u51b3\u65b9\u6848", "\u9e3f\u8499\u751f\u6001\u63a5\u5165\u3001\u591a\u7aef\u4f53\u9a8c\u3001ArkUI \u7ec4\u4ef6\u601d\u7ef4\u4e0e\u573a\u666f\u5316\u843d\u5730\uff0c\u8fde\u63a5\u8bbe\u5907\u3001\u4e1a\u52a1\u4e0e\u670d\u52a1\u751f\u6001\u3002"],
    ["AI \u00d7 \u57ce\u5e02\u6cbb\u7406", "DeepSeek / Qwen / \u667a\u80fd\u4f53\u573a\u666f\u5e94\u7528\uff0c\u5b9a\u4e49\u4e8b\u4ef6\u8bc6\u522b\u3001\u667a\u80fd\u6d3e\u5355\u4e0e\u95ed\u73af\u5904\u7f6e\u7684\u4eba\u673a\u534f\u540c\u94fe\u8def\u3002"],
    ["UI \u4e0e\u89c6\u89c9\u7cfb\u7edf", "\u4e2d\u540e\u53f0\u3001\u5927\u5c4f\u3001\u79fb\u52a8\u7aef\u4e0e\u89c6\u89c9\u8bbe\u8ba1\u7cfb\u7edf\uff0c\u6c89\u6dc0\u53ef\u590d\u7528\u7ec4\u4ef6\u89c4\u8303\uff0c\u964d\u4f4e\u8bbe\u8ba1\u5230\u5f00\u53d1\u7684\u8fd8\u539f\u504f\u5dee\u3002"]
  ];
  document.querySelectorAll(".home-ser-item").forEach((item, index) => {
    const data = capabilities[index];
    if (!data) return;
    const title = item.querySelector(".home-ser-item-title");
    const body = item.querySelector(".home-ser-item-txt");
    if (title) title.textContent = data[0];
    if (body) body.textContent = data[1];
    item.querySelectorAll(".home-ser-item-btn-txt").forEach((node) => { node.textContent = "\u8054\u7cfb\u4ea4\u6d41"; });
    item.querySelectorAll(".home-ser-item-content-btn-txt").forEach((node) => { node.textContent = "\u67e5\u770b\u91cd\u70b9"; });
  });

  setText(".home-proj-title", "\u7cbe\u9009\u4f5c\u54c1");
  setHTML(".home-proj-sub", "\u9e3f\u8499\u751f\u6001\u3002<br>AI \u6cbb\u7406\u3002<br>\u4ea7\u54c1\u7cfb\u7edf\u3002<br>");
  const selectedWork = document.querySelector(".home-proj");
  if (selectedWork) selectedWork.id = "selected-work";
  const projects = [
    ["AI \u6cbb\u7406", "\u5168\u57df\u6cbb\u7406\u4e00\u7f51\u7edf\u7ba1", "\u4ece\u8bbe\u5907\u611f\u77e5\u5230\u667a\u80fd\u6d3e\u5355\u7684\u57ce\u5e02\u6cbb\u7406\u95ed\u73af", "2025", ["tao-011.jpg", "tao-010.jpg"]],
    ["\u667a\u6167\u57ce\u5e02", "\u57ce\u5e02\u7a7a\u95f4\u6cbb\u7406\u670d\u52a1\u667a\u6167\u5e73\u53f0", "\u7f51\u683c\u3001\u4e8b\u4ef6\u3001\u90e8\u4ef6\u4e0e\u8bbe\u5907\u7684\u5168\u5468\u671f\u7ba1\u7406\u4e2d\u67a2", "2024", ["tao-010.jpg", "tao-011.jpg"]],
    ["\u6570\u5b57\u5316\u8f6c\u578b", "\u96c6\u56e2\u57ce\u5e02\u670d\u52a1\u6570\u5b57\u5316\u8f6c\u578b", "IOC\u3001\u4e1a\u52a1\u5e73\u53f0\u4e0e\u751f\u6d3b\u670d\u52a1\u7684\u7edf\u4e00\u4f53\u9a8c\u6846\u67b6", "2025", ["tao-008.jpg", "tao-007.jpg"]],
    ["\u91d1\u878d\u79d1\u6280", "GPTA \u73af\u7403\u79c1\u4eba\u4fe1\u6258\u8d26\u6237\u7cfb\u7edf", "\u9ad8\u51c0\u503c\u8d44\u4ea7\u4fe1\u606f\u7684\u6e05\u6670\u5316\u4ea7\u54c1\u8bbe\u8ba1", "2023", ["tao-004.jpg", "tao-004.jpg"]],
    ["\u6570\u636e\u53ef\u89c6\u5316", "\u9999\u6e2f\u5e73\u5b89\u949f\u5927\u6570\u636e\u53ef\u89c6\u5316\u7cfb\u7edf", "\u5eb7\u517b\u670d\u52a1\u573a\u666f\u4e2d\u7684\u5927\u5c4f\u5c55\u793a\u4e0e\u4e1a\u52a1\u95ed\u73af", "2023", ["tao-011.jpg", "tao-010.jpg"]]
  ];
  document.querySelectorAll(".home-proj-item").forEach((item, index) => {
    const data = projects[index];
    if (!data) return;
    const category = item.querySelector(".home-proj-cate-txt");
    const label = item.querySelector(".home-proj-label-txt");
    const title = item.querySelector(".home-proj-title-txt");
    const year = item.querySelector(".home-proj-item-inner > .txt.txt-16");
    if (category) category.textContent = data[0];
    if (label) label.textContent = data[1];
    if (title) title.textContent = data[2];
    if (year) year.textContent = data[3];
    item.querySelectorAll("a").forEach((link) => {
      link.setAttribute("href", "#selected-work");
      link.removeAttribute("data-cursor");
    });
    item.querySelectorAll(".home-proj-item-link").forEach((node) => {
      if (!node.classList.contains("w-condition-invisible")) node.textContent = "\u67e5\u770b\u6848\u4f8b";
    });
    item.querySelectorAll(".prj-img").forEach((img, imageIndex) => {
      img.src = portfolioRoot + data[4][imageIndex % data[4].length];
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      img.alt = data[1] + " project visual";
    });
  });

  replaceExact("Hire us", "Contact");
  replaceExact("Get in touch", "Contact Tao");
  replaceExact("Contact us", "Contact");
  replaceExact("Have a cool project for us?", "Let's build useful systems.");
  replaceExact("Need the design component?", "Product / UI / HarmonyOS");
  replaceExact("How can we help?", "What should we explore?");
  replaceExact("You can book multiple services", "Select the focus areas");
  replaceExact("Branding Design", "UI & Visual Systems");
  replaceExact("Design System", "HarmonyOS Solutions");
  replaceExact("Design Systems", "HarmonyOS Solutions");
  replaceExact("Product Design", "Product Strategy");
  replaceExact("Website Design", "AI \u00d7 Urban Governance");
  replaceExact("Other", "Open Collaboration");
  replaceExact("Full name", "Name");

  document.querySelectorAll('a[href^="mailto:"], .menu-bot-link, .pop-ctc-sub-link').forEach((link) => {
    link.setAttribute("href", "mailto:" + mail);
    if (link.textContent.includes("@") || link.classList.contains("menu-bot-link")) link.textContent = mail;
  });
  document.querySelectorAll(".header-status-inner .txt").forEach((node) => { node.textContent = "HarmonyOS, AI governance and product systems"; });
  document.querySelectorAll(".header-logo-sub-txt").forEach((node) => { node.textContent = "Portfolio"; });
  document.querySelectorAll(".ft-copy-txt").forEach((node) => { node.innerHTML = '<span data-year="#">[currentYear]</span> &copy; Tao.z'; });
})();

(function () {
  const canvas = document.querySelector(".home-ser-title-wrap .title-dot-canvas");
  if (!canvas) return;

  const host = canvas.parentElement;
  const interactionHost = canvas.closest(".home-ser-title-wrap");
  const dots = [];
  const pointer = { x: -9999, y: -9999 };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let frame = 0;

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.ceil(rect.width));
    height = Math.max(1, Math.ceil(rect.height));
    canvas.width = Math.ceil(width * ratio);
    canvas.height = Math.ceil(height * ratio);
    canvas.style.height = height + "px";
    const context = canvas.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    dots.length = 0;
    const gap = 20;
    for (let y = 12; y < height; y += gap) {
      for (let x = 12; x < width; x += gap) dots.push({ x, y });
    }
  };

  const render = () => {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);
    dots.forEach((dot) => {
      const dx = dot.x - pointer.x;
      const dy = dot.y - pointer.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influence = reducedMotion ? 0 : Math.max(0, 1 - distance / 150);
      const radius = 2 + influence * 5;
      const alpha = 0.12 + influence * 0.42;
      context.beginPath();
      context.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(92, 78, 190, " + alpha + ")";
      context.fill();
    });
    frame = window.requestAnimationFrame(render);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    interactionHost.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }, { passive: true });
    interactionHost.addEventListener("pointerleave", () => {
      pointer.x = -9999;
      pointer.y = -9999;
    }, { passive: true });
  }
  window.addEventListener("pagehide", () => window.cancelAnimationFrame(frame), { once: true });
  render();
})();
