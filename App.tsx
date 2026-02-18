
import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { 
  Menu, 
  Loader2,
  AlertTriangle
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import ReferencePopup from './components/ReferencePopup';
import Logo from './components/Logo';
import { Page, ReferenceData } from './types';
import { FaqihProvider, useFaqih } from './context/FaqihContext';

// --- Lazy Loaded Components ---
const FaqihChat = dynamic(() => import('./components/FaqihChat'), {
  loading: () => <LoadingScreen />,
});

const HistoryPage = dynamic(() => import('./components/HistoryPage'), {
  loading: () => <LoadingScreen />,
});

const FaqihSettings = dynamic(() => import('./components/FaqihSettings'), {
  loading: () => <LoadingScreen />,
});

const HumanReviewPage = dynamic(() => import('./components/HumanReviewPage'), {
  loading: () => <LoadingScreen />,
});

const LibraryPage = dynamic(() => import('./components/LibraryPage'), {
  loading: () => <LoadingScreen />,
});

// Named exports lazy loading
const PrivacyPage = dynamic(() => import('./components/StaticPages').then(mod => mod.PrivacyPage), {
  loading: () => <LoadingScreen />,
});
const DisclaimerPage = dynamic(() => import('./components/StaticPages').then(mod => mod.DisclaimerPage), {
  loading: () => <LoadingScreen />,
});
const ContactPage = dynamic(() => import('./components/StaticPages').then(mod => mod.ContactPage), {
  loading: () => <LoadingScreen />,
});

// --- Loading Component ---
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-full w-full min-h-[300px] animate-in fade-in duration-200">
    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
    <p className="text-xs text-slate-400">جارٍ التحميل...</p>
  </div>
);

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Chat);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [referenceData, setReferenceData] = useState<ReferenceData | null>(null);
  
  const { appSettings, updateAppSettings } = useFaqih();

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
    <div className={`flex flex-col h-screen overflow-hidden text-slate-900 dark:text-slate-100 ${fontSizeClass}`}>
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-900/50 shadow-[0_1px_10px_rgba(16,185,129,0.05)] h-16 flex items-center justify-between px-4 sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 transition-colors hover:shadow-neon"
          >
            <Menu size={24} />
          </button>
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

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        darkMode={appSettings.darkMode}
        toggleDarkMode={() => updateAppSettings({ darkMode: !appSettings.darkMode })}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <ReferencePopup 
        isOpen={!!referenceData}
        onClose={() => setReferenceData(null)}
        data={referenceData}
      />
    </div>
  );
};

export default function App() {
  return (
    <FaqihProvider>
      <AppContent />
    </FaqihProvider>
  );
}
