"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useProgressAggregator } from "@/hooks/useProgressAggregator";

export default function ProgressPage() {
  const { aggregated, modules } = useProgressAggregator();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-5 py-10 space-y-8">
        <div>
          <h1 className="text-xl font-semibold">学习进度</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            当前记录保存在此设备；跨设备登录同步将在后续版本开放。
          </p>
        </div>

        <section className="border rounded-lg p-5" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>课程总进度</p>
              <p className="text-3xl font-semibold tabular-nums mt-1">{aggregated.overallProgress}%</p>
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              已掌握 {aggregated.totalMastered} / {aggregated.totalConcepts}
            </p>
          </div>
          <div className="h-2 rounded-full mt-4" style={{ background: "var(--color-border-light)" }}>
            <div className="h-full rounded-full" style={{ width: `${aggregated.overallProgress}%`, background: "var(--color-accent)" }} />
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--color-text-muted)" }}>
            这里的“已掌握”表示已完成闪卡熟悉度标记；章节测验和实训成绩会在后续版本加入能力判定。
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>模块进度</h2>
          <div className="mt-2 border rounded-lg divide-y" style={{ borderColor: "var(--color-border)" }}>
            {modules.map((module) => (
              <Link key={module.moduleId} href={module.route} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <span className="w-7 text-xs font-semibold tabular-nums" style={{ color: "var(--color-text-muted)" }}>{module.no}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{module.label}</span>
                    <span className="text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>{module.mastered + module.familiar}/{module.total}</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: "var(--color-border-light)" }}>
                    <div className="h-full rounded-full" style={{ width: `${module.progress}%`, background: "var(--color-accent)" }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
