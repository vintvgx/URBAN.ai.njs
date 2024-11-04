import { MongoClient } from "mongodb";

// Check if the MONGO_URI environment variable is set
if (!process.env.MONGO_URI) {
  console.error("Missing MONGO_URI environment variable");
  throw new Error(
    "Please define the MONGO_URI environment variable in .env.local"
  );
}

// Set the MongoDB URI
const uri = process.env.MONGO_URI;
let cachedClient = null;
let cachedDb = null;

/**
 * Connect to the MongoDB database
 * @returns {Object} The MongoDB client and database
 */
export async function connectToDatabase() {
  // If the client and database are already cached, return them
  if (cachedClient && cachedDb) {
    console.log("Using cached client and database");
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Connect to the MongoDB server
    const client = await MongoClient.connect(uri, {
      // Add options to suppress deprecation warning
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db("UrbanAI");

    // Cache the client and database
    cachedClient = client;
    cachedDb = db;

    // Only log on initial connection
    console.log("Successfully connected to MongoDB");

    return { client, db };
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
