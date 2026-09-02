"use client";

import { useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { tradeTerms } from "@/data/trade-terms";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import type { LearnStatus, TradeTerm } from "@/lib/types";

type CategoryKey = TradeTerm["category"];

const categoryMeta: Record<CategoryKey, { label: string; description: string; tone: string }> = {
  E: { label: "E 组 · 启运", description: "卖方在自己场所交货", tone: "#7c3aed" },
  F: { label: "F 组 · 主运费未付", description: "买方安排主运输", tone: "#0369a1" },
  C: { label: "C 组 · 主运费已付", description: "卖方付主运费，风险提前转移", tone: "#b45309" },
  D: { label: "D 组 · 到达", description: "卖方承担至目的地的责任", tone: "#047857" },
};

const categoryOrder: CategoryKey[] = ["E", "F", "C", "D"];

function isMastered(status: LearnStatus) {
  return status === "mastered" || status === "familiar";
}

export default function ProgressPage() {
  const { getTermProgress } = useFlashcardProgress();
  const progressByCode = useMemo(
    () => new Map(tradeTerms.map((term) => [term.code, getTermProgress(term.code)] as const)),
    [getTermProgress],
  );
  const groups = useMemo(
    () => categoryOrder.map((category) => {
      const terms = tradeTerms.filter((term) => term.category === category);
      const mastered = terms.filter((term) => isMastered(progressByCode.get(term.code)?.status ?? "new")).length;
      return { category, terms, mastered, percent: Math.round((mastered / terms.length) * 100) };
    }),
    [progressByCode],
  );
  const masteredTotal = groups.reduce((total, group) => total + group.mastered, 0);
  const overallPercent = Math.round((masteredTotal / tradeTerms.length) * 100);

  return (
    <div className="min-h-screen" style={{ background: "#fff", color: "#1f1f1f" }}>
      <Header />
      <main>
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: "#777" }}>TRADELEARN · PROGRESS</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">学习进度</h1>
            <p className="mt-3 text-sm" style={{ color: "#666" }}>查看 11 个贸易术语的掌握情况。</p>
          </div>

          <section className="mt-8 rounded-[26px] border p-6 sm:p-8" style={{ borderColor: "#dcdcdc", background: "rgba(248,248,248,.76)", boxShadow: "0 18px 45px rgba(0,0,0,.06)", backdropFilter: "blur(14px)" }}>
            <div className="flex items-end justify-between gap-4"><div><p className="text-sm" style={{ color: "#777" }}>贸易术语掌握度</p><p className="mt-3 text-6xl font-semibold tracking-[-0.08em]">{masteredTotal}<span className="ml-2 text-xl font-normal" style={{ color: "#999" }}>/ {tradeTerms.length}</span></p></div><span className="text-2xl font-medium" style={{ color: "#555" }}>{overallPercent}%</span></div>
            <div className="mt-5 h-2 rounded-full" style={{ background: "#e8e8e8" }}><div className="h-full rounded-full" style={{ width: `${overallPercent}%`, background: "#222" }} /></div>
            <p className="mt-4 text-xs" style={{ color: "#888" }}>已掌握包含“熟悉”和“已掌握”两种状态，记录保存在此设备。</p>
          </section>

          <section className="mt-10"><div className="flex items-end justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#888" }}>GROUP PROGRESS</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">分组进度</h2></div><Link href="/terms" className="text-sm font-medium" style={{ color: "#555" }}>查看术语 →</Link></div><div className="mt-4 overflow-hidden rounded-2xl border bg-white/70" style={{ borderColor: "#dedede" }}>{groups.map((group, index) => { const meta = categoryMeta[group.category]; return <Link key={group.category} href={`/terms#group-${group.category}`} className={`group flex items-center gap-4 px-5 py-5 transition hover:bg-[#fafafa] ${index > 0 ? "border-t" : ""}`} style={{ borderColor: "#e8e8e8" }}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-semibold" style={{ color: meta.tone, background: `${meta.tone}12` }}>{group.category}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3"><span className="text-sm font-semibold">{meta.label}</span><span className="text-sm tabular-nums" style={{ color: "#555" }}>{group.mastered} / {group.terms.length}</span></span><span className="mt-1 block text-xs" style={{ color: "#888" }}>{meta.description}</span><span className="mt-3 block h-1.5 rounded-full" style={{ background: "#ededed" }}><span className="block h-full rounded-full" style={{ width: `${group.percent}%`, background: meta.tone }} /></span></span><span className="text-lg transition-transform group-hover:translate-x-1" style={{ color: "#999" }} aria-hidden="true">→</span></Link>; })}</div></section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
