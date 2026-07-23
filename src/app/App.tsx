import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BellRing,
  Building2,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  Clock3,
  Eye,
  FileText,
  Grid2X2,
  Info,
  Landmark,
  Lightbulb,
  Menu,
  MoreHorizontal,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Trophy,
  UserRound,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

import avatarUrl from "../imports/home-avatar.png";
import buildingUrl from "../imports/home-building.png";

type Scope = "hq" | "region" | "project";
type Tab = "overview" | "ranking" | "tasks";
type Modal =
  | { kind: "scope" }
  | { kind: "menu" }
  | { kind: "updates" }
  | { kind: "health" }
  | { kind: "detail"; title: string; value: string; desc: string; rows: string[][] }
  | null;

type ScopePreset = {
  badge: string;
  company: string;
  greeting: string;
  refreshed: string;
  progress: ProgressMetric[];
  metrics: Metric[];
};

type Metric = {
  label: string;
  value: string;
  delta: string;
};

type ProgressMetric = {
  title: string;
  percent: number;
  done: string;
  target: string;
  rest: string;
};

type Module = {
  title: string;
  score: number;
  total: string;
  done: string;
  color: string;
  icon: LucideIcon;
  updates?: number;
  dot?: boolean;
};

const scopes: Array<{ key: Scope; label: string; desc: string }> = [
  { key: "hq", label: "总部级", desc: "查看集团整体经营健康与板块达成" },
  { key: "region", label: "区域级", desc: "聚焦大湾区区域公司经营偏差" },
  { key: "project", label: "项目级", desc: "下钻到项目运营与收缴明细" },
];

const scopePresets: Record<Scope, ScopePreset> = {
  hq: {
    badge: "企业经营管理驾驶舱",
    company: "天健城市服务有限公司",
    greeting: "董事长，上午好!",
    refreshed: "数据刷新 2026-01-29 12:34:56",
    progress: [
      { title: "营业总收入指标完成度", percent: 83, done: "18.6 亿", target: "22.5 亿", rest: "3.9 亿" },
      { title: "经营利润指标完成度", percent: 83, done: "18.6 亿", target: "22.5 亿", rest: "3.9 亿" },
    ],
    metrics: [
      { label: "收入合约额", value: "650万", delta: "+1 较上个月" },
      { label: "企业经营现金流", value: "1800万", delta: "+0.5% 较上个月" },
      { label: "应收金额", value: "320万", delta: "+0.5% 较上个月" },
      { label: "应付金额", value: "120万", delta: "+0.5% 较上个月" },
      { label: "经营成本", value: "200万", delta: "+0.5% 较上个月" },
      { label: "在管项目", value: "32个", delta: "+1 较上个月" },
      { label: "综合收缴率", value: "82%", delta: "+0.5% 较上个月" },
      { label: "员工数", value: "0.24万人", delta: "+1 较上个月" },
    ],
  },
  region: {
    badge: "大湾区经营驾驶舱",
    company: "大湾区区域公司",
    greeting: "区域负责人，上午好!",
    refreshed: "数据刷新 2026-01-29 12:36:18",
    progress: [
      { title: "区域收入指标完成度", percent: 86, done: "6.8 亿", target: "7.9 亿", rest: "1.1 亿" },
      { title: "区域利润指标完成度", percent: 79, done: "0.86 亿", target: "1.09 亿", rest: "0.23 亿" },
    ],
    metrics: [
      { label: "收入合约额", value: "218万", delta: "+2 较上个月" },
      { label: "经营现金流", value: "620万", delta: "+0.8% 较上个月" },
      { label: "应收金额", value: "96万", delta: "+0.3% 较上个月" },
      { label: "应付金额", value: "48万", delta: "+0.4% 较上个月" },
      { label: "经营成本", value: "72万", delta: "+0.2% 较上个月" },
      { label: "在管项目", value: "12个", delta: "+1 较上个月" },
      { label: "综合收缴率", value: "89%", delta: "+0.7% 较上个月" },
      { label: "员工数", value: "0.08万人", delta: "+1 较上个月" },
    ],
  },
  project: {
    badge: "项目经营驾驶舱",
    company: "深圳湾花园项目",
    greeting: "项目经理，上午好!",
    refreshed: "数据刷新 2026-01-29 12:38:07",
    progress: [
      { title: "项目收入指标完成度", percent: 91, done: "820 万", target: "900 万", rest: "80 万" },
      { title: "项目利润指标完成度", percent: 88, done: "132 万", target: "150 万", rest: "18 万" },
    ],
    metrics: [
      { label: "收入合约额", value: "86万", delta: "+3 较上个月" },
      { label: "经营现金流", value: "126万", delta: "+0.9% 较上个月" },
      { label: "应收金额", value: "18万", delta: "+0.6% 较上个月" },
      { label: "应付金额", value: "12万", delta: "+0.3% 较上个月" },
      { label: "经营成本", value: "21万", delta: "+0.1% 较上个月" },
      { label: "在管楼栋", value: "8栋", delta: "+0 较上个月" },
      { label: "综合收缴率", value: "96%", delta: "+1.2% 较上个月" },
      { label: "员工数", value: "126人", delta: "+2 较上个月" },
    ],
  },
};

