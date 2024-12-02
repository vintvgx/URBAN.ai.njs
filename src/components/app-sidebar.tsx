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
import { ChatSession } from "@/lib/chat/types";
import { useAuth } from "@/lib/auth/hooks";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onChatSelect: (chat: ChatSession) => void;
}

export function AppSidebar({ onChatSelect, ...props }: AppSidebarProps) {
  // Global User Auth State
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth() as AuthHook;

  // Chat history state
  const {
    chatSessions: chatHistory = [],
    loading: chatLoading,
    error: chatError,
  } = useChatHistory(user?.uid ?? "");

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SideBarUrbanAIHeader versions={sidebarData.versions} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          chatHistory={chatHistory}
          onChatSelect={onChatSelect}
          isAuthenticated={isAuthenticated}
          chatLoading={chatLoading}
          chatError={chatError}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={user}
          authLoading={authLoading}
          isAuthenticated={isAuthenticated}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
