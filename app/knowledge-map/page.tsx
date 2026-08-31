import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CurriculumBrowser from "@/components/curriculum/CurriculumBrowser";
import { curriculumParts } from "@/data/curriculum";

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
      <main className="flex-1 max-w-6xl mx-auto w-full px-5 py-10 space-y-8">
        <div>
          <h1 className="sr-only">课程学习中心</h1>
        </div>

        <CurriculumBrowser parts={curriculumParts} />

        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          术语分组仍可在贸易术语模块查看：{categoryGroups.map((g) => `${g.key}组 ${g.terms}个`).join(" · ")}。
        </p>
      </main>
      <Footer />
    </>
  );
}
