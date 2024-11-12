import { ChatSession, IMessage, SessionMetadata } from "@/lib/chat/types";
import { v4 as uuidv4 } from "uuid";

// Helper function to get user initials
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

  // Helper function to get first message content
  export const getFirstMessage = (chat: ChatSession) => {
    if (!chat.messages || chat.messages.length === 0) return "Empty chat";
    return chat.messages[0].content.toString();
  };

// Helper function to extract timestamp from sessionID
export const extractTimestampFromSessionID = (sessionID: string): Date => {
  if (!sessionID || typeof sessionID !== "string") {
    console.error("Invalid sessionID provided:", sessionID);
    return new Date(0); // Default to a very early date for sorting purposes
  }

  const timestampString = sessionID.split("-")[0];
  return new Date(parseInt(timestampString, 10));
};

// Helper function to format date
export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
  };
};

// Helper function to transform raw data to properly typed chat history
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformChatHistory(rawData: any[]): ChatSession[] {
  return rawData.map((session) => ({
    sessionID: session.sessionID,
    messages: session.messages.map((msg: IMessage) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
      timestamp: msg.timestamp,
      sessionID: msg.sessionID,
      createdAt: new Date(msg.timestamp),
    })),
    metadata: session.metadata,
  }));
}

/**
 * Updates existing session metadata or creates new metadata
 */
export const updateSessionMetadata = (
  existingMetadata?: SessionMetadata,
  userId?: string
): SessionMetadata => ({
  createdAt: existingMetadata?.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: existingMetadata?.userId || userId,
});

/**
 * Creates or updates a conversation session
 */
export const createOrUpdateSession = (
  messages: IMessage[],
  existingSession: ChatSession | null,
  userId?: string
): ChatSession => {
  // If we have an existing session, update it
  if (existingSession) {
    return {
      ...existingSession,
      messages,
      metadata: updateSessionMetadata(existingSession.metadata, userId),
    };
  }

  // If no existing session, create a new one
  return {
    sessionID: uuidv4(),
    messages,
    metadata: updateSessionMetadata(undefined, userId),
  };
};
