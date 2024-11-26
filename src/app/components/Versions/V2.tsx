import { ChatSession, IMessage } from "@/lib/chat/types";
import { cn } from "@/lib/utils";
import React from "react";
import RichTextRenderer from "../RichTextEditor";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
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
  inputRef: React.RefObject<HTMLInputElement>;
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
  return (
    <div className="flex-1 p-6 flex flex-col">
      {chatMessages ? (
        <div className="flex-1 space-y-4 overflow-auto max-h-[calc(100vh-12rem)] w-10/12 self-center">
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
                    ? "user-message "
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
            "flex-1 p-6 flex flex-col items-start",
            chatMessages ? "justify-end" : "justify-center",
            "max-w-2xl mx-auto w-full"
          )}>
          <div
            className={cn(
              "transition-all duration-300",
              chatMessages ? "opacity-0" : "opacity-100"
            )}>
            {authLoading ? (
              <AuthLoadingAnimation />
            ) : user ? (
              <p className="text-2xl mb-8 text-muted-foreground">
                Welcome back, {user?.displayName?.split(" ")[0]}
              </p>
            ) : (
              <p className="text-2xl mb-8 text-muted-foreground">
                What&apos;s the word?
              </p>
            )}
          </div>
          <div
            ref={containerRef}
            className={cn(
              "w-full space-y-4 transition-all duration-300",
              chatMessages ? "pb-4" : ""
            )}>
            <div className="flex gap-2">
              <div className="relative w-full">
                <Input
                  ref={inputRef}
                  className="w-full text-xl p-4 text-neutral-500/75 bg-neutral-900/[0.063] border-none rounded-2xl"
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
                  <SendHorizontal className="h-5 w-5 text-neutral-500" />
                </Button>
              </div>
            </div>
            {/* // TODO Place elements (requests) so user can press and enter and process through chat bot  */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
              {[
                "What's the tea on the latest celeb drama?",
                "Can you help me glow up my weekend plans?",
                "Yo, break it down: What's the vibe with AI these days?",
                "What's a savage comeback if someone says 'You're so basic'?",
                "Feeling extra today—any tips on staying cool?",
                "Hit me with some fire captions for my next selfie!",
              ].map((query, i) => (
                <button
                  key={i}
                  onClick={() => handleMessageSubmission(query)}
                  className="flex items-center justify-center h-24 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm text-gray-800 font-medium px-4 py-2 shadow-sm transition">
                  {query}
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
            "w-full space-y-4 transition-all duration-300 flex justify-center",
            chatMessages ? "opacity-100" : "opacity-0"
          )}>
          <div className="relative w-10/12">
            <Input
              ref={inputRef}
              className="w-full text-xl p-4 text-neutral-500/75 bg-neutral-900/[0.063] border-none rounded-2xl"
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
              <SendHorizontal className="h-5 w-5 text-neutral-500" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default V2;
