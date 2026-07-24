window.PROTOTYPE_DATA = window.PROTOTYPE_DATA || {};
window.PROTOTYPE_DATA.rankingScopes = {
  headquarter: "深圳市天健城市服务有限公司",
  companies: [
    { name: "大湾区区域公司", short: "湾区", type: "区域公司", score: 98, health: 97, business: [87.4, 88.3, 1.36, 0.58, 95.8, 4.08], operation: [96.8, 4, 98.5], internal: [99.2, 18, 98.6], reputation: [1, 96.4, 98.7], innovation: [88, 0.18, 2.6], safety: [100, 98.8, 99.2] },
    { name: "华东区域公司", short: "华东", type: "区域公司", score: 97, health: 96, business: [90.0, 90.7, 1.18, 0.51, 96.4, 3.62], operation: [97.5, 3, 99.0], internal: [99.5, 16, 99.1], reputation: [0, 97.2, 99.1], innovation: [94, 0.22, 3.1], safety: [100, 99.1, 99.5] },
    { name: "华南区域公司", short: "华南", type: "区域公司", score: 95, health: 94, business: [82.5, 83.9, 0.82, 0.29, 92.8, 2.46], operation: [94.6, 6, 96.7], internal: [97.8, 25, 96.4], reputation: [2, 94.8, 96.9], innovation: [89, 0.14, 2.2], safety: [100, 96.4, 98.2] },
    { name: "华中区域公司", short: "华中", type: "区域公司", score: 92, health: 91, business: [77.9, 75.7, 0.46, 0.16, 90.5, 1.72], operation: [92.4, 8, 94.1], internal: [96.1, 30, 95.3], reputation: [3, 92.5, 95.4], innovation: [86, 0.08, 1.7], safety: [98, 94.8, 96.6] },
    { name: "华北区域公司", short: "华北", type: "区域公司", score: 93, health: 90, business: [78.9, 76.7, 0.39, 0.12, 89.8, 1.39], operation: [91.8, 9, 93.5], internal: [96.6, 28, 95.8], reputation: [3, 91.7, 94.9], innovation: [85, 0.07, 1.5], safety: [98, 94.1, 96.0] },
    { name: "西南区域公司", short: "西南", type: "区域公司", score: 88, health: 84, business: [67.8, 52.6, 0.24, -0.04, 84.2, 1.06], operation: [88.6, 14, 89.5], internal: [91.4, 42, 90.2], reputation: [6, 86.8, 90.6], innovation: [81, 0.04, 1.1], safety: [96, 89.6, 91.8] },
    { name: "西北区域公司", short: "西北", type: "区域公司", score: 91, health: 88, business: [73.6, 69.6, 0.31, 0.07, 88.6, 1.08], operation: [90.2, 11, 92.4], internal: [95.0, 35, 93.4], reputation: [4, 90.1, 93.5], innovation: [84, 0.06, 1.4], safety: [98, 93.2, 95.0] },
    { name: "生活服务公司", short: "生活", type: "专业公司", score: 94, health: 93, business: [83.6, 81.3, 0.22, 0.11, 94.8, 0.69], operation: [96.2, 5, 97.9], internal: [97.2, 22, 96.8], reputation: [2, 94.5, 96.3], innovation: [87, 0.06, 1.8], safety: [100, 96.7, 98.8] },
    { name: "智慧运营公司", short: "智运", type: "专业公司", score: 95, health: 96, business: [88.4, 85.0, 0.28, 0.09, 96.1, 0.52], operation: [98.4, 2, 99.2], internal: [98.4, 14, 98.7], reputation: [1, 95.6, 97.8], innovation: [96, 0.16, 4.2], safety: [100, 98.6, 99.4] },
    { name: "公建服务公司", short: "公建", type: "专业公司", score: 93, health: 92, business: [81.3, 75.0, 0.35, 0.13, 91.7, 1.12], operation: [93.9, 7, 95.8], internal: [97.0, 24, 96.5], reputation: [2, 93.8, 95.8], innovation: [84, 0.05, 1.3], safety: [100, 97.8, 98.9] },
    { name: "园区运营公司", short: "园区", type: "专业公司", score: 94, health: 93, business: [88.9, 92.9, 0.37, 0.18, 94.3, 1.36], operation: [95.4, 5, 97.2], internal: [96.4, 20, 96.0], reputation: [2, 94.2, 96.1], innovation: [91, 0.12, 2.7], safety: [100, 96.9, 98.4] }
  ],
  projectNames: {
    "大湾区区域公司": ["深圳湾城市服务中心", "前海综合物业项目", "广州科学城项目", "珠海横琴园区", "南山政务服务项目", "宝安产业园项目", "佛山城市更新项目", "深圳北站枢纽项目"],
    "华东区域公司": ["上海张江园区", "杭州未来社区", "南京政务中心", "苏州产业园", "宁波综合体", "合肥高新园", "无锡商务区"],
    "华南区域公司": ["南宁五象项目", "海口滨海园区", "东莞松山湖", "中山翠亨新区", "惠州仲恺园", "汕头综合服务点", "江门滨江项目"],
    "华中区域公司": ["武汉光谷项目", "长沙梅溪湖", "郑州航空港", "南昌红谷滩", "襄阳政企服务点", "宜昌产业园", "株洲职教城"],
    "华北区域公司": ["北京副中心项目", "天津滨海园区", "石家庄政务中心", "雄安配套项目", "唐山产业园", "济南综合服务点", "青岛商务区"],
    "西南区域公司": ["成都高新项目", "重庆两江新区", "昆明滇池片区", "贵阳观山湖", "绵阳科技城", "泸州综合项目", "大理文旅服务点"],
    "西北区域公司": ["西安高新园区", "兰州新区项目", "银川阅海湾", "乌鲁木齐经开区", "西宁政务中心", "咸阳空港项目", "榆林能源园"],
    "生活服务公司": ["天健社区到家服务", "长者关怀服务中心", "社区商业运营项目", "便民驿站项目", "客户服务共享中心", "生活缴费服务点"],
    "智慧运营公司": ["智慧工单平台", "能耗监测中心", "数字孪生园区", "客服机器人项目", "设备预测维护项目", "统一运营驾驶舱"],
    "公建服务公司": ["市民中心服务项目", "文体场馆服务项目", "医院后勤服务点", "学校综合物业", "政务大厅服务项目", "公共建筑节能项目"],
    "园区运营公司": ["天健智谷园区", "科技企业孵化园", "总部经济园", "产业招商服务中心", "商业街区运营项目", "低碳园区示范点"]
  }
};

