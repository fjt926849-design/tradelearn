"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import FlashCard from "@/components/flashcards/FlashCard";
import { termLibraryCards, termLibraryChapters } from "@/data/term-library";
import { tradeGlossary } from "@/data/trade-glossary";
import { tradeTerms } from "@/data/trade-terms";
import { useTermCardProgress } from "@/hooks/useTermCardProgress";

type Rating = "again" | "learning" | "mastered";
type ReviewMode = "pending" | "learned";

const ratingLabels: Record<Rating, string> = {
  again: "再看一次",
  learning: "学习中",
  mastered: "已掌握",
};

function getInitialQueue(getStatus: (id: string) => string, targetId: string | null, mode: ReviewMode) {
  const available = termLibraryCards
    .filter((card) => mode === "learned" ? getStatus(card.id) !== "new" : getStatus(card.id) !== "mastered")
    .map((card) => card.id);

  if (targetId && available.includes(targetId)) {
    return [targetId, ...available.filter((id) => id !== targetId)];
  }

  return available;
}

function shuffle(ids: string[]) {
  const result = [...ids];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export default function TermFlashcardReview() {
  const searchParams = useSearchParams();
  const targetId = searchParams.get("term");
  const { getStatus, markOpened, markMastered, markNew } = useTermCardProgress();
  const [mode, setMode] = useState<ReviewMode>("pending");
  const [sessionIds, setSessionIds] = useState(() => getInitialQueue(getStatus, targetId, "pending"));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [rating, setRating] = useState<Rating | null>(null);
  const [sessionRatings, setSessionRatings] = useState<Record<string, Rating>>({});

  const currentId = sessionIds[currentIndex];
  const currentCard = useMemo(
    () => termLibraryCards.find((card) => card.id === currentId),
    [currentId]
  );
  const currentChapter = useMemo(
    () => termLibraryChapters.find((chapter) => chapter.terms.some((card) => card.id === currentId)),
    [currentId]
  );
  const currentLearningContext = useMemo(() => {
    const incoterm = tradeTerms.find((term) => term.code === currentId);
    if (incoterm) {
      return { label: "典型业务场景", text: incoterm.usageScenario, tipLabel: "怎么选择", tip: incoterm.selectionTip };
    }
    const glossary = tradeGlossary.find((entry) => entry.id === currentId);
    if (glossary) {
      return { label: "业务场景", text: glossary.scenario, tipLabel: "实务用法", tip: glossary.practicalUse };
    }
    return null;
  }, [currentId]);
  const completedCount = currentIndex + (rating ? 1 : 0);

  const handleRating = (nextRating: Rating) => {
    if (!currentCard || !flipped) return;

    if (nextRating === "mastered") markMastered(currentCard.id);
    if (nextRating === "learning") markOpened(currentCard.id);
    if (nextRating === "again") markNew(currentCard.id);
    setSessionRatings((previous) => ({ ...previous, [currentCard.id]: nextRating }));
    setRating(nextRating);
  };

  const handleNext = () => {
    if (currentIndex >= sessionIds.length - 1) {
      setCurrentIndex(sessionIds.length);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setFlipped(false);
    setRating(null);
  };

  const restart = () => {
    const queue = getInitialQueue(getStatus, null, mode);
    setSessionIds(mode === "learned" ? shuffle(queue) : queue);
    setCurrentIndex(0);
    setFlipped(false);
    setRating(null);
    setSessionRatings({});
  };

  const changeMode = (nextMode: ReviewMode) => {
    const queue = getInitialQueue(getStatus, null, nextMode);
    setMode(nextMode);
    setSessionIds(nextMode === "learned" ? shuffle(queue) : queue);
    setCurrentIndex(0);
    setFlipped(false);
    setRating(null);
    setSessionRatings({});
  };

  const modeToggle = (
    <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border p-2" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-soft)" }}>
      <span className="px-2 text-xs" style={{ color: "var(--color-text-muted)" }}>抽取范围</span>
      {(["pending", "learned"] as ReviewMode[]).map((option) => (
        <button key={option} type="button" onClick={() => changeMode(option)} className="rounded-lg px-3 py-2 text-xs transition-colors" style={{ background: mode === option ? "var(--color-bg)" : "transparent", color: mode === option ? "var(--color-accent)" : "var(--color-text-muted)", boxShadow: mode === option ? "0 1px 3px rgba(0,0,0,.08)" : "none", fontWeight: mode === option ? 600 : 400 }}>
          {option === "pending" ? "待掌握术语" : "随机已学习"}
        </button>
      ))}
    </div>
  );
  const sessionSeenCount = Object.keys(sessionRatings).length;
  const sessionLearningCount = Object.values(sessionRatings).filter((value) => value === "learning").length;
  const sessionMasteredCount = Object.values(sessionRatings).filter((value) => value === "mastered").length;
  const sessionStats = (
    <div className="mb-6 grid grid-cols-3 gap-2">
      {[
        { label: "本轮已看", value: sessionSeenCount },
        { label: "学习中", value: sessionLearningCount },
        { label: "已掌握", value: sessionMasteredCount },
      ].map((stat) => (
        <div key={stat.label} className="rounded-xl border px-3 py-3 text-center" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-soft)" }}>
          <p className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>{stat.value}</p>
          <p className="mt-1 text-[11px]" style={{ color: "var(--color-text-muted)" }}>{stat.label}</p>
        </div>
      ))}
    </div>
  );

  if (!currentCard || currentIndex >= sessionIds.length) {
    return (
      <section className="rounded-2xl border p-8 text-center sm:p-12" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        {modeToggle}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--color-accent-soft)", color: "var(--color-accent)" }} aria-hidden="true">
          {mode === "learned" && sessionIds.length === 0 ? "—" : "✓"}
        </div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: "var(--color-accent)" }}>TERM REVIEW</p>
        <h1 className="text-2xl font-semibold tracking-tight">{mode === "learned" && sessionIds.length === 0 ? "还没有已学习的术语" : "这一轮术语复习完成"}</h1>
        {sessionIds.length > 0 && <div className="mx-auto mt-6 max-w-md text-left">{sessionStats}</div>}
        <p className="mx-auto mt-3 max-w-md text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
          {mode === "learned" && sessionIds.length === 0 ? "先在待掌握术语中翻看并标记“学习中”，之后就可以从已学习卡片中随机抽取复习。" : `本轮共处理 ${sessionIds.length} 张卡片。已掌握的术语会自动从下一轮复习中暂时移出。`}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {sessionIds.length > 0 && <button type="button" onClick={restart} className="rounded-lg border px-4 py-2.5 text-sm transition-colors hover:bg-gray-50" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>再看一遍</button>}
          <Link href="/terms-preview" className="rounded-lg px-4 py-2.5 text-sm font-medium text-white" style={{ background: "var(--color-accent)" }}>
            返回术语篇章
          </Link>
          <Link href="/progress" className="rounded-lg border px-4 py-2.5 text-sm transition-colors hover:bg-gray-50" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
            查看进度
          </Link>
        </div>
      </section>
    );
  }

  const status = getStatus(currentCard.id);

  return (
    <section>
      {modeToggle}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: "var(--color-accent)" }}>TERM REVIEW</p>
          <h1 className="text-2xl font-semibold tracking-tight">术语闪卡复习</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>{mode === "learned" ? "从已经学习过的术语中随机抽取，翻面后再次巩固。" : "翻面查看释义，再选择你对这张卡片的掌握程度。"}</p>
        </div>
        <span className="shrink-0 text-sm" style={{ color: "var(--color-text-muted)" }}>{Math.min(completedCount + 1, sessionIds.length)} / {sessionIds.length}</span>
      </div>

      <div className="mb-5 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--color-border-light)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((completedCount / sessionIds.length) * 100, 100)}%`, background: "var(--color-accent)" }} />
      </div>
      {sessionStats}

      <FlashCard
        flipped={flipped}
        onFlip={() => setFlipped((value) => !value)}
        front={
          <div className="flex h-full w-full flex-col items-center justify-center text-center">
            <span className="mb-5 rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>{currentChapter?.title} · {currentCard.meta}</span>
            <p className="text-5xl font-semibold tracking-tight" style={{ color: "var(--color-text)" }}>{currentCard.code}</p>
            <p className="mt-4 text-2xl" style={{ color: "var(--color-text-secondary)" }}>{currentCard.name}</p>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>{currentCard.english}</p>
            <p className="mt-8 text-xs" style={{ color: "var(--color-text-muted)" }}>点击卡片查看释义</p>
          </div>
        }
        back={
          <div className="flex h-full w-full flex-col justify-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em]" style={{ color: "var(--color-accent)" }}>一句话理解</p>
            <h2 className="text-2xl font-semibold">{currentCard.name}</h2>
            <p className="mt-5 text-base leading-8" style={{ color: "var(--color-text-secondary)" }}>{currentCard.summary}</p>
            {currentLearningContext && <div className="mt-5 rounded-xl border p-4" style={{ borderColor: "var(--color-border-light)", background: "var(--color-bg-soft)" }}>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: "var(--color-accent)" }}>{currentLearningContext.label}</p>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>{currentLearningContext.text}</p>
              <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: "var(--color-text-muted)" }}>{currentLearningContext.tipLabel}</p>
              <p className="mt-1 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>{currentLearningContext.tip}</p>
            </div>}
            <div className="mt-7 border-t pt-4 text-sm" style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-muted)" }}>
              {currentChapter?.title} · {currentCard.meta}
            </div>
          </div>
        }
      />

      <div className="mt-5 rounded-xl border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-soft)" }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{rating ? `已标记为「${ratingLabels[rating]}」` : "看完释义后选择掌握程度"}</p>
          {status !== "new" && !rating && <span className="text-xs" style={{ color: status === "mastered" ? "#b33a3a" : "#2f7d55" }}>{status === "mastered" ? "已掌握" : "学习中"}</span>}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(["again", "learning", "mastered"] as Rating[]).map((option) => (
            <button key={option} type="button" disabled={!flipped || Boolean(rating)} onClick={() => handleRating(option)} className="rounded-lg border px-3 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-45" style={{ borderColor: option === "mastered" ? "#efb5b5" : option === "learning" ? "#b8dcc7" : "var(--color-border)", background: rating === option ? (option === "mastered" ? "#fff1f1" : option === "learning" ? "#effaf3" : "var(--color-bg)") : "var(--color-bg)", color: option === "mastered" ? "#b33a3a" : option === "learning" ? "#2f7d55" : "var(--color-text-secondary)" }}>
              {ratingLabels[option]}
            </button>
          ))}
        </div>
        {rating && <button type="button" onClick={handleNext} className="mt-3 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white" style={{ background: "var(--color-accent)" }}>{currentIndex === sessionIds.length - 1 ? "完成本轮" : "下一张 →"}</button>}
      </div>
    </section>
  );
}
