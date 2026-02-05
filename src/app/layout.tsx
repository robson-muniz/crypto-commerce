import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoCommerce - Premium Digital Marketplace",
  description: "Secure, instant, and premium digital asset trading.",
};

import NextTopLoader from "nextjs-toploader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={outfit.className}>
        <NextTopLoader color="#7c3aed" showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
