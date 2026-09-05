import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not set");
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log(`MongoDB connected: ${cached.conn.connection.host}` );
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};