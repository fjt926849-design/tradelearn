import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { tradeTerms, getTermByCode } from "@/data/trade-terms";
import { settlementConcepts } from "@/data/settlement-concepts";
import { getModuleNav, getPrevNext } from "@/lib/navigation";
import { MODULE_CHAPTERS } from "@/lib/types";
import ModuleIndex from "@/components/learn/ModuleIndex";
import PrevNextNav from "@/components/learn/PrevNextNav";

export async function generateStaticParams() {
  return tradeTerms.map((t) => ({ code: t.code.toLowerCase() }));
}

export default async function TermDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const term = getTermByCode(code);
  if (!term) notFound();

  const relatedTerms = tradeTerms.filter(
    (t) => t.category === term.category && t.code !== term.code
  );

  // Cross-module: find settlement concepts linked to this Incoterm
  const relatedSettlement = settlementConcepts.filter((sc) =>
    sc.relatedIncotermCodes.includes(term.code)
  );

  const nav = getModuleNav("incoterms");
  const index = nav.findIndex((n) => n.slug === code);
  const { prev, next } = getPrevNext("incoterms", code);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-5 py-10">
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:items-start">
          <ModuleIndex moduleId="incoterms" currentSlug={code} />
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
              <Link href="/terms" className="hover:text-black transition-colors">
                贸易术语
              </Link>
              <span>/</span>
              <span style={{ color: "var(--color-text)" }}>{term.code}</span>
            </nav>

            {/* ═══ 知识阅读区 ═══ */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <p className="text-xs font-semibold tracking-[0.16em]" style={{ color: "var(--color-accent)" }}>
                  {MODULE_CHAPTERS.incoterms.no} · {MODULE_CHAPTERS.incoterms.en} · {String(index + 1).padStart(2, "0")} / {String(nav.length).padStart(2, "0")}
                </p>
                <h1 className="mt-3 text-2xl font-bold">{term.code}</h1>
                <p className="mt-1 text-lg" style={{ color: "var(--color-text-secondary)" }}>
                  {term.chineseName}
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {term.fullName}
                </p>
              </div>

              {/* Summary */}
              <div
                className="border-l-2 pl-4 py-1"
                style={{ borderColor: "var(--color-text)" }}
              >
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {term.summary}
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {term.description}
                </p>
              </div>

              {/* Key info */}
              <div
                className="grid grid-cols-2 gap-px border rounded-lg overflow-hidden"
                style={{ borderColor: "var(--color-border)", background: "var(--color-border)" }}
              >
                <div className="p-4" style={{ background: "var(--color-bg)" }}>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    风险转移点
                  </span>
                  <p className="mt-1 text-sm">{term.riskTransferPoint}</p>
                </div>
                <div className="p-4" style={{ background: "var(--color-bg)" }}>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    运输方式
                  </span>
                  <p className="mt-1 text-sm">{term.transportMode.join(" / ")}</p>
                </div>
              </div>

              {/* Obligations */}
              <div>
                <h2
                  className="text-sm font-semibold pb-3 border-b"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  责任划分
                </h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">卖方</h3>
                    <ul className="space-y-1.5">
                      {term.sellerObligations.map((o, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          <span className="shrink-0">·</span>
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">买方</h3>
                    <ul className="space-y-1.5">
                      {term.buyerObligations.map((o, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          <span className="shrink-0">·</span>
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h2
                  className="text-sm font-semibold pb-3 border-b"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  责任时间线
                </h2>
                <div className="mt-4 space-y-0">
                  {term.timeline.map((step, i) => (
                    <div key={i} className="flex gap-3 pb-3 relative">
                      {i < term.timeline.length - 1 && (
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
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm">{step.step}</p>
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {step.responsible === "seller"
                            ? "卖方"
                            : step.responsible === "buyer"
                              ? "买方"
                              : "双方"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key point */}
              <div
                className="border rounded-lg p-4"
                style={{ borderColor: "var(--color-border)" }}
              >
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  <span className="font-medium" style={{ color: "var(--color-text)" }}>
                    核心要点：
                  </span>
                  {term.keyPoint}
                </p>
              </div>

              {/* Common misunderstandings */}
              {term.commonMisunderstandings.length > 0 && (
                <div>
                  <h2
                    className="text-sm font-semibold pb-3 border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    常见误解
                  </h2>
                  <div className="mt-4 space-y-3">
                    {term.commonMisunderstandings.map((m, i) => (
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
                        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                          {m}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar term diffs */}
              {term.similarTermDiffs.length > 0 && (
                <div>
                  <h2
                    className="text-sm font-semibold pb-3 border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    相近术语对比
                  </h2>
                  <div className="mt-4 space-y-4">
                    {term.similarTermDiffs.map((d) => {
                      const related = tradeTerms.find((t) => t.code === d.term);
                      return (
                        <div
                          key={d.term}
                          className="border rounded-lg p-4"
                          style={{ borderColor: "var(--color-border)" }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {related && (
                              <Link
                                href={`/terms/${d.term.toLowerCase()}`}
                                className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                                style={{ color: "var(--color-text)" }}
                              >
                                <span>{d.term}</span>
                                <span style={{ color: "var(--color-text-muted)" }}>
                                  {related.chineseName}
                                </span>
                                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                  →
                                </span>
                              </Link>
                            )}
                            {!related && (
                              <span className="text-sm font-medium">{d.term}</span>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                            {d.diff}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Settlement cross-module links */}
            {relatedSettlement.length > 0 && (
              <div>
                <h2
                  className="text-sm font-semibold pb-3 border-b"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  国际结算关联
                </h2>
                <p
                  className="mt-3 text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  实务中与本术语常搭配使用的结算方式：
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {relatedSettlement.map((sc) => (
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

            {/* ═══ 操作区 ═══ */}
            <div
              className="mt-10 pt-8 border-t space-y-5"
              style={{ borderColor: "var(--color-border)" }}
            >
              {/* Current status — client component needed, use a simple inline approach */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">准备闪卡复习？</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                    翻转卡片，检验你是否真正理解了这个术语
                  </p>
                </div>
                <Link
                  href={`/flashcards?term=${term.code.toLowerCase()}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border transition-colors hover:bg-gray-50"
                  style={{
                    color: "var(--color-text)",
                    borderColor: "var(--color-text)",
                  }}
                >
                  开始闪卡复习 →
                </Link>
              </div>

              {/* Related terms */}
              {relatedTerms.length > 0 && (
                <div>
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    同组术语
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {relatedTerms.map((rt) => (
                      <Link
                        key={rt.code}
                        href={`/terms/${rt.code.toLowerCase()}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        <span className="font-medium">{rt.code}</span>
                        <span style={{ color: "var(--color-text-muted)" }}>
                          {rt.chineseName}
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
