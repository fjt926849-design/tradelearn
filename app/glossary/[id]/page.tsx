import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/learn/BackButton";
import { tradeGlossary } from "@/data/trade-glossary";

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

  const relatedEntries = tradeGlossary.filter(
    (item) => item.group === entry.group && item.id !== entry.id,
  ).slice(0, 6);

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
                  <p className="mt-2">{entry.definition}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8 px-6 py-7 sm:px-10 sm:py-10">
              <section className="rounded-2xl border bg-white/70 p-5 sm:p-6" style={{ borderColor: "#dedede", backdropFilter: "blur(10px)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>核心定义</p>
                <p className="mt-3 text-base leading-7" style={{ color: "#444" }}>{entry.definition}</p>
              </section>

              <section className="rounded-2xl border bg-white/60 p-5 sm:p-6" style={{ borderColor: "#dedede" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>实务用法</p>
                <p className="mt-3 text-base leading-7" style={{ color: "#444" }}>{entry.usage}</p>
              </section>

              <section>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoCard label="所属篇章" value={entry.group} />
                  <InfoCard label="教材章节" value={entry.chapterLabel} />
                </div>
              </section>

              <section className="border-t pt-7" style={{ borderColor: "#e5e5e5" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>同篇章术语</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{relatedEntries.map((related) => <Link key={related.id} href={`/glossary/${related.id}`} className="group rounded-2xl border bg-white/60 p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(0,0,0,.08)]" style={{ borderColor: "#dedede" }}><div className="flex items-start justify-between gap-3"><p className="text-base font-medium">{related.term}</p><span className="transition-transform group-hover:translate-x-1" style={{ color: "#999" }} aria-hidden="true">↗</span></div><p className="mt-2 truncate text-xs" style={{ color: "#888" }}>{related.english}</p></Link>)}</div>
              </section>

              <p className="border-t pt-5 text-xs leading-5" style={{ borderColor: "#e5e5e5", color: "#888" }}>内容参考《国际贸易实务》第七版相关章节整理，定义为独立编写的学习提示。</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border bg-white/60 p-4" style={{ borderColor: "#dedede" }}><p className="text-xs" style={{ color: "#888" }}>{label}</p><p className="mt-2 text-sm" style={{ color: "#444" }}>{value}</p></div>;
}
