"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/learn/BackButton";
import { tradeTerms } from "@/data/trade-terms";
import { tradeGlossary } from "@/data/trade-glossary";

type TermCard = {
  id: string;
  code: string;
  name: string;
  english: string;
  summary: string;
  meta: string;
  href: string;
};

type TermChapter = {
  id: string;
  number: string;
  title: string;
  description: string;
  source: string;
  terms: TermCard[];
};

const groupDescription: Record<string, string> = {
  合同: "掌握合同标的、品质、数量、包装和争议条款。",
  运输: "认识运输方式、装运安排和运输单据。",
  保险: "区分险别、风险范围和货损索赔流程。",
  价格: "理解佣金、折扣和价格调整的报价口径。",
  结算: "梳理汇付、托收和信用证中的付款责任。",
  谈判: "分清询盘、发盘、还盘和接受的法律效果。",
  贸易方式: "了解经销、代理和套期保值等业务安排。",
  跨境电商: "认识平台、支付、物流和海外仓的基本概念。",
};

const termChapters: TermChapter[] = [
  {
    id: "trade-terms",
    number: "01",
    title: "贸易术语",
    description: "理解交货、费用和风险如何在买卖双方之间分配。",
    source: "11 个 Incoterms® 规则 + 15 张基础概念与对比卡",
    terms: [
      ...tradeTerms.map((term) => ({
        id: term.code,
        code: term.code,
        name: term.chineseName,
        english: term.fullName,
        summary: term.summary,
        meta: term.transportMode.join(" / "),
        href: `/terms/${term.code.toLowerCase()}`,
      })),
      ...tradeGlossary.filter((entry) => entry.group === "贸易术语").map((entry) => ({
        id: entry.id,
        code: entry.term,
        name: entry.term,
        english: entry.english,
        summary: entry.definition,
        meta: entry.chapterLabel,
        href: entry.relatedRoute ?? `/glossary#${entry.id}`,
      })),
    ],
  },
  ...(["合同", "运输", "保险", "价格", "结算", "谈判", "贸易方式", "跨境电商"] as const).map((group, index) => {
    const groupTerms = tradeGlossary.filter((entry) => entry.group === group);
    return {
      id: `glossary-${group}`,
      number: String(index + 2).padStart(2, "0"),
      title: group,
      description: groupDescription[group],
      source: `${groupTerms.length} 个专业词汇 · 按教材章节整理`,
      terms: groupTerms.map((entry) => ({
        id: entry.id,
        code: entry.term,
        name: entry.term,
        english: entry.english,
        summary: entry.definition,
        meta: entry.chapterLabel,
        href: entry.relatedRoute ?? `/glossary#${entry.id}`,
      })),
    } satisfies TermChapter;
  }),
];

