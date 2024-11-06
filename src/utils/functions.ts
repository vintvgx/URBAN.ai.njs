import { ChatSession, IMessage } from "@/lib/chat/types";

export function getUserInitials(
  displayName: string | null | undefined
): string {
  if (displayName) {
    const names = displayName.split(" ");
    const initials = names.map((name) => name.charAt(0).toUpperCase());
    return initials.join("");
  }
  return "U"; // default initials if user or display name is not available
}

export const extractTimestampFromSessionID = (sessionID: string): Date => {
  if (!sessionID || typeof sessionID !== "string") {
    console.error("Invalid sessionID provided:", sessionID);
    return new Date(0); // Default to a very early date for sorting purposes
  }

  const timestampString = sessionID.split("-")[0];
  return new Date(parseInt(timestampString, 10));
};

// Helper function to transform raw data to properly typed chat history
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformChatHistory(rawData: any[]): ChatSession[] {
  return rawData.map((session) => ({
    sessionID: session.sessionID,
    messages: session.messages.map((msg: IMessage) => ({
      role: msg.role as "user" | "bot",
      content: msg.content,
      timestamp: msg.timestamp,
      sessionID: msg.sessionID,
      createdAt: new Date(msg.timestamp),
    })),
  }));
}
