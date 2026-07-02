
import React, { useState } from 'react';
import { Users, Send, Info, FileCheck } from 'lucide-react';
import { AnswerType } from '../types';

const HumanReviewPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: AnswerType.Fiqh,
    question: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => setSubmitted(true), 1000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6 fade-in">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
          <FileCheck size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">تم إرسال سؤالك بنجاح</h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-md">
          سيتم مراجعة سؤالك من قبل اللجنة الشرعية والرد عليك في أقرب وقت ممكن. يمكنك متابعة حالة الطلب من صفحة الإشعارات.
        </p>
        <button 
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', type: AnswerType.Fiqh, question: '' });
          }}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          إرسال سؤال آخر
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 fade-in">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Users className="text-emerald-600" />
          مراجعة بشرية (اللجنة الشرعية)
        </h2>
        <p className="text-slate-500 dark:text-slate-300 text-sm mt-2">
          للحصول على فتوى رسمية أو تدقيق في مسألة معقدة، يمكنك رفع سؤالك للجنة المختصة.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-4 rounded-xl flex items-start gap-3 text-sm text-amber-800 dark:text-amber-400">
          <Info size={18} className="flex-shrink-0 mt-0.5" />
          <p>هذه الخدمة مخصصة للمسائل التي تحتاج تفصيلاً خاصاً قد لا يغطيه المساعد الافتراضي بدقة 100%.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">الاسم (اختياري)</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="اكتب اسمك..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">نوع السؤال</label>
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as AnswerType})}
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            >
              {Object.values(AnswerType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
              <option value="Other">غير ذلك</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">نص السؤال *</label>
            <textarea 
              required
              value={formData.question}
              onChange={e => setFormData({...formData, question: e.target.value})}
              rows={6}
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
              placeholder="اكتب تفاصيل سؤالك هنا بوضوح..."
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Send size={20} className="rtl:rotate-180" />
            إرسال للمراجعة
          </button>
        </div>
      </form>
    </div>
  );
};

export default HumanReviewPage;
