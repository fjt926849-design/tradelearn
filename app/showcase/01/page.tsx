"use client";

import { useEffect, useState } from "react";
import { termLibraryCards, termLibraryChapters } from "@/data/term-library";
import { useTermCardProgress } from "@/hooks/useTermCardProgress";
import ShowcaseCanvas, { showcaseStyles as styles } from "@/components/showcase/ShowcaseCanvas";

export default function ShowcaseProductPage() {
  const { records } = useTermCardProgress();
  const [hydrated, setHydrated] = useState(false);
  const startTerm = termLibraryCards[0];

  useEffect(() => {
    const timer = window.setTimeout(() => setHydrated(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const startedCount = hydrated ? Object.keys(records).length : 0;
  const masteredCount = hydrated ? Object.values(records).filter((record) => record.status === "mastered").length : 0;
  const progress = Math.round((masteredCount / termLibraryCards.length) * 100) || 0;

  return (
    <ShowcaseCanvas>
      <div className={styles.posterInner}>
        <header className={styles.masthead}>
          <span className={styles.mastheadLabel}>TRADELEARN / 01</span>
          <span className={styles.mastheadMeta}><strong>PRODUCT</strong><span>SHOWCASE</span></span>
        </header>

        <section className={styles.intro}>
          <p className={styles.eyebrow}>TERM LIBRARY</p>
          <h1 className={styles.title}>把复杂的国际贸易，{`\n`}先从一个术语弄明白。</h1>
          <p className={styles.lead}>用清晰的中文解释、英文名称和业务场景，{`\n`}逐步建立国际贸易知识基础。</p>
        </section>

        <div className={styles.ruleLabel}>PRODUCT INTERFACE / HOME</div>
        <section className={styles.productUi} aria-label="TradeLearn 首页产品界面">
          <div className={styles.uiHeader}>
            <span className={styles.uiBrand}>贸学 TradeLearn</span>
            <div className={styles.uiNav}><span className={styles.uiNavActive}>首页</span><span>术语卡片</span><span>闪卡复习</span><span>我的</span></div>
          </div>
          <div className={styles.uiHero}>
            <div>
              <p className={styles.uiKicker}>TRADELEARN / TERM LIBRARY</p>
              <h2>把复杂的国际贸易，先从一个术语弄明白。</h2>
              <p>用清晰的中文解释、英文名称和业务场景，逐张建立你的外贸术语基础。</p>
            </div>
            <div className={styles.uiActions}><span className={styles.darkButton}>浏览术语篇章　→</span><span className={styles.lightButton}>开始复习</span></div>
          </div>
          <div className={styles.uiStats}>
            <div className={styles.uiStat}><strong>{termLibraryCards.length}</strong><span>张术语卡片</span></div>
            <div className={styles.uiStat}><strong>{startedCount}</strong><span>已开始学习</span></div>
            <div className={`${styles.uiStat} ${styles.uiProgress}`}><div className={styles.progressTrack}><span style={{ width: `${progress}%` }} /></div><span>{progress}% 已掌握</span></div>
          </div>
          <div className={styles.uiContinue}>
            <div className={styles.uiSectionHead}><div><p>ONE TERM TO START</p><h3>从这一张开始</h3></div><span className={styles.uiIndex}>01 / 02</span></div>
            <div className={styles.termCard}>
              <div className={styles.termCardTop}><span>{startTerm.meta}</span><span>↗</span></div>
              <div className={styles.termCode}>{startTerm.code}</div>
              <div className={styles.termName}>{startTerm.name}</div>
              <div className={styles.termEnglish}>{startTerm.english}</div>
              <p className={styles.termSummary}>{startTerm.summary}</p>
              <span className={styles.termLink}>查看术语详情　→</span>
            </div>
          </div>
          <div className={styles.routeGrid}>
            {["浏览篇章", "打开卡片", "查看详情", "开始复习"].map((step, index) => <div className={styles.routeItem} key={step}><span>0{index + 1}</span><strong>{step}</strong></div>)}
          </div>
        </section>

        <footer className={styles.foot}><span>TRADELEARN / PRODUCT SHOWCASE</span><span>{termLibraryChapters.length} CHAPTERS · {termLibraryCards.length} TERMS</span></footer>
      </div>
    </ShowcaseCanvas>
  );
}
