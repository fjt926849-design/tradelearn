"use client";

import Link from "next/link";
import { useState } from "react";
import { trackLearningEvent } from "@/lib/analytics";
import type { CurriculumLesson } from "@/lib/types";
import { useCurriculumProgress } from "@/hooks/useCurriculumProgress";

type CurriculumCheck = CurriculumLesson["check"];

interface Props {
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
  checks: CurriculumCheck[];
}

export default function ChapterCheckpoint({ chapterId, chapterNumber, chapterTitle, checks }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const { recordCheckpoint } = useCurriculumProgress();
  const check = checks[currentIndex];
  const isCorrect = selectedIndex === check.answerIndex;
  const score = answers.filter(Boolean).length;

  const submit = () => {
    if (selectedIndex === null || submitted) return;
    const correct = selectedIndex === check.answerIndex;
    setSubmitted(true);
    setAnswers((previous) => [...previous, correct]);
    trackLearningEvent("chapter_checkpoint_completed", { chapterId, chapterNumber, questionIndex: currentIndex + 1, isCorrect: correct });
  };

  const next = () => {
    if (currentIndex + 1 >= checks.length) {
      recordCheckpoint(chapterId, score, checks.length);
      setFinished(true);
      return;
    }
    setCurrentIndex((previous) => previous + 1);
    setSelectedIndex(null);
    setSubmitted(false);
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setSubmitted(false);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="rounded-xl border p-5" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <p className="text-xs font-semibold tracking-[0.12em]" style={{ color: "var(--color-accent)" }}>章节检测完成</p>
        <h2 className="mt-2 text-lg font-semibold">本次得分 {score} / {checks.length}</h2>
        <p className="mt-2 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>{score === checks.length ? "基础判断全部正确，可以继续做本章操作任务。" : "建议回看错题对应的知识点，再重新完成检测。"}</p>
        <p className="mt-3 text-xs leading-5" style={{ color: "var(--color-text-muted)" }}>检测结果只用于即时反馈，不会直接把知识点标记为“已掌握”。</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={restart} className="rounded-md border px-3 py-2 text-sm font-medium" style={{ borderColor: "var(--color-text)" }}>重新检测</button>
          <Link href={`/knowledge-map/chapter/${chapterId}`} className="rounded-md border px-3 py-2 text-sm font-medium" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>返回本章内容</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em]" style={{ color: "var(--color-accent)" }}>章节检测 · {checks.length} 题</p>
          <h2 className="mt-1 text-sm font-semibold">{chapterNumber} {chapterTitle}</h2>
        </div>
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{currentIndex + 1} / {checks.length}</span>
      </div>
      <div className="mt-4 h-1 rounded-full" style={{ background: "var(--color-border-light)" }}><div className="h-full rounded-full transition-all" style={{ width: `${((currentIndex + 1) / checks.length) * 100}%`, background: "var(--color-accent)" }} /></div>
      <p className="mt-4 text-sm font-medium leading-6">{check.question}</p>
      <div className="mt-3 space-y-2">
        {check.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isAnswer = index === check.answerIndex;
          const borderColor = submitted && isAnswer ? "var(--color-status-mastered)" : submitted && isSelected && !isCorrect ? "var(--color-status-learning)" : isSelected ? "var(--color-text)" : "var(--color-border)";
          const background = submitted && isAnswer ? "#f0faf0" : submitted && isSelected && !isCorrect ? "#fef5f5" : isSelected ? "var(--color-bg-soft)" : "transparent";
          return (
            <button key={option} type="button" disabled={submitted} onClick={() => setSelectedIndex(index)} className="w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-default" style={{ borderColor, background, opacity: submitted && !isAnswer && !isSelected ? 0.65 : 1 }}>
              <span className="mr-2 text-xs" style={{ color: "var(--color-text-muted)" }}>{String.fromCharCode(65 + index)}.</span>{option}
              {submitted && isAnswer && <span className="ml-2 text-xs" style={{ color: "var(--color-status-mastered)" }}>✓ 正确答案</span>}
            </button>
          );
        })}
      </div>
      {!submitted ? (
        <button type="button" onClick={submit} disabled={selectedIndex === null} className="mt-4 w-full rounded-md border py-2.5 text-sm font-medium transition-colors disabled:opacity-35" style={{ borderColor: selectedIndex === null ? "var(--color-border)" : "var(--color-text)" }}>提交答案</button>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border p-3" style={{ borderColor: isCorrect ? "var(--color-status-mastered)" : "var(--color-status-learning)" }}>
            <p className="text-sm font-semibold" style={{ color: isCorrect ? "var(--color-status-mastered)" : "var(--color-status-learning)" }}>{isCorrect ? "理解正确" : "这个选项不准确"}</p>
            <p className="mt-2 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>{check.explanation}</p>
          </div>
          <button type="button" onClick={next} className="w-full rounded-md border py-2.5 text-sm font-medium" style={{ borderColor: "var(--color-text)" }}>{currentIndex + 1 >= checks.length ? "查看结果" : "下一题 →"}</button>
        </div>
      )}
    </div>
  );
}
