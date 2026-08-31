"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import FlashCard from "@/components/flashcards/FlashCard";
import ConceptFlashcardResults from "@/components/flashcards/ConceptFlashcardResults";
import { useConceptProgress } from "@/hooks/useConceptProgress";
import type { SelfRating, ModuleId } from "@/lib/types";
import { RATING_LABELS } from "@/lib/types";
import type { RoundStats, ConceptFlashcardResultsProps } from "./ConceptFlashcardResults";
import { trackLearningEvent } from "@/lib/analytics";

type Phase = "card" | "results";

const RATING_OPTIONS = [
  ["forgot", "var(--color-text-muted)"] as const,
  ["blurry", "var(--color-status-learning)"] as const,
  ["got-it", "var(--color-status-review)"] as const,
  ["mastered", "var(--color-status-mastered)"] as const,
];

export interface ConceptDeckConfig<T> {
  /** 概念数据数组 */
  concepts: T[];
  /** 获取概念唯一 ID */
  getId: (c: T) => string;
  /** 持久化 key */
  storageKey: string;
  /** 模块 ID（对应 Supabase card_progress.module_id） */
  moduleId: ModuleId;
  /** 页面标题 */
  title: string;
  /** 空队列标题 */
  emptyTitle: string;
  /** 空队列描述（接收 stats 参数） */
  emptyMessage: (stats: { mastered: number; total: number }) => string;
  /** 可选：置顶到队列最前面的概念 ID（如 ?term= 参数） */
  frontLoadId?: string;
  /** 返回按钮路由 */
  homeRoute: string;
  /** 卡片正面内容 */
  renderFront: (concept: T) => React.ReactNode;
  /** 卡片背面内容 */
  renderBack: (concept: T) => React.ReactNode;
  /** Results 组件所需的额外 props（除了通用的那些） */
  resultsProps: Omit<
    ConceptFlashcardResultsProps<T>,
    "moduleId" | "storageKey" | "stats" | "total" | "weakIds" | "onReviewWeak" | "onGoHome"
  >;
}

