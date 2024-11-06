/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, Power } from "lucide-react";
import AuthModal from "./AuthModal";
import { Toaster } from "react-hot-toast";
import { useAuth, useLogout } from "@/lib/auth/hooks";
import { getUserInitials } from "@/utils/functions";
import { AuthHook } from "@/lib/auth/types";
import { useChatHistory, useSendMessage } from "@/lib/chat/hooks";
import SidebarContent from "./SidebarContent";
import { ChatSession, IMessage } from "@/lib/chat/types";
import { SendHorizontal } from "lucide-react";

export default function Component() {
  // State of sidebar and input
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isInputFocused, setIsInputFocused] = React.useState(false);
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<ChatSession | null>(
    null
  );
  const [inputValue, setInputValue] = React.useState("");

  // Refs for input and container
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Global User Auth State
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth() as AuthHook;
  const { mutate: signOut } = useLogout();

  // Chat history state
  const {
    chatSessions: chatHistory = [],
    loading: chatLoading,
    error: chatError,
  } = useChatHistory(user?.uid ?? "");

  // Send message state
  const { sendMessage, isPending, error } = useSendMessage();

  // Combine loading states
  const isLoading = authLoading || chatLoading;

  // Click outside handler for input
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If the click is outside the input and container, set the input to not be focused
      if (
        inputRef.current &&
        containerRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // Set the input to not be focused
        setIsInputFocused(false);
      }
    }

    // Add event listener for mousedown
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Handle chat selection
   * @param chat - The chat to select
   */
  const handleChatSelect = (chat: ChatSession) => {
    setSelectedChat(chat);
    setMessages(chat.messages);
    setIsInputFocused(true);
  };

  /**
   * Handle chat request
   */
  const handleMessageSubmission = () => {
    if (inputValue.trim()) {
      // Create user message object
      const userMessage: IMessage = {
        role: "user",
        content: inputValue,
        timestamp: new Date().toISOString(),
      };

      // Add user message to conversation history
      const updatedConversation = [...messages, userMessage];

      // Send message to AI service
      sendMessage(
        {
          conversationHistory: updatedConversation,
          userMessage: userMessage.content,
        },
        {
          onSuccess: (response) => {
            // Create assistant message from response
            const assistantMessage: IMessage = {
              content: response.message,
              role: "assistant",
              timestamp: new Date().toISOString(),
            };

            // Update conversation with assistant's response
            const completeConversation = [
              ...updatedConversation,
              assistantMessage,
            ];

            // Clear input field
            setInputValue("");

            // Create new conversation session
            const conversationSession: ChatSession = {
              messages: completeConversation,
              sessionID: Date.now().toString(),
            };

            // Update state with new conversation
            setSelectedChat(conversationSession);
            setMessages(completeConversation);

            // TODO: Persist conversation to database
          },
          onError: (error) => {
            console.error("Failed to get assistant response:", error);
            // TODO: Implement error handling with toast notification
          },
        }
      );
    }
  };

  return (
    <div className="h-screen flex flex-col ">
      <div>
        <Toaster />
      </div>
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sheet>
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
          </Sheet>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Urban AI</h1>
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
        <aside
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6 flex flex-col">
            {selectedChat ? (
              <div className="flex-1 space-y-4 overflow-auto">
                {selectedChat.messages?.map(
                  (message: IMessage, index: number) => (
                    <div
                      key={index}
                      className={cn(
                        "flex",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      )}>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-4",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted"
                        )}>
                        <p className="text-sm">{message.content.toString()}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(
                            message.timestamp?.toString() ?? ""
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div
                className={cn(
                  "flex-1 p-6 flex flex-col items-center transition-all duration-300",
                  selectedChat ? "justify-end" : "justify-center",
                  "max-w-2xl mx-auto w-full"
                )}>
                <div
                  className={cn(
                    "transition-all duration-300",
                    selectedChat ? "opacity-0" : "opacity-100"
                  )}>
                  <p className="text-xl text-center mb-8 text-muted-foreground">
                    Urban AI reference phrase to get user to understand ai
                    purpose
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-24 rounded-lg border bg-muted/40"
                      />
                    ))}
                  </div>
                </div>
                <div
                  ref={containerRef}
                  className={cn(
                    "w-full space-y-4 transition-all duration-300",
                    selectedChat ? "pb-4" : ""
                  )}>
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      className="w-full"
                      placeholder="Type your message here..."
                      onFocus={() => setIsInputFocused(true)}
                      onClick={() => setIsInputFocused(true)}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && inputValue.trim()) {
                          handleMessageSubmission();
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      onClick={handleMessageSubmission}
                      disabled={!inputValue.trim()}>
                      <SendHorizontal className="h-4 w-4 black" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {selectedChat && (
              <div
                ref={containerRef}
                className={cn(
                  "w-full space-y-4 transition-all duration-300",
                  selectedChat ? "opacity-100" : "opacity-0"
                )}>
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    className="w-full"
                    placeholder="Type your message here..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && inputValue.trim()) {
                        handleMessageSubmission();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    onClick={handleMessageSubmission}
                    disabled={!inputValue.trim()}>
                    <SendHorizontal className="h-4 w-4 black" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="border-t p-4 flex items-center justify-center gap-8">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => signOut()}>
              <Power className="h-4 w-4" />
              SIGN OUT
            </Button>
            {/* <Button variant="ghost" size="sm" className="gap-2">
              <Info className="h-4 w-4" />
              Information
            </Button> */}
          </footer>
        </main>
      </div>
    </div>
  );
}
