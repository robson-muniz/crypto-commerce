import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoCommerce - Premium Digital Marketplace",
  description: "Secure, instant, and premium digital asset trading.",
  icons: {
    icon: '/icon.png',
  },
};

import NextTopLoader from "nextjs-toploader";

import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

// Replace with your Google Analytics 4 Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-HFGZ7JR724";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
      </head>
      <body className={outfit.className}>
        <NextTopLoader color="#7c3aed" showSpinner={false} />
        {children}
        <Analytics />
        <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
