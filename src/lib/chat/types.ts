// Types
export interface IMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  sessionID?: string;
  createdAt?: Date;
}

export interface ChatSession {
  sessionID: string;
  messages: IMessage[];
}

export interface SendMessageResponse {
  message: string;
}
