"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface GoogleAnalyticsProps {
  measurementId?: string;
}

const CONSENT_KEY = "tradelearn-analytics-consent";
type AnalyticsConsent = "granted" | "denied";

function PageViewTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    let attempts = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const sendPageView = () => {
      if (window.gtag) {
        window.gtag("config", measurementId, { page_path: pagePath });
        return;
      }

      if (attempts < 20) {
        attempts += 1;
        retryTimer = setTimeout(sendPageView, 100);
      }
    };

    sendPageView();
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [measurementId, pathname, searchParams]);

  return null;
}

/**
 * GA4 is opt-in by both configuration and user consent. Without
 * NEXT_PUBLIC_GA_ID or explicit consent, no analytics script is loaded.
 */
export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const [consent, setConsent] = useState<AnalyticsConsent | null | "pending">("pending");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      if (stored === "granted" || stored === "denied") setConsent(stored);
      else setConsent(null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const chooseConsent = (value: AnalyticsConsent) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  if (!measurementId) return null;

  return (
    <>
      {consent === "granted" && <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          strategy="afterInteractive"
        />
        <Script id="tradelearn-google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${measurementId}', { send_page_view: false });`}
        </Script>
        <Suspense fallback={null}>
          <PageViewTracker measurementId={measurementId} />
        </Suspense>
      </>}
      {consent === null && <aside className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl rounded-xl border p-4 shadow-lg" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }} role="dialog" aria-label="统计设置">
        <p className="text-sm font-medium">帮助我们改进 TradeLearn</p>
        <p className="mt-1 text-xs leading-5" style={{ color: "var(--color-text-secondary)" }}>我们希望使用 Google Analytics 了解页面访问和功能使用情况。统计为可选项，不影响学习进度；详情请查看 <a href="/privacy" className="underline" style={{ color: "var(--color-accent)" }}>隐私政策</a>。</p>
        <div className="mt-3 flex flex-wrap justify-end gap-2"><button type="button" onClick={() => chooseConsent("denied")} className="rounded-md border px-3 py-1.5 text-xs" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>暂不启用</button><button type="button" onClick={() => chooseConsent("granted")} className="rounded-md px-3 py-1.5 text-xs font-medium text-white" style={{ background: "var(--color-accent)" }}>同意统计</button></div>
      </aside>}
    </>
  );
}
