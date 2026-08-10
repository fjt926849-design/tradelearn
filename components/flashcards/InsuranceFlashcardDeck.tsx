"use client";

import ConceptFlashcardDeck from "@/components/flashcards/ConceptFlashcardDeck";
import { insuranceConcepts } from "@/data/insurance-concepts";
import type { KnowledgeConcept } from "@/lib/types";

const STORAGE_KEY = "tradelearn-insurance-progress";

export default function InsuranceFlashcardDeck() {
  return (
    <ConceptFlashcardDeck<KnowledgeConcept>
      concepts={insuranceConcepts}
      getId={(c) => c.id}
      storageKey={STORAGE_KEY}
      title="保险闪卡"
      emptyTitle="暂无待复习卡片"
      emptyMessage={(s) =>
        `当前没有需要复习的保险知识卡片。已掌握 ${s.mastered} / ${insuranceConcepts.length} 个知识点。`
      }
      homeRoute="/insurance"
      renderFront={(concept) => (
        <div className="text-center space-y-3">
          <span className="text-5xl">{concept.icon}</span>
          <h2 className="text-2xl font-bold">{concept.title}</h2>
          <p style={{ color: "var(--color-text-secondary)" }}>
            {concept.englishTitle}
          </p>
          <p className="text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
            点击查看答案
          </p>
        </div>
      )}
      renderBack={(concept) => (
        <div className="text-center space-y-3 max-w-sm">
          <p className="text-sm leading-relaxed">{concept.summary}</p>
          <div
            className="pt-3 mt-3 border-t text-xs space-y-1 text-left"
            style={{ borderColor: "var(--color-border)" }}
          >
            {concept.keyFeatures.slice(0, 3).map((f, i) => (
              <p key={i} style={{ color: "var(--color-text-secondary)" }}>
                · {f}
              </p>
            ))}
          </div>
        </div>
      )}
      resultsProps={{
        concepts: insuranceConcepts,
        getId: (c) => c.id,
        getTitle: (c) => c.title,
        getSubtitle: (c) => c.englishTitle,
        getIcon: (c) => c.icon,
        getRoute: (id) => `/insurance/${id}`,
      }}
    />
  );
}
