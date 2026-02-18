
import { ChatSettings, Message, MuftiResponse } from "../types";

/**
 * واجهة عميل بسيطة تستدعي Route Handler الآمن في Next
 * بدلاً من استدعاء Gemini مباشرة من المتصفح.
 */
export const askMuftiAI = async (
  currentMessage: string,
  history: Message[],
  settings: ChatSettings
): Promise<MuftiResponse> => {
  const res = await fetch("/api/ask-mufti", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currentMessage, history, settings }),
  });

  if (!res.ok) {
    return {
      message:
        "عذراً، تعذّر الاتصال بالمحرك الشرعي في الوقت الحالي. يرجى المحاولة لاحقاً أو مراجعة عالم مختص.",
      level: "اجتهادي",
      madhhab: settings.school,
      escalation_flag: false,
      adaptiveQuestions: [],
    };
  }

  const data = (await res.json()) as MuftiResponse;
  return data;
};

