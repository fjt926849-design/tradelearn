"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FlashCard from "@/components/flashcards/FlashCard";
import FlashcardResults from "@/components/flashcards/FlashcardResults";
import { tradeTerms } from "@/data/trade-terms";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import type { SelfRating } from "@/lib/types";
import { RATING_LABELS } from "@/lib/types";

type Phase = "card" | "results";

const ALL_CODES = tradeTerms.map((t) => t.code);

const RATING_OPTIONS = [
  ["forgot", "var(--color-text-muted)"] as const,
  ["blurry", "var(--color-status-learning)"] as const,
  ["got-it", "var(--color-status-review)"] as const,
  ["mastered", "var(--color-status-mastered)"] as const,
];

export default function FlashcardDeck() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetTerm = searchParams.get("term");

  const {
    rateTerm,
    buildReviewQueue,
    todayStats,
    getNextReviewInfo,
    stats,
  } = useFlashcardProgress();

  const roundRatings = useRef<Record<string, SelfRating>>({});

  // Force-review mode: when set, queue is overridden with these specific codes
  const [forceQueue, setForceQueue] = useState<string[] | null>(null);

  const [phase, setPhase] = useState<Phase>("card");
  const [flipped, setFlipped] = useState(false);
  const [rated, setRated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [roundStats, setRoundStats] = useState({
    mastered: 0,
    gotIt: 0,
    blurry: 0,
    forgot: 0,
  });

  // Build review queue: only cards that are due or new (or forced)
  const queue = useMemo(() => {
    // If force-review mode, use forced codes directly
    if (forceQueue) return forceQueue;

    let codes = buildReviewQueue(ALL_CODES);

    // If a specific term was requested via ?term=, bump to front
    if (targetTerm) {
      const upper = targetTerm.toUpperCase();
      codes = codes.filter((c) => c !== upper);
      codes.unshift(upper);
    }

    return codes;
  }, [buildReviewQueue, targetTerm, forceQueue]);

  const total = queue.length;
  const currentCode = queue[currentIndex];
  const term = currentCode ? tradeTerms.find((t) => t.code === currentCode) : undefined;

  // Defensive: if queue is empty or code is invalid, show empty state
  if (!term) {
    return (
      <>
        <h1 className="text-xl font-semibold mb-8">闪卡学习</h1>
        <div className="text-center py-16 space-y-4">
          <p className="text-3xl">✅</p>
          <h2 className="text-lg font-semibold">暂无卡片</h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            当前没有需要复习的卡片。
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-4 py-2 text-sm rounded-md border transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--color-border)" }}
          >
            返回首页
          </button>
        </div>
      </>
    );
  }

  const todayInfo = useMemo(() => todayStats(ALL_CODES), [todayStats]);
  const nextReviewInfo = getNextReviewInfo(ALL_CODES);

  // Weak term codes from this round (computed when entering results phase)
  const weakTermCodes: string[] = useMemo(() => {
    if (phase !== "results") return [];
    return Object.entries(roundRatings.current)
      .filter(([, r]) => r === "forgot" || r === "blurry")
      .map(([code]) => code);
  }, [phase]);

  const handleFlip = useCallback(() => {
    if (!rated) setFlipped((p) => !p);
  }, [rated]);

  const handleRate = useCallback(
    (rating: SelfRating) => {
      rateTerm(term.code, rating);
      roundRatings.current[term.code] = rating;
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
    [term.code, rateTerm]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= total) {
      // Force-review round completed — clear force queue
      if (forceQueue) setForceQueue(null);
      setPhase("results");
    } else {
      setFlipped(false);
      setRated(false);
      setCurrentIndex((p) => p + 1);
    }
  }, [currentIndex, total, forceQueue]);

  const handleReviewWeak = useCallback(() => {
    // Extract weak codes from this round's ratings
    const weakCodes = Object.entries(roundRatings.current)
      .filter(([, r]) => r === "forgot" || r === "blurry")
      .map(([code]) => code);

    if (weakCodes.length === 0) return; // Shouldn't happen, but guard

    roundRatings.current = {};
    setRoundStats({ mastered: 0, gotIt: 0, blurry: 0, forgot: 0 });
    setCurrentIndex(0);
    setFlipped(false);
    setRated(false);
    setForceQueue(weakCodes);
    setPhase("card");
  }, []);

  // Empty queue — nothing due
  if (total === 0 && phase === "card") {
    return (
      <>
        <h1 className="text-xl font-semibold mb-8">闪卡学习</h1>
        <div className="text-center py-16 space-y-4">
          <p className="text-3xl">✅</p>
          <h2 className="text-lg font-semibold">今日学习已完成</h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            当前没有需要复习的卡片。已掌握 {stats.mastered} / {tradeTerms.length} 个术语。
          </p>
          {nextReviewInfo.timestamp && (
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              下次复习时间：{nextReviewInfo.label}
            </p>
          )}
          <button
            onClick={() => {
              setForceQueue(null);
              router.push("/");
            }}
            className="inline-flex items-center px-4 py-2 text-sm rounded-md border transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--color-border)" }}
          >
            返回首页
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold mb-8">闪卡学习</h1>

      {phase === "results" ? (
        <FlashcardResults
          stats={roundStats}
          total={total}
          weakTermCodes={weakTermCodes}
          onReviewWeak={handleReviewWeak}
          onGoHome={() => {
            setForceQueue(null);
            router.push("/");
          }}
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
          <FlashCard
            flipped={flipped}
            onFlip={handleFlip}
            front={
              <div className="text-center space-y-3">
                <span className="text-5xl">{term.icon}</span>
                <h2 className="text-3xl font-bold">{term.code}</h2>
                <p style={{ color: "var(--color-text-secondary)" }}>
                  {term.chineseName}
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {term.fullName}
                </p>
                <p className="text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
                  点击查看答案
                </p>
              </div>
            }
            back={
              <div className="text-center space-y-3 max-w-sm">
                <p className="text-sm leading-relaxed">{term.summary}</p>
                <div
                  className="pt-3 mt-3 border-t text-xs space-y-1"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <p>
                    <span style={{ color: "var(--color-text-muted)" }}>
                      风险转移：
                    </span>
                    {term.riskTransferPoint}
                  </p>
                  <p>
                    <span style={{ color: "var(--color-text-muted)" }}>
                      运输方式：
                    </span>
                    {term.transportMode.join(" / ")}
                  </p>
                </div>
                <p
                  className="text-xs mt-3 leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {term.keyPoint}
                </p>
              </div>
            }
          />

          {/* Self-rating */}
          {flipped && !rated && (
            <div className="text-center space-y-3">
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                你的掌握程度？
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
