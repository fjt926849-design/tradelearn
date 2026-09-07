"use client";

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
  const steps = [
    ["01", "浏览篇章", "先建立术语地图"],
    ["02", "打开卡片", "认识缩写和中文含义"],
    ["03", "查看详情", "把术语放进业务场景"],
    ["04", "开始复习", "用闪卡巩固记忆"],
  ];

  return (
    <div className="home-shell">
      <Header />
      <main className="home-main">
        <div className="home-container">
          <section className="home-intro">
            <div>
              <p className="eyebrow">TRADELEARN / TERM LIBRARY</p>
              <h1>把复杂的国际贸易，先从一个术语弄明白。</h1>
              <p className="home-lede">用清晰的中文解释、英文名称和业务场景，逐张建立你的外贸术语基础。</p>
            </div>
            <div className="home-intro-actions">
              <Link href="/terms-preview" className="button button-primary">浏览术语篇章 <span aria-hidden="true">→</span></Link>
              <Link href="/flashcards" className="button button-secondary">开始复习</Link>
            </div>
          </section>

          <section className="home-progress" aria-label="学习进度">
            <div><span className="progress-value">{termLibraryCards.length}</span><span>张术语卡片</span></div>
            <div><span className="progress-value">{records ? Object.keys(records).length : 0}</span><span>已开始学习</span></div>
            <div className="progress-track-wrap"><div className="progress-track"><span style={{ width: `${Math.min(100, Math.max(0, (Object.values(records).filter((r) => r.status === "mastered").length / termLibraryCards.length) * 100))}%` }} /></div><span>{Math.round((Object.values(records).filter((r) => r.status === "mastered").length / termLibraryCards.length) * 100) || 0}% 已掌握</span></div>
          </section>

          <section className="home-workspace">
            <div className="home-section-heading"><div><p className="eyebrow">{isLearning ? "CONTINUE LEARNING" : "ONE TERM TO START"}</p><h2>{isLearning ? "继续学习" : "从这一张开始"}</h2></div><span className="section-index">01 / 02</span></div>
            <Link href={continueTerm.href} className="term-feature">
              <div className="term-feature-top"><span>{continueTerm.meta}</span><span aria-hidden="true">↗</span></div>
              <div className="term-feature-code">{continueTerm.code}</div>
              <div className="term-feature-name">{continueTerm.name}</div>
              <div className="term-feature-en">{continueTerm.english}</div>
              <p>{continueTerm.summary}</p>
              <span className="term-feature-link">查看术语详情 <span aria-hidden="true">→</span></span>
            </Link>
          </section>

          <section className="home-steps">
            <div className="home-section-heading"><div><p className="eyebrow">A SIMPLE ROUTE</p><h2>四步，建立你的术语基础</h2></div><span className="section-index">02 / 02</span></div>
            <div className="step-grid">
              {steps.map(([number, title, detail]) => <div className="step-item" key={number}><span className="step-number">{number}</span><div><h3>{title}</h3><p>{detail}</p></div></div>)}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
