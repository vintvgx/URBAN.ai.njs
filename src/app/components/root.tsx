/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

// UI
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, Power } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Components
import AuthModal from "./Auth/AuthModal";
import { AuthHook, UserSettings } from "@/lib/auth/types";
import { useAuth, useLogout } from "@/lib/auth/hooks";
import Footer from "./Footer/Footer";
import SidebarContent from "./SidebarContent";
import V2 from "./Versions/V2";

// Functions
import { createOrUpdateSession, getUserInitials } from "@/utils/functions";
import { useChatHistory, useSaveConversationHistory, useSendMessage, useStoreMessage } from "@/lib/chat/hooks";
import { format } from "pretty-format";

// Chat Types
import { ChatSession, IMessage, InputElementType } from "@/lib/chat/types";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@radix-ui/react-select";
import { ThemeToggle } from "@/components/theme-toggle";
import { version } from "os";
import { useVersion } from "@/contexts/VersionContext";
import Header from "@/components/Header/header";
import { useTheme } from "next-themes";
import V1 from "./Versions/V1";

/**
 *  File defines the application's structure by laying out the Sidebar, Hedaer, MainContent & Footer.
 *  Handles application's functionality and operations (chat, auth, database)
 *
 * @returns
 */

export default function Root() {
  // Query client for handling queries
  const queryClient = useQueryClient();

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
  const inputRef = React.useRef<InputElementType>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);


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
 
  // Store messages in the database
  const { saveConversationHistory } = useSaveConversationHistory();
  // const {storeMessage} = useStoreMessage();

  // Sidebar state
  const { state, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();

  // User settings state
  const [settings, setSettings] = useState<UserSettings>({
    showSideBar: state === "expanded",
    font: undefined,
    assistantFont: undefined,
    typewriterEffect: true,
    darkMode: theme === "dark",
    uploadToDatabase: false,
  });

  // Keep settings.showSideBar in sync with sidebar state
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      showSideBar: state === "expanded",
      darkMode: theme === "dark",
    }));
  }, [state, theme]);

  // Combine loading states
  const isLoading = authLoading || chatLoading;


  /**
   * Handle chat selection
   * @param chat - The chat to select
   */
  const handleChatSelect = (chat: ChatSession) => {
    console.log("Chat selected: ", chat);
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
 * Handles sending the input chat request while managing conversation state and error recovery.
 * 
 * Functionality:
 * - Processes either direct input or example query clicks
 * - Creates and adds user message to conversation immediately
 * - Sends message to OpenAI and handles response
 * - Updates conversation with assistant response on success
 * - Creates/updates conversation session
 * - Saves conversation history for authenticated users
 * - Handles errors by:
 *   - Removing failed message from conversation
 *   - Restoring failed message text to input
 *   - Showing error toast to user
 * - Manages loading states and input clearing
 *
 * @param query Optional string for example queries clicked by user
 */
  const handleMessageSubmission = (query?: string) => {
    // If a query button was clicked, clear any existing input first
    if (query) {
      setInputValue("");
    }

    // the chosen query takes precedence if it exists & if not, set text to inputValue (trim white spaces)
    const messageText = query || inputValue.trim();

     // Store the current state before making any changes
     const previousState = chatMessages ? [...chatMessages] : [];

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
          onSuccess: async (response: any) => {
            // Create assistant message from response
            const assistantMessage: IMessage = {
              content: response,
              role: "assistant",
              timestamp: new Date().toISOString(),
            };

            console.log(`Response sent, ${response}`)

            // Update conversation with assistant's response
            const completeConversation = [...updatedConversation, assistantMessage];

            console.log(`Complete Convo, ${completeConversation}`)

            // Create or update conversation session
            const conversationSession = createOrUpdateSession(
              completeConversation,
              selectedChat,
              user?.uid
            );
            console.log("Conversation session ID: ", conversationSession.sessionID);

            // If user is authenticated, store the conversation
            if (isAuthenticated && user?.uid) {
              try {
                console.log("User is authenticated.Saving conversation history");
                saveConversationHistory({
                  messages: completeConversation,
                  userId: user.uid,
                  sessionID: conversationSession.sessionID,
                },
                {
                  onSuccess: () => {
                    console.log("Conversation saved successfully");
                    // Invalidate the chatHistory query to trigger a refetch
                    queryClient.invalidateQueries({ queryKey: ["chatHistory", user.uid] });
                  },
                });
              } catch (error) {
                console.error('Failed to store conversation:', error);
                toast.error('Failed to save conversation');
              }
            }

            // Update state with new conversation
            setChatMessages(completeConversation);
            setIsProcessing(false);
            setSelectedChat(conversationSession);
          },
          onError: (error) => {
            console.log("Error");
            
            // Restore to previous state 
            setChatMessages(previousState);
            setInputValue(messageText);
            setIsProcessing(false);
            
            console.error("Failed to get assistant response:", error);
            toast.error("Failed to get response. Please try again.");
          },
        }
      );
    }
  };

  const renderVersion = () => {
    switch (activeVersion.version) {
      case "v1":
        return (
          <V1
            user={user}
            authLoading={authLoading}
            selectedChat={selectedChat}
            chatMessages={chatMessages}
            containerRef={containerRef}
            chatContainerRef={chatContainerRef}
            inputRef={inputRef}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleMessageSubmission={handleMessageSubmission}
            isProcessing={isProcessing}
          />
        );
      case "v2":
        return (
          <V2
            user={user}
            authLoading={authLoading}
            selectedChat={selectedChat}
            chatMessages={chatMessages}
            containerRef={containerRef}
            chatContainerRef={chatContainerRef}
            inputRef={inputRef}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleMessageSubmission={handleMessageSubmission}
            isProcessing={isProcessing}
            settings={settings}

          />
        );
      case "v3":
        return (
          <V2
            user={user}
            authLoading={authLoading}
            selectedChat={selectedChat}
            chatMessages={chatMessages}
            chatContainerRef={chatContainerRef}
            containerRef={containerRef}
            inputRef={inputRef}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleMessageSubmission={handleMessageSubmission}
            isProcessing={isProcessing}
          />
        );
      default:
        return (
          <V2
            user={user}
            authLoading={authLoading}
            selectedChat={selectedChat}
            chatMessages={chatMessages}
            containerRef={containerRef}
            chatContainerRef={chatContainerRef}
            inputRef={inputRef}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleMessageSubmission={handleMessageSubmission}
            isProcessing={isProcessing}
          />
        );
    }
  };

  const handleSettingsChange = (newSettings: Partial<UserSettings>) => {
    if ("showSideBar" in newSettings) {
      // Use toggleSidebar if current state doesn't match desired state
      if ((state === "expanded") !== newSettings.showSideBar) {
        toggleSidebar();
      }
    }

    if ("darkMode" in newSettings) {
      setTheme(newSettings.darkMode ? "dark" : "light");
    }

    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  return (
    <div className="flex flex-1 sticky h-screen">
      {/* Sidebar */}
      <AppSidebar onChatSelect={handleChatSelect} />

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
            {renderVersion()} {/* Replace <V2 .../> with this */}
            {/* Footer */}
            <Footer
              settings={settings}
              user={user}
              onSettingsChange={handleSettingsChange}
            />
          </main>
        </div>
      </SidebarInset>
    </div>
  );
}
