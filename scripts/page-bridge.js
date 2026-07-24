(function () {
  const rankingRoutes = {
    综合: "ranking",
    经营: "ranking-business",
    运营: "ranking-operation",
    内控: "ranking-internal",
    舆情: "ranking-reputation",
    创新: "ranking-innovation",
    安全: "ranking-safety"
  };
  const pageRoutes = { 总览: "overview", 排行: "ranking", 督办: "supervision" };
  const indicators = [
    { label: "经营板块", indicator: "经营" },
    { label: "经营指标", indicator: "经营" },
    { label: "运营板块", indicator: "运营" },
    { label: "运营指标", indicator: "运营" },
    { label: "内控板块", indicator: "内控" },
    { label: "内控指标", indicator: "内控" },
    { label: "舆情板块", indicator: "舆情" },
    { label: "舆情指标", indicator: "舆情" },
    { label: "创新板块", indicator: "创新" },
    { label: "创新指标", indicator: "创新" },
    { label: "安全板块", indicator: "安全" },
    { label: "安全指标", indicator: "安全" }
  ];
  const aggregationMetrics = [
    { label: "营业总收入指标完成度", metric: "营业总收入" },
    { label: "营业总收入", metric: "营业总收入" },
    { label: "经营利润指标完成度", metric: "经营利润" },
    { label: "经营利润", metric: "经营利润" },
    { label: "收入合约额", metric: "收入合约额" },
    { label: "企业经营现金流", metric: "企业经营现金流" },
    { label: "应收金额", metric: "应收金额" },
    { label: "应付金额", metric: "应付金额" },
    { label: "经营成本", metric: "经营成本" },
    { label: "在管项目", metric: "在管项目" },
    { label: "综合收缴率", metric: "综合收缴率" },
    { label: "员工数", metric: "员工数" },
    { label: "逾期应收金额", metric: "逾期应收金额" }
  ];
  const nativeRankingData = {
    business: {
      accent: "#3D6FE8", unit: "亿", defaultDimension: "收入TOP", periods: { 月度: 1, 季度: 2.75, 年度: 10.8 },
      dimensions: {
        收入TOP: { values: [5.82, 4.71, 3.24, 2.98, 1.85], trends: ["↑8.2%", "↑6.4%", "↑3.1%", "↓2.3%", "↓8.4%"], insight: "华东+华南合计占总收入 56.6%，西南区连续2季度负增长，需重点关注" },
        利润TOP: { values: [1.36, 1.12, 0.81, 0.72, 0.39], trends: ["↑6.8%", "↑5.2%", "↑1.9%", "↓1.4%", "↓6.7%"], insight: "华东区利润贡献保持领先，西南区成本刚性较强，利润改善仍需专项推进" },
        成本TOP: { values: [3.86, 3.21, 2.18, 2.06, 1.43], trends: ["↓2.1%", "↓1.8%", "↑0.9%", "↑2.6%", "↑5.1%"], insight: "华东、华南成本压降成效明显，西南区成本率环比上升，需关注采购与人工成本" }
      }
    },
    operation: {
      accent: "#F97316", unit: "%", defaultDimension: "工单完成率", periods: { 月度: 1 },
      dimensions: {
        工单完成率: { values: [98.7, 96.2, 92.8, 89.4, 84.6], trends: ["↑2.1%", "↑1.4%", "↑0.8%", "↓1.2%", "↓4.6%"], insight: "华东区工单完成率 98.7% 领先，西南区 84.6% 严重偏低，需专项督导" },
        设备完好率: { values: [99.2, 97.6, 95.3, 92.1, 88.5], trends: ["↑1.2%", "↑0.9%", "↑0.4%", "↓0.8%", "↓2.7%"], insight: "核心区域设备完好率整体稳定，西南区老旧设备故障频次偏高，建议加快更新计划" },
        能耗达标率: { values: [96.8, 95.1, 92.6, 90.3, 86.9], trends: ["↑3.2%", "↑2.5%", "↑1.7%", "↑0.6%", "↓3.4%"], insight: "华东区能耗控制领先，西南区高耗能项目占比较高，需细化节能改造任务" }
      }
    }
  };
  const send = payload => window.parent.postMessage({ source: "mastergo-prototype", ...payload }, "*");
  const compact = value => String(value || "").replace(/\s+/g, "").trim();
  const textOf = node => compact(node?.textContent);

  function nativeRankingMode() {
    if (document.title.includes("经营排行")) return "business";
    if (document.title.includes("运营排行")) return "operation";
    return "";
  }

  function findNativeRankingCard(node) {
    let current = node;
    while (current && current !== document.body) {
      if (current.querySelector?.('[data-name="BarChart"]') && current.querySelectorAll?.('[data-name="Button"]').length >= 3) return current;
      current = current.parentElement;
    }
    return null;
  }

  function setNativeControlState(card, selector, activeLabel, accent) {
    [...card.querySelectorAll(selector)].forEach(control => {
      const label = [...control.querySelectorAll("span")].find(span => textOf(span) === compact(activeLabel));
      const active = Boolean(label);
      control.style.background = active ? "#FFFFFF" : "transparent";
      control.style.boxShadow = active ? "0 1px 4px rgba(30,50,120,0.1)" : "none";
      const span = control.querySelector("span");
      if (span) {
        span.style.color = active ? accent : "#8898B4";
        span.style.fontWeight = active ? "700" : "500";
      }
    });
  }

  function renderNativeRanking(mode, card) {
    const config = nativeRankingData[mode];
    if (!config || !card) return;
    const state = window.__nativeRankingState || (window.__nativeRankingState = {});
    const current = state[mode] || (state[mode] = { dimension: config.defaultDimension, period: Object.keys(config.periods)[0] });
    const dimension = config.dimensions[current.dimension];
    const factor = config.periods[current.period] || 1;
    const values = dimension.values.map(value => mode === "business" ? Number((value * factor).toFixed(2)) : value);
    const names = ["华东", "华南", "西北", "华北", "西南"];
    const maximum = Math.max(...values);
    const chart = card.querySelector('[data-name="BarChart"]');
    if (chart) {
      chart.dataset.nativeInteractiveChart = "true";
      chart.innerHTML = `<div class="native-chart-bars">${values.map((value, index) => `<div class="native-chart-column"><div class="native-chart-value">${value}${config.unit}</div><i style="height:${Math.max(20, value / maximum * 84)}px;--native-bar:${index < 2 ? "#22C55E" : index < 4 ? "#F59E0B" : "#F04455"}"></i><span>${names[index]}</span></div>`).join("")}</div>`;
    }
    const insight = card.querySelector('p[data-name*="📊"]');
    if (insight) insight.textContent = `📊 ${dimension.insight}`;
    const valuePattern = mode === "business" ? /^\d+(?:\.\d+)?亿$/ : /^\d+(?:\.\d+)?%$/;
    const valueSpans = [...card.querySelectorAll("span")].filter(span => valuePattern.test(textOf(span))).slice(0, 5);
    valueSpans.forEach((span, index) => { span.textContent = `${values[index]}${config.unit}`; });
    const trendSpans = [...card.querySelectorAll("span")].filter(span => /^[↑↓]\d+(?:\.\d+)?%$/.test(textOf(span))).slice(0, 5);
    trendSpans.forEach((span, index) => {
      span.textContent = dimension.trends[index];
      span.style.color = dimension.trends[index].startsWith("↑") ? "#22C55E" : "#F04455";
    });
    if (mode === "business") {
      const maxValue = Math.max(...values, 1);
      trendSpans.forEach((span, index) => {
        const trendParagraph = span.closest('[data-name="Paragraph"]');
        if (trendParagraph) trendParagraph.style.display = "none";
        let row = span.parentElement;
        while (row && row !== card && !(row.getAttribute?.("data-name") === "Container" && row.children.length >= 4)) row = row.parentElement;
        if (!row || row === card) return;
        row.dataset.nativeBusinessRank = "true";
        row.style.display = "grid";
        row.style.gridTemplateColumns = "16px 6px minmax(0,1fr) auto 64px";
        row.style.alignItems = "center";
        row.style.gap = "8px";
        row.style.padding = "6px 16px";
        row.style.boxSizing = "border-box";
        row.querySelectorAll(".native-business-progress").forEach(node => node.remove());
        const progress = document.createElement("span");
        progress.className = "native-business-progress";
        progress.style.cssText = "display:block;width:64px;height:6px;overflow:hidden;border-radius:999px;background:#E8EEF8";
        const fill = document.createElement("i");
        fill.style.cssText = `display:block;height:100%;width:${Math.max(0, Math.min(100, values[index] / maxValue * 100))}%;border-radius:999px;background:${index < 2 ? "#22C55E" : index < 4 ? "#F59E0B" : "#F04455"}`;
        progress.append(fill);
        row.append(progress);
      });
    }
    setNativeControlState(card, '[data-name="Button"]', current.dimension, config.accent);
    setNativeControlState(card, '[data-name="item/date"]', current.period, config.accent);
  }

  function selectNativeRanking(label, node) {
    const mode = nativeRankingMode();
    const config = nativeRankingData[mode];
    if (!config) return false;
    const card = findNativeRankingCard(node);
    if (!card) return false;
    const state = window.__nativeRankingState || (window.__nativeRankingState = {});
    const current = state[mode] || (state[mode] = { dimension: config.defaultDimension, period: Object.keys(config.periods)[0] });
    if (config.dimensions[label]) current.dimension = label;
    else if (config.periods[label]) current.period = label;
    else return false;
    renderNativeRanking(mode, card);
    return true;
  }

  function supervisionTab(label, node) {
    const tabLabels = ["推进中事项", "办结事项（含持续更新）"];
    tabLabels.forEach(tabLabel => {
      const span = [...document.querySelectorAll("span")].find(item => textOf(item) === compact(tabLabel));
      const frame = span?.parentElement;
      if (!frame) return;
      const active = compact(tabLabel) === compact(label);
      frame.style.borderBottom = active ? "2.56px solid #477AFC" : "0";
      frame.style.borderImage = "none";
      span.style.color = active ? "#101A3E" : "#8D90A6";
      span.style.fontWeight = active ? "600" : "400";
    });
    const pageScroller = document.querySelector('[data-h5-page-scroll="true"]');
    const scrollRegion = document.querySelector('[data-h5-scroll-region="supervision"]');
    const listCards = [...(scrollRegion || document).querySelectorAll('[data-name="Button"]')]
      .filter(card => [...card.querySelectorAll("span")].some(span => ["进行中", "待处理", "已办结"].includes(textOf(span))));
    listCards.forEach((card, index) => {
      const completed = label.includes("办结");
      const statusSpan = [...card.querySelectorAll("span")].find(span => ["进行中", "待处理", "已办结"].includes(textOf(span)));
      const deadlineSpan = [...card.querySelectorAll("span")].find(span => /^(剩\d+天|已完成)$/.test(textOf(span)));
      if (statusSpan && !statusSpan.dataset.originalText) statusSpan.dataset.originalText = statusSpan.textContent.trim();
      if (deadlineSpan && !deadlineSpan.dataset.originalText) deadlineSpan.dataset.originalText = deadlineSpan.textContent.trim();
      card.style.display = completed ? (index < 4 ? "flex" : "none") : "flex";
      if (statusSpan) {
        statusSpan.textContent = completed ? "已办结" : statusSpan.dataset.originalText;
        statusSpan.style.color = completed ? "#1f9d62" : "#477AFC";
      }
      if (deadlineSpan) deadlineSpan.textContent = completed ? "已完成" : deadlineSpan.dataset.originalText;
    });
    if (pageScroller) pageScroller.scrollTop = 0;
    else if (scrollRegion) scrollRegion.scrollTop = 0;
    send({ action: "show-toast", text: `已切换至${label}` });
  }

  function aggregationMetricForNode(startNode) {
    let current = startNode;
    for (let depth = 0; current && depth < 8; depth += 1, current = current.parentElement) {
      const text = textOf(current);
      const direct = aggregationMetrics.find(item => text.includes(item.label) && text.length <= 80);
      if (direct) return direct.metric;
      const matches = aggregationMetrics.filter(item => text.includes(item.label));
      const hasMetricValue = Boolean(current.querySelector?.('[data-name="Bold Text"]'));
      if (matches.length === 1 && hasMetricValue && text.length <= 90) return matches[0].metric;
    }
    return "";
  }

  document.addEventListener("click", event => {
    const supervisionTabNode = event.target.closest?.('[data-name="项目预警"], [data-name="项目问题"]');
    if (document.title.includes("督办") && supervisionTabNode) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      supervisionTab(textOf(supervisionTabNode), supervisionTabNode);
      return;
    }

    let node = event.target;
    for (let depth = 0; node && depth < 10; depth += 1, node = node.parentElement) {
      const name = node.getAttribute?.("data-name") || "";
      const text = textOf(node);
      const pageLabel = Object.keys(pageRoutes).find(label => text === label || (text.endsWith(label) && text.length <= 6));
      if (pageLabel) {
        event.preventDefault();
        send({ action: "navigate", route: pageRoutes[pageLabel] });
        return;
      }
      if (rankingRoutes[text]) {
        event.preventDefault();
        send({ action: "navigate", route: rankingRoutes[text] });
        return;
      }
      if (selectNativeRanking(text, node)) {
        event.preventDefault();
        return;
      }
      const aggregationMetric = aggregationMetricForNode(node);
      if (aggregationMetric) {
        event.preventDefault();
        send({ action: "open-control", control: "aggregation", metric: aggregationMetric });
        return;
      }
      const indicator = indicators.find(item => text.includes(item.label) && text.length < 160);
      if (indicator) {
        event.preventDefault();
        send({ action: "open-indicator", indicator: indicator.indicator });
        return;
      }
      if (name === "切换对象" || text === "切换范围") {
        event.preventDefault();
        send({ action: "open-control", control: "scope" });
        return;
      }
      if (name.includes("打开个人侧边栏") || name.includes("菜单")) {
        event.preventDefault();
        send({ action: "open-control", control: "menu" });
        return;
      }
      if (name === "搜索" || text === "搜索") {
        event.preventDefault();
        send({ action: "open-control", control: "search" });
        return;
      }
      if (name === "点击查看更多数据" || text === "点击查看更多数据") {
        event.preventDefault();
        send({ action: "open-control", control: "all-indicators" });
        return;
      }
      if (name === "更多" || text === "更多") {
        event.preventDefault();
        send({ action: "open-control", control: "feed" });
        return;
      }
      if (name === "项目预警" || name === "项目问题" || name === "其中:未解决问题") {
        event.preventDefault();
        supervisionTab(text, node);
        return;
      }
      if (name === "info-circle" || name === "进度说明") {
        event.preventDefault();
        send({ action: "open-control", control: "info", title: text || "指标说明", description: "该指标按照正式指标表的定义、权重、评分标准和红线规则计算，当前页面展示仿真值。" });
        return;
      }
      if (name === "Button" && text.length > 20 && !text.includes("企业经营六大指标")) {
        event.preventDefault();
        send({ action: "open-control", control: "detail", title: text.slice(0, 28), description: "已打开事项详情。该条目支持查看责任区域、更新时间、进度和后续跟进记录。" });
        return;
      }
    }
  }, true);

  const mode = nativeRankingMode();
  if (mode) {
    const defaultLabel = nativeRankingData[mode].defaultDimension;
    const defaultNode = [...document.querySelectorAll("span")].find(span => textOf(span) === compact(defaultLabel));
    const defaultCard = defaultNode ? findNativeRankingCard(defaultNode) : null;
    if (defaultCard) renderNativeRanking(mode, defaultCard);
  }
})();