const modules: Module[] = [
  { title: "经营板块", score: 98, total: "年度指标 12 项", done: "已达标 10 项", color: "#4F6BFF", icon: BarChart3, updates: 4 },
  { title: "运营板块", score: 97, total: "年度指标 10 项", done: "已达标 8 项", color: "#FF7A1A", icon: Zap, updates: 3 },
  { title: "内控板块", score: 99, total: "年度指标 6 项", done: "已达标 4 项", color: "#8B5CFF", icon: ShieldCheck, updates: 4 },
  { title: "舆情板块", score: 96, total: "年度指标 8 项", done: "已达标 6 项", color: "#F7A500", icon: Eye, updates: 4 },
  { title: "创新板块", score: 88, total: "年度指标 6 项", done: "已达标 4 项", color: "#12CBB8", icon: Lightbulb, updates: 4 },
  { title: "安全板块", score: 99, total: "年度指标 6 项", done: "已达标 6 项", color: "#22C55E", icon: CheckCircle2, dot: true },
];

const updateRows = [
  ["2026-07-21", "大湾区区域公司新增合同 2 份，合计 218 万元。", "已同步"],
  ["2026-07-21", "深圳湾花园项目收缴率环比提升 1.2%。", "关注"],
  ["2026-07-20", "运营板块新增 3 项动态，涉及工单闭环。", "待办"],
  ["2026-07-19", "内控板块审计资料补齐率达到 97%。", "已同步"],
];

const rankingRows = [
  ["经营综合分", "天健城市服务有限公司", "98"],
  ["现金流健康", "大湾区区域公司", "97"],
  ["收缴达成率", "深圳湾花园项目", "96"],
  ["运营闭环率", "城市公建服务中心", "95"],
];

const taskRows = [
  ["合同续签跟进", "大湾区区域公司", "今日 18:00 前"],
  ["应收款催缴清单确认", "深圳湾花园项目", "明日 12:00 前"],
  ["内控资料补证", "经营管理部", "本周五前"],
  ["舆情回访复盘", "客服运营组", "3 天内"],
];

function App() {
  const [scope, setScope] = useState<Scope>("hq");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [modal, setModal] = useState<Modal>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const data = scopePresets[scope];

  const refreshText = useMemo(() => {
    if (refreshCount === 0) {
      return data.refreshed;
    }
    return `刚刚刷新 ${refreshCount} 次`;
  }, [data.refreshed, refreshCount]);

  const openDetail = (title: string, value: string, desc: string, rows = detailRows(title)) => {
    setModal({ kind: "detail", title, value, desc, rows });
  };

  return (
    <main className="min-h-screen bg-[#DDE7FA] font-['Noto_Sans_SC',system-ui,sans-serif] text-[#1B2533]">
      <div className="relative mx-auto min-h-screen w-full max-w-[390px] overflow-hidden bg-[#EAF1FF] shadow-2xl">
        <StatusBar />
        <TitleBar onMore={() => setModal({ kind: "menu" })} onClose={() => setModal({ kind: "menu" })} />
        <CompanyBar data={data} onScope={() => setModal({ kind: "scope" })} onMenu={() => setModal({ kind: "menu" })} />
        <div className="h-[calc(100vh-142px)] overflow-y-auto pb-[86px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {activeTab === "overview" && (
            <>
              <Hero data={data} />
              <CoreSection data={{ ...data, refreshed: refreshText }} onOpenDetail={openDetail} onOpenUpdates={() => setModal({ kind: "updates" })} />
              <HealthSection refreshed={refreshText} onExplain={() => setModal({ kind: "health" })} onOpenDetail={openDetail} />
              <ModulesSection refreshed={refreshText} onOpenDetail={openDetail} onMore={() => setActiveTab("ranking")} />
            </>
          )}
          {activeTab === "ranking" && <RankingPage scope={scope} onOpenDetail={openDetail} />}
          {activeTab === "tasks" && <TasksPage onOpenDetail={openDetail} />}
        </div>
        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
        <FloatingRefresh onRefresh={() => setRefreshCount((count) => count + 1)} />
        {modal && (
          <Overlay
            modal={modal}
            scope={scope}
            onScopeChange={(next) => {
              setScope(next);
              setModal(null);
            }}
            onClose={() => setModal(null)}
            onRefresh={() => {
              setRefreshCount((count) => count + 1);
              setModal(null);
            }}
          />
        )}
      </div>
    </main>
  );
}

function StatusBar() {
  return (
    <div className="relative h-[44px] bg-[#EFEFEF] px-9 pt-[15px] text-[15px] font-extrabold leading-none text-[#1B1B1B]">
      <span>9:41</span>
      <div className="absolute left-1/2 top-0 h-[31px] w-[205px] -translate-x-1/2 rounded-b-[23px] bg-[#1F1F1F]" />
      <div className="absolute right-[16px] top-[15px] flex items-center gap-[5px]">
        <div className="flex h-[11px] items-end gap-[2px]">
          <span className="h-[4px] w-[3px] rounded-sm bg-[#1F1F1F]" />
          <span className="h-[6px] w-[3px] rounded-sm bg-[#1F1F1F]" />
          <span className="h-[8px] w-[3px] rounded-sm bg-[#1F1F1F]" />
          <span className="h-[10px] w-[3px] rounded-sm bg-[#1F1F1F]" />
        </div>
        <span className="h-[11px] w-[14px] rounded-t-full border-[2px] border-b-0 border-[#1F1F1F]" />
        <span className="relative h-[11px] w-[22px] rounded-[3px] border-[2px] border-[#1F1F1F]">
          <span className="absolute -right-[4px] top-[3px] h-[4px] w-[2px] rounded-r bg-[#1F1F1F]" />
          <span className="absolute inset-[2px] rounded-[1px] bg-[#1F1F1F]" />
        </span>
      </div>
    </div>
  );
}

