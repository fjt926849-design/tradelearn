"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePracticeProgress } from "@/hooks/usePracticeProgress";
import PracticeResults from "@/components/practice/PracticeResults";
import type { GenericScenarioQuestion, ModuleId } from "@/lib/types";
import { trackLearningEvent } from "@/lib/analytics";

type Phase = "intro" | "question" | "results";

interface AnswerRecord {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

interface Props {
  questions: GenericScenarioQuestion[];
  title: string;
  subtitle: string;
  introItems: string[];
  homeRoute?: string;
  moduleId?: ModuleId;
}

export default function GenericPracticeDeck({
  questions,
  title,
  subtitle,
  introItems,
  homeRoute = "/practice",
  moduleId,
}: Props) {
  const router = useRouter();
  const { submitAttempt, completeSession } = usePracticeProgress();

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const total = questions.length;
  const question = questions[currentIndex];
  const isCorrect = selectedOption === question.correctIndex;

  const handleSelect = useCallback(
    (idx: number) => {
      if (!submitted) setSelectedOption(idx);
    },
    [submitted]
  );

  const handleSubmit = useCallback(() => {
    if (selectedOption === null) return;
    const correct = selectedOption === question.correctIndex;
    submitAttempt(question.id, selectedOption, correct);
    trackLearningEvent("practice_answered", { moduleId: moduleId ?? "unknown", questionId: question.id, isCorrect: correct });
    setAnswers((prev) => [
      ...prev,
      { questionId: question.id, selectedIndex: selectedOption, isCorrect: correct },
    ]);
    setSubmitted(true);
  }, [selectedOption, question, submitAttempt, moduleId]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= total) {
      const completedAnswers = [...answers, { questionId: question.id, selectedIndex: selectedOption ?? -1, isCorrect }];
      const finalScore = completedAnswers.filter((a) => a.isCorrect).length;
      const mistakeCodes = completedAnswers
        .filter((a) => !a.isCorrect)
        .map((a) => {
          const q = questions.find((x) => x.id === a.questionId)!;
          return q.relatedConceptIds;
        })
        .flat();
      completeSession(finalScore, total, mistakeCodes);
      trackLearningEvent("practice_completed", { moduleId: moduleId ?? "unknown", score: finalScore, total });
      setPhase("results");
    } else {
      setSelectedOption(null);
      setSubmitted(false);
      setCurrentIndex((p) => p + 1);
    }
  }, [currentIndex, total, answers, completeSession, questions, question, selectedOption, isCorrect, moduleId]);

  const score = answers.filter((a) => a.isCorrect).length;

  // ─── Intro ───
  if (phase === "intro") {
    return (
      <>
        <h1 className="text-xl font-semibold mb-8">{title}</h1>
        <div className="text-center py-12 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{subtitle}</h2>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              共 {total} 道题 · 预计 {Math.max(5, Math.round(total * 1.2))} 分钟
            </p>
          </div>
          <div
            className="max-w-sm mx-auto text-left border rounded-lg p-5 space-y-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p className="text-sm font-medium">你将练习：</p>
            <ul className="text-sm space-y-1.5" style={{ color: "var(--color-text-secondary)" }}>
              {introItems.map((item, i) => (
                <li key={i}>· {item}</li>
              ))}
            </ul>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              每题做出选择后会立即显示解释，帮助你理解为什么对或错。
            </p>
          </div>
          <button
            onClick={() => {
              trackLearningEvent("practice_started", { moduleId: moduleId ?? "unknown", total });
              setPhase("question");
            }}
            className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-md border transition-colors hover:bg-gray-50"
            style={{ color: "var(--color-text)", borderColor: "var(--color-text)" }}
          >
            开始练习 →
          </button>
        </div>
      </>
    );
  }

  // ─── Results ───
  if (phase === "results") {
    return (
      <>
        <h1 className="text-xl font-semibold mb-8">{title}</h1>
        <PracticeResults
          score={score}
          total={total}
          answers={answers}
          onRedo={() => {
            setAnswers([]);
            setSelectedOption(null);
            setSubmitted(false);
            setCurrentIndex(0);
            setPhase("intro");
          }}
          onGoHome={() => router.push(homeRoute)}
        />
      </>
    );
  }

  // ─── Question ───
  return (
    <>
      <h1 className="text-xl font-semibold mb-8">{title}</h1>
      <div className="space-y-6">
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: "var(--color-text-muted)" }}>
            第 {currentIndex + 1} / {total} 题
          </span>
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            已答对 {score} 题
          </span>
        </div>

        <div className="h-1 rounded-full w-full" style={{ background: "var(--color-border-light)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${((currentIndex + 1) / total) * 100}%`,
              background: "var(--color-text)",
            }}
          />
        </div>

        <div className="border rounded-lg p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
          <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>场景</span>
          <p className="mt-2 text-sm leading-relaxed">{question.scenario}</p>
        </div>

        <p className="text-sm font-medium leading-relaxed">{question.question}</p>

        <div className="space-y-2">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            let borderColor = "var(--color-border)";
            let bg = "transparent";

            if (submitted) {
              if (idx === question.correctIndex) {
                borderColor = "var(--color-status-mastered)";
                bg = "#f0faf0";
              } else if (isSelected && !isCorrect) {
                borderColor = "var(--color-status-learning)";
                bg = "#fef5f5";
              }
            } else if (isSelected) {
              borderColor = "var(--color-text)";
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(idx)}
                disabled={submitted}
                className="w-full text-left px-4 py-3 rounded-lg border transition-colors"
                style={{
                  borderColor,
                  background: bg,
                  cursor: submitted ? "default" : "pointer",
                  opacity: submitted && idx !== question.correctIndex && !isSelected ? 0.6 : 1,
                }}
              >
                <span className="text-sm font-medium">{opt.label}</span>
                {submitted && idx === question.correctIndex && (
                  <span className="ml-2 text-xs" style={{ color: "var(--color-status-mastered)" }}>✓ 正确</span>
                )}
                {submitted && isSelected && !isCorrect && (
                  <span className="ml-2 text-xs" style={{ color: "var(--color-status-learning)" }}>✗ 你的选择</span>
                )}
              </button>
            );
          })}
        </div>

        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full py-2.5 text-sm font-medium rounded-md border transition-colors disabled:opacity-30"
            style={{
              color: selectedOption !== null ? "var(--color-text)" : "var(--color-text-muted)",
              borderColor: selectedOption !== null ? "var(--color-text)" : "var(--color-border)",
            }}
          >
            提交答案
          </button>
        )}

        {submitted && (
          <div className="space-y-4">
            <div
              className="border rounded-lg p-4"
              style={{ borderColor: isCorrect ? "var(--color-status-mastered)" : "var(--color-status-learning)" }}
            >
              <p className="text-sm font-semibold" style={{ color: isCorrect ? "var(--color-status-mastered)" : "var(--color-status-learning)" }}>
                {isCorrect ? "✓ 回答正确！" : "✗ 回答错误"}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {question.explanation}
              </p>
            </div>

            <div className="border rounded-lg p-4" style={{ borderColor: "var(--color-border)" }}>
              <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>知识点</span>
              <ul className="mt-2 space-y-1">
                {question.knowledgePoints.map((kp, i) => (
                  <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    <span className="shrink-0">·</span><span>{kp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l-2 pl-4 py-1" style={{ borderColor: "var(--color-status-learning)" }}>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                <span className="font-medium" style={{ color: "var(--color-status-learning)" }}>易错提醒：</span>
                {question.commonMistake}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-2.5 text-sm font-medium rounded-md border transition-colors hover:bg-gray-50"
              style={{ color: "var(--color-text)", borderColor: "var(--color-text)" }}
            >
              {currentIndex + 1 >= total ? "查看结果 →" : "下一题 →"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
