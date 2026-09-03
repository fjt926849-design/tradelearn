"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { termLibraryCards } from "@/data/term-library";
import { useTermCardProgress } from "@/hooks/useTermCardProgress";

export default function HomePage() {
  const { getStatus, records } = useTermCardProgress();
  const continueTerm = useMemo(() => {
    const latestStarted = termLibraryCards
      .map((term) => ({
        term,
        status: getStatus(term.id),
        lastOpenedAt: records[term.id]?.lastOpenedAt ?? 0,
      }))
      .filter(({ status, lastOpenedAt }) => status !== "mastered" && lastOpenedAt > 0)
      .sort((a, b) => b.lastOpenedAt - a.lastOpenedAt)[0];

    return latestStarted?.term ?? termLibraryCards.find((term) => getStatus(term.id) === "new") ?? termLibraryCards[0];
  }, [getStatus, records]);
  const isLearning = getStatus(continueTerm.id) === "learning";

  return (
    <div className="min-h-screen" style={{ background: "#fff", color: "var(--color-text)" }}>
      <Header />
      <main className="flex min-h-[calc(100vh-7.5rem)] items-center">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
          <section
            className="overflow-hidden rounded-3xl border"
            style={{
              borderColor: "var(--color-border)",
              background: "rgba(255,255,255,0.86)",
              backdropFilter: "blur(18px)",
              boxShadow: "0 20px 60px rgba(31, 41, 55, 0.08)",
            }}
          >
            <div className="p-7 pb-5 text-center sm:p-10 sm:pb-7 lg:p-14 lg:pb-9">
              <p className="text-xs font-semibold tracking-[0.28em]" style={{ color: "var(--color-accent)" }}>
                TRADELEARN · TERM LIBRARY
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">国际贸易术语卡片</h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 sm:text-lg" style={{ color: "var(--color-text-muted)" }}>
                核心术语，提供缩写、中文名称、英文名称和基础释义。
              </p>
            </div>

            <div className="border-y px-5 py-4 sm:px-8 sm:py-6" style={{ borderColor: "var(--color-border)", background: "rgba(247,249,252,0.5)" }}>
              <Image
                src="/learning-steps.png"
                alt="TradeLearn 学习步骤：浏览术语篇章、打开术语卡片、查看术语详情、开始闪卡复习"
                width={1536}
                height={1024}
                priority
                className="mx-auto h-auto w-full max-w-5xl"
              />
            </div>

            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              <div className="p-7 sm:p-10 lg:p-12">
                <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "var(--color-text-muted)" }}>START HERE</p>
                <h2 className="mt-3 text-xl font-semibold">开始查看术语</h2>
                <p className="mt-3 text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
                  先浏览篇章，再打开对应的术语卡片，按自己的节奏了解每个词。
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/terms-preview" className="rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ background: "var(--color-accent)" }}>
                    浏览术语篇章
                  </Link>
                  <Link href="/flashcards" className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                    闪卡复习
                  </Link>
                </div>
                <p className="mt-7 text-sm" style={{ color: "var(--color-text-muted)" }}>{termLibraryCards.length} 张术语卡片</p>
              </div>

              <div className="border-t p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12" style={{ borderColor: "var(--color-border)", background: "rgba(247,249,252,0.68)" }}>
                <p className="text-xs font-semibold tracking-[0.24em]" style={{ color: "var(--color-text-muted)" }}>
                  {isLearning ? "CONTINUE LEARNING" : "ONE TERM TO START"}
                </p>
                <h2 className="mt-3 text-xl font-semibold">{isLearning ? "继续学习这张术语卡" : "从这张术语卡开始"}</h2>
                <Link href={continueTerm.href} className="mt-6 block rounded-2xl border p-6 transition-transform hover:-translate-y-0.5" style={{ borderColor: "var(--color-border)", background: "#fff", boxShadow: "0 10px 30px rgba(31, 41, 55, 0.06)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>{continueTerm.meta}</span>
                    <span className="text-lg" style={{ color: "var(--color-text-muted)" }}>↗</span>
                  </div>
                  <p className="mt-8 text-4xl font-semibold tracking-tight">{continueTerm.code}</p>
                  <p className="mt-2 text-xl font-medium">{continueTerm.name}</p>
                  <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>{continueTerm.english}</p>
                  <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
                    <p className="text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>{continueTerm.summary}</p>
                  </div>
                  <p className="mt-5 text-sm font-medium" style={{ color: "var(--color-accent)" }}>查看术语详情 →</p>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
