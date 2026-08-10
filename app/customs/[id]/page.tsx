import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { customsConcepts, getCustomsConceptById } from "@/data/customs-concepts";
import { tradeTerms } from "@/data/trade-terms";

export async function generateStaticParams() {
  return customsConcepts.map((c) => ({ id: c.id }));
}

export default async function CustomsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concept = getCustomsConceptById(id);
  if (!concept) notFound();

  const relatedIncoterms = concept.relatedIncotermCodes
    .map((code) => tradeTerms.find((t) => t.code === code))
    .filter((t): t is NonNullable<typeof t> => t != null);

  const sameCategoryConcepts = customsConcepts.filter(
    (c) => c.category === concept.category && c.id !== concept.id
  );

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-5 py-10">
        <nav className="flex items-center gap-1.5 text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
          <Link href="/" className="hover:text-black transition-colors">首页</Link>
          <span>/</span>
          <Link href="/customs" className="hover:text-black transition-colors">报关与检验</Link>
          <span>/</span>
          <span style={{ color: "var(--color-text)" }}>{concept.title}</span>
        </nav>

        <div className="space-y-8">
          <div>
            <span className="text-4xl">{concept.icon}</span>
            <h1 className="mt-3 text-2xl font-bold">{concept.title}</h1>
            <p className="mt-1 text-lg" style={{ color: "var(--color-text-secondary)" }}>{concept.englishTitle}</p>
          </div>

          <div className="border-l-2 pl-4 py-1" style={{ borderColor: "var(--color-text)" }}>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{concept.summary}</p>
          </div>

          <div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{concept.description}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>核心特征</h2>
            <ul className="mt-4 space-y-2">
              {concept.keyFeatures.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  <span className="shrink-0">·</span><span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {concept.commonMisunderstandings.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>常见误解</h2>
              <div className="mt-4 space-y-3">
                {concept.commonMisunderstandings.map((m, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium" style={{ background: "var(--color-border)", color: "var(--color-text-secondary)" }}>{i + 1}</span>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{m}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {concept.comparisons.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>相近概念对比</h2>
              <div className="mt-4 space-y-4">
                {concept.comparisons.map((comp) => {
                  const related = customsConcepts.find((c) => c.id === comp.conceptId);
                  return (
                    <div key={comp.conceptId} className="border rounded-lg p-4" style={{ borderColor: "var(--color-border)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        {related && (
                          <Link href={`/customs/${comp.conceptId}`} className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline" style={{ color: "var(--color-text)" }}>
                            <span>{related.icon}</span><span>{comp.title}</span>
                            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>→</span>
                          </Link>
                        )}
                        {!related && <span className="text-sm font-medium">{comp.title}</span>}
                      </div>
                      <ul className="space-y-1">
                        {comp.differences.map((d, j) => (
                          <li key={j} className="flex gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                            <span className="shrink-0">·</span><span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {relatedIncoterms.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>相关贸易术语</h2>
              <p className="mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>实务中与本知识点常搭配使用的 Incoterms：</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedIncoterms.map((term) => (
                  <Link key={term.code} href={`/terms/${term.code.toLowerCase()}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--color-border)" }}>
                    <span>{term.icon}</span><span className="font-medium">{term.code}</span>
                    <span style={{ color: "var(--color-text-muted)" }}>{term.chineseName}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 pt-8 border-t space-y-5" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">准备闪卡复习？</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>翻转卡片，检验你是否真正理解了这个知识点</p>
            </div>
            <Link href="/customs/flashcards" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border transition-colors hover:bg-gray-50" style={{ color: "var(--color-text)", borderColor: "var(--color-text)" }}>
              开始闪卡复习 →
            </Link>
          </div>
          {sameCategoryConcepts.length > 0 && (
            <div>
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>同组概念</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {sameCategoryConcepts.map((sc) => (
                  <Link key={sc.id} href={`/customs/${sc.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--color-border)" }}>
                    <span>{sc.icon}</span><span className="font-medium">{sc.title}</span>
                    <span style={{ color: "var(--color-text-muted)" }}>{sc.englishTitle}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
