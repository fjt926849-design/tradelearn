"use client";

import { useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { termLibraryCards, termLibraryChapters } from "@/data/term-library";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import type { LearnStatus } from "@/lib/types";

function isMastered(status: LearnStatus) {
  return status === "mastered" || status === "familiar";
}

function statusLabel(status: LearnStatus) {
  if (isMastered(status)) return "已掌握";
  if (status === "learning") return "学习中";
  return "未开始";
}

export default function ProgressPage() {
  const { getTermProgress } = useFlashcardProgress();
  const progressById = useMemo(
    () => new Map(termLibraryCards.map((card) => [card.id, getTermProgress(card.id)] as const)),
    [getTermProgress],
  );
  const chapterStats = useMemo(
    () => termLibraryChapters.map((chapter) => {
      const mastered = chapter.terms.filter((term) => isMastered(progressById.get(term.id)?.status ?? "new")).length;
      const learning = chapter.terms.filter((term) => progressById.get(term.id)?.status === "learning").length;
      return { chapter, mastered, learning, percent: Math.round((mastered / chapter.terms.length) * 100) };
    }),
    [progressById],
  );
  const masteredTotal = chapterStats.reduce((total, chapter) => total + chapter.mastered, 0);
  const overallPercent = Math.round((masteredTotal / termLibraryCards.length) * 100);

  return (
    <div className="min-h-screen" style={{ background: "#fff", color: "#1f1f1f" }}>
      <Header />
      <main>
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: "#777" }}>TRADELEARN · PROGRESS</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">学习进度</h1>
            <p className="mt-3 text-sm" style={{ color: "#666" }}>查看术语篇章和小术语卡片的掌握情况。</p>
          </div>

          <section className="mt-8 rounded-[26px] border p-6 sm:p-8" style={{ borderColor: "#dcdcdc", background: "rgba(248,248,248,.76)", boxShadow: "0 18px 45px rgba(0,0,0,.06)", backdropFilter: "blur(14px)" }}>
            <div className="flex items-end justify-between gap-4"><div><p className="text-sm" style={{ color: "#777" }}>术语总进度</p><p className="mt-3 text-6xl font-semibold tracking-[-0.08em]">{masteredTotal}<span className="ml-2 text-xl font-normal" style={{ color: "#999" }}>/ {termLibraryCards.length}</span></p></div><span className="text-2xl font-medium" style={{ color: "#555" }}>{overallPercent}%</span></div>
            <div className="mt-5 h-2 rounded-full" style={{ background: "#e8e8e8" }}><div className="h-full rounded-full transition-all" style={{ width: `${overallPercent}%`, background: "#222" }} /></div>
            <p className="mt-4 text-xs" style={{ color: "#888" }}>统计范围与“术语卡片”页面一致：{termLibraryCards.length} 张卡片、{termLibraryChapters.length} 个篇章。</p>
          </section>

          <section className="mt-10"><div className="flex items-end justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#888" }}>CHAPTER PROGRESS</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">篇章进度</h2></div><Link href="/terms-preview" className="text-sm font-medium" style={{ color: "#555" }}>查看术语卡片 →</Link></div><div className="mt-4 overflow-hidden rounded-2xl border bg-white/70" style={{ borderColor: "#dedede" }}>{chapterStats.map(({ chapter, mastered, learning, percent }, index) => <Link key={chapter.id} href={`/terms-preview#${chapter.id}`} className={`group flex items-center gap-4 px-5 py-5 transition hover:bg-[#fafafa] ${index > 0 ? "border-t" : ""}`} style={{ borderColor: "#e8e8e8" }}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f1f1] text-xs font-semibold" style={{ color: "#555" }}>{chapter.number}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3"><span className="text-sm font-semibold">{chapter.title}</span><span className="text-sm tabular-nums" style={{ color: "#555" }}>{mastered} / {chapter.terms.length}</span></span><span className="mt-1 block text-xs" style={{ color: "#888" }}>{chapter.description}</span><span className="mt-3 block h-1.5 rounded-full" style={{ background: "#ededed" }}><span className="block h-full rounded-full" style={{ width: `${percent}%`, background: "#222" }} /></span></span><span className="flex shrink-0 items-center gap-2 text-xs" style={{ color: "#888" }}>{learning > 0 ? `${learning} 个学习中` : statusLabel(mastered === chapter.terms.length ? "mastered" : "new")}<span className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true">→</span></span></Link>)}</div></section>

          <p className="mt-8 text-xs leading-5" style={{ color: "#888" }}>现有闪卡记录会继续保留；尚未建立学习记录的术语卡片显示为“未开始”。</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
