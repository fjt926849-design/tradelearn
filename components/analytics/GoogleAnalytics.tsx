"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface GoogleAnalyticsProps {
  measurementId?: string;
}

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
 * GA4 is opt-in by configuration: without NEXT_PUBLIC_GA_ID this renders no
 * script, which keeps local development and unconfigured previews private.
 */
export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  if (!measurementId) return null;

  return (
    <>
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
    </>
  );
}
