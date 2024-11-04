import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";

export async function GET() {
  try {
    console.log("MongoDB URI exists:", !!process.env.MONGO_URI);
    await connectToDatabase();

    return NextResponse.json(
      {
        status: "healthy",
        message: "Hello World!",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health Check Error:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        message: "Hello World!",
        database: "disconnected",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
