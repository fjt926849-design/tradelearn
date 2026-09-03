import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/learn/BackButton";
import { tradeGlossary } from "@/data/trade-glossary";
import { termLibraryCards } from "@/data/term-library";
import PrevNextNav, { type PrevNextLink } from "@/components/learn/PrevNextNav";

export async function generateStaticParams() {
  return tradeGlossary.map((entry) => ({ id: entry.id }));
}

export default async function GlossaryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = tradeGlossary.find((item) => item.id === id);
  if (!entry) notFound();

  const relatedEntries = (entry.relatedIds ?? [])
    .map((relatedId) => tradeGlossary.find((item) => item.id === relatedId))
    .filter((item): item is (typeof tradeGlossary)[number] => Boolean(item));
  const cardIndex = termLibraryCards.findIndex((card) => card.id === entry.id);
  const previousCard = cardIndex > 0 ? termLibraryCards[cardIndex - 1] : null;
  const nextCard = cardIndex >= 0 && cardIndex < termLibraryCards.length - 1 ? termLibraryCards[cardIndex + 1] : null;
  const toNavigationLink = (card: (typeof termLibraryCards)[number]): PrevNextLink => ({
    href: card.href,
    label: `${card.code} · ${card.name}`,
    sub: card.english,
  });

  return (
    <div className="min-h-screen" style={{ background: "#fff", color: "#1f1f1f" }}>
      <Header />
      <main>
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
          <BackButton fallbackRoute="/terms-preview" label="返回术语篇章" />

          <div className="mt-8 flex items-center justify-between gap-4 text-xs" style={{ color: "#888" }}>
            <nav aria-label="当前位置" className="flex items-center gap-2">
              <Link href="/terms-preview" className="hover:text-[#222]">术语篇章</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#444" }}>{entry.group}</span>
            </nav>
            <span>{entry.chapterLabel}</span>
          </div>

          <section className="mt-4 overflow-hidden rounded-[28px] border" style={{ borderColor: "#dcdcdc", background: "rgba(250,250,250,.72)", boxShadow: "0 18px 50px rgba(0,0,0,.06)" }}>
            <div className="border-b px-6 py-9 sm:px-10 sm:py-12" style={{ borderColor: "#dedede", background: "rgba(245,245,245,.72)", backdropFilter: "blur(14px)" }}>
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <span className="inline-flex rounded-full border bg-white/75 px-3 py-1 text-xs" style={{ borderColor: "#d6d6d6", color: "#666" }}>{entry.group} · {entry.chapterLabel}</span>
                  <p className="mt-7 max-w-3xl text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">{entry.term}</p>
                  <p className="mt-3 text-lg" style={{ color: "#555" }}>{entry.english}</p>
                </div>
                <div className="max-w-[18rem] rounded-2xl border bg-white/65 p-4 text-sm leading-6" style={{ borderColor: "#dedede", color: "#555" }}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>一句话理解</p>
                  <p className="mt-2">{entry.summary}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8 px-6 py-7 sm:px-10 sm:py-10">
              <section className="rounded-2xl border bg-white/70 p-5 sm:p-6" style={{ borderColor: "#dedede", backdropFilter: "blur(10px)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>核心定义</p>
                <p className="mt-3 text-base leading-7" style={{ color: "#444" }}>{entry.detailedDefinition}</p>
              </section>

              <section className="rounded-2xl border bg-white/60 p-5 sm:p-6" style={{ borderColor: "#dedede" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>实务用法</p>
                <p className="mt-3 text-base leading-7" style={{ color: "#444" }}>{entry.practicalUse}</p>
                <div className="mt-5 rounded-xl border bg-[#fafafa] p-4" style={{ borderColor: "#e5e5e5" }}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#999" }}>业务场景</p>
                  <p className="mt-2 text-sm leading-6" style={{ color: "#555" }}>{entry.scenario}</p>
                </div>
              </section>

              <section>
                <SectionHeading eyebrow="KEY POINTS" title="掌握要点" />
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {entry.keyPoints.map((point, pointIndex) => (
                    <div key={point} className="rounded-2xl border bg-white/60 p-4" style={{ borderColor: "#dedede" }}>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f0f0f0] text-xs" style={{ color: "#666" }}>{pointIndex + 1}</span>
                      <p className="mt-3 text-sm leading-6" style={{ color: "#555" }}>{point}</p>
                    </div>
                  ))}
                </div>
              </section>

              {entry.commonMistakes.length > 0 && <section>
                <SectionHeading eyebrow="WATCH OUT" title="常见误区" />
                <div className="mt-4 space-y-3">
                  {entry.commonMistakes.map((mistake, mistakeIndex) => (
                    <div key={mistake} className="flex items-start gap-3 rounded-xl border bg-white/55 p-4" style={{ borderColor: "#e3e3e3" }}>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-xs" style={{ color: "#666" }}>{mistakeIndex + 1}</span>
                      <p className="text-sm leading-6" style={{ color: "#555" }}>{mistake}</p>
                    </div>
                  ))}
                </div>
              </section>}

              {relatedEntries.length > 0 && <section className="border-t pt-7" style={{ borderColor: "#e5e5e5" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>RELATED</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">相关术语</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedEntries.map((related) => (
                    <Link key={related.id} href={`/glossary/${related.id}`} className="group rounded-2xl border bg-white/60 p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(0,0,0,.08)]" style={{ borderColor: "#dedede" }}>
                      <div className="flex items-start justify-between gap-3"><p className="text-base font-medium">{related.term}</p><span className="transition-transform group-hover:translate-x-1" style={{ color: "#999" }} aria-hidden="true">↗</span></div>
                      <p className="mt-2 truncate text-xs" style={{ color: "#888" }}>{related.english}</p>
                    </Link>
                  ))}
                </div>
              </section>}

              <p className="border-t pt-5 text-xs leading-5" style={{ borderColor: "#e5e5e5", color: "#888" }}>内容参考《国际贸易实务》第七版相关章节整理，定义为独立编写的学习提示。</p>
            </div>
          </section>

          <div className="mt-7">
            <PrevNextNav
              prev={previousCard ? toNavigationLink(previousCard) : null}
              next={nextCard ? toNavigationLink(nextCard) : null}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">{title}</h2>
    </div>
  );
}
