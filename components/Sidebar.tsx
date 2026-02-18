
import React, { useMemo } from 'react';
import { 
  BookOpen, Moon, Sun, HelpCircle, FileText, Users, Search, Clock, Settings, Home,
  Heart, Briefcase, Droplets, Sunrise, Coins, UtensilsCrossed, MapPin, Shield, Scroll, CreditCard, Mic,
  AlertCircle, Mail, Lock, Library, ChevronRight
} from 'lucide-react';
import { Page, AnswerType } from '../types';
import { useFaqih } from '../context/FaqihContext';
import { getAdaptiveTemplates } from '../data/templates';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, darkMode, toggleDarkMode, currentPage, onNavigate }) => {
  const { setDraftIntent, appSettings } = useFaqih();
  
  const adaptiveTemplates = useMemo(() => {
    return getAdaptiveTemplates(appSettings.defaultSchool);
  }, [appSettings.defaultSchool]);

  const handleNavigation = (page: Page) => {
    onNavigate(page);
    onClose();
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
      onClose();
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
    { icon: <Settings size={20} />, label: "الإعدادات", page: Page.Settings },
  ];

  const secondaryMenu = [
    { icon: <Lock size={18} />, label: "الخصوصية", page: Page.Privacy },
    { icon: <AlertCircle size={18} />, label: "إخلاء المسؤولية", page: Page.Disclaimer },
    { icon: <Mail size={18} />, label: "تواصل معنا", page: Page.Contact },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      
      <aside className={`fixed top-0 right-0 bottom-0 w-[300px] bg-white dark:bg-slate-900 z-50 transition-transform duration-500 ease-out border-l border-emerald-100 dark:border-emerald-900/30 shadow-2xl overflow-hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-emerald-50 dark:border-emerald-900/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-neon">
              <Library size={18} />
            </div>
            <span className="font-black text-slate-800 dark:text-slate-100">القائمة الرئيسية</span>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-emerald-500 transition-all"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
          
          {/* Main Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavigation(item.page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  currentPage === item.page 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-100 dark:border-emerald-500/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span className="flex-1 text-right">{item.label}</span>
                {currentPage === item.page && <ChevronRight size={16} className="rotate-180" />}
              </button>
            ))}
          </nav>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Quick Actions / Templates */}
          <div className="space-y-3">
            <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">مسارات سريعة</p>
            <div className="grid grid-cols-1 gap-1">
              {adaptiveTemplates.slice(0, 6).map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateAction(template.id)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {getTemplateIcon(template.id)}
                  </div>
                  {template.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Secondary Links */}
          <nav className="space-y-1 pb-6">
             {secondaryMenu.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavigation(item.page)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
              >
                {item.icon}
                <span className="flex-1 text-right">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800">
           <div className="text-[10px] text-center text-slate-400 space-y-1">
             <p className="font-bold">الأثر الطيب v1.2.0</p>
             <p className="text-emerald-600 dark:text-emerald-500 font-black">تطوير فريق الأثر الطيب</p>
             <p>© 2025 جميع الحقوق محفوظة</p>
           </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
