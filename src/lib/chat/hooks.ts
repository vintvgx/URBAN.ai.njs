import { transformChatHistory } from "@/utils/functions";
import { ChatSession, IMessage, SendMessageResponse } from "./types";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Fetches chat history from the database
 * @param userId - The user ID to fetch chat history for
 * @returns The chat history
 */
async function fetchChatHistory(userId: string): Promise<ChatSession[]> {
  const response = await fetch(`/api/messages/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch chat history");
  }
  const rawData = await response.json();
  return transformChatHistory(rawData);
}

/**
 * Hook to fetch chat history from the database
 * @param userId - The user ID to fetch chat history for
 * @returns An object containing the chat history, loading state, and error
 */
export function useChatHistory(userId: string) {
  const {
    data: chatHistoryData = [],
    // isPending: loading,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["chatHistory", userId],
    queryFn: () => fetchChatHistory(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    chatSessions: chatHistoryData,
    loading,
    error,
  };
}

/**
 * Hook to send a request to the OpenAI API.
 * Save the response to the database if user is authenticated.
 *
 * @param chatHistory - The chat history to send to the OpenAI API
 * @param onSuccess - Callback function to handle successful message sending
 * @returns The mutation function and state
 */
export function useSendMessage() {
  const { mutate, isPending, error } = useMutation<
    SendMessageResponse,
    Error,
    { conversationHistory: IMessage[]; userMessage: string }
  >({
    mutationFn: async ({ conversationHistory, userMessage }) => {
      console.log(
        "🚀 ~ file: hooks.ts:57 ~ useSendMessage ~ message:",
        userMessage
      );
      console.log(
        "🚀 ~ file: hooks.ts:57 ~ useSendMessage ~ chatHistory:",
        conversationHistory
      );

      // Format conversation history before sending
      const formattedHistory = conversationHistory.map((msg) => ({
        ...msg,
        content:
          typeof msg.content === "string"
            ? msg.content
            : msg.content.content.raw,
      }));

      try {
        const response = await fetch(`api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userMessage,
            conversationHistory: formattedHistory,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    },
  });

  return {
    sendMessage: mutate,
    isPending,
    error,
  };
}
