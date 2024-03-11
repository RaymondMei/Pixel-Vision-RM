import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;
if (!process.env.MONGODB_URI) {
  throw Error("Did not provide MONGODB_URI in .env");
}

const app = express();

app.use(cors());

const server = http.createServer(app);

// init socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "POST", "DELETE"],
  },
  // restore rooms / send missed events if disconnected
  connectionStateRecovery: {},
});

app.get("/", (req, res) => {
  res.send(io.sockets.adapter.rooms);
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongoClient = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const runServer = async () => {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB Client.");
    let db = mongoClient.db(MONGODB_DB);
    if (db) console.log(`Connected to ${MONGODB_DB}.`);
    let lobbies = db.collection("Lobbies");

    io.on("connection", async (socket) => {
      console.log(`User connected to socket ${socket.id}`);

      socket.on("create_lobby", async (data, callback) => {
        // name: id: player's socket id, player's username
        const { id, name } = data;

        // create lobby with player's socket id as lobby code
        lobbies
          .insertOne({ code: id, players: [name] })
          .then(() => {
            socket.join(id);
            callback({ success: true, data: { code: id, players: [name] } });
          })
          .catch((err) => {
            callback({ success: false, errMsg: "Could not create lobby." });
          });
      });

      socket.on("join_lobby", async (data, callback) => {
        const { lobbyCode, name } = data;

        // find lobby with given code
        let lobby = await lobbies.findOne({ code: lobbyCode });
        if (!lobby) {
          callback({
            success: false,
            errMsg: `Could not find lobby ${lobbyCode}.`,
          });
          return;
        }

        // append the new player's name into that collection
        try {
          lobby = await lobbies.findOneAndUpdate(
            { code: lobbyCode },
            { $push: { players: name } },
            { returnDocument: "after" }
          );
          socket.join(lobbyCode);
          callback({ success: true, data: lobby.value });
        } catch (e) {
          callback({
            success: false,
            errMsg: `Could not join lobby ${lobbyCode}.`,
          });
        }
        io.sockets.in(lobbyCode).emit("update_lobby", lobby.value);
      });
    });
  } catch {
    console.log("Error connecting to MongoDB.");
  }
};

runServer().catch(console.dir);

server.listen(4000, () => "Server listening on port 4000");
