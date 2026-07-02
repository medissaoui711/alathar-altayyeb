
import type { Metadata, Viewport } from "next";
import { Cairo, Amiri } from "next/font/google";
import React from "react";
import "./globals.css";
import { FaqihProvider } from "../context/FaqihContext";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cairo",
  preload: true,
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "الأثر الطيب | الفقيه الافتراضي",
  description: "تطبيق مساعد فقهي افتراضي يقدم إجابات استرشادية مع المراجع بأسلوب إسلامي وتصميم عصري",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png"
  },
  openGraph: {
    title: "الأثر الطيب | الفقيه الافتراضي",
    description: "تطبيق مساعد فقهي افتراضي يقدم إجابات استرشادية مع المراجع",
    url: "https://your-app-domain.com",
    siteName: "الأثر الطيب",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${amiri.variable} h-full`}>
      <body 
        className={`islamic-pattern bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 h-full overflow-hidden font-sans antialiased`}
        style={{ overscrollBehavior: 'none' }}
      >
        <FaqihProvider>
          {children}
        </FaqihProvider>
      </body>
    </html>
  );
}
