"use client";

import { useState } from "react";
import { useConceptProgress } from "@/hooks/useConceptProgress";
import type { ModuleId } from "@/lib/types";

export interface RoundStats {
  mastered: number;
  gotIt: number;
  blurry: number;
  forgot: number;
}

export interface ConceptFlashcardResultsProps<T> {
  concepts: T[];
  getId: (c: T) => string;
  getTitle: (c: T) => string;
  getSubtitle: (c: T) => string;
  getRoute: (id: string) => string;
  storageKey: string;
  moduleId: ModuleId;
  stats: RoundStats;
  total: number;
  weakIds: string[];
  onReviewWeak: () => void;
  onGoHome: () => void;
}

/** 简短格式化，用于列表中显示 */
function formatShortLabel(nextReviewAt: number, now: number): string {
  const diff = nextReviewAt - now;
  if (diff <= 0) return "现在";
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} 分钟`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时`;
  return `${Math.floor(hours / 24)} 天`;
}

export default function ConceptFlashcardResults<T>({
  concepts,
  getId,
  getTitle,
  getSubtitle,
  getRoute,
  storageKey,
  moduleId,
  stats,
  total,
  weakIds,
  onReviewWeak,
  onGoHome,
}: ConceptFlashcardResultsProps<T>) {
  const { getProgress, getNextReviewInfo } = useConceptProgress(storageKey, moduleId);
  const [now] = useState(() => Date.now());
  const allIds = concepts.map(getId);
  const weakCount = weakIds.length;
  const masteredCount = stats.mastered + stats.gotIt;
  const nextReview = getNextReviewInfo(allIds);

  // Weak concept details
  const weakConcepts = weakIds
    .map((id) => {
      const concept = concepts.find((c) => getId(c) === id);
      if (!concept) return null;
      const progress = getProgress(id);
      return {
        id,
        concept,
        nextReviewLabel:
          progress.nextReviewAt > now
            ? formatShortLabel(progress.nextReviewAt, now)
            : null,
      };
    })
    .filter((v): v is NonNullable<typeof v> => v != null);

  return (
    <div className="text-center space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">本轮学习完成</h2>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          共 {total} 张卡片 · 掌握 {masteredCount} 张
          {weakCount > 0 && (
            <span style={{ color: "var(--color-status-learning)" }}>
              {" "}· 薄弱 {weakCount} 张
            </span>
          )}
        </p>
      </div>

      {/* Stats grid */}
      <div
        className="grid grid-cols-4 divide-x border rounded-lg"
        style={{ borderColor: "var(--color-border)" }}
      >
        {[
          { value: stats.mastered, label: "很熟", color: "var(--color-status-mastered)" },
          { value: stats.gotIt, label: "会", color: "var(--color-status-review)" },
          { value: stats.blurry, label: "模糊", color: "var(--color-status-learning)" },
          { value: stats.forgot, label: "不会", color: "var(--color-text-muted)" },
        ].map((item) => (
          <div key={item.label} className="py-5 text-center">
            <div className="text-2xl font-semibold" style={{ color: item.color }}>
              {item.value}
            </div>
            <div
              className="mt-1 text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Weak terms to review */}
      {weakConcepts.length > 0 && (
        <div className="text-left space-y-3">
          <h3 className="text-sm font-medium text-center">需要继续复习</h3>
          <div
            className="border rounded-lg divide-y"
            style={{ borderColor: "var(--color-border)" }}
          >
            {weakConcepts.map(({ id, concept, nextReviewLabel }) => (
              <a
                key={id}
                href={getRoute(id)}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{getTitle(concept)}</span>
                  <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {getSubtitle(concept)}
                  </span>
                </div>
                {nextReviewLabel && (
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {nextReviewLabel}后可复习
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Next review time */}
      {nextReview.timestamp && (
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          下次复习时间：{nextReview.label}
        </p>
      )}

      {/* Recommended next step */}
      <div className="text-xs space-y-1" style={{ color: "var(--color-text-muted)" }}>
        <p>
          {weakCount > 0
            ? "推荐：先复习薄弱卡片巩固记忆，再去学习新知识"
            : masteredCount === total
              ? "全部掌握！继续保持复习节奏"
              : "推荐：返回首页，继续学习新知识"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {weakCount > 0 && (
          <button
            onClick={onReviewWeak}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-md border transition-colors hover:bg-gray-50"
            style={{
              color: "var(--color-text)",
              borderColor: "var(--color-text)",
            }}
          >
            复习薄弱卡片（{weakCount} 张）
          </button>
        )}
        <button
          onClick={onGoHome}
          className="inline-flex items-center px-5 py-2.5 text-sm rounded-md border transition-colors hover:bg-gray-50"
          style={{
            color: "var(--color-text-secondary)",
            borderColor: "var(--color-border)",
          }}
        >
          返回
        </button>
      </div>
    </div>
  );
}
