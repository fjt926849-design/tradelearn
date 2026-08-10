"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "首页" },
  { href: "/knowledge-map", label: "知识地图" },
  { href: "/terms", label: "术语" },
  { href: "/settlement", label: "结算" },
  { href: "/transport", label: "运输" },
  { href: "/insurance", label: "保险" },
  { href: "/documents", label: "单据" },
  { href: "/customs", label: "报关" },
  { href: "/contract", label: "合同" },
  { href: "/practice", label: "实战" },
  { href: "/flashcards", label: "闪卡" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="max-w-4xl mx-auto px-5 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-base tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          贸学 TradeLearn
        </Link>

        <nav className="flex items-center gap-1">
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
                    ? "var(--color-text)"
                    : "var(--color-text-muted)",
                  background: active ? "var(--color-border-light)" : "transparent",
                  fontWeight: active ? 500 : 400,
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
