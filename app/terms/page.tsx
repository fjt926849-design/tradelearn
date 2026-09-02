"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { tradeTerms } from "@/data/trade-terms";
import { tradeGlossary } from "@/data/trade-glossary";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import type { LearnStatus, TradeTerm } from "@/lib/types";
import { getModuleNav } from "@/lib/navigation";
import BackButton from "@/components/learn/BackButton";

type CategoryKey = TradeTerm["category"];
type StatusFilter = "all" | LearnStatus | "due";

const categoryOrder: Array<{ key: CategoryKey; label: string; shortLabel: string; desc: string }> = [
  { key: "E", label: "E 组 · 启运", shortLabel: "E 组", desc: "卖方在自己场所交货" },
  { key: "F", label: "F 组 · 主运费未付", shortLabel: "F 组", desc: "买方安排主运输" },
  { key: "C", label: "C 组 · 主运费已付", shortLabel: "C 组", desc: "卖方付主运费，风险提前转移" },
  { key: "D", label: "D 组 · 到达", shortLabel: "D 组", desc: "卖方承担至目的地的责任" },
];

const categoryTone: Record<CategoryKey, { color: string; background: string }> = {
  E: { color: "#7c3aed", background: "#f5f3ff" },
  F: { color: "#0369a1", background: "#f0f9ff" },
  C: { color: "#b45309", background: "#fffbeb" },
  D: { color: "#047857", background: "#ecfdf5" },
};

const statusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "全部状态" },
  { value: "new", label: "未开始" },
  { value: "learning", label: "学习中" },
  { value: "mastered", label: "已掌握" },
  { value: "due", label: "待复习" },
];

const INDEX_BY_SLUG = new Map(getModuleNav("incoterms").map((n, i) => [n.slug, i + 1] as const));

function getTermStatusLabel(status: LearnStatus, isDue: boolean) {
  if (isDue) return "待复习";
  if (status === "mastered" || status === "familiar") return "已掌握";
  if (status === "learning") return "学习中";
  return "未开始";
}

function TermRow({ term, index, status, isDue }: { term: TradeTerm; index: number; status: LearnStatus; isDue: boolean }) {
  const tone = categoryTone[term.category];
  const statusLabel = getTermStatusLabel(status, isDue);
  const statusColor = isDue
    ? "var(--color-status-review)"
    : status === "mastered" || status === "familiar"
      ? "var(--color-status-mastered)"
      : status === "learning"
        ? "var(--color-status-learning)"
        : "var(--color-text-muted)";

  return (
    <Link href={`/terms/${term.code.toLowerCase()}`} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 transition-colors hover:bg-[var(--color-bg-soft)] sm:px-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold tabular-nums" style={{ color: tone.color, background: tone.background }}>{String(index).padStart(2, "0")}</span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-base font-semibold tracking-tight">{term.code}</span>
          <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{term.chineseName}</span>
        </span>
        <span className="mt-1 block truncate text-xs" style={{ color: "var(--color-text-muted)" }}>{term.fullName} · {term.transportMode.join(" / ")}</span>
      </span>
      <span className="flex items-center gap-2">
        <span className="hidden text-xs sm:inline" style={{ color: statusColor }}>{statusLabel}</span>
        <span aria-hidden="true" className="text-lg leading-none transition-transform group-hover:translate-x-0.5" style={{ color: "var(--color-text-muted)" }}>→</span>
      </span>
    </Link>
  );
}

