"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChatSession } from "@/lib/chat/types";
import { formatDate, getFirstMessage } from "@/utils/functions";
import { cn } from "@/lib/utils";

export function NavMain({
  chatHistory,
  onChatSelect,
  isAuthenticated,
  chatLoading,
  chatError,
}: {
  chatHistory: ChatSession[];
  onChatSelect: (chat: ChatSession) => void;
  isAuthenticated: boolean;
  chatLoading: boolean;
  chatError: Error | null;
}) {
  const { state } = useSidebar();

  const renderContent = () => {
    if (chatLoading) {
      return (
        <div className="flex justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return state === "expanded" ? (
        <div
          className={cn(
            "transition-all duration-300",
            state === "expanded"
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-4"
          )}>
          <p className="text-sm text-muted-foreground text-center">
            Please sign in to view chat history
          </p>
        </div>
      ) : null;
    }

    if (chatError) {
      return (
        <div
          className={cn(
            "transition-all duration-300",
            state === "expanded"
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-4"
          )}>
          <p className="text-sm text-red-500 text-center">
            Error loading chat history
          </p>
        </div>
      );
    }

    if (!chatHistory || chatHistory.length === 0) {
      return (
        <div
          className={cn(
            "transition-all duration-300",
            state === "expanded"
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-4"
          )}>
          <p className="text-sm text-muted-foreground text-center">
            No chat history found
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div
          className={cn(
            "transition-all duration-300",
            state === "expanded"
              ? "opacity-100 transition-opacity duration-500"
              : "opacity-0 -translate-x-4"
          )}>
          {state === "expanded" &&
            chatHistory.map((chat: ChatSession) => {
              const firstMessage = chat.messages[0];
              const { date, time } = formatDate(firstMessage.timestamp);

              return (
                <div
                  key={chat.sessionID}
                  className="p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => onChatSelect?.(chat)}>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm truncate">{getFirstMessage(chat)}</p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {date} at {time}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
      <SidebarMenu>{renderContent()}</SidebarMenu>
    </SidebarGroup>
  );
}
