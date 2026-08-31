"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  fallbackRoute: string;
  label?: string;
}

/** A predictable escape hatch for detail pages, including direct links. */
export default function BackButton({ fallbackRoute, label = "返回列表" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    const sameSiteReferrer = document.referrer.startsWith(window.location.origin);
    if (sameSiteReferrer) router.back();
    else router.push(fallbackRoute);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-1.5 text-sm rounded-md border px-3 py-2 hover:bg-gray-50 transition-colors"
      style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
      aria-label={label}
    >
      <span aria-hidden="true">←</span>
      {label}
    </button>
  );
}