export default function TermsPage() {
  const { getTermProgress, getDueCodes } = useFlashcardProgress();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | CategoryKey>("all");
  const [transport, setTransport] = useState<"all" | "any" | "water">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const progressByCode = useMemo(
    () => new Map(tradeTerms.map((term) => [term.code, getTermProgress(term.code)] as const)),
    [getTermProgress]
  );
  const dueCodes = useMemo(
    () => getDueCodes(tradeTerms.map((term) => term.code)),
    [getDueCodes]
  );

  const stats = useMemo(() => {
    let mastered = 0;
    let learning = 0;
    let due = 0;
    for (const term of tradeTerms) {
      const progress = progressByCode.get(term.code);
      if (!progress) continue;
      if (progress.status === "mastered" || progress.status === "familiar") mastered++;
      if (progress.status === "learning") learning++;
      if (progress.status !== "new" && dueCodes.has(term.code)) due++;
    }
    return { mastered, learning, due };
  }, [dueCodes, progressByCode]);

  const filteredTerms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tradeTerms.filter((term) => {
      const progress = progressByCode.get(term.code);
      const isDue = Boolean(progress && progress.status !== "new" && dueCodes.has(term.code));
      const matchesQuery = !normalized || [term.code, term.chineseName, term.fullName, term.summary].some((value) => value.toLowerCase().includes(normalized));
      const matchesCategory = category === "all" || term.category === category;
      const isWaterOnly = term.transportMode.length === 2 && term.transportMode.every((mode) => mode.includes("水运") || mode === "海运");
      const matchesTransport = transport === "all" || (transport === "water" ? isWaterOnly : !isWaterOnly);
      const matchesStatus = statusFilter === "all" || (statusFilter === "due" ? isDue : progress?.status === statusFilter || (statusFilter === "mastered" && progress?.status === "familiar"));
      return matchesQuery && matchesCategory && matchesTransport && matchesStatus;
    });
  }, [category, dueCodes, progressByCode, query, statusFilter, transport]);

  const groupedTerms = useMemo(
    () => new Map(categoryOrder.map(({ key }) => [key, filteredTerms.filter((term) => term.category === key)] as const)),
    [filteredTerms]
  );

  return (
    <>
      <Header />
      <main className="flex-1 bg-[var(--color-bg-soft)]">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
          <BackButton fallbackRoute="/knowledge-map" label="返回课程地图" />
          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--color-accent)" }}>TRADE TERMS · INCOTERMS® 2020</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">贸易术语学习中心</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>先看责任边界，再进入术语详情。把 11 个规则放回真实的运输、报价和合同场景里理解。</p>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-2xl border bg-[var(--color-bg)] p-3" style={{ borderColor: "var(--color-border)" }}>
              <div className="rounded-xl bg-[var(--color-bg-soft)] p-3"><p className="text-2xl font-semibold">11</p><p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>规则</p></div>
              <div className="rounded-xl bg-[var(--color-bg-soft)] p-3"><p className="text-2xl font-semibold">{stats.mastered}</p><p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>已掌握</p></div>
              <div className="rounded-xl bg-[var(--color-bg-soft)] p-3"><p className="text-2xl font-semibold">{stats.due}</p><p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>待复习</p></div>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border bg-[var(--color-bg)] p-4 sm:p-5" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative block min-w-0 flex-1"><span className="sr-only">搜索术语</span><span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--color-text-muted)" }}>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索代码、中文名或用途" className="h-11 w-full rounded-xl border bg-[var(--color-bg)] pl-9 pr-3 text-sm outline-none transition focus:border-[var(--color-accent)]" style={{ borderColor: "var(--color-border)" }} /></label>
              <div className="flex flex-wrap gap-2"><Link href="/flashcards?module=incoterms" className="inline-flex h-11 items-center rounded-xl px-4 text-sm font-medium text-white" style={{ background: "var(--color-accent)" }}>开始闪卡 <span className="ml-2" aria-hidden="true">→</span></Link><Link href="/glossary" className="inline-flex h-11 items-center rounded-xl border px-4 text-sm font-medium" style={{ borderColor: "var(--color-border)" }}>全书专业词汇</Link></div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <select aria-label="按责任组筛选" value={category} onChange={(event) => setCategory(event.target.value as "all" | CategoryKey)} className="h-10 rounded-xl border bg-[var(--color-bg)] px-3 text-sm" style={{ borderColor: "var(--color-border)" }}><option value="all">全部责任组</option>{categoryOrder.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select>
              <select aria-label="按运输方式筛选" value={transport} onChange={(event) => setTransport(event.target.value as "all" | "any" | "water")} className="h-10 rounded-xl border bg-[var(--color-bg)] px-3 text-sm" style={{ borderColor: "var(--color-border)" }}><option value="all">全部运输方式</option><option value="any">任何运输方式</option><option value="water">海运 / 内河水运</option></select>
              <select aria-label="按学习状态筛选" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="h-10 rounded-xl border bg-[var(--color-bg)] px-3 text-sm" style={{ borderColor: "var(--color-border)" }}>{statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
            </div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div className="space-y-4">
              {categoryOrder.map((group) => {
                const terms = groupedTerms.get(group.key) ?? [];
                if (terms.length === 0) return null;
                return (
                  <section
                    key={group.key}
                    id={`group-${group.key}`}
                    className="overflow-hidden rounded-2xl border bg-[var(--color-bg)]"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div
                      className="flex items-center justify-between border-b px-4 py-4 sm:px-5"
                      style={{ borderColor: "var(--color-border)", background: "var(--color-bg-soft)" }}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="mt-1 h-8 w-1 rounded-full"
                          style={{ background: categoryTone[group.key].color }}
                          aria-hidden="true"
                        />
                        <div>
                          <p
                            className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                            style={{ color: categoryTone[group.key].color }}
                          >
                            {group.shortLabel} · 责任分组
                          </p>
                          <h2 className="mt-1 text-base font-semibold">{group.label}</h2>
                          <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                            {group.desc}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {terms.length} 个术语
                      </span>
                    </div>
                    <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                      {terms.map((term) => {
                        const progress = progressByCode.get(term.code);
                        const isDue = Boolean(
                          progress && progress.status !== "new" && dueCodes.has(term.code)
                        );
                        return (
                          <TermRow
                            key={term.code}
                            term={term}
                            index={INDEX_BY_SLUG.get(term.code.toLowerCase()) ?? 0}
                            status={progress?.status ?? "new"}
                            isDue={isDue}
                          />
                        );
                      })}
                    </div>
                  </section>
                );
              })}
              {filteredTerms.length === 0 && <div className="rounded-2xl border bg-[var(--color-bg)] px-5 py-14 text-center" style={{ borderColor: "var(--color-border)" }}><p className="text-sm font-medium">没有匹配的术语</p><p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>试试清空搜索，或切换其他筛选条件。</p></div>}
              <p className="px-1 text-xs leading-5" style={{ color: "var(--color-text-muted)" }}>术语规则只处理交货、费用和风险分配；品质、所有权、付款和争议解决仍需在合同中另行约定。</p>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-20">
              <div className="rounded-2xl border bg-[var(--color-bg)] p-5" style={{ borderColor: "var(--color-border)" }}><p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--color-accent)" }}>学习建议</p><h2 className="mt-3 text-lg font-semibold">先建立一张责任地图</h2><p className="mt-2 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>先按 E / F / C / D 理解风险和费用，再用闪卡巩固代码与中文名。</p><Link href="/practice/incoterms" className="mt-4 inline-flex text-sm font-medium" style={{ color: "var(--color-accent)" }}>进入术语实训 →</Link></div>
              <div className="rounded-2xl border bg-[var(--color-bg)] p-5" style={{ borderColor: "var(--color-border)" }}><div className="flex items-center justify-between"><h2 className="text-sm font-semibold">全书专业词汇</h2><span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{tradeGlossary.length} 张</span></div><p className="mt-2 text-xs leading-5" style={{ color: "var(--color-text-muted)" }}>合同、运输、保险、结算、谈判和跨境电商术语独立整理，不会混入 11 个术语的复习进度。</p><Link href="/glossary" className="mt-4 inline-flex text-sm font-medium" style={{ color: "var(--color-accent)" }}>浏览术语库 →</Link></div>
              <div className="rounded-2xl border bg-[var(--color-bg-soft)] p-5" style={{ borderColor: "var(--color-border)" }}><p className="text-xs font-semibold">来源与版本</p><p className="mt-2 text-xs leading-5" style={{ color: "var(--color-text-muted)" }}>黎孝先《国际贸易实务》第七版 · ICC Incoterms® 2020</p><Link href="https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/" target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-medium" style={{ color: "var(--color-accent)" }}>查看 ICC 说明 ↗</Link></div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
