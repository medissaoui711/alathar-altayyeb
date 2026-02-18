
import React, { useState, useRef, useEffect, memo } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  loading: boolean;
  placeholder: string;
  externalInput?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, loading, placeholder, externalInput }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (externalInput !== undefined) {
      setInput(externalInput);
      const timeoutId = setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [externalInput]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-emerald-100 dark:border-emerald-900/30 relative z-20">
      <div className="max-w-4xl mx-auto relative flex items-end gap-3">
        <div className="relative flex-1 group">
           <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="w-full pr-4 pl-12 py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-lg shadow-black/5 resize-none overflow-hidden min-h-[60px] max-h-[200px] text-slate-800 dark:text-slate-100 custom-scrollbar leading-relaxed"
            disabled={loading}
          />
          {loading && (
            <div className="absolute left-4 bottom-4">
              <Sparkles className="text-emerald-500 animate-pulse" size={20} />
            </div>
          )}
        </div>
        
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className={`p-4 rounded-2xl transition-all duration-300 flex-shrink-0 ${
            input.trim() && !loading
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 hover:shadow-neon transform hover:-translate-y-1 active:scale-95' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
          }`}
          aria-label="إرسال الرسالة"
        >
          <Send size={24} className="rtl:rotate-180" />
        </button>
      </div>
      <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
        تذكر دائماً أن إجابات الذكاء الاصطناعي استرشادية فقط وتتطلب مراجعة من أهل العلم.
      </p>
    </div>
  );
};

export default memo(ChatInput);
