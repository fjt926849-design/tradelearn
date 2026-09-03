import { tradeTerms } from "@/data/trade-terms";
import { tradeGlossary } from "@/data/trade-glossary";

export interface TermLibraryCard {
  id: string;
  code: string;
  name: string;
  english: string;
  summary: string;
  meta: string;
  href: string;
}

export interface TermLibraryChapter {
  id: string;
  number: string;
  title: string;
  description: string;
  source: string;
  terms: TermLibraryCard[];
}

const glossaryGroupDescription: Record<string, string> = {
  合同: "掌握合同标的、品质、数量、包装和争议条款。",
  运输: "认识运输方式、装运安排和运输单据。",
  保险: "区分险别、风险范围和货损索赔流程。",
  价格: "理解佣金、折扣和价格调整的报价口径。",
  结算: "梳理汇付、托收和信用证中的付款责任。",
  谈判: "分清询盘、发盘、还盘和接受的法律效果。",
  贸易方式: "了解经销、代理和套期保值等业务安排。",
  跨境电商: "认识平台、支付、物流和海外仓的基本概念。",
};

const incotermChapter: TermLibraryChapter = {
  id: "trade-terms",
  number: "01",
  title: "贸易术语",
  description: "理解交货、费用和风险如何在买卖双方之间分配。",
  source: "Incoterms® 2020 · E / F / C / D 组",
  terms: tradeTerms.map((term) => ({
    id: term.code,
    code: term.code,
    name: term.chineseName,
    english: term.fullName,
    summary: term.summary,
    meta: term.transportMode.join(" / "),
    href: `/terms/${term.code.toLowerCase()}`,
  })),
};

const glossaryChapters = (["合同", "运输", "保险", "价格", "结算", "谈判", "贸易方式", "跨境电商"] as const).map((group, index) => {
  const groupTerms = tradeGlossary.filter((entry) => entry.group === group);
  return {
    id: `glossary-${group}`,
    number: String(index + 2).padStart(2, "0"),
    title: group,
    description: glossaryGroupDescription[group],
    source: `${groupTerms.length} 个专业词汇 · 按教材章节整理`,
    terms: groupTerms.map((entry) => ({
      id: entry.id,
      code: entry.term,
      name: entry.term,
      english: entry.english,
      summary: entry.summary,
      meta: entry.chapterLabel,
      href: `/glossary/${entry.id}`,
    })),
  } satisfies TermLibraryChapter;
});

export const termLibraryChapters: TermLibraryChapter[] = [incotermChapter, ...glossaryChapters];
export const termLibraryCards = termLibraryChapters.flatMap((chapter) => chapter.terms);

/**
 * Keep the term center honest as more chapters are added. This runs during the
 * build as well as in development, so a missing card, duplicate id, or broken
 * internal target cannot silently reach the UI.
 */
function assertTermLibraryIntegrity() {
  const ids = new Set<string>();
  const hrefs = new Set<string>();
  const invalid: string[] = [];

  for (const chapter of termLibraryChapters) {
    if (!chapter.id || !chapter.title || chapter.terms.length === 0) {
      invalid.push(`chapter:${chapter.id || "missing-id"}`);
    }
    for (const card of chapter.terms) {
      if (ids.has(card.id)) invalid.push(`duplicate-id:${card.id}`);
      if (hrefs.has(card.href)) invalid.push(`duplicate-href:${card.href}`);
      if (!card.id || !card.code || !card.name || !card.english || !card.summary || !card.meta) {
        invalid.push(`missing-content:${card.id || "missing-id"}`);
      }
      if (!/^\/(terms|glossary)\/[^/]+$/.test(card.href)) {
        invalid.push(`invalid-route:${card.id}:${card.href}`);
      }
      ids.add(card.id);
      hrefs.add(card.href);
    }
  }

  if (termLibraryChapters.length !== 9) invalid.push(`chapter-count:${termLibraryChapters.length}`);
  if (termLibraryCards.length !== 44) invalid.push(`card-count:${termLibraryCards.length}`);
  if (invalid.length > 0) throw new Error(`Term library integrity check failed: ${invalid.join(", ")}`);
}

assertTermLibraryIntegrity();
