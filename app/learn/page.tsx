"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { deepKnowledgePointCount, deepLearningModules } from "@/data/learning-architecture";
import { termLibraryCards } from "@/data/term-library";
import { useProgressAggregator } from "@/hooks/useProgressAggregator";

export default function LearnPage() {
  const { aggregated, modules } = useProgressAggregator();
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const moduleStats = new Map(modules.map((module) => [module.moduleId, module]));
  const mastered = hydrated ? aggregated.totalMastered : 0;
  const overallProgress = hydrated ? aggregated.overallProgress : 0;

  return (
    <div className="min-h-screen" style={{ background: "#fff", color: "#1f1f1f" }}>
      <Header />
      <main>
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
          <section className="rounded-[28px] border bg-[#f7f7f7] p-7 sm:p-10" style={{ borderColor: "#dedede", boxShadow: "0 18px 50px rgba(0,0,0,.05)" }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--color-accent)" }}>TRADELEARN / DEEP LEARNING</p>
            <div className="mt-4 grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
              <div>
                <h1 className="text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">从术语入口，进入系统知识。</h1>
                <p className="mt-4 max-w-3xl text-sm leading-7" style={{ color: "#5f5f5f" }}>44 张术语卡用于快速理解；这里保留 7 个模块、{deepKnowledgePointCount} 个深入知识点。两层内容有关联，但不简单相加，也不会覆盖彼此的学习记录。</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "#dedede" }}><p className="text-3xl font-semibold">{termLibraryCards.length}</p><p className="mt-1 text-xs" style={{ color: "#777" }}>快速术语卡</p></div>
                <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "#dedede" }}><p className="text-3xl font-semibold">{deepKnowledgePointCount}</p><p className="mt-1 text-xs" style={{ color: "#777" }}>深入知识点</p></div>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border p-5 sm:p-6" style={{ borderColor: "#dedede" }}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-xs" style={{ color: "#777" }}>深入学习总进度</p><p className="mt-2 text-4xl font-semibold tracking-[-0.06em]">{mastered}<span className="ml-2 text-base font-normal" style={{ color: "#888" }}>/ {deepKnowledgePointCount} 已掌握</span></p></div>
              <span className="text-xl font-medium" style={{ color: "#555" }}>{overallProgress}%</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#ededed]"><span className="block h-full rounded-full bg-[#222] transition-all" style={{ width: `${overallProgress}%` }} /></div>
          </section>

          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#888" }}>7 MODULES</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">深入学习模块</h2></div><Link href="/terms-preview" className="text-sm font-medium" style={{ color: "#555" }}>返回 44 张术语卡 →</Link></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {deepLearningModules.map((module, index) => {
                const stats = moduleStats.get(module.id);
                const progress = hydrated ? stats?.progress ?? 0 : 0;
                const moduleMastered = hydrated ? (stats?.mastered ?? 0) + (stats?.familiar ?? 0) : 0;
                return (
                  <Link key={module.id} href={module.route} className="group rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(0,0,0,.08)]" style={{ borderColor: "#dedede" }}>
                    <div className="flex items-start justify-between gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f1f1] text-xs font-semibold" style={{ color: "#555" }}>{String(index + 1).padStart(2, "0")}</span><span className="text-xs" style={{ color: "#777" }}>{moduleMastered} / {module.conceptCount}</span></div>
                    <h3 className="mt-5 text-lg font-semibold">{module.label}</h3>
                    <p className="mt-2 min-h-12 text-sm leading-6" style={{ color: "#666" }}>{module.description}</p>
                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#ededed]"><span className="block h-full rounded-full bg-[#333]" style={{ width: `${progress}%` }} /></div>
                    <div className="mt-3 flex items-center justify-between text-xs" style={{ color: "#777" }}><span>{module.conceptCount} 个知识点</span><span className="transition-transform group-hover:translate-x-1">进入模块 →</span></div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-[#f7f7f7] p-5 sm:p-6" style={{ borderColor: "#dedede" }}>
            <div><h2 className="text-lg font-semibold">用业务场景检查理解</h2><p className="mt-1 text-sm" style={{ color: "#666" }}>完成模块学习后，可进入分模块题目和全流程综合实战。</p></div>
            <Link href="/practice" className="rounded-lg bg-[#222] px-4 py-2.5 text-sm font-medium text-white">进入场景实战 →</Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
