import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { knowledgeMapData } from "@/data/knowledge-map";

const domains = knowledgeMapData.children ?? [];

const categoryGroups = [
  { key: "E", label: "E 组 · 启运", terms: 1 },
  { key: "F", label: "F 组 · 主运费未付", terms: 3 },
  { key: "C", label: "C 组 · 主运费已付", terms: 4 },
  { key: "D", label: "D 组 · 到达", terms: 3 },
];

export default function KnowledgeMapPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-5 py-10 space-y-10">
        <div>
          <h1 className="text-xl font-semibold">知识地图</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            国际贸易实务知识体系。当前开放：贸易术语。
          </p>
        </div>

        {/* Trade terms section — active */}
        <section>
          <div
            className="border rounded-lg p-5"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📋</span>
              <div>
                <h2 className="font-semibold">贸易术语</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  Incoterms 2020 · 已开放
                </p>
              </div>
            </div>

            <p className="text-sm mb-5" style={{ color: "var(--color-text-secondary)" }}>
              全部 11 个术语，按 E/F/C/D 四组分类，涵盖买卖双方责任划分与风险转移。
            </p>

            {/* Category groups */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              {categoryGroups.map((g) => (
                <Link
                  key={g.key}
                  href={`/terms#group-${g.key.toLowerCase()}`}
                  className="border rounded-md p-3 text-center hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <span className="text-sm font-medium">{g.label}</span>
                  <br />
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {g.terms} 个术语
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href="/terms"
              className="inline-flex items-center text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              进入学习 →
            </Link>
          </div>
        </section>

        {/* Coming soon */}
        <section>
          <h2
            className="text-sm font-medium mb-3"
            style={{ color: "var(--color-text-muted)" }}
          >
            即将开放
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px border rounded-lg overflow-hidden"
            style={{ borderColor: "var(--color-border)", background: "var(--color-border)" }}
          >
            {domains
              .filter((d) => d.isPlaceholder)
              .map((d) => (
                <div
                  key={d.id}
                  className="p-4 text-center"
                  style={{ background: "var(--color-bg)" }}
                >
                  <span className="text-xl opacity-25">{d.icon}</span>
                  <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {d.title}
                  </p>
                  <p className="text-[10px] opacity-40" style={{ color: "var(--color-text-muted)" }}>
                    即将开放
                  </p>
                </div>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
