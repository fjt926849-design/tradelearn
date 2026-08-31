"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { customsConcepts } from "@/data/customs-concepts";
import { useCustomsProgress } from "@/hooks/useCustomsProgress";
import StatusDot from "@/components/ui/StatusDot";
import type { KnowledgeConcept } from "@/lib/types";
import { getModuleNav } from "@/lib/navigation";
import BackButton from "@/components/learn/BackButton";

const INDEX_BY_ID = new Map(
  getModuleNav("customs").map((n, i) => [n.slug, i + 1] as const)
);


const categoryLabels: Record<string, string> = {
  basics: "报关基础",
  process: "报关流程",
  party: "报关主体",
  classification: "归类与估价",
  document: "报关单据",
  inspection: "商检",
};

function groupByCategory(concepts: KnowledgeConcept[]) {
  const groups: Record<string, KnowledgeConcept[]> = {};
  for (const c of concepts) {
    if (!groups[c.category]) groups[c.category] = [];
    groups[c.category].push(c);
  }
  return groups;
}

export default function CustomsPage() {
  const grouped = groupByCategory(customsConcepts);
  const { getProgress } = useCustomsProgress();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-5 py-10">
        <BackButton fallbackRoute="/knowledge-map" label="返回课程地图" />
        <div className="mb-8">
          <h1 className="text-xl font-semibold">报关与检验</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            报关流程 · HS编码 · 商检 · 共 {customsConcepts.length} 个知识点
          </p>
        </div>

        <div className="space-y-10">
          {Object.entries(grouped).map(([category, concepts]) => (
            <section key={category}>
              <div className="pb-3 mb-3 border-b" style={{ borderColor: "var(--color-border)" }}>
                <h2 className="text-sm font-semibold">{categoryLabels[category] || category}</h2>
              </div>
              <div className="divide-y border rounded-lg" style={{ borderColor: "var(--color-border)", borderBottom: "none" }}>
                {concepts.map((concept) => {
                  const progress = getProgress(concept.id);
                  return (
                    <Link
                      key={concept.id}
                      href={`/customs/${concept.id}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="shrink-0 w-7 text-xs font-semibold tabular-nums" style={{ color: "var(--color-text-muted)" }}>{String(INDEX_BY_ID.get(concept.id) ?? 0).padStart(2, "0")}</span>
                        <div className="min-w-0">
                          <span className="text-sm font-medium">{concept.title}</span>
                          <span className="ml-2 text-xs hidden sm:inline" style={{ color: "var(--color-text-muted)" }}>
                            {concept.englishTitle}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 ml-3">
                        <StatusDot
                          status={progress.status}
                          isDue={progress.nextReviewAt > 0 && progress.nextReviewAt <= Date.now() && progress.status !== "new"}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 pt-5 border-t flex flex-wrap gap-4 text-xs" style={{ borderColor: "var(--color-border)" }}>
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
