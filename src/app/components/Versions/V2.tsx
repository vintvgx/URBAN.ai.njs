import React from "react";
import { ChatSession, IMessage, InputElementType } from "@/lib/chat/types";
import { cn } from "@/lib/utils";
import RichTextRenderer from "../RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  SendHorizontal,
  Sparkles,
  MessageSquare,
  Lightbulb,
  Smile,
  Camera,
  Activity,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { BaseUser } from "@/lib/auth/types";
import ChatLoadingAnimation from "../Chat/ChatLoadingAnimation";
import AuthLoadingAnimation from "../Auth/AuthLoadingAnimation";

interface V2Props {
  user: BaseUser | null;
  authLoading: boolean;
  selectedChat: ChatSession | null;
  chatMessages: IMessage[] | null;
  containerRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<InputElementType>;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleMessageSubmission: (query?: string) => void;
  isProcessing: boolean;
}

const V2: React.FC<V2Props> = ({
  user,
  authLoading,
  chatMessages,
  containerRef,
  inputRef,
  inputValue,
  setInputValue,
  handleMessageSubmission,
  isProcessing,
}) => {
  const exampleQueries = [
    {
      icon: <MessageSquare className="w-4 h-4" />,
      text: "What's the tea on the latest celeb drama?",
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      text: "Can you help me glow up my weekend plans?",
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      text: "Yo, break it down: What's the latest buzz with AI?",
    },
    {
      icon: <Smile className="w-4 h-4" />,
      text: "What's a savage comeback if someone says 'You're so basic'?",
    },
    {
      icon: <Activity className="w-4 h-4" />,
      text: "Feeling extra today—any tips on staying cool?",
    },
    {
      icon: <Camera className="w-4 h-4" />,
      text: "Hit me with some fire captions for my next selfie!",
    },
  ];

  return (
    <div className="flex-1 p-6 flex flex-col">
      {chatMessages ? (
        <div className="flex-1 space-y-4 overflow-auto max-h-[calc(100vh-15rem)] w-10/12 self-center">
          {chatMessages?.map((message: IMessage, index: number) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.role === "user" ? "justify-start" : "justify-end"
              )}>
              <div
                className={cn(
                  "rounded-lg",
                  message.role === "user"
                    ? "user-message"
                    : "bot-message bg-muted ml-auto"
                )}>
                {message.role === "assistant" &&
                typeof message.content === "object" ? (
                  <RichTextRenderer content={message.content} />
                ) : (
                  <p>{message.content.toString()}</p>
                )}
              </div>
            </div>
          ))}
          {isProcessing && <ChatLoadingAnimation />}
        </div>
      ) : (
        <div
          className={cn(
            "flex-1 p-6 flex flex-col items-center",
            chatMessages ? "justify-end" : "justify-center",
            "max-w-3xl mx-auto w-full"
          )}>
          <div
            className={cn(
              "transition-all duration-300 mb-8",
              chatMessages ? "opacity-0" : "opacity-100"
            )}>
            {authLoading ? (
              <AuthLoadingAnimation />
            ) : user ? (
              <h2 className="text-2xl font-semibold text-center dark:text-white">
                Welcome back, {user?.displayName?.split(" ")[0]}
              </h2>
            ) : (
              <h2 className="text-2xl font-semibold text-center dark:text-white">
                What&apos;s the word?
              </h2>
            )}
          </div>
          <div ref={containerRef} className="w-full max-w-2xl space-y-6">
            <div className="relative">
              <Input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                className="w-full text-base p-4 pr-12 bg-background border-border rounded-lg dark:bg-[#1e1e1e] dark:border-gray-800"
                placeholder="Type your message here..."
                value={inputValue}
                autoCapitalize="on"
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    handleMessageSubmission();
                  }
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => handleMessageSubmission()}
                disabled={!inputValue.trim()}>
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {exampleQueries.map((query, i) => (
                <button
                  key={i}
                  onClick={() => handleMessageSubmission(query.text)}
                  className="flex items-center gap-3 p-4 text-left rounded-lg border border-gray-800 bg-background hover:bg-muted transition-colors duration-200 dark:bg-[#1e1e1e] dark:border-gray-800 dark:hover:bg-[#2a2a2a] group">
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    {query.icon}
                  </span>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    {query.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {chatMessages && (
        <div
          ref={containerRef}
          className={cn(
            "w-full space-y-4 transition-all duration-300 flex justify-center  mt-4",

            chatMessages ? "opacity-100" : "opacity-0"
          )}>
          <div className="relative w-10/12 max-w-2xl">
            <Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              className="w-full text-base p-4 pr-12 bg-background border-border rounded-lg dark:bg-[#1e1e1e] dark:border-gray-800"
              placeholder="Type your message here..."
              value={inputValue}
              autoCapitalize="on"
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim()) {
                  handleMessageSubmission();
                }
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => handleMessageSubmission()}
              disabled={!inputValue.trim()}>
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default V2;
