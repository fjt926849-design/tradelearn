import Link from "next/link";
import { MODULE_CHAPTERS, MODULE_LABELS, MODULE_ROUTES } from "@/lib/types";
import type { ModuleId } from "@/lib/types";
import { getModuleNav } from "@/lib/navigation";

interface ModuleIndexProps {
  moduleId: ModuleId;
  currentSlug: string;
}

/** 详情页左侧索引：列出当前模块全部知识点，高亮当前项 */
export default function ModuleIndex({ moduleId, currentSlug }: ModuleIndexProps) {
  const items = getModuleNav(moduleId);
  const chapter = MODULE_CHAPTERS[moduleId];
  const label = MODULE_LABELS[moduleId];
  const route = MODULE_ROUTES[moduleId];

  return (
    <aside className="module-index">
      <div className="module-index-inner">
        <Link href={route} className="module-index-head">
          <span className="module-index-head-no">{chapter.no}</span>
          <span className="module-index-head-body">
            <span className="module-index-head-title">{label}</span>
            <span className="module-index-head-count">{items.length} 个知识点</span>
          </span>
        </Link>

        <nav className="module-index-list" aria-label={`${label} 知识点索引`}>
          {items.map((it, i) => {
            const active = it.slug === currentSlug;
            return (
              <Link
                key={it.slug}
                href={`${route}/${it.slug}`}
                className={`module-index-item${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="module-index-item-no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="module-index-item-body">
                  <span className="module-index-item-label">{it.label}</span>
                  <span className="module-index-item-sub">{it.sub}</span>
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
