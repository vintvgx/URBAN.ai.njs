// Types
export interface IMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  sessionID?: string;
  createdAt?: Date;
}

export interface SessionMetadata {
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface ChatSession {
  sessionID: string;
  messages: IMessage[];
  metadata: SessionMetadata;
}
export interface SendMessageResponse {
  message: string;
}
