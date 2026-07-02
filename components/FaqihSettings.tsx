
import React, { useRef } from 'react';
import { Settings, Moon, Sun, BookOpen, Zap, Brain, Check, Save, Download, Upload } from 'lucide-react';
import { AppSettings, FiqhSchool, AIModel } from '../types';
import { useFaqih } from '../context/FaqihContext';

interface FaqihSettingsProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onNavigateBack: () => void;
}

const FaqihSettings: React.FC<FaqihSettingsProps> = ({ settings, onUpdateSettings, onNavigateBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sessions, importSessionsData } = useFaqih();

  const update = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    onUpdateSettings(newSettings);
    localStorage.setItem('faqih_settings', JSON.stringify(newSettings));
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `faqih_sessions_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const parsed = JSON.parse(result);
          if (Array.isArray(parsed)) {
            await importSessionsData(parsed);
            alert('تم استيراد الجلسات بنجاح!');
          } else {
            alert('ملف النسخة الاحتياطية غير صالح.');
          }
        }
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء استيراد الملف.');
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 fade-in pb-24">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Settings className="text-emerald-600" />
          الإعدادات والتفضيلات
        </h2>
      </div>

      {/* Shar'i Preferences */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          < BookOpen size={18} />
          التفضيلات الشرعية
        </h3>
        
        <div className="bg-white dark:bg-[#080d1a] rounded-xl border border-slate-200 dark:border-slate-800/40 p-5 space-y-6 shadow-sm">
          
          {/* Default Madhhab */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">المذهب الفقهي الافتراضي</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.values(FiqhSchool).map((school) => (
                <button
                  key={school}
                  onClick={() => update('defaultSchool', school)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition-all ${
                    settings.defaultSchool === school
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {school}
                  {settings.defaultSchool === school && <Check size={14} />}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400">سيتم استخدام هذا المذهب للإجابة ما لم يتم تحديده يدوياً في المحادثة.</p>
          </div>

          <hr className="border-slate-100 dark:border-slate-700" />

          {/* Detail Level */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">مستوى تفصيل الإجابة</label>
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
              <button
                onClick={() => update('detailLevel', 'brief')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  settings.detailLevel === 'brief'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                مختصر (الزبدة)
              </button>
              <button
                onClick={() => update('detailLevel', 'detailed')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  settings.detailLevel === 'detailed'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                مفصل (مع الأدلة)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AI & Tech Settings */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Brain size={18} />
          الذكاء الاصطناعي والنظام
        </h3>
        
        <div className="bg-white dark:bg-[#080d1a] rounded-xl border border-slate-200 dark:border-slate-800/40 p-5 space-y-6 shadow-sm">
          
          {/* AI Model */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">نموذج المعالجة (AI Model)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => update('aiModel', 'gemini-3-flash-preview')}
                className={`flex items-start gap-3 p-4 rounded-xl border text-right transition-all ${
                  settings.aiModel === 'gemini-3-flash-preview'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${settings.aiModel === 'gemini-3-flash-preview' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  < Zap size={20} />
                </div>
                <div>
                  <span className={`block font-bold text-sm ${settings.aiModel === 'gemini-3-flash-preview' ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>Gemini 3 Flash</span>
                  <span className="text-xs text-slate-500 dark:text-slate-300">سريع، خفيف، ومناسب للأسئلة المباشرة واليومية.</span>
                </div>
              </button>

              <button
                onClick={() => update('aiModel', 'gemini-3-pro-preview')}
                className={`flex items-start gap-3 p-4 rounded-xl border text-right transition-all ${
                  settings.aiModel === 'gemini-3-pro-preview'
                    ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-900/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${settings.aiModel === 'gemini-3-pro-preview' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                  <Brain size={20} />
                </div>
                <div>
                  <span className={`block font-bold text-sm ${settings.aiModel === 'gemini-3-pro-preview' ? 'text-purple-900 dark:text-purple-400' : 'text-slate-700 dark:text-slate-300'}`}>Gemini 3 Pro</span>
                  <span className="text-xs text-slate-500 dark:text-slate-300">تحليل عميق، مناسب للمسائل المعقدة والاستنباط.</span>
                </div>
              </button>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-700" />

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
                {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">المظهر الليلي</p>
                <p className="text-xs text-slate-500">مريح للعين في الإضاءة المنخفضة</p>
              </div>
            </div>
            <button 
              onClick={() => update('darkMode', !settings.darkMode)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${settings.darkMode ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Backup and Data */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Save size={18} />
          النسخ الاحتياطي والبيانات
        </h3>
        
        <div className="bg-white dark:bg-[#080d1a] rounded-xl border border-slate-200 dark:border-slate-800/40 p-5 space-y-6 shadow-sm">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            بياناتك محفوظة محلياً في متصفحك. يمكنك تصدير جلساتك للاحتفاظ بنسخة احتياطية، أو استيرادها لاحقاً.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Download size={18} />
              <span>تصدير جلساتي (JSON)</span>
            </button>

            <div>
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImport}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Upload size={18} />
                <span>استيراد جلسات</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Save Confirmation */}
      <div className="flex justify-end">
        <button 
            onClick={onNavigateBack}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30"
        >
            <Save size={18} />
            <span>حفظ والعودة</span>
        </button>
      </div>
    </div>
  );
};

export default FaqihSettings;
