import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { tradeTerms, getTermByCode } from "@/data/trade-terms";
import { settlementConcepts } from "@/data/settlement-concepts";
import { getModuleNav, getPrevNext } from "@/lib/navigation";
import PrevNextNav from "@/components/learn/PrevNextNav";
import BackButton from "@/components/learn/BackButton";
import TermProgressAction from "@/components/terms/TermProgressAction";

export async function generateStaticParams() {
  return tradeTerms.map((term) => ({ code: term.code.toLowerCase() }));
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
    (item) => item.category === term.category && item.code !== term.code,
  );
  const relatedSettlement = settlementConcepts.filter((concept) =>
    concept.relatedIncotermCodes.includes(term.code),
  );
  const nav = getModuleNav("incoterms");
  const normalizedCode = code.toLowerCase();
  const index = nav.findIndex((item) => item.slug === normalizedCode);
  const { prev, next } = getPrevNext("incoterms", normalizedCode);

  return (
    <div className="min-h-screen" style={{ background: "#fff", color: "#1f1f1f" }}>
      <Header />
      <main>
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
          <BackButton fallbackRoute="/terms-preview" label="返回术语卡片" />

          <div className="mt-8 flex items-center justify-between gap-4 text-xs" style={{ color: "#888" }}>
            <nav aria-label="当前位置" className="flex items-center gap-2">
              <Link href="/terms-preview" className="hover:text-[#222]">术语卡片</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#444" }}>{term.code}</span>
            </nav>
            <span>{String(index + 1).padStart(2, "0")} / {String(nav.length).padStart(2, "0")}</span>
          </div>

          <section className="mt-4 overflow-hidden rounded-[28px] border" style={{ borderColor: "#dcdcdc", background: "rgba(250,250,250,.72)", boxShadow: "0 18px 50px rgba(0,0,0,.06)" }}>
            <div className="border-b px-6 py-9 sm:px-10 sm:py-12" style={{ borderColor: "#dedede", background: "rgba(245,245,245,.72)", backdropFilter: "blur(14px)" }}>
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <span className="inline-flex rounded-full border bg-white/75 px-3 py-1 text-xs" style={{ borderColor: "#d6d6d6", color: "#666" }}>{term.category} 组 · {term.categoryLabel}</span>
                  <p className="mt-7 text-6xl font-semibold tracking-[-0.08em] sm:text-8xl">{term.code}</p>
                  <h1 className="mt-3 text-2xl font-medium tracking-[-0.03em] sm:text-3xl">{term.chineseName}</h1>
                  <p className="mt-2 text-sm tracking-wide" style={{ color: "#777" }}>{term.fullName}</p>
                  <TermProgressAction termId={term.code} />
                </div>
                <div className="max-w-[18rem] rounded-2xl border bg-white/65 p-4 text-sm leading-6" style={{ borderColor: "#dedede", color: "#555" }}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>一句话理解</p>
                  <p className="mt-2">{term.summary}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8 px-6 py-7 sm:px-10 sm:py-10">
              <section className="rounded-2xl border bg-white/70 p-5 sm:p-6" style={{ borderColor: "#dedede", backdropFilter: "blur(10px)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>核心定义</p>
                <p className="mt-3 text-base leading-7" style={{ color: "#444" }}>{term.description}</p>
              </section>

              <section>
                <div className="grid gap-3 sm:grid-cols-3">
                  <InfoCard label="风险转移" value={term.riskTransferPoint} />
                  <InfoCard label="运输方式" value={term.transportMode.join(" / ")} />
                  <InfoCard label="核心要点" value={term.keyPoint} />
                </div>
              </section>

              <section>
                <SectionHeading eyebrow="RESPONSIBILITIES" title="谁负责什么" />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <ObligationCard title="卖方负责" items={term.sellerObligations} />
                  <ObligationCard title="买方负责" items={term.buyerObligations} />
                </div>
              </section>

              <details className="group rounded-2xl border bg-white/55" style={{ borderColor: "#dedede" }}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium sm:px-6">
                  <span>查看责任时间线</span>
                  <span className="text-lg transition-transform group-open:rotate-45" style={{ color: "#888" }}>＋</span>
                </summary>
                <div className="border-t px-5 py-5 sm:px-6" style={{ borderColor: "#e8e8e8" }}>
                  <div className="space-y-4">
                    {term.timeline.map((step, stepIndex) => (
                      <div key={`${step.step}-${stepIndex}`} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px]" style={{ borderColor: "#d5d5d5", color: "#666" }}>{stepIndex + 1}</span>
                        <div><p className="text-sm">{step.step}</p><p className="mt-1 text-xs" style={{ color: "#888" }}>{step.responsible === "seller" ? "卖方" : step.responsible === "buyer" ? "买方" : "双方"}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>

              {term.commonMisunderstandings.length > 0 && <section>
                <SectionHeading eyebrow="WATCH OUT" title="容易误解的地方" />
                <div className="mt-4 space-y-3">
                  {term.commonMisunderstandings.map((item, itemIndex) => <div key={item} className="flex gap-3 rounded-xl border bg-white/55 p-4" style={{ borderColor: "#e3e3e3" }}><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-xs" style={{ color: "#666" }}>{itemIndex + 1}</span><p className="text-sm leading-6" style={{ color: "#555" }}>{item}</p></div>)}
                </div>
              </section>}

              {term.similarTermDiffs.length > 0 && <section>
                <SectionHeading eyebrow="COMPARE" title="和相近术语对比" />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {term.similarTermDiffs.map((difference) => {
                    const related = tradeTerms.find((item) => item.code === difference.term);
                    return <div key={difference.term} className="rounded-2xl border bg-white/55 p-4" style={{ borderColor: "#e3e3e3" }}><Link href={`/terms/${difference.term.toLowerCase()}`} className="inline-flex items-center gap-2 text-sm font-medium hover:underline">{difference.term}<span style={{ color: "#777" }}>{related?.chineseName}</span><span style={{ color: "#888" }}>↗</span></Link><p className="mt-3 text-sm leading-6" style={{ color: "#555" }}>{difference.diff}</p></div>;
                  })}
                </div>
              </section>}

              {relatedSettlement.length > 0 && <section>
                <SectionHeading eyebrow="RELATED" title="相关业务资料" />
                <div className="mt-4 flex flex-wrap gap-2">{relatedSettlement.map((concept) => <Link key={concept.id} href={`/settlement/${concept.id}`} className="rounded-full border bg-white/60 px-3 py-2 text-xs hover:bg-[#f3f3f3]" style={{ borderColor: "#dedede" }}>{concept.title}</Link>)}</div>
              </section>}

              {relatedTerms.length > 0 && <section className="border-t pt-7" style={{ borderColor: "#e5e5e5" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>同组术语</p>
                <div className="mt-3 flex flex-wrap gap-2">{relatedTerms.map((related) => <Link key={related.code} href={`/terms/${related.code.toLowerCase()}`} className="rounded-full border bg-white/60 px-3 py-2 text-xs hover:bg-[#f3f3f3]" style={{ borderColor: "#dedede" }}><span className="font-medium">{related.code}</span><span className="ml-2" style={{ color: "#777" }}>{related.chineseName}</span></Link>)}</div>
              </section>}
            </div>
          </section>

          <div className="mt-7"><PrevNextNav prev={prev} next={next} /></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div><p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>{eyebrow}</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">{title}</h2></div>;
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border bg-white/60 p-4" style={{ borderColor: "#dedede" }}><p className="text-xs" style={{ color: "#888" }}>{label}</p><p className="mt-2 text-sm leading-6" style={{ color: "#444" }}>{value}</p></div>;
}

function ObligationCard({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-2xl border bg-white/60 p-5" style={{ borderColor: "#dedede" }}><h3 className="text-sm font-medium">{title}</h3><ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-6" style={{ color: "#555" }}><span style={{ color: "#999" }}>•</span><span>{item}</span></li>)}</ul></div>;
}
