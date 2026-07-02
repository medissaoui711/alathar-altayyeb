
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { 
  BookOpen, Moon, Sun, HelpCircle, FileText, Users, Search, Clock, Settings, Home,
  Heart, Briefcase, Droplets, Sunrise, Coins, UtensilsCrossed, MapPin, Shield, Scroll, CreditCard, Mic,
  AlertCircle, Mail, Lock, Library, ChevronRight
} from 'lucide-react';
import { Page } from '../types';
import { useFaqih } from '../context/FaqihContext';
import { getAdaptiveTemplates } from '../data/templates';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle, darkMode, toggleDarkMode, currentPage, onNavigate }) => {
  const { setDraftIntent, appSettings } = useFaqih();
  
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsMenuOpen(false);
      }
    };
    if (isSettingsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsMenuOpen]);

  const adaptiveTemplates = useMemo(() => {
    return getAdaptiveTemplates(appSettings.defaultSchool);
  }, [appSettings.defaultSchool]);

  const handleNavigation = (page: Page) => {
    onNavigate(page);
    // Auto-close on mobile to see the new page
    if (window.innerWidth < 768 && isExpanded) {
      onToggle();
    }
  };

  const handleTemplateAction = (templateId: string) => {
    const template = adaptiveTemplates.find(t => t.id === templateId);
    if (template) {
      setDraftIntent({ 
        type: template.type, 
        text: template.sampleQuestion,
        tag: template.tag
      });
      onNavigate(Page.Chat);
      if (window.innerWidth < 768 && isExpanded) {
        onToggle();
      }
    }
  };

  const getTemplateIcon = (id: string) => {
    switch (id) {
      case 'fiqh-consult': return <BookOpen size={18} />;
      case 'quran-tafsir': return <Search size={18} />;
      case 'hadith-explain': return <FileText size={18} />;
      case 'khutbah-prep': return <Mic size={18} />;
      case 'fiqh-purity': return <Droplets size={18} />;
      case 'fiqh-prayer': return <Sunrise size={18} />;
      case 'fiqh-zakat': return <Coins size={18} />;
      case 'fiqh-fasting': return <UtensilsCrossed size={18} />;
      case 'fiqh-hajj': return <MapPin size={18} />;
      case 'fiqh-family': return <Heart size={18} />;
      case 'fiqh-transactions': return <Briefcase size={18} />;
      case 'fiqh-modern': return <CreditCard size={18} />;
      case 'aqidah-general': return <Shield size={18} />;
      case 'seerah-prophet': return <Scroll size={18} />;
      case 'dream-interpret': return <Moon size={18} />;
      case 'faq-general': return <HelpCircle size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  const menuItems = [
    { icon: <Home size={20} />, label: "الرئيسية", page: Page.Chat },
    { icon: <Library size={20} />, label: "خزانة الأثر (المكتبة)", page: Page.Library },
    { icon: <Clock size={20} />, label: "سجل الجلسات", page: Page.History },
    { icon: <Users size={20} />, label: "المراجعة البشرية", page: Page.HumanReview },
  ];

  const popupItems = [
    { icon: <Settings size={18} />, label: "الإعدادات العامة", page: Page.Settings },
    { icon: <Lock size={18} />, label: "سياسة الخصوصية", page: Page.Privacy },
    { icon: <AlertCircle size={18} />, label: "إخلاء المسؤولية", page: Page.Disclaimer },
    { icon: <Mail size={18} />, label: "اتصل بنا", page: Page.Contact },
  ];

  const renderMenuItem = (item: any, isSecondary = false) => {
    return (
      <button
        key={item.page}
        onClick={() => handleNavigation(item.page)}
        className={`w-full flex items-center group relative ${isExpanded ? 'gap-3 px-4' : 'justify-center px-0'} ${isSecondary ? 'py-2.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50' : 'py-3 rounded-2xl'} transition-all ${
          !isSecondary && currentPage === item.page 
            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-100 dark:border-emerald-500/20' 
            : !isSecondary ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50' : ''
        }`}
      >
        <div className="flex-shrink-0">{item.icon}</div>
        {isExpanded && <span className="flex-1 text-right whitespace-nowrap opacity-100 transition-opacity delay-100">{item.label}</span>}
        {isExpanded && !isSecondary && currentPage === item.page && <ChevronRight size={16} className="rotate-180 flex-shrink-0" />}
        
        {/* Tooltip for collapsed state */}
        {!isExpanded && (
          <div className="absolute right-full mr-4 px-3 py-1.5 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:left-full before:border-4 before:border-transparent before:border-l-slate-800 dark:before:border-l-slate-100">
            {item.label}
          </div>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile overlay - only show when expanded on small screens to click outside and close */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isExpanded ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={onToggle}
      />
      
      <aside className={`relative z-50 bg-white dark:bg-[#030712] transition-all duration-300 ease-in-out border-l border-emerald-100 dark:border-emerald-900/20 shadow-2xl overflow-visible flex flex-col flex-shrink-0 ${isExpanded ? 'w-[280px] absolute md:relative h-full' : 'w-[80px] relative h-full'}`}>
        
        {/* Sidebar Header */}
        <div className={`p-6 border-b border-emerald-50 dark:border-emerald-900/20 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap cursor-pointer group" onClick={onToggle} title="تبديل القائمة">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-neon flex-shrink-0 group-hover:bg-emerald-500 transition-colors">
              <Library size={18} />
            </div>
            {isExpanded && <span className="font-black text-slate-800 dark:text-slate-100 opacity-100 transition-opacity delay-100">القائمة الرئيسية</span>}
          </div>
          {isExpanded && (
            <button 
              onClick={(e) => { e.stopPropagation(); toggleDarkMode(); }}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-emerald-500 transition-all flex-shrink-0"
              title={darkMode ? "الوضع النهاري" : "الوضع الليلي"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4 space-y-6">
          
          {/* Main Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => renderMenuItem(item, false))}
          </nav>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Quick Actions / Templates */}
          <div className="space-y-3">
            {isExpanded && <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap opacity-100 transition-opacity delay-100">مسارات سريعة</p>}
            <div className="grid grid-cols-1 gap-1">
              {adaptiveTemplates.slice(0, 6).map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateAction(template.id)}
                  className={`w-full flex items-center relative group ${isExpanded ? 'gap-3 px-4' : 'justify-center px-0'} py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    {getTemplateIcon(template.id)}
                  </div>
                  {isExpanded && <span className="whitespace-nowrap opacity-100 transition-opacity delay-100 truncate">{template.label}</span>}
                  
                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute right-full mr-4 px-3 py-1.5 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:left-full before:border-4 before:border-transparent before:border-l-slate-800 dark:before:border-l-slate-100">
                      {template.label}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#030712]/40">
          <div ref={settingsRef} className="relative mb-2">
            {/* Recent Pop-up Menu */}
            {isSettingsMenuOpen && (
              <div 
                className={`absolute bottom-full mb-2 z-[60] p-2 bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150 ${
                  isExpanded ? 'right-0 left-0' : 'right-0 w-64'
                }`}
                style={{ direction: 'rtl' }}
              >
                <div className="px-3 py-1.5 text-[11px] font-black tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700/50 mb-1 text-right">
                  الإعدادات والروابط المساعدة
                </div>
                <div className="space-y-0.5">
                  {popupItems.map((item) => {
                    const isActive = currentPage === item.page;
                    return (
                      <button
                        key={item.page}
                        onClick={() => {
                          handleNavigation(item.page);
                          setIsSettingsMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right group ${
                          isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-100/30 dark:border-emerald-500/10'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'}`}>
                          {item.icon}
                        </span>
                        <span className="flex-1 text-right whitespace-nowrap">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Toggle Button for Settings Menu */}
            <button
              onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
              className={`w-full flex items-center group relative ${isExpanded ? 'gap-3 px-4' : 'justify-center px-0'} py-3 rounded-2xl transition-all ${
                isSettingsMenuOpen || [Page.Settings, Page.Privacy, Page.Disclaimer, Page.Contact].includes(currentPage)
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-100/30 dark:border-emerald-500/20 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex-shrink-0">
                <Settings size={20} className={`${isSettingsMenuOpen ? 'rotate-45' : ''} transition-transform duration-300`} />
              </div>
              {isExpanded && <span className="flex-1 text-right text-sm whitespace-nowrap opacity-100 transition-opacity delay-100">الإعدادات والروابط</span>}
              {isExpanded && <ChevronRight size={16} className={`rotate-90 flex-shrink-0 transition-transform ${isSettingsMenuOpen ? '-rotate-90' : ''}`} />}
              
              {/* Tooltip for collapsed state */}
              {!isExpanded && (
                <div className="absolute right-full mr-4 px-3 py-1.5 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:left-full before:border-4 before:border-transparent before:border-l-slate-800 dark:before:border-l-slate-100">
                  الإعدادات والروابط
                </div>
              )}
            </button>
          </div>
          
          {/* Dark Mode toggle for collapsed state */}
          {!isExpanded && (
            <button 
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-center py-3 mt-1 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all relative group"
              title={darkMode ? "الوضع النهاري" : "الوضع الليلي"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              
              <div className="absolute right-full mr-4 px-3 py-1.5 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:left-full before:border-4 before:border-transparent before:border-l-slate-800 dark:before:border-l-slate-100">
                {darkMode ? "الوضع النهاري" : "الوضع الليلي"}
              </div>
            </button>
          )}

          {isExpanded && (
            <div className="text-[10px] text-center text-slate-400 space-y-1 whitespace-nowrap mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/50">
              <p className="font-bold">الأثر الطيب v1.2.0</p>
              <p className="text-emerald-600 dark:text-emerald-500 font-black">تطوير فريق الأثر الطيب</p>
              <p>© 2025 جميع الحقوق محفوظة</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
