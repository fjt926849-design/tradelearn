import type { CurriculumLesson } from "@/lib/types";

export default function ChapterContent({ lesson }: { lesson: CurriculumLesson }) {
  return (
    <section className="space-y-6" aria-label="章节内容">
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

      <article className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">知识核对</h2>
          <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>先独立判断，再查看结论</span>
        </div>
        <p className="mt-3 text-sm font-medium leading-6">{lesson.check.question}</p>
        <div className="mt-3 space-y-2">
          {lesson.check.options.map((option, index) => (
            <div key={option} className="rounded-lg border px-3 py-2.5 text-left text-sm" style={{ borderColor: "var(--color-border)" }}>
              <span className="mr-2 text-xs" style={{ color: "var(--color-text-muted)" }}>{String.fromCharCode(65 + index)}.</span>{option}
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border p-3 text-xs leading-5" style={{ borderColor: "var(--color-border-light)", background: "var(--color-bg-soft)", color: "var(--color-text-secondary)" }}>
          <span className="font-medium">核对要点：</span>{lesson.check.options[lesson.check.answerIndex]}。{lesson.check.explanation}
        </div>
      </article>

      <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)" }}>
        <h2 className="text-sm font-semibold">操作任务</h2>
        <p className="mt-2 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>{lesson.task}</p>
        <p className="mt-3 text-xs leading-5" style={{ color: "var(--color-text-muted)" }}>完成任务后，进入章节检测验证是否真正掌握。</p>
      </div>
    </section>
  );
}
