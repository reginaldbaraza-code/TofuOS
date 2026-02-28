import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withGeminiRetry, QUOTA_EXCEEDED_MESSAGE } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { sourceIds } = await req.json();

    if (!sourceIds || sourceIds.length === 0) {
      return NextResponse.json({ insights: [] });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    // Fallback to Mock Mode if no API key is provided
    if (!apiKey) {
      console.warn("GOOGLE_GEMINI_API_KEY not found. Using Mock Mode.");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return NextResponse.json({
        insights: [
          "73% of users report difficulties with feature prioritization in the current workflow.",
          "The manual synthesis of customer interviews is currently taking an average of 12 hours per sprint.",
          "Users are requesting a more direct connection between customer feedback and development planning.",
          "Automated feedback categorization is the most requested 'efficiency' feature among power users."
        ]
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `You are a product management assistant. Based on the following source identifiers (which represent customer interviews, reviews, and documents): ${sourceIds.join(', ')}.
    Generate 4 concise, actionable, and data-driven insights for a product team. 
    Return the response as a valid JSON object with a single key 'insights' containing an array of 4 strings.
    Example: {"insights": ["Insight 1", "Insight 2", "Insight 3", "Insight 4"]}`;

    const data = await withGeminiRetry(async () => {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanedText = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanedText);
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const isQuota = message.includes("429") || message.includes("quota") || message.includes("Too Many Requests") || message.includes("Quota exceeded");
    console.error('Gemini Analysis Error:', error);
    if (isQuota) {
      return NextResponse.json({ message: QUOTA_EXCEEDED_MESSAGE }, { status: 429 });
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
