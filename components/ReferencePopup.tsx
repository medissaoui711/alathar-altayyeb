
import React from 'react';
import { X, BookOpen, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { ReferenceData } from '../types';

interface ReferencePopupProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReferenceData | null;
}

const ReferencePopup: React.FC<ReferencePopupProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const isTrusted = data.status === 'Trusted';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-500">
            <BookOpen size={20} />
            <h3 className="font-bold text-lg">المرجع الشرعي</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Title */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">المصدر</span>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 leading-tight">
              {data.title}
            </h4>
          </div>

          {/* Excerpt */}
          <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border-r-4 border-amber-500 relative">
            <FileText className="absolute top-4 left-4 text-amber-200 dark:text-amber-800/40" size={40} />
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed relative z-10 font-medium">
              "{data.text}"
            </p>
          </div>

          {/* Footer Details */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-semibold">السند / الصفحة</span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">{data.pageOrSource}</span>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              isTrusted 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900' 
                : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900'
            }`}>
              {isTrusted ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              <span>{isTrusted ? 'موثوق' : 'يحتاج مراجعة'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReferencePopup;
