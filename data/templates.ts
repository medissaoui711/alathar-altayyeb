import { AnswerType, QuestionTemplate, FiqhSchool } from '../types';

const KHUTBAH_BASE_PROMPT = `أنت كاتب خُطب محترف. اكتب خُطبة جمعة كاملة عن موضوع: [اكتب الموضوع هنا]، موجهة لـ: [اكتب الجمهور هنا].

MADHHAB_PLACEHOLDER

**قواعد التنسيق الأساسية:**
- استخدم Markdown فقط.
- استخدم \`>\` للآيات والأحاديث.
- ممنوع استخدام أي وسوم HTML.

**هيكل الخطبة:**
1. مقدمة مؤثرة.
2. ثلاث نقاط أساسية مع الأدلة.
3. خاتمة بموعظة ودعاء.

اكتب الخطبة الكاملة الآن.`;

export const QUICK_ACTION_TEMPLATES: QuestionTemplate[] = [
  // --- الأساسية ---
  {
    id: 'fiqh-consult',
    label: 'استشارات فقهية (عام)',
    sampleQuestion: 'ما هو الحكم الشرعي في...؟',
    type: AnswerType.Fiqh,
    tag: 'فقه عام'
  },
  {
    id: 'khutbah-prep',
    label: 'مسودة خطبة الجمعة',
    sampleQuestion: KHUTBAH_BASE_PROMPT.replace('MADHHAB_PLACEHOLDER', '**متطلبات شرعية:**\n- التزم بمنهج أهل السنة والجماعة العام.'),
    type: AnswerType.Khutbah,
    tag: 'خطبة',
    warning: 'هذه مسودة خطبة احترافية مولدة بواسطة الذكاء الاصطناعي. هي أداة مساعدة للخطيب المؤهل فقط، وتحتاج بشكل إلزامي إلى مراجعة دقيقة، وتعديل، وإتقان من قبل عالم أو خطيب مؤهل قبل إلقائها على الناس. لا تعتبر فتوى أو نصًا شرعيًا نهائيًا.'
  },
  {
    id: 'quran-tafsir',
    label: 'تفسير آيات',
    sampleQuestion: 'أريد تفسير الآية الكريمة: (...)',
    type: AnswerType.Tafsir,
    tag: 'قرآن'
  },
  {
    id: 'hadith-explain',
    label: 'تفسير أحاديث',
    sampleQuestion: 'أريد شرح الحديث الشريف: (...)',
    type: AnswerType.Hadith,
    tag: 'حديث'
  },
  
  // --- العبادات ---
  {
    id: 'fiqh-purity',
    label: 'مسائل الطهارة',
    sampleQuestion: 'عندي استفسار بخصوص الطهارة والوضوء: ...',
    type: AnswerType.Fiqh,
    tag: 'طهارة'
  },
  {
    id: 'fiqh-prayer',
    label: 'الصلاة',
    sampleQuestion: 'ما حكم من نسي ... في الصلاة؟ وهل عليه سجود سهو؟',
    type: AnswerType.Fiqh,
    tag: 'صلاة'
  },
  {
    id: 'fiqh-zakat',
    label: 'الزكاة',
    sampleQuestion: 'كيف أحسب زكاة مالي في ...؟ وهل تجب الزكاة على ...؟',
    type: AnswerType.Fiqh,
    tag: 'زكاة'
  },
  {
    id: 'fiqh-fasting',
    label: 'الصوم',
    sampleQuestion: 'ما حكم الصائم إذا ... في نهار رمضان؟',
    type: AnswerType.Fiqh,
    tag: 'صيام'
  },
  {
    id: 'fiqh-hajj',
    label: 'الحج والعمرة',
    sampleQuestion: 'أريد معرفة مناسك ... وما حكم من ترك ...؟',
    type: AnswerType.Fiqh,
    tag: 'حج'
  },

  // --- المعاملات والأسرة ---
  {
    id: 'fiqh-family',
    label: 'أحكام الأسرة',
    sampleQuestion: 'ما حكم الشرع في مسألة (الزواج/الطلاق/النفقة/الحضانة)...؟',
    type: AnswerType.Fiqh,
    tag: 'أسرة'
  },
  {
    id: 'fiqh-transactions',
    label: 'فقه المعاملات',
    sampleQuestion: 'ما حكم البيع والشراء في ... وهل هذا العقد صحيح؟',
    type: AnswerType.Fiqh,
    tag: 'بيوع'
  },
  {
    id: 'fiqh-modern',
    label: 'معاملات معاصرة',
    sampleQuestion: 'ما حكم التعامل بالعملات الرقمية/البنوك الإلكترونية/التورق...؟',
    type: AnswerType.Fiqh,
    tag: 'اقتصاد'
  },

  // --- العقيدة والسيرة ---
  {
    id: 'aqidah-general',
    label: 'العقيدة',
    sampleQuestion: 'ما هو القول الصحيح في مسألة عقدية تتعلق بـ...؟',
    type: AnswerType.Fiqh,
    tag: 'عقيدة'
  },
  {
    id: 'seerah-prophet',
    label: 'السيرة النبوية',
    sampleQuestion: 'حدثني عن موقف النبي ﷺ في ... وكيف تعامل مع ...؟',
    type: AnswerType.Hadith,
    tag: 'سيرة'
  },

  // --- أخرى ---
  {
    id: 'dream-interpret',
    label: 'تفسير الأحلام',
    sampleQuestion: 'رأيت في المنام... أرجو التفسير.',
    type: AnswerType.Dreams,
    warning: 'تنبيه: تفسير الأحلام ظني ولا يبنى عليه أحكام قاطعة.',
    tag: 'رؤى'
  },
  {
    id: 'faq-general',
    label: 'الأسئلة الشائعة',
    sampleQuestion: 'ما هي أكثر الأسئلة شيوعاً حول موضوع...؟',
    type: AnswerType.Fiqh,
    tag: 'شائع'
  }
];

