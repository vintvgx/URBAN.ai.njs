import React from "react";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { ChatSession } from "@/lib/chat/types";
import { UserData } from "@/lib/auth/types";

export interface HeaderProps {
  selectedChat: ChatSession | null;
  handleNewChat: () => void;
  authLoading: boolean;
  user: UserData | null;
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({
  selectedChat,
  handleNewChat,
}) => {
  return (
    <header className="border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        {selectedChat && (
          <Button
            onClick={handleNewChat}
            variant="outline"
            className="font-mono ml-2 md:inline-flex">
            New Chat
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
