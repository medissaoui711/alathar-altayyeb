import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { ChatSettings, Message, MuftiResponse } from "../../../types";
import { evaluateResponse } from "../../../utils/evaluationEngine";

interface RequestBody {
  currentMessage: string;
  history: Message[];
  settings: ChatSettings;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RequestBody;
  const { currentMessage, history, settings } = body;

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    return NextResponse.json<MuftiResponse>(
      {
        message:
          "مفتاح واجهة Gemini غير مهيأ على الخادم. يرجى ضبط GEMINI_API_KEY في إعدادات البيئة.",
        level: "اجتهادي",
        madhhab: settings.school,
        escalation_flag: false,
        adaptiveQuestions: [],
      },
      { status: 500 }
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelId = settings.model || "gemini-3-flash-preview";

  try {
    const systemInstruction = `
      أنت "الأثر الطيب"، فقيه افتراضي مساعد وباحث شرعي ذكي. 
      مهمتك هي تقديم إجابات استرشادية دقيقة بناءً على الكتاب والسنة ومنهج علماء الأمة، مع الالتزام التام بالمذهب: ${settings.school}.

      الضوابط الشرعية والفنية:
      1. الالتزام المذهبي: يجب أن تكون الإجابة والمصطلحات الفقهية متوافقة تماماً مع مذهب ${settings.school}.
      2. الاستدلال: اذكر الأدلة بوضوح مع عزوها لمصادرها الأصلية.
      3. القضايا المصيرية: في مسائل (الطلاق، الجنايات، المواريث، التكفير)، اجعل الإجابة مقتضبة وحذر المستخدم من الاعتماد الكلي على الذكاء الاصطناعي، وفعل علامة (escalation_flag: true).
      4. تفسير الأحلام: إذا كان السؤال عن رؤيا، ابدأ دائماً بعبارة "الأحلام تسر ولا تغر" واستخدم لغة ظنية (لعلها، ربما) ولا تجزم بوقوع شيء.
      5. الأدب الشرعي: اختم دائماً بعبارة "والله أعلم".
      6. ميزة الأسئلة التكييفية (Adaptive Questions): يجب عليك دائماً توليد 3 أسئلة استقصائية قصيرة وذكية تساعد المستخدم على استكشاف أبعاد أخرى للمسألة. اجعل الأسئلة تثير الفضول الفقهي وتساعد في ضبط سياق الحالة (مثل: "ماذا لو تكرر هذا الفعل؟" أو "هل يختلف الحكم في حال السفر؟").

      السياق الحالي للبحث: ${settings.type}
    `;

    const contents = history.slice(-8).map((msg) => ({
      role: msg.role === "user" ? "user" : ("model" as const),
      parts: [{ text: msg.content }],
    }));

    contents.push({
      role: "user" as const,
      parts: [{ text: currentMessage }],
    });

    const response = await ai.models.generateContent({
      model: modelId,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: {
              type: Type.STRING,
              description: "الإجابة الشرعية الأساسية المفصلة.",
            },
            references: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "اسم المصدر أو الكتاب.",
                  },
                  text: {
                    type: Type.STRING,
                    description: "نص الدليل الشرعي.",
                  },
                  pageOrSource: {
                    type: Type.STRING,
                    description: "رقم الحديث أو الصفحة.",
                  },
                  status: {
                    type: Type.STRING,
                    enum: ["Trusted", "Under Review"],
                  },
                },
                required: ["title", "text", "pageOrSource", "status"],
              },
            },
            level: {
              type: Type.STRING,
              enum: ["مؤكد", "مرجّح", "اجتهادي", "يحتاج مراجعة بشرية"],
            },
            madhhab: {
              type: Type.STRING,
            },
            escalation_flag: {
              type: Type.BOOLEAN,
            },
            adaptiveQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                "3 أسئلة متابعة ذكية ومرتبطة بسياق الإجابة الحالية.",
            },
          },
          required: ["message", "level", "madhhab", "escalation_flag", "adaptiveQuestions"],
        },
      },
      contents,
    });

    const text = response.text || "{}";
    const rawData = JSON.parse(text);

    const evaluation = evaluateResponse(
      currentMessage,
      rawData.message || "",
      settings.school
    );

    const result: MuftiResponse = {
      message: evaluation.sanitizedAnswer,
      reference: rawData.references?.[0],
      level: evaluation.confidenceLevel,
      madhhab: rawData.madhhab || settings.school,
      escalation_flag: rawData.escalation_flag || evaluation.needsEscalation,
      adaptiveQuestions: rawData.adaptiveQuestions || [],
    };

    return NextResponse.json<MuftiResponse>(result);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json<MuftiResponse>(
      {
        message:
          "عذراً، حدث خطأ في معالجة طلبك الشرعي. يرجى مراجعة عالم مختص.",
        level: "اجتهادي",
        madhhab: settings.school,
        escalation_flag: false,
        adaptiveQuestions: [],
      },
      { status: 500 }
    );
  }
}

