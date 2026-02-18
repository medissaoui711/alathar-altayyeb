
import { ConfidenceLevel } from "../types";
import { runCrossCheck } from "./crossCheckEngine";

export interface EvaluationResult {
  confidenceLevel: ConfidenceLevel;
  needsEscalation: boolean;
  reasons: string[];
  warnings: string[];
  sanitizedAnswer: string;
  detectedTopic: string;
  verificationScore?: number;
}

// قوائم الكلمات المفتاحية للكشف عن المواضيع الحساسة
const PATTERNS = {
  divorce: /طلاق|خلع|فسخ|أنت طالق|حرمت علي|تحرمي علي|عدة|رجعة/i,
  blood: /قتل|دماء|قصاص|دية|جرح|انتحار|إجهاض|ضرب|عنف/i,
  inheritance: /ميراث|ورث|تركة|وصية|أنصبة|فريضة/i,
  aqidah: /كفر|إلحاد|شرك|بدعة|سحر|شعوذة|غيبيات/i,
  financial: /ربا|قرض|فائدة|بنك|بورصة|أسهم|تداول|بيتكوين/i,
  dreams: /حلم|رؤيا|رأيت في المنام|حلمت|كابوس/i,
  evidence: /قال الله|قال تعالى|قال رسول|رواه|حديث|آية|سورة/i,
};

/**
 * تحديد نوع الموضوع بناءً على نص السؤال
 */
const detectTopic = (text: string): string => {
  if (PATTERNS.divorce.test(text)) return 'أحوال شخصية (طلاق/زواج)';
  if (PATTERNS.inheritance.test(text)) return 'مواريت';
  if (PATTERNS.blood.test(text)) return 'جنايات ودماء';
  if (PATTERNS.aqidah.test(text)) return 'عقيدة';
  if (PATTERNS.financial.test(text)) return 'معاملات مالية';
  if (PATTERNS.dreams.test(text)) return 'تفسير أحلام';
  return 'فقه عام';
};

/**
 * المحرك الرئيسي لتقييم الرد الشرعي
 * @param question نص سؤال المستخدم
 * @param aiResponse الرد الأولي من الذكاء الاصطناعي
 * @param targetMadhhab المذهب المطلوب من المستخدم
 */
export const evaluateResponse = (question: string, aiResponse: string, targetMadhhab?: string): EvaluationResult => {
  const result: EvaluationResult = {
    confidenceLevel: 'اجتهادي',
    needsEscalation: false,
    reasons: [],
    warnings: [],
    sanitizedAnswer: aiResponse,
    detectedTopic: detectTopic(question),
  };

  // 1. فحص التصعيد الإلزامي (Mandatory Escalation)
  if (PATTERNS.divorce.test(question)) {
    result.needsEscalation = true;
    result.confidenceLevel = 'يحتاج مراجعة بشرية';
    result.reasons.push("المسألة تتعلق بالطلاق وتتطلب فتوى مخصصة بناءً على اللفظ والنية.");
    result.warnings.push("تنبيه: مسائل الطلاق لا تؤخذ من التطبيقات الآلية، يرجى مراجعة دار الإفتاء أو المحكمة الشرعية.");
  }
  else if (PATTERNS.blood.test(question) || PATTERNS.inheritance.test(question)) {
    result.needsEscalation = true;
    result.confidenceLevel = 'يحتاج مراجعة بشرية';
    result.reasons.push("مسائل الدماء والمواريث تتطلب تدقيقاً قضائياً أو شرعياً خاصاً.");
  }
  else if (PATTERNS.aqidah.test(question)) {
    result.needsEscalation = true;
    result.confidenceLevel = 'يحتاج مراجعة بشرية';
    result.reasons.push("مسائل العقيدة والتكفير خطيرة جداً ولا يفتى فيها آلياً.");
  }

  // 2. التعامل مع الأحلام
  else if (PATTERNS.dreams.test(question)) {
    result.confidenceLevel = 'اجتهادي';
    result.detectedTopic = 'تفسير أحلام';
    result.warnings.push("تنبيه: الأحلام تسر ولا تغر، وتفسيرها ظني يختلف باختلاف حال الرائي.");
    
    if (!result.sanitizedAnswer.includes("الأحلام تسر ولا تغر")) {
        result.sanitizedAnswer = "تنبيه: تفسير الرؤى أمر ظني. " + result.sanitizedAnswer;
    }
  }

  // 3. Cross-Check Engine (Phase 13 Integration)
  // يتم تنفيذه إذا لم يكن الموضوع يتطلب تصعيداً إلزامياً بالفعل
  if (!result.needsEscalation) {
    const crossCheck = runCrossCheck(aiResponse, targetMadhhab);
    result.verificationScore = crossCheck.score;

    if (!crossCheck.isReliable) {
      result.confidenceLevel = 'يحتاج مراجعة بشرية';
      result.reasons.push(...crossCheck.notes);
      result.reasons.push(`درجة التحقق الآلي منخفضة (${crossCheck.score}/100).`);
      
      // إضافة تحذير إذا كان غير موجود
      if (!result.warnings.some(w => w.includes("التحقق"))) {
        result.warnings.push("تنبيه: الرد لم يجتز معايير التحقق الآلي الكاملة، يفضل مراجعة المصادر.");
      }
    } else {
      // منطق الثقة العادي إذا كان الرد موثوقاً
      const hasEvidence = PATTERNS.evidence.test(aiResponse);
      if (hasEvidence && crossCheck.score > 75) {
         result.confidenceLevel = 'مؤكد';
      } else if (hasEvidence) {
         result.confidenceLevel = 'مرجّح';
      } else {
         result.confidenceLevel = 'اجتهادي';
      }
    }
  }

  // 4. تنقيح الرد (Sanitization)
  const disclaimer = "\n\n(تنبيه: هذه إجابة استرشادية وليست فتوى)";
  if (!result.sanitizedAnswer.includes("إجابة استرشادية") && !result.sanitizedAnswer.includes("ليست فتوى")) {
    result.sanitizedAnswer += disclaimer;
  }

  return result;
};
