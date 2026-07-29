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
  const routeLabels = {
    overview: "总览",
    ranking: "排行",
    supervision: "督办"
  };
  const menuActions = [
    { key: "profile", title: "个人中心", desc: "密码修改、名称修改与权限信息", badge: "账" },
    { key: "notice", title: "消息通知", desc: "手机提醒授权、微信与悬浮提醒", badge: "消" },
    { key: "refresh", title: "刷新数据", desc: "刷新日志、接口异常与同步状态", badge: "刷" },
    { key: "about", title: "关于系统", desc: "产品说明、版本发布与新功能指引", badge: "版" }
  ];
  const feedRecords = [
    {
      id: "feed-supervision-001",
      module: "督办",
      date: "2026-07-29 09:20",
      title: "华中区域公司重点工作进度更新",
      summary: "武汉金融城项目停车场改造事项新增节点反馈，当前进入采购比价阶段。",
      company: "华中区域公司",
      project: "武汉金融城综合物业项目",
      projectCode: "CC-WH-023",
      owner: "周敏",
      role: "华中区域公司项目负责人",
      phone: "138-0271-5608",
      status: "推进中",
      priority: "重点工作",
      source: "督办台账",
      nextStep: "7月31日前完成供应商比价，8月3日前提交改造排期。",
      history: ["2026-07-29 09:20 采购清单已补充完成", "2026-07-28 16:10 现场施工边界已确认", "2026-07-26 10:30 事项纳入重点督办"]
    },
    {
      id: "feed-ranking-001",
      module: "排行",
      date: "2026-07-29 08:50",
      title: "西南区域公司收缴率排行预警",
      summary: "西南区域本月综合收缴率低于总部均值，成都城南项目贡献主要偏差。",
      company: "西南区域公司",
      project: "成都城南政务中心项目",
      projectCode: "SW-CD-017",
      owner: "李文强",
      role: "西南区域公司经营负责人",
      phone: "139-0803-4126",
      status: "预警",
      priority: "经营风险",
      source: "排行分析",
      nextStep: "跟进逾期大额客户回款，7月30日前反馈专项清收计划。",
      history: ["2026-07-29 08:50 收缴率排行触发预警", "2026-07-28 18:00 应收明细完成核对", "2026-07-27 11:20 项目经理提交回款说明"]
    },
    {
      id: "feed-overview-001",
      module: "总览",
      date: "2026-07-28 18:05",
      title: "智慧运营公司能耗数据同步完成",
      summary: "深圳湾园区项目能耗指标完成口径校准，已同步到运营指标卡片。",
      company: "智慧运营公司",
      project: "深圳湾智慧园区项目",
      projectCode: "SO-SZ-009",
      owner: "陈晓琳",
      role: "智慧运营公司运营负责人",
      phone: "137-9832-6115",
      status: "已同步",
      priority: "基础工作",
      source: "总览指标",
      nextStep: "持续观察本周空调主机能耗，异常波动超过5%自动提醒。",
      history: ["2026-07-28 18:05 能耗数据同步完成", "2026-07-28 15:40 数据接口完成重试", "2026-07-28 10:15 项目侧确认计量点位"]
    },
    {
      id: "feed-supervision-002",
      module: "督办",
      date: "2026-07-28 14:12",
      title: "公建服务公司接口异常回退记录",
      summary: "督办接口返回空值，系统已回退缓存数据并记录项目责任人。",
      company: "公建服务公司",
      project: "市民中心公共建筑服务项目",
      projectCode: "PB-SZ-031",
      owner: "王凯",
      role: "公建服务公司信息联络人",
      phone: "136-0308-7752",
      status: "待复核",
      priority: "接口异常",
      source: "数据同步",
      nextStep: "信息化接口组复核空值字段，项目负责人确认当日督办状态。",
      history: ["2026-07-28 14:12 接口返回空值并回退缓存", "2026-07-28 14:05 自动重试2次未恢复", "2026-07-28 13:55 同步任务启动"]
    },
    {
      id: "feed-overview-002",
      module: "总览",
      date: "2026-07-27 17:30",
      title: "园区运营公司收入合约额更新",
      summary: "南山科技园项目新增服务合约已归集到总部经营指标。",
      company: "园区运营公司",
      project: "南山科技园综合运营项目",
      projectCode: "PO-SZ-015",
      owner: "赵嘉怡",
      role: "园区运营公司商务负责人",
      phone: "135-1019-2488",
      status: "已更新",
      priority: "经营数据",
      source: "总览指标",
      nextStep: "8月5日前完成合同归档，并同步首期回款计划。",
      history: ["2026-07-27 17:30 合约额更新到总览", "2026-07-27 15:10 商务系统完成合同复核", "2026-07-26 09:40 项目提交新增合同"]
    }
  ];
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

  const companySearchHints = {
    "深圳市天健城市服务有限公司": "tj sz tianjian shenzhen zongbu jituan csfw",
    "大湾区区域公司": "dwq wq gba dawanqu wanqu yuegangao shenzhen guangzhou zhuhai",
    "华东区域公司": "hd ec huadong shanghai hangzhou nanjing",
    "华南区域公司": "hn sc huanan guangdong guangxi hainan",
    "华中区域公司": "hz cc huazhong wuhan changsha zhengzhou",
    "华北区域公司": "hb nc huabei beijing tianjin hebei",
    "西南区域公司": "xn sw xinan chengdu chongqing kunming",
    "西北区域公司": "xb nw xibei xian lanzhou yinchuan",
    "生活服务公司": "sh ls shenghuo shequ daojia",
    "智慧运营公司": "zhyy zy so zhihuiyunying shuzi gongdan nenghao",
    "公建服务公司": "gj pb gongjian gonggongjianzhu zhengqi",
    "园区运营公司": "yq po yuanqu chanye shangye zhaoshang"
  };

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

  function indicatorChildCompanies() {
    return companies.filter(company => company.name !== headquarterName);
  }

  function metricBusinessMeasure(metricName, overview) {
    const map = {
      营业总收入指标完成度: { key: "progress", unit: "%" },
      经营利润指标完成度: { key: "profitProgress", unit: "%" },
      收入合约额: { key: "contract", unit: "亿" },
      企业经营现金流: { key: "cash", unit: "亿" },
      应收金额: { key: "receivable", unit: "亿" },
      逾期应收金额: { key: "overdue", unit: "亿" },
      应付金额: { key: "payable", unit: "亿" },
      经营成本: { key: "cost", unit: "亿" },
      综合收缴率: { key: "collection", unit: "%" }
    };
    const config = map[metricName];
    if (!config) return "";
    return displayMetricValue(config, overview?.[config.key]);
  }

  function metricCompanyValue(domain, metric, index, companyIndex, profile, source) {
    if (domain === "经营") return profile.metrics?.[index] ?? metric.value;
    const offset = [0.8, -0.4, 0.2, -0.7, 0.4, -1.1, -0.2, 0.3, -0.5, 0.1, -0.3][companyIndex] || 0;
    const domainShift = (profile.scores?.[domain] || source.score) - source.score;
    return Math.max(60, Math.min(100, Number((metric.value + domainShift + offset).toFixed(1))));
  }

  function metricMeasureText(domain, metric, value, profile) {
    if (domain === "经营") return metricBusinessMeasure(metric.name, profile.overview) || `${value}%`;
    if (metric.name.includes("事故")) return value >= 98 ? "0起" : "1起";
    if (metric.name.includes("投诉") || metric.name.includes("舆情")) return metric.name.includes("数量") || metric.name.includes("事件数") ? `${Math.max(0, Math.round((100 - value) / 6))}件` : `${value}%`;
    if (metric.name.includes("时长")) return `${Math.max(8, Math.round((108 - value) * 1.2))}小时`;
    if (metric.name.includes("合同")) return formatOverviewMoney(Math.max(0.03, (value - 80) / 100));
    if (metric.name.includes("知识产权")) return `${Math.round(value)}分`;
    return `${value}%`;
  }

  function renderMetricBreakdown(domain, metric, index, source) {
    const headquarter = companyProfiles[headquarterName];
    const rows = indicatorChildCompanies().map((company, companyIndex) => {
      const profile = companyProfiles[company.name];
      const value = metricCompanyValue(domain, metric, index, companyIndex, profile, source);
      return {
        company,
        value,
        measure: metricMeasureText(domain, metric, value, profile),
        status: value >= 90 ? "达标" : value >= 85 ? "跟进" : "预警"
      };
    });
    const hqMeasure = domain === "经营"
      ? metricBusinessMeasure(metric.name, headquarter.overview) || `${metric.value}分`
      : metricMeasureText(domain, metric, metric.value, headquarter);
    const achieved = rows.filter(row => row.value >= 90).length;
    const regionRows = rows.filter(row => row.company.type === "区域公司");
    const professionalRows = rows.filter(row => row.company.type === "专业公司");
    const groupMeta = items => `${items.length} 家 · 达标 ${items.filter(row => row.status === "达标").length} 家`;
    const renderRows = items => items.map(row => `
      <article class="metric-company-row ${row.status === "预警" ? "is-risk" : row.status === "跟进" ? "is-watch" : ""}">
        <span class="metric-company-avatar">${escapeHtml(row.company.short)}</span>
        <div class="metric-company-main">
          <div><b>${escapeHtml(row.company.name)}</b><i>${escapeHtml(row.company.type)}</i></div>
          <p>${escapeHtml(row.company.region)} · ${escapeHtml(row.status)}</p>
          <span class="metric-company-track"><em style="width:${Math.max(8, Math.min(100, row.value))}%"></em></span>
        </div>
        <strong class="metric-company-measure">${escapeHtml(row.measure)}</strong>
        <strong class="metric-company-score">${escapeHtml(row.value)}<em>分</em></strong>
      </article>`).join("");
    return `
      <div class="metric-detail-grid">
        <div class="metric-breakdown-summary">
          <div class="metric-breakdown-title">
            <span>深圳市天健城市服务有限公司</span>
            <strong>${escapeHtml(hqMeasure)}</strong>
          </div>
          <p>总部归集口径，按区域公司和专业公司两级展示同项指标数据。</p>
          <div class="metric-breakdown-stats"><b>${rows.length} 家下级公司</b><b>${achieved} 家达标</b><b>${rows.length - achieved} 家需跟进</b></div>
        </div>
        <div class="metric-breakdown-group">
          <h4><span>区域公司</span><em>${groupMeta(regionRows)}</em></h4>
          <div class="metric-company-header"><span>公司</span><span>业务值</span><span>得分</span></div>
          <div class="metric-company-list">${renderRows(regionRows)}</div>
        </div>
        <div class="metric-breakdown-group">
          <h4><span>专业公司</span><em>${groupMeta(professionalRows)}</em></h4>
          <div class="metric-company-header"><span>公司</span><span>业务值</span><span>得分</span></div>
          <div class="metric-company-list">${renderRows(professionalRows)}</div>
        </div>
      </div>`;
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

  function scopedFeedRecords() {
    if (selectedScope === headquarterName) return feedRecords;
    const matched = feedRecords.filter(item => item.company === selectedScope);
    return matched.length ? matched : feedRecords.map(item => ({ ...item, company: selectedScope })).slice(0, 3);
  }

  function feedStatusClass(status) {
    if (status.includes("预警") || status.includes("异常")) return "danger";
    if (status.includes("待") || status.includes("推进")) return "warn";
    return "";
  }

  function renderFeedList() {
    const records = scopedFeedRecords();
    const warningCount = records.filter(item => feedStatusClass(item.status)).length;
    return `
      <div class="feed-workbench">
        <article class="feed-summary">
          <span>当前范围</span>
          <strong>${escapeHtml(selectedScope)}</strong>
          <p>共 ${records.length} 条更新，其中 ${warningCount} 条需要关注。点击任一事项可查看公司、项目、负责人和联系电话。</p>
        </article>
        <div class="feed-list">
          ${records.map(record => `
            <button class="feed-item" type="button" data-feed-id="${escapeHtml(record.id)}">
              <span class="feed-item-top">
                <i>${escapeHtml(record.module)}</i>
                <em>${escapeHtml(record.date)}</em>
              </span>
              <b>${escapeHtml(record.title)}</b>
              <small>${escapeHtml(record.summary)}</small>
              <span class="feed-item-meta">
                <span>${escapeHtml(record.company)}</span>
                <span>${escapeHtml(record.project)}</span>
              </span>
              <span class="feed-item-foot">
                <span class="status-pill ${feedStatusClass(record.status)}">${escapeHtml(record.status)}</span>
                <span>${escapeHtml(record.owner)} · ${escapeHtml(record.phone)}</span>
              </span>
            </button>
          `).join("")}
        </div>
      </div>`;
  }

  function renderFeedDetail(id) {
    const record = scopedFeedRecords().find(item => item.id === id) || feedRecords[0];
    return `
      <div class="feed-detail">
        <div class="settings-page-head">
          <button class="settings-back" type="button" data-feed-back aria-label="返回">‹</button>
          <div class="settings-page-copy">
            <span>${escapeHtml(record.module)}动态</span>
            <strong>${escapeHtml(record.title)}</strong>
            <p>${escapeHtml(record.date)} · ${escapeHtml(record.status)}</p>
          </div>
        </div>
        <article class="feed-detail-card">
          <span class="status-pill ${feedStatusClass(record.status)}">${escapeHtml(record.priority)}</span>
          <h3>${escapeHtml(record.title)}</h3>
          <p>${escapeHtml(record.summary)}</p>
        </article>
        <div class="feed-info-grid">
          <div><b>相关公司</b><span>${escapeHtml(record.company)}</span></div>
          <div><b>相关项目</b><span>${escapeHtml(record.project)}</span></div>
          <div><b>项目编码</b><span>${escapeHtml(record.projectCode)}</span></div>
          <div><b>数据来源</b><span>${escapeHtml(record.source)}</span></div>
        </div>
        <article class="feed-contact">
          <div>
            <span>公司负责人</span>
            <strong>${escapeHtml(record.owner)}</strong>
            <p>${escapeHtml(record.role)}</p>
          </div>
          <button type="button" data-call-owner="${escapeHtml(record.phone)}">联系 ${escapeHtml(record.phone)}</button>
        </article>
        <article class="feed-detail-card">
          <h3>下一步计划</h3>
          <p>${escapeHtml(record.nextStep)}</p>
        </article>
        <details class="settings-disclosure" open>
          <summary>更新记录</summary>
          <div class="settings-log-list">
            ${record.history.map(item => {
              const parts = item.split(" ");
              return `<div class="settings-log-item"><b>${escapeHtml(parts.slice(0, 2).join(" "))}</b><span>${escapeHtml(parts.slice(2).join(" "))}</span></div>`;
            }).join("")}
          </div>
        </details>
      </div>`;
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
      frame.contentWindow?.postMessage({ source: "prototype-app", action: "scope-updated", scope: selectedScope }, "*");
      frame.contentWindow?.prototypeRanking?.setScope?.(selectedScope);
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
    const source = window.PROTOTYPE_DATA?.indicators?.[name] || window.PROTOTYPE_DATA?.indicators?.经营;
    const data = source ? { ...source, company: headquarterName } : scopedIndicatorData(name);
    if (!data) return;
    activeIndicatorName = name;
    modalTitle.textContent = "指标下钻明细";
    const healthy = data.metrics.filter(metric => metric.value >= 90).length;
    const segmentCount = data.metrics.length;
    const activeSegments = healthy;
    modalContent.innerHTML = `
      <div class="indicator-summary">
        <div class="summary-line"><span>当前综合分</span><strong class="summary-score">${data.score}</strong></div>
        <div class="summary-track">${Array.from({ length: segmentCount }, (_, index) => `<i class="${index < activeSegments ? "is-filled" : ""}"></i>`).join("")}</div>
        <div class="summary-meta">${headquarterName} · 年度指标 ${data.metrics.length} 项 / 已达标 ${healthy} 项</div>
      </div>
      <div class="metric-list">${data.metrics.map((metric, index) => `
        <details class="metric-item">
          <summary>
            <div class="metric-head"><span class="metric-name">${escapeHtml(metric.name)}</span><span class="metric-weight">权重 ${metric.weight}%</span><strong class="metric-value">${metric.value}<small>分</small></strong></div>
            <p class="metric-copy">指标权重 ${metric.weight}% · 数据来源：${escapeHtml(metric.source)}</p>
            <div class="metric-track"><i style="width:${metric.value}%"></i></div>
            <div class="metric-foot"><span>口径：${escapeHtml(metric.calculation)}</span><span>${metric.value >= 90 ? "达标" : "持续推进"}</span></div>
          </summary>
          ${renderMetricBreakdown(name, metric, index, source || data)}
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

  const normalizeSearch = value => String(value || "").toLowerCase().replace(/[\s·、，,。._\-()（）/\\]+/g, "");

  function fuzzyMatch(source, query) {
    const rawQuery = String(query || "").trim();
    if (!rawQuery) return true;
    const haystack = normalizeSearch(source);
    return rawQuery.split(/[\s,，、]+/).filter(Boolean).every(token => {
      const needle = normalizeSearch(token);
      if (!needle) return true;
      if (haystack.includes(needle)) return true;
      let cursor = 0;
      for (const character of needle) {
        cursor = haystack.indexOf(character, cursor);
        if (cursor === -1) return false;
        cursor += 1;
      }
      return true;
    });
  }

  function companySearchText(company) {
    return [company.name, company.short, company.code, company.region, company.type, company.desc, companySearchHints[company.name], ...(company.aliases || [])].join(" ");
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

  function currentRouteTitle() {
    if (routeLabels[currentRoute]) return routeLabels[currentRoute];
    if (String(currentRoute || "").startsWith("ranking")) return "排行";
    return "总览";
  }

  function renderMenuSheet() {
    return `
      <div class="menu-sheet">
        <section class="menu-hero">
          <div class="menu-hero-top">
            <div class="menu-hero-avatar" aria-hidden="true">集</div>
            <div class="menu-hero-copy">
              <strong>集团管理用户</strong>
              <span>总部经营管理部</span>
            </div>
          </div>
          <div class="menu-hero-tags">
            <span>当前范围</span>
            <strong>${escapeHtml(selectedScope)}</strong>
            <span>当前页面</span>
            <strong>${escapeHtml(currentRouteTitle())}</strong>
          </div>
        </section>
        <section class="menu-section">
          <div class="menu-section-head">
            <span>个人设置</span>
            <em>账号与消息</em>
          </div>
          <div class="menu-quick-list">
            ${menuActions.map(item => `
              <button class="menu-quick-item" type="button" data-menu-action="${item.key}">
                <span class="menu-quick-badge">${escapeHtml(item.badge)}</span>
                <span class="menu-quick-main">
                  <b>${escapeHtml(item.title)}</b>
                  <small>${escapeHtml(item.desc)}</small>
                </span>
                <i>›</i>
              </button>
            `).join("")}
          </div>
        </section>
        <button class="menu-signout" type="button" data-menu-action="logout">
          <span>
            <b>退出登录</b>
            <small>安全退出当前账号</small>
          </span>
          <i>↗</i>
        </button>
      </div>`;
  }

  function handleMenuAction(key) {
    if (key === "profile") {
      openSheet("menu-setting", { key: "profile" });
      return;
    }
    if (key === "notice") {
      openSheet("menu-setting", { key: "notice" });
      return;
    }
    if (key === "refresh") {
      openSheet("menu-setting", { key: "refresh" });
      return;
    }
    if (key === "about") {
      openSheet("menu-setting", { key: "about" });
      return;
    }
    if (key === "logout") {
      openSheet("logout-confirm");
    }
  }

  function renderSettingSheet(key) {
    if (key === "profile") {
      return `
        <div class="settings-page">
          <div class="settings-page-head">
            <button class="settings-back" type="button" data-setting-back aria-label="返回">‹</button>
            <div class="settings-page-copy">
              <span>个人设置</span>
              <strong>个人中心</strong>
              <p>账号维护、名称信息和权限核对</p>
            </div>
          </div>
          <div class="settings-stack">
            <article class="settings-summary">
              <span>个人中心</span>
              <strong>密码修改、名称修改与权限核对</strong>
              <p>统一放在同一页内，减少层级切换，便于快速核对和修改。</p>
            </article>
            <article class="settings-panel">
              <h3>修改密码</h3>
              <p>更新当前登录密码，满足安全策略。</p>
              <label class="settings-field"><span>当前密码</span><input type="password" placeholder="请输入当前密码" /></label>
              <label class="settings-field"><span>新密码</span><input type="password" placeholder="请输入新密码" /></label>
              <label class="settings-field"><span>确认新密码</span><input type="password" placeholder="再次输入新密码" /></label>
              <div class="settings-actions">
                <button class="settings-primary" type="button" data-setting-submit="profile-password">提交修改</button>
              </div>
            </article>
            <article class="settings-panel">
              <h3>名称修改</h3>
              <p>统一工作台展示名称和签名信息。</p>
              <label class="settings-field"><span>当前名称</span><input type="text" value="集团管理用户" /></label>
              <label class="settings-field"><span>展示签名</span><input type="text" value="总部经营管理部" /></label>
              <div class="settings-actions">
                <button class="settings-primary" type="button" data-setting-submit="profile-name">保存修改</button>
              </div>
            </article>
            <article class="settings-panel">
              <h3>角色与权限</h3>
              <p>当前账号具有驾驶舱查看、数据穿透与督办跟进权限。</p>
              <div class="settings-mini-list">
                <div class="settings-mini-item"><b>角色</b><span>总部经营管理部</span></div>
                <div class="settings-mini-item"><b>权限范围</b><span>总览、排行、督办、公司切换</span></div>
                <div class="settings-mini-item"><b>数据层级</b><span>集团总部 / 区域公司 / 专业公司</span></div>
              </div>
            </article>
          </div>
        </div>`;
    }
    if (key === "notice") {
      return `
        <div class="settings-page">
          <div class="settings-page-head">
            <button class="settings-back" type="button" data-setting-back aria-label="返回">‹</button>
            <div class="settings-page-copy">
              <span>个人设置</span>
              <strong>消息通知</strong>
              <p>提醒授权、悬浮提示与免打扰设置</p>
            </div>
          </div>
          <div class="settings-stack">
            <article class="settings-summary">
              <span>消息通知</span>
              <strong>手机提醒、悬浮提醒与授权设置</strong>
              <p>把授权、显示和静默时间放在一页里，减少点进点出的成本。</p>
            </article>
            <article class="settings-panel">
              <h3>消息授权</h3>
              <p>管理短信、App 推送和微信提醒的授权方式。</p>
              <div class="settings-switch-list">
                <label class="settings-switch"><input type="checkbox" checked /><span><b>短信提醒</b><small>接收关键预警短信</small></span></label>
                <label class="settings-switch"><input type="checkbox" checked /><span><b>App 推送</b><small>接收移动端消息推送</small></span></label>
                <label class="settings-switch"><input type="checkbox" checked /><span><b>微信提醒</b><small>接收企业微信通知</small></span></label>
              </div>
            </article>
            <article class="settings-panel">
              <h3>悬浮提醒设置</h3>
              <p>控制工作台右下角悬浮提醒的显示频率和停留时间。</p>
              <div class="settings-switch-list">
                <label class="settings-switch"><input type="checkbox" checked /><span><b>显示悬浮提醒</b><small>在重要提醒到达时弹出</small></span></label>
                <label class="settings-switch"><input type="checkbox" checked /><span><b>显示倒计时</b><small>展示待办临近截止时间</small></span></label>
              </div>
            </article>
            <article class="settings-panel">
              <h3>免打扰时段</h3>
              <p>设置夜间或会议期间的静默时间，避免打断阅读。</p>
              <label class="settings-field"><span>开始时间</span><input type="text" value="22:00" /></label>
              <label class="settings-field"><span>结束时间</span><input type="text" value="08:00" /></label>
              <div class="settings-actions">
                <button class="settings-primary" type="button" data-setting-submit="notice-dnd">保存设置</button>
              </div>
            </article>
            <article class="settings-panel">
              <h3>微信消息提示</h3>
              <p>选择消息推送到企业微信、个人微信或两者同时发送。</p>
              <div class="settings-mini-list">
                <div class="settings-mini-item"><b>企业微信</b><span>已授权，默认开启</span></div>
                <div class="settings-mini-item"><b>个人微信</b><span>待确认授权状态</span></div>
              </div>
              <div class="settings-actions">
                <button class="settings-primary" type="button" data-setting-submit="notice-wechat">更新授权</button>
              </div>
            </article>
          </div>
        </div>`;
    }
    if (key === "refresh") {
      return `
        <div class="settings-page">
          <div class="settings-page-head">
            <button class="settings-back" type="button" data-setting-back aria-label="返回">‹</button>
            <div class="settings-page-copy">
              <span>个人设置</span>
              <strong>刷新数据</strong>
              <p>日志、异常与同步状态</p>
            </div>
          </div>
          <div class="settings-stack">
            <article class="settings-summary">
              <span>刷新数据</span>
              <strong>刷新日志与接口异常记录</strong>
              <p>先保留一个主动作，再把历史记录和异常记录展开显示，避免页面跳转。</p>
            </article>
            <article class="settings-panel">
              <h3>数据刷新</h3>
              <p>执行一次当前驾驶舱数据刷新，并查看同步状态。</p>
              <div class="settings-actions">
                <button class="settings-primary" type="button" data-setting-submit="refresh-now">立即刷新</button>
              </div>
            </article>
            <details class="settings-disclosure" open>
              <summary>历史刷新日志</summary>
              <div class="settings-log-list">
                <div class="settings-log-item"><b>2026-07-29 09:20</b><span>刷新完成 · 总览、排行、督办数据同步成功</span></div>
                <div class="settings-log-item"><b>2026-07-28 18:05</b><span>刷新完成 · 公司切换与指标卡片更新成功</span></div>
                <div class="settings-log-item"><b>2026-07-28 08:40</b><span>刷新完成 · 排行与督办列表同步成功</span></div>
              </div>
            </details>
            <details class="settings-disclosure">
              <summary>接口异常记录</summary>
              <div class="settings-log-list">
                <div class="settings-log-item is-warn"><b>2026-07-29 08:30</b><span>指标接口超时，已自动重试 2 次</span></div>
                <div class="settings-log-item is-warn"><b>2026-07-28 14:12</b><span>督办接口返回空值，已回退到缓存数据</span></div>
                <div class="settings-log-item is-warn"><b>2026-07-27 11:08</b><span>公司层级接口字段缺失，已记录待修复</span></div>
              </div>
            </details>
          </div>
        </div>`;
    }
    if (key === "about") {
      return `
        <div class="settings-page">
          <div class="settings-page-head">
            <button class="settings-back" type="button" data-setting-back aria-label="返回">‹</button>
            <div class="settings-page-copy">
              <span>个人设置</span>
              <strong>关于系统</strong>
              <p>产品说明、版本发布与功能指引</p>
            </div>
          </div>
          <div class="settings-stack">
            <article class="settings-summary">
              <span>关于系统</span>
              <strong>产品说明、版本发布与新功能指引</strong>
              <p>把说明性内容放在一个页面里，适合快速浏览，不必层层下钻。</p>
            </article>
            <article class="settings-panel">
              <h3>产品说明</h3>
              <p>本系统用于企业经营管理驾驶舱展示，覆盖总览、排行、督办、公司切换与指标分析。</p>
              <div class="settings-mini-list">
                <div class="settings-mini-item"><b>展示范围</b><span>集团总部、区域公司、专业公司</span></div>
                <div class="settings-mini-item"><b>核心目标</b><span>辅助领导快速阅读与穿透查看</span></div>
              </div>
            </article>
            <article class="settings-panel">
              <h3>版本发布</h3>
              <p>查看最近版本发布摘要与本次变更。</p>
              <div class="settings-log-list">
                <div class="settings-log-item"><b>v1.4.2</b><span>优化个人设置、通知授权与刷新日志弹窗</span></div>
                <div class="settings-log-item"><b>v1.4.1</b><span>补充排行和督办检索体验</span></div>
                <div class="settings-log-item"><b>v1.4.0</b><span>完善公司切换与数据归集逻辑</span></div>
              </div>
            </article>
            <article class="settings-panel">
              <h3>新功能指引</h3>
              <p>快速了解新增功能的入口和用途。</p>
              <div class="settings-mini-list">
                <div class="settings-mini-item"><b>公司切换</b><span>点击顶部范围，切换统计主体</span></div>
                <div class="settings-mini-item"><b>排行筛选</b><span>按月、季、年查看不同维度排行</span></div>
                <div class="settings-mini-item"><b>督办历史</b><span>查看更新记录与流程节点</span></div>
              </div>
            </article>
          </div>
        </div>`;
    }
    return "";
  }

  function renderSettingDetailSheet(key) {
    if (key === "profile-password") {
      return `
        <div class="settings-detail">
          <article class="settings-panel">
            <h3>修改密码</h3>
            <p>输入当前密码并设置新密码，提交后同步更新登录凭据。</p>
            <label class="settings-field"><span>当前密码</span><input type="password" placeholder="请输入当前密码" /></label>
            <label class="settings-field"><span>新密码</span><input type="password" placeholder="请输入新密码" /></label>
            <label class="settings-field"><span>确认新密码</span><input type="password" placeholder="再次输入新密码" /></label>
            <div class="settings-actions">
              <button class="settings-primary" type="button" data-setting-submit="profile-password">提交修改</button>
              <button class="settings-secondary" type="button" data-close-sheet>取消</button>
            </div>
          </article>
        </div>`;
    }
    if (key === "profile-name") {
      return `
        <div class="settings-detail">
          <article class="settings-panel">
            <h3>名称修改</h3>
            <p>修改当前显示名称与签名信息，便于统一工作台展示。</p>
            <label class="settings-field"><span>当前名称</span><input type="text" value="集团管理用户" /></label>
            <label class="settings-field"><span>展示签名</span><input type="text" value="总部经营管理部" /></label>
            <div class="settings-actions">
              <button class="settings-primary" type="button" data-setting-submit="profile-name">保存修改</button>
              <button class="settings-secondary" type="button" data-close-sheet>取消</button>
            </div>
          </article>
        </div>`;
    }
    if (key === "profile-role") {
      return `
        <div class="settings-detail">
          <article class="settings-panel">
            <h3>角色与权限</h3>
            <p>当前账号具有驾驶舱查看、数据穿透与督办跟进权限。</p>
            <div class="settings-mini-list">
              <div class="settings-mini-item"><b>角色</b><span>总部经营管理部</span></div>
              <div class="settings-mini-item"><b>权限范围</b><span>总览、排行、督办、公司切换</span></div>
              <div class="settings-mini-item"><b>数据层级</b><span>集团总部 / 区域公司 / 专业公司</span></div>
            </div>
            <div class="settings-actions">
              <button class="settings-secondary" type="button" data-close-sheet>关闭</button>
            </div>
          </article>
        </div>`;
    }
    if (key === "notice-phone") {
      return `
        <div class="settings-detail">
          <article class="settings-panel">
            <h3>手机信息提醒授权</h3>
            <p>管理短信、App 推送和微信提醒的授权方式。</p>
            <div class="settings-switch-list">
              <label class="settings-switch"><input type="checkbox" checked /><span><b>短信提醒</b><small>接收关键预警短信</small></span></label>
              <label class="settings-switch"><input type="checkbox" checked /><span><b>App 推送</b><small>接收移动端消息推送</small></span></label>
              <label class="settings-switch"><input type="checkbox" checked /><span><b>微信提醒</b><small>接收企业微信通知</small></span></label>
            </div>
            <div class="settings-actions">
              <button class="settings-primary" type="button" data-setting-submit="notice-phone">保存设置</button>
              <button class="settings-secondary" type="button" data-close-sheet>取消</button>
            </div>
          </article>
        </div>`;
    }
    if (key === "notice-floating") {
      return `
        <div class="settings-detail">
          <article class="settings-panel">
            <h3>悬浮提醒设置</h3>
            <p>控制工作台右下角悬浮提醒的显示频率和停留时间。</p>
            <div class="settings-switch-list">
              <label class="settings-switch"><input type="checkbox" checked /><span><b>显示悬浮提醒</b><small>在重要提醒到达时弹出</small></span></label>
              <label class="settings-switch"><input type="checkbox" checked /><span><b>显示倒计时</b><small>展示待办临近截止时间</small></span></label>
            </div>
            <div class="settings-actions">
              <button class="settings-primary" type="button" data-setting-submit="notice-floating">保存设置</button>
              <button class="settings-secondary" type="button" data-close-sheet>取消</button>
            </div>
          </article>
        </div>`;
    }
    if (key === "notice-wechat") {
      return `
        <div class="settings-detail">
          <article class="settings-panel">
            <h3>微信消息提示</h3>
            <p>选择消息推送到企业微信、个人微信或两者同时发送。</p>
            <div class="settings-mini-list">
              <div class="settings-mini-item"><b>企业微信</b><span>已授权，默认开启</span></div>
              <div class="settings-mini-item"><b>个人微信</b><span>待确认授权状态</span></div>
            </div>
            <div class="settings-actions">
              <button class="settings-primary" type="button" data-setting-submit="notice-wechat">更新授权</button>
              <button class="settings-secondary" type="button" data-close-sheet>取消</button>
            </div>
          </article>
        </div>`;
    }
    if (key === "notice-dnd") {
      return `
        <div class="settings-detail">
          <article class="settings-panel">
            <h3>免打扰时段</h3>
            <p>设置夜间或会议期间的静默时间，避免打断阅读。</p>
            <label class="settings-field"><span>开始时间</span><input type="text" value="22:00" /></label>
            <label class="settings-field"><span>结束时间</span><input type="text" value="08:00" /></label>
            <div class="settings-actions">
              <button class="settings-primary" type="button" data-setting-submit="notice-dnd">保存设置</button>
              <button class="settings-secondary" type="button" data-close-sheet>取消</button>
            </div>
          </article>
        </div>`;
    }
    if (key === "refresh-history") {
      return `
        <div class="settings-detail">
          <article class="settings-panel">
            <h3>历史刷新日志</h3>
            <p>查看最近几次驾驶舱数据刷新记录和结果状态。</p>
            <div class="settings-log-list">
              <div class="settings-log-item"><b>2026-07-29 09:20</b><span>刷新完成 · 总览、排行、督办数据同步成功</span></div>
              <div class="settings-log-item"><b>2026-07-28 18:05</b><span>刷新完成 · 公司切换与指标卡片更新成功</span></div>
              <div class="settings-log-item"><b>2026-07-28 08:40</b><span>刷新完成 · 排行与督办列表同步成功</span></div>
            </div>
            <div class="settings-actions">
              <button class="settings-secondary" type="button" data-close-sheet>关闭</button>
            </div>
          </article>
        </div>`;
    }
    if (key === "refresh-error") {
      return `
        <div class="settings-detail">
          <article class="settings-panel">
            <h3>接口异常记录</h3>
            <p>查看同步失败、超时和重试记录，便于定位数据源问题。</p>
            <div class="settings-log-list">
              <div class="settings-log-item is-warn"><b>2026-07-29 08:30</b><span>指标接口超时，已自动重试 2 次</span></div>
              <div class="settings-log-item is-warn"><b>2026-07-28 14:12</b><span>督办接口返回空值，已回退到缓存数据</span></div>
              <div class="settings-log-item is-warn"><b>2026-07-27 11:08</b><span>公司层级接口字段缺失，已记录待修复</span></div>
            </div>
            <div class="settings-actions">
              <button class="settings-secondary" type="button" data-close-sheet>关闭</button>
            </div>
          </article>
        </div>`;
    }
    if (key === "about-product") {
      return `
        <div class="settings-detail">
          <article class="settings-panel">
            <h3>产品说明</h3>
            <p>本系统用于企业经营管理驾驶舱展示，覆盖总览、排行、督办、公司切换与指标分析。</p>
            <div class="settings-mini-list">
              <div class="settings-mini-item"><b>展示范围</b><span>集团总部、区域公司、专业公司</span></div>
              <div class="settings-mini-item"><b>核心目标</b><span>辅助领导快速阅读与穿透查看</span></div>
            </div>
            <div class="settings-actions">
              <button class="settings-secondary" type="button" data-close-sheet>关闭</button>
            </div>
          </article>
        </div>`;
    }
    if (key === "about-version") {
      return `
        <div class="settings-detail">
          <article class="settings-panel">
            <h3>版本发布</h3>
            <p>查看最近版本发布摘要与本次变更。</p>
            <div class="settings-log-list">
              <div class="settings-log-item"><b>v1.4.2</b><span>优化个人设置、通知授权与刷新日志弹窗</span></div>
              <div class="settings-log-item"><b>v1.4.1</b><span>补充排行和督办检索体验</span></div>
              <div class="settings-log-item"><b>v1.4.0</b><span>完善公司切换与数据归集逻辑</span></div>
            </div>
            <div class="settings-actions">
              <button class="settings-secondary" type="button" data-close-sheet>关闭</button>
            </div>
          </article>
        </div>`;
    }
    if (key === "about-guide") {
      return `
        <div class="settings-detail">
          <article class="settings-panel">
            <h3>新功能指引</h3>
            <p>快速了解新增功能的入口和用途。</p>
            <div class="settings-mini-list">
              <div class="settings-mini-item"><b>公司切换</b><span>点击顶部范围，切换统计主体</span></div>
              <div class="settings-mini-item"><b>排行筛选</b><span>按月、季、年查看不同维度排行</span></div>
              <div class="settings-mini-item"><b>督办历史</b><span>查看更新记录与流程节点</span></div>
            </div>
            <div class="settings-actions">
              <button class="settings-secondary" type="button" data-close-sheet>关闭</button>
            </div>
          </article>
        </div>`;
    }
    if (key === "logout-confirm") {
      return `
        <div class="settings-detail">
          <article class="settings-panel settings-panel-danger">
            <h3>确认退出登录</h3>
            <p>退出后将结束当前账号会话。是否继续？</p>
            <div class="settings-actions">
              <button class="settings-primary danger" type="button" data-confirm-logout>确认退出</button>
              <button class="settings-secondary" type="button" data-close-sheet>取消</button>
            </div>
          </article>
        </div>`;
    }
    return "";
  }

  function openSheet(type, payload = {}) {
    if (type === "scope") {
      openCompanySelector(payload);
      return;
    }
    closeModal();
    sheet.hidden = false;
    if (type === "menu") {
      sheetEyebrow.textContent = "工作台快捷入口";
      sheetTitle.textContent = "个人设置";
      sheetContent.innerHTML = renderMenuSheet();
    } else if (type === "menu-setting") {
      const key = payload.key || "profile";
      const map = {
        profile: ["个人中心", "账号、密码与权限"],
        notice: ["消息通知", "提醒授权与触达设置"],
        refresh: ["刷新数据", "日志与异常记录"],
        about: ["关于系统", "产品说明与版本信息"]
      };
      const meta = map[key] || map.profile;
      sheetEyebrow.textContent = meta[0];
      sheetTitle.textContent = meta[1];
      sheetContent.innerHTML = renderSettingSheet(key);
    } else if (type === "logout-confirm") {
      sheetEyebrow.textContent = "退出登录";
      sheetTitle.textContent = "确认退出当前账号";
      sheetContent.innerHTML = renderSettingDetailSheet("logout-confirm");
    } else if (type === "aggregation") {
      const label = aggregationMetrics[payload.metric] ? payload.metric : "营业总收入";
      sheetEyebrow.textContent = "数据穿透";
      sheetTitle.textContent = `${label}明细`;
      sheetContent.innerHTML = renderAggregationBreakdown(label);
    } else if (type === "feed") {
      sheetEyebrow.textContent = "动态中心";
      sheetTitle.textContent = "更新动态台账";
      sheetContent.innerHTML = renderFeedList();
    } else if (type === "feed-detail") {
      const record = scopedFeedRecords().find(item => item.id === payload.id) || feedRecords[0];
      sheetEyebrow.textContent = record.module;
      sheetTitle.textContent = "事项详情";
      sheetContent.innerHTML = renderFeedDetail(record.id);
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
    const target = event.target.closest("[data-close-modal], [data-close-sheet], [data-close-company], [data-company-option], [data-confirm-company], [data-cancel-company], [data-scope-option], [data-menu-action], [data-setting-back], [data-setting-submit], [data-confirm-logout], [data-feed-id], [data-feed-back], [data-call-owner], [data-search-result], [data-open-indicator], [data-modal-scope]");
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
    if (target.dataset.menuAction) handleMenuAction(target.dataset.menuAction);
    if (target.dataset.settingBack !== undefined) openSheet("menu");
    if (target.dataset.settingSubmit) {
      const messages = {
        "profile-password": "密码修改已提交",
        "profile-name": "名称修改已保存",
        "notice-phone": "手机提醒授权已更新",
        "notice-floating": "悬浮提醒设置已保存",
        "notice-wechat": "微信消息提示已更新",
        "notice-dnd": "免打扰时段已保存",
        "refresh-now": "数据刷新任务已提交"
      };
      showToast(messages[target.dataset.settingSubmit] || "设置已保存");
    }
    if (target.dataset.feedId) openSheet("feed-detail", { id: target.dataset.feedId });
    if (target.dataset.feedBack !== undefined) openSheet("feed");
    if (target.dataset.callOwner) showToast(`正在联系 ${target.dataset.callOwner}`);
    if (target.dataset.confirmLogout !== undefined) {
      showToast("已退出当前账号");
      closeSheet();
    }
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
