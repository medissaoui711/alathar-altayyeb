'use client';

import React, { useState, Suspense, lazy, useEffect } from 'react';
import { 
  Menu, 
  Loader2,
  AlertTriangle
} from 'lucide-react';
import Sidebar from './Sidebar';
import ReferencePopup from './ReferencePopup';
import Logo from './Logo';
import { Page, ReferenceData } from '../types';
import { FaqihProvider, useFaqih } from '../context/FaqihContext';

// --- Loading Component ---
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-full w-full min-h-[300px] animate-in fade-in duration-200">
    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
    <p className="text-xs text-slate-400">جارٍ التحميل...</p>
  </div>
);

// --- Lazy Loaded Components ---
const FaqihChat = lazy(() => import('./FaqihChat'));
const HistoryPage = lazy(() => import('./HistoryPage'));
const FaqihSettings = lazy(() => import('./FaqihSettings'));
const HumanReviewPage = lazy(() => import('./HumanReviewPage'));
const LibraryPage = lazy(() => import('./LibraryPage'));

// Named exports lazy loading
const PrivacyPage = lazy(() => import('./StaticPages').then(mod => ({ default: mod.PrivacyPage })));
const DisclaimerPage = lazy(() => import('./StaticPages').then(mod => ({ default: mod.DisclaimerPage })));
const ContactPage = lazy(() => import('./StaticPages').then(mod => ({ default: mod.ContactPage })));

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Chat);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [referenceData, setReferenceData] = useState<ReferenceData | null>(null);
  
  const { appSettings, updateAppSettings } = useFaqih();

  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case Page.History:
        return <HistoryPage onNavigate={setCurrentPage} />;
      case Page.Settings:
        return (
          <FaqihSettings 
            settings={appSettings} 
            onUpdateSettings={updateAppSettings}
            onNavigateBack={() => setCurrentPage(Page.Chat)}
          />
        );
      case Page.HumanReview:
        return <HumanReviewPage />;
      case Page.Library:
        return <LibraryPage onNavigate={setCurrentPage} />;
      case Page.Privacy:
        return <PrivacyPage onNavigate={setCurrentPage} />;
      case Page.Disclaimer:
        return <DisclaimerPage onNavigate={setCurrentPage} />;
      case Page.Contact:
        return <ContactPage onNavigate={setCurrentPage} />;
      case Page.Chat:
      default:
        return (
          <FaqihChat 
            onOpenReference={(ref) => setReferenceData(ref)}
            onNavigate={setCurrentPage}
          />
        );
    }
  };

  const fontSizeClass = 
    appSettings.fontSize === 'small' ? 'text-sm' : 
    appSettings.fontSize === 'large' ? 'text-lg' : 
    'text-base';

  return (
    <div className={`flex h-screen overflow-hidden text-slate-900 dark:text-slate-100 ${fontSizeClass}`}>
      <Sidebar 
        isExpanded={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        darkMode={appSettings.darkMode}
        toggleDarkMode={() => updateAppSettings({ darkMode: !appSettings.darkMode })}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden transition-all duration-500">
        <header className="bg-white/80 dark:bg-[#030712]/80 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-900/20 shadow-[0_1px_10px_rgba(16,185,129,0.02)] h-16 flex items-center justify-between px-4 sticky top-0 z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentPage(Page.Chat)}>
              <div className="relative transition-transform duration-300 group-hover:scale-105">
                <div className="absolute inset-0 bg-emerald-400/20 dark:bg-emerald-400/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Logo className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-slate-800 dark:text-slate-100 tracking-wide flex items-center gap-1">
                  الأثر <span className="text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">الطيب</span>
                </h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto relative scroll-smooth">
          <Suspense fallback={<LoadingScreen />}>
            {renderContent()}
          </Suspense>
        </main>
      </div>

      <ReferencePopup 
        isOpen={!!referenceData}
        onClose={() => setReferenceData(null)}
        data={referenceData}
      />
    </div>
  );
};

export default function MainApp() {
  return <AppContent />;
}
