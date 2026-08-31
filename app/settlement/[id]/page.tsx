import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  settlementConcepts,
  getSettlementConceptById,
} from "@/data/settlement-concepts";
import { tradeTerms } from "@/data/trade-terms";
import { getModuleNav, getPrevNext } from "@/lib/navigation";
import { MODULE_CHAPTERS } from "@/lib/types";
import ModuleIndex from "@/components/learn/ModuleIndex";
import PrevNextNav from "@/components/learn/PrevNextNav";
import BackButton from "@/components/learn/BackButton";

export async function generateStaticParams() {
  return settlementConcepts.map((c) => ({ id: c.id }));
}

export default async function SettlementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concept = getSettlementConceptById(id);
  if (!concept) notFound();

  const relatedIncoterms = concept.relatedIncotermCodes
    .map((code) => tradeTerms.find((t) => t.code === code))
    .filter((t): t is NonNullable<typeof t> => t != null);

  // Cross-module: find settlement concepts that relate to this concept's related Incoterms
  const sameCategoryConcepts = settlementConcepts.filter(
    (c) => c.category === concept.category && c.id !== concept.id
  );

  const nav = getModuleNav("settlement");
  const index = nav.findIndex((n) => n.slug === id);
  const { prev, next } = getPrevNext("settlement", id);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-5 py-10">
        <BackButton fallbackRoute="/settlement" />
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:items-start">
          <ModuleIndex moduleId="settlement" currentSlug={id} />
          <div className="min-w-0">
            {/* Breadcrumb */}
            <nav
              className="flex items-center gap-1.5 text-sm mb-8"
              style={{ color: "var(--color-text-muted)" }}
            >
              <Link href="/" className="hover:text-black transition-colors">
                首页
              </Link>
              <span>/</span>
              <Link
                href="/settlement"
                className="hover:text-black transition-colors"
              >
                国际结算
              </Link>
              <span>/</span>
              <span style={{ color: "var(--color-text)" }}>{concept.title}</span>
            </nav>

            {/* ═══ 知识阅读区 ═══ */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <p className="text-xs font-semibold tracking-[0.16em]" style={{ color: "var(--color-accent)" }}>
                  {MODULE_CHAPTERS.settlement.no} · {MODULE_CHAPTERS.settlement.en} · {String(index + 1).padStart(2, "0")} / {String(nav.length).padStart(2, "0")}
                </p>
                <h1 className="mt-3 text-2xl font-bold">{concept.title}</h1>
                <p
                  className="mt-1 text-lg"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {concept.englishTitle}
                </p>
              </div>

              {/* Summary */}
              <div
                className="border-l-2 pl-4 py-1"
                style={{ borderColor: "var(--color-text)" }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {concept.summary}
                </p>
              </div>

              {/* Description */}
              <div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {concept.description}
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h2
                  className="text-sm font-semibold pb-3 border-b"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  核心特征
                </h2>
                <ul className="mt-4 space-y-2">
                  {concept.keyFeatures.map((f, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      <span className="shrink-0">·</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Parties (L/C 专用) */}
              {concept.parties && concept.parties.length > 0 && (
                <>
                  <div>
                    <h2
                      className="text-sm font-semibold pb-3 border-b"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      参与方与基本结构
                    </h2>
                    <div className="mt-4 space-y-4">
                      {concept.parties.map((p, i) => (
                        <div
                          key={i}
                          className="border rounded-lg p-4"
                          style={{ borderColor: "var(--color-border)" }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{p.role}</span>
                            <span
                              className="text-xs"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {p.englishRole}
                            </span>
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded"
                              style={{
                                background:
                                  p.who === "exporter-side"
                                    ? "#fef3c7"
                                    : p.who === "importer-side"
                                      ? "#dbeafe"
                                      : "#f3f4f6",
                                color: p.who === "exporter-side" ? "#92400e" : p.who === "importer-side" ? "#1e40af" : "#4b5563",
                              }}
                            >
                              {p.who === "exporter-side"
                                ? "出口方"
                                : p.who === "importer-side"
                                  ? "进口方"
                                  : "银行"}
                            </span>
                          </div>
                          <p
                            className="text-sm"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {p.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Process steps (L/C 9-step flow) */}
                  {concept.processSteps && concept.processSteps.length > 0 && (
                    <div>
                      <h2
                        className="text-sm font-semibold pb-3 border-b"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        交易流程
                      </h2>
                      <div className="mt-4 space-y-0">
                        {concept.processSteps.map((step, i) => (
                          <div key={i} className="flex gap-3 pb-3 relative">
                            {i < concept.processSteps!.length - 1 && (
                              <div
                                className="absolute left-[13px] top-7 bottom-0 w-px"
                                style={{ background: "var(--color-border)" }}
                              />
                            )}
                            <div
                              className="shrink-0 w-[27px] h-[27px] rounded-full border flex items-center justify-center text-xs font-medium"
                              style={{
                                borderColor: "var(--color-border)",
                                background: "var(--color-bg)",
                              }}
                            >
                              {step.order}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm">{step.action}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span
                                  className="text-xs"
                                  style={{ color: "var(--color-text-muted)" }}
                                >
                                  {step.actorLabel}
                                </span>
                                {step.documents && step.documents.length > 0 && (
                                  <span
                                    className="text-xs"
                                    style={{ color: "var(--color-text-muted)" }}
                                  >
                                    · 涉及：{step.documents.join("、")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Process steps for non-L/C payment methods */}
              {(!concept.parties || concept.parties.length === 0) &&
                concept.processSteps &&
                concept.processSteps.length > 0 && (
                  <div>
                    <h2
                      className="text-sm font-semibold pb-3 border-b"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      操作流程
                    </h2>
                    <div className="mt-4 space-y-0">
                      {concept.processSteps.map((step, i) => (
                        <div key={i} className="flex gap-3 pb-3 relative">
                          {i < concept.processSteps!.length - 1 && (
                            <div
                              className="absolute left-[13px] top-7 bottom-0 w-px"
                              style={{ background: "var(--color-border)" }}
                            />
                          )}
                          <div
                            className="shrink-0 w-[27px] h-[27px] rounded-full border flex items-center justify-center text-xs font-medium"
                            style={{
                              borderColor: "var(--color-border)",
                              background: "var(--color-bg)",
                            }}
                          >
                            {step.order}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm">{step.action}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className="text-xs"
                                style={{ color: "var(--color-text-muted)" }}
                              >
                                {step.actorLabel}
                              </span>
                              {step.documents && step.documents.length > 0 && (
                                <span
                                  className="text-xs"
                                  style={{ color: "var(--color-text-muted)" }}
                                >
                                  · 涉及：{step.documents.join("、")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Common misunderstandings */}
              {concept.commonMisunderstandings.length > 0 && (
                <div>
                  <h2
                    className="text-sm font-semibold pb-3 border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    常见误解
                  </h2>
                  <div className="mt-4 space-y-3">
                    {concept.commonMisunderstandings.map((m, i) => (
                      <div key={i} className="flex gap-3">
                        <span
                          className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium"
                          style={{
                            background: "var(--color-border)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {i + 1}
                        </span>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {m}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comparisons */}
              {concept.comparisons.length > 0 && (
                <div>
                  <h2
                    className="text-sm font-semibold pb-3 border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    相近概念对比
                  </h2>
                  <div className="mt-4 space-y-4">
                    {concept.comparisons.map((comp) => {
                      const related = settlementConcepts.find(
                        (c) => c.id === comp.conceptId
                      );
                      return (
                        <div
                          key={comp.conceptId}
                          className="border rounded-lg p-4"
                          style={{ borderColor: "var(--color-border)" }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {related && (
                              <Link
                                href={`/settlement/${comp.conceptId}`}
                                className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                                style={{ color: "var(--color-text)" }}
                              >
                                <span>{comp.title}</span>
                                <span
                                  className="text-xs"
                                  style={{ color: "var(--color-text-muted)" }}
                                >
                                  →
                                </span>
                              </Link>
                            )}
                            {!related && (
                              <span className="text-sm font-medium">
                                {comp.title}
                              </span>
                            )}
                          </div>
                          <ul className="space-y-1">
                            {comp.differences.map((d, j) => (
                              <li
                                key={j}
                                className="flex gap-2 text-sm"
                                style={{ color: "var(--color-text-secondary)" }}
                              >
                                <span className="shrink-0">·</span>
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Related Incoterms (cross-module) */}
              {relatedIncoterms.length > 0 && (
                <div>
                  <h2
                    className="text-sm font-semibold pb-3 border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    相关贸易术语
                  </h2>
                  <p
                    className="mt-3 text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    实务中与本结算方式常搭配使用的 Incoterms 术语：
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {relatedIncoterms.map((term) => (
                      <Link
                        key={term.code}
                        href={`/terms/${term.code.toLowerCase()}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        <span className="font-medium">{term.code}</span>
                        <span style={{ color: "var(--color-text-muted)" }}>
                          {term.chineseName}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ═══ 操作区 ═══ */}
            <div
              className="mt-10 pt-8 border-t space-y-5"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">准备闪卡复习？</p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    翻转卡片，检验你是否真正理解了这个知识点
                  </p>
                </div>
                <Link
                  href={`/settlement/flashcards`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border transition-colors hover:bg-gray-50"
                  style={{
                    color: "var(--color-text)",
                    borderColor: "var(--color-text)",
                  }}
                >
                  开始闪卡复习 →
                </Link>
              </div>

              {/* Same category concepts */}
              {sameCategoryConcepts.length > 0 && (
                <div>
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    同组概念
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sameCategoryConcepts.map((sc) => (
                      <Link
                        key={sc.id}
                        href={`/settlement/${sc.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        <span className="font-medium">{sc.title}</span>
                        <span style={{ color: "var(--color-text-muted)" }}>
                          {sc.englishTitle}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <PrevNextNav prev={prev} next={next} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
