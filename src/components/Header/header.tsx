import AuthModal from "@/app/components/Auth/AuthModal";
import { getUserInitials } from "@/utils/functions";
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
  authLoading,
  isAuthenticated,
  user,
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
        {/* {authLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            ) : user && isAuthenticated ? (
              <div className="user-avatar">
                <span className="text-base font-extralight tracking-wide">
                  {getUserInitials(user?.displayName)}
                </span>
              </div>
            ) : (
              <>
                <AuthModal
                  defaultView="login"
                  trigger={
                    <Button variant="ghost" size="sm" className="gap-2">
                      LOG IN
                    </Button>
                  }
                />
                <AuthModal
                  defaultView="signup"
                  trigger={
                    <Button variant="ghost" size="sm" className="gap-2">
                      SIGN UP
                    </Button>
                  }
                />
              </>
            )} */}
      </div>
    </header>
  );
};

export default Header;
