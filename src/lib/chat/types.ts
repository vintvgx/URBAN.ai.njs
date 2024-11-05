// Types
export interface IMessage {
  type: "user" | "bot";
  content: string;
  timestamp: string;
  sessionID: string;
  createdAt?: Date;
}

export interface ChatSession {
  sessionID: string;
  messages: IMessage[];
}
