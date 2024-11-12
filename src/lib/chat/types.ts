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

// export interface FormattedResponse {
//   content: {
//     raw: string;
//     html: string;
//     blocks?: {
//       type: string;
//       content: string;
//     }[];
//   };
//   metadata: {
//     hasCode: boolean;
//     codeLanguages: string[];
//     format: "markdown" | "text";
//   };
// }