function TitleBar({ onMore, onClose }: { onMore: () => void; onClose: () => void }) {
  return (
    <header className="flex h-[48px] items-center justify-between bg-[#EFEFEF] px-[17px]">
      <button className="grid size-8 place-items-center text-[#1D2430] active:scale-95" aria-label="返回" onClick={onClose}>
        <ArrowLeft className="size-[23px]" strokeWidth={2.2} />
      </button>
      <h1 className="max-w-[205px] truncate text-center text-[20px] font-extrabold leading-none tracking-[0] text-[#161A20]">
        企业经营管理驾...
      </h1>
      <div className="flex h-[38px] w-[91px] items-center rounded-full border border-[#D3D7DE] bg-[#F7F7F7] shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
        <button className="grid flex-1 place-items-center active:scale-95" aria-label="更多" onClick={onMore}>
          <MoreHorizontal className="size-[23px]" strokeWidth={3} />
        </button>
        <span className="h-[22px] w-px bg-[#DFE1E5]" />
        <button className="grid flex-1 place-items-center active:scale-95" aria-label="关闭" onClick={onClose}>
          <Circle className="size-[18px]" strokeWidth={2.8} />
        </button>
      </div>
    </header>
  );
}

function CompanyBar({ data, onScope, onMenu }: { data: ScopePreset; onScope: () => void; onMenu: () => void }) {
  return (
    <section className="flex h-[50px] items-center justify-between bg-white px-4 shadow-[0_1px_0_rgba(28,47,89,0.04)]">
      <button className="flex min-w-0 items-center gap-2 text-left active:scale-[0.99]" onClick={onScope}>
        <div className="grid size-[32px] shrink-0 place-items-center rounded-[11px] bg-[#3F65F2] shadow-[0_7px_15px_rgba(57,93,236,0.22)]">
          <Landmark className="size-[17px] text-white" strokeWidth={2.1} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold leading-[14px] text-[#8791A3]">{data.badge}</p>
          <p className="truncate text-[14px] font-extrabold leading-[17px] text-[#111827]">{data.company}</p>
        </div>
      </button>
      <div className="flex items-center gap-[9px]">
        <button className="h-[32px] rounded-full bg-[#4070F4] px-[13px] text-[12px] font-bold leading-[32px] text-white shadow-[0_6px_14px_rgba(64,112,244,0.25)] active:scale-95" onClick={onScope}>
          切换范围
        </button>
        <button className="grid size-[34px] place-items-center rounded-full bg-[#EEF3FF] active:scale-95" aria-label="菜单" onClick={onMenu}>
          <Menu className="size-[18px] text-[#52637C]" />
        </button>
      </div>
    </section>
  );
}

function Hero({ data }: { data: ScopePreset }) {
  return (
    <section className="relative h-[123px] bg-[#EAF1FF] px-4 pt-[25px]">
      <div className="flex items-center">
        <img src={avatarUrl} alt="" className="size-[54px] rounded-full object-cover shadow-[0_4px_10px_rgba(38,69,112,0.14)]" />
        <div className="ml-[15px] min-w-0 pt-[2px]">
          <p className="text-[17px] font-extrabold leading-[24px] text-[#263247]">{data.greeting}</p>
          <p className="mt-[1px] text-[12px] leading-[16px] text-[#8C98AC]">上次登录 2026-07-21 12:34:56</p>
        </div>
        <img src={buildingUrl} alt="" className="absolute right-[15px] top-[13px] h-[78px] w-[103px] object-contain" />
      </div>
    </section>
  );
}

function SectionTitle({ title, refreshed }: { title: string; refreshed?: string }) {
  return (
    <div className="mb-[9px] flex items-center justify-between">
      <div className="flex items-center gap-[6px]">
        <span className="h-[17px] w-[4px] rounded-[3px] bg-[#14C8D4]" />
        <h2 className="text-[15px] font-extrabold leading-none text-[#253348]">{title}</h2>
      </div>
      <p className="text-[10px] font-medium text-[#A7B1C3]">{refreshed ?? "数据刷新 2026-01-29 12:34:56"}</p>
    </div>
  );
}

function CoreSection({
  data,
  onOpenDetail,
  onOpenUpdates,
}: {
  data: ScopePreset;
  onOpenDetail: (title: string, value: string, desc: string, rows?: string[][]) => void;
  onOpenUpdates: () => void;
}) {
  return (
    <section className="px-3">
      <SectionTitle title="企业经营核心指标" refreshed={data.refreshed} />
      <ProgressPanel progress={data.progress} onOpenDetail={onOpenDetail} />
      <div className="mt-[8px] grid grid-cols-2 gap-[8px]">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} onOpen={() => onOpenDetail(metric.label, metric.value, `${metric.label}本期表现稳定，${metric.delta}。可继续查看区域、项目和合同明细。`)} />
        ))}
      </div>
      <UpdateNotice onOpen={onOpenUpdates} />
    </section>
  );
}

