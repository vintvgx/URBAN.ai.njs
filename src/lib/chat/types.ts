import { BaseUser, UserSettings } from "../auth/types";

// Types
export interface IMessage {
  role: "user" | "assistant" | "system";
  content: string | FormattedContent;
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
  message: string | FormattedContent;
}

export interface ContentBlock {
  type: string;
  content: string;
}

export interface FormattedContent {
  content: {
    raw: string;
    html: string;
    blocks?: ContentBlock[];
  };
  metadata: {
    hasCode: boolean;
    codeLanguages: string[];
    format: "markdown" | "text";
  };
}

export type InputElementType = HTMLInputElement | HTMLTextAreaElement;

// Update the VersionProps interface
export interface VersionProps {
  user: BaseUser | null;
  authLoading: boolean;
  selectedChat: ChatSession | null;
  chatMessages: IMessage[] | null;
  containerRef: React.RefObject<HTMLDivElement>;
  chatContainerRef: React.RefObject<HTMLDivElement>; // New ref for chat container
  inputRef: React.RefObject<InputElementType>; // Updated type here
  inputValue: string;
  setInputValue: (value: string) => void;
  handleMessageSubmission: (query?: string) => void;
  isProcessing: boolean;
  settings?: UserSettings;
}
