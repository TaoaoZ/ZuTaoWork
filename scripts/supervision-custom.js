(function () {
  if (!document.title.includes("督办")) return;

  const headquarter = "深圳市天健城市服务有限公司";
  const state = { scope: headquarter, status: "全部", type: "全部", urgency: "全部", update: "全部", query: "" };
  const stages = ["立项", "责任确认", "推进反馈", "复核验收", "办结归档"];
  const filters = [
    { key: "status", label: "办理状态", options: ["全部", "推进中", "已办结", "逾期预警"] },
    { key: "type", label: "工作类型", options: ["全部", "基础工作", "重点工作"] },
    { key: "urgency", label: "紧急程度", options: ["全部", "紧急", "高", "普通"] },
    { key: "update", label: "更新情况", options: ["全部", "今日更新", "三日内更新", "超7天未更新"] }
  ];

  const hqTasks = [
    task("T202607-01", "本部", "集团经营月报口径校准", "基础工作", "推进中", "高", "三日内更新", 2, 62, "企管部", "陈敏", "138-0001-2601", "2026-07-30", "已完成各区域收入、利润、现金流口径复核，待财务系统回传最终差异清单。", "7月26日前完成差异闭环，7月28日提交集团经营月报定稿。"),
    task("T202607-02", "本部", "重点项目清欠专项督办", "重点工作", "推进中", "紧急", "今日更新", 2, 58, "财务管理部", "李卓", "138-0001-2602", "2026-07-29", "已锁定8个账龄超过180天项目，3个项目已形成客户约谈纪要。", "本周完成华中、西南专项约谈，形成责任到项目的回款排期。"),
    task("T202607-03", "本部", "安全隐患闭环抽查", "重点工作", "推进中", "高", "今日更新", 3, 76, "安全管理部", "周远", "138-0001-2603", "2026-08-02", "已完成大湾区、华东抽查，发现2项记录附件不完整，已退回整改。", "继续抽查西南、西北区域，重点核验重大隐患复查照片和责任人签字。"),
    task("T202607-04", "本部", "合同续签风险台账更新", "基础工作", "推进中", "普通", "三日内更新", 1, 45, "市场经营部", "王璐", "138-0001-2604", "2026-08-05", "已汇总三季度到期合同52份，其中9份需要提前启动续签谈判。", "7月31日前完成续签优先级排序，并推送至区域公司经营负责人。"),
    task("T202607-05", "本部", "审计整改材料复核", "基础工作", "已办结", "普通", "三日内更新", 4, 100, "审计风控部", "赵宁", "138-0001-2605", "2026-07-22", "12项整改材料已完成复核，2项制度修订已归档。", "8月例会复盘重复问题，纳入内控月度提醒。"),
    task("T202607-06", "本部", "客服投诉高频问题归因", "重点工作", "逾期预警", "紧急", "超7天未更新", 2, 51, "运营管理部", "刘洋", "138-0001-2606", "2026-07-20", "投诉分类已完成，但华南、华北项目整改计划尚未反馈。", "今日催办两家区域公司，逾期未反馈将升级至分管领导。"),
    task("T202607-07", "大湾区区域公司", "深圳湾项目能耗异常整改", "重点工作", "推进中", "高", "今日更新", 3, 72, "大湾区区域公司", "黄锐", "138-0001-2701", "2026-08-01", "冷站分时运行策略已上线，近三日峰值能耗下降6.2%。", "继续跟踪一周，形成节能前后对比报告。"),
    task("T202607-08", "华东区域公司", "张江园区客户满意度提升", "基础工作", "已办结", "普通", "三日内更新", 4, 100, "华东区域公司", "孙雯", "138-0001-2702", "2026-07-24", "已完成客服动线调整和回访闭环，满意度抽样回升至97.2分。", "持续纳入月度服务质量抽检。"),
    task("T202607-09", "华南区域公司", "南宁项目外包成本压降", "重点工作", "推进中", "高", "三日内更新", 2, 64, "华南区域公司", "唐杰", "138-0001-2703", "2026-08-06", "已完成岗位排班复核，预计可压降外包工时9%。", "下周提交供应商谈判结果和费用测算。"),
    task("T202607-10", "华中区域公司", "武汉光谷逾期应收清收", "重点工作", "逾期预警", "紧急", "超7天未更新", 1, 38, "华中区域公司", "蒋财务", "138-0001-2704", "2026-07-18", "客户付款承诺未按期兑现，项目尚未提交替代清收方案。", "今日升级区域总经理督办，要求48小时内明确清收路径。"),
    task("T202607-11", "华北区域公司", "政务中心付款流程优化", "基础工作", "推进中", "普通", "三日内更新", 2, 66, "华北区域公司", "许嘉", "138-0001-2705", "2026-08-04", "已梳理3类重复审批节点，待本部授权规则确认。", "完成规则确认后上线试运行两周。"),
    task("T202607-12", "西南区域公司", "重大隐患整改复验", "重点工作", "推进中", "紧急", "今日更新", 3, 81, "西南区域公司", "何川", "138-0001-2706", "2026-07-28", "电梯机房隐患已整改，消防通道占用问题完成现场复验。", "补齐第三方检测报告后提交办结申请。"),
    task("T202607-13", "西北区域公司", "项目资料归档规范化", "基础工作", "推进中", "普通", "超7天未更新", 1, 43, "西北区域公司", "马骁", "138-0001-2707", "2026-08-08", "已完成模板下发，项目端上传率仅62%。", "区域运营负责人组织项目集中补录。"),
    task("T202607-14", "生活服务公司", "社区到家服务续费提升", "重点工作", "推进中", "高", "三日内更新", 2, 69, "生活服务公司", "梁欣", "138-0001-2708", "2026-08-03", "已完成低活跃客户清单，试点服务包转化率提升4.8个百分点。", "扩大至6个社区服务点并跟踪续费率。"),
    task("T202607-15", "智慧运营公司", "智慧工单平台稳定性优化", "基础工作", "已办结", "高", "今日更新", 4, 100, "智慧运营公司", "郭晨", "138-0001-2709", "2026-07-23", "接口超时问题已修复，近48小时工单同步成功率99.6%。", "纳入系统运行周报持续监控。"),
    task("T202607-16", "公建服务公司", "医院后勤投诉闭环专项", "重点工作", "推进中", "高", "今日更新", 3, 78, "公建服务公司", "邓雅", "138-0001-2710", "2026-07-31", "高频投诉集中在保洁响应时效，已调整夜间班组配置。", "对投诉客户完成二次回访，并形成服务标准补充。"),
    task("T202607-17", "园区运营公司", "招商合同签约节点跟踪", "重点工作", "推进中", "普通", "三日内更新", 2, 60, "园区运营公司", "郑浩", "138-0001-2711", "2026-08-09", "3个意向客户完成商务条款确认，法务意见仍有2项待回复。", "推动法务会签，锁定8月首周签约计划。")
  ];

  function task(id, ownerScope, title, type, status, urgency, update, stageIndex, progress, department, owner, phone, due, progressText, nextPlan) {
    return {
      id, ownerScope, title, type, status, urgency, update, stageIndex, progress,
      department, owner, phone, due, progressText, nextPlan,
      histories: [
        ["2026-07-24 09:30", "更新进展", progressText],
        ["2026-07-22 17:10", "明确责任", `${department}${owner}确认为第一责任人，完成节点拆解。`],
        ["2026-07-19 10:20", "发起督办", `围绕${title}建立督办任务，要求按节点反馈。`]
      ]
    };
  }

  function scopedTasks() {
    if (state.scope === headquarter) return hqTasks;
    const matched = hqTasks.filter(item => item.ownerScope === state.scope);
    const seed = matched[0] || hqTasks.find(item => item.ownerScope !== "本部");
    const projects = ["城市服务中心", "综合物业项目", "产业园项目", "政务服务项目", "客户服务中心", "设备维保项目", "合同清收项目", "安全巡检项目"];
    return projects.slice(0, 7).map((project, index) => {
      const type = index % 3 === 0 ? "重点工作" : "基础工作";
      const status = index === 5 ? "已办结" : index === 2 ? "逾期预警" : "推进中";
      const urgency = status === "逾期预警" ? "紧急" : index % 2 ? "普通" : "高";
      const update = index === 2 ? "超7天未更新" : index % 2 ? "三日内更新" : "今日更新";
      const stageIndex = status === "已办结" ? 4 : Math.min(3, 1 + index % 3);
      const progress = status === "已办结" ? 100 : Math.max(35, 58 + index * 5 - (status === "逾期预警" ? 22 : 0));
      return task(`P202607-${index + 1}`, state.scope, `${project}${seed?.title?.replace(/^.*?(清欠|整改|优化|提升|跟踪|抽查)/, "$1") || "专项推进"}`, type, status, urgency, update, stageIndex, progress, state.scope, ["张明", "王佳", "陈立", "何敏", "刘强", "周宁", "赵琦"][index], `138-0002-27${String(index + 1).padStart(2, "0")}`, `2026-08-${String(index + 1).padStart(2, "0")}`, `${project}已完成责任分解，当前节点进度${progress}%，关键问题已纳入项目例会。`, `下一步由项目负责人提交佐证材料，并在三日内反馈复核结论。`);
    });
  }

  function filteredTasks() {
    const urgencyWeight = { "紧急": 3, "高": 2, "普通": 1 };
    const statusWeight = { "逾期预警": 4, "推进中": 3, "已办结": 1 };
    const updateWeight = { "超7天未更新": 3, "今日更新": 2, "三日内更新": 1 };
    return scopedTasks().filter(item => {
      if (!fuzzyMatch(taskSearchText(item), state.query)) return false;
      if (state.status !== "全部" && item.status !== state.status) return false;
      if (state.type !== "全部" && item.type !== state.type) return false;
      if (state.urgency !== "全部" && item.urgency !== state.urgency) return false;
      if (state.update !== "全部" && item.update !== state.update) return false;
      return true;
    }).sort((a, b) => {
      const scoreA = (statusWeight[a.status] || 0) * 100 + (urgencyWeight[a.urgency] || 0) * 10 + (updateWeight[a.update] || 0);
      const scoreB = (statusWeight[b.status] || 0) * 100 + (urgencyWeight[b.urgency] || 0) * 10 + (updateWeight[b.update] || 0);
      return scoreB - scoreA;
    });
  }

  function count(items, predicate) { return items.filter(predicate).length; }

  function statusClass(item) {
    if (item.status === "已办结") return "done";
    if (item.status === "逾期预警" || item.urgency === "紧急") return "danger";
    if (item.urgency === "高") return "warn";
    return "";
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[character]));
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

  function taskSearchText(item) {
    return [item.id, item.ownerScope, item.title, item.type, item.status, item.urgency, item.update, item.department, item.owner, item.phone, item.progressText, item.nextPlan].join(" ");
  }

  function findMount() {
    return document.querySelector('[data-h5-scroll-region="supervision"]')
      || [...document.querySelectorAll('[data-name="Reason"]')].at(-1)
      || document.body;
  }

  function renderStats(items) {
    const hqCount = count(items, item => item.ownerScope === "本部");
    const baseCount = count(items, item => item.type === "基础工作");
    const keyCount = count(items, item => item.type === "重点工作");
    const staleCount = count(items, item => item.update === "超7天未更新" || item.status === "逾期预警");
    const progressCount = count(items, item => item.status === "推进中" || item.status === "逾期预警");
    const doneCount = count(items, item => item.status === "已办结");
    return `<section class="supervision-command">
      <div class="supervision-command-main">
        <span>督办总览</span>
        <strong>${items.length} 项</strong>
        <p>${state.scope === headquarter ? `本部牵头 ${hqCount} 项，区域/专业公司 ${items.length - hqCount} 项` : `${state.scope}项目级事项`}</p>
      </div>
      <div class="supervision-command-side">
        <span class="${staleCount ? "danger" : ""}">需关注 ${staleCount}</span>
        <span>推进中 ${progressCount}</span>
        <span>已办结 ${doneCount}</span>
      </div>
    </section>
    <div class="supervision-overview">
      <div class="supervision-stat"><span>${state.scope === headquarter ? "本部工作" : "当前范围"}</span><strong>${state.scope === headquarter ? hqCount : items.length}</strong><em>${state.scope === headquarter ? "总部牵头" : "项目事项"}</em></div>
      <div class="supervision-stat"><span>基础工作</span><strong>${baseCount}</strong><em>制度台账</em></div>
      <div class="supervision-stat"><span>重点工作</span><strong>${keyCount}</strong><em>经营安全</em></div>
      <div class="supervision-stat is-warn"><span>需关注</span><strong>${staleCount}</strong><em>逾期/未更新</em></div>
    </div>`;
  }

  function renderFilters() {
    return `<section class="supervision-panel">
      <label class="supervision-search"><span aria-hidden="true"></span><input type="search" placeholder="搜索事项、公司、负责人或手机号" value="${escapeHtml(state.query)}" data-supervision-search /></label>
      ${filters.map(group => `
      <div class="supervision-filter-row">
        <span>${escapeHtml(group.label)}</span>
        <div class="supervision-filter-options">${group.options.map(option => `<button type="button" class="${state[group.key] === option ? "active" : ""}" data-supervision-filter="${group.key}" data-supervision-value="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}</div>
      </div>`).join("")}</section>`;
  }

  function renderCard(item) {
    const status = statusClass(item);
    return `<article class="supervision-card ${status ? `is-${status}` : ""}">
      <div class="supervision-card-main">
        <div class="supervision-card-top">
          <h3 class="supervision-card-title">${escapeHtml(item.title)}<small>${escapeHtml(item.id)} · ${escapeHtml(item.ownerScope)}</small></h3>
          <span class="supervision-state ${status}">${escapeHtml(item.status)}</span>
        </div>
        <div class="supervision-tags">
          <span>${escapeHtml(item.type)}</span>
          <span>${escapeHtml(item.urgency)}</span>
          <span>${escapeHtml(item.update)}</span>
        </div>
        <div class="supervision-meta">
          <div><span>当前节点</span><strong>${escapeHtml(stages[item.stageIndex])}</strong></div>
          <div><span>计划完成</span><strong>${escapeHtml(item.due)}</strong></div>
          <div><span>责任部门</span><strong>${escapeHtml(item.department)}</strong></div>
          <div><span>负责人</span><a href="tel:${escapeHtml(item.phone.replace(/-/g, ""))}">${escapeHtml(item.owner)} ${escapeHtml(item.phone)}</a></div>
        </div>
        <div class="supervision-progress">
          <div class="supervision-progress-head"><span>流程进度 ${item.progress}%</span><span>${escapeHtml(item.update)}</span></div>
          <div class="supervision-track">${stages.map((_, index) => `<i class="${index <= item.stageIndex ? "active" : ""}"></i>`).join("")}</div>
        </div>
        <div class="supervision-copy">
          <p><b>最新进展：</b>${escapeHtml(item.progressText)}</p>
          <p><b>下一步：</b>${escapeHtml(item.nextPlan)}</p>
        </div>
      </div>
      <details class="supervision-history">
        <summary>查看进展历史 <span>${item.histories.length} 条</span></summary>
        <div class="supervision-timeline">${item.histories.map(record => `<div class="supervision-timeline-item"><time>${escapeHtml(record[0])}</time><strong>${escapeHtml(record[1])}</strong><p>${escapeHtml(record[2])}</p></div>`).join("")}</div>
      </details>
    </article>`;
  }

  function render() {
    const mount = findMount();
    if (!mount) return;
    const items = scopedTasks();
    const rows = filteredTasks();
    mount.style.padding = "0";
    mount.style.gap = "0";
    mount.innerHTML = `<main class="supervision-workbench">
      ${renderStats(items)}
      ${renderFilters()}
      <div class="supervision-section-head">
        <div class="supervision-section-title">督办清单</div>
        <div class="supervision-section-note">${escapeHtml(state.scope)} · ${rows.length}/${items.length} 项</div>
      </div>
      <div class="supervision-list">${rows.length ? rows.map(renderCard).join("") : `<div class="supervision-empty">当前筛选条件下暂无督办事项</div>`}</div>
    </main>`;
    bind();
  }

  function bind() {
    document.querySelectorAll("[data-supervision-filter]").forEach(button => {
      button.addEventListener("click", () => {
        state[button.dataset.supervisionFilter] = button.dataset.supervisionValue;
        render();
      });
    });
    const search = document.querySelector("[data-supervision-search]");
    search?.addEventListener("input", () => {
      state.query = search.value;
      render();
      requestAnimationFrame(() => {
        const next = document.querySelector("[data-supervision-search]");
        if (!next) return;
        next.focus();
        next.setSelectionRange(next.value.length, next.value.length);
      });
    });
  }

  function setScope(scope) {
    if (!scope || state.scope === scope) return;
    state.scope = scope;
    state.status = "全部";
    state.type = "全部";
    state.urgency = "全部";
    state.update = "全部";
    state.query = "";
    render();
  }

  window.prototypeSupervision = { setScope };
  window.addEventListener("message", event => {
    const message = event.data;
    if (!message || message.source !== "prototype-app" || message.action !== "scope-updated") return;
    setScope(message.scope);
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
