
/**
 * Project: Al-Athar Al-Tayyeb (الفقيه الافتراضي)
 * Developer: تطوير فريق الأثر الطيب
 * Purpose: AI-Powered Fiqh Assistant using Gemini API
 * Date: 2025
 */

import { ChatSettings, Message, MuftiResponse } from "../types";

/**
 * المحرك الرئيسي للتواصل مع "الفقيه الافتراضي" عبر Gemini API.
 */
export const askMuftiAI = async (
  currentMessage: string,
  history: Message[],
  settings: ChatSettings
): Promise<MuftiResponse> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentMessage,
        history,
        settings
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();

    return {
      message: rawData.message,
      reference: rawData.references?.[0],
      level: rawData.level,
      madhhab: rawData.madhhab,
      escalation_flag: rawData.escalation_flag,
      adaptiveQuestions: rawData.adaptiveQuestions || []
    };

  } catch (error: any) {
    // Check if it's a network error (like "Failed to fetch") or a 500+ server error
    let errorMessage = "عذراً، حدث خطأ في معالجة طلبك الشرعي. يرجى مراجعة عالم مختص.";
    
    if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
      errorMessage = "تعذر الاتصال بالخادم، تأكد من اتصالك بالإنترنت وأعد المحاولة.";
    } else if (error.message.includes('HTTP error! status: 50')) {
      errorMessage = "عذراً، الخادم يواجه ضغطاً حالياً. يرجى المحاولة بعد قليل.";
    } else if (error.message.includes('HTTP error! status: 429')) {
      errorMessage = "عذراً، لقد تجاوزنا الحد المسموح به من الأسئلة حالياً (الضغط مرتفع). يرجى المحاولة لاحقاً.";
    }

    return {
      message: errorMessage,
      level: "اجتهادي",
      madhhab: settings.school,
      escalation_flag: false,
      adaptiveQuestions: []
    };
  }
};
