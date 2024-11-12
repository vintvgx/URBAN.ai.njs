import React from "react";
import { Sheet, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChatSession } from "@/lib/chat/types";
import { formatDate, getFirstMessage } from "@/utils/functions";

interface SidebarContentProps {
  isAuthenticated: boolean;
  chatLoading: boolean;
  chatError: Error | null;
  chatHistory: ChatSession[];
  onChatSelect?: (chat: ChatSession) => void;
}

const SidebarContent = ({
  isAuthenticated,
  chatLoading,
  chatError,
  chatHistory,
  onChatSelect,
}: SidebarContentProps) => {

  /**
   * Render content based on authentication and loading state
   * 1. If chat or auth is loading, render a loading spinner
   * 2. If user is not authenticated, render a message prompting them to sign in
   * 3. If there is an error, render an error message
   * 4. If there is no chat history, render a message indicating so
   * 5. Otherwise, render the chat history
   */
  const renderContent = () => {
    if (chatLoading) {
      return (
        <div className="flex justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <p className="text-sm text-muted-foreground text-center">
          Please sign in to view chat history
        </p>
      );
    }

    if (chatError) {
      return (
        <p className="text-sm text-red-500 text-center">
          Error loading chat history
        </p>
      );
    }

    if (!chatHistory || chatHistory.length === 0) {
      return (
        <p className="text-sm text-muted-foreground text-center">
          No chat history found
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {chatHistory.map((chat: ChatSession) => {
          const firstMessage = chat.messages[0];
          const { date, time } = formatDate(firstMessage.timestamp);

          return (
            <div
              key={chat.sessionID}
              className="p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
              onClick={() => onChatSelect?.(chat)}>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {date} at {time}
                </p>
                <p className="text-sm truncate">{getFirstMessage(chat)}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <Sheet>
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Recent Chats</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto p-4">{renderContent()}</div>
      </Sheet>
    </div>
  );
};

export default SidebarContent;
