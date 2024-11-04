import { GET } from "./route";
import { connectToDatabase } from "@/utils/db";
// import { NextResponse } from "next/server";

// Mock the database connection
jest.mock("@/utils/db", () => ({
  connectToDatabase: jest.fn(),
}));

describe("Health Check API Endpoint", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("returns healthy status when database connects successfully", async () => {
    // Arrange
    connectToDatabase.mockResolvedValueOnce();

    // Act
    const response = await GET();
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data).toEqual(
      expect.objectContaining({
        status: "healthy",
        message: "Hello World!",
        database: "connected",
        timestamp: expect.any(String),
      })
    );
    expect(connectToDatabase).toHaveBeenCalledTimes(1);
  });

  it("returns unhealthy status when database connection fails", async () => {
    // Arrange
    const testError = new Error("Database connection failed");
    connectToDatabase.mockRejectedValueOnce(testError);

    // Act
    const response = await GET();
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data).toEqual(
      expect.objectContaining({
        status: "unhealthy",
        message: "Hello World!",
        database: "disconnected",
        error: testError.message,
        timestamp: expect.any(String),
      })
    );
    expect(connectToDatabase).toHaveBeenCalledTimes(1);
  });
});
