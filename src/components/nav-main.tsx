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
// import { Trash2 } from "lucide-react";

export function NavMain({
  chatHistory,
  onChatSelect,
  isAuthenticated,
  chatLoading,
  chatError,
  authLoading,
  // userId,
  //handleDeleteMessage,
  // deleteMessagePending,
  // deleteMessageError,
}: {
  chatHistory: ChatSession[];
  onChatSelect: (chat: ChatSession) => void;
  isAuthenticated: boolean;
  chatLoading: boolean;
  chatError: Error | null;
  authLoading: boolean;
  // userId,
  handleDeleteMessage: (sessionID: string, userId: string) => void;
  // deleteMessagePending: boolean;
  // deleteMessageError: Error | null;
}) {
  const { state } = useSidebar();


  const renderContent = () => {
    if (chatLoading || authLoading) {
      return (
        <div className="flex justify-center mt-10">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      );
    }

    if (!isAuthenticated && !authLoading) {
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
                  className="group p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors relative"
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest('.delete-button')) {
                      onChatSelect?.(chat);
                    }
                  }}>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm truncate">{getFirstMessage(chat)}</p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {date} at {time}
                    </p>
                  </div>
                  {/* //TODO Update button to only be displayed on active element */}
                  {/* <button
                    className="delete-button absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-accent-foreground/10 rounded"
                    onClick={() => handleDeleteMessage(chat.sessionID, userId)}
                    aria-label="Delete conversation">
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                  </button> */}
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