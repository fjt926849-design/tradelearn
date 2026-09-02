"use client";

import { useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { tradeTerms } from "@/data/trade-terms";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import { useProgressAggregator } from "@/hooks/useProgressAggregator";
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

function statusLabel(status: LearnStatus) {
  if (isMastered(status)) return "已掌握";
  if (status === "learning") return "学习中";
  return "未开始";
}

export default function ProgressPage() {
  const { getTermProgress, getDueCodes } = useFlashcardProgress();
  const { modules } = useProgressAggregator();
  const termCodes = useMemo(() => tradeTerms.map((term) => term.code), []);
  const progressByCode = useMemo(
    () => new Map(tradeTerms.map((term) => [term.code, getTermProgress(term.code)] as const)),
    [getTermProgress],
  );
  const dueCodes = useMemo(() => getDueCodes(termCodes), [getDueCodes, termCodes]);

  const termStats = useMemo(() => {
    let mastered = 0;
    let learning = 0;
    let due = 0;
    for (const term of tradeTerms) {
      const termProgress = progressByCode.get(term.code);
      if (!termProgress) continue;
      if (isMastered(termProgress.status)) mastered++;
      if (termProgress.status === "learning") learning++;
      if (termProgress.status !== "new" && dueCodes.has(term.code)) due++;
    }
    return { mastered, learning, due, total: tradeTerms.length };
  }, [dueCodes, progressByCode]);

  const groups = useMemo(
    () => categoryOrder.map((category) => {
      const terms = tradeTerms.filter((term) => term.category === category);
      const mastered = terms.filter((term) => isMastered(progressByCode.get(term.code)?.status ?? "new")).length;
      const learning = terms.filter((term) => progressByCode.get(term.code)?.status === "learning").length;
      return { category, terms, mastered, learning, percent: Math.round((mastered / terms.length) * 100) };
    }),
    [progressByCode],
  );

  const nextTerm = tradeTerms.find((term) => {
    const status = progressByCode.get(term.code)?.status ?? "new";
    return status === "learning" || status === "new";
  }) ?? tradeTerms[0];
  const nextTermStatus = progressByCode.get(nextTerm.code)?.status ?? "new";

  const recentTerms = useMemo(
    () => tradeTerms
      .map((term) => ({ term, progress: progressByCode.get(term.code) }))
      .filter(({ progress: termProgress }) => Boolean(termProgress?.lastReviewed))
      .sort((a, b) => (b.progress?.lastReviewed ?? 0) - (a.progress?.lastReviewed ?? 0))
      .slice(0, 3),
    [progressByCode],
  );

  const auxiliaryModules = modules.filter((module) => module.moduleId !== "incoterms");
  const overallPercent = Math.round((termStats.mastered / termStats.total) * 100);

  return (
    <div className="min-h-screen" style={{ background: "#fff", color: "#1f1f1f" }}>
      <Header />
      <main>
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: "#777" }}>TRADELEARN · MY LEARNING</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">我的学习</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: "#666" }}>集中查看贸易术语掌握情况，按责任组回到对应的术语卡片。</p>
          </div>

          <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
            <div className="rounded-[26px] border p-6 sm:p-8" style={{ borderColor: "#dcdcdc", background: "rgba(248,248,248,.76)", boxShadow: "0 18px 45px rgba(0,0,0,.06)", backdropFilter: "blur(14px)" }}>
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#888" }}>TERM MASTERY</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">贸易术语掌握度</h2>
                  <p className="mt-2 text-sm" style={{ color: "#777" }}>11 个 Incoterms® 2020 术语</p>
                </div>
                <Link href="/terms" className="rounded-xl border bg-white/75 px-3 py-2 text-xs font-medium transition hover:bg-white" style={{ borderColor: "#d8d8d8" }}>浏览全部术语 →</Link>
              </div>
              <div className="mt-8 flex items-end gap-3"><span className="text-6xl font-semibold tracking-[-0.08em]">{termStats.mastered}</span><span className="pb-2 text-sm" style={{ color: "#777" }}>/ {termStats.total} 已掌握</span><span className="ml-auto pb-2 text-sm font-medium" style={{ color: "#555" }}>{overallPercent}%</span></div>
              <div className="mt-4 h-2 rounded-full" style={{ background: "#e8e8e8" }}><div className="h-full rounded-full transition-all" style={{ width: `${overallPercent}%`, background: "#222" }} /></div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs" style={{ color: "#777" }}><span>{termStats.learning} 个学习中</span><span>{termStats.due} 个待复习</span><span>记录保存在此设备</span></div>
            </div>

            <div className="rounded-[26px] border bg-white/75 p-6 sm:p-7" style={{ borderColor: "#dcdcdc", boxShadow: "0 12px 30px rgba(0,0,0,.04)" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#888" }}>CONTINUE</p>
              <h2 className="mt-3 text-xl font-semibold">继续学习</h2>
              <p className="mt-2 text-sm leading-6" style={{ color: "#666" }}>{nextTermStatus === "learning" ? "从上次学习的术语继续，巩固责任边界。" : "从第一张术语卡片开始，建立 E / F / C / D 责任地图。"}</p>
              <div className="mt-5 rounded-2xl border bg-[#fafafa] p-4" style={{ borderColor: "#e5e5e5" }}><div className="flex items-center justify-between gap-3"><span className="text-xs" style={{ color: "#888" }}>{categoryMeta[nextTerm.category].label}</span><span className="text-xs" style={{ color: "#888" }}>{statusLabel(nextTermStatus)}</span></div><p className="mt-3 text-2xl font-semibold tracking-[-0.05em]">{nextTerm.code}</p><p className="mt-1 text-sm" style={{ color: "#555" }}>{nextTerm.chineseName}</p></div>
              <Link href={`/terms/${nextTerm.code.toLowerCase()}`} className="mt-5 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-white transition hover:opacity-90" style={{ background: "#222" }}>{nextTermStatus === "learning" ? "继续学习" : "开始学习"} <span className="ml-2" aria-hidden="true">→</span></Link>
            </div>
          </section>

          <section className="mt-10"><div className="flex items-end justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#888" }}>RESPONSIBILITY GROUPS</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">按责任组查看</h2></div><Link href="/terms" className="text-sm font-medium" style={{ color: "#555" }}>查看全部 →</Link></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{groups.map((group) => { const meta = categoryMeta[group.category]; return <Link key={group.category} href={`/terms#group-${group.category}`} className="group rounded-2xl border bg-white/70 p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,.08)]" style={{ borderColor: "#dedede" }}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold" style={{ color: meta.tone }}>{meta.label}</p><p className="mt-1 text-xs" style={{ color: "#777" }}>{meta.description}</p></div><span className="text-lg transition-transform group-hover:translate-x-1" style={{ color: "#999" }} aria-hidden="true">↗</span></div><div className="mt-6 flex items-end justify-between"><span className="text-3xl font-semibold tracking-[-0.05em]">{group.mastered}<span className="ml-1 text-sm font-normal" style={{ color: "#999" }}>/ {group.terms.length}</span></span><span className="text-xs" style={{ color: "#777" }}>{group.learning} 个学习中</span></div><div className="mt-3 h-1.5 rounded-full" style={{ background: "#ededed" }}><div className="h-full rounded-full" style={{ width: `${group.percent}%`, background: meta.tone }} /></div><p className="mt-3 text-xs" style={{ color: "#888" }}>进入该组术语卡片</p></Link>; })}</div></section>

          <section className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.72fr)]"><div className="rounded-2xl border bg-white/70 p-5 sm:p-6" style={{ borderColor: "#dedede" }}><div className="flex items-end justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#888" }}>RECENT</p><h2 className="mt-2 text-xl font-semibold">最近学习</h2></div>{recentTerms.length > 0 && <Link href="/terms" className="text-xs font-medium" style={{ color: "#555" }}>回到术语库 →</Link>}</div>{recentTerms.length > 0 ? <div className="mt-4 divide-y" style={{ borderColor: "#e8e8e8" }}>{recentTerms.map(({ term, progress: termProgress }) => <Link key={term.code} href={`/terms/${term.code.toLowerCase()}`} className="group flex items-center gap-4 py-4 first:pt-2 last:pb-1"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f1f1] text-xs font-semibold">{term.code}</span><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{term.chineseName}</span><span className="mt-1 block text-xs" style={{ color: "#888" }}>{term.fullName}</span></span><span className="text-xs" style={{ color: isMastered(termProgress?.status ?? "new") ? "#3f8a60" : "#777" }}>{statusLabel(termProgress?.status ?? "new")}</span><span className="transition-transform group-hover:translate-x-1" style={{ color: "#999" }} aria-hidden="true">→</span></Link>)}</div> : <div className="mt-4 rounded-xl border bg-[#fafafa] p-5" style={{ borderColor: "#e5e5e5" }}><p className="text-sm font-medium">还没有学习记录</p><p className="mt-2 text-sm leading-6" style={{ color: "#666" }}>先从 EXW 开始，了解卖方责任最小的交货方式。</p><Link href="/terms/exw" className="mt-4 inline-flex rounded-xl bg-[#222] px-4 py-2.5 text-sm font-medium text-white">查看 EXW →</Link></div>}</div><div className="rounded-2xl border bg-[#fafafa] p-5 sm:p-6" style={{ borderColor: "#dedede" }}><p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#888" }}>OTHER MATERIALS</p><h2 className="mt-2 text-xl font-semibold">其他业务资料</h2><p className="mt-2 text-sm leading-6" style={{ color: "#666" }}>合同、运输、保险和结算模块的掌握情况作为辅助信息保留。</p><div className="mt-4 space-y-3">{auxiliaryModules.slice(0, 4).map((module) => <Link key={module.moduleId} href={module.route} className="flex items-center gap-3 rounded-xl border bg-white/70 px-3 py-3 transition hover:bg-white" style={{ borderColor: "#e5e5e5" }}><span className="w-7 text-xs font-semibold" style={{ color: "#999" }}>{module.no}</span><span className="min-w-0 flex-1 text-sm">{module.label}</span><span className="text-xs" style={{ color: "#888" }}>{module.mastered + module.familiar}/{module.total}</span><span style={{ color: "#999" }} aria-hidden="true">→</span></Link>)}</div>{auxiliaryModules.length > 4 && <p className="mt-3 text-xs" style={{ color: "#999" }}>还有 {auxiliaryModules.length - 4} 个模块可在对应页面查看。</p>}</div></section>

          <p className="mt-8 text-xs leading-5" style={{ color: "#888" }}>术语掌握度沿用现有本地闪卡记录；其他业务资料不会混入 11 个贸易术语的统计。</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
