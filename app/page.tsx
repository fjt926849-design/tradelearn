"use client";

import Link from "next/link";
import { useMemo } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { termLibraryCards, termLibraryChapters } from "@/data/term-library";
import { useTermCardProgress } from "@/hooks/useTermCardProgress";

export default function HomePage() {
  const { getStatus, records } = useTermCardProgress();
  const masteredCount = termLibraryCards.filter((term) => getStatus(term.id) === "mastered").length;
  const continueTerm = useMemo(() => {
    const started = termLibraryCards
      .map((term) => ({
        term,
        status: getStatus(term.id),
        lastOpenedAt: records[term.id]?.lastOpenedAt ?? 0,
      }))
      .filter(({ status, lastOpenedAt }) => status !== "mastered" && lastOpenedAt > 0)
      .sort((a, b) => b.lastOpenedAt - a.lastOpenedAt)[0];

    return started?.term ?? termLibraryCards.find((term) => getStatus(term.id) === "new") ?? termLibraryCards[0];
  }, [getStatus, records]);
  const continueStatus = getStatus(continueTerm.id);

  return (
    <div className="min-h-screen" style={{ background: "#fff", color: "var(--color-text)" }}>
      <Header />
      <main>
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
          <section className="rounded-2xl border p-6 sm:p-8" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "var(--color-accent)" }}>TRADELEARN · TERM LIBRARY</p>
            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">术语学习中心</h1>
                <p className="mt-3 max-w-2xl text-base leading-7" style={{ color: "var(--color-text-muted)" }}>
                  按教材篇章浏览贸易术语。先看一张卡片，再沿着同一篇章继续学习。
                </p>
              </div>
              <Link href="/terms-preview" className="text-sm font-medium" style={{ color: "var(--color-accent)" }}>
                查看完整术语库 →
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Stat value={termLibraryCards.length} label="术语卡片" />
              <Stat value={termLibraryChapters.length} label="篇章" />
              <Stat value={`${masteredCount} / ${termLibraryCards.length}`} label="已掌握" />
            </div>
          </section>

          <section className="mt-6 rounded-2xl border p-6 sm:p-8" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            <p className="text-xs font-semibold tracking-[0.25em]" style={{ color: "var(--color-accent)" }}>CONTINUE LEARNING</p>
            <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{continueStatus === "learning" ? "继续学习这张术语卡" : "从这张术语卡开始"}</h2>
                <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {continueTerm.code} · {continueTerm.name} · {continueTerm.english}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={continueTerm.href} className="rounded-lg px-4 py-2.5 text-sm font-medium text-white" style={{ background: "var(--color-accent)" }}>
                  {continueStatus === "learning" ? "继续学习 →" : "开始学习 →"}
                </Link>
                <Link href="/flashcards" className="rounded-lg border px-4 py-2.5 text-sm font-medium" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                  闪卡复习
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-12">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.25em]" style={{ color: "var(--color-text-muted)" }}>CHAPTERS</p>
                <h2 className="mt-2 text-2xl font-semibold">术语篇章与卡片总览</h2>
                <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>每个大卡片对应一个篇章，里面是该篇章的小术语卡片。</p>
              </div>
              <Link href="/terms-preview" className="text-sm font-medium" style={{ color: "var(--color-accent)" }}>浏览全部篇章 →</Link>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {termLibraryChapters.map((chapter) => {
                const mastered = chapter.terms.filter((term) => getStatus(term.id) === "mastered").length;
                const progress = chapter.terms.length ? Math.round((mastered / chapter.terms.length) * 100) : 0;
                return (
                  <article key={chapter.id} id={chapter.id} className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                    <div className="border-b p-5" style={{ borderColor: "var(--color-border)" }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold" style={{ background: "var(--color-accent-soft)", color: "var(--color-accent)" }}>{chapter.number}</span>
                          <div>
                            <h3 className="text-lg font-semibold">{chapter.title}</h3>
                            <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>{chapter.description}</p>
                          </div>
                        </div>
                        <span className="shrink-0 text-sm" style={{ color: "var(--color-text-muted)" }}>{mastered} / {chapter.terms.length}</span>
                      </div>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--color-border)" }}>
                        <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "var(--color-accent)" }} />
                      </div>
                    </div>
                    <div className="grid gap-3 p-5 sm:grid-cols-3">
                      {chapter.terms.slice(0, 3).map((term) => (
                        <Link key={term.id} href={term.href} className="rounded-xl border p-4 transition-colors hover:border-blue-300" style={{ borderColor: "var(--color-border)" }}>
                          <p className="text-lg font-semibold">{term.code}</p>
                          <p className="mt-1 text-sm font-medium">{term.name}</p>
                          <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>{term.english}</p>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t px-5 py-4" style={{ borderColor: "var(--color-border)" }}>
                      <Link href={`/terms-preview#${chapter.id}`} className="text-sm font-medium" style={{ color: "var(--color-accent)" }}>
                        查看本篇全部 {chapter.terms.length} 个术语 →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-xl border px-4 py-4" style={{ borderColor: "var(--color-border)" }}>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>{label}</p>
    </div>
  );
}
