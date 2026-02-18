import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { ReferenceData } from '../types';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReferenceData | null;
}

const ReferenceModal: React.FC<ReferenceModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-emerald-600 overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
            <span className="text-2xl">📘</span> مرجع شرعي
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">المصدر</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.title}</h4>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-r-4 border-amber-500">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
              "{data.text}"
            </p>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <span className="font-semibold">الموضع:</span>
              <span>{data.pageOrSource}</span>
            </div>
            
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              data.status === 'Trusted' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' 
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
            }`}>
              {data.status === 'Trusted' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              {data.status === 'Trusted' ? 'موثوق' : 'قيد المراجعة'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 text-center border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500">هذا المرجع تم توليده آلياً لأغراض الاسترشاد</p>
        </div>
      </div>
    </div>
  );
};

export default ReferenceModal;