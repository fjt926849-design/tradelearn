"use client";

import ConceptFlashcardDeck from "@/components/flashcards/ConceptFlashcardDeck";
import { contractConcepts } from "@/data/contract-concepts";
import { customsConcepts } from "@/data/customs-concepts";
import { documentsConcepts } from "@/data/documents-concepts";
import { insuranceConcepts } from "@/data/insurance-concepts";
import { transportConcepts } from "@/data/transport-concepts";
import { MODULE_ROUTES } from "@/lib/types";
import type { KnowledgeConcept, ModuleId } from "@/lib/types";

/** 使用通用 KnowledgeConcept 模型、因而共用同一套卡片模板的模块。 */
export type ConceptModuleId = Extract<
  ModuleId,
  "contract" | "customs" | "documents" | "insurance" | "transport"
>;

const MODULE_DECKS: Record<
  ConceptModuleId,
  { concepts: KnowledgeConcept[]; title: string; subject: string }
> = {
  contract: { concepts: contractConcepts, title: "合同条款闪卡", subject: "合同" },
  customs: { concepts: customsConcepts, title: "报关闪卡", subject: "报关" },
  documents: { concepts: documentsConcepts, title: "单据闪卡", subject: "单据" },
  insurance: { concepts: insuranceConcepts, title: "保险闪卡", subject: "保险" },
  transport: { concepts: transportConcepts, title: "运输闪卡", subject: "运输" },
};

/**
 * 模块闪卡 — 五个模块的卡片模板完全一致，只差模块名，
 * 因此共用这一张配置表，取代原先五份复制粘贴的组件。
 * 「国际结算」有独立的 category 徽章，仍由 SettlementFlashcardDeck 承担。
 */
export default function ModuleFlashcardDeck({ moduleId }: { moduleId: ConceptModuleId }) {
  const { concepts, title, subject } = MODULE_DECKS[moduleId];
  const homeRoute = MODULE_ROUTES[moduleId];

  return (
    <ConceptFlashcardDeck<KnowledgeConcept>
      concepts={concepts}
      getId={(c) => c.id}
      storageKey={`tradelearn-${moduleId}-progress`}
      moduleId={moduleId}
      title={title}
      emptyTitle="暂无待复习卡片"
      emptyMessage={(s) =>
        `当前没有需要复习的${subject}知识卡片。已掌握 ${s.mastered} / ${concepts.length} 个知识点。`
      }
      homeRoute={homeRoute}
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
        concepts,
        getId: (c) => c.id,
        getTitle: (c) => c.title,
        getSubtitle: (c) => c.englishTitle,
        getRoute: (id) => `${homeRoute}/${id}`,
      }}
    />
  );
}
