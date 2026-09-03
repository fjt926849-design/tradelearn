"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import { termLibraryCards } from "@/data/term-library";
import { useTermCardProgress } from "@/hooks/useTermCardProgress";

export default function HomePage() {
  const { getStatus, records } = useTermCardProgress();
  const masteredTerms = termLibraryCards.filter((card) => getStatus(card.id) === "mastered").length;
  const termProgress = termLibraryCards.length ? Math.round((masteredTerms / termLibraryCards.length) * 100) : 0;
  const startedTerms = termLibraryCards
    .map((card) => ({ card, status: getStatus(card.id), lastOpenedAt: records[card.id]?.lastOpenedAt ?? 0 }))
    .filter(({ status }) => status !== "new")
    .sort((a, b) => b.lastOpenedAt - a.lastOpenedAt)
    .slice(0, 4);

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero
          totalTerms={termLibraryCards.length}
          masteredTerms={masteredTerms}
          termProgress={termProgress}
        />

        <div className="mx-auto max-w-6xl space-y-10 px-5 py-10">
          <section>
            <div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-semibold">术语卡片</h2><p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>先认识缩写、中文含义和业务场景。</p></div><Link href="/terms-preview" className="text-sm hover:underline" style={{ color: "var(--color-accent)" }}>浏览全部术语 →</Link></div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">{termLibraryCards.slice(0, 3).map((term) => <Link key={term.id} href={term.href} className="rounded-xl border p-5 transition-colors hover:bg-[var(--color-bg-soft)]" style={{ borderColor: "var(--color-border)" }}><p className="text-3xl font-semibold tracking-tight">{term.code}</p><p className="mt-2 text-base font-medium">{term.name}</p><p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>{term.english}</p><p className="mt-4 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>{term.summary}</p></Link>)}</div>
          </section>

          {startedTerms.length > 0 && <section className="rounded-xl border p-5" style={{ borderColor: "var(--color-border)" }}><div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-semibold">你的术语学习</h2><p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>继续查看已经开始的术语卡片。</p></div><Link href="/progress" className="text-xs hover:underline" style={{ color: "var(--color-accent)" }}>查看进度 →</Link></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{startedTerms.map(({ card, status }) => <Link key={card.id} href={card.href} className="flex items-center justify-between rounded-lg border px-3 py-3 transition-colors hover:bg-[var(--color-bg-soft)]" style={{ borderColor: "var(--color-border-light)" }}><span><b>{card.code}</b><span className="ml-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>{card.name}</span></span><span className="rounded-full border px-2 py-1 text-[11px] font-medium" style={{ borderColor: status === "mastered" ? "#edb7b7" : "#b9ddc8", color: status === "mastered" ? "#b33a3a" : "#2f7d55", background: status === "mastered" ? "#fff2f2" : "#effaf3" }}>{status === "mastered" ? "已掌握" : "学习中"}</span></Link>)}</div></section>}

        </div>
      </main>
      <Footer />
    </>
  );
}
