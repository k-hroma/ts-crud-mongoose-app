import mongoose from "mongoose";

// Load environment variables from .env file
process.loadEnvFile()

// Establishes a connection to MongoDB using Mongoose
const connectDB = async (): Promise<void> => { 
  // Get connection URI from environment variables
  const URI_DB = process.env.URI_DB || ""
   // Validate environment configuration before attempting connection
  if (!URI_DB) { 
    console.error("URI_DB is not defined in the environment variables.")
    process.exit(1);
  }
  try { 
    // Attempt database connection with critical safety options
    await mongoose.connect(URI_DB, {
      // Fail fast if no primary server available
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Successful connection")
  } catch (error) { 
    // Handle connection errors with detailed logging
    console.error("The connection failed", (error as Error).message)
    // Brief delay to ensure error messages are fully written
    await new Promise((res) => { setTimeout(res, 100) });
    process.exit(1)
  }
}
// Export connection function 
export { connectDB }