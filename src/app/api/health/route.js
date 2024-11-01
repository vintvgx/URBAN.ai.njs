// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/utils/db";

// export async function GET() {
//   try {
//     // Test database connection
//     await connectToDatabase();

//     return NextResponse.json(
//       {
//         status: "healthy",
//         message: "Hello World!",
//         database: "connected",
//         timestamp: new Date().toISOString(),
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       {
//         status: "unhealthy",
//         message: "Hello World!",
//         database: "disconnected",
//         error: error.message,
//         timestamp: new Date().toISOString(),
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

export async function GET() {
  console.log("Health check endpoint hit!");

  return NextResponse.json(
    {
      message: "Hello World!",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
    }
  );
}
