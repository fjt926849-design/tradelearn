"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { curriculumStats } from "@/data/curriculum";
import { tradeTerms } from "@/data/trade-terms";
import { settlementConcepts } from "@/data/settlement-concepts";
import { transportConcepts } from "@/data/transport-concepts";
import { insuranceConcepts } from "@/data/insurance-concepts";
import { documentsConcepts } from "@/data/documents-concepts";
import { customsConcepts } from "@/data/customs-concepts";
import { contractConcepts } from "@/data/contract-concepts";
import { MODULE_ROUTES } from "@/lib/types";
import type { CurriculumChapter, CurriculumPart, CurriculumPartId } from "@/lib/types";
import { trackLearningEvent } from "@/lib/analytics";

type PartFilter = "all" | CurriculumPartId;
const DEFAULT_PART_FILTER: PartFilter = "all";
const DEFAULT_WORKFLOW_FILTER = "全部";

const STATUS_META = {
  available: { label: "已开放", tone: "var(--color-status-mastered)" },
  partial: { label: "部分开放", tone: "var(--color-status-learning)" },
  planned: { label: "建设中", tone: "var(--color-text-muted)" },
} as const;

function chapterRoute(chapter: CurriculumChapter) {
  return chapter.route ?? (chapter.moduleId ? MODULE_ROUTES[chapter.moduleId] : `/knowledge-map/chapter/${chapter.id}`);
}

function matchesChapter(chapter: CurriculumChapter, query: string, workflow: string) {
  const normalized = query.trim().toLowerCase();
  const matchesWorkflow = workflow === "全部" || chapter.workflowStages.includes(workflow);
  if (!matchesWorkflow) return false;
  if (!normalized) return true;

  return [
    chapter.number,
    chapter.title,
    chapter.description,
    chapter.learningObjectives.join(" "),
    chapter.workflowStages.join(" "),
    chapter.sourceRefs.map((source) => source.label).join(" "),
  ].join(" ").toLowerCase().includes(normalized);
}

interface ConceptSearchItem {
  id: string;
  title: string;
  sub: string;
  module: string;
  href: string;
  text: string;
}

const conceptSearchItems: ConceptSearchItem[] = [
  ...tradeTerms.map((term) => ({
    id: `term-${term.code}`,
    title: `${term.code} ${term.chineseName}`,
    sub: term.fullName,
    module: "贸易术语",
    href: `/terms/${term.code.toLowerCase()}`,
    text: [term.code, term.fullName, term.chineseName, term.summary, term.description, term.keyPoint].join(" "),
  })),
  ...[
    [settlementConcepts, "国际结算", "/settlement"],
    [transportConcepts, "国际运输", "/transport"],
    [insuranceConcepts, "货运保险", "/insurance"],
    [documentsConcepts, "进出口单据", "/documents"],
    [customsConcepts, "报关与检验", "/customs"],
    [contractConcepts, "合同条款", "/contract"],
  ].flatMap(([items, module, baseRoute]) => (items as Array<{ id: string; title: string; englishTitle: string; category?: string; summary: string; description: string; keyFeatures?: string[] }>).map((item) => ({
    id: `${module}-${item.id}`,
    title: item.title,
    sub: item.englishTitle,
    module: module as string,
    href: `${baseRoute as string}/${item.id}`,
    text: [item.title, item.englishTitle, item.category ?? "", item.summary, item.description, ...(item.keyFeatures ?? [])].join(" "),
  }))),
];

