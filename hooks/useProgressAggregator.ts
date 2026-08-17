"use client";

import { useMemo } from "react";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import { useSettlementProgress } from "@/hooks/useSettlementProgress";
import { useTransportProgress } from "@/hooks/useTransportProgress";
import { useInsuranceProgress } from "@/hooks/useInsuranceProgress";
import { useDocumentsProgress } from "@/hooks/useDocumentsProgress";
import { useCustomsProgress } from "@/hooks/useCustomsProgress";
import { useContractProgress } from "@/hooks/useContractProgress";
import { tradeTerms } from "@/data/trade-terms";
import { settlementConcepts } from "@/data/settlement-concepts";
import { transportConcepts } from "@/data/transport-concepts";
import { insuranceConcepts } from "@/data/insurance-concepts";
import { documentsConcepts } from "@/data/documents-concepts";
import { customsConcepts } from "@/data/customs-concepts";
import { contractConcepts } from "@/data/contract-concepts";
import { MODULE_CHAPTERS } from "@/lib/types";
import type { ModuleId, LearnStatus } from "@/lib/types";

export interface ModuleStats {
  moduleId: ModuleId;
  label: string;
  no: string; // 章节编号 "01"
  en: string; // 英文标识 "TERMS"
  route: string;
  total: number;
  mastered: number;
  familiar: number;
  learning: number;
  new: number;
  dueCount: number;
  weakCount: number;
  progress: number; // 0-100
}

export interface AggregatedStats {
  totalConcepts: number;
  totalMastered: number;
  totalLearning: number;
  totalNew: number;
  totalDue: number;
  totalWeak: number;
  overallProgress: number; // 0-100
  modules: ModuleStats[];
}

const MODULE_CONFIG: {
  id: ModuleId;
  label: string;
  route: string;
  allIds: string[];
}[] = [
  {
    id: "incoterms",
    label: "贸易术语",
    route: "/terms",
    allIds: tradeTerms.map((t) => t.code),
  },
  {
    id: "settlement",
    label: "国际结算",
    route: "/settlement",
    allIds: settlementConcepts.map((c) => c.id),
  },
  {
    id: "transport",
    label: "国际运输",
    route: "/transport",
    allIds: transportConcepts.map((c) => c.id),
  },
  {
    id: "insurance",
    label: "货运保险",
    route: "/insurance",
    allIds: insuranceConcepts.map((c) => c.id),
  },
  {
    id: "documents",
    label: "进出口单据",
    route: "/documents",
    allIds: documentsConcepts.map((c) => c.id),
  },
  {
    id: "customs",
    label: "报关与检验",
    route: "/customs",
    allIds: customsConcepts.map((c) => c.id),
  },
  {
    id: "contract",
    label: "合同条款",
    route: "/contract",
    allIds: contractConcepts.map((c) => c.id),
  },
];

/**
 * Progress Aggregator — aggregates stats from all 7 isolated localStorage modules.
 *
 * Architecture:
 *   7 × useConceptProgress (isolated storage keys)
 *        ↓
 *   useProgressAggregator (this hook)
 *        ↓
 *   Home / Today / Unified Flashcards / Comprehensive Practice
 *
 * Adding an 8th module = add one entry to MODULE_CONFIG + one hook call below.
 */
export function useProgressAggregator() {
  const incoterms = useFlashcardProgress();
  const settlement = useSettlementProgress();
  const transport = useTransportProgress();
  const insurance = useInsuranceProgress();
  const documents = useDocumentsProgress();
  const customs = useCustomsProgress();
  const contract = useContractProgress();

  // Each hook has a common shape: todayStats, and either getProgress or getTermProgress.
  // useFlashcardProgress uses getTermProgress; concept hooks use getProgress.
  // We adapt through a thin wrapper so the aggregator works uniformly.
  function getEngineStatus(
    moduleId: ModuleId,
    conceptId: string
  ): LearnStatus {
    switch (moduleId) {
      case "incoterms":
        return incoterms.getTermProgress(conceptId).status;
      case "settlement":
        return settlement.getProgress(conceptId).status;
      case "transport":
        return transport.getProgress(conceptId).status;
      case "insurance":
        return insurance.getProgress(conceptId).status;
      case "documents":
        return documents.getProgress(conceptId).status;
      case "customs":
        return customs.getProgress(conceptId).status;
      case "contract":
        return contract.getProgress(conceptId).status;
    }
  }

  function getEngineTodayStats(
    moduleId: ModuleId,
    allIds: string[]
  ) {
    switch (moduleId) {
      case "incoterms":
        return incoterms.todayStats(allIds);
      case "settlement":
        return settlement.todayStats(allIds);
      case "transport":
        return transport.todayStats(allIds);
      case "insurance":
        return insurance.todayStats(allIds);
      case "documents":
        return documents.todayStats(allIds);
      case "customs":
        return customs.todayStats(allIds);
      case "contract":
        return contract.todayStats(allIds);
    }
  }

  const modules: ModuleStats[] = useMemo(() => {
    return MODULE_CONFIG.map((cfg) => {
      const today = getEngineTodayStats(cfg.id, cfg.allIds);

      let mastered = 0;
      let familiar = 0;
      let learning = 0;
      let isNew = 0;

      for (const id of cfg.allIds) {
        const status = getEngineStatus(cfg.id, id);
        switch (status) {
          case "mastered":
            mastered++;
            break;
          case "familiar":
            familiar++;
            break;
          case "learning":
            learning++;
            break;
          case "new":
            isNew++;
            break;
        }
      }

      const total = cfg.allIds.length;
      const known = mastered + familiar;
      const progress = total > 0 ? Math.round((known / total) * 100) : 0;

      return {
        moduleId: cfg.id,
        label: cfg.label,
        no: MODULE_CHAPTERS[cfg.id].no,
        en: MODULE_CHAPTERS[cfg.id].en,
        route: cfg.route,
        total,
        mastered,
        familiar,
        learning,
        new: isNew,
        dueCount: today.dueCount,
        weakCount: today.weakCount,
        progress,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incoterms, settlement, transport, insurance, documents, customs, contract]);

  const aggregated: AggregatedStats = useMemo(() => {
    let totalConcepts = 0;
    let totalMastered = 0;
    let totalLearning = 0;
    let totalNew = 0;
    let totalDue = 0;
    let totalWeak = 0;

    for (const m of modules) {
      totalConcepts += m.total;
      totalMastered += m.mastered + m.familiar;
      totalLearning += m.learning;
      totalNew += m.new;
      totalDue += m.dueCount;
      totalWeak += m.weakCount;
    }

    const overallProgress =
      totalConcepts > 0
        ? Math.round((totalMastered / totalConcepts) * 100)
        : 0;

    return {
      totalConcepts,
      totalMastered,
      totalLearning,
      totalNew,
      totalDue,
      totalWeak,
      overallProgress,
      modules,
    };
  }, [modules]);

  return { aggregated, modules };
}
