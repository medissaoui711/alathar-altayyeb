
import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import Script from "next/script";
import React from "react";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cairo",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "الأثر الطيب | الفقيه الافتراضي",
  description: "تطبيق مساعد فقهي افتراضي يقدم إجابات استرشادية مع المراجع بأسلوب إسلامي وتصميم عصري",
  icons: {
    icon: 'data:image/svg+xml,%3Csvg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M50 10L85 25V75L50 90L15 75V25L50 10Z" stroke="%2310b981" stroke-width="8"/%3E%3Cpath d="M35 30C35 30 45 20 65 35C85 50 50 80 50 80C50 80 15 50 35 35" stroke="%2310b981" stroke-width="10" stroke-linecap="round"/%3E%3C/svg%3E',
    apple: 'data:image/svg+xml,%3Csvg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M50 10L85 25V75L50 90L15 75V25L50 10Z" stroke="%2310b981" stroke-width="8"/%3E%3Cpath d="M35 30C35 30 45 20 65 35C85 50 50 80 50 80C50 80 15 50 35 35" stroke="%2310b981" stroke-width="10" stroke-linecap="round"/%3E%3C/svg%3E',
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
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:;" />
        <meta name="format-detection" content="telephone=no" />
        <Script id="tailwind-config" strategy="beforeInteractive">
          {`
            tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  fontFamily: {
                    sans: ['var(--font-cairo)', 'sans-serif'],
                  },
                  colors: {
                    luminous: {
                      400: '#34d399',
                      500: '#10b981',
                      600: '#059669',
                      glow: '#4ade80',
                    }
                  },
                  boxShadow: {
                    'neon': '0 0 10px rgba(52, 211, 153, 0.5)',
                    'neon-strong': '0 0 20px rgba(52, 211, 153, 0.7)',
                  }
                }
              }
            }
          `}
        </Script>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body 
        className={`islamic-pattern bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 h-full overflow-hidden font-sans antialiased`}
        style={{ overscrollBehavior: 'none' }}
      >
        {children}
      </body>
    </html>
  );
}
