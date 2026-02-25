import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Weey.NET - Fotoğrafçı Yönetim Paneli",
  description: "Düğün ve dış çekim yönetim sistemi",
};

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans bg-[#F2F4F7] text-[#2F2F3B]`} suppressHydrationWarning>
        <NextTopLoader
          color="#5d2b72"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #5d2b72,0 0 5px #5d2b72"
        />
        <Providers>
          <AnalyticsTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
