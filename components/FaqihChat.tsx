
import { Page } from '../types';
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { 
  RefreshCw, Sparkles, Send, Clock, Book, Heart, Coins, 
  Sunrise, ShieldCheck, ChevronLeft, Layout, Star, BookOpen 
} from 'lucide-react';
import { Message, MessageRole, FiqhSchool, AnswerType, ReferenceData } from '../types';
import FaqihBubble from './FaqihBubble';
import ChatInput from './ChatInput';
import { askMuftiAI } from '../services/geminiService';
import { useFaqih } from '../context/FaqihContext';

interface FaqihChatProps {
  onOpenReference: (ref: ReferenceData) => void;
  onNavigate?: (page: Page) => void;
}

const FeatureCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: string;
  iconColor: string;
  onClick: () => void;
}> = ({ icon, title, description, color, iconColor, onClick }) => (
  <button 
    onClick={onClick}
    className="group relative flex flex-col items-start p-7 bg-white dark:bg-[#080d1a]/85 border border-slate-200/80 dark:border-slate-800/40 rounded-[24px] text-right transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.04)] hover:border-emerald-500/20 hover:bg-slate-50 dark:hover:bg-[#0b1327]/80 hover:-translate-y-1 overflow-hidden w-full"
  >
    <div className={`absolute -top-6 -left-6 w-24 h-24 ${color} opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
    
    <div className={`p-4 ${color} ${iconColor} rounded-[18px] mb-6 w-fit flex items-center justify-center`}>
      {icon}
    </div>
    
    <h4 className="font-bold text-[18px] text-slate-800 dark:text-white mb-2 tracking-tight">{title}</h4>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-grow text-right mb-6">{description}</p>
    
    <div className="w-full flex items-center justify-between mt-auto">
      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        بدء المحادثة <ChevronLeft size={14} />
      </span>
      <Star size={14} className="text-slate-300 dark:text-slate-700/80 group-hover:text-amber-500 transition-colors" />
    </div>
  </button>
);

const KhutbahRefiner: React.FC<{ 
  onRefine: (instruction: string) => void; 
  darkMode: boolean;
  messageId: string;
}> = memo(({ onRefine, darkMode, messageId }) => {
  const [instruction, setInstruction] = useState('');
  const handleSubmit = () => { if (instruction.trim()) { onRefine(instruction); setInstruction(''); } };

  return (
    <div className={`mt-4 p-4 rounded-2xl border animate-in fade-in slide-in-from-top-3 ${darkMode ? 'border-emerald-500/30 bg-slate-800/70 shadow-neon' : 'border-emerald-200 bg-emerald-50/80'}`}>
      <p className={`text-sm font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
        <Sparkles size={16} className="text-amber-500" />
        تطوير المسودة آلياً
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="مثال: أضف آيات عن الصبر، أو اختصر الفقرة الثانية..."
          className={`flex-1 px-4 py-2.5 rounded-xl text-sm outline-none border-2 transition-all ${
            darkMode 
              ? 'bg-slate-700 border-transparent focus:border-emerald-500 text-white placeholder-slate-500' 
              : 'bg-white border-slate-100 focus:border-emerald-400 text-slate-800 placeholder-slate-400'
          }`}
        />
        <button
          onClick={handleSubmit}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
        >
          تحديث
        </button>
      </div>
    </div>
  );
});

