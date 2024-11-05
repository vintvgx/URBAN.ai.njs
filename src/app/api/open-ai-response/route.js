// app/api/open-ai-response/route.ts
import { OpenAI } from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Parse the request body
    const { message, chatHistory } = await request.json();
    console.log("🚀 ~ file: route.ts ~ POST ~ message:", message);

    // Construct messages array with system message
    const messages = [
      { role: "system", content: "You respond to queries using urban slang" },
      ...chatHistory, // Spread the chat history into the messages array
      { role: "user", content: message },
    ];

    // Make request to OpenAI
    const response = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
      max_tokens: 700,
      temperature: 0.7,
    });

    console.log("🚀 ~ file: route.ts ~ POST ~ response:", response);
    console.log(
      "🚀 ~ file: route.ts ~ POST ~ response content:",
      response.choices[0].message.content
    );

    // Check if choices array exists and has elements
    if (response.choices && response.choices.length > 0) {
      const messageObject = response.choices[0].message;

      // Check if message object exists
      if (messageObject) {
        const messageContent = messageObject.content;

        console.log(
          "🚀 ~ file: route.ts ~ POST ~ message content:",
          messageContent
        );
      } else {
        console.log("🚀 ~ file: route.ts ~ POST ~ No message object found");
        return NextResponse.json(
          { error: "No message object found in response" },
          { status: 500 }
        );
      }
    } else {
      console.log(
        "🚀 ~ file: route.ts ~ POST ~ No choices found in the response"
      );
      return NextResponse.json(
        { error: "No choices found in response" },
        { status: 500 }
      );
    }

    // Return the response
    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);

    // Handle specific error types
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: "OpenAI API error occurred" },
        { status: error.status || 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
