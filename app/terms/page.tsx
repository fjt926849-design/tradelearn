"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { tradeTerms } from "@/data/trade-terms";
import { useFlashcardProgress } from "@/hooks/useFlashcardProgress";
import StatusDot from "@/components/ui/StatusDot";
import type { TradeTerm } from "@/lib/types";
import { getModuleNav } from "@/lib/navigation";
import BackButton from "@/components/learn/BackButton";

const INDEX_BY_SLUG = new Map(
  getModuleNav("incoterms").map((n, i) => [n.slug, i + 1] as const)
);


const categoryOrder = [
  { key: "E", label: "E 组 · 启运", desc: "卖方在自己场所将货物交给买方" },
  { key: "F", label: "F 组 · 主运费未付", desc: "卖方将货物交给买方指定承运人" },
  { key: "C", label: "C 组 · 主运费已付", desc: "卖方支付运费到目的地，风险在装运地转移" },
  { key: "D", label: "D 组 · 到达", desc: "卖方承担直到目的地的所有风险和费用" },
] as const;

function groupByCategory(terms: TradeTerm[]) {
  const groups: Record<string, TradeTerm[]> = { E: [], F: [], C: [], D: [] };
  for (const t of terms) groups[t.category].push(t);
  return groups;
}

export default function TermsPage() {
  const grouped = groupByCategory(tradeTerms);
  const { getTermProgress } = useFlashcardProgress();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-5 py-10">
        <BackButton fallbackRoute="/knowledge-map" label="返回课程地图" />
        <div className="mb-8">
          <h1 className="text-xl font-semibold">贸易术语</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Incoterms 2020 · 共 11 个术语 · 按责任划分四组
          </p>
        </div>

        <div className="space-y-10">
          {categoryOrder.map(({ key, label, desc }) => {
            const terms = grouped[key];
            return (
              <section key={key} id={`group-${key.toLowerCase()}`}>
                <div
                  className="pb-3 mb-3 border-b"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <h2 className="text-sm font-semibold">{label}</h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
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
                  {terms.map((term) => {
                    const progress = getTermProgress(term.code);
                    return (
                      <Link
                        key={term.code}
                        href={`/terms/${term.code.toLowerCase()}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="shrink-0 w-7 text-xs font-semibold tabular-nums" style={{ color: "var(--color-text-muted)" }}>{String(INDEX_BY_SLUG.get(term.code.toLowerCase()) ?? 0).padStart(2, "0")}</span>
                          <div className="min-w-0">
                            <span className="text-sm font-medium">
                              {term.code}
                            </span>
                            <span
                              className="ml-2 text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {term.chineseName}
                            </span>
                            <span
                              className="ml-2 text-xs hidden sm:inline"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {term.fullName}
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