function ProgressPanel({
  progress,
  onOpenDetail,
}: {
  progress: ProgressMetric[];
  onOpenDetail: (title: string, value: string, desc: string, rows?: string[][]) => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-[7px] bg-[linear-gradient(114deg,#376EEA_0%,#3469E7_61%,#476EFF_100%)] px-[13px] pb-[13px] pt-[12px] text-white shadow-[0_8px_18px_rgba(48,91,218,0.2)]">
      <span className="pointer-events-none absolute right-0 top-0 h-full w-[72px] bg-white/5" />
      {progress.map((item, index) => (
        <div key={item.title} className={index === 0 ? "" : "mt-[13px]"}>
          <ProgressRow
            item={item}
            onClick={() => onOpenDetail(item.title, `${item.percent}%`, `已完成 ${item.done}，目标 ${item.target}，剩余 ${item.rest}。`)}
          />
        </div>
      ))}
    </div>
  );
}

function ProgressRow({ item, onClick }: { item: ProgressMetric; onClick: () => void }) {
  return (
    <button className="block w-full text-left active:scale-[0.995]" onClick={onClick}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-extrabold leading-[17px]">{item.title}</p>
          <p className="mt-[1px] text-[12px] font-medium leading-[16px] text-white/65">已完成 {item.done} / 目标 {item.target} · 剩余 {item.rest}</p>
        </div>
        <b className="text-[24px] font-extrabold leading-[27px]">{item.percent}%</b>
      </div>
      <div className="mt-[7px] h-[7px] rounded-full bg-white/20">
        <div className="h-full rounded-full bg-white" style={{ width: `${item.percent}%` }} />
      </div>
      <div className="mt-[4px] flex justify-between text-[10px] font-medium text-white/42">
        <span>0</span>
        <span>目标线 {item.target}</span>
      </div>
    </button>
  );
}

function MetricCard({ metric, onOpen }: { metric: Metric; onOpen: () => void }) {
  return (
    <button className="h-[80px] rounded-[7px] bg-white/82 px-[10px] py-[9px] text-left shadow-[0_1px_0_rgba(29,54,97,0.03)] active:scale-[0.98]" onClick={onOpen}>
      <div className="flex items-center gap-[3px] text-[#A5AFBE]">
        <Building2 className="size-[13px] text-[#63CEA2]" strokeWidth={2.2} />
        <p className="text-[12px] font-semibold leading-[15px]">{metric.label}</p>
      </div>
      <p className="mt-[6px] text-[17px] font-extrabold leading-[20px] text-[#202833]">{metric.value}</p>
      <p className="mt-[5px] text-[12px] font-semibold leading-[15px] text-[#969EAB]">
        <span className="text-[#FF4E35]">{metric.delta.split(" ")[0]}</span>
        <span> {metric.delta.split(" ").slice(1).join(" ")}</span>
      </p>
    </button>
  );
}

function UpdateNotice({ onOpen }: { onOpen: () => void }) {
  return (
    <button className="mt-[16px] flex h-[49px] w-full items-center rounded-[8px] bg-white/88 px-[10px] text-left shadow-[0_1px_0_rgba(29,54,97,0.03)] active:scale-[0.99]" onClick={onOpen}>
      <div className="flex w-[50px] shrink-0 items-center gap-[5px] text-[#3672F4]">
        <BellRing className="size-[17px] fill-[#3672F4]/10" />
        <span className="text-[12px] font-bold leading-[12px]">动态<br />更新</span>
      </div>
      <p className="min-w-0 flex-1 truncate text-[12px] font-bold text-[#3D4657]">2026-07-21 大湾区区域公司新增合同.....</p>
      <div className="relative ml-2 rounded-full bg-[#3E70F3] px-[11px] py-[4px] text-[10px] font-bold text-white">
        更多
        <span className="absolute -right-[6px] -top-[9px] grid size-[16px] place-items-center rounded-full bg-[#FF4D67] text-[10px]">4</span>
      </div>
    </button>
  );
}

function HealthSection({
  refreshed,
  onExplain,
  onOpenDetail,
}: {
  refreshed: string;
  onExplain: () => void;
  onOpenDetail: (title: string, value: string, desc: string, rows?: string[][]) => void;
}) {
  return (
    <section className="mt-[19px] px-3">
      <SectionTitle title="企业经营健康值评分" refreshed={refreshed} />
      <article className="rounded-[7px] bg-white/52 px-[15px] pb-[14px] pt-[17px] shadow-[0_1px_0_rgba(29,54,97,0.03)]">
        <button className="mx-auto flex h-[41px] w-[166px] items-center justify-center gap-[8px] rounded-[8px] bg-[#D9FBF0] text-[#18C56D] active:scale-95" onClick={onExplain}>
          <Trophy className="size-[22px] fill-[#18C56D] text-[#18C56D]" />
          <span className="text-[14px] font-extrabold">健康评分</span>
          <b className="text-[26px] font-extrabold leading-none">91</b>
          <span className="text-[15px] font-extrabold">分</span>
        </button>
        <RadarChart onOpenDetail={onOpenDetail} />
        <div className="mt-[8px] flex justify-center">
          <span className="flex items-center gap-[8px] text-[12px] font-bold text-[#273242]">
            <span className="h-[3px] w-[9px] rounded-full bg-[#12CDB0]" />
            本年累计
          </span>
        </div>
        <div className="mt-[18px] flex justify-center">
          <button className="flex h-[24px] items-center gap-[5px] rounded-full bg-[#F1F4FA] px-[11px] text-[12px] font-bold text-[#A3AAB6] active:scale-95" onClick={onExplain}>
            评分说明 <span className="grid size-[14px] place-items-center rounded-full border border-[#ABB2BD] text-[10px]">i</span>
          </button>
        </div>
        <button className="mt-[18px] block rounded-[7px] border border-[#BFEED4] bg-[#EEFFF5] px-[12px] py-[10px] text-left text-[12px] font-semibold leading-[19px] text-[#46A776] active:scale-[0.99]" onClick={onExplain}>
          <span className="mr-[7px] text-[15px] text-[#28C56F]">↗</span>
          当前年度健康值为 <b>91分</b>，整体经营状态优良。经营运营、安全基础扎实；内控、舆情有所回落，建议优化补强，同时借力经营收益加大创新投入，实现各维度均衡发展。
        </button>
      </article>
    </section>
  );
}

function RadarChart({ onOpenDetail }: { onOpenDetail: (title: string, value: string, desc: string, rows?: string[][]) => void }) {
  const points = [
    [183, 42],
    [260, 84],
    [240, 184],
    [183, 215],
    [98, 184],
    [91, 99],
  ];
  const rings = [39, 78, 117, 156];
  return (
    <div className="relative mx-auto mt-[12px] h-[289px] w-[342px] max-w-full">
      <svg viewBox="0 0 342 270" className="absolute inset-x-0 top-[8px] h-[270px] w-full">
        {rings.map((r) => (
          <polygon key={r} points={hexPoints(183, 137, r)} fill="none" stroke="#DCE4F1" strokeWidth="1" />
        ))}
        {[30, 90, 150, 210, 270, 330].map((deg) => {
          const rad = (Math.PI / 180) * deg;
          return <line key={deg} x1="183" y1="137" x2={183 + Math.cos(rad) * 156} y2={137 + Math.sin(rad) * 156} stroke="#DCE4F1" strokeWidth="1" />;
        })}
        {[0, 25, 50, 75, 100].map((v, i) => (
          <text key={v} x="183" y={139 - i * 30} textAnchor="middle" className="fill-[#B3BDCC] text-[11px] font-medium">
            {v}{v === 0 ? "" : "%"}
          </text>
        ))}
        <polygon points={points.map((p) => p.join(",")).join(" ")} fill="rgba(28,207,173,0.45)" stroke="#0BC9A7" strokeWidth="2.5" />
      </svg>
      <RadarLabel onClick={() => onOpenDetail("经营指标", "15项", "财务结果与市场增量保持领先，本年累计贡献健康值 24 分。")} className="left-[115px] top-[6px]" badge="15项" title="经营指标" desc="财务结果与市场增量" align="center" />
      <RadarLabel onClick={() => onOpenDetail("运营指标", "10项", "执行效率与重点任务稳步达成，工单闭环和服务效率表现较好。")} className="right-0 top-[76px]" badge="10项" title="运营指标" desc="执行效率\n与重点任务" />
      <RadarLabel onClick={() => onOpenDetail("内控指标", "6项", "廉洁、审计与流程仍需补强，建议关注未闭环材料。")} className="right-0 top-[191px]" badge="6项" title="内控指标" desc="廉洁、审计\n与流程" />
      <RadarLabel onClick={() => onOpenDetail("舆情指标", "8项", "品牌形象与外部评价整体可控，近期需跟进负面反馈闭环。")} className="left-[127px] top-[240px]" badge="8项" title="舆情指标" desc="品牌形象与外部评价" align="center" />
      <RadarLabel onClick={() => onOpenDetail("创新指标", "6项", "业务创新与模式突破存在提升空间，可增加数字化工具复用。")} className="left-0 top-[191px]" badge="6项" title="创新指标" desc="业务创新\n与模式突破" />
      <RadarLabel onClick={() => onOpenDetail("安全指标", "6项", "生产安全与系统稳定表现扎实，重大安全事故为 0。")} className="left-0 top-[76px]" badge="6项" title="安全指标" desc="生产安全\n与系统稳定" />
    </div>
  );
}

function hexPoints(cx: number, cy: number, r: number) {
  return [30, 90, 150, 210, 270, 330]
    .map((deg) => {
      const rad = (Math.PI / 180) * deg;
      return `${cx + Math.cos(rad) * r},${cy + Math.sin(rad) * r}`;
    })
    .join(" ");
}

function RadarLabel({
  badge,
  title,
  desc,
  className,
  onClick,
  align = "left",
}: {
  badge: string;
  title: string;
  desc: string;
  className: string;
  onClick: () => void;
  align?: "left" | "center";
}) {
  return (
    <button className={`absolute w-[82px] text-[10px] leading-[12px] text-[#7C8798] active:scale-95 ${align === "center" ? "text-center" : "text-left"} ${className}`} onClick={onClick}>
      <span className="mb-[4px] inline-grid h-[22px] min-w-[37px] place-items-center rounded-[4px] bg-white px-[7px] text-[11px] font-bold text-[#697589] shadow-[0_1px_3px_rgba(20,41,80,0.05)]">
        {badge}
      </span>
      <b className="block text-[12px] leading-[14px] text-[#4E5A6B]">{title}</b>
      {desc.split("\n").map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </button>
  );
}

function ModulesSection({
  refreshed,
  onOpenDetail,
  onMore,
}: {
  refreshed: string;
  onOpenDetail: (title: string, value: string, desc: string, rows?: string[][]) => void;
  onMore: () => void;
}) {
  return (
    <section className="mt-[19px] px-3">
      <SectionTitle title="企业经营六大指标" refreshed={refreshed} />
      <div className="grid grid-cols-2 gap-[10px]">
        {modules.map((module) => (
          <ModuleCard key={module.title} module={module} onOpen={() => onOpenDetail(module.title, `${module.score}分`, `${module.title}当前综合分 ${module.score}，${module.total}，${module.done}。`, detailRows(module.title))} />
        ))}
      </div>
      <button className="mt-[16px] h-[40px] w-full rounded-[7px] bg-white/72 text-[13px] font-bold text-[#B0B8C6] active:scale-[0.99]" onClick={onMore}>
        点击查看更多数据 〉
      </button>
    </section>
  );
}

function ModuleCard({ module, onOpen }: { module: Module; onOpen: () => void }) {
  const Icon = module.icon;
  return (
    <button className="relative h-[123px] overflow-hidden rounded-[7px] bg-white/72 px-[12px] py-[12px] text-left shadow-[0_1px_0_rgba(29,54,97,0.03)] active:scale-[0.98]" onClick={onOpen}>
      <span className="absolute inset-x-0 top-0 h-[4px]" style={{ backgroundColor: module.color }} />
      <div className="flex items-start justify-between">
        <div className="grid size-[31px] place-items-center rounded-full" style={{ backgroundColor: `${module.color}18` }}>
          <Icon className="size-[17px]" style={{ color: module.color }} strokeWidth={2.2} />
        </div>
        {module.dot ? (
          <span className="mt-[4px] size-[6px] rounded-full bg-[#24C56B]" />
        ) : (
          <div className="flex items-center gap-[5px]">
            <span className="rounded-[4px] bg-[#FFE9EF] px-[6px] py-[3px] text-[9px] font-extrabold text-[#FF5370]">更新动态 {module.updates}</span>
            <span className="size-[5px] rounded-full bg-[#FF5370]" />
          </div>
        )}
      </div>
      <p className="mt-[10px] text-[12px] font-bold text-[#A6B0C0]">{module.title}</p>
      <p className="mt-[8px] text-[12px] font-bold leading-[15px] text-[#667386]">
        当前综合分 <b className="text-[17px] text-[#263247]">{module.score}</b>
      </p>
      <div className="mt-[3px] flex gap-[3px]">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} className="h-[4px] flex-1 rounded-full" style={{ backgroundColor: index < Math.round(module.score / 10) ? "#31C46D" : "#D9DEE7" }} />
        ))}
      </div>
      <p className="mt-[4px] truncate text-[10px] font-semibold text-[#A7B0C0]">
        {module.total} / {module.done}
      </p>
    </button>
  );
}

