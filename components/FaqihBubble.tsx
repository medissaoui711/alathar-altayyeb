
import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, BookOpen, ShieldAlert, Tag, CheckCircle2, MessageSquareText, Sparkles } from 'lucide-react';
import { Message, MessageRole, ReferenceData } from '../types';

interface FaqihBubbleProps {
  message: Message;
  onOpenReference: (ref: ReferenceData) => void;
  onQuestionClick?: (question: string) => void;
}

const FaqihBubble: React.FC<FaqihBubbleProps> = ({ message, onOpenReference, onQuestionClick }) => {
  const isUser = message.role === MessageRole.User;
  const isSystem = !isUser;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  const levelColors: Record<string, string> = {
    'مؤكد': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    'مرجّح': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    'اجتهادي': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    'يحتاج مراجعة بشرية': 'text-red-500 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className={`flex flex-col w-full mb-8 ${isUser ? 'items-start animate-in slide-in-from-right-4' : 'items-end animate-in slide-in-from-left-4'}`}>
      <div 
        className={`relative max-w-[90%] md:max-w-[80%] lg:max-w-[70%] rounded-3xl p-6 shadow-xl transition-all duration-300 border
        ${isUser 
          ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 rounded-tr-none border-emerald-100/60 dark:border-emerald-500/15 shadow-emerald-600/5' 
          : 'bg-white dark:bg-slate-900/60 backdrop-blur-md text-slate-800 dark:text-slate-100 rounded-tl-none border-slate-100 dark:border-slate-800/80 shadow-slate-900/5'
        }`}
      >
        {/* Decorative Corner Element */}
        <div className={`absolute top-0 ${isUser ? 'right-0 -translate-y-1/2 translate-x-1/2' : 'left-0 -translate-y-1/2 -translate-x-1/2'} opacity-10`}>
          <svg width="60" height="60" viewBox="0 0 100 100" className="text-emerald-500">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Tag Badge for User Messages */}
        {isUser && message.tag && (
           <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full bg-emerald-500 text-white shadow-neon border border-emerald-400 uppercase tracking-widest">
                 <Tag size={10} />
                 {message.tag}
              </span>
           </div>
        )}

        {/* Content */}
        <div className={`prose dark:prose-invert max-w-none ${isUser ? 'font-medium text-base text-emerald-950 dark:text-emerald-50' : 'leading-loose font-serif text-lg text-slate-800 dark:text-slate-100'} space-y-3`} dir="auto">
          <ReactMarkdown
             components={{
                strong: ({node, ...props}) => <span className={`font-bold ${isUser ? 'text-emerald-950 dark:text-emerald-200' : 'text-emerald-700 dark:text-emerald-400'}`} {...props} />,
                a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" className={`hover:underline font-bold ${isUser ? 'text-emerald-950 dark:text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'}`} {...props} />,
                p: ({node, ...props}) => <p className="mb-4 last:mb-0 leading-loose" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-r-4 border-emerald-500 pr-4 italic my-4 text-emerald-800 dark:text-emerald-300 bg-emerald-500/5 py-3 rounded-l-xl" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-2xl font-black text-slate-800 dark:text-slate-50 mt-6 mb-3 border-b border-emerald-100 dark:border-emerald-900/30 pb-1" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50 mt-5 mb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-4 mb-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 my-4 pr-4 border-r-2 border-emerald-100 dark:border-emerald-900/30 text-right" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 my-4 pr-4 border-r-2 border-slate-100 dark:border-slate-800 text-right" {...props} />,
                li: ({node, ...props}) => <li className={`mb-1.5 leading-loose ${isUser ? 'text-emerald-950 dark:text-emerald-100' : 'text-slate-800 dark:text-slate-100'}`} {...props} />,
                hr: ({node, ...props}) => <hr className="my-6 border-slate-200 dark:border-slate-800" {...props} />,
                code: ({node, ...props}) => <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-mono text-sm" {...props} />
             }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Meta & Actions (AI Turn) */}
        {isSystem && (
          <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 flex-wrap">
              {message.confidence && (
                <span className={`text-[10px] font-bold py-1.5 px-3 rounded-full border flex items-center gap-1.5 transition-colors ${levelColors[message.confidence] || 'text-slate-500'}`}>
                  <CheckCircle2 size={12} />
                  درجة الثقة: {message.confidence}
                </span>
              )}
              
              {message.metadata?.escalation && (
                 <span className="flex items-center gap-1.5 text-[10px] bg-red-500 text-white py-1.5 px-3 rounded-full font-black border border-red-400 shadow-lg shadow-red-500/20 animate-pulse">
                   <ShieldAlert size={12} />
                   يُنصح باللجنة البشرية
                 </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {message.reference && (
                <button 
                  onClick={() => onOpenReference(message.reference!)}
                  className="flex items-center gap-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 py-2 px-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/30 active:scale-95 hover:shadow-neon"
                >
                  <BookOpen size={16} />
                  <span>المصادر</span>
                </button>
              )}

              <button 
                onClick={copyToClipboard}
                className="p-2.5 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 rounded-2xl transition-all shadow-sm"
                title="نسخ النص"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Adaptive Interaction (Questions) */}
      {isSystem && message.adaptiveQuestions && message.adaptiveQuestions.length > 0 && (
        <div className="mt-4 flex flex-col items-end gap-3 w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 px-1">
            <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500 animate-pulse" />
              توسع في المدارسة
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {message.adaptiveQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => onQuestionClick?.(question)}
                className="group text-xs font-bold text-slate-600 dark:text-emerald-400 bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200 dark:border-emerald-500/30 px-5 py-3 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:shadow-neon transition-all duration-300 transform hover:-translate-y-1 active:scale-95 text-right flex items-center gap-2"
              >
                <MessageSquareText size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(FaqihBubble);
