import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/learn/BackButton";
import ChapterCheckpoint from "@/components/curriculum/ChapterCheckpoint";
import { curriculumChapters } from "@/data/curriculum";
import { getCurriculumLesson } from "@/data/curriculum-lessons";
import { getAdditionalCurriculumChecks } from "@/data/curriculum-checks";

export function generateStaticParams() {
  return curriculumChapters
    .filter((chapter) => Boolean(getCurriculumLesson(chapter.id)))
    .map((chapter) => ({ chapterId: chapter.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ chapterId: string }> }): Promise<Metadata> {
  const { chapterId } = await params;
  const chapter = curriculumChapters.find((item) => item.id === chapterId);
  return chapter
    ? { title: `${chapter.number} ${chapter.title} · 章节检测 · 贸学 TradeLearn` }
    : { title: "章节检测 · 贸学 TradeLearn" };
}

export default async function ChapterPracticePage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  const chapter = curriculumChapters.find((item) => item.id === chapterId);
  const lesson = getCurriculumLesson(chapterId);
  if (!chapter || !lesson) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto w-full max-w-2xl px-5 py-8">
        <BackButton fallbackRoute={`/knowledge-map/chapter/${chapterId}`} label="返回本章内容" />
        <div className="mt-8 space-y-6">
          <section>
            <p className="text-xs font-semibold tracking-[0.14em]" style={{ color: "var(--color-accent)" }}>章节检测</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">{chapter.number} {chapter.title}</h1>
            <p className="mt-3 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
              先独立作答，再查看解释。检测结果只用于即时反馈，不会重置或覆盖你的学习记录。
            </p>
          </section>
          <ChapterCheckpoint chapterId={chapter.id} chapterNumber={chapter.number} chapterTitle={chapter.title} checks={[lesson.check, ...getAdditionalCurriculumChecks(chapter.id)]} />
        </div>
      </main>
      <Footer />
    </>
  );
}
