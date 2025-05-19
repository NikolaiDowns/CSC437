// src/services/mongo.ts

import type { Mongoose } from "mongoose";

/**
 * Lazily connect to MongoDB (Atlas or local) only when called.
 * Nothing is executed at module load time.
 */
export function connect(dbname: string): Promise<Mongoose> {
  console.log("⚙️ [mongo] initializing connection…");

  // Load dependencies only when connecting
  const mongoose = require("mongoose");
  const dotenv = require("dotenv");

  // Load environment variables
  dotenv.config();

  // Enable Mongoose debug mode
  mongoose.set("debug", true);

  // Build the connection URI
  const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER } = process.env;
  let uri = `mongodb://localhost:27017/${dbname}`;
  if (MONGO_USER && MONGO_PWD && MONGO_CLUSTER) {
    uri = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${dbname}?retryWrites=true&w=majority`;
    console.log("Connecting to Atlas at:", uri);
  } else {
    console.log("Connecting to local Mongo at:", uri);
  }

  // Connect and return the Mongoose instance
  return mongoose
    .connect(uri)
    .then((m: Mongoose) => {
      console.log("MongoDB connected");
      return m;
    })
    .catch((err: any) => {
      console.error("MongoDB connection error:", err);
      throw err;
    });
}