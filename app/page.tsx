'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import React from 'react';

// Dynamic import for the main App logic to reduce initial bundle size
const App = dynamic(() => import('../App'), {
  ssr: false, // Disable SSR for the main app logic as it relies on browser APIs
  loading: () => (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-950 text-emerald-600">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full animate-pulse"></div>
        <Loader2 className="w-12 h-12 animate-spin mb-4 relative z-10" />
      </div>
      <p className="text-sm font-medium animate-pulse text-slate-600 dark:text-slate-300">جارٍ تحميل الأثر الطيب...</p>
    </div>
  ),
});

export default function Home() {
  return <App />;
}