export default function TermsPreviewPage() {
  const [query, setQuery] = useState("");
  const [expandedChapter, setExpandedChapter] = useState("trade-terms");
  const normalizedQuery = query.trim().toLowerCase();

  const visibleChapters = useMemo(() => termChapters.map((chapter) => ({
    ...chapter,
    terms: chapter.terms.filter((term) => !normalizedQuery || [term.code, term.name, term.english, term.summary, term.meta].join(" ").toLowerCase().includes(normalizedQuery)),
  })).filter((chapter) => chapter.terms.length > 0), [normalizedQuery]);

  const totalTerms = termChapters.reduce((total, chapter) => total + chapter.terms.length, 0);

  return (
    <div className="min-h-screen" style={{ background: "#fff", color: "#1f1f1f" }}>
      <Header />
      <main>
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
          <BackButton fallbackRoute="/" label="返回首页" />

          <section className="mt-8 overflow-hidden rounded-[28px] border" style={{ borderColor: "#dedede", background: "rgba(250,250,250,.8)", boxShadow: "0 18px 50px rgba(0,0,0,.06)" }}>
            <div className="border-b px-6 py-8 sm:px-10 sm:py-10" style={{ borderColor: "#dedede", background: "rgba(245,245,245,.72)", backdropFilter: "blur(14px)" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: "#777" }}>TRADELEARN · TERM LIBRARY</p>
              <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                  <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">术语篇章</h1>
                  <p className="mt-3 max-w-xl text-sm leading-6" style={{ color: "#666" }}>按教材篇章整理术语。先选择一个大卡片，再在其中查看对应的小术语卡片。</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <Stat value={totalTerms} label="术语总数" />
                  <Stat value={termChapters.length} label="篇章" />
                  <Stat value="2020" label="规则版本" hiddenOnMobile />
                </div>
              </div>
            </div>

            <div className="border-b px-6 py-5 sm:px-10" style={{ borderColor: "#dedede", background: "rgba(255,255,255,.72)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3">
                <label className="relative block min-w-0 flex-1"><span className="sr-only">搜索术语</span><span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "#888" }}>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索所有篇章的术语" className="h-12 w-full rounded-2xl border bg-white/80 pl-11 pr-4 text-sm outline-none transition focus:border-[#777]" style={{ borderColor: "#d8d8d8" }} /></label>
                {query && <button type="button" onClick={() => setQuery("")} className="shrink-0 rounded-xl border px-3 py-2 text-xs transition hover:bg-[#f2f2f2]" style={{ borderColor: "#d8d8d8", color: "#666" }}>清空</button>}
              </div>
              <p className="mt-3 text-xs" style={{ color: "#888" }} aria-live="polite">{normalizedQuery ? `找到 ${visibleChapters.reduce((count, chapter) => count + chapter.terms.length, 0)} 个匹配术语` : "选择篇章查看其中的小术语卡片"}</p>
            </div>

            <div className="space-y-4 px-6 py-7 sm:px-10 sm:py-9">
              {visibleChapters.map((chapter) => {
                const isExpanded = normalizedQuery.length > 0 || expandedChapter === chapter.id;
                return <section key={chapter.id} className="overflow-hidden rounded-[22px] border bg-white/65 transition-shadow" style={{ borderColor: isExpanded ? "#bdbdbd" : "#dedede", boxShadow: isExpanded ? "0 12px 28px rgba(0,0,0,.07)" : "none" }}>
                  <button type="button" onClick={() => setExpandedChapter(isExpanded && !normalizedQuery ? "" : chapter.id)} className="group flex w-full items-start justify-between gap-5 px-5 py-5 text-left transition-colors hover:bg-[#fafafa] sm:px-6" aria-expanded={isExpanded} aria-label={`${isExpanded ? "收起" : "展开"}${chapter.title}篇章`}>
                    <span className="flex min-w-0 items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f1f1] text-xs font-semibold" style={{ color: "#555" }}>{chapter.number}</span><span className="min-w-0"><span className="block text-lg font-semibold">{chapter.title}</span><span className="mt-1 block text-sm leading-5" style={{ color: "#777" }}>{chapter.description}</span><span className="mt-2 block text-xs" style={{ color: "#999" }}>{chapter.source}</span></span></span>
                    <span className="flex shrink-0 items-center gap-3 pt-1 text-xs" style={{ color: "#777" }}><span>{chapter.terms.length} 个术语</span><span className="hidden rounded-full border px-2 py-1 text-[10px] group-hover:inline-flex" style={{ borderColor: "#d6d6d6", color: "#666" }}>{isExpanded ? "收起" : "查看本篇"}</span><span className={`text-lg transition-transform ${isExpanded ? "rotate-45" : ""}`} aria-hidden="true">＋</span></span>
                  </button>
                  {isExpanded && <div className="animate-[term-reveal_180ms_ease-out] border-t px-5 py-5 sm:px-6" style={{ borderColor: "#e8e8e8", background: "rgba(248,248,248,.55)" }}><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{chapter.terms.map((term) => <Link key={term.id} href={term.href} className="group rounded-2xl border bg-white/80 p-4 transition duration-200 hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(0,0,0,.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777]" style={{ borderColor: "#dedede" }}><div className="flex items-start justify-between gap-3"><p className="text-xl font-semibold tracking-[-0.03em]">{term.code}</p><span className="text-base transition-transform group-hover:translate-x-1" style={{ color: "#999" }} aria-hidden="true">↗</span></div><p className="mt-2 text-sm font-medium">{term.name}</p><p className="mt-1 truncate text-xs" style={{ color: "#888" }}>{term.english}</p><p className="mt-3 line-clamp-2 text-xs leading-5" style={{ color: "#666" }}>{term.summary}</p><p className="mt-3 text-[10px]" style={{ color: "#999" }}>{term.meta}</p><span className="mt-3 block text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-100" style={{ color: "#666" }}>查看详情 ↗</span></Link>)}</div></div>}
                </section>;
              })}
              {visibleChapters.length === 0 && <div className="rounded-2xl border px-5 py-16 text-center" style={{ borderColor: "#dedede" }}><p className="text-sm font-medium">没有找到匹配术语</p><p className="mt-2 text-xs" style={{ color: "#888" }}>试试搜索其他缩写、中文名或业务场景。</p></div>}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ value, label, hiddenOnMobile = false }: { value: string | number; label: string; hiddenOnMobile?: boolean }) {
  return <div className={`${hiddenOnMobile ? "hidden sm:block" : ""} rounded-2xl border bg-white/70 px-4 py-3`} style={{ borderColor: "#dedede" }}><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-xs" style={{ color: "#777" }}>{label}</p></div>;
}
