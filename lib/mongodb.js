import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from stacking up.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;

export function connectToDatabase() {
    // TODO: Implement connectToDatabase
    throw new Error('connectToDatabase not implemented');
}

export function dbConnect() {
    // TODO: Implement dbConnect
    throw new Error('dbConnect not implemented');
}

export function connectToDB() {
    // TODO: Implement connectToDB
    throw new Error('connectToDB not implemented');
}
