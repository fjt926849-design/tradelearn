import { contractConcepts } from "@/data/contract-concepts";
import { customsConcepts } from "@/data/customs-concepts";
import { documentsConcepts } from "@/data/documents-concepts";
import { insuranceConcepts } from "@/data/insurance-concepts";
import { deepKnowledgePointCount, deepLearningModules } from "@/data/learning-architecture";
import { settlementConcepts } from "@/data/settlement-concepts";
import { termLibraryCards } from "@/data/term-library";
import { tradeGlossary } from "@/data/trade-glossary";
import { tradeTerms } from "@/data/trade-terms";
import { transportConcepts } from "@/data/transport-concepts";
import { MODULE_LABELS, MODULE_ROUTES, type ModuleId } from "@/lib/types";

export type ContentRelation = "same-topic" | "related-topic";

export interface DeepLearningTarget {
  moduleId: ModuleId;
  conceptId?: string;
  href: string;
  label: string;
  relation: ContentRelation;
}

export interface TermContentRecord {
  termId: string;
  termHref: string;
  deepLearningTargets: DeepLearningTarget[];
}

const moduleConceptCounts: Record<ModuleId, number> = {
  incoterms: tradeTerms.length,
  settlement: settlementConcepts.length,
  transport: transportConcepts.length,
  insurance: insuranceConcepts.length,
  documents: documentsConcepts.length,
  customs: customsConcepts.length,
  contract: contractConcepts.length,
};

const moduleHrefs: Record<ModuleId, Set<string>> = {
  incoterms: new Set([MODULE_ROUTES.incoterms, ...tradeTerms.map((term) => `/terms/${term.code.toLowerCase()}`)]),
  settlement: new Set([MODULE_ROUTES.settlement, ...settlementConcepts.map((item) => `/settlement/${item.id}`)]),
  transport: new Set([MODULE_ROUTES.transport, ...transportConcepts.map((item) => `/transport/${item.id}`)]),
  insurance: new Set([MODULE_ROUTES.insurance, ...insuranceConcepts.map((item) => `/insurance/${item.id}`)]),
  documents: new Set([MODULE_ROUTES.documents, ...documentsConcepts.map((item) => `/documents/${item.id}`)]),
  customs: new Set([MODULE_ROUTES.customs, ...customsConcepts.map((item) => `/customs/${item.id}`)]),
  contract: new Set([MODULE_ROUTES.contract, ...contractConcepts.map((item) => `/contract/${item.id}`)]),
};

function target(
  moduleId: ModuleId,
  conceptId: string | undefined,
  relation: ContentRelation = "related-topic",
): DeepLearningTarget {
  const href = conceptId ? `${MODULE_ROUTES[moduleId]}/${conceptId}` : MODULE_ROUTES[moduleId];
  return {
    moduleId,
    conceptId,
    href,
    relation,
    label: conceptId ? `${MODULE_LABELS[moduleId]} · 对应知识点` : `${MODULE_LABELS[moduleId]} · 相关模块`,
  };
}

/**
 * 44 张快速术语卡与 73 个深入知识点之间的显式关系。
 *
 * 它不是 44 → 73 的一对一转换：部分术语对应同一个深入知识点，
 * 少数新章节术语目前没有旧模块内容。未映射项保留为空，避免伪造对应关系。
 */