export default function ConceptFlashcardDeck<T>(config: ConceptDeckConfig<T>) {
  const {
    concepts,
    getId,
    storageKey,
    moduleId,
    title,
    emptyTitle,
    emptyMessage,
    homeRoute,
    renderFront,
    renderBack,
    resultsProps,
  } = config;

  const router = useRouter();
  const allIds = useMemo(() => concepts.map(getId), [concepts, getId]);

  const { rateConcept, buildReviewQueue, todayStats, getNextReviewInfo, stats } =
    useConceptProgress(storageKey, moduleId);

  const roundRatings = useRef<Record<string, SelfRating>>({});

  const [forceQueue, setForceQueue] = useState<string[] | null>(null);
  const [phase, setPhase] = useState<Phase>("card");
  const [flipped, setFlipped] = useState(false);
  const [rated, setRated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [roundStats, setRoundStats] = useState<RoundStats>({
    mastered: 0,
    gotIt: 0,
    blurry: 0,
    forgot: 0,
  });

  // Build review queue, optionally front-loading a specific concept
  const queue = useMemo(() => {
    if (forceQueue) return forceQueue;
    let q = buildReviewQueue(allIds);
    if (config.frontLoadId) {
      q = q.filter((id) => id !== config.frontLoadId);
      q.unshift(config.frontLoadId!);
    }
    return q;
  }, [buildReviewQueue, allIds, forceQueue, config.frontLoadId]);

  const total = queue.length;
  const currentId = queue[currentIndex];
  const concept = currentId ? concepts.find((c) => getId(c) === currentId) : undefined;

  const todayInfo = useMemo(() => todayStats(allIds), [todayStats, allIds]);
  const nextReviewInfo = getNextReviewInfo(allIds);

  // Weak IDs from this round
  const [weakIds, setWeakIds] = useState<string[]>([]);

  const handleFlip = useCallback(() => {
    if (!rated) setFlipped((p) => !p);
  }, [rated]);

  const handleRate = useCallback(
    (rating: SelfRating) => {
      if (!currentId) return;
      rateConcept(currentId, rating);
      trackLearningEvent("flashcard_rated", { moduleId, conceptId: currentId, rating });
      roundRatings.current[currentId] = rating;
      setRated(true);

      setRoundStats((prev) => {
        const next = { ...prev };
        if (rating === "mastered") next.mastered++;
        else if (rating === "got-it") next.gotIt++;
        else if (rating === "blurry") next.blurry++;
        else next.forgot++;
        return next;
      });
    },
    [currentId, rateConcept, moduleId]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= total) {
      setWeakIds(Object.entries(roundRatings.current)
        .filter(([, r]) => r === "forgot" || r === "blurry")
        .map(([id]) => id));
      if (forceQueue) setForceQueue(null);
      setPhase("results");
    } else {
      setFlipped(false);
      setRated(false);
      setCurrentIndex((p) => p + 1);
    }
  }, [currentIndex, total, forceQueue]);

  const handleReviewWeak = useCallback(() => {
    const weak = Object.entries(roundRatings.current)
      .filter(([, r]) => r === "forgot" || r === "blurry")
      .map(([id]) => id);

    if (weak.length === 0) return;

    roundRatings.current = {};
    setRoundStats({ mastered: 0, gotIt: 0, blurry: 0, forgot: 0 });
    setWeakIds([]);
    setCurrentIndex(0);
    setFlipped(false);
    setRated(false);
    setForceQueue(weak);
    setPhase("card");
  }, []);

  const handleGoHome = useCallback(() => {
    setForceQueue(null);
    router.push(homeRoute);
  }, [router, homeRoute]);

  // Defensive: invalid concept
  if (!concept) {
    return (
      <>
        <h1 className="text-xl font-semibold mb-8">{title}</h1>
        <div className="text-center py-16 space-y-4">
          <h2 className="text-lg font-semibold">{emptyTitle}</h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{emptyMessage(stats)}</p>
          <button onClick={() => router.push(homeRoute)} className="inline-flex items-center px-4 py-2 text-sm rounded-md border transition-colors hover:bg-gray-50" style={{ borderColor: "var(--color-border)" }}>返回</button>
        </div>
      </>
    );
  }

  // Empty queue
  if (total === 0 && phase === "card") {
    return (
      <>
        <h1 className="text-xl font-semibold mb-8">{title}</h1>
        <div className="text-center py-16 space-y-4">
          <h2 className="text-lg font-semibold">{emptyTitle}</h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {emptyMessage(stats)}
          </p>
          {nextReviewInfo.timestamp && (
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              下次复习时间：{nextReviewInfo.label}
            </p>
          )}
          <button
            onClick={handleGoHome}
            className="inline-flex items-center px-4 py-2 text-sm rounded-md border transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--color-border)" }}
          >
            返回
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold mb-8">{title}</h1>

      {phase === "results" ? (
        <ConceptFlashcardResults<T>
          {...resultsProps}
          storageKey={storageKey}
          moduleId={moduleId}
          stats={roundStats}
          total={total}
          weakIds={weakIds}
          onReviewWeak={handleReviewWeak}
          onGoHome={handleGoHome}
        />
      ) : (
        <div className="space-y-6">
          {/* Today's overview */}
          <div
            className="border rounded-lg p-4 space-y-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">今日学习</span>
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                预计 {todayInfo.estimatedMinutes} 分钟
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>
                <span className="font-semibold">{queue.length}</span>
                <span style={{ color: "var(--color-text-muted)" }}> 张待学</span>
              </span>
              <span style={{ color: "var(--color-text-muted)" }}>·</span>
              <span>
                <span className="font-semibold">{todayInfo.newCount}</span>
                <span style={{ color: "var(--color-text-muted)" }}> 张新</span>
              </span>
              <span style={{ color: "var(--color-text-muted)" }}>·</span>
              <span>
                <span className="font-semibold">{stats.mastered}</span>
                <span style={{ color: "var(--color-text-muted)" }}> 已掌握</span>
              </span>
            </div>
          </div>

          {/* Card counter + round stats */}
          <div
            className="flex items-center justify-between text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span>
              卡片 {currentIndex + 1} / {total}
            </span>
            <span className="text-xs">
              本轮: 很熟{roundStats.mastered} 会{roundStats.gotIt}{" "}
              模糊{roundStats.blurry} 不会{roundStats.forgot}
            </span>
          </div>

          {/* Card */}
          {!flipped && (
            <p className="text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
              先在心里回忆答案，再点击卡片翻面
            </p>
          )}
          <FlashCard
            flipped={flipped}
            onFlip={handleFlip}
            front={renderFront(concept)}
            back={renderBack(concept)}
          />

          {/* Self-rating */}
          {flipped && !rated && (
            <div className="text-center space-y-3">
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                你的熟悉程度？（课程掌握还会参考练习成绩）
              </p>
              <div className="flex items-center justify-center gap-2">
                {RATING_OPTIONS.map(([key, color]) => (
                  <button
                    key={key}
                    onClick={() => handleRate(key as SelfRating)}
                    className="px-4 py-2 text-sm rounded-md border transition-colors hover:bg-gray-50"
                    style={{ color, borderColor: "var(--color-border)" }}
                  >
                    {RATING_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Next */}
          {rated && (
            <div className="text-center">
              <button
                onClick={handleNext}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-md border transition-colors hover:bg-gray-50"
                style={{
                  color: "var(--color-text)",
                  borderColor: "var(--color-text)",
                }}
              >
                下一张 →
              </button>
            </div>
          )}

          {/* End early */}
          <div className="text-center">
            <button
              onClick={() => {
                if (forceQueue) setForceQueue(null);
                setPhase("results");
              }}
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              结束本轮
            </button>
          </div>
        </div>
      )}
    </>
  );
}
