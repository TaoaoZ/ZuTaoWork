(function () {
  const stack = document.getElementById("page-stack");
  const modal = document.getElementById("indicator-modal");
  const modalContent = document.getElementById("indicator-content");
  const modalTitle = document.getElementById("indicator-title");
  const sheet = document.getElementById("action-sheet");
  const sheetTitle = document.getElementById("sheet-title");
  const sheetEyebrow = document.getElementById("sheet-eyebrow");
  const sheetContent = document.getElementById("sheet-content");
  const companyPage = document.getElementById("company-page");
  const companyCurrentName = document.getElementById("company-current-name");
  const companySearchInput = document.getElementById("company-search-input");
  const companyResultMeta = document.getElementById("company-result-meta");
  const companyList = document.getElementById("company-list");
  const companyConfirm = document.getElementById("company-confirm");
  const companyConfirmTitle = document.getElementById("company-confirm-title");
  const companyConfirmCopy = document.getElementById("company-confirm-copy");
  const toast = document.getElementById("prototype-toast");
  const files = {
    overview: "overview.html",
    ranking: "ranking.html",
    "ranking-business": "ranking-business.html",
    "ranking-operation": "ranking-operation.html",
    "ranking-internal": "ranking-internal.html",
    "ranking-reputation": "ranking-reputation.html",
    "ranking-innovation": "ranking-innovation.html",
    "ranking-safety": "ranking-safety.html",
    supervision: "supervision.html"
  };
  const initialFrame = document.getElementById("page-frame");
  initialFrame.dataset.loaded = "false";
  const frames = new Map([["overview", initialFrame]]);
  let currentRoute = "overview";
  let requestedRoute = "overview";
  let selectedScope = "深圳市天健城市服务有限公司";
  let activeIndicatorName = "经营";
  let pendingScope = "";
  let toastTimer;
  let searchTimer;
  const domains = ["经营", "运营", "内控", "舆情", "创新", "安全"];
  const companies = [
    { name: "深圳市天健城市服务有限公司", short: "天健", code: "HQ", region: "总部", type: "归集主体", desc: "各区域公司与专业公司经营数据归集主体", aliases: ["总部", "集团", "天健城市服务"] },
    { name: "大湾区区域公司", short: "湾区", code: "GBA", region: "华南", type: "区域公司", desc: "深圳、广州、珠海等湾区项目经营管理", aliases: ["大湾区", "深圳", "广州"] },
    { name: "华东区域公司", short: "华东", code: "EC", region: "华东", type: "区域公司", desc: "上海、杭州、南京项目群与区域经营数据", aliases: ["上海", "杭州", "南京"] },
    { name: "华南区域公司", short: "华南", code: "SC", region: "华南", type: "区域公司", desc: "广东、广西、海南片区重点项目经营数据", aliases: ["广东", "广西", "海南"] },
    { name: "华中区域公司", short: "华中", code: "CC", region: "华中", type: "区域公司", desc: "武汉、长沙、郑州等项目督办与运营数据", aliases: ["武汉", "长沙", "郑州"] },
    { name: "华北区域公司", short: "华北", code: "NC", region: "华北", type: "区域公司", desc: "北京、天津、河北项目群综合经营数据", aliases: ["北京", "天津", "河北"] },
    { name: "西南区域公司", short: "西南", code: "SW", region: "西南", type: "区域公司", desc: "成都、重庆、昆明片区风险与指标数据", aliases: ["成都", "重庆", "昆明"] },
    { name: "西北区域公司", short: "西北", code: "NW", region: "西北", type: "区域公司", desc: "西安、兰州、银川项目经营与安全数据", aliases: ["西安", "兰州", "银川"] },
    { name: "生活服务公司", short: "生活", code: "LS", region: "专业公司", type: "专业公司", desc: "社区生活、客户服务与到家服务经营数据", aliases: ["生活服务", "社区服务"] },
    { name: "智慧运营公司", short: "智运", code: "SO", region: "专业公司", type: "专业公司", desc: "数字化运营、工单、能耗与服务质量数据", aliases: ["智慧运营", "数字化"] },
    { name: "公建服务公司", short: "公建", code: "PB", region: "专业公司", type: "专业公司", desc: "公共建筑、政企项目与综合物业服务数据", aliases: ["公建", "公共建筑"] },
    { name: "园区运营公司", short: "园区", code: "PO", region: "专业公司", type: "专业公司", desc: "产业园区、商业园区运营与招商服务数据", aliases: ["园区运营", "园区"] }
  ];
  const companyProfiles = {
    "深圳市天健城市服务有限公司": {
      scores: { 经营: 96, 运营: 95, 内控: 98, 舆情: 95, 创新: 90, 安全: 99 },
      metrics: [96, 94, 97, 92, 89, 86, 93, 95, 94],
      overview: { done: "24.60 亿", target: "29.50 亿", progress: "83.4%", contract: "5.98亿", cash: "2.20亿", receivable: "4.28亿", payable: "1.90亿", cost: "19.10亿", projects: "300个", collection: "93.0%", overdue: "1.13亿" }
    },
    "大湾区区域公司": {
      scores: { 经营: 98, 运营: 97, 内控: 99, 舆情: 96, 创新: 88, 安全: 99 },
      metrics: [98, 96, 99, 94, 90, 88, 95, 97, 96],
      overview: { done: "5.42 亿", target: "6.20 亿", progress: "87%", contract: "1.36亿", cash: "0.58亿", receivable: "0.82亿", payable: "0.36亿", cost: "4.08亿", projects: "42个", collection: "95.8%", overdue: "0.18亿" }
    },
    "华东区域公司": {
      scores: { 经营: 97, 运营: 96, 内控: 99, 舆情: 97, 创新: 94, 安全: 99 },
      metrics: [97, 95, 98, 93, 88, 85, 94, 96, 95],
      overview: { done: "4.86 亿", target: "5.40 亿", progress: "90%", contract: "1.18亿", cash: "0.51亿", receivable: "0.69亿", payable: "0.28亿", cost: "3.62亿", projects: "36个", collection: "96.4%", overdue: "0.12亿" }
    },
    "华南区域公司": {
      scores: { 经营: 95, 运营: 94, 内控: 97, 舆情: 95, 创新: 89, 安全: 98 },
      metrics: [95, 93, 96, 90, 87, 84, 92, 94, 93],
      overview: { done: "3.12 亿", target: "3.78 亿", progress: "83%", contract: "0.82亿", cash: "0.29亿", receivable: "0.52亿", payable: "0.24亿", cost: "2.46亿", projects: "31个", collection: "92.8%", overdue: "0.14亿" }
    },
    "华中区域公司": {
      scores: { 经营: 92, 运营: 93, 内控: 96, 舆情: 93, 创新: 86, 安全: 97 },
      metrics: [92, 90, 94, 86, 84, 81, 91, 92, 90],
      overview: { done: "2.04 亿", target: "2.62 亿", progress: "78%", contract: "0.46亿", cash: "0.16亿", receivable: "0.38亿", payable: "0.19亿", cost: "1.72亿", projects: "24个", collection: "90.5%", overdue: "0.13亿" }
    },
    "华北区域公司": {
      scores: { 经营: 93, 运营: 92, 内控: 96, 舆情: 92, 创新: 85, 安全: 96 },
      metrics: [93, 91, 94, 87, 85, 82, 90, 93, 91],
      overview: { done: "1.72 亿", target: "2.18 亿", progress: "79%", contract: "0.39亿", cash: "0.12亿", receivable: "0.34亿", payable: "0.16亿", cost: "1.39亿", projects: "21个", collection: "89.8%", overdue: "0.11亿" }
    },
    "西南区域公司": {
      scores: { 经营: 88, 运营: 87, 内控: 91, 舆情: 86, 创新: 81, 安全: 89 },
      metrics: [88, 85, 90, 78, 80, 76, 86, 88, 84],
      overview: { done: "1.18 亿", target: "1.74 亿", progress: "68%", contract: "0.24亿", cash: "-0.04亿", receivable: "0.42亿", payable: "0.21亿", cost: "1.06亿", projects: "18个", collection: "84.2%", overdue: "0.17亿" }
    },
    "西北区域公司": {
      scores: { 经营: 91, 运营: 90, 内控: 95, 舆情: 91, 创新: 84, 安全: 96 },
      metrics: [91, 89, 93, 84, 82, 79, 89, 91, 88],
      overview: { done: "1.34 亿", target: "1.82 亿", progress: "74%", contract: "0.31亿", cash: "0.07亿", receivable: "0.29亿", payable: "0.13亿", cost: "1.08亿", projects: "19个", collection: "88.6%", overdue: "0.09亿" }
    },
    "生活服务公司": {
      scores: { 经营: 94, 运营: 96, 内控: 97, 舆情: 94, 创新: 87, 安全: 98 },
      metrics: [94, 92, 95, 90, 86, 83, 93, 94, 95],
      overview: { done: "0.92 亿", target: "1.10 亿", progress: "84%", contract: "0.22亿", cash: "0.11亿", receivable: "0.18亿", payable: "0.08亿", cost: "0.69亿", projects: "16个", collection: "94.8%", overdue: "0.04亿" }
    },
    "智慧运营公司": {
      scores: { 经营: 95, 运营: 98, 内控: 98, 舆情: 95, 创新: 96, 安全: 99 },
      metrics: [95, 94, 97, 93, 88, 85, 94, 95, 96],
      overview: { done: "0.76 亿", target: "0.86 亿", progress: "88%", contract: "0.28亿", cash: "0.09亿", receivable: "0.12亿", payable: "0.05亿", cost: "0.52亿", projects: "28个", collection: "96.1%", overdue: "0.02亿" }
    },
    "公建服务公司": {
      scores: { 经营: 93, 运营: 94, 内控: 97, 舆情: 93, 创新: 84, 安全: 99 },
      metrics: [93, 91, 94, 88, 85, 82, 92, 93, 92],
      overview: { done: "1.48 亿", target: "1.82 亿", progress: "81%", contract: "0.35亿", cash: "0.13亿", receivable: "0.24亿", payable: "0.11亿", cost: "1.12亿", projects: "34个", collection: "91.7%", overdue: "0.07亿" }
    },
    "园区运营公司": {
      scores: { 经营: 94, 运营: 95, 内控: 96, 舆情: 94, 创新: 91, 安全: 98 },
      metrics: [94, 93, 95, 89, 86, 84, 92, 94, 93],
      overview: { done: "1.76 亿", target: "1.98 亿", progress: "89%", contract: "0.37亿", cash: "0.18亿", receivable: "0.28亿", payable: "0.09亿", cost: "1.36亿", projects: "31个", collection: "94.3%", overdue: "0.06亿" }
    }
  };
  const overviewExtras = {
    "大湾区区域公司": { profit: "0.83 亿", profitTarget: "0.94 亿", profitProgress: "88.3%", employees: "420人" },
    "华东区域公司": { profit: "0.78 亿", profitTarget: "0.86 亿", profitProgress: "90.7%", employees: "360人" },
    "华南区域公司": { profit: "0.47 亿", profitTarget: "0.56 亿", profitProgress: "83.9%", employees: "310人" },
    "华中区域公司": { profit: "0.28 亿", profitTarget: "0.37 亿", profitProgress: "75.7%", employees: "230人" },
    "华北区域公司": { profit: "0.23 亿", profitTarget: "0.30 亿", profitProgress: "76.7%", employees: "205人" },
    "西南区域公司": { profit: "0.10 亿", profitTarget: "0.19 亿", profitProgress: "52.6%", employees: "160人" },
    "西北区域公司": { profit: "0.16 亿", profitTarget: "0.23 亿", profitProgress: "69.6%", employees: "145人" },
    "生活服务公司": { profit: "0.13 亿", profitTarget: "0.16 亿", profitProgress: "81.3%", employees: "175人" },
    "智慧运营公司": { profit: "0.17 亿", profitTarget: "0.20 亿", profitProgress: "85.0%", employees: "130人" },
    "公建服务公司": { profit: "0.21 亿", profitTarget: "0.28 亿", profitProgress: "75.0%", employees: "145人" },
    "园区运营公司": { profit: "0.26 亿", profitTarget: "0.28 亿", profitProgress: "92.9%", employees: "120人" }
  };
  const aggregationMetrics = {
    营业总收入: { key: "done", unit: "亿", desc: "统计期内已完成营业收入，各下级公司金额相加形成总部归集值。" },
    经营利润: { key: "profit", unit: "亿", desc: "统计期内实际形成的经营利润，各下级公司利润相加形成总部归集值。" },
    收入合约额: { key: "contract", unit: "亿", desc: "已签订并生效的收入合同金额，下钻查看区域和专业公司贡献。" },
    企业经营现金流: { key: "cash", unit: "亿", desc: "经营活动现金净流量，负值代表当前期间经营现金净流出。" },
    应收金额: { key: "receivable", unit: "亿", desc: "期末经营性应收余额，金额越高代表资金占压越高。" },
    应付金额: { key: "payable", unit: "亿", desc: "期末经营性应付余额，用于观察付款压力和供应商结算节奏。" },
    经营成本: { key: "cost", unit: "亿", desc: "统计期内经营成本发生额，各公司成本合计形成总部归集值。" },
    在管项目: { key: "projects", unit: "个", desc: "当前纳入经营管理口径的项目数量。" },
    综合收缴率: { key: "collection", unit: "%", desc: "实收金额占应收金额比例，总部为下级公司加权后的归集表现。" },
    员工数: { key: "employees", unit: "人", desc: "当前纳入经营管理口径的在册员工数量，各下级公司人数相加形成总部归集值。" },
    逾期应收金额: { key: "overdue", unit: "亿", desc: "已超合同账期仍未收回的应收余额，下钻用于定位重点清欠主体。" }
  };

  const escapeHtml = value => String(value ?? "").replace(/[&<>\"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[character]));
  const headquarterName = "深圳市天健城市服务有限公司";

  function parseOverviewNumber(value) {
    const text = String(value || "");
    const number = Number.parseFloat(text.replace(/[^\d.-]/g, ""));
    return Number.isFinite(number) ? number : 0;
  }

  function parseMoneyToYi(value) {
    const text = String(value || "");
    const number = parseOverviewNumber(text);
    if (text.includes("亿")) return number;
    if (text.includes("万")) return number / 10000;
    if (text.includes("元")) return number / 100000000;
    return Math.abs(number) >= 1000000 ? number / 100000000 : number;
  }

  function parsePeopleNumber(value) {
    const text = String(value || "");
    const number = parseOverviewNumber(text);
    return text.includes("万") ? number * 10000 : number;
  }

  function formatOverviewMoney(value, spaced = false) {
    const number = Number(value);
    const amount = (Number.isFinite(number) ? number : 0).toFixed(2).replace(/\.?0+$/, "");
    return spaced ? `${amount} 亿` : `${amount}亿`;
  }

  function formatOverviewPercent(value) {
    return `${value.toFixed(1)}%`;
  }

  function displayMetricValue(metric, value) {
    if (metric.unit === "人") {
      const people = parsePeopleNumber(value);
      return `${Math.round(Number.isFinite(people) ? people : 0)}人`;
    }
    if (metric.unit === "亿") return formatOverviewMoney(parseMoneyToYi(value));
    const amount = parseOverviewNumber(value);
    if (metric.unit === "%") return formatOverviewPercent(amount);
    if (metric.unit === "个") return `${Math.round(amount)}个`;
    return String(value || "-");
  }

  function normalizeHeadquarterOverview() {
    Object.entries(overviewExtras).forEach(([name, extra]) => {
      if (companyProfiles[name]) companyProfiles[name].overview = { ...companyProfiles[name].overview, ...extra };
    });
    const headquarter = companyProfiles[headquarterName]?.overview;
    if (!headquarter) return;
    const children = companies
      .filter(company => company.name !== headquarterName)
      .map(company => companyProfiles[company.name]?.overview)
      .filter(Boolean);
    const moneyKeys = new Set(["done", "target", "profit", "profitTarget", "contract", "cash", "receivable", "payable", "cost", "overdue"]);
    const sum = key => children.reduce((total, overview) => {
      if (moneyKeys.has(key)) return total + parseMoneyToYi(overview[key]);
      if (key === "employees") return total + parsePeopleNumber(overview[key]);
      return total + parseOverviewNumber(overview[key]);
    }, 0);
    const done = sum("done");
    const target = sum("target");
    const profit = sum("profit");
    const profitTarget = sum("profitTarget");
    const receivable = sum("receivable");
    headquarter.done = formatOverviewMoney(done, true);
    headquarter.target = formatOverviewMoney(target, true);
    headquarter.progress = target ? formatOverviewPercent(done / target * 100) : "-";
    headquarter.contract = formatOverviewMoney(sum("contract"));
    headquarter.cash = formatOverviewMoney(sum("cash"));
    headquarter.receivable = formatOverviewMoney(receivable);
    headquarter.payable = formatOverviewMoney(sum("payable"));
    headquarter.cost = formatOverviewMoney(sum("cost"));
    headquarter.projects = `${Math.round(sum("projects"))}个`;
    headquarter.overdue = formatOverviewMoney(sum("overdue"));
    headquarter.profit = formatOverviewMoney(profit, true);
    headquarter.profitTarget = formatOverviewMoney(profitTarget, true);
    headquarter.profitProgress = profitTarget ? formatOverviewPercent(profit / profitTarget * 100) : "-";
    headquarter.employees = `${Math.round(sum("employees"))}人`;
    const collectionWeightedTotal = children.reduce((total, overview) => {
      return total + parseMoneyToYi(overview.receivable) * parseOverviewNumber(overview.collection);
    }, 0);
    headquarter.collection = receivable ? formatOverviewPercent(collectionWeightedTotal / receivable) : "-";
  }

  normalizeHeadquarterOverview();

  function markFrameReady(frame, route) {
    if (frame.classList.contains("is-ready")) return;
    frame.dataset.loaded = "true";
    applyScope(frame);
    requestAnimationFrame(() => frame.classList.add("is-ready"));
    if (frame.dataset.pendingRoute === "true" && requestedRoute === route) {
      frame.dataset.pendingRoute = "false";
      activateFrame(route);
    }
  }

  initialFrame.addEventListener("load", () => markFrameReady(initialFrame, "overview"));
  if (initialFrame.contentDocument?.readyState === "complete") markFrameReady(initialFrame, "overview");

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 1900);
  }

  function ensureFrame(route) {
    if (!files[route]) return null;
    if (frames.has(route)) return frames.get(route);
    const frame = document.createElement("iframe");
    frame.className = "route-frame";
    frame.dataset.routeFrame = route;
    frame.title = `企业经营管理驾驶舱${route.startsWith("ranking") ? "排行" : route === "supervision" ? "督办" : "总览"}`;
    frame.src = `./${files[route]}`;
    frame.addEventListener("load", () => markFrameReady(frame, route));
    stack.appendChild(frame);
    frames.set(route, frame);
    return frame;
  }

  function scopeProfile() {
    return companyProfiles[selectedScope] || companyProfiles[headquarterName];
  }

  function scopedIndicatorData(name) {
    const source = window.PROTOTYPE_DATA?.indicators?.[name] || window.PROTOTYPE_DATA?.indicators?.经营;
    if (!source) return null;
    const profile = scopeProfile();
    const values = name === "经营" ? profile.metrics : null;
    const metrics = source.metrics.map((metric, index) => ({
      ...metric,
      value: values ? values[index] ?? metric.value : Math.max(70, Math.min(100, metric.value + (profile.scores[name] || source.score) - source.score))
    }));
    return {
      ...source,
      company: selectedScope,
      score: profile.scores[name] || source.score,
      metrics
    };
  }

  function findCardValueByLabel(doc, label) {
    const labelNode = [...doc.querySelectorAll("span")].find(node => (node.textContent || "").trim() === label);
    let current = labelNode?.parentElement;
    for (let depth = 0; current && depth < 8; depth += 1, current = current.parentElement) {
      const value = current.querySelector('[data-name="Bold Text"] span');
      if (value) return value;
    }
    return null;
  }

  function findMetricCardByLabel(doc, label) {
    const labelNode = [...doc.querySelectorAll("span")].find(node => (node.textContent || "").trim() === label);
    let current = labelNode?.parentElement;
    for (let depth = 0; current && depth < 10; depth += 1, current = current.parentElement) {
      if ((current.textContent || "").includes(label) && current.querySelector('[data-name="Bold Text"] span')) return current;
    }
    return null;
  }

  function updateCompletionCard(doc, label, progress, done, target) {
    const card = findMetricCardByLabel(doc, label);
    if (!card) return;
    const progressNode = card.querySelector('[data-name="Bold Text"] span');
    if (progressNode) progressNode.textContent = progress;
    const summaryNode = [...card.querySelectorAll("span")].find(node => (node.textContent || "").includes("已完成"));
    if (summaryNode) summaryNode.textContent = `已完成 ${done} / 目标 ${target} · 剩余 ${overviewRemaining(done, target)}`;
    const targetNode = [...card.querySelectorAll("span")].find(node => (node.textContent || "").includes("目标线"));
    if (targetNode) targetNode.textContent = `目标线 ${target}`;
  }

  function updateDomainScores(doc, scores) {
    if (!String(doc.title || "").includes("总览")) return;
    domains.forEach(domain => {
      const labels = [`${domain}板块`, domain];
      labels.forEach(label => {
        [...doc.querySelectorAll("span")].filter(node => (node.textContent || "").trim() === label).forEach(labelNode => {
          const card = labelNode.closest('[data-name="Button"], [data-name="Container"]') || labelNode.parentElement?.parentElement;
          const value = [...(card?.querySelectorAll("span") || [])].find(node => /^\d{2,3}$/.test((node.textContent || "").trim()) && node !== labelNode);
          if (value && scores[domain] !== undefined) value.textContent = String(scores[domain]);
        });
      });
    });
  }

  function updateOverviewNumbers(doc, profile) {
    if (!String(doc.title || "").includes("总览")) return;
    const overview = profile.overview;
    updateCompletionCard(doc, "营业总收入指标完成度", overview.progress, overview.done, overview.target);
    updateCompletionCard(doc, "经营利润指标完成度", overview.profitProgress, overview.profit, overview.profitTarget);
    const values = {
      收入合约额: displayMetricValue(aggregationMetrics.收入合约额, overview.contract),
      企业经营现金流: displayMetricValue(aggregationMetrics.企业经营现金流, overview.cash),
      应收金额: displayMetricValue(aggregationMetrics.应收金额, overview.receivable),
      应付金额: displayMetricValue(aggregationMetrics.应付金额, overview.payable),
      经营成本: displayMetricValue(aggregationMetrics.经营成本, overview.cost),
      在管项目: displayMetricValue(aggregationMetrics.在管项目, overview.projects),
      综合收缴率: displayMetricValue(aggregationMetrics.综合收缴率, overview.collection),
      员工数: displayMetricValue(aggregationMetrics.员工数, overview.employees),
      逾期应收金额: displayMetricValue(aggregationMetrics.逾期应收金额, overview.overdue)
    };
    Object.entries(values).forEach(([label, value]) => {
      const node = findCardValueByLabel(doc, label);
      if (node) node.textContent = value;
    });
  }

  function overviewRemaining(doneText, targetText) {
    const done = parseMoneyToYi(doneText);
    const target = parseMoneyToYi(targetText);
    if (!Number.isFinite(done) || !Number.isFinite(target)) return "";
    return formatOverviewMoney(Math.max(0, target - done), true);
  }

  function numericValue(value) {
    return parseOverviewNumber(value);
  }

  function metricAmount(metric, value) {
    if (metric.unit === "亿") return parseMoneyToYi(value);
    if (metric.unit === "人") return parsePeopleNumber(value);
    return parseOverviewNumber(value);
  }

  function aggregationRows(metric) {
    const headquarter = companies.find(company => company.name === headquarterName);
    const children = companies.filter(company => company.name !== headquarterName);
    return [headquarter, ...children].filter(Boolean).map(company => {
      const sourceValue = companyProfiles[company.name]?.overview?.[metric.key] || "-";
      const value = displayMetricValue(metric, sourceValue);
      return {
        company,
        value,
        amount: metricAmount(metric, sourceValue)
      };
    });
  }

  function aggregationShare(row, rows, metric) {
    if (metric.unit === "%") return row.company.type;
    const total = rows[0]?.amount || 0;
    if (!total || row.company.name === headquarterName) return "归集总计";
    return `占比 ${Math.max(0, row.amount / total * 100).toFixed(1)}%`;
  }

  function renderAggregationBreakdown(label) {
    const metric = aggregationMetrics[label] || aggregationMetrics.营业总收入;
    const rows = aggregationRows(metric);
    const summary = rows.find(row => row.company.name === selectedScope) || rows[0];
    return `
      <div class="aggregation-summary">
        <span>${escapeHtml(summary.company.name)}</span>
        <strong>${escapeHtml(summary.value)}</strong>
        <p>${escapeHtml(metric.desc)}</p>
      </div>
      <div class="aggregation-list">
        ${rows.map((row, index) => `
          <article class="aggregation-row ${row.company.name === selectedScope ? "is-current" : ""} ${index === 0 ? "is-total" : ""}">
            <span class="aggregation-badge">${escapeHtml(row.company.short)}</span>
            <div class="aggregation-main">
              <div><b>${escapeHtml(row.company.name)}</b>${row.company.name === selectedScope ? "<i>当前</i>" : ""}</div>
              <p>${escapeHtml(row.company.type)} · ${escapeHtml(row.company.region)} · ${escapeHtml(aggregationShare(row, rows, metric))}</p>
            </div>
            <strong>${escapeHtml(row.value)}</strong>
          </article>
        `).join("")}
      </div>`;
  }

  function applyScope(frame) {
    try {
      const company = frame.contentDocument?.querySelector('[data-name="天健城市服务有限公司"]');
      if (company) company.textContent = selectedScope;
      const doc = frame.contentDocument;
      const profile = scopeProfile();
      if (doc) {
        updateDomainScores(doc, profile.scores);
        updateOverviewNumbers(doc, profile);
      }
    } catch (error) {
      // All prototype frames are same-origin; this guard keeps navigation safe
      // if the files are opened from a different host during handoff.
    }
  }

  function activateFrame(route) {
    const next = frames.get(route);
    if (!next) return;
    const previous = frames.get(currentRoute);
    next.classList.add("is-active");
    next.setAttribute("aria-hidden", "false");
    if (previous && previous !== next) {
      previous.classList.remove("is-active");
      previous.setAttribute("aria-hidden", "true");
    }
    currentRoute = route;
    requestedRoute = route;
  }

  function navigate(route) {
    if (!files[route] || route === currentRoute || route === requestedRoute) return;
    requestedRoute = route;
    closeModal();
    closeSheet();
    closeCompanySelector();
    const frame = ensureFrame(route);
    if (frame.dataset.loaded === "true") {
      activateFrame(route);
      return;
    }
    frame.dataset.pendingRoute = "true";
    showToast("正在打开页面…");
  }

  function openIndicator(name) {
    const data = scopedIndicatorData(name);
    if (!data) return;
    activeIndicatorName = name;
    modalTitle.textContent = "指标健康情况";
    const healthy = data.metrics.filter(metric => metric.value >= 90).length;
    const segmentCount = data.metrics.length;
    const activeSegments = healthy;
    modalContent.innerHTML = `
      <div class="indicator-summary">
        <div class="summary-line"><span>当前综合分</span><strong class="summary-score">${data.score}</strong></div>
        <div class="summary-track">${Array.from({ length: segmentCount }, (_, index) => `<i class="${index < activeSegments ? "is-filled" : ""}"></i>`).join("")}</div>
        <div class="summary-meta">年度指标 ${data.metrics.length} 项 / 已达标 ${healthy} 项</div>
      </div>
      <div class="scope-field"><label>按公司分类</label><button type="button" data-modal-scope><span class="scope-dot"></span><span>${escapeHtml(selectedScope)}</span><span class="scope-chevron" aria-hidden="true"></span></button></div>
      <div class="metric-list">${data.metrics.map(metric => `
        <details class="metric-item">
          <summary>
            <div class="metric-head"><span class="metric-name">${escapeHtml(metric.name)}</span><span class="metric-weight">权重 ${metric.weight}%</span><strong class="metric-value">${metric.value}<small>%</small></strong></div>
            <p class="metric-copy">指标权重 ${metric.weight}% · 数据来源：${escapeHtml(metric.source)}</p>
            <div class="metric-track"><i style="width:${metric.value}%"></i></div>
            <div class="metric-foot"><span>口径：${escapeHtml(metric.calculation)}</span><span>${metric.value >= 90 ? "达标" : "持续推进"}</span></div>
          </summary>
          <div class="metric-detail-grid">
            <div class="metric-detail-row"><b>指标定义</b><span>${escapeHtml(metric.definition)}</span></div>
            <div class="metric-detail-row"><b>计算口径</b><span>${escapeHtml(metric.calculation)}</span></div>
            <div class="metric-detail-row"><b>评分标准</b><span>${escapeHtml(metric.standard)}</span></div>
            <div class="metric-detail-row"><b>红线规则</b><span>${escapeHtml(metric.redline)}</span></div>
            <div class="metric-detail-row"><b>项目层穿透</b><span>${escapeHtml(metric.project)}</span></div>
            <div class="metric-detail-row"><b>区域层穿透</b><span>${escapeHtml(metric.region)}</span></div>
            <div class="metric-detail-row"><b>本部层穿透</b><span>${escapeHtml(metric.hq)}</span></div>
            <div class="metric-detail-row"><b>数据说明</b><span>指标定义来自正式说明表；当前分值为交互原型仿真值。${data.weightTotal !== 100 ? `${name}板块原表权重合计 ${data.weightTotal}%，已保留原始权重。` : ""}</span></div>
          </div>
        </details>`).join("")}</div>`;
    modal.hidden = false;
  }

  function closeModal() { modal.hidden = true; }
  function closeSheet() { sheet.hidden = true; sheetContent.innerHTML = ""; sheet.dataset.returnIndicator = ""; }
  function closeCompanyConfirm() { companyConfirm.hidden = true; pendingScope = ""; }
  function closeCompanySelector() {
    closeCompanyConfirm();
    companyPage.hidden = true;
    companyPage.dataset.returnIndicator = "";
  }

  const normalizeSearch = value => String(value || "").toLowerCase().replace(/\s+/g, "");

  function fuzzyMatch(source, query) {
    const haystack = normalizeSearch(source);
    const needle = normalizeSearch(query);
    if (!needle) return true;
    if (haystack.includes(needle)) return true;
    let cursor = 0;
    for (const character of needle) {
      cursor = haystack.indexOf(character, cursor);
      if (cursor === -1) return false;
      cursor += 1;
    }
    return true;
  }

  function companySearchText(company) {
    return [company.name, company.short, company.code, company.region, company.type, company.desc, ...(company.aliases || [])].join(" ");
  }

  function renderCompanySelector() {
    const query = companySearchInput.value.trim();
    const matches = companies.filter(company => fuzzyMatch(companySearchText(company), query));
    companyCurrentName.textContent = selectedScope;
    companyResultMeta.textContent = query ? `找到 ${matches.length} 个匹配公司` : `全部公司 ${companies.length} 家`;
    companyList.innerHTML = matches.length
      ? matches.map(company => {
          const selected = company.name === selectedScope;
          return `<button class="company-option ${selected ? "is-selected" : ""}" type="button" role="option" aria-selected="${selected}" data-company-option="${escapeHtml(company.name)}">
            <span class="company-avatar">${escapeHtml(company.short)}</span>
            <span class="company-option-main">
              <span class="company-option-title"><b>${escapeHtml(company.name)}</b>${selected ? "<i>当前</i>" : ""}</span>
              <p>${escapeHtml(company.code)} · ${escapeHtml(company.region)} · ${escapeHtml(company.desc)}</p>
            </span>
            <span class="company-check">✓</span>
          </button>`;
        }).join("")
      : `<div class="company-empty">没有找到匹配公司，请尝试输入区域、公司简称或编码。</div>`;
  }

  function openCompanySelector(payload = {}) {
    closeModal();
    closeSheet();
    closeCompanyConfirm();
    companyPage.dataset.returnIndicator = payload.returnIndicator || "";
    companySearchInput.value = "";
    companyPage.hidden = false;
    renderCompanySelector();
    requestAnimationFrame(() => companySearchInput.focus());
  }

  function openCompanyConfirm(name) {
    const company = companies.find(item => item.name === name);
    if (!company) return;
    pendingScope = company.name;
    companyConfirmTitle.textContent = company.name === selectedScope ? "当前已选择该公司" : "确认切换公司？";
    companyConfirmCopy.textContent = company.name === selectedScope
      ? `当前统计范围已经是「${company.name}」，确认后将保持当前范围。`
      : `将统计范围从「${selectedScope}」切换至「${company.name}」，所有已加载页面会同步刷新顶部公司名称。`;
    companyConfirm.hidden = false;
  }

  function confirmCompanySelection() {
    if (!pendingScope) return;
    const returnIndicator = companyPage.dataset.returnIndicator;
    selectedScope = pendingScope;
    frames.forEach(frame => applyScope(frame));
    closeCompanySelector();
    showToast(`已切换至${selectedScope}`);
    if (returnIndicator) openIndicator(returnIndicator);
  }

  function openSheet(type, payload = {}) {
    if (type === "scope") {
      openCompanySelector(payload);
      return;
    }
    closeModal();
    sheet.hidden = false;
    if (type === "menu") {
      sheetEyebrow.textContent = "工作台设置";
      sheetTitle.textContent = "个人快捷操作";
      sheetContent.innerHTML = `<div class="sheet-list"><button class="menu-action" type="button" data-menu-action="profile"><span>个人信息与权限</span><span>›</span></button><button class="menu-action" type="button" data-menu-action="notice"><span>消息通知设置</span><span>›</span></button><button class="menu-action" type="button" data-menu-action="refresh"><span>刷新全部驾驶舱数据</span><span>›</span></button><button class="menu-action" type="button" data-menu-action="about"><span>关于企业经营管理驾驶舱</span><span>›</span></button></div>`;
    } else if (type === "aggregation") {
      const label = aggregationMetrics[payload.metric] ? payload.metric : "营业总收入";
      sheetEyebrow.textContent = "数据穿透";
      sheetTitle.textContent = `${label}明细`;
      sheetContent.innerHTML = renderAggregationBreakdown(label);
    } else if (type === "feed") {
      sheetEyebrow.textContent = "动态中心";
      sheetTitle.textContent = "最近更新动态";
      const items = [
        ["2026-07-21", "华中区域公司督办事项更新", "4 项事项新增跟进记录", "已更新"],
        ["2026-07-20", "安全隐患闭环数据同步", "西南区域新增 12 条闭环记录", "已同步"],
        ["2026-07-18", "经营指标口径完成校准", "收入、利润与现金流指标已校准", "已完成"],
        ["2026-07-16", "客户满意度月度数据更新", "本月有效样本 2,184 份", "已更新"]
      ];
      sheetContent.innerHTML = `<div class="sheet-list">${items.map(item => `<article class="sheet-card"><h3>${item[1]} <span class="status-pill">${item[3]}</span></h3><p>${item[2]}</p><footer><span>${item[0]}</span><span>查看记录 ›</span></footer></article>`).join("")}</div>`;
    } else if (type === "search") {
      sheetEyebrow.textContent = "全局检索";
      sheetTitle.textContent = "搜索督办与经营事项";
      sheetContent.innerHTML = `<label class="sheet-search"><span>⌕</span><input id="global-search-input" type="search" placeholder="输入标题、区域或指标" autofocus /></label><p id="search-result-count" class="search-result-count">输入关键词查看匹配结果</p><div id="search-results" class="sheet-list"></div>`;
      const input = document.getElementById("global-search-input");
      input.addEventListener("input", () => renderSearchResults(input.value));
      input.focus();
    } else if (type === "supervision-tab") {
      sheetEyebrow.textContent = "督办事项";
      sheetTitle.textContent = payload.label || "事项详情";
      sheetContent.innerHTML = `<div class="sheet-list"><article class="sheet-card"><h3>${payload.label || "当前事项列表"}</h3><p>已按当前状态筛选事项。页面列表同步展示 ${payload.label === "办结事项（含持续更新）" ? "已完成及持续跟踪" : "推进中"} 的重点任务。</p><footer><span>数据更新时间 2026-07-23 09:30</span><span class="status-pill">已同步</span></footer></article></div>`;
    } else if (type === "all-indicators") {
      sheetEyebrow.textContent = "六大领域";
      sheetTitle.textContent = "全部正式指标";
      const indicators = window.PROTOTYPE_DATA?.indicators || {};
      sheetContent.innerHTML = `<div class="sheet-list">${Object.entries(indicators).map(([name, item]) => `<button type="button" class="sheet-option" data-open-indicator="${name}"><span><b>${name}板块</b><small style="display:block;color:#8a96aa;margin-top:3px;font-size:9px">${item.metrics.length} 项正式指标 · 权重合计 ${item.weightTotal}%</small></span><span class="status-pill ${item.score < 90 ? "warn" : ""}">${item.score} 分</span></button>`).join("")}</div>`;
    } else {
      sheetEyebrow.textContent = payload.eyebrow || "事项详情";
      sheetTitle.textContent = payload.title || "查看详情";
      sheetContent.innerHTML = `<article class="sheet-card"><h3>${payload.title || "事项详情"}</h3><p>${payload.description || "已打开该模块的仿真详情。你可以继续使用页面中的筛选、切换和查看动作。"}</p><footer><span>数据更新时间 2026-07-23 09:30</span><span class="status-pill">可跟进</span></footer></article>`;
    }
  }

  function renderSearchResults(keyword) {
    const result = document.getElementById("search-results");
    const count = document.getElementById("search-result-count");
    if (!result || !count) return;
    const query = keyword.trim();
    const records = [
      ["华中区域公司督办事项更新", "督办 · 华中区域", "推进中"],
      ["营业总收入指标完成度", "经营 · 财务系统", "98 分"],
      ["年度审计问题整改率", "内控 · 审计台账", "99 分"],
      ["客户满意度月度回访", "运营 · 客服系统", "97 分"],
      ["网络安全事故监测", "安全 · 运维平台", "零事故"]
    ];
    const matches = query ? records.filter(item => item.join(" ").includes(query)) : records;
    count.textContent = query ? `找到 ${matches.length} 条匹配结果` : "最近访问与重点数据";
    result.innerHTML = matches.map(item => `<button type="button" class="sheet-option" data-search-result="${escapeHtml(item[0])}"><span><b>${escapeHtml(item[0])}</b><small style="display:block;color:#8a96aa;margin-top:3px;font-size:9px">${escapeHtml(item[1])}</small></span><span class="status-pill">${escapeHtml(item[2])}</span></button>`).join("");
  }

  companySearchInput.addEventListener("input", renderCompanySelector);

  document.addEventListener("click", event => {
    const target = event.target.closest("[data-close-modal], [data-close-sheet], [data-close-company], [data-company-option], [data-confirm-company], [data-cancel-company], [data-scope-option], [data-menu-action], [data-search-result], [data-open-indicator], [data-modal-scope]");
    if (!target) return;
    if (target.dataset.closeModal !== undefined) closeModal();
    if (target.dataset.closeSheet !== undefined) closeSheet();
    if (target.dataset.closeCompany !== undefined) closeCompanySelector();
    if (target.dataset.companyOption) openCompanyConfirm(target.dataset.companyOption);
    if (target.dataset.cancelCompany !== undefined) closeCompanyConfirm();
    if (target.dataset.confirmCompany !== undefined) confirmCompanySelection();
    if (target.dataset.modalScope !== undefined) {
      const returnIndicator = activeIndicatorName;
      openCompanySelector({ returnIndicator });
    }
    if (target.dataset.scopeOption) {
      const returnIndicator = sheet.dataset.returnIndicator;
      selectedScope = target.dataset.scopeOption;
      frames.forEach(frame => applyScope(frame));
      showToast(`已切换至${selectedScope}`);
      closeSheet();
      if (returnIndicator) openIndicator(returnIndicator);
    }
    if (target.dataset.menuAction) { showToast({ profile: "个人信息已打开", notice: "通知设置已打开", refresh: "数据刷新任务已提交", about: "当前为企业经营管理驾驶舱交互原型" }[target.dataset.menuAction]); }
    if (target.dataset.searchResult) { showToast(`已定位：${target.dataset.searchResult}`); closeSheet(); }
    if (target.dataset.openIndicator) { const name = target.dataset.openIndicator; closeSheet(); openIndicator(name); }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (!companyConfirm.hidden) closeCompanyConfirm();
      else if (!companyPage.hidden) closeCompanySelector();
      else { closeModal(); closeSheet(); }
    }
  });
  window.addEventListener("message", event => {
    const message = event.data;
    if (!message || message.source !== "mastergo-prototype") return;
    if (message.action === "navigate") navigate(message.route);
    if (message.action === "open-indicator") openIndicator(message.indicator);
    if (message.action === "open-control") openSheet(message.control, message);
    if (message.action === "show-toast") showToast(message.text);
  });

  window.prototypeApp = { navigate, openIndicator, openSheet, getCurrentRoute: () => currentRoute };
  // Warm the most-used routes without changing the visible page. Any route
  // that is still loading keeps the current frame visible until it is ready.
  ["ranking", "supervision"].forEach(route => ensureFrame(route));
})();
