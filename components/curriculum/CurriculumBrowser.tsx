"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { curriculumStats } from "@/data/curriculum";
import { getCurriculumLesson } from "@/data/curriculum-lessons";
import { tradeTerms } from "@/data/trade-terms";
import { settlementConcepts } from "@/data/settlement-concepts";
import { transportConcepts } from "@/data/transport-concepts";
import { insuranceConcepts } from "@/data/insurance-concepts";
import { documentsConcepts } from "@/data/documents-concepts";
import { customsConcepts } from "@/data/customs-concepts";
import { contractConcepts } from "@/data/contract-concepts";
import type { CurriculumChapter, CurriculumPart, CurriculumPartId } from "@/lib/types";
import { useCurriculumProgress } from "@/hooks/useCurriculumProgress";
import { trackLearningEvent } from "@/lib/analytics";

type PartFilter = "all" | CurriculumPartId;
type StatusFilter = "all" | "new" | "learning" | "completed";
type SortFilter = "default" | "recent" | "progress";
type ViewMode = "textbook" | "workflow";

const STATUS_META = {
  new: { label: "未开始", tone: "var(--color-text-muted)" },
  learning: { label: "进行中", tone: "var(--color-accent)" },
  completed: { label: "已完成", tone: "var(--color-status-mastered)" },
} as const;

const WORKFLOW_ORDER = ["询盘", "报价", "谈判", "合同", "装运", "履约", "风险", "结算", "合规", "争议", "基础概念"];

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

function chapterHref(chapter: CurriculumChapter) {
  return `/knowledge-map/chapter/${chapter.id}`;
}

function selectStyle() {
  return { borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text)" };
}

