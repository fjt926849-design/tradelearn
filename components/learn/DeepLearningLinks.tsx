import Link from "next/link";
import { getDeepLearningTargets } from "@/data/content-registry";

export default function DeepLearningLinks({ termId }: { termId: string }) {
  const targets = getDeepLearningTargets(termId);

  return (
    <section className="rounded-2xl border bg-white/60 p-5 sm:p-6" style={{ borderColor: "#dedede" }}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "#888" }}>DEEP LEARNING</p>
      <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">继续深入学习</h2>
      {targets.length > 0 ? (
        <>
          <p className="mt-2 text-sm leading-6" style={{ color: "#666" }}>这张术语卡与 73 个系统知识点中的以下内容相关。两层内容分别统计进度，不重复计数。</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {targets.map((item) => (
              <Link
                key={`${item.moduleId}-${item.conceptId ?? "module"}`}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition hover:bg-[#f3f3f3]"
                style={{ borderColor: "#d8d8d8", color: "#444" }}
              >
                {item.label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-2 text-sm leading-6" style={{ color: "#666" }}>这是一张新增的扩展术语卡，目前还没有对应的旧模块知识点；它会保留独立进度，不会被错误合并。</p>
      )}
      <Link href="/learn" className="mt-4 inline-flex text-xs font-medium hover:underline" style={{ color: "var(--color-accent)" }}>查看全部 7 个深入学习模块 →</Link>
    </section>
  );
}
