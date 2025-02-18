import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

// Define a type for cached connection
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Use `const` instead of `let`
const globalCache = global as unknown as { mongoose?: MongooseCache };

const cached: MongooseCache = globalCache.mongoose || { conn: null, promise: null };

export async function connectToDatabase(): Promise<Mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {}).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    globalCache.mongoose = cached; // Store it globally to reuse connection

    return cached.conn;
}