/**
 * دالة لتخصيص القوالب بناءً على المذهب الفقهي المختار
 * @param currentSchool المذهب الحالي المختار في التطبيق
 * @returns قائمة قوالب معدلة النصوص لتناسب المذهب
 */
export const getAdaptiveTemplates = (currentSchool: FiqhSchool): QuestionTemplate[] => {
  const madhhabPhrasing: Record<string, string> = {
    [FiqhSchool.Hanafi]: 'عند السادة الأحناف',
    [FiqhSchool.Maliki]: 'في المشهور عند المالكية',
    [FiqhSchool.Shafii]: 'وفق المعتمد عند الشافعية',
    [FiqhSchool.Hanbali]: 'عند السادة الحنابلة',
  };

  const suffix = madhhabPhrasing[currentSchool] || '';

  return QUICK_ACTION_TEMPLATES.map(template => {
    
    // Special Handling for Khutbah Templates (Complete replacement based on school)
    if (template.id === 'khutbah-prep') {
      let madhhabInstruction = "";
      switch (currentSchool) {
        case FiqhSchool.Hanafi:
          madhhabInstruction = "**متطلبات شرعية:**\n- التزم بالأحكام والآداب المعتمدة في المذهب الحنفي.";
          break;
        case FiqhSchool.Maliki:
          madhhabInstruction = "**متطلبات شرعية:**\n- التزم بالأحكام والآداب المعتمدة في المذهب المالكي.";
          break;
        case FiqhSchool.Shafii:
          madhhabInstruction = "**متطلبات شرعية:**\n- التزم بالأحكام والآداب المعتمدة في المذهب الشافعي.";
          break;
        case FiqhSchool.Hanbali:
          madhhabInstruction = "**متطلبات شرعية:**\n- التزم بالأحكام والآداب المعتمدة في المذهب الحنبلي.";
          break;
        default:
          madhhabInstruction = "**متطلبات شرعية:**\n- التزم بمنهج أهل السنة والجماعة العام.";
          break;
      }
      
      return {
        ...template,
        sampleQuestion: KHUTBAH_BASE_PROMPT.replace('MADHHAB_PLACEHOLDER', madhhabInstruction)
      };
    }

    // Standard handling for Fiqh templates (Suffix appending)
    if (template.type === AnswerType.Fiqh && template.id !== 'aqidah-general' && currentSchool !== FiqhSchool.General) {
      let newQuestion = template.sampleQuestion;
      
      if (newQuestion.includes('ما حكم')) {
        newQuestion = newQuestion.replace('ما حكم', `ما حكم (${suffix})`);
      } else if (newQuestion.includes('ما هو الحكم')) {
        newQuestion = newQuestion.replace('ما هو الحكم الشرعي', `ما هو الحكم الشرعي ${suffix}`);
      } else {
        newQuestion = `${newQuestion} (${suffix})`;
      }

      return {
        ...template,
        sampleQuestion: newQuestion
      };
    }
    
    return template;
  });
};