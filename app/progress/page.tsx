"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useProgressAggregator } from "@/hooks/useProgressAggregator";
import { useCurriculumProgress } from "@/hooks/useCurriculumProgress";
import { curriculumChapters } from "@/data/curriculum";

const CHAPTER_STATUS_META = {
  new: { label: "未开始", tone: "var(--color-text-muted)" },
  learning: { label: "进行中", tone: "var(--color-accent)" },
  completed: { label: "已完成", tone: "var(--color-status-mastered)" },
} as const;

export default function ProgressPage() {
  const { aggregated, modules } = useProgressAggregator();
  const { chapterProgress, currentChapter, completedCount, totalStudySeconds } = useCurriculumProgress();
  const chapterTotal = curriculumChapters.length;
  const chapterPercent = Math.round(curriculumChapters.reduce((sum, chapter) => sum + (chapterProgress[chapter.id]?.progress ?? 0), 0) / chapterTotal);
  const learningChapterCount = curriculumChapters.filter((chapter) => chapterProgress[chapter.id]?.status === "learning").length;

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
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>课程章节进度</h2>
              <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>按“微课完成 + 检测达标”计算</p>
            </div>
            <span className="text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>{completedCount} 已完成 · {learningChapterCount} 学习中 · {chapterPercent}%</span>
          </div>
          <div className="mt-3 border rounded-lg divide-y" style={{ borderColor: "var(--color-border)" }}>
            {curriculumChapters.map((chapter) => {
              const progress = chapterProgress[chapter.id];
              const meta = CHAPTER_STATUS_META[progress?.status ?? "new"];
              return (
                <Link key={chapter.id} href={`/knowledge-map/chapter/${chapter.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <span className="w-7 text-xs font-semibold tabular-nums" style={{ color: "var(--color-text-muted)" }}>{chapter.number === "导论" ? "导" : chapter.number}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3 text-sm"><span className="truncate">{chapter.title}</span><span className="shrink-0 text-xs tabular-nums" style={{ color: progress?.progress === 100 ? "var(--color-status-mastered)" : "var(--color-text-muted)" }}>{progress?.progress ?? 0}%</span></div>
                    <div className="mt-1.5 h-1 rounded-full" style={{ background: "var(--color-border-light)" }}><div className="h-full rounded-full" style={{ width: `${progress?.progress ?? 0}%`, background: progress?.progress === 100 ? "var(--color-status-mastered)" : "var(--color-accent)" }} /></div>
                  </div>
                  <span className="shrink-0 text-[10px]" style={{ color: meta.tone }}>{meta.label}</span>
                </Link>
              );
            })}
          </div>
          <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>当前章节：{currentChapter?.number} {currentChapter?.title} · 累计学习 {Math.round(totalStudySeconds / 60)} 分钟</p>
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
