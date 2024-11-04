import { connectToDatabase } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { messages, userId, sessionID } = await request.json();
    const { db } = await connectToDatabase();

    const existingSession = await db
      .collection("chatMessages")
      .findOne({ sessionID });

    if (existingSession) {
      await db
        .collection("chatMessages")
        .updateOne({ sessionID }, { $set: { messages: messages } });
    } else {
      await db.collection("chatMessages").insertOne({
        user_id: userId,
        bot_id: "URBAN",
        messages: messages,
        sessionID,
      });
    }

    return NextResponse.json({ message: "Message stored successfully!" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error storing message: " + error.message },
      { status: 500 }
    );
  }
}
