# 🕌 الأثر الطيب - الفقيه الافتراضي (Al-Athar Al-Tayyeb)

> **نظام خبير يدمج بين رصانة العلوم الشرعية وذكاء التقنيات الحديثة (Next.js + Gemini AI).**

[![Framework - Next.js 15](https://img.shields.com/badge/Framework-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![AI - Gemini 2.5 Flash](https://img.shields.com/badge/AI-Gemini%202.5%20Flash-orange?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![Styling - Tailwind CSS](https://img.shields.com/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License - MIT](https://img.shields.com/badge/License-MIT-emerald?style=for-the-badge)](./LICENSE)

---

## 🌟 الفكرة العامة للمشروع (Project Overview)
**الأثر الطيب** هو منصة رقمية متطورة تُمثل الجيل الجديد من المساعدات البحثية الإسلامية. تم تصميمه ليكون رفيقاً للباحث وخطيب الجمعة، حيث يدمج بين المنهجية المذهبية للأئمة الأربعة وبين سرعة ودقة الذكاء الاصطناعي، مع الالتزام الصارم بضوابط الفتوى والخصوصية.

## 🧠 المحرك الذكي (The Intelligence Engine)
تم بناء التطبيق وفق هندسة برمجية تعتمد على **المعالجة ثلاثية الطبقات**:

1.  **طبقة الاستدلال (Inference Layer):** استخدام نموذج `Gemini 2.5 Flash` مع بروتوكول **Structured Output** لضمان استجابة مهيكلة بصيغة JSON.
2.  **محرك التقييم (Evaluation Engine):** نظام "صمام الأمان" الذي يستخدم `Regex Patterns` للكشف عن المسائل الحرجة (دماء، طلاق، مواريث) وتصعيدها للبشر. يعمل هذا المحرك حصرياً في الواجهة الخلفية (Backend) عبر مسارات Next.js لضمان عدم التلاعب به.
3.  **محرك التحقق المتقاطع (Cross-Check Engine):** نظام استدلال رقمي يمنح الإجابة درجة ثقة (Score) بناءً على صحة العزو للمصادر والمذاهب.

## 🛠️ الميزات المنجزة والمطبقة (Implemented Features)
* **Privacy-First:** تخزين محلي كامل (Local-First) للجلسات في قواعد بيانات المتصفح (IndexedDB) لضمان خصوصية المستخدم المطلقة مع القدرة على الاحتفاظ بالبيانات حتى بعد إعادة التحميل.
* **النسخ الاحتياطي اليدوي:** ميزة تصدير واستيراد سجلات الدردشة (Sessions) بصيغة JSON، مما يمنح المستخدم تحكماً كاملاً في بياناته دون الحاجة للتسجيل السحابي.
* **أمان المفاتيح (Security):** نقل جميع طلبات الذكاء الاصطناعي للعمل في الخادم (Server-side API Routes) لحماية مفاتيح API الخاصة بـ Gemini.
* **Madhhab Context:** تخصيص الإجابات بناءً على المذهب المختار (حنفي، مالكي، شافعي، حنبلي).
* **Luminous UI:** واجهة مستخدم إسلامية عصرية تدعم الوضع الليلي وخط `Cairo`.

## 🏗️ هيكل المجلدات (Directory Structure)
```text
.
├── app/                # إعدادات ومسارات Next.js والخادم (App Router & API Routes)
├── components/         # مكونات الواجهة الأمامية الأساسية
├── context/            # إدارة الحالة المركزية (Context API)
├── hooks/              # الخطافات المخصصة (Custom Hooks)
├── services/           # دوال التواصل مع الـ Backend
├── utils/              # محركات المنطق (Safety, Session Manager & Cross-Check)
└── types/              # تعريفات الأنواع في TypeScript
```

## 🚀 التشغيل المحلي والنشر (Deployment)
```bash
# استنساخ المستودع
git clone https://github.com/m-alissawi/al-athar-altayyeb.git

# تثبيت الاعتماديات
npm install

# إعداد متغيرات البيئة (.env.local أو Vercel Dashboard)
GEMINI_API_KEY=your_api_key_here

# تشغيل خادم التطوير
npm run dev
```

## 🔒 الخصوصية والأمان
التطبيق لا يقوم بجمع أي بيانات شخصية. جميع المحادثات تُحفظ في الـ LocalStorage الخاص بمتصفحك فقط. الإجابات الصادرة هي إجابات استرشادية تعليمية وليست فتوى ملزمة.

---

## 👨‍💻 المطور (The Developer)
**المهندس محمد العيساوي**  
*مطور Next.js ومخطط أنظمة ذكاء اصطناعي*

> "نسعى لتحويل الأفكار المعقدة إلى حلول رقمية ذكية تخدم العلم والمجتمع."

تم التطوير بكل إتقان ليكون أثراً طيباً في العالم الرقمي.