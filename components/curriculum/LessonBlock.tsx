"use client";

import { useEffect, useState } from "react";
import type { CurriculumLesson } from "@/lib/types";
import { useCurriculumProgress } from "@/hooks/useCurriculumProgress";
import { trackLearningEvent } from "@/lib/analytics";

export default function LessonBlock({ lesson, chapterId }: { lesson: CurriculumLesson; chapterId: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const { markLessonStarted, markLessonCompleted, addStudySeconds } = useCurriculumProgress();
  const submitted = selected !== null;
  const correct = selected === lesson.check.answerIndex;

  useEffect(() => {
    const startedAt = Date.now();
    markLessonStarted(chapterId);
    trackLearningEvent("lesson_started", { chapterId });
    return () => addStudySeconds(chapterId, (Date.now() - startedAt) / 1000);
  }, [chapterId, markLessonStarted, addStudySeconds]);

  const completeLesson = () => {
    markLessonCompleted(chapterId);
    setCompleted(true);
    trackLearningEvent("lesson_completed", { chapterId });
  };

  return (
    <section className="space-y-6" aria-label="章节微课">
      <div className="rounded-xl border-l-2 px-4 py-1" style={{ borderColor: "var(--color-accent)" }}>
        <p className="text-sm leading-7" style={{ color: "var(--color-text-secondary)" }}>{lesson.overview}</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-semibold">核心概念</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {lesson.keyPoints.map((point) => (
            <article key={point.title} className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)" }}>
              <h3 className="text-sm font-semibold">{point.title}</h3>
              <p className="mt-2 text-xs leading-5" style={{ color: "var(--color-text-secondary)" }}>{point.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <article className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-soft)" }}>
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: "var(--color-accent)" }}>业务案例</p>
        <h2 className="mt-2 text-base font-semibold">{lesson.caseStudy.title}</h2>
        <p className="mt-2 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>{lesson.caseStudy.context}</p>
        <p className="mt-3 text-sm font-medium">思考：{lesson.caseStudy.prompt}</p>
        <div className="mt-3 border-t pt-3 text-xs leading-5" style={{ borderColor: "var(--color-border)" }}>
          <span className="font-medium">结论：</span>{lesson.caseStudy.takeaway}
        </div>
      </article>

      <article className="rounded-xl border p-4" style={{ borderColor: submitted ? (correct ? "var(--color-status-mastered)" : "var(--color-status-learning)") : "var(--color-border)" }}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">即时检测</h2>
          <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>熟悉度检测，不改变掌握状态</span>
        </div>
        <p className="mt-3 text-sm font-medium leading-6">{lesson.check.question}</p>
        <div className="mt-3 space-y-2">
          {lesson.check.options.map((option, index) => {
            const isSelected = selected === index;
            const isAnswer = index === lesson.check.answerIndex;
            return (
              <button
                key={option}
                type="button"
                disabled={submitted}
                onClick={() => setSelected(index)}
                className="w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-default"
                style={{
                  borderColor: submitted && isAnswer ? "var(--color-status-mastered)" : isSelected ? "var(--color-accent)" : "var(--color-border)",
                  background: submitted && isAnswer ? "#f0faf0" : isSelected ? "var(--color-accent-soft)" : "transparent",
                  opacity: submitted && !isAnswer && !isSelected ? 0.6 : 1,
                }}
              >
                {option}
                {submitted && isAnswer && <span className="ml-2 text-xs" style={{ color: "var(--color-status-mastered)" }}>✓</span>}
              </button>
            );
          })}
        </div>
        {submitted && (
          <div className="mt-3 rounded-lg border p-3 text-xs leading-5" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
            <span className="font-medium" style={{ color: correct ? "var(--color-status-mastered)" : "var(--color-status-learning)" }}>{correct ? "回答正确。" : "先记住这个判断。"}</span>{" "}{lesson.check.explanation}
          </div>
        )}
      </article>

      <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)" }}>
        <h2 className="text-sm font-semibold">操作任务</h2>
        <p className="mt-2 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>{lesson.task}</p>
        <button type="button" onClick={completeLesson} disabled={completed} className="mt-4 rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60" style={{ borderColor: completed ? "var(--color-status-mastered)" : "var(--color-text)", color: completed ? "var(--color-status-mastered)" : "var(--color-text)" }}>
          {completed ? "本节已完成" : "完成本节微课"}
        </button>
      </div>
    </section>
  );
}