const FaqihChat: React.FC<FaqihChatProps> = ({ onOpenReference, onNavigate }) => {
  const { 
    appSettings, currentSession, startSession, addMessage, endCurrentSession, draftIntent, setDraftIntent 
  } = useFaqih();
  
  const [loading, setLoading] = useState(false);
  const [pendingTag, setPendingTag] = useState<string | undefined>(undefined);
  const [externalInput, setExternalInput] = useState<string | undefined>(undefined);
  const [selectedSchool, setSelectedSchool] = useState<FiqhSchool>(appSettings.defaultSchool);
  const [selectedType, setSelectedType] = useState<AnswerType>(AnswerType.Fiqh);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (draftIntent) {
      startSession(draftIntent.type, appSettings.defaultSchool);
      setSelectedType(draftIntent.type);
      setSelectedSchool(appSettings.defaultSchool);
      setExternalInput(draftIntent.text);
      setPendingTag(draftIntent.tag);
      setDraftIntent(null);
    }
  }, [draftIntent, startSession, appSettings.defaultSchool, setDraftIntent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, loading]);

  const processUserMessage = useCallback(async (text: string, type?: AnswerType, school?: FiqhSchool, tag?: string) => {
    if (!text.trim()) return;
    setLoading(true);
    
    const activeType = type || selectedType;
    const activeSchool = school || selectedSchool;
    const timestamp = Date.now();
    
    let sessionContext = currentSession;
    if (!sessionContext || (type && sessionContext.category !== type)) {
      sessionContext = await startSession(activeType, activeSchool);
    }

    const userMsg: Message = {
      id: timestamp.toString(),
      role: MessageRole.User,
      content: text,
      type: activeType,
      tag: tag,
      timestamp: timestamp
    };

    await addMessage(userMsg, sessionContext.sessionId);

    try {
      const response = await askMuftiAI(
        userMsg.content,
        sessionContext.messages.concat(userMsg),
        { 
          school: activeSchool, 
          type: activeType,
          model: appSettings.aiModel
        }
      );

      const aiMsg: Message = {
        id: (timestamp + 1).toString(),
        role: MessageRole.Assistant,
        content: response.message,
        reference: response.reference,
        timestamp: Date.now(),
        confidence: response.level,
        needsEscalation: response.escalation_flag,
        adaptiveQuestions: response.adaptiveQuestions,
        metadata: { level: response.level, madhhab: response.madhhab, escalation: response.escalation_flag }
      };

      await addMessage(aiMsg, sessionContext.sessionId);
    } catch (err: any) {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  }, [currentSession, startSession, selectedType, selectedSchool, addMessage, appSettings.aiModel]);

  const handleSendMessage = (text: string) => {
    processUserMessage(text, selectedType, selectedSchool, pendingTag);
    setPendingTag(undefined);
    setExternalInput(undefined);
  };

  const handleQuickAction = (text: string, type: AnswerType) => {
    setSelectedType(type);
    processUserMessage(text, type, selectedSchool);
  };

  const handleNewChat = () => {
    endCurrentSession();
  };

  const messagesToDisplay = currentSession?.messages || [];
  const showWelcome = messagesToDisplay.length === 0;

  const renderWelcomeDashboard = () => (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center space-y-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -z-10" />
        
        {/* Top Centered Custom Layout Glow Icon Box */}
        <div className="relative inline-flex mb-2">
          {/* Green glow behind */}
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-3xl animate-pulse" />
          <div className="relative p-5 bg-white dark:bg-[#080d1a] border border-emerald-100 dark:border-emerald-500/30 rounded-[24px] text-emerald-600 dark:text-[#10b981] shadow-[0_0_35px_rgba(16,185,129,0.25)] transform hover:scale-105 transition-all duration-300">
            <Layout size={36} />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-3xl sm:text-[44px] font-black text-slate-800 dark:text-white tracking-tight leading-tight">
            أهلاً بك في <span className="text-emerald-600 dark:text-[#10b981]">الأثر الطيب</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
            مساعدك الفقهي والبحثي الذكي. انقر على أحد المسارات أدناه للبدء فوراً.
          </p>
        </div>
      </div>

      {/* 2-Column Bento-style Layout matching the screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard 
          icon={<Sunrise size={24} />}
          color="bg-amber-500/10 dark:bg-amber-500/10"
          iconColor="text-amber-600 dark:text-[#f59e0b]"
          title="فقه العبادات"
          description="أحكام الطهارة، الصلاة، الزكاة، والصيام وفق المذهب المعتمد."
          onClick={() => handleQuickAction("ما هي أحكام سجود السهو في الصلاة؟", AnswerType.Fiqh)}
        />
        <FeatureCard 
          icon={<Heart size={24} />}
          color="bg-rose-500/10 dark:bg-rose-500/10"
          iconColor="text-rose-600 dark:text-[#f43f5e]"
          title="الأحوال الشخصية"
          description="استشارات الزواج، الأسرة، والتربية بضوابط الشريعة الإسلامية."
          onClick={() => handleQuickAction("ما هي حقوق الزوجة في الإسلام بناءً على السنة؟", AnswerType.Fiqh)}
        />
        <FeatureCard 
          icon={<Coins size={24} />}
          color="bg-emerald-500/10 dark:bg-emerald-500/10"
          iconColor="text-emerald-600 dark:text-[#10b981]"
          title="المعاملات المالية"
          description="ضوابط التجارة، العقود، البيوع الحديثة، والعملات الرقمية."
          onClick={() => handleQuickAction("ما حكم التداول بالعملات الرقمية شرعاً؟", AnswerType.Fiqh)}
        />
        <FeatureCard 
          icon={<BookOpen size={24} />}
          color="bg-blue-500/10 dark:bg-blue-500/10"
          iconColor="text-blue-600 dark:text-[#3b82f6]"
          title="التفسير والحديث"
          description="مدارسة معاني الآيات الكريمة وشرح الأحاديث من المصادر الأصلية."
          onClick={() => handleQuickAction("أريد تفسير قوله تعالى: (وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا).", AnswerType.Tafsir)}
        />
        <FeatureCard 
          icon={<ShieldCheck size={24} />}
          color="bg-sky-500/10 dark:bg-sky-500/10"
          iconColor="text-sky-600 dark:text-[#0ea5e9]"
          title="إعداد الخطب"
          description="صياغة مسودات خطب الجمعة والمواعظ بأسلوب بليغ ومنظم."
          onClick={() => handleQuickAction("اكتب لي مسودة خطبة جمعة عن (بر الوالدين) موجهة للشباب.", AnswerType.Khutbah)}
        />
        <FeatureCard 
          icon={<Clock size={24} />}
          color="bg-teal-500/10 dark:bg-teal-500/10"
          iconColor="text-teal-600 dark:text-[#14b8a6]"
          title="سجلك التاريخي"
          description="الوصول لجلساتك السابقة لمتابعة مدارساتك الفقهية."
          onClick={() => onNavigate?.(Page.History)}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 opacity-80 dark:opacity-100">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          <Star size={14} className="text-emerald-500" /> دعم كامل للمذاهب الأربعة
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          <Book size={14} className="text-emerald-500" /> مراجع موثقة من أمهات الكتب
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto bg-transparent overflow-hidden">
      
      <div className="flex items-center gap-3 p-4 border-b border-emerald-100 dark:border-emerald-900/30 bg-white/80 dark:bg-[#030712]/80 sticky top-0 z-20 backdrop-blur-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <select 
            value={selectedSchool}
            disabled={messagesToDisplay.length > 0}
            onChange={(e) => setSelectedSchool(e.target.value as FiqhSchool)}
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:opacity-50"
          >
            {Object.values(FiqhSchool).map(s => <option key={s} value={s}>المذهب: {s}</option>)}
          </select>

          <select 
            value={selectedType}
            disabled={messagesToDisplay.length > 0}
            onChange={(e) => setSelectedType(e.target.value as AnswerType)}
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:opacity-50"
          >
            {Object.values(AnswerType).map(t => <option key={t} value={t}>القسم: {t}</option>)}
          </select>
        </div>

        <div className="mr-auto flex items-center gap-2">
          <button 
            onClick={handleNewChat}
            className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
            title="جلسة جديدة"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth custom-scrollbar">
        {showWelcome ? renderWelcomeDashboard() : (
          <>
            {messagesToDisplay.map((msg) => (
              <div key={msg.id}>
                <FaqihBubble 
                  message={msg} 
                  onOpenReference={onOpenReference} 
                  onQuestionClick={(q) => handleSendMessage(q)}
                />
                {currentSession?.category === AnswerType.Khutbah && msg.role === MessageRole.Assistant && (
                  <KhutbahRefiner onRefine={(ins) => processUserMessage(`تعديل: ${ins}`, AnswerType.Khutbah, selectedSchool, 'تحسين')} darkMode={appSettings.darkMode} messageId={msg.id} />
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-end mb-4">
                <div className="bg-emerald-50 dark:bg-slate-800/60 p-5 rounded-3xl rounded-tl-none flex items-center gap-3 animate-pulse shadow-neon">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput 
        onSend={handleSendMessage}
        loading={loading}
        placeholder={showWelcome ? "ابدأ بكتابة سؤالك هنا مباشرة..." : "أكمل استفسارك..."}
        externalInput={externalInput}
      />
    </div>
  );
};

export default memo(FaqihChat);
