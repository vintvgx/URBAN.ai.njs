import React from "react";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { ChatSession } from "@/lib/chat/types";
import { UserData } from "@/lib/auth/types";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteMessage } from "@/lib/chat/hooks";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
  user,
}) => {
  const queryClient = useQueryClient();
  const { deleteMessage } = useDeleteMessage();

  const handleDeleteChat = async () => {
    if (selectedChat && user) {
      deleteMessage(
        { sessionID: selectedChat.sessionID, userId: user.uid },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chatHistory", user.uid] });
            handleNewChat(); // Clear current chat
            toast.success("Chat deleted successfully");
          },
          onError: (error) => {
            toast.error("Failed to delete chat: " + error.message);
          },
        }
      );
    }
  };

  return (
    <header className="border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        {selectedChat && (
          <div className="flex gap-2">
            <Button
              onClick={handleNewChat}
              variant="outline"
              className="font-mono ml-2 md:inline-flex">
              New Chat
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this chat? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteChat} className="bg-red-500 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
