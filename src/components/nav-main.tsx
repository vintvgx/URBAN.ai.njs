"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChatSession } from "@/lib/chat/types";
import { formatDate, getFirstMessage } from "@/utils/functions";

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
        <p className="text-sm text-muted-foreground text-center transition-opacity duration-300 ease-in-out animate-in fade-in-50">
          Please sign in to view chat history
        </p>
      ) : null;
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
                <p className="text-sm truncate">{getFirstMessage(chat)}</p>
                <p className="text-sm font-medium text-muted-foreground">
                  {date} at {time}
                </p>
              </div>
            </div>
          );
        })}
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