export default function CurriculumBrowser({ parts }: { parts: CurriculumPart[] }) {
  const { chapterProgress, currentChapter, completedCount, totalStudySeconds } = useCurriculumProgress();
  const [partFilter, setPartFilter] = useState<PartFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortFilter, setSortFilter] = useState<SortFilter>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("textbook");
  const [query, setQuery] = useState("");
  const [expandedPart, setExpandedPart] = useState<CurriculumPartId | undefined>();
  const [expandedChapter, setExpandedChapter] = useState<string | undefined>();
  const expandedPartId = expandedPart ?? currentChapter?.partId ?? "intro";
  const expandedChapterId = expandedChapter ?? currentChapter?.id;

  const filteredChapters = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = parts.flatMap((part) => part.chapters.map((chapter) => ({ chapter, part })));
    return result
      .filter(({ part }) => partFilter === "all" || part.id === partFilter)
      .filter(({ chapter }) => statusFilter === "all" || chapterProgress[chapter.id]?.status === statusFilter)
      .filter(({ chapter }) => {
        if (!normalized) return true;
        return [chapter.number, chapter.title, chapter.description, chapter.learningObjectives.join(" "), chapter.workflowStages.join(" "), chapter.sourceRefs.map((source) => source.label).join(" ")].join(" ").toLowerCase().includes(normalized);
      })
      .sort((a, b) => {
        if (sortFilter === "progress") return (chapterProgress[b.chapter.id]?.progress ?? 0) - (chapterProgress[a.chapter.id]?.progress ?? 0);
        if (sortFilter === "recent") return (chapterProgress[b.chapter.id]?.lastOpenedAt ?? 0) - (chapterProgress[a.chapter.id]?.lastOpenedAt ?? 0);
        return parts.indexOf(a.part) - parts.indexOf(b.part) || a.part.chapters.indexOf(a.chapter) - b.part.chapters.indexOf(b.chapter);
      });
  }, [parts, partFilter, statusFilter, sortFilter, query, chapterProgress]);

  const conceptMatches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized ? conceptSearchItems.filter((item) => item.text.toLowerCase().includes(normalized)).slice(0, 8) : [];
  }, [query]);

  const totalChapters = curriculumStats.chapters + 1;
  const currentOrdinal = currentChapter ? Math.max(1, parts.flatMap((part) => part.chapters).findIndex((chapter) => chapter.id === currentChapter.id) + 1) : 1;
  const overallProgress = Math.round((completedCount / totalChapters) * 100);
  const currentPart = currentChapter ? parts.find((part) => part.id === currentChapter.partId) : parts[0];
  const currentPartCompleted = currentPart?.chapters.filter((chapter) => chapterProgress[chapter.id]?.status === "completed").length ?? 0;
  const currentPartTotal = currentPart?.chapters.length ?? 0;
  const totalStudyMinutes = Math.round(totalStudySeconds / 60);

  const visiblePart = (part: CurriculumPart) => filteredChapters.filter((item) => item.part.id === part.id).map((item) => item.chapter);
  const workflowGroups = WORKFLOW_ORDER.map((stage) => ({ stage, chapters: filteredChapters.filter(({ chapter }) => (chapter.workflowStages[0] ?? "基础概念") === stage).map(({ chapter }) => chapter) })).filter((group) => group.chapters.length > 0);

  const renderChapter = (chapter: CurriculumChapter) => {
    const progress = chapterProgress[chapter.id];
    const status = STATUS_META[progress?.status ?? "new"];
    const isExpanded = expandedChapterId === chapter.id;
    const lesson = getCurriculumLesson(chapter.id);
    return (
      <div key={chapter.id} className="border-b last:border-b-0" style={{ borderColor: "var(--color-border-light)" }}>
        <button type="button" onClick={() => { setExpandedChapter(isExpanded ? undefined : chapter.id); setExpandedPart(chapter.partId); }} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--color-bg-soft)]">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold" style={{ background: "var(--color-accent-soft)", color: "var(--color-accent)" }}>{chapter.number === "导论" ? "导" : chapter.number}</span>
          <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{chapter.title}</span><span className="mt-0.5 block text-xs" style={{ color: status.tone }}>{status.label}</span></span>
          <span className="shrink-0 text-xs tabular-nums" style={{ color: progress?.progress === 100 ? "var(--color-status-mastered)" : "var(--color-text-muted)" }}>{progress?.progress ?? 0}%</span>
          <span aria-hidden="true" className="shrink-0 text-sm" style={{ color: "var(--color-text-muted)" }}>{isExpanded ? "⌃" : "⌄"}</span>
        </button>
        {isExpanded && (
          <div className="border-t px-4 pb-4 pt-4" style={{ borderColor: "var(--color-border-light)", background: "var(--color-bg-soft)" }}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><p className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>章节简介</p><p className="mt-2 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>{chapter.description}</p></div>
              <div><p className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>学习收获</p><ul className="mt-2 space-y-1.5 text-sm leading-5" style={{ color: "var(--color-text-secondary)" }}>{chapter.learningObjectives.slice(0, 3).map((objective) => <li key={objective}>✓ {objective}</li>)}</ul></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">{chapter.workflowStages.map((stage) => <span key={stage} className="rounded-full border px-2 py-1 text-[10px]" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>{stage}</span>)}</div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{progress?.legacyTotal ? `已掌握知识点 ${progress.legacyKnown}/${progress.legacyTotal}` : lesson ? "微课 + 章节检测" : "章节内容"}</span>
              <div className="flex flex-wrap gap-2"><Link href={chapterHref(chapter)} onClick={() => trackLearningEvent("curriculum_opened", { chapterId: chapter.id, chapterNumber: chapter.number })} className="rounded-md px-3 py-2 text-xs font-medium text-white" style={{ background: "var(--color-accent)" }}>{progress?.progress ? "继续学习" : "开始学习"} →</Link>{lesson && <Link href={`${chapterHref(chapter)}/practice`} className="rounded-md border px-3 py-2 text-xs font-medium" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>章节检测</Link>}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">课程</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>按学习顺序逐步掌握外贸实务基础。</p>
        </div>
        <aside className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }} aria-label="课程进度">
          <div className="grid grid-cols-2 divide-x" style={{ borderColor: "var(--color-border-light)" }}><div className="pr-3"><p className="text-xs" style={{ color: "var(--color-text-muted)" }}>当前章节</p><p className="mt-1 text-2xl font-semibold tabular-nums">{currentOrdinal} <span className="text-sm font-normal" style={{ color: "var(--color-text-muted)" }}>/ {totalChapters} 章</span></p><p className="mt-1 truncate text-xs" style={{ color: "var(--color-text-secondary)" }}>{currentChapter?.title}</p></div><div className="pl-3"><p className="text-xs" style={{ color: "var(--color-text-muted)" }}>已完成</p><p className="mt-1 text-2xl font-semibold tabular-nums">{completedCount} <span className="text-sm font-normal" style={{ color: "var(--color-text-muted)" }}>章</span></p><p className="mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>累计 {totalStudyMinutes} 分钟</p></div></div>
          <div className="mt-4 h-1.5 rounded-full" style={{ background: "var(--color-border-light)" }}><div className="h-full rounded-full transition-all" style={{ width: `${overallProgress}%`, background: "var(--color-accent)" }} /></div>
          <p className="mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>建议每日学习 15—20 分钟 · 当前篇章 {currentPartCompleted}/{currentPartTotal}</p>
          {currentChapter && <Link href={chapterHref(currentChapter)} className="mt-3 inline-flex w-full items-center justify-center rounded-md border py-2 text-sm font-medium" style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}>继续：{currentChapter.title} →</Link>}
        </aside>
      </section>

      <section className="space-y-3" aria-label="课程筛选">
        <label className="flex items-center gap-2 rounded-lg border px-3 py-2.5" style={{ borderColor: "var(--color-border)" }}><span aria-hidden="true" style={{ color: "var(--color-text-muted)" }}>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索章节、知识点或关键词" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-muted)]" aria-label="搜索课程" />{query && <button type="button" onClick={() => setQuery("")} className="text-xs" style={{ color: "var(--color-accent)" }}>清除</button>}</label>
        <div className="flex flex-wrap items-center gap-2"><select value={partFilter} onChange={(event) => setPartFilter(event.target.value as PartFilter)} className="rounded-md border px-3 py-2 text-xs" style={selectStyle()} aria-label="筛选教材篇章"><option value="all">全部篇章</option>{parts.map((part) => <option key={part.id} value={part.id}>{part.number} · {part.chapters.length} 章</option>)}</select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="rounded-md border px-3 py-2 text-xs" style={selectStyle()} aria-label="筛选学习状态"><option value="all">全部状态</option><option value="new">未开始</option><option value="learning">进行中</option><option value="completed">已完成</option></select><select value={sortFilter} onChange={(event) => setSortFilter(event.target.value as SortFilter)} className="rounded-md border px-3 py-2 text-xs" style={selectStyle()} aria-label="课程排序"><option value="default">默认顺序</option><option value="recent">最近学习</option><option value="progress">完成度优先</option></select><div className="ml-auto flex rounded-md border p-0.5" style={{ borderColor: "var(--color-border)" }}><button type="button" onClick={() => setViewMode("textbook")} className="rounded px-2.5 py-1.5 text-xs" style={{ background: viewMode === "textbook" ? "var(--color-accent-soft)" : "transparent", color: viewMode === "textbook" ? "var(--color-accent)" : "var(--color-text-muted)" }}>教材顺序</button><button type="button" onClick={() => setViewMode("workflow")} className="rounded px-2.5 py-1.5 text-xs" style={{ background: viewMode === "workflow" ? "var(--color-accent-soft)" : "transparent", color: viewMode === "workflow" ? "var(--color-accent)" : "var(--color-text-muted)" }}>业务流程</button></div></div>
      </section>

      {conceptMatches.length > 0 && <section className="space-y-2" aria-label="知识点搜索结果"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold">知识点结果</h2><span className="text-xs" style={{ color: "var(--color-text-muted)" }}>最多 8 项</span></div><div className="grid gap-2 sm:grid-cols-2">{conceptMatches.map((item) => <Link key={item.id} href={item.href} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-[var(--color-bg-soft)]" style={{ borderColor: "var(--color-border)" }}><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{item.title}</span><span className="mt-0.5 block truncate text-xs" style={{ color: "var(--color-text-muted)" }}>{item.module} · {item.sub}</span></span><span style={{ color: "var(--color-text-muted)" }}>→</span></Link>)}</div></section>}

      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{filteredChapters.length} 个章节 · {viewMode === "textbook" ? "教材顺序" : "按业务流程"}{query ? ` · 搜索“${query}”` : ""}</p>
      {viewMode === "textbook" ? <section className="space-y-4">{parts.map((part) => { const chapters = visiblePart(part); if (chapters.length === 0) return null; const completed = part.chapters.filter((chapter) => chapterProgress[chapter.id]?.status === "completed").length; const isOpen = expandedPartId === part.id; return <div key={part.id} className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}><button type="button" onClick={() => setExpandedPart(isOpen ? undefined : part.id)} className="flex w-full items-center gap-3 px-4 py-4 text-left"><span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--color-accent-soft)", color: "var(--color-accent)" }}>▣</span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{part.number}　{part.title}</span><span className="mt-1 block text-xs" style={{ color: "var(--color-text-muted)" }}>{part.description}</span></span><span className="shrink-0 text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>{completed} / {part.chapters.length} <span aria-hidden="true" className="ml-2">{isOpen ? "⌃" : "⌄"}</span></span></button>{isOpen && <div className="border-t" style={{ borderColor: "var(--color-border-light)" }}>{chapters.map(renderChapter)}</div>}</div>; })}</section> : <section className="space-y-4">{workflowGroups.map((group) => <div key={group.stage} className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}><div className="border-b px-4 py-3" style={{ borderColor: "var(--color-border-light)" }}><p className="text-sm font-semibold">{group.stage}</p><p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>在业务流程中的相关课程</p></div>{group.chapters.map(renderChapter)}</div>)}</section>}
    </div>
  );
}