function ChapterCard({ chapter }: { chapter: CurriculumChapter }) {
  const status = STATUS_META[chapter.status];
  const href = chapterRoute(chapter);
  const previewLabel = chapter.workflowStages[0] ?? "基础概念";
  const isPlanned = chapter.status === "planned";
  const body = (
    <article
      className="group border rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-[11px] font-semibold tabular-nums rounded-md px-2 py-1"
            style={{ background: "var(--color-accent-soft)", color: "var(--color-accent)" }}
          >
            {chapter.number}
          </span>
          <span className="text-[11px]" style={{ color: status.tone }}>{status.label}</span>
        </div>
        {href && <span className="text-sm transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: "var(--color-text-muted)" }}>→</span>}
      </div>

      <h3 className="mt-3 text-base font-semibold tracking-tight">{chapter.title}</h3>
      <p className="mt-1.5 text-xs leading-5" style={{ color: "var(--color-text-secondary)" }}>{chapter.description}</p>

      <div
        className="mt-4 rounded-lg border p-3"
        style={{ borderColor: "var(--color-border-light)", background: "var(--color-bg-soft)" }}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: "var(--color-text-muted)" }}>
            业务场景
          </span>
          <span className="text-xs font-medium" style={{ color: "var(--color-accent)" }}>{previewLabel}</span>
        </div>
        <p className="mt-2 text-xs leading-5" style={{ color: "var(--color-text-secondary)" }}>
          {chapter.learningObjectives[0] ?? "建立本章核心判断能力"}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {chapter.workflowStages.slice(0, 3).map((stage) => (
          <span
            key={stage}
            className="text-[10px] rounded-full border px-2 py-1"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
          >
            {stage}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span style={{ color: "var(--color-text-muted)" }}>
          {chapter.sourceRefs.length > 0 ? `来源 ${chapter.sourceRefs.length} 项` : "待补充来源"}
        </span>
        <span className="font-medium" style={{ color: "var(--color-text)" }}>
          {isPlanned ? "开始微课" : "进入学习"}
        </span>
      </div>
    </article>
  );

  if (!href) return <div aria-disabled="true">{body}</div>;
  return (
    <Link
      href={href}
      onClick={() => trackLearningEvent("curriculum_opened", { chapterId: chapter.id, chapterNumber: chapter.number })}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-xl"
    >
      {body}
    </Link>
  );
}

export default function CurriculumBrowser({ parts }: { parts: CurriculumPart[] }) {
  // Keep the server render and the browser's first render identical. Filters
  // intentionally reset on entry so users never return to a confusing result.
  const [partFilter, setPartFilter] = useState<PartFilter>(DEFAULT_PART_FILTER);
  const [workflowFilter, setWorkflowFilter] = useState(DEFAULT_WORKFLOW_FILTER);
  const [query, setQuery] = useState("");
  const [filterPanel, setFilterPanel] = useState(false);
  const [filterMode, setFilterMode] = useState<"part" | "workflow">("part");

  const workflows = useMemo(() => {
    const values = parts.flatMap((part) => part.chapters.flatMap((chapter) => chapter.workflowStages));
    return ["全部", ...Array.from(new Set(values))];
  }, [parts]);

  const workflowCounts = useMemo(() => {
    const counts = new Map<string, number>();
    parts.forEach((part) => part.chapters.forEach((chapter) => chapter.workflowStages.forEach((stage) => {
      counts.set(stage, (counts.get(stage) ?? 0) + 1);
    })));
    return counts;
  }, [parts]);

  useEffect(() => {
    if (!filterPanel) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFilterPanel(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [filterPanel]);

  const activePartFilter = partFilter === "all" || parts.some((part) => part.id === partFilter) ? partFilter : "all";
  const activeWorkflowFilter = workflows.includes(workflowFilter) ? workflowFilter : "全部";

  const visibleParts = useMemo(() => {
    return parts
      .filter((part) => activePartFilter === "all" || part.id === activePartFilter)
      .map((part) => ({
        ...part,
        chapters: part.chapters.filter((chapter) => matchesChapter(chapter, query, activeWorkflowFilter)),
      }))
      .filter((part) => part.chapters.length > 0);
  }, [parts, activePartFilter, query, activeWorkflowFilter]);

  const visibleChapterCount = visibleParts.reduce((total, part) => total + part.chapters.length, 0);
  const conceptMatches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return conceptSearchItems.filter((item) => item.text.toLowerCase().includes(normalized)).slice(0, 8);
  }, [query]);

  const activeFilterSummary = activePartFilter !== "all"
    ? parts.find((part) => part.id === activePartFilter)?.number ?? "教材篇章"
    : activeWorkflowFilter !== "全部"
      ? activeWorkflowFilter
      : "全部课程";

  const selectPart = (value: PartFilter) => {
    setPartFilter(value);
    setWorkflowFilter("全部");
    trackLearningEvent("curriculum_filtered", { filterType: "part", filterValue: value });
  };

  const selectWorkflow = (value: string) => {
    setWorkflowFilter(value);
    setPartFilter("all");
    trackLearningEvent("curriculum_filtered", { filterType: "workflow", filterValue: value });
  };

  const clearFilters = () => {
    setQuery("");
    setWorkflowFilter(DEFAULT_WORKFLOW_FILTER);
    setPartFilter(DEFAULT_PART_FILTER);
    setFilterMode("part");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          [curriculumStats.parts, "篇"],
          [curriculumStats.chapters, "章"],
          [curriculumStats.available + curriculumStats.partial, "已建/部分"],
        ].map(([value, label]) => (
          <div key={label} className="border rounded-lg p-3" style={{ borderColor: "var(--color-border)" }}>
            <div className="text-lg font-semibold tabular-nums">{value}</div>
            <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>{label}</div>
          </div>
        ))}
      </div>

      <section
        className="sticky top-[49px] z-20 -mx-1 rounded-xl border p-3 space-y-3"
        style={{ borderColor: "var(--color-border)", background: "color-mix(in srgb, var(--color-bg) 94%, transparent)", backdropFilter: "blur(10px)" }}
        aria-label="筛选课程"
      >
        <p className="px-1 text-xs leading-5" style={{ color: "var(--color-text-muted)" }}>
          用筛选快速缩小课程范围：按教材篇章或当前业务阶段查看，搜索可定位具体章节。筛选不会影响你的学习进度。
        </p>
        <button
          type="button"
          onClick={() => setFilterPanel(true)}
          aria-haspopup="dialog"
          aria-expanded={filterPanel}
          className="flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-bg-soft)]"
          style={{ borderColor: activePartFilter !== "all" || activeWorkflowFilter !== "全部" ? "var(--color-accent)" : "var(--color-border)" }}
        >
          <span>
            <span className="block text-[10px] tracking-[0.14em] uppercase" style={{ color: "var(--color-text-muted)" }}>课程筛选</span>
            <span className="mt-1 block text-sm font-medium">
              {activePartFilter !== "all"
                ? `${parts.find((part) => part.id === activePartFilter)?.number ?? "教材篇章"} · ${parts.find((part) => part.id === activePartFilter)?.chapters.length ?? 0} 章`
                : activeWorkflowFilter !== "全部"
                  ? `${activeWorkflowFilter} · ${workflowCounts.get(activeWorkflowFilter) ?? 0} 章`
                  : `全部内容 · ${curriculumStats.chapters + 1} 项`}
            </span>
          </span>
          <span aria-hidden="true" className="text-base" style={{ color: "var(--color-text-muted)" }}>⌄</span>
        </button>

        <label className="flex items-center gap-2 border rounded-lg px-3 py-2" style={{ borderColor: "var(--color-border)" }}>
          <span aria-hidden="true" style={{ color: "var(--color-text-muted)" }}>⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索章节、业务场景或关键词…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-muted)]"
            aria-label="搜索课程"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="text-xs" style={{ color: "var(--color-text-muted)" }} aria-label="清除搜索">清除</button>
          )}
        </label>
      </section>

      {filterPanel && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/30 p-3 sm:items-center" role="presentation" onClick={() => setFilterPanel(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="curriculum-filter-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border p-4 shadow-xl"
            style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 id="curriculum-filter-title" className="text-base font-semibold">筛选课程</h2>
                <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>选择一种浏览方式，课程筛选不会影响学习进度。</p>
              </div>
              <button type="button" onClick={() => setFilterPanel(false)} className="rounded-full border px-2.5 py-1 text-xs" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }} aria-label="关闭筛选面板">关闭</button>
            </div>

            <div className="mt-4 grid grid-cols-2 rounded-lg bg-[var(--color-bg-soft)] p-1">
              <button type="button" onClick={() => setFilterMode("part")} className="rounded-md px-3 py-2 text-sm font-medium transition-colors" style={{ background: filterMode === "part" ? "var(--color-surface)" : "transparent", color: filterMode === "part" ? "var(--color-text)" : "var(--color-text-muted)", boxShadow: filterMode === "part" ? "0 1px 2px rgb(0 0 0 / 8%)" : "none" }}>按教材篇章</button>
              <button type="button" onClick={() => setFilterMode("workflow")} className="rounded-md px-3 py-2 text-sm font-medium transition-colors" style={{ background: filterMode === "workflow" ? "var(--color-surface)" : "transparent", color: filterMode === "workflow" ? "var(--color-text)" : "var(--color-text-muted)", boxShadow: filterMode === "workflow" ? "0 1px 2px rgb(0 0 0 / 8%)" : "none" }}>按业务流程</button>
            </div>

            {filterMode === "part" ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  aria-pressed={activePartFilter === "all"}
                  onClick={() => { selectPart("all"); setFilterPanel(false); }}
                  className="rounded-lg border px-3 py-3 text-left text-sm"
                  style={{ borderColor: activePartFilter === "all" ? "var(--color-accent)" : "var(--color-border)", background: activePartFilter === "all" ? "var(--color-accent-soft)" : "transparent", color: activePartFilter === "all" ? "var(--color-accent)" : "var(--color-text)" }}
                >
                  <span className="block font-medium">全部内容</span>
                  <span className="mt-1 block text-xs opacity-70">{curriculumStats.chapters + 1} 项</span>
                </button>
                {parts.map((part) => {
                  const isActive = activePartFilter === part.id;
                  return (
                    <button
                      key={part.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => { selectPart(part.id); setFilterPanel(false); }}
                      className="rounded-lg border px-3 py-3 text-left text-sm"
                      style={{ borderColor: isActive ? "var(--color-accent)" : "var(--color-border)", background: isActive ? "var(--color-accent-soft)" : "transparent", color: isActive ? "var(--color-accent)" : "var(--color-text)" }}
                    >
                      <span className="block font-medium">{part.number}</span>
                      <span className="mt-1 block text-xs opacity-70">{part.chapters.length} 章</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {workflows.map((workflow) => {
                  const isActive = activeWorkflowFilter === workflow;
                  return (
                    <button
                      key={workflow}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => { selectWorkflow(workflow); setFilterPanel(false); }}
                      className="rounded-lg border px-3 py-3 text-left text-sm"
                      style={{ borderColor: isActive ? "var(--color-accent)" : "var(--color-border)", background: isActive ? "var(--color-accent-soft)" : "transparent", color: isActive ? "var(--color-accent)" : "var(--color-text)" }}
                    >
                      <span className="block font-medium">{workflow === "全部" ? "全部流程" : workflow}</span>
                      <span className="mt-1 block text-xs opacity-70">{workflow === "全部" ? `${curriculumStats.chapters + 1} 项` : `${workflowCounts.get(workflow) ?? 0} 章`}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {query || activeWorkflowFilter !== "全部" || activePartFilter !== "all" ? `当前显示 ${visibleChapterCount} 项 · ${activeFilterSummary}` : "按篇章浏览 · 每章都有业务应用场景"}
        </p>
        {(query || activeWorkflowFilter !== "全部" || activePartFilter !== "all") && (
          <button type="button" onClick={clearFilters} className="text-xs hover:underline" style={{ color: "var(--color-accent)" }}>
            清除筛选
          </button>
        )}
      </div>

      {query.trim() && conceptMatches.length > 0 && (
        <section className="space-y-2" aria-label="知识点搜索结果">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">知识点结果</h2>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>最多显示 8 项</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {conceptMatches.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => trackLearningEvent("curriculum_opened", { conceptId: item.id, module: item.module })}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-[var(--color-bg-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium truncate">{item.title}</span>
                  <span className="block mt-0.5 text-xs truncate" style={{ color: "var(--color-text-muted)" }}>{item.module} · {item.sub}</span>
                </span>
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {visibleParts.length === 0 ? (
        <div className="border rounded-xl p-8 text-center" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm font-medium">没有找到匹配章节</p>
          <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>试试更短的关键词，或清除筛选后重新浏览。</p>
          <button type="button" onClick={clearFilters} className="mt-4 text-sm font-medium hover:underline" style={{ color: "var(--color-accent)" }}>
            显示全部章节
          </button>
        </div>
      ) : (
        <section className="space-y-8">
          {visibleParts.map((part) => (
            <div key={part.id} className="space-y-3">
              <div className="flex items-end justify-between gap-3 border-b pb-3" style={{ borderColor: "var(--color-border)" }}>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.12em]" style={{ color: "var(--color-text-muted)" }}>{part.number}</p>
                  <h2 className="mt-1 text-base font-semibold">{part.title}</h2>
                  <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>{part.description}</p>
                </div>
                <span className="shrink-0 text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>{part.chapters.length} 章</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {part.chapters.map((chapter) => <ChapterCard key={chapter.id} chapter={chapter} />)}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