window.PROTOTYPE_DATA.rankings = {
  overall: {
    tab: "综合",
    title: "综合排行",
    cardTitle: "评分与健康度排行",
    segments: ["综合评分", "健康度", "预警事项"],
    accent: "#3d6fe8",
    units: ["分", "%", "项"],
    higherBetter: [true, true, false],
    companyFields: ["score", "health", "warning"],
    projectBase: [94, 92, 3],
    secondary: ["平均综合分", "健康公司占比", "重点预警"],
    insight: "综合排行只呈现评分、健康度和预警水平，避免与六大专业领域指标混用。"
  },
  business: {
    tab: "经营",
    title: "经营排行",
    cardTitle: "经营指标排行",
    segments: ["收入完成率", "利润完成率", "合约额", "现金流", "收缴率", "经营成本"],
    accent: "#3d6fe8",
    units: ["%", "%", "亿", "亿", "%", "亿"],
    higherBetter: [true, true, true, true, true, false],
    companyFields: ["business.0", "business.1", "business.2", "business.3", "business.4", "business.5"],
    projectBase: [86, 82, 0.32, 0.08, 93, 0.45],
    secondary: ["收入达成", "经营现金流", "综合收缴率"],
    insight: "经营排行围绕收入、利润、合同、现金流和收缴率，匹配六大领域指标说明表中的经营9项。"
  },
  operation: {
    tab: "运营",
    title: "运营排行",
    cardTitle: "运营服务排行",
    segments: ["客户满意度", "有效投诉数", "投诉闭环率"],
    accent: "#f97316",
    units: ["分", "件", "%"],
    higherBetter: [true, false, true],
    companyFields: ["operation.0", "operation.1", "operation.2"],
    projectBase: [94, 6, 96],
    secondary: ["客户满意度", "有效投诉数", "投诉闭环率"],
    insight: "运营排行聚焦客户满意度、有效投诉数量、投诉闭环解决率三个稳定取数字段。"
  },
  internal: {
    tab: "内控",
    title: "内控排行",
    cardTitle: "内控治理排行",
    segments: ["审计整改率", "审批平均时长", "付款及时率"],
    accent: "#8c6ff0",
    units: ["%", "小时", "%"],
    higherBetter: [true, false, true],
    companyFields: ["internal.0", "internal.1", "internal.2"],
    projectBase: [97, 24, 96],
    secondary: ["审计整改率", "审批平均时长", "付款及时率"],
    insight: "内控排行围绕审计整改、流程审批效率和付款及时率，反映风险治理和管理规范性。"
  },
  reputation: {
    tab: "舆情",
    title: "舆情排行",
    cardTitle: "舆情健康排行",
    segments: ["负面事件数", "响应及时率", "有效投诉处理率"],
    accent: "#24a4d8",
    units: ["件", "%", "%"],
    higherBetter: [false, true, true],
    companyFields: ["reputation.0", "reputation.1", "reputation.2"],
    projectBase: [2, 94, 96],
    secondary: ["负面事件数", "响应及时率", "投诉处理率"],
    insight: "舆情排行只采用负面事件、响应及时率和投诉处理率等可解释指标，辅助定位服务声誉风险。"
  },
  innovation: {
    tab: "创新",
    title: "创新排行",
    cardTitle: "创新动能排行",
    segments: ["知识产权积分", "创新合同额", "研发投入占比"],
    accent: "#2bbf9d",
    units: ["分", "亿", "%"],
    higherBetter: [true, true, true],
    companyFields: ["innovation.0", "innovation.1", "innovation.2"],
    projectBase: [86, 0.05, 2.1],
    secondary: ["知识产权积分", "创新合同额", "研发投入占比"],
    insight: "创新排行对应知识产权、创新业务合同、研发投入占比三项正式指标，强调成果、转化和投入。"
  },
  safety: {
    tab: "安全",
    title: "安全排行",
    cardTitle: "安全治理排行",
    segments: ["安全生产事故", "隐患闭环率", "培训覆盖率"],
    accent: "#ff8d35",
    units: ["分", "%", "%"],
    higherBetter: [true, true, true],
    companyFields: ["safety.0", "safety.1", "safety.2"],
    projectBase: [100, 96, 98],
    secondary: ["安全事故评分", "隐患闭环率", "培训覆盖率"],
    insight: "安全排行突出事故底线、隐患闭环和培训覆盖，保持安全生产一票否决逻辑清晰。"
  }
};
