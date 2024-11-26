"use client";

import { sidebarData } from "@/utils/sidebarData";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { SideBarUrbanAIHeader } from "@/components/organization-sidebar-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useChatHistory } from "@/lib/chat/hooks";
import { AuthHook } from "@/lib/auth/types";
import { IMessage, ChatSession } from "@/lib/chat/types";
import { useAuth } from "@/lib/auth/hooks";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // State of sidebar and input
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chatMessages, setChatMessages] = React.useState<IMessage[] | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedChat, setSelectedChat] = React.useState<ChatSession | null>(
    null
  );

  // Global User Auth State
  const {
    user,
    isAuthenticated,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isLoading: authLoading,
  } = useAuth() as AuthHook;

  // Chat history state
  const {
    chatSessions: chatHistory = [],
    loading: chatLoading,
    error: chatError,
  } = useChatHistory(user?.uid ?? "");

  /**
   * Handle chat selection
   * @param chat - The chat to select
   */
  const handleChatSelect = (chat: ChatSession) => {
    setSelectedChat(chat);
    setChatMessages(chat.messages);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SideBarUrbanAIHeader versions={sidebarData.versions} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          chatHistory={chatHistory}
          onChatSelect={handleChatSelect}
          isAuthenticated={isAuthenticated}
          chatLoading={chatLoading}
          chatError={chatError}
        />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
