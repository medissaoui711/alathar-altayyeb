
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
  onClick: () => void;
}> = ({ icon, title, description, color, onClick }) => (
  <button 
    onClick={onClick}
    className="group relative flex flex-col p-6 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-emerald-900/30 rounded-3xl text-right transition-all hover:shadow-neon-strong hover:border-emerald-500/50 hover:-translate-y-2 overflow-hidden"
  >
    <div className={`absolute -top-6 -left-6 w-24 h-24 ${color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
    <div className={`p-4 ${color} bg-opacity-10 dark:bg-opacity-20 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-5 w-fit group-hover:animate-pulse-glow`}>
      {icon}
    </div>
    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">{title}</h4>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">{description}</p>
    <div className="mt-6 flex items-center justify-between">
      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        بدء المحادثة <ChevronLeft size={14} />
      </span>
      <Star size={14} className="text-slate-200 dark:text-slate-700" />
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
      sessionContext = startSession(activeType, activeSchool);
    }

    const userMsg: Message = {
      id: timestamp.toString(),
      role: MessageRole.User,
      content: text,
      type: activeType,
      tag: tag,
      timestamp: timestamp
    };

    addMessage(userMsg);

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

      addMessage(aiMsg);
    } catch (err) {
      console.error("Chat process error:", err);
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

  const handleNewChat = () => endCurrentSession();

  const messagesToDisplay = currentSession?.messages || [];
  const showWelcome = messagesToDisplay.length === 0 && !loading;

  const renderWelcomeDashboard = () => (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center space-y-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -z-10" />
        <div className="inline-flex p-5 bg-white dark:bg-slate-800 rounded-3xl text-emerald-600 dark:text-emerald-400 shadow-neon-strong border border-emerald-100 dark:border-emerald-900/50 mb-2 transform hover:rotate-12 transition-transform">
          <Layout size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            أهلاً بك في <span className="text-emerald-600">الأثر الطيب</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            مساعدك الفقهي والبحثي الذكي. انقر على أحد المسارات أدناه للبدء فوراً.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<Sunrise size={28} />}
          color="bg-orange-500"
          title="فقه العبادات"
          description="أحكام الطهارة، الصلاة، الزكاة، والصيام وفق المذهب المعتمد."
          onClick={() => handleQuickAction("ما هي أحكام سجود السهو في الصلاة؟", AnswerType.Fiqh)}
        />
        <FeatureCard 
          icon={<Heart size={28} />}
          color="bg-red-500"
          title="الأحوال الشخصية"
          description="استشارات الزواج، الأسرة، والتربية بضوابط الشريعة الإسلامية."
          onClick={() => handleQuickAction("ما هي حقوق الزوجة في الإسلام بناءً على السنة؟", AnswerType.Fiqh)}
        />
        <FeatureCard 
          icon={<Coins size={28} />}
          color="bg-emerald-500"
          title="المعاملات المالية"
          description="ضوابط التجارة، العقود، البيوع الحديثة، والعملات الرقمية."
          onClick={() => handleQuickAction("ما حكم التداول بالعملات الرقمية شرعاً؟", AnswerType.Fiqh)}
        />
        <FeatureCard 
          icon={<BookOpen size={28} />}
          color="bg-blue-500"
          title="التفسير والحديث"
          description="مدارسة معاني الآيات الكريمة وشرح الأحاديث من المصادر الأصلية."
          onClick={() => handleQuickAction("أريد تفسير قوله تعالى: (وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا).", AnswerType.Tafsir)}
        />
        <FeatureCard 
          icon={<ShieldCheck size={28} />}
          color="bg-indigo-500"
          title="إعداد الخطب"
          description="صياغة مسودات خطب الجمعة والمواعظ بأسلوب بليغ ومنظم."
          onClick={() => handleQuickAction("اكتب لي مسودة خطبة جمعة عن (بر الوالدين) موجهة للشباب.", AnswerType.Khutbah)}
        />
        <FeatureCard 
          icon={<Clock size={28} />}
          color="bg-slate-500"
          title="سجلك التاريخي"
          description="الوصول لجلساتك السابقة لمتابعة مدارساتك الفقهية."
          onClick={() => onNavigate?.(Page.History)}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 opacity-60">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Star size={14} /> دعم كامل للمذاهب الأربعة
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Book size={14} /> مراجع موثقة من أمهات الكتب
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto bg-transparent overflow-hidden">
      
      <div className="flex items-center gap-3 p-4 border-b border-emerald-100 dark:border-emerald-900/30 bg-white/80 dark:bg-slate-900/80 sticky top-0 z-20 backdrop-blur-xl">
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
