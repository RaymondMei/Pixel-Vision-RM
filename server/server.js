import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { MongoClient, ServerApiVersion } from "mongodb";
import { calculateScore, initializeGameGrid } from "./game_utils.js";

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
        const { playerId, name } = data;

        // create lobby with player's socket id as lobby code
        lobbies
          .insertOne({
            code: playerId,
            adminId: playerId,
            players: [{ playerId: playerId, name: name, score: 0 }],
          })
          .then(() => {
            socket.join(playerId);
            callback({
              success: true,
              data: {
                code: playerId,
                adminId: playerId,
                players: [{ playerId: playerId, name: name, score: 0 }],
              },
            });
          })
          .catch((err) => {
            callback({ success: false, errMsg: "Could not create lobby." });
          });
      });

      socket.on("join_lobby", async (data, callback) => {
        const { lobbyCode, playerId, name } = data;

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
            {
              $push: { players: { playerId: playerId, name: name, score: 0 } },
            },
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

      socket.on("start_game_req", async (lobbyData, callback) => {
        const grid = initializeGameGrid(3);
        try {
          const lobby = await lobbies.findOneAndUpdate(
            { code: lobbyData.code },
            {
              $set: { settings: lobbyData.settings, round: 1, grid: grid },
            },
            { returnDocument: "after" }
          );
          callback({ success: true, data: lobby.value });

          io.sockets.in(lobby.value.code).emit("start_pre_round", lobby.value);
        } catch (e) {
          callback({
            success: false,
            errMsg: "Could not start game",
          });
        }
      });

      socket.on(
        "end_round",
        async ({ lobbyData, playerId, guess }, callback) => {
          const guessScore = calculateScore(lobbyData.grid, guess);
          try {
            let lobby = await lobbies.findOne({ code: lobbyData.code });
            lobby = await lobbies.findOneAndUpdate(
              { code: lobbyData.code },
              {
                $set: {
                  players: lobby.players.map((player) => {
                    if (player.playerId === playerId) {
                      const updatedScore = player.score + guessScore;
                      player = { ...player, score: updatedScore };
                    }
                    return player;
                  }),
                },
                $push: {
                  receivedEvent: playerId,
                },
              },
              { returnDocument: "after" }
            );

            // ensure all clients have emitted a end_round event
            if (
              lobby.value.receivedEvent.length === lobby.value.players.length
            ) {
              console.log("emit start pre-round");

              const nextRoundGrid = initializeGameGrid(3);
              try {
                lobby = await lobbies.findOneAndUpdate(
                  { code: lobbyData.code },
                  {
                    $set: {
                      round: lobby.value.round + 1,
                      grid: nextRoundGrid,
                      receivedEvent: [],
                    },
                  },
                  { returnDocument: "after" }
                );

                io.sockets
                  .in(lobby.value.code)
                  .emit("start_pre_round", lobby.value);
              } catch (e) {
                callback({
                  success: false,
                  errMsg: "Could not start new round.",
                });
              }
            }
          } catch (e) {
            callback({
              success: false,
              errMsg: "Could not update player score",
            });
          }
        }
      );
    });
  } catch {
    console.log("Error connecting to MongoDB.");
  }
};

runServer().catch(console.dir);

server.listen(4000, () => "Server listening on port 4000");
