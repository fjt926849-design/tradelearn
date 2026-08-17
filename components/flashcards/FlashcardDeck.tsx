"use client";

import { useSearchParams } from "next/navigation";
import ConceptFlashcardDeck from "@/components/flashcards/ConceptFlashcardDeck";
import { tradeTerms } from "@/data/trade-terms";
import type { TradeTerm } from "@/lib/types";

const STORAGE_KEY = "tradelearn-flashcard-progress";

/**
 * Incoterms 闪卡 — ConceptFlashcardDeck 的薄封装。
 * 处理 ?term= 查询参数、自定义卡片内容渲染。
 */
export default function FlashcardDeck() {
  const searchParams = useSearchParams();
  const targetTerm = searchParams.get("term");

  return (
    <ConceptFlashcardDeck<TradeTerm>
      concepts={tradeTerms}
      getId={(t) => t.code}
      storageKey={STORAGE_KEY}
      moduleId="incoterms"
      frontLoadId={targetTerm ? targetTerm.toUpperCase() : undefined}
      title="闪卡学习"
      emptyTitle="今日学习已完成"
      emptyMessage={(s) =>
        `当前没有需要复习的卡片。已掌握 ${s.mastered} / ${tradeTerms.length} 个术语。`
      }
      homeRoute="/"
      renderFront={(term) => (
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">{term.code}</h2>
          <p style={{ color: "var(--color-text-secondary)" }}>{term.chineseName}</p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {term.fullName}
          </p>
          <p className="text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
            点击查看答案
          </p>
        </div>
      )}
      renderBack={(term) => (
        <div className="text-center space-y-3 max-w-sm">
          <p className="text-sm leading-relaxed">{term.summary}</p>
          <div
            className="pt-3 mt-3 border-t text-xs space-y-1"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p>
              <span style={{ color: "var(--color-text-muted)" }}>风险转移：</span>
              {term.riskTransferPoint}
            </p>
            <p>
              <span style={{ color: "var(--color-text-muted)" }}>运输方式：</span>
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
      )}
      resultsProps={{
        concepts: tradeTerms,
        getId: (t) => t.code,
        getTitle: (t) => t.code,
        getSubtitle: (t) => t.chineseName,
        getRoute: (id) => `/terms/${id.toLowerCase()}`,
      }}
    />
  );
}
