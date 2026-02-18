
import React from 'react';
import { Settings, Moon, Sun, Type, Shield, Bell, Check } from 'lucide-react';
import { AppSettings, FiqhSchool, FontSize } from '../types';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onUpdateSettings }) => {
  
  const update = (key: keyof AppSettings, value: any) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 fade-in">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Settings className="text-emerald-600" />
          الإعدادات
        </h2>
      </div>

      {/* Appearance */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">المظهر والعرض</h3>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 space-y-6">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">الوضع الليلي</p>
                <p className="text-xs text-slate-500">تغيير مظهر التطبيق للألوان الداكنة</p>
              </div>
            </div>
            <button 
              onClick={() => update('darkMode', !settings.darkMode)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${settings.darkMode ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <hr className="border-slate-100 dark:border-slate-700" />

          {/* Font Size */}
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <Type size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">حجم الخط</p>
                <p className="text-xs text-slate-500">التحكم في حجم نصوص المحادثة</p>
              </div>
            </div>
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
              {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => update('fontSize', size)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    settings.fontSize === size 
                      ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {size === 'small' ? 'صغير' : size === 'medium' ? 'متوسط' : 'كبير'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fiqh Preferences */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">التفضيلات الفقهية</h3>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">المذهب الافتراضي</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(FiqhSchool).map((school) => (
                <button
                  key={school}
                  onClick={() => update('defaultSchool', school)}
                  className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
                    settings.defaultSchool === school
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800'
                  }`}
                >
                  {school}
                  {settings.defaultSchool === school && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">الخصوصية والإشعارات</h3>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 space-y-6">
           <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">الإشعارات</p>
                <p className="text-xs text-slate-500">تلقي تنبيهات عند توفر إجابات المراجعة البشرية</p>
              </div>
            </div>
            <button 
              onClick={() => update('notificationsEnabled', !settings.notificationsEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${settings.notificationsEnabled ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          
          <hr className="border-slate-100 dark:border-slate-700" />

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
              <Shield size={20} />
            </div>
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200">سياسة البيانات</p>
              <p className="text-xs text-slate-500">جميع المحادثات مشفرة ولا يتم مشاركتها مع أطراف ثالثة</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
