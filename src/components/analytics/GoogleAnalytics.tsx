"use client";

import Script from "next/script";

export default function GoogleAnalytics({
  GA_MEASUREMENT_ID,
}: {
  GA_MEASUREMENT_ID?: string;
}) {
  const finalId = GA_MEASUREMENT_ID || "G-HFGZ7JR724";

  if (!finalId) {
    console.warn("Google Analytics: Measurement ID missing");
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${finalId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${finalId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
