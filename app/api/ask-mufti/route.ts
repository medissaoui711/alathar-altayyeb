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
    const systemInstruction = `...`;

    const contents = history.slice(-8).map((msg) => ({
      role: msg.role === "user" ? "user" : ("assistant" as const),
      content: msg.content,
    }));

    contents.push({ role: "user", content: currentMessage });

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
        ],
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
