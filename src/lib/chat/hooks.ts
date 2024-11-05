import { transformChatHistory } from "@/utils/functions";
import { ChatSession } from "./types";
import { useQuery } from "@tanstack/react-query";

// Example usage with your fetch function
async function fetchChatHistory(userId: string): Promise<ChatSession[]> {
  const response = await fetch(`/api/messages/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch chat history");
  }
  const rawData = await response.json();
  return transformChatHistory(rawData);
}

// Updated hook
export function useChatHistory(userId: string) {
  const {
    data: chatHistoryData = [],
    isPending: loading,
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
