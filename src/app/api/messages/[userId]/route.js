import { connectToDatabase } from "@/utils/db";
import { NextResponse } from "next/server";

/**
 * Get the chat history for a user
 * @param {Object} request - The request object
 * @param {Object} params - The parameters object
 * @returns {Object} The chat history
 */
export async function GET(request, { params }) {
  const { userId } = await params;

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
