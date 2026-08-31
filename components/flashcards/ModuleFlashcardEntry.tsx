import Link from "next/link";

export default function ModuleFlashcardEntry({ href }: { href: string }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3" style={{ borderColor: "var(--color-accent)", background: "var(--color-accent-soft)" }}>
      <div>
        <p className="text-xs font-medium" style={{ color: "var(--color-accent)" }}>复习入口</p>
        <p className="mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>用闪卡巩固本模块知识点</p>
      </div>
      <Link href={href} className="inline-flex items-center rounded-md px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90" style={{ background: "var(--color-accent)" }}>
        闪卡复习 <span aria-hidden="true" className="ml-1">→</span>
      </Link>
    </div>
  );
}
