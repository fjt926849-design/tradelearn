"use client";

import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/learn/BackButton";
import { glossaryGroups, tradeGlossary } from "@/data/trade-glossary";

const chapters = ["全部章节", ...Array.from(new Set(tradeGlossary.map((entry) => entry.chapterLabel)))];

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<(typeof glossaryGroups)[number]>("全部");
  const [chapter, setChapter] = useState("全部章节");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const entries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tradeGlossary.filter((entry) => {
      const matchesQuery = !normalized || [entry.term, entry.english, entry.definition, entry.usage].some((value) => value.toLowerCase().includes(normalized));
      const matchesGroup = group === "全部" || entry.group === group;
      const matchesChapter = chapter === "全部章节" || entry.chapterLabel === chapter;
      return matchesQuery && matchesGroup && matchesChapter;
    });
  }, [chapter, group, query]);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[var(--color-bg-soft)]">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
          <BackButton fallbackRoute="/terms" label="返回术语学习中心" />
          <section className="mt-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--color-accent)" }}>TEXTBOOK GLOSSARY · 22 CHAPTERS</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">全书专业词汇</h1>
            <p className="mt-3 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>把合同、运输、保险、结算、谈判、贸易方式和跨境电商中的高频词汇单独整理。这里用于查词和建立上下文，不会覆盖 Incoterms® 11 个术语的复习进度。</p>
          </section>

          <section className="mt-8 rounded-2xl border bg-[var(--color-bg)] p-4 sm:p-5" style={{ borderColor: "var(--color-border)" }}>
            <label className="relative block"><span className="sr-only">搜索专业词汇</span><span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--color-text-muted)" }}>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索中文、英文或使用场景" className="h-11 w-full rounded-xl border bg-[var(--color-bg)] pl-9 pr-3 text-sm outline-none transition focus:border-[var(--color-accent)]" style={{ borderColor: "var(--color-border)" }} /></label>
            <div className="mt-3 grid gap-2 sm:grid-cols-2"><select aria-label="按词汇类别筛选" value={group} onChange={(event) => setGroup(event.target.value as (typeof glossaryGroups)[number])} className="h-10 rounded-xl border bg-[var(--color-bg)] px-3 text-sm" style={{ borderColor: "var(--color-border)" }}>{glossaryGroups.map((item) => <option key={item} value={item}>{item === "全部" ? "全部词汇类别" : item}</option>)}</select><select aria-label="按教材章节筛选" value={chapter} onChange={(event) => setChapter(event.target.value)} className="h-10 rounded-xl border bg-[var(--color-bg)] px-3 text-sm" style={{ borderColor: "var(--color-border)" }}>{chapters.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
          </section>

          <div className="mt-5 flex items-center justify-between px-1 text-xs" style={{ color: "var(--color-text-muted)" }}><span>显示 {entries.length} / {tradeGlossary.length} 张词汇卡</span><span>点击卡片查看定义与用法</span></div>
          <section className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => {
              const expanded = expandedId === entry.id;
              return (
                <article
                  key={entry.id}
                  className="group rounded-2xl border bg-[var(--color-bg)] transition hover:-translate-y-0.5 hover:border-[var(--color-accent)]"
                  style={{ borderColor: expanded ? "var(--color-accent)" : "var(--color-border)" }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : entry.id)}
                    className="min-h-[178px] w-full rounded-2xl p-5 text-left"
                    aria-expanded={expanded}
                    aria-controls={`glossary-detail-${entry.id}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-[var(--color-accent-soft)] px-2 py-1 text-[11px] font-medium" style={{ color: "var(--color-accent)" }}>{entry.group}</span>
                      <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{entry.chapterLabel}</span>
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold tracking-tight">{entry.term}</h2>
                        <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>{entry.english}</p>
                      </div>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-lg leading-none" style={{ borderColor: expanded ? "var(--color-accent)" : "var(--color-border)", color: "var(--color-accent)" }} aria-hidden="true">{expanded ? "−" : "+"}</span>
                    </div>
                    {expanded ? (
                      <div id={`glossary-detail-${entry.id}`} className="mt-4 rounded-xl bg-[var(--color-accent-soft)] p-4">
                        <p className="text-[11px] font-semibold" style={{ color: "var(--color-accent)" }}>核心定义</p>
                        <p className="mt-1 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>{entry.definition}</p>
                        <p className="mt-3 border-t pt-3 text-[11px] font-semibold" style={{ borderColor: "color-mix(in srgb, var(--color-accent) 20%, transparent)", color: "var(--color-accent)" }}>实务用法</p>
                        <p className="mt-1 text-xs leading-5" style={{ color: "var(--color-text-secondary)" }}>{entry.usage}</p>
                      </div>
                    ) : (
                      <p className="mt-5 line-clamp-2 text-sm leading-5" style={{ color: "var(--color-text-secondary)" }}>{entry.definition}</p>
                    )}
                    <span className="mt-4 block text-[11px] font-medium" style={{ color: "var(--color-accent)" }}>{expanded ? "收起详情 ↑" : "点击展开定义和用法 ↓"}</span>
                  </button>
                </article>
              );
            })}
          </section>
          {entries.length === 0 && <div className="mt-3 rounded-2xl border bg-[var(--color-bg)] px-5 py-14 text-center" style={{ borderColor: "var(--color-border)" }}><p className="text-sm font-medium">没有匹配的词汇</p><p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>试试清空搜索，或切换章节和类别。</p></div>}
        </div>
      </main>
      <Footer />
    </>
  );
}
