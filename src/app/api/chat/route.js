import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { message, chatHistory } = await request.json();

    const messages = [
      { role: "system", content: "You respond to queries using urban slang" },
      ...chatHistory,
      { role: "user", content: message },
    ];

    const response = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
      temperature: 0.5,
    });

    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
