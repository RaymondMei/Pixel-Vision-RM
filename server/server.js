import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = "Cluster0";
if (!process.env.MONGODB_URI) {
  throw Error("Did not provide MONGODB_URI in .env");
}

const app = express();

app.use(cors());

const io = new Server();

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectDB = async () => {
  try {
    await client.connect();
    await client.db(MONGODB_DB).command({ ping: 1 });
  } finally {
    await client.close();
  }
};

connectDB().catch(console.dir);
