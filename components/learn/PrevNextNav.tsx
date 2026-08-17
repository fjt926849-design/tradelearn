import Link from "next/link";

export interface PrevNextLink {
  href: string;
  label: string;
  sub: string;
}

interface PrevNextNavProps {
  prev: PrevNextLink | null;
  next: PrevNextLink | null;
}

/** 详情页底部 · 上下篇导航（上一个 / 下一个） */
export default function PrevNextNav({ prev, next }: PrevNextNavProps) {
  return (
    <nav className="prevnext" aria-label="上下篇导航">
      {prev ? (
        <Link href={prev.href} className="prevnext-link prevnext-link--prev">
          <span className="prevnext-dir">← 上一个</span>
          <span className="prevnext-label">{prev.label}</span>
          <span className="prevnext-sub">{prev.sub}</span>
        </Link>
      ) : (
        <span className="prevnext-link prevnext-link--disabled">
          <span className="prevnext-dir">← 上一个</span>
          <span className="prevnext-label">已是第一篇</span>
        </span>
      )}

      {next ? (
        <Link href={next.href} className="prevnext-link prevnext-link--next">
          <span className="prevnext-dir">下一个 →</span>
          <span className="prevnext-label">{next.label}</span>
          <span className="prevnext-sub">{next.sub}</span>
        </Link>
      ) : (
        <span className="prevnext-link prevnext-link--disabled">
          <span className="prevnext-dir">下一个 →</span>
          <span className="prevnext-label">已是最后一篇</span>
        </span>
      )}
    </nav>
  );
}
