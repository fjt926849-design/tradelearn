"use client";

import ConceptFlashcardDeck from "@/components/flashcards/ConceptFlashcardDeck";
import { transportConcepts } from "@/data/transport-concepts";
import type { KnowledgeConcept } from "@/lib/types";

const STORAGE_KEY = "tradelearn-transport-progress";

export default function TransportFlashcardDeck() {
  return (
    <ConceptFlashcardDeck<KnowledgeConcept>
      concepts={transportConcepts}
      getId={(c) => c.id}
      storageKey={STORAGE_KEY}
      moduleId="transport"
      title="运输闪卡"
      emptyTitle="暂无待复习卡片"
      emptyMessage={(s) =>
        `当前没有需要复习的运输知识卡片。已掌握 ${s.mastered} / ${transportConcepts.length} 个知识点。`
      }
      homeRoute="/transport"
      renderFront={(concept) => (
        <div className="text-center space-y-3">
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
        concepts: transportConcepts,
        getId: (c) => c.id,
        getTitle: (c) => c.title,
        getSubtitle: (c) => c.englishTitle,
        getRoute: (id) => `/transport/${id}`,
      }}
    />
  );
}
