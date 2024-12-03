import { connectToDatabase } from "@/utils/db";

export async function DELETE(request) {
  const { db } = await connectToDatabase();
  const { sessionID, userId } = await request.json();

  if (!sessionID || !userId) {
    return NextResponse.json({ error: "Missing sessionID or userId" }, { status: 400 });
  }

  const result = await db   
    .collection("chatMessages")
    .deleteOne({ sessionID, user_id: userId });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Message deleted successfully!" });
}
