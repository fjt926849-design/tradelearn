"use client";

import Link from "next/link";
import { useState } from "react";
import { trackLearningEvent } from "@/lib/analytics";

interface Props {
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
  check: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
}

export default function ChapterCheckpoint({ chapterId, chapterNumber, chapterTitle, check }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = selectedIndex === check.answerIndex;

  const submit = () => {
    if (selectedIndex === null || submitted) return;
    setSubmitted(true);
    trackLearningEvent("chapter_checkpoint_completed", {
      chapterId,
      chapterNumber,
      isCorrect: selectedIndex === check.answerIndex,
    });
  };

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em]" style={{ color: "var(--color-accent)" }}>章节检测 · 1 题</p>
          <h2 className="mt-1 text-sm font-semibold">{chapterNumber} {chapterTitle}</h2>
        </div>
        {submitted && <span className="text-xs" style={{ color: isCorrect ? "var(--color-status-mastered)" : "var(--color-status-learning)" }}>{isCorrect ? "答对了" : "再复习一次"}</span>}
      </div>

      <p className="mt-4 text-sm font-medium leading-6">{check.question}</p>
      <div className="mt-3 space-y-2">
        {check.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isAnswer = index === check.answerIndex;
          const borderColor = submitted && isAnswer
            ? "var(--color-status-mastered)"
            : submitted && isSelected && !isCorrect
              ? "var(--color-status-learning)"
              : isSelected
                ? "var(--color-text)"
                : "var(--color-border)";
          const background = submitted && isAnswer
            ? "#f0faf0"
            : submitted && isSelected && !isCorrect
              ? "#fef5f5"
              : isSelected
                ? "var(--color-bg-soft)"
                : "transparent";

          return (
            <button
              key={option}
              type="button"
              disabled={submitted}
              onClick={() => setSelectedIndex(index)}
              className="w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-default"
              style={{ borderColor, background, opacity: submitted && !isAnswer && !isSelected ? 0.65 : 1 }}
            >
              <span className="mr-2 text-xs" style={{ color: "var(--color-text-muted)" }}>{String.fromCharCode(65 + index)}.</span>
              {option}
              {submitted && isAnswer && <span className="ml-2 text-xs" style={{ color: "var(--color-status-mastered)" }}>✓ 正确答案</span>}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          type="button"
          onClick={submit}
          disabled={selectedIndex === null}
          className="mt-4 w-full rounded-md border py-2.5 text-sm font-medium transition-colors disabled:opacity-35"
          style={{ borderColor: selectedIndex === null ? "var(--color-border)" : "var(--color-text)" }}
        >
          提交答案
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border p-3" style={{ borderColor: isCorrect ? "var(--color-status-mastered)" : "var(--color-status-learning)" }}>
            <p className="text-sm font-semibold" style={{ color: isCorrect ? "var(--color-status-mastered)" : "var(--color-status-learning)" }}>
              {isCorrect ? "理解正确" : "这个选项不准确"}
            </p>
            <p className="mt-2 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>{check.explanation}</p>
          </div>
          <p className="text-xs leading-5" style={{ color: "var(--color-text-muted)" }}>
            本检测只用于即时反馈，不会直接把知识点标记为“已掌握”。
          </p>
          <Link href={`/knowledge-map/chapter/${chapterId}`} className="inline-flex text-sm font-medium hover:underline" style={{ color: "var(--color-accent)" }}>
            返回本章内容 →
          </Link>
        </div>
      )}
    </div>
  );
}
