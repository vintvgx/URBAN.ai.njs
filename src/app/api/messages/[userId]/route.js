import { connectToDatabase } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const userId = params.userId;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();

    const conversations = await db
      .collection("chatMessages")
      .find({ user_id: userId })
      .sort({ "messages.timestamp": 1 })
      .toArray();

    const chatHistory = conversations.map((conv) => ({
      sessionID: conv.sessionID,
      messages: conv.messages,
    }));

    chatHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return NextResponse.json(chatHistory);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching messages: " + error.message },
      { status: 500 }
    );
  }
}
