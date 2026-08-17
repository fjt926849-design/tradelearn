import { tradeTerms } from "@/data/trade-terms";
import { settlementConcepts } from "@/data/settlement-concepts";
import { transportConcepts } from "@/data/transport-concepts";
import { insuranceConcepts } from "@/data/insurance-concepts";
import { documentsConcepts } from "@/data/documents-concepts";
import { customsConcepts } from "@/data/customs-concepts";
import { contractConcepts } from "@/data/contract-concepts";
import { MODULE_ROUTES } from "@/lib/types";
import type { ModuleId } from "@/lib/types";

/** 模块内单个知识点的导航项（用于左侧索引 + 上下篇） */
export interface ConceptNavItem {
  slug: string; // URL 段（terms 用 code.toLowerCase()，概念用 id）
  label: string; // 主标识（术语 = 代码 EXW，概念 = 中文标题）
  sub: string; // 副标识（术语 = 中文名，概念 = 英文标题）
}

/** 上下篇导航项 */
export interface PrevNextEntry {
  href: string;
  label: string;
  sub: string;
}

/** 获取某个模块的有序知识点导航列表 */
export function getModuleNav(moduleId: ModuleId): ConceptNavItem[] {
  switch (moduleId) {
    case "incoterms":
      return tradeTerms.map((t) => ({
        slug: t.code.toLowerCase(),
        label: t.code,
        sub: t.chineseName,
      }));
    case "settlement":
      return settlementConcepts.map((c) => ({
        slug: c.id,
        label: c.title,
        sub: c.englishTitle,
      }));
    case "transport":
      return transportConcepts.map((c) => ({
        slug: c.id,
        label: c.title,
        sub: c.englishTitle,
      }));
    case "insurance":
      return insuranceConcepts.map((c) => ({
        slug: c.id,
        label: c.title,
        sub: c.englishTitle,
      }));
    case "documents":
      return documentsConcepts.map((c) => ({
        slug: c.id,
        label: c.title,
        sub: c.englishTitle,
      }));
    case "customs":
      return customsConcepts.map((c) => ({
        slug: c.id,
        label: c.title,
        sub: c.englishTitle,
      }));
    case "contract":
      return contractConcepts.map((c) => ({
        slug: c.id,
        label: c.title,
        sub: c.englishTitle,
      }));
  }
}

/** 获取某个知识点在其模块内的上一个 / 下一个 */
export function getPrevNext(
  moduleId: ModuleId,
  currentSlug: string
): { prev: PrevNextEntry | null; next: PrevNextEntry | null } {
  const items = getModuleNav(moduleId);
  const route = MODULE_ROUTES[moduleId];
  const i = items.findIndex((n) => n.slug === currentSlug);
  if (i < 0) return { prev: null, next: null };

  const toEntry = (n: ConceptNavItem): PrevNextEntry => ({
    href: `${route}/${n.slug}`,
    label: n.label,
    sub: n.sub,
  });

  return {
    prev: i > 0 ? toEntry(items[i - 1]) : null,
    next: i < items.length - 1 ? toEntry(items[i + 1]) : null,
  };
}
