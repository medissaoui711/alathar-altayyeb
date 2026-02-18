
import React from 'react';
import { ArrowRight, Shield, AlertTriangle, Mail, Lock, FileText, Phone } from 'lucide-react';
import { Page } from '../types';

interface StaticPageProps {
  onNavigate: (page: Page) => void;
}

const PageWrapper: React.FC<{ title: string; icon: React.ReactNode; onNavigate: (page: Page) => void; children: React.ReactNode }> = ({ title, icon, onNavigate, children }) => (
  <div className="max-w-3xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4">
    <button 
      onClick={() => onNavigate(Page.Chat)} 
      className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-6 transition-colors"
    >
      <ArrowRight size={18} className="rtl:rotate-180" />
      <span>العودة للرئيسية</span>
    </button>
    
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-3">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
      </div>
      <div className="p-8 text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
        {children}
      </div>
    </div>
  </div>
);

export const PrivacyPage: React.FC<StaticPageProps> = ({ onNavigate }) => (
  <PageWrapper title="سياسة الخصوصية" icon={<Lock size={24} />} onNavigate={onNavigate}>
    <p>نحن في "الأثر الطيب" نولي أهمية قصوى لخصوصية بياناتك. توضح هذه السياسة كيفية تعاملنا مع المعلومات.</p>
    
    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">1. البيانات التي نجمعها</h3>
    <p>لا نقوم بجمع أي بيانات شخصية تعريفية (مثل الاسم الحقيقي أو البريد الإلكتروني) بشكل إلزامي. المحادثات تتم معالجتها بشكل آني.</p>
    
    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">2. تخزين المحادثات</h3>
    <p>يتم تخزين سجل المحادثات محلياً على جهازك (Local Storage) لضمان سهولة الرجوع إليها. لا يتم رفع هذه السجلات إلى خوادم خارجية إلا في حال طلب المراجعة البشرية طواعية.</p>
    
    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">3. الذكاء الاصطناعي</h3>
    <p>نستخدم نماذج ذكاء اصطناعي متطورة لمعالجة الأسئلة. يتم إرسال نص السؤال فقط للمعالجة دون إرفاق بيانات تعريفية.</p>
  </PageWrapper>
);

export const DisclaimerPage: React.FC<StaticPageProps> = ({ onNavigate }) => (
  <PageWrapper title="إخلاء المسؤولية" icon={<AlertTriangle size={24} />} onNavigate={onNavigate}>
    <div className="bg-amber-50 dark:bg-amber-900/10 border-r-4 border-amber-500 p-4 mb-6">
      <p className="font-bold text-amber-800 dark:text-amber-400">تنبيه هام:</p>
      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">هذا التطبيق هو مساعد بحثي وتقني، وليس بديلاً عن العلماء الراسخين.</p>
    </div>

    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">طبيعة الخدمة</h3>
    <p>المعلومات المقدمة عبر "الأثر الطيب" هي للإغراض التعليمية والاسترشادية فقط. يتم توليد الإجابات باستخدام تقنيات الذكاء الاصطناعي استناداً إلى المصادر المتاحة.</p>
    
    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">الفتوى الشرعية</h3>
    <p>لا تعتبر الإجابات الصادرة عن التطبيق "فتوى شرعية" ملزمة، خاصة في قضايا الدماء، والأموال، والأعراض، والطلاق. ننصح دائماً بالرجوع إلى دور الإفتاء المعتمدة في بلدكم للنوازل والمسائل المصيرية.</p>
    
    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">دقة المعلومات</h3>
    <p>رغم حرصنا على تدقيق المصادر، إلا أن احتمال الخطأ في الفهم أو النقل وارد في الأنظمة الآلية. المستخدم يتحمل مسؤولية التأكد من المعلومات قبل العمل بها.</p>
  </PageWrapper>
);

export const ContactPage: React.FC<StaticPageProps> = ({ onNavigate }) => (
  <PageWrapper title="تواصل معنا" icon={<Mail size={24} />} onNavigate={onNavigate}>
    <p>نسعد بتلقي ملاحظاتكم ومقترحاتكم لتطوير "الفقيه الافتراضي".</p>
    
    <div className="grid md:grid-cols-2 gap-4 mt-4">
      <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start gap-3">
        <Mail className="text-emerald-600 mt-1" />
        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100">البريد الإلكتروني</h4>
          <p className="text-sm text-slate-500 mt-1">support@alathartayyeb.com</p>
        </div>
      </div>

      <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start gap-3">
        <FileText className="text-emerald-600 mt-1" />
        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100">الإبلاغ عن خطأ</h4>
          <p className="text-sm text-slate-500 mt-1">استخدم زر "الإبلاغ" في المحادثة أو راسلنا.</p>
        </div>
      </div>
    </div>

    <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
      <p className="font-semibold text-emerald-800 dark:text-emerald-400">تابعنا على وسائل التواصل</p>
      <div className="flex justify-center gap-4 mt-3">
        {/* Mock Social Icons */}
        <div className="w-8 h-8 bg-emerald-200 dark:bg-emerald-800 rounded-full"></div>
        <div className="w-8 h-8 bg-emerald-200 dark:bg-emerald-800 rounded-full"></div>
        <div className="w-8 h-8 bg-emerald-200 dark:bg-emerald-800 rounded-full"></div>
      </div>
    </div>
  </PageWrapper>
);
