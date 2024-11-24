/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";

// UI
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, Power } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Components
import AuthModal from "./Auth/AuthModal";
import { AuthHook } from "@/lib/auth/types";
import { useAuth, useLogout } from "@/lib/auth/hooks";
import Footer from "./Footer/Footer";
import SidebarContent from "./SidebarContent";
import MainContent from "./Chat/MainContent";

// Functions
import { createOrUpdateSession, getUserInitials } from "@/utils/functions";
import { useChatHistory, useSendMessage } from "@/lib/chat/hooks";
import { format } from "pretty-format";

// Chat Types
import { ChatSession, IMessage } from "@/lib/chat/types";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@radix-ui/react-select";

export default function MainComponent() {
  // State of sidebar and input
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState<IMessage[] | null>(
    null
  );
  const [selectedChat, setSelectedChat] = React.useState<ChatSession | null>(
    null
  );
  const [inputValue, setInputValue] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Refs for input and container
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

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

  // Send message state
  const { sendMessage, isPending, error } = useSendMessage();

  // Logout hook
  const { mutate: signOut } = useLogout();

  // Combine loading states
  const isLoading = authLoading || chatLoading;

  React.useEffect(() => {
    console.log("Loading state: ", authLoading, " | ", chatLoading);
  }, [chatLoading, authLoading]);

  /**
   * Handle chat selection
   * @param chat - The chat to select
   */
  const handleChatSelect = (chat: ChatSession) => {
    setSelectedChat(chat);
    setChatMessages(chat.messages);
  };

  /**
   * Handle new chat
   */
  const handleNewChat = () => {
    setSelectedChat(null);
    setChatMessages(null);
  };

  /**
   * Handle chat request
   */
  const handleMessageSubmission = (query?: string) => {
    // If a query button was clicked, clear any existing input first
    if (query) {
      setInputValue("");
    }

    // Now get the message text - query takes precedence if it exists
    const messageText = query || inputValue.trim();

    if (messageText) {
      // Create user message object
      const userMessage: IMessage = {
        role: "user",
        content: messageText,
        timestamp: new Date().toISOString(),
      };

      // Immediately update UI with user message
      const updatedConversation = chatMessages
        ? [...chatMessages, userMessage]
        : [userMessage];
      setChatMessages(updatedConversation);
      setInputValue(""); // Clear input right away
      setIsProcessing(true); // Show loading state

      // Send message to open AI
      sendMessage(
        {
          conversationHistory: updatedConversation,
          userMessage: messageText,
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess: (response: any) => {
            // Create assistant message from response
            const assistantMessage: IMessage = {
              content: response,
              role: "assistant",
              timestamp: new Date().toISOString(),
            };

            // Update conversation with assistant's response
            const completeConversation = [
              ...updatedConversation,
              assistantMessage,
            ];

            console.log(format(completeConversation));

            // Create or update conversation session
            const conversationSession = createOrUpdateSession(
              completeConversation,
              selectedChat,
              user?.uid
            );

            // Update state with new conversation
            setChatMessages(completeConversation);
            setIsProcessing(false);
            setSelectedChat(conversationSession);

            // TODO: Persist conversation to database
          },
          onError: (error) => {
            console.error("Failed to get assistant response:", error);
            setIsProcessing(false);
            toast.error("Failed to get response. Please try again.");
          },
        }
      );
    }
  };

  return (
    <SidebarProvider className="">
      <AppSidebar />
      <SidebarInset>
        {/* <div className="flex-1 flex flex-col"> */}
        <div>
          <Toaster />
        </div>

        {/* Header */}
        <header className="border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent
                isAuthenticated={isAuthenticated}
                chatLoading={isLoading}
                chatError={chatError}
                chatHistory={chatHistory}
                onChatSelect={handleChatSelect}
              />
            </SheetContent>
          </Sheet> */}
            {/* <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button> */}
            {/* <h1 className="text-xl font-semibold">Urban AI</h1> */}
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
            {authLoading ? (
              // You can replace this with any loading spinner component you prefer
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            ) : user && isAuthenticated ? (
              <div className="user-avatar">
                <span className={`text-base font-extralight tracking-wide`}>
                  {/*TODO Add theme::: {theme} === 'dark' ? 'text-white' : 'text-gray-800` */}
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
            )}
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          {/* <aside
          className={cn(
            "w-64 border-r hidden md:block transition-all duration-300",
            !isSidebarOpen && "w-0 opacity-0"
          )}>
          <SidebarContent
            isAuthenticated={isAuthenticated}
            chatLoading={isLoading}
            chatError={chatError}
            chatHistory={chatHistory}
            onChatSelect={handleChatSelect}
          />
        </aside> */}

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            <MainContent
              user={user}
              authLoading={authLoading}
              selectedChat={selectedChat}
              chatMessages={chatMessages}
              containerRef={containerRef}
              inputRef={inputRef}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleMessageSubmission={handleMessageSubmission}
              isProcessing={isProcessing}
            />

            {/* Footer */}
            <Footer signOut={signOut} />
          </main>
        </div>
      </SidebarInset>
      {/* </div> */}
    </SidebarProvider>
  );
}
