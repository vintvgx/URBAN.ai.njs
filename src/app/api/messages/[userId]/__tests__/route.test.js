import { GET } from "../route";
import { connectToDatabase } from "@/utils/db";

// Mock the database connection
jest.mock("@/utils/db", () => ({
  connectToDatabase: jest.fn(),
}));

describe("GET /api/messages/[userId]", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if userId is not provided", async () => {
    const response = await GET({}, { params: { userId: null } });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "User ID is required" });
  });

  it("should return chat history for valid userId", async () => {
    // Mock database response
    const mockMessages = [
      {
        sessionID: "session1",
        messages: [{ text: "Hello", timestamp: "2024-01-01T00:00:00Z" }],
        user_id: "user123",
      },
      {
        sessionID: "session2",
        messages: [{ text: "Hi", timestamp: "2024-01-02T00:00:00Z" }],
        user_id: "user123",
      },
    ];

    // Mock the database connection and find operation
    const mockCollection = {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue(mockMessages),
    };

    const mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    connectToDatabase.mockResolvedValue({ db: mockDb });

    // Call the API
    const response = await GET({}, { params: { userId: "user123" } });
    const result = await response.json();

    // Verify the response
    expect(response.status).toBe(200);
    expect(result).toEqual([
      {
        sessionID: "session1",
        messages: [{ text: "Hello", timestamp: "2024-01-01T00:00:00Z" }],
      },
      {
        sessionID: "session2",
        messages: [{ text: "Hi", timestamp: "2024-01-02T00:00:00Z" }],
      },
    ]);

    // Verify database calls
    expect(mockDb.collection).toHaveBeenCalledWith("chatMessages");
    expect(mockCollection.find).toHaveBeenCalledWith({ user_id: "user123" });
    expect(mockCollection.sort).toHaveBeenCalledWith({
      "messages.timestamp": 1,
    });
  });

  it("should return 500 if database operation fails", async () => {
    // Mock database error
    connectToDatabase.mockRejectedValue(
      new Error("Database connection failed")
    );

    const response = await GET({}, { params: { userId: "user123" } });
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Error fetching messages: Database connection failed",
    });
  });
});
