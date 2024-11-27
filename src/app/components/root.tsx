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
import V2 from "./Versions/V2";

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
import { ThemeToggle } from "@/components/theme-toggle";
import { version } from "os";
import { useVersion } from "@/contexts/VersionContext";
import Header from "@/components/Header/header";


/**
 *  File defines the application's structure by laying out the Sidebar, Hedaer, MainContent & Footer.
 *  Handles application's functionality and operations (chat, auth, database)
 * 
 * @returns 
 */

export default function Root() {
  // State of chat bot conversation
  const [chatMessages, setChatMessages] = React.useState<IMessage[] | null>(
    null
  );
  const [selectedChat, setSelectedChat] = React.useState<ChatSession | null>(
    null
  );
  const [inputValue, setInputValue] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Refs for input and chat bot container
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Version Context for MainContent (chat bot) display
  const { activeVersion } = useVersion();

  // Global User Auth State
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth() as AuthHook;

  // Chat history state
  //TODO fix chat history loading error in sidebar
  const {
    chatSessions: chatHistory = [],
    loading: chatLoading,
    error: chatError,
  } = useChatHistory(user?.uid ?? "");

  // handles sending chatbot messages 
  const { sendMessage, isPending, error } = useSendMessage();

  // Logout hook
  const { mutate: signOut } = useLogout();

  // Combine loading states
  const isLoading = authLoading || chatLoading;

  // TODO Keep for testing & delete when chat history load error is fixed 
  React.useEffect(() => {
    console.log("Loading state: ", authLoading, " | ", chatLoading);
  }, [chatLoading, authLoading]);

  // TODO Implement functionlaity between sidebar & MainContent to update state of chat bot when conversation is pressed 
  /**
   * Handle chat selection
   * @param chat - The chat to select
   */
  const handleChatSelect = (chat: ChatSession) => {
    setSelectedChat(chat);
    setChatMessages(chat.messages);
  };

  /**
   * Handle clearing chat content and creating new conversation
   */
  const handleNewChat = () => {
    setSelectedChat(null);
    setChatMessages(null);
  };

  /**
   * Handles sending the input chat request, keeping conversation order and updating states 
   * 
   * @param query the string of the example query clicked 
   */
  const handleMessageSubmission = (query?: string) => {
    // If a query button was clicked, clear any existing input first
    if (query) {
      setInputValue("");
    }

    // the chosen query takes precedence if it exists & if not, set text to inputValue (trim white spaces)
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
      {/* Sidebar */}
      <AppSidebar />


      <SidebarInset>
        <div>
          <Toaster />
        </div>

        {/* Header */}
        <Header
          selectedChat={selectedChat}
          handleNewChat={handleNewChat}
          authLoading={authLoading}
          isAuthenticated={isAuthenticated}
          user={user}
          />
    
          {/* Main Content (Version) */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 flex flex-col">
            <V2
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
    </SidebarProvider>
  );
}