function RankingPage({ scope, onOpenDetail }: { scope: Scope; onOpenDetail: (title: string, value: string, desc: string, rows?: string[][]) => void }) {
  const scopeLabel = scopes.find((item) => item.key === scope)?.label ?? "总部级";
  return (
    <section className="px-3 pt-[18px]">
      <SectionTitle title="企业经营排行榜" refreshed={`${scopeLabel} · 本年累计`} />
      <div className="rounded-[8px] bg-white/72 p-[12px]">
        {rankingRows.map((row, index) => (
          <button key={row[0]} className="flex w-full items-center gap-[10px] border-b border-[#EDF1F8] py-[12px] text-left last:border-b-0 active:scale-[0.99]" onClick={() => onOpenDetail(row[0], `${row[2]}分`, `${row[1]}在${row[0]}中排名第 ${index + 1}。`)}>
            <span className={`grid size-[27px] place-items-center rounded-full text-[13px] font-extrabold ${index === 0 ? "bg-[#3F70F4] text-white" : "bg-[#EEF3FF] text-[#637083]"}`}>{index + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-extrabold text-[#263247]">{row[0]}</p>
              <p className="mt-[2px] truncate text-[11px] font-semibold text-[#98A3B5]">{row[1]}</p>
            </div>
            <b className="text-[20px] text-[#2F69EF]">{row[2]}</b>
          </button>
        ))}
      </div>
      <section className="mt-[14px] rounded-[8px] bg-white/72 p-[13px]">
        <div className="flex items-center gap-[8px] text-[14px] font-extrabold text-[#253348]">
          <Search className="size-[17px] text-[#3F70F4]" />
          指标筛选
        </div>
        <div className="mt-[12px] grid grid-cols-3 gap-[8px]">
          {["综合分", "收缴率", "现金流", "利润率", "项目数", "风险数"].map((item, index) => (
            <button key={item} className={`h-[32px] rounded-full text-[12px] font-bold ${index === 0 ? "bg-[#3F70F4] text-white" : "bg-white text-[#6D788A]"}`} onClick={() => onOpenDetail(item, index === 0 ? "98分" : "已筛选", `已切换到${item}维度，可查看对应排行与明细。`)}>
              {item}
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

function TasksPage({ onOpenDetail }: { onOpenDetail: (title: string, value: string, desc: string, rows?: string[][]) => void }) {
  return (
    <section className="px-3 pt-[18px]">
      <SectionTitle title="经营督办" refreshed="4 项待处理" />
      <div className="space-y-[10px]">
        {taskRows.map((row, index) => (
          <button key={row[0]} className="flex w-full items-center gap-[11px] rounded-[8px] bg-white/78 p-[12px] text-left active:scale-[0.99]" onClick={() => onOpenDetail(row[0], row[2], `${row[1]}需在${row[2]}完成，已进入督办跟进。`)}>
            <span className={`grid size-[31px] place-items-center rounded-full ${index === 0 ? "bg-[#FFF2DB] text-[#F59E0B]" : "bg-[#EEF3FF] text-[#3F70F4]"}`}>
              {index === 0 ? <AlertTriangle className="size-[17px]" /> : <Clock3 className="size-[17px]" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-extrabold text-[#263247]">{row[0]}</p>
              <p className="mt-[3px] text-[11px] font-semibold text-[#98A3B5]">{row[1]}</p>
            </div>
            <ChevronRight className="size-[17px] text-[#AEB8C8]" />
          </button>
        ))}
      </div>
    </section>
  );
}

function BottomNav({ activeTab, onChange }: { activeTab: Tab; onChange: (tab: Tab) => void }) {
  const items: Array<{ key: Tab; label: string; icon: LucideIcon; badge?: number }> = [
    { key: "overview", label: "总览", icon: Grid2X2, badge: 2 },
    { key: "ranking", label: "排行", icon: Trophy },
    { key: "tasks", label: "督办", icon: ClipboardList, badge: 4 },
  ];

  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 grid h-[73px] grid-cols-3 border-t border-[#EDF0F6] bg-white shadow-[0_-8px_18px_rgba(29,54,97,0.04)]">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.key;
        return (
          <button key={item.key} className={`relative flex flex-col items-center pt-[12px] text-[11px] font-bold active:scale-95 ${active ? "text-[#3F70F4]" : "text-[#AAB8CC]"}`} onClick={() => onChange(item.key)}>
            {active && <span className="absolute top-0 h-[3px] w-[42px] rounded-b-full bg-[#3F70F4]" />}
            <span className="relative">
              <Icon className="size-[21px]" strokeWidth={2.3} />
              {item.badge && <span className="absolute -right-[9px] -top-[8px] grid size-[16px] place-items-center rounded-full bg-[#FF536B] text-[10px] text-white">{item.badge}</span>}
            </span>
            <span className="mt-[3px]">{item.label}</span>
          </button>
        );
      })}
      <span className="absolute bottom-[7px] left-1/2 h-[4px] w-[116px] -translate-x-1/2 rounded-full bg-[#C7D4EA]" />
    </nav>
  );
}

function FloatingRefresh({ onRefresh }: { onRefresh: () => void }) {
  return (
    <button className="absolute bottom-[88px] right-[12px] z-10 grid size-[38px] place-items-center rounded-full bg-white/90 text-[#3F70F4] shadow-[0_8px_18px_rgba(47,85,155,0.18)] active:scale-95" aria-label="刷新数据" onClick={onRefresh}>
      <RefreshCw className="size-[18px]" />
    </button>
  );
}

function Overlay({
  modal,
  scope,
  onScopeChange,
  onClose,
  onRefresh,
}: {
  modal: NonNullable<Modal>;
  scope: Scope;
  onScopeChange: (scope: Scope) => void;
  onClose: () => void;
  onRefresh: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-end bg-black/28">
      <button className="absolute inset-0 cursor-default" aria-label="关闭弹层" onClick={onClose} />
      <div className="relative max-h-[78vh] w-full overflow-y-auto rounded-t-[18px] bg-white px-[16px] pb-[22px] pt-[14px] shadow-[0_-12px_30px_rgba(22,36,64,0.18)]">
        <div className="mb-[14px] flex items-center justify-between">
          <div className="h-[4px] w-[42px] rounded-full bg-[#DCE3F0]" />
          <button className="grid size-[30px] place-items-center rounded-full bg-[#F3F6FB] active:scale-95" onClick={onClose} aria-label="关闭">
            <X className="size-[17px] text-[#6B7688]" />
          </button>
        </div>
        {modal.kind === "scope" && <ScopeSheet scope={scope} onScopeChange={onScopeChange} />}
        {modal.kind === "menu" && <MenuSheet onRefresh={onRefresh} />}
        {modal.kind === "updates" && <UpdatesSheet />}
        {modal.kind === "health" && <HealthSheet />}
        {modal.kind === "detail" && <DetailSheet modal={modal} />}
      </div>
    </div>
  );
}

function ScopeSheet({ scope, onScopeChange }: { scope: Scope; onScopeChange: (scope: Scope) => void }) {
  return (
    <div>
      <h3 className="text-[18px] font-extrabold text-[#202A3A]">切换经营范围</h3>
      <p className="mt-[4px] text-[12px] font-semibold text-[#98A3B5]">选择后首页指标、问候对象和经营数据会同步刷新。</p>
      <div className="mt-[14px] space-y-[9px]">
        {scopes.map((item) => {
          const active = scope === item.key;
          return (
            <button key={item.key} className={`flex w-full items-center justify-between rounded-[9px] border px-[13px] py-[12px] text-left active:scale-[0.99] ${active ? "border-[#3F70F4] bg-[#EEF3FF]" : "border-[#ECF0F6] bg-white"}`} onClick={() => onScopeChange(item.key)}>
              <div>
                <p className={`text-[14px] font-extrabold ${active ? "text-[#3F70F4]" : "text-[#273242]"}`}>{item.label}</p>
                <p className="mt-[3px] text-[11px] font-semibold text-[#97A2B3]">{item.desc}</p>
              </div>
              {active ? <CheckCircle2 className="size-[19px] text-[#3F70F4]" /> : <ChevronRight className="size-[17px] text-[#AEB8C8]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MenuSheet({ onRefresh }: { onRefresh: () => void }) {
  const actions = [
    { icon: UserRound, title: "个人中心", desc: "查看账号、角色与权限" },
    { icon: FileText, title: "导出经营简报", desc: "生成本期核心指标摘要" },
    { icon: Settings, title: "消息与权限设置", desc: "配置预警、督办和微信提醒" },
  ];
  return (
    <div>
      <h3 className="text-[18px] font-extrabold text-[#202A3A]">快捷操作</h3>
      <div className="mt-[13px] space-y-[8px]">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.title} className="flex w-full items-center gap-[10px] rounded-[9px] bg-[#F7FAFF] p-[12px] text-left active:scale-[0.99]">
              <span className="grid size-[34px] place-items-center rounded-full bg-white text-[#3F70F4]">
                <Icon className="size-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <b className="block text-[13px] text-[#263247]">{action.title}</b>
                <span className="mt-[2px] block text-[11px] font-semibold text-[#98A3B5]">{action.desc}</span>
              </span>
              <ChevronRight className="size-[17px] text-[#AEB8C8]" />
            </button>
          );
        })}
        <button className="mt-[4px] h-[38px] w-full rounded-full bg-[#3F70F4] text-[13px] font-extrabold text-white active:scale-[0.99]" onClick={onRefresh}>
          立即刷新数据
        </button>
      </div>
    </div>
  );
}

function UpdatesSheet() {
  return (
    <div>
      <h3 className="text-[18px] font-extrabold text-[#202A3A]">动态更新</h3>
      <div className="mt-[12px] space-y-[8px]">
        {updateRows.map((row) => (
          <div key={`${row[0]}-${row[1]}`} className="rounded-[9px] bg-[#F7FAFF] px-[12px] py-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#3F70F4]">{row[0]}</span>
              <span className="rounded-full bg-white px-[8px] py-[3px] text-[10px] font-bold text-[#7C8798]">{row[2]}</span>
            </div>
            <p className="mt-[7px] text-[12px] font-semibold leading-[18px] text-[#39465A]">{row[1]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HealthSheet() {
  return (
    <div>
      <h3 className="text-[18px] font-extrabold text-[#202A3A]">健康评分说明</h3>
      <p className="mt-[6px] text-[12px] font-semibold leading-[19px] text-[#7C8798]">健康值由经营、运营、内控、舆情、创新、安全六个维度加权计算。当前年度健康值为 91 分，整体经营状态优良。</p>
      <div className="mt-[13px] grid grid-cols-2 gap-[8px]">
        {["经营 24分", "运营 18分", "内控 15分", "舆情 12分", "创新 10分", "安全 12分"].map((item) => (
          <div key={item} className="rounded-[8px] bg-[#F7FAFF] p-[10px] text-[12px] font-extrabold text-[#3F70F4]">
            <Info className="mb-[5px] size-[15px]" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailSheet({ modal }: { modal: Extract<Modal, { kind: "detail" }> }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-[#98A3B5]">指标明细</p>
      <div className="mt-[3px] flex items-end justify-between gap-[12px]">
        <h3 className="text-[18px] font-extrabold text-[#202A3A]">{modal.title}</h3>
        <b className="shrink-0 text-[24px] leading-none text-[#3F70F4]">{modal.value}</b>
      </div>
      <p className="mt-[8px] text-[12px] font-semibold leading-[19px] text-[#7C8798]">{modal.desc}</p>
      <div className="mt-[14px] overflow-hidden rounded-[9px] border border-[#ECF0F6]">
        {modal.rows.map((row) => (
          <div key={row.join("-")} className="grid grid-cols-[1.2fr_0.8fr_0.7fr] border-b border-[#ECF0F6] px-[10px] py-[9px] text-[11px] font-semibold last:border-b-0">
            <span className="truncate text-[#344054]">{row[0]}</span>
            <span className="text-[#7C8798]">{row[1]}</span>
            <span className={row[2].startsWith("+") ? "text-[#22B866]" : "text-[#FF5A45]"}>{row[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function detailRows(title: string) {
  if (title.includes("板块")) {
    return [
      ["核心指标", "已达标", "+2"],
      ["风险预警", "跟进中", "-1"],
      ["督办事项", "闭环率", "+6%"],
      ["数据质量", "正常", "+1%"],
    ];
  }
  return [
    ["总部", "本期", "+0.8%"],
    ["大湾区", "本期", "+1.2%"],
    ["深圳", "本期", "+0.6%"],
    ["项目明细", "跟踪中", "-0.2%"],
  ];
}

export default App;
