
import React, { useState } from 'react';
import { Clock, MessageCircle, Trash2, ChevronLeft, Search, Calendar, Book } from 'lucide-react';
import { Page } from '../types';
import { useFaqih } from '../context/FaqihContext';

interface HistoryPageProps {
  onNavigate: (page: Page) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const { sessions, deleteSession, loadSession } = useFaqih();
  const [searchTerm, setSearchTerm] = useState('');

  const handleRestore = (sessionId: string) => {
    loadSession(sessionId);
    onNavigate(Page.Chat);
  };

  const filteredSessions = sessions.filter(session => {
    const firstMsg = session.messages.find((m: any) => m.role === 'user');
    return firstMsg?.content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getPreview = (session: any) => {
    const firstMsg = session.messages.find((m: any) => m.role === 'user');
    return firstMsg ? firstMsg.content : 'جلسة جديدة';
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 fade-in pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl shadow-neon">
              <Clock size={28} />
            </div>
            سجل الجلسات
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">مراجعة استفساراتك السابقة ({sessions.length})</p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute right-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="بحث في السجل..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredSessions.map((session) => {
            const preview = getPreview(session);
            const date = new Date(session.lastUpdated).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' });
            const isCritical = session.sensitivityLevel === 'Critical';
            
            return (
              <div 
                key={session.sessionId} 
                className={`bg-white dark:bg-slate-800 border ${isCritical ? 'border-red-100 dark:border-red-900/30' : 'border-slate-100 dark:border-slate-700'} rounded-2xl p-4 hover:shadow-neon transition-all group flex items-center justify-between cursor-pointer animate-in fade-in slide-in-from-bottom-2`}
                onClick={() => handleRestore(session.sessionId)}
              >
                <div className="flex items-center gap-4 overflow-hidden w-full">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isCritical 
                    ? 'bg-red-50 text-red-600 dark:bg-red-900/20'
                    : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'
                  }`}>
                    {isCritical ? <Book size={24} /> : <MessageCircle size={24} />}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {preview}
                    </h3>
                    <div className="flex items-center flex-wrap gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {date}</span>
                      <span className="opacity-30">|</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-500">{session.category}</span>
                      <span className="opacity-30">|</span>
                      <span>{session.madhab}</span>
                      <span className="opacity-30 hidden sm:inline">|</span>
                      <span className="hidden sm:inline">{session.messages.length} رسالة</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRestore(session.sessionId); }}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
                    >
                      <ChevronLeft className="rtl:rotate-0 ltr:rotate-180" size={22} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteSession(session.sessionId); }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
      
      {filteredSessions.length === 0 && (
        <div className="text-center py-24 text-slate-400 bg-white/30 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
          <Clock size={64} className="mx-auto mb-4 opacity-10 animate-pulse" />
          <p className="font-medium">لا توجد جلسات تطابق بحثك</p>
          <button 
            onClick={() => onNavigate(Page.Chat)}
            className="mt-4 text-emerald-600 hover:underline text-sm font-bold"
          >
            ابدأ محادثة جديدة الآن
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
