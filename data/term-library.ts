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
