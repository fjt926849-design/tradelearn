"use client";

import Link from "next/link";
import { useMemo } from "react";
import { scenarioQuestions } from "@/data/scenario-questions";
import { tradeTerms } from "@/data/trade-terms";
import { usePracticeProgress } from "@/hooks/usePracticeProgress";

interface AnswerRecord {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

interface ResultsProps {
  score: number;
  total: number;
  answers: AnswerRecord[];
  onRedo: () => void;
  onGoHome: () => void;
}

export default function PracticeResults({
  score,
  total,
  answers,
  onRedo,
  onGoHome,
}: ResultsProps) {
  const { getMistakeStats } = usePracticeProgress();
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  // Wrong answers with question details
  const wrongAnswers = useMemo(
    () =>
      answers
        .filter((a) => !a.isCorrect)
        .map((a) => {
          const q = scenarioQuestions.find((x) => x.id === a.questionId);
          return q ? { ...a, question: q } : null;
        })
        .filter((v): v is NonNullable<typeof v> => v != null),
    [answers]
  );

  // Wrong term codes (deduped) across history
  const mistakeStats = useMemo(() => getMistakeStats(), [getMistakeStats]);

  // Get term names for top mistakes
  const topMistakeTerms = useMemo(
    () =>
      mistakeStats.slice(0, 3).map((s) => {
        const term = tradeTerms.find((t) => t.code === s.termCode);
        return { ...s, term };
      }),
    [mistakeStats]
  );

  // Accuracy level
  const accuracyLabel =
    accuracy >= 80 ? "优秀" : accuracy >= 60 ? "良好" : "需要加强";

  return (
    <div className="text-center space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">实战完成</h2>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          共 {total} 题 · 正确 {score} 题 · 正确率 {accuracy}%
        </p>
        <p
          className="text-xs font-medium"
          style={{
            color:
              accuracy >= 80
                ? "var(--color-status-mastered)"
                : accuracy >= 60
                  ? "var(--color-status-review)"
                  : "var(--color-status-learning)",
          }}
        >
          {accuracyLabel}
        </p>
      </div>

      {/* Score bar */}
      <div
        className="h-2 rounded-full w-full"
        style={{ background: "var(--color-border-light)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${accuracy}%`,
            background:
              accuracy >= 80
                ? "var(--color-status-mastered)"
                : accuracy >= 60
                  ? "var(--color-status-review)"
                  : "var(--color-status-learning)",
          }}
        />
      </div>

      {/* Wrong answers detail */}
      {wrongAnswers.length > 0 && (
        <div className="text-left space-y-3">
          <h3 className="text-sm font-medium text-center">
            答错的题目（{wrongAnswers.length} 题）
          </h3>
          <div
            className="border rounded-lg divide-y"
            style={{ borderColor: "var(--color-border)" }}
          >
            {wrongAnswers.map(({ question, selectedIndex }) => {
              const selected = question.options[selectedIndex];
              const correct = question.options[question.correctIndex];
              return (
                <div key={question.id} className="p-4 space-y-2">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {question.scenario.slice(0, 100)}...
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span style={{ color: "var(--color-status-learning)" }}>
                      ✗ 你选了：{selected.code}
                    </span>
                    <span style={{ color: "var(--color-status-mastered)" }}>
                      ✓ 正确答案：{correct.code}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top mistake terms */}
      {topMistakeTerms.length > 0 && (
        <div className="text-left space-y-3">
          <h3 className="text-sm font-medium text-center">
            最容易出错的知识点
          </h3>
          <div
            className="border rounded-lg divide-y"
            style={{ borderColor: "var(--color-border)" }}
          >
            {topMistakeTerms.map(({ termCode, count, term }) => (
              <Link
                key={termCode}
                href={`/terms/${termCode.toLowerCase()}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{termCode}</span>
                  {term && (
                    <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                      {term.chineseName}
                    </span>
                  )}
                </div>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  错 {count} 次
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All correct */}
      {wrongAnswers.length === 0 && (
        <div
          className="border rounded-lg p-5 text-center"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--color-status-mastered)" }}>
            全部正确！
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
            你对Incoterms 2020的理解非常扎实，继续保持。
          </p>
        </div>
      )}

      {/* Recommended next step */}
      <div className="text-xs space-y-1" style={{ color: "var(--color-text-muted)" }}>
        {wrongAnswers.length > 0 ? (
          <p>
            推荐：先查看答错术语的详情页复习知识点，再进行新一轮实战或闪卡练习。
          </p>
        ) : (
          <p>推荐：继续保持复习节奏，定期回来巩固记忆。</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onRedo}
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-md border transition-colors hover:bg-gray-50"
          style={{
            color: "var(--color-text)",
            borderColor: "var(--color-text)",
          }}
        >
          重新练习
        </button>
        {topMistakeTerms.length > 0 && (
          <Link
            href="/flashcards"
            className="inline-flex items-center px-5 py-2.5 text-sm rounded-md border transition-colors hover:bg-gray-50"
            style={{
              color: "var(--color-text-secondary)",
              borderColor: "var(--color-border)",
            }}
          >
            复习薄弱知识
          </Link>
        )}
        <button
          onClick={onGoHome}
          className="inline-flex items-center px-5 py-2.5 text-sm rounded-md border transition-colors hover:bg-gray-50"
          style={{
            color: "var(--color-text-secondary)",
            borderColor: "var(--color-border)",
          }}
        >
          返回首页
        </button>
      </div>
    </div>
  );
}
