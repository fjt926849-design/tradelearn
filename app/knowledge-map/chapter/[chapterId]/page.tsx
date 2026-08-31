import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackButton from "@/components/learn/BackButton";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { curriculumChapters } from "@/data/curriculum";
import { getCurriculumLesson } from "@/data/curriculum-lessons";
import type { CurriculumChapter } from "@/lib/types";
import LessonBlock from "@/components/curriculum/LessonBlock";

export function generateStaticParams() {
  return curriculumChapters.map((chapter) => ({ chapterId: chapter.id }));
}

function getChapter(chapterId: string) {
  return curriculumChapters.find((chapter) => chapter.id === chapterId);
}

function chapterHref(chapter: CurriculumChapter) {
  return chapter.route ?? `/knowledge-map/chapter/${chapter.id}`;
}

export async function generateMetadata({ params }: { params: Promise<{ chapterId: string }> }): Promise<Metadata> {
  const { chapterId } = await params;
  const chapter = getChapter(chapterId);
  return chapter
    ? { title: `${chapter.number} ${chapter.title} · 贸学 TradeLearn`, description: chapter.description }
    : { title: "章节规划 · 贸学 TradeLearn" };
}

export default async function CurriculumChapterPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  const chapter = getChapter(chapterId);
  if (!chapter) notFound();

  const isPlanned = chapter.status === "planned";
  const isPartial = chapter.status === "partial";
  const statusLabel = isPlanned ? "建设中" : isPartial ? "部分开放" : "已开放";
  const statusColor = isPlanned ? "var(--color-text-muted)" : isPartial ? "var(--color-status-learning)" : "var(--color-status-mastered)";
  const prerequisites = chapter.prerequisites
    .map((id) => curriculumChapters.find((item) => item.id === id))
    .filter((item): item is CurriculumChapter => Boolean(item));
  const contentPlan = chapter.contentPlan ?? ["核心概念与术语", "业务流程中的判断要点", "常见错误与复盘提示"];
  const practicePlan = chapter.practicePlan ?? ["完成一项业务场景判断", "用本章概念解释选择理由"];
  const lesson = getCurriculumLesson(chapter.id);

  return (
    <>
      <Header />

      <main className="flex-1 mx-auto w-full max-w-2xl px-5 py-8">
        <BackButton fallbackRoute="/knowledge-map" label="返回课程地图" />

        <div className="mt-8 space-y-8">
          <section>
            <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <span>{chapter.partId === "intro" ? "导论" : `第${chapter.partId.replace("part-", "")}篇`}</span>
              <span aria-hidden="true">·</span>
              <span style={{ color: statusColor }}>{statusLabel}</span>
            </div>
            <p className="mt-3 text-xs font-semibold tracking-[0.14em]" style={{ color: "var(--color-accent)" }}>{chapter.number}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">{chapter.title}</h1>
            <p className="mt-3 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>{chapter.description}</p>
          </section>

          {isPlanned && (
            <section className="rounded-xl border p-4" style={{ borderColor: "var(--color-accent)", background: "var(--color-accent-soft)" }}>
              <p className="text-sm font-semibold">这一章正在建设中</p>
              <p className="mt-2 text-xs leading-5" style={{ color: "var(--color-text-secondary)" }}>
                本章微课已经开放，完整题库、错题复习和综合实训会在后续建设中补齐。学习检测不会影响已有学习记录。
              </p>
            </section>
          )}

          {lesson && (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold">本章微课</h2>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>约 8 分钟</span>
              </div>
              <LessonBlock lesson={lesson} />
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-base font-semibold">学完你应该能做到</h2>
            <div className="space-y-2">
              {chapter.learningObjectives.map((objective) => (
                <div key={objective} className="flex gap-3 rounded-lg border p-3 text-sm" style={{ borderColor: "var(--color-border)" }}>
                  <span className="shrink-0" style={{ color: "var(--color-accent)" }}>✓</span>
                  <span>{objective}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)" }}>
              <h2 className="text-sm font-semibold">本章内容范围</h2>
              <ul className="mt-3 space-y-2 text-xs leading-5" style={{ color: "var(--color-text-secondary)" }}>
                {contentPlan.map((item) => <li key={item} className="flex gap-2"><span style={{ color: "var(--color-accent)" }}>·</span>{item}</li>)}
              </ul>
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)" }}>
              <h2 className="text-sm font-semibold">操作型练习</h2>
              <ul className="mt-3 space-y-2 text-xs leading-5" style={{ color: "var(--color-text-secondary)" }}>
                {practicePlan.map((item) => <li key={item} className="flex gap-2"><span style={{ color: "var(--color-accent)" }}>·</span>{item}</li>)}
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">学习上下文</h2>
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex flex-wrap gap-2">
                {chapter.workflowStages.length > 0 ? chapter.workflowStages.map((stage) => (
                  <span key={stage} className="rounded-full border px-2.5 py-1 text-xs" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>{stage}</span>
                )) : <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>基础概念</span>}
              </div>
              {prerequisites.length > 0 && (
                <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--color-border-light)" }}>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>建议先学习</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {prerequisites.map((item) => (
                      <Link key={item.id} href={chapterHref(item)} className="text-xs font-medium hover:underline" style={{ color: "var(--color-accent)" }}>
                        {item.number} {item.title} →
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">来源与版本</h2>
            <div className="space-y-2">
              {chapter.sourceRefs.map((source) => (
                <div key={`${source.label}-${source.version ?? ""}`} className="rounded-lg border p-3 text-xs" style={{ borderColor: "var(--color-border)" }}>
                  {source.url ? <a href={source.url} target="_blank" rel="noreferrer" className="font-medium hover:underline" style={{ color: "var(--color-accent)" }}>{source.label}</a> : <span className="font-medium">{source.label}</span>}
                  {(source.version || source.updatedAt) && <span className="ml-2" style={{ color: "var(--color-text-muted)" }}>{[source.version, source.updatedAt && `更新 ${source.updatedAt}`].filter(Boolean).join(" · ")}</span>}
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-3 border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
            <Link href="/knowledge-map" className="rounded-md border px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--color-border)" }}>返回课程地图</Link>
            {lesson && <Link href={`/knowledge-map/chapter/${chapter.id}/practice`} className="rounded-md border px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}>章节检测</Link>}
            {!isPlanned && chapter.route && <Link href={chapter.route} className="rounded-md px-4 py-2 text-sm font-medium text-white" style={{ background: "var(--color-accent)" }}>进入本章学习</Link>}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
