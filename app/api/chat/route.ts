import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { evaluateResponse } from "@/utils/evaluationEngine";

export async function POST(req: NextRequest) {
  try {
    const { currentMessage, history, settings } = await req.json();
    const modelId = settings?.model || 'gemini-3-flash-preview';

    const systemInstruction = `
      أنت الآن محرك "الأثر الطيب"، فقيه افتراضي مساعد وباحث شرعي ذكي. 
      وظيفتك الإجابة على الأسئلة الفقهية بناءً على المتون الموثقة ومنهج علماء الأمة. التزم بالدقة والوقار وذكر المصدر، مع الالتزام التام بالمذهب: ${settings?.school || 'الراجح بالدليل'}.

      الضوابط الشرعية والفنية:
      1. الالتزام المذهبي: يجب أن تكون الإجابة والمصطلحات الفقهية متوافقة تماماً مع مذهب ${settings?.school || 'الراجح بالدليل'}.
      2. الاستدلال: اذكر الأدلة بوضوح مع عزوها لمصادرها الأصلية.
      3. القضايا المصيرية: في مسائل (الطلاق، الجنايات، المواريث، التكفير)، اجعل الإجابة مقتضبة وحذر المستخدم من الاعتماد الكلي على الذكاء الاصطناعي، وفعل علامة (escalation_flag: true).
      4. تفسير الأحلام: إذا كان السؤال عن رؤيا، ابدأ دائماً بعبارة "الأحلام تسر ولا تغر" واستخدم لغة ظنية (لعلها، ربما) ولا تجزم بوقوع شيء.
      5. الأدب الشرعي: اختم دائماً بعبارة "والله أعلم".
      6. ميزة الأسئلة التكييفية (Adaptive Questions): يجب عليك دائماً توليد 3 أسئلة استقصائية قصيرة وذكية تساعد المستخدم على استكشاف أبعاد أخرى للمسألة. اجعل الأسئلة تثير الفضول الفقهي وتساعد في ضبط سياق الحالة (مثل: "ماذا لو تكرر هذا الفعل؟" أو "هل يختلف الحكم في حال السفر؟").
      7. الدقة الفقهية: التزم بالمتون الموثقة التي سأقدمها لك فقط (أو المتاحة في قاعدة بياناتك الموثوقة).

      السياق الحالي للبحث: ${settings?.type || 'سؤال مباشر'}
    `;

    const contents = history.slice(-8).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    contents.push({
      role: "user",
      parts: [{ text: currentMessage }],
    });

    let rawData: any;

    if (process.env.OPENROUTER_API_KEY) {
      // Map to OpenRouter model IDs
      let openRouterModel = 'google/gemini-2.5-flash';
      if (modelId.includes('pro')) {
        openRouterModel = 'google/gemini-2.5-pro';
      }

      const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://alathar-altayyeb.vercel.app",
          "X-Title": "Al-Athar Al-Tayyeb",
        },
        body: JSON.stringify({
          model: openRouterModel,
          messages: [
            { role: "system", content: systemInstruction + "\n\nIMPORTANT: You must respond ONLY with a raw JSON object matching the requested schema. Do not enclose it in markdown blocks or any other formatting." },
            ...history.slice(-8).map((msg: any) => ({
              role: msg.role === "user" ? "user" : "assistant",
              content: msg.content
            })),
            { role: "user", content: currentMessage }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!orResponse.ok) {
        const errorText = await orResponse.text();
        throw new Error(`OpenRouter API error! status: ${orResponse.status} - ${errorText}`);
      }

      const data = await orResponse.json();
      const text = data.choices?.[0]?.message?.content || "{}";
      rawData = JSON.parse(text);
    } else {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: modelId,
        config: {
          systemInstruction: systemInstruction,
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
                    title: { type: Type.STRING, description: "اسم المصدر أو الكتاب." },
                    text: { type: Type.STRING, description: "نص الدليل الشرعي." },
                    pageOrSource: { type: Type.STRING, description: "رقم الحديث أو الصفحة." },
                    status: { type: Type.STRING, enum: ["Trusted", "Under Review"] }
                  },
                  required: ["title", "text", "pageOrSource", "status"]
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
                description: "3 أسئلة متابعة ذكية ومرتبطة بسياق الإجابة الحالية.",
              }
            },
            required: ["message", "level", "madhhab", "escalation_flag", "adaptiveQuestions"],
          },
        },
        contents: contents,
      });

      const text = response.text || "{}";
      rawData = JSON.parse(text);
    }

    // Apply evaluation engine
    const evaluation = evaluateResponse(currentMessage, rawData.message, settings?.school);
    
    // Merge evaluation results
    const finalData = {
      ...rawData,
      message: evaluation.sanitizedAnswer,
      level: evaluation.confidenceLevel,
      escalation_flag: evaluation.needsEscalation,
      evaluationWarnings: evaluation.warnings,
      evaluationReasons: evaluation.reasons,
      detectedTopic: evaluation.detectedTopic
    };

    return NextResponse.json(finalData);

  } catch (error: any) {
    // Determine the status code based on the error
    let status = 500;
    if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("Quota")) {
      status = 429;
    }

    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || String(error) },
      { status }
    );
  }
}
