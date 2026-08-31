"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { settlementConcepts } from "@/data/settlement-concepts";
import { useSettlementProgress } from "@/hooks/useSettlementProgress";
import StatusDot from "@/components/ui/StatusDot";
import type { SettlementConcept } from "@/lib/types";
import { getModuleNav } from "@/lib/navigation";
import BackButton from "@/components/learn/BackButton";
import ModuleFlashcardEntry from "@/components/flashcards/ModuleFlashcardEntry";

const INDEX_BY_ID = new Map(
  getModuleNav("settlement").map((n, i) => [n.slug, i + 1] as const)
);


const categoryOrder = [
  {
    key: "basics",
    label: "结算基础",
    desc: "国际结算的核心概念和信用体系",
  },
  {
    key: "payment-method",
    label: "支付方式",
    desc: "商业信用 → 银行信用，风险从低到高",
  },
  {
    key: "lc-detail",
    label: "L/C 深度",
    desc: "信用证的规则、风险与保障",
  },
  {
    key: "trade-finance",
    label: "贸易融资",
    desc: "福费廷、保理、打包贷款等融资工具",
  },
  {
    key: "document",
    label: "结算单据",
    desc: "交单必需的核心贸易单据",
  },
] as const;

function groupByCategory(concepts: SettlementConcept[]) {
  const groups: Record<string, SettlementConcept[]> = {};
  for (const c of concepts) {
    if (!groups[c.category]) groups[c.category] = [];
    groups[c.category].push(c);
  }
  return groups;
}

export default function SettlementPage() {
  const grouped = groupByCategory(settlementConcepts);
  const { getProgress } = useSettlementProgress();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-5 py-10">
        <BackButton fallbackRoute="/knowledge-map" label="返回课程地图" />
        <div className="mb-8">
          <h1 className="text-xl font-semibold">国际结算</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            支付方式 · 结算单据 · 共 {settlementConcepts.length} 个知识点
          </p>
          <ModuleFlashcardEntry href="/settlement/flashcards" />
        </div>

        <div className="space-y-10">
          {categoryOrder.map(({ key, label, desc }) => {
            const concepts = grouped[key];
            if (!concepts || concepts.length === 0) return null;
            return (
              <section key={key}>
                <div
                  className="pb-3 mb-3 border-b"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <h2 className="text-sm font-semibold">{label}</h2>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {desc}
                  </p>
                </div>

                <div
                  className="divide-y border rounded-lg"
                  style={{
                    borderColor: "var(--color-border)",
                    borderBottom: "none",
                  }}
                >
                  {concepts.map((concept) => {
                    const progress = getProgress(concept.id);
                    return (
                      <Link
                        key={concept.id}
                        href={`/settlement/${concept.id}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="shrink-0 w-7 text-xs font-semibold tabular-nums" style={{ color: "var(--color-text-muted)" }}>{String(INDEX_BY_ID.get(concept.id) ?? 0).padStart(2, "0")}</span>
                          <div className="min-w-0">
                            <span className="text-sm font-medium">
                              {concept.title}
                            </span>
                            <span
                              className="ml-2 text-xs hidden sm:inline"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {concept.englishTitle}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 ml-3">
                          <StatusDot
                            status={progress.status}
                            isDue={
                              progress.nextReviewAt > 0 &&
                              progress.nextReviewAt <= Date.now() &&
                              progress.status !== "new"
                            }
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Legend */}
        <div
          className="mt-8 pt-5 border-t flex flex-wrap gap-4 text-xs"
          style={{ borderColor: "var(--color-border)" }}
        >
          <StatusDot status="mastered" />
          <StatusDot status="familiar" />
          <StatusDot status="learning" />
          <StatusDot status="new" />
        </div>
      </main>
      <Footer />
    </>
  );
}
