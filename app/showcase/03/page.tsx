"use client";

import { termLibraryChapters, termLibraryCards } from "@/data/term-library";
import ShowcaseCanvas, { showcaseStyles as styles } from "@/components/showcase/ShowcaseCanvas";

const chapterEnglish: Record<string, string> = {
  贸易术语: "TRADE TERMS",
  合同: "CONTRACTS",
  运输: "TRANSPORT",
  保险: "INSURANCE",
  价格: "PRICING",
  结算: "SETTLEMENT",
  谈判: "NEGOTIATION",
  贸易方式: "TRADE METHODS",
  跨境电商: "CROSS-BORDER ECOMMERCE",
};

export default function ShowcaseSystemPage() {
  return (
    <ShowcaseCanvas>
      <div className={styles.posterInner}>
        <header className={styles.masthead}>
          <span className={styles.mastheadLabel}>LEARNING SYSTEM / 03</span>
          <span className={styles.mastheadMeta}><strong>KNOWLEDGE INDEX</strong><span>SHOWCASE</span></span>
        </header>

        <section className={`${styles.intro} ${styles.systemIntro}`}>
          <p className={styles.eyebrow}>LEARNING SYSTEM</p>
          <h1 className={`${styles.title} ${styles.systemTitle}`}>从一个术语，{`\n`}到一套国际贸易知识框架。</h1>
          <p className={`${styles.lead} ${styles.systemLead}`}>TradeLearn 将真实业务中的术语按篇章整理，让每一次学习都能回到一张清晰、可持续扩展的知识索引。</p>
        </section>

        <div className={styles.ruleLabel}>KNOWLEDGE MAP / EDITORIAL INDEX</div>
        <section className={styles.systemPanel} aria-label="TradeLearn 知识模块索引">
          <div className={styles.systemPanelHead}><div><p>TRADELEARN / TERM LIBRARY</p><h2>国际贸易知识模块</h2></div><div className={styles.systemStats}><span><strong>{termLibraryChapters.length}</strong> 篇章</span><span><strong>{termLibraryCards.length}</strong> 词语</span></div></div>
          <div className={styles.chapterList}>
            {termLibraryChapters.map((chapter) => <div className={styles.chapterRow} key={chapter.id}><span className={styles.chapterNo}>{chapter.number}</span><div><div className={styles.chapterName}>{chapter.title}</div><div className={styles.chapterSource}>{chapter.description}</div></div><span className={styles.chapterEnglish}>{chapterEnglish[chapter.title] ?? chapter.title}</span><span className={styles.chapterCount}>{chapter.terms.length} TERMS</span></div>)}
          </div>
        </section>

        <div className={styles.systemNote}><span className={styles.systemNoteNo}>NOTE / 01</span><p>不是孤立地记住一个缩写，而是从交货、合同、运输到结算，逐步建立一套可以继续学习的国际贸易结构。</p></div>

        <footer className={styles.foot}><span>TRADELEARN / LEARNING SYSTEM</span><span>{termLibraryChapters.length} CHAPTERS · {termLibraryCards.length} TERMS</span></footer>
      </div>
    </ShowcaseCanvas>
  );
}