const glossaryDeepLearningTargets: Record<string, DeepLearningTarget[]> = {
  "ch04-quality-clause": [target("contract", "quality-clause", "same-topic")],
  "ch04-quantity-tolerance": [target("contract", "quantity-clause", "same-topic")],
  "ch04-shipping-mark": [target("contract", "packing-clause")],
  "ch04-neutral-packing": [target("contract", "packing-clause")],
  "ch05-liner": [target("transport", "sea-freight")],
  "ch05-charter": [target("transport", undefined)],
  "ch05-partial-shipment": [target("transport", undefined)],
  "ch05-transshipment": [target("transport", "multimodal")],
  "ch05-clean-bl": [target("documents", "bill-of-lading-doc")],
  "ch05-on-board-bl": [target("documents", "bill-of-lading-doc")],
  "ch06-general-average": [target("insurance", "risk-vs-insurance")],
  "ch06-particular-average": [target("insurance", "risk-vs-insurance")],
  "ch06-icc-a": [target("insurance", "insurance-coverage")],
  "ch06-icc-c": [target("insurance", "insurance-coverage")],
  "ch07-commission": [target("contract", "price-clause")],
  "ch07-discount": [target("contract", "price-clause")],
  "ch07-price-adjustment": [target("contract", "price-clause")],
  "ch08-dp": [target("settlement", "dp", "same-topic")],
  "ch08-da": [target("settlement", "da", "same-topic")],
  "ch08-discrepancy": [target("settlement", "lc")],
  "ch08-confirmed-lc": [target("settlement", "lc")],
  "ch09-inspection-certificate": [
    target("documents", "inspection-cert-doc", "same-topic"),
    target("customs", "inspection-basics"),
  ],
  "ch10-force-majeure": [target("contract", "force-majeure", "same-topic")],
  "ch10-arbitration": [target("contract", "dispute-resolution")],
  "ch11-inquiry": [target("contract", "contract-formation")],
  "ch11-offer": [target("contract", "contract-formation")],
  "ch11-counteroffer": [target("contract", "contract-formation")],
  "ch11-acceptance": [target("contract", "contract-formation")],
  "ch15-exclusive-distribution": [target("contract", undefined)],
  "ch15-exclusive-agency": [target("contract", undefined)],
  "ch18-hedging": [],
  "ch21-cross-border-b2c": [],
  "ch22-overseas-warehouse": [],
};

const incotermRecords: TermContentRecord[] = tradeTerms.map((term) => ({
  termId: term.code,
  termHref: `/terms/${term.code.toLowerCase()}`,
  deepLearningTargets: [target("incoterms", term.code.toLowerCase(), "same-topic")],
}));

const glossaryRecords: TermContentRecord[] = tradeGlossary.map((entry) => ({
  termId: entry.id,
  termHref: `/glossary/${entry.id}`,
  deepLearningTargets: glossaryDeepLearningTargets[entry.id] ?? [],
}));

export const termContentRegistry: TermContentRecord[] = [...incotermRecords, ...glossaryRecords];
const contentByTermId = new Map(termContentRegistry.map((record) => [record.termId, record]));

export function getDeepLearningTargets(termId: string): DeepLearningTarget[] {
  return contentByTermId.get(termId)?.deepLearningTargets ?? [];
}

function assertContentRegistryIntegrity() {
  const errors: string[] = [];
  const cardIds = new Set(termLibraryCards.map((card) => card.id));
  const registryIds = new Set(termContentRegistry.map((record) => record.termId));

  if (termContentRegistry.length !== termLibraryCards.length) {
    errors.push(`registry-count:${termContentRegistry.length}`);
  }
  if (deepKnowledgePointCount !== 73) errors.push(`deep-count:${deepKnowledgePointCount}`);

  for (const learningModule of deepLearningModules) {
    if (learningModule.conceptCount !== moduleConceptCounts[learningModule.id]) {
      errors.push(`module-count:${learningModule.id}:${learningModule.conceptCount}/${moduleConceptCounts[learningModule.id]}`);
    }
  }

  for (const id of cardIds) {
    if (!registryIds.has(id)) errors.push(`missing-term:${id}`);
  }
  for (const entry of tradeGlossary) {
    if (!(entry.id in glossaryDeepLearningTargets)) errors.push(`missing-glossary-map:${entry.id}`);
  }
  for (const record of termContentRegistry) {
    for (const item of record.deepLearningTargets) {
      if (!moduleHrefs[item.moduleId].has(item.href)) {
        errors.push(`invalid-target:${record.termId}:${item.href}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Content registry integrity check failed: ${errors.join(", ")}`);
  }
}

assertContentRegistryIntegrity();
