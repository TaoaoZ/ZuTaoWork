(function () {
  const script = document.currentScript;
  const mode = script.dataset.mode;
  const data = window.PROTOTYPE_DATA.rankings[mode];
  const scopes = window.PROTOTYPE_DATA.rankingScopes;
  if (!data || !scopes) return;

  const state = { scope: scopes.headquarter, metricPeriods: data.segments.map(() => 2), query: "" };
  const periods = ["月度", "季度", "年度"];
  const amountFactors = [0.09, 0.32, 1];
  const countFactors = [0.18, 0.52, 1];

  const escapeHtml = value => String(value ?? "").replace(/[&<>\"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[character]));

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

  function getPathValue(source, path) {
    return String(path).split(".").reduce((value, key) => value?.[key], source);
  }

  function metricTitle(segment) {
    const label = data.segments[segment];
    return label.endsWith("排行") ? label : `${label}排行`;
  }

  function colorFor(row, index) {
    if (index < 3) return "#25c96f";
    return row.risk === "warn" ? "#f4a51c" : row.risk === "danger" ? "#f2485b" : "#8fa1bd";
  }

  function periodClass(period) {
    return period === 0 ? "本月" : period === 1 ? "本季" : "年度";
  }

  function formatValue(value, unit) {
    const number = Number(value);
    if (unit === "亿") return `${number.toFixed(2).replace(/\.?0+$/, "")}亿`;
    if (unit === "件" || unit === "项" || unit === "小时") return `${number.toFixed(number % 1 ? 1 : 0)}${unit}`;
    return `${number.toFixed(1).replace(/\.0$/, "")}${unit}`;
  }

  function scoreFromValue(value, segment, unit = data.units[segment]) {
    const higherBetter = data.higherBetter[segment] !== false;
    const number = Number(value);
    if (unit === "亿") {
      const score = higherBetter ? 68 + number * (mode === "business" ? 16 : 90) : 100 - number * 12;
      return Math.max(20, Math.min(100, score));
    }
    if (unit === "件" || unit === "项") return Math.max(20, Math.min(100, higherBetter ? number * 8 : 100 - number * 7));
    if (unit === "小时") return Math.max(20, Math.min(100, 110 - number * 0.8));
    return Math.max(20, Math.min(100, number));
  }

  function companyRows(segment) {
    const field = data.companyFields[segment];
    return scopes.companies.map((company, companyIndex) => {
      const value = field === "warning"
        ? Math.max(1, Math.round((100 - company.health) / 2))
        : Number(getPathValue(company, field));
      return {
        rowIndex: companyIndex,
        name: company.name,
        short: company.short,
        type: company.type,
        value,
        score: scoreFromValue(value, segment),
        risk: company.health < 88 || company.score < 90 ? "danger" : company.health < 92 ? "warn" : "normal"
      };
    });
  }

  function projectRows(segment) {
    const names = scopes.projectNames[state.scope] || scopes.projectNames["大湾区区域公司"];
    const company = scopes.companies.find(item => item.name === state.scope) || scopes.companies[0];
    const base = data.projectBase[segment];
    const companyShift = (company.score - 93) * 0.35;
    const unit = data.units[segment];
    return names.slice(0, Math.max(6, Math.min(8, names.length))).map((name, index) => {
      const wave = [2.4, 1.1, 0.2, -0.8, -1.6, -2.7, -3.4, -4.1][index] || 0;
      let value;
      if (unit === "亿") value = Math.max(0.01, Number((base * (1 + companyShift / 18) - index * base * 0.08).toFixed(2)));
      else if (unit === "件" || unit === "项") value = Math.max(0, Math.round(base - companyShift / 2 + index * 0.7));
      else if (unit === "小时") value = Math.max(8, Number((base - companyShift + index * 1.8).toFixed(1)));
      else value = Math.max(55, Math.min(100, Number((base + companyShift + wave).toFixed(1))));
      return {
        rowIndex: index,
        name,
        short: `P${index + 1}`,
        type: "项目",
        value,
        score: scoreFromValue(value, segment),
        risk: index > 5 ? "danger" : index > 3 ? "warn" : "normal"
      };
    });
  }

  function periodValue(row, segment, period) {
    const unit = data.units[segment];
    const label = data.segments[segment];
    const value = Number(row.value);
    if (period === 2) return value;

    const index = row.rowIndex || 0;
    const wave = [0.6, -0.2, 0.4, -0.5, 0.1, -0.7, 0.3, -0.4, 0.2, -0.3, 0.5][index] || 0;

    if (unit === "亿") {
      const factor = amountFactors[period];
      const base = value * factor;
      if (label.includes("现金流")) return Number((base + wave * 0.012 * (period + 1)).toFixed(2));
      return Math.max(0.01, Number((base * (1 + wave * 0.012)).toFixed(2)));
    }

    if (unit === "件" || unit === "项") {
      const count = value * countFactors[period] + (period === 2 ? 0 : Math.max(0, wave));
      return Math.max(0, Math.round(count));
    }

    if (unit === "小时") {
      const offset = [-1.8, -0.7, 0][period] || 0;
      return Math.max(6, Number((value + offset + wave * 0.8).toFixed(1)));
    }

    const offset = [-2.4, -1, 0][period] || 0;
    const clampMax = unit === "%" || unit === "分" ? 100 : Number.POSITIVE_INFINITY;
    return Math.max(0, Math.min(clampMax, Number((value + offset + wave).toFixed(1))));
  }

  function progressScore(value, rows, segment) {
    const values = rows.map(row => Number(row.value));
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (max === min) return 82;
    const higherBetter = data.higherBetter[segment] !== false;
    const ratio = higherBetter ? (value - min) / (max - min) : (max - value) / (max - min);
    return Math.max(24, Math.min(100, Math.round(42 + ratio * 56)));
  }

  function rankedRows(segment, period = state.metricPeriods[segment]) {
    const rows = state.scope === scopes.headquarter ? companyRows(segment) : projectRows(segment);
    const direction = data.higherBetter[segment] === false ? 1 : -1;
    const periodRows = rows
      .map(row => ({ ...row, value: periodValue(row, segment, period) }))
      .sort((a, b) => direction * (a.value - b.value));
    return periodRows.map(row => {
      const score = progressScore(row.value, periodRows, segment);
      return { ...row, score, risk: score < 55 ? "danger" : score < 72 ? "warn" : row.risk };
    });
  }

  function rowSearchText(row) {
    return [row.name, row.short, row.type].join(" ");
  }

  function visibleRows(segment, period = state.metricPeriods[segment]) {
    return rankedRows(segment, period).filter(row => fuzzyMatch(rowSearchText(row), state.query));
  }

  function aggregateInfo(rows, segment) {
    const unit = data.units[segment];
    const total = rows.reduce((sum, row) => sum + Number(row.value), 0);
    const label = data.segments[segment];
    if (unit === "亿" || unit === "件" || unit === "项") {
      return { label: "合计", value: total, formatted: formatValue(total, unit) };
    }
    const average = rows.length ? total / rows.length : 0;
    return { label: label.includes("时长") ? "均值" : "平均", value: average, formatted: formatValue(average, unit) };
  }

  function metricAdvice(segment) {
    const label = data.segments[segment];
    if (label.includes("收入")) return "重点看收入确认节奏和目标缺口";
    if (label.includes("利润")) return "重点看毛利结构、费用压降和亏损项目";
    if (label.includes("合约")) return "重点看新签储备、续约质量和合同转化";
    if (label.includes("现金流")) return "重点看回款排期、付款节奏和资金占用";
    if (label.includes("收缴")) return "重点看欠费清单和账龄较长项目";
    if (label.includes("成本")) return "重点看人工、外包和能耗成本控制";
    if (label.includes("投诉") || label.includes("满意")) return "重点看客户高频问题和闭环质量";
    if (label.includes("审批") || label.includes("审计") || label.includes("付款")) return "重点看流程效率、整改闭环和授权规范";
    if (label.includes("舆情") || label.includes("负面") || label.includes("响应")) return "重点看负面事件源头和响应时效";
    if (label.includes("创新") || label.includes("知识产权") || label.includes("研发")) return "重点看成果转化和投入产出";
    if (label.includes("安全") || label.includes("隐患") || label.includes("培训")) return "重点看事故底线、隐患整改和培训覆盖";
    return "重点看排名靠后主体的成因和改善责任";
  }

  function formatInsight(rows, segment, period, aggregate) {
    if (!rows.length) return `${periodClass(period)}${data.segments[segment]}暂无匹配对象，请调整搜索关键词或切换范围。`;
    const best = rows[0];
    const last = rows[rows.length - 1];
    const scopeText = state.scope === scopes.headquarter ? "公司层" : "项目层";
    const directionText = data.higherBetter[segment] === false ? "数值越低越优" : "数值越高越优";
    const bestText = best ? `${best.name}${formatValue(best.value, data.units[segment])}` : "-";
    const lastText = last ? `${last.name}${formatValue(last.value, data.units[segment])}` : "-";
    return `${periodClass(period)}${scopeText}${data.segments[segment]}${aggregate.label}${aggregate.formatted}，${bestText}排名第一，${lastText}排名靠后；${directionText}，${metricAdvice(segment)}。`;
  }

  function findMount() {
    const fixed = document.querySelector('[data-node-id="2:3494"]');
    if (fixed) return fixed;
    const headings = [...document.querySelectorAll("span")].filter(span => /排行|核心经营指标|项目综合/.test(span.textContent || ""));
    for (const heading of headings) {
      let current = heading.parentElement;
      for (let depth = 0; current && depth < 8; depth += 1, current = current.parentElement) {
        if (current.getAttribute?.("data-name") === "Reason") return current;
      }
    }
    return [...document.querySelectorAll('[data-name="Reason"]')][1] || document.body;
  }

  function setActiveTab() {
    ["综合", "经营", "运营", "内控", "舆情", "创新", "安全"].forEach(label => {
      const span = [...document.querySelectorAll("span")].find(item => item.textContent.trim() === label);
      if (!span || !span.parentElement) return;
      const parent = span.parentElement;
      parent.style.background = "transparent";
      parent.style.border = "0";
      parent.style.borderImage = "none";
      span.style.color = "#8D90A6";
      if (label === data.tab) {
        parent.style.background = "rgba(61,111,232,0.05)";
        parent.style.borderBottom = "2.56px solid #477AFC";
        span.style.color = "#101A3E";
      }
    });
  }

  function renderRankRows(rows, segment) {
    return rows.map((row, index) => {
      const color = colorFor(row, index);
      return `<button type="button" class="custom-rank" style="--row-color:${color}" data-rank-detail="${escapeHtml(row.name)}" data-rank-segment="${segment}">
        <span class="custom-rank-index">${index + 1}</span>
        <i class="custom-rank-dot" aria-hidden="true"></i>
        <span class="custom-rank-name">${escapeHtml(row.name)}<small>${escapeHtml(row.type)}</small></span>
        <span class="custom-rank-value">${escapeHtml(formatValue(row.value, data.units[segment]))}</span>
        <span class="custom-progress"><i style="width:${row.score}%"></i></span>
      </button>`;
    }).join("");
  }

  function renderMetricCard(segment) {
    const period = state.metricPeriods[segment] ?? 2;
    const rows = visibleRows(segment, period);
    const chartRows = rows.slice(0, Math.min(8, rows.length));
    const aggregate = aggregateInfo(rows, segment);
    return `
      <section class="custom-card custom-metric-card" data-metric-card="${segment}">
        <div class="custom-card-main">
          <div class="custom-card-top">
            <div class="custom-card-title">
              <span>${escapeHtml(metricTitle(segment))}</span>
              <strong><small>${escapeHtml(aggregate.label)}</small>${escapeHtml(aggregate.formatted)}</strong>
            </div>
            <div class="custom-periods custom-card-periods">${periods.map((item, index) => `<button type="button" class="${index === period ? "active" : ""}" data-period-segment="${segment}" data-period-index="${index}">${item}</button>`).join("")}</div>
          </div>
          <div class="custom-insight"><p>${escapeHtml(formatInsight(rows, segment, period, aggregate))}</p></div>
          <div class="custom-chart">${chartRows.map((row, index) => `
            <div class="custom-bar-wrap">
              <div class="custom-bar-value">${escapeHtml(formatValue(row.value, data.units[segment]))}</div>
              <div class="custom-bar" style="height:${Math.max(18, row.score - 18)}px;--bar-color:${colorFor(row, index)}"></div>
              <span class="custom-bar-label">${escapeHtml(row.short)}</span>
            </div>`).join("")}
          </div>${chartRows.length ? "" : `<div class="custom-empty">未找到匹配对象</div>`}
        </div>
        <details class="custom-rank-details">
          <summary><span>查看明细列表</span><b>${rows.length} 条</b></summary>
          <div class="custom-ranks">${renderRankRows(rows, segment)}</div>
        </details>
      </section>`;
  }

  function render() {
    const mount = findMount();
    if (!mount) return;
    mount.style.padding = "16px 12px";
    mount.style.gap = "12px";
    mount.style.overflow = "visible";
    mount.innerHTML = `
      <div class="custom-ranking" style="--custom-accent:${data.accent}">
        <div class="custom-section-head">
          <div>
            <div class="custom-section-title">${escapeHtml(data.title)}</div>
            <div class="custom-section-note">${state.scope === scopes.headquarter ? "区域/专业公司排行" : "项目排行"} · ${escapeHtml(state.scope)}</div>
          </div>
        </div>
        ${data.segments.map((_, segment) => renderMetricCard(segment)).join("")}
      </div>`;
    setActiveTab();
    document.title = `企业经营管理驾驶舱 · ${data.tab}排行`;
    mountPrototypeSearch();
    rootInteractive();
  }

  function findPrototypeSearchBox() {
    const mounted = document.querySelector('[data-prototype-search="ranking"]');
    if (mounted) return mounted;
    const placeholder = [...document.querySelectorAll("span")]
      .find(span => (span.textContent || "").trim() === "请输入标题名称进行搜索");
    return placeholder?.parentElement || null;
  }

  function mountPrototypeSearch() {
    const box = findPrototypeSearchBox();
    if (!box) return;
    box.dataset.prototypeSearch = "ranking";
    box.innerHTML = `<label class="prototype-page-search"><span aria-hidden="true"></span><input type="search" placeholder="${state.scope === scopes.headquarter ? "搜索区域/专业公司" : "搜索项目名称"}" value="${escapeHtml(state.query)}" data-rank-search /></label>`;
    const input = box.querySelector("[data-rank-search]");
    input?.addEventListener("input", () => {
      state.query = input.value;
      render();
      requestAnimationFrame(() => {
        const next = document.querySelector("[data-rank-search]");
        if (!next) return;
        next.focus();
        next.setSelectionRange(next.value.length, next.value.length);
      });
    });
  }

  function rootInteractive() {
    const root = document.querySelector(".custom-ranking");
    if (!root) return;
    root.querySelectorAll("[data-period-segment]").forEach(button => button.addEventListener("click", () => {
      state.metricPeriods[Number(button.dataset.periodSegment)] = Number(button.dataset.periodIndex);
      render();
    }));
    root.querySelectorAll(".custom-rank").forEach(item => item.addEventListener("click", () => {
      const segment = Number(item.dataset.rankSegment || 0);
      window.parent.postMessage({ source: "mastergo-prototype", action: "open-control", control: "detail", title: item.textContent.trim().replace(/\s+/g, " ").slice(0, 34), description: `已打开${metricTitle(segment)}详情，支持查看趋势、责任主体和异常记录。` }, "*");
    }));
  }

  function setScope(scope) {
    if (!scope || scope === state.scope) return;
    state.scope = scope;
    state.metricPeriods = data.segments.map(() => 2);
    state.query = "";
    render();
  }

  window.prototypeRanking = { setScope };
  window.addEventListener("message", event => {
    const message = event.data;
    if (!message || message.source !== "prototype-app" || message.action !== "scope-updated") return;
    setScope(message.scope);
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
