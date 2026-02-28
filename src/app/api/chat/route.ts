import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { message, sourceIds, history } = await req.json();

    if (!message) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    // Fallback to Mock Mode if no API key is provided
    if (!apiKey) {
      return NextResponse.json({ 
        content: "I'm currently in Mock Mode because no Gemini API key was found. Once you add your key, I'll be able to analyze your sources in real-time!" 
      });
    }

    // Fetch source details from Supabase for context
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    let context = "No specific sources selected.";

    if (supabaseUrl && supabaseAnonKey && sourceIds && sourceIds.length > 0) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: sources } = await supabase
        .from('sources')
        .select('name, type, meta')
        .in('id', sourceIds);
      
      if (sources && sources.length > 0) {
        context = `The user has selected the following sources for this conversation:\n${sources.map(s => `- ${s.name} (${s.type})`).join('\n')}\n\nPlease use this context to answer questions accurately. If the user asks for details about these sources, use your knowledge as a product manager to provide insights based on their types and names.`;
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: history.map((h: any) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const fullPrompt = `Context:\n${context}\n\nUser Question: ${message}`;
    const result = await chat.sendMessage(fullPrompt);
    const response = await result.response;
    
    return NextResponse.json({ content: response.text() });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
