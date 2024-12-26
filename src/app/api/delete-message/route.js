import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/utils/db";
export async function DELETE(request) {
  const { db } = await connectToDatabase();
  const { sessionID, userId } = await request.json();

  if (!sessionID || !userId) {
    return NextResponse.json({ error: "Missing sessionID or userId" }, { status: 400 });
  }

  // Find messages with the given sessionID
  const messages = await db
    .collection("chatMessages")
    .find({ sessionID })
    .toArray();

  console.log(`${sessionID} Message: `, messages);

  // Check if any messages were found
  if (messages.length === 0) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  // Verify that the userId matches the user_id in the found message
  if (messages[0].user_id !== userId) {
    return NextResponse.json(
      { error: "Unauthorized: User ID does not match the message owner" },
      { status: 403 }
    );
  }

  // If verification passes, proceed with deletion
  const result = await db
    .collection("chatMessages")
    .deleteMany({ sessionID, user_id: userId });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Message deleted successfully!" });
}