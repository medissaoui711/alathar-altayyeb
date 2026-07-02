import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import OpenAI from "openai";
import { ChatSettings, Message, MuftiResponse } from "../../../types";
import { evaluateResponse } from "../../../utils/evaluationEngine";

interface RequestBody {
  currentMessage: string;
  history: Message[];
  settings: ChatSettings & {
    provider?: "gemini" | "deepseek";
  };
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RequestBody;
  const { currentMessage, history, settings } = body;
  const provider = settings.provider || "gemini";
  const modelId =
    settings.model ||
    (provider === "deepseek" ? "deepseek-chat" : "gemini-3-flash-preview");

  try {
    const systemInstruction = `
      أنت الآن محرك "الأثر الطيب"، فقيه افتراضي مساعد وباحث شرعي ذكي. 
      وظيفتك الإجابة على الأسئلة الفقهية بناءً على المتون الموثقة ومنهج علماء الأمة. التزم بالدقة والوقار وذكر المصدر، مع الالتزام التام بالمذهب: ${settings.school || 'الراجح بالدليل'}.

      الضوابط الشرعية والفنية:
      1. الالتزام المذهبي: يجب أن تكون الإجابة والمصطلحات الفقهية متوافقة تماماً مع مذهب ${settings.school || 'الراجح بالدليل'}.
      2. الاستدلال: اذكر الأدلة بوضوح مع عزوها لمصادرها الأصلية.
      3. القضايا المصيرية: في مسائل (الطلاق، الجنايات، المواريث، التكفير)، اجعل الإجابة مقتضبة وحذر المستخدم من الاعتماد الكلي على الذكاء الاصطناعي، وفعل علامة (escalation_flag: true).
      4. تفسير الأحلام: إذا كان السؤال عن رؤيا، ابدأ دائماً بعبارة "الأحلام تسر ولا تغر" واستخدم لغة ظنية (لعلها، ربما) ولا تجزم بوقوع شيء.
      5. الأدب الشرعي: اختم دائماً بعبارة "والله أعلم".
      6. ميزة الأسئلة التكييفية (Adaptive Questions): يجب عليك دائماً توليد 3 أسئلة استقصائية قصيرة وذكية تساعد المستخدم على استكشاف أبعاد أخرى للمسألة. اجعل الأسئلة تثير الفضول الفقهي وتساعد في ضبط سياق الحالة (مثل: "ماذا لو تكرر هذا الفعل؟" أو "هل يختلف الحكم في حال السفر؟").
      7. الدقة الفقهية: التزم بالمتون الموثقة التي سأقدمها لك فقط (أو المتاحة في قاعدة بياناتك الموثوقة).

      يجب أن تعيد الإجابة بصيغة JSON حصراً بالبنية التالية:
      {
        "message": "الإجابة الشرعية الأساسية المفصلة.",
        "references": [
          {
            "title": "اسم المصدر أو الكتاب.",
            "text": "نص الدليل الشرعي.",
            "pageOrSource": "رقم الحديث أو الصفحة.",
            "status": "Trusted"
          }
        ],
        "level": "مؤكد" | "مرجّح" | "اجتهادي" | "يحتاج مراجعة بشرية",
        "madhhab": "اسم المذهب",
        "escalation_flag": false,
        "adaptiveQuestions": ["سؤال 1", "سؤال 2", "سؤال 3"]
      }
    `;

    const contents = history.slice(-8).map((msg) => ({
      role: (msg.role === "user" ? "user" : "assistant") as "user" | "assistant",
      content: msg.content,
    }));
    contents.push({ role: "user" as "user" | "assistant", content: currentMessage });

    let rawData: any;

    if (provider === "deepseek") {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        return NextResponse.json<MuftiResponse>(
          {
            message: "مفتاح DeepSeek غير مهيأ على الخادم.",
            level: "اجتهادي",
            madhhab: settings.school,
            escalation_flag: false,
            adaptiveQuestions: [],
          },
          { status: 500 }
        );
      }

      const client = new OpenAI({
        apiKey,
        baseURL: "https://api.deepseek.com/v1",
      });

      const response = await client.chat.completions.create({
        model: modelId,
        messages: [
          { role: "system", content: systemInstruction },
          ...contents,
        ] as any,
        response_format: { type: "json_object" },
      });

      rawData = JSON.parse(response.choices[0]?.message?.content || "{}");
    } else {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        return NextResponse.json<MuftiResponse>(
          {
            message: "مفتاح Gemini غير مهيأ على الخادم.",
            level: "اجتهادي",
            madhhab: settings.school,
            escalation_flag: false,
            adaptiveQuestions: [],
          },
          { status: 500 }
        );
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: modelId,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
        contents: [
          ...history.slice(-8).map((msg) => ({
            role: msg.role === "user" ? "user" : ("model" as const),
            parts: [{ text: msg.content }],
          })),
          { role: "user" as const, parts: [{ text: currentMessage }] },
        ],
      });

      rawData = JSON.parse(response.text || "{}");
    }

    const evaluation = evaluateResponse(
      currentMessage,
      rawData.message || "",
      settings.school
    );

    return NextResponse.json<MuftiResponse>({
      message: evaluation.sanitizedAnswer,
      reference: rawData.references?.[0],
      level: evaluation.confidenceLevel,
      madhhab: rawData.madhhab || settings.school,
      escalation_flag: Boolean(rawData.escalation_flag || evaluation.needsEscalation),
      adaptiveQuestions: Array.isArray(rawData.adaptiveQuestions)
        ? rawData.adaptiveQuestions.slice(0, 3)
        : [],
    });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json<MuftiResponse>(
      {
        message: "عذراً، حدث خطأ في معالجة طلبك.",
        level: "اجتهادي",
        madhhab: settings.school,
        escalation_flag: false,
        adaptiveQuestions: [],
      },
      { status: 500 }
    );
  }
}