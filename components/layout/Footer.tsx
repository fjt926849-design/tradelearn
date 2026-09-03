import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="mt-auto border-t py-6 text-center"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
        <span>贸学 TradeLearn</span>
        <span aria-hidden="true">·</span>
        <Link href="/privacy" className="hover:underline" style={{ color: "var(--color-text-secondary)" }}>隐私政策</Link>
      </div>
    </footer>
  );
}
