"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "首页" },
  { href: "/knowledge-map", label: "学习" },
  { href: "/progress", label: "我的" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}
    >
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-base tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          贸学 TradeLearn
        </Link>

        <nav aria-label="主导航" className="flex items-center gap-1 max-w-[68vw] overflow-x-auto whitespace-nowrap scrollbar-none">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 text-sm rounded transition-colors"
                style={{
                  color: active
                    ? "var(--color-accent)"
                    : "var(--color-text-muted)",
                  background: active ? "var(--color-accent-soft)" : "transparent",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
