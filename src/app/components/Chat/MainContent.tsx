import { ChatSession, IMessage } from "@/lib/chat/types";
import { cn } from "@/lib/utils";
import React from "react";
import RichTextRenderer from "../RichTextEditor";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MainContentProps {
  selectedChat: ChatSession | null;
  containerRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleMessageSubmission: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  selectedChat,
  containerRef,
  inputRef,
  inputValue,
  setInputValue,
  handleMessageSubmission,
}) => {
  return (
    <div className="flex-1 p-6 flex flex-col">
      {selectedChat ? (
        <div className="flex-1 space-y-4 overflow-auto max-h-[calc(100vh-12rem)]">
          {selectedChat.messages?.map((message: IMessage, index: number) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}>
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-4",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                )}>
                {message.role === "assistant" &&
                typeof message.content === "object" ? (
                  <RichTextRenderer content={message.content} />
                ) : (
                  <p className="text-sm">{message.content.toString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "flex-1 p-6 flex flex-col items-center transition-all duration-300",
            selectedChat ? "justify-end" : "justify-center",
            "max-w-2xl mx-auto w-full"
          )}>
          <div
            className={cn(
              "transition-all duration-300",
              selectedChat ? "opacity-0" : "opacity-100"
            )}>
            <p className="text-xl text-center mb-8 text-muted-foreground">
              Urban AI reference phrase to get user to understand ai purpose
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-lg border bg-muted/40" />
              ))}
            </div>
          </div>
          <div
            ref={containerRef}
            className={cn(
              "w-full space-y-4 transition-all duration-300",
              selectedChat ? "pb-4" : ""
            )}>
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                className="w-full"
                placeholder="Type your message here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    handleMessageSubmission();
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleMessageSubmission}
                disabled={!inputValue.trim()}>
                <SendHorizontal className="h-4 w-4 black" />
              </Button>
            </div>
          </div>
        </div>
      )}
      {selectedChat && (
        <div
          ref={containerRef}
          className={cn(
            "w-full space-y-4 transition-all duration-300",
            selectedChat ? "opacity-100" : "opacity-0"
          )}>
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              className="w-full"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim()) {
                  handleMessageSubmission();
                }
              }}
            />
            <Button
              size="icon"
              onClick={handleMessageSubmission}
              disabled={!inputValue.trim()}>
              <SendHorizontal className="h-4 w-4 black" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
