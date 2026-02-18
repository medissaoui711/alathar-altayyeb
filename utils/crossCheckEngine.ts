
import { MADHHAB_KEYWORDS, TRUSTED_HADITH_SOURCES, QURAN_INDICATORS } from "../data/knowledgeBase";
import { FiqhSchool } from "../types";

interface CrossCheckResult {
  score: number; // 0 to 100
  isReliable: boolean;
  notes: string[];
}

// Terms that indicate absolute judgment which should be avoided in non-definitive matters
const ABSOLUTE_TERMS = ['قطعاً', 'مطلقاً', 'بإجماع الأمة', 'لا خلاف', 'كفر', 'شرك'];

/**
 * حساب درجة التحقق من صحة الرد ومطابقته
 * @param answer نص الإجابة
 * @param targetSchool المذهب المطلوب
 */
export const runCrossCheck = (answer: string, targetSchool?: string): CrossCheckResult => {
  let score = 60; // درجة البداية (حيادية)
  const notes: string[] = [];

  // 1. فحص الاستدلال القرآني (Presence of Quran Citation)
  const hasQuran = QURAN_INDICATORS.some(indicator => answer.includes(indicator));
  if (hasQuran) {
    // تحقق بسيط: هل يوجد نص بين أقواس أو علامات تنصيص بعد المؤشر؟
    if (answer.match(/["«](.*?)["»]/) || answer.length > 200) {
      score += 15;
    }
  }

  // 2. فحص الاستدلال بالحديث (Presence of Hadith Source)
  const hasHadithSource = TRUSTED_HADITH_SOURCES.some(source => answer.includes(source));
  if (hasHadithSource) {
    score += 15;
  } else if (answer.includes("قال رسول الله") && !hasHadithSource) {
    // ذكر حديث بدون مصدر معروف
    score -= 10;
    notes.push("تم ذكر حديث نبوي دون عزو لمصدر مشهور (مثل البخاري أو مسلم).");
  }

  // 3. مطابقة المذهب (Madhhab Compliance)
  if (targetSchool && targetSchool !== FiqhSchool.General) {
    const keywords = MADHHAB_KEYWORDS[targetSchool] || [];
    const matchesSchool = keywords.some(k => answer.includes(k));
    
    if (matchesSchool) {
      score += 15;
    } else {
      // إذا كانت الإجابة طويلة ولم تذكر أي مصطلح للمذهب المطلوب
      if (answer.length > 300) {
        score -= 10;
        notes.push(`لم يتم رصد مصطلحات أو علماء بارزين من المذهب ${targetSchool} في الإجابة.`);
      }
    }
  }

  // 4. فحوصات الجودة العامة والقطعية
  if (answer.length < 50) {
    score -= 30; // إجابة قصيرة جداً قد تكون غير مفيدة
    notes.push("الإجابة مقتضبة جداً وقد لا تكون كافية.");
  }

  if (answer.includes("لا أعلم") || answer.includes("لست متأكداً")) {
    score -= 20; // اعتراف بعدم المعرفة
  }

  // Penalty for absolute terms if evidence is weak (score < 75 so far)
  // This implements: "خلوّ الرد من الحكم القطعي في مسائل الظن"
  const hasAbsoluteTerms = ABSOLUTE_TERMS.some(term => answer.includes(term));
  if (hasAbsoluteTerms && score < 75) {
    score -= 15;
    notes.push("تم استخدام عبارات قطعية (مثل قطعاً/إجماع) دون وجود مؤشرات قوية للأدلة.");
  }

  // تصحيح الحدود
  score = Math.min(100, Math.max(0, score));

  return {
    score,
    isReliable: score >= 40, // حسب المخطط: أقل من 40 غير موثوق
    notes
  };
};
