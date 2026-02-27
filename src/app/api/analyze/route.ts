import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { sourceIds } = await req.json();

    if (!sourceIds || sourceIds.length === 0) {
      return NextResponse.json({ insights: [] });
    }

    // --- MOCK MODE ---
    // Simulating AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockInsights = [
      "73% of users report difficulties with feature prioritization in the current workflow.",
      "The manual synthesis of customer interviews is currently taking an average of 12 hours per sprint.",
      "Users are requesting a more direct connection between customer feedback and development planning.",
      "Automated feedback categorization is the most requested 'efficiency' feature among power users."
    ];

    return NextResponse.json({ insights: mockInsights });
  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
