require("dotenv").config();

// initialize express and http servers
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
if (!process.env.MONGODB_URI) {
  throw new Error("Did not provide MongoDB_URI"); // requires each dev to make an .env file with the mongodb uri
}
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = "Cluster0";
const MongoClient = require("mongodb").MongoClient;
const server = http.createServer(app);

app.use(cors()); // "allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served"

const io = new Server(server, {
  // init socket.io server
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send(io.sockets.adapter.rooms);
});

// verify(guesses, answers) returns the score of a player by comparing the answer grid to the drawn grid
const verify = (guesses, answers) => {
  let score = 0;
  for (let i = 0; i < guesses.length; i++) {
    for (let j = 0; j < guesses[0].length; j++) {
      if (guesses[i][j] == answers[i][j]) {
        score += 100;
      }
    }
  }
  return score;
};

MongoClient.connect(MONGODB_URI, async function (err, db) {
  // connect to mongodb
  if (err) throw err;
  var dbo = db.db(MONGODB_DB); // connect to PixelVision database
  var collection = dbo.collection("lobbies"); // connect to PixelVision's "lobbies" collection

  // initialize the socket.io library to listen for messages
  io.on("connection", async (socket) => {
    // console.log(`User connected ${socket.id}`);
    console.log(io.sockets.adapter.rooms);

    // adds a listener for create_lobby events that creates a subset group for broadcasting messages,
    // and updates the mongodb database with the new user and lobby
    socket.on("create_lobby", async (data) => {
      const { name, id } = data; // name: player's username, id: player's socket.id (e.g. nVWTGlfBcky1Rpp0AAAB)
      socket.join(id); // user joins a specific room ("lobby") for broadcasted messages
      // console.log("sent update_lobby");

      // insert a single document into lobbies collection with the new player's username and id
      collection.insertOne({ code: id, players: [name] }).then(() => {
        if (err) throw err;
        socket.join(id);
        io.in(id).emit("update_lobby", { players: [name] }); // emit a message for client to update player displays
      });
    });

    // adds a listener for join_lobby events and connects the player to the lobby with the specified code
    socket.on("join_lobby", async (data) => {
      const { name, lobby } = data;
      const lobbiesFound = collection
        .countDocuments({ code: lobby })
        .then(() => {
          if (lobbiesFound == 0) {
            socket.emit("invalid_lobby");
          } else {
            // finds lobby with that code, appends the new player's name into that collection
            collection.findOneAndUpdate(
              { code: lobby },
              { $push: { players: name } },
              { returnDocument: "after" },
              (err, res) => {
                socket.emit("valid_lobby", { lobby });
                socket.join(lobby);
                socket.on("moved_lobbies", () => {
                  io.in(lobby).emit("update_lobby", {
                    players: res.value.players,
                  }); // res.value.players lists all players in the lobby
                });
              }
            );
          }
        });
      //join room
    });

    // listen for a request of the host starting a game, then initializes the random grid to draw, the scores, lobby settings and
    // finally emits a start_game event to everyone in the lobby
    socket.on("start_game_req", async (data) => {
      const { lobby, score, round } = data;
      console.log(data);
      //console.log("socket.on: round: " + round);
      const maxRound = round;
      const colours = ["red", "green", "yellow", "blue", "black"];
      const rows = [];
      for (let i = 0; i < 3; i++) {
        const column = [];
        for (let j = 0; j < 3; j++) {
          const ind = Math.floor(Math.random() * 5);
          column.push(colours[ind]);
        }
        rows.push(column);
      }
      // array to make sure every player's socket received info updates (received at diff. times)
      receipt = new Array(score.length).fill(false);
      collection
        .updateOne(
          { code: lobby },
          { $set: { round: 1, boxes: rows, scores: score, received: receipt } }
        )
        .then(() => {
          io.in(lobby).emit("start_round_0", {
            round: 1,
            scores: score,
            boxes: rows,
            totalRound: maxRound,
          });
        });
    });

    socket.on("end_round_0", async (data) => {
      const rows = [];
      for (let i = 0; i < 3; i++) {
        rows.push(new Array(3).fill("white"));
      }
      io.in(data.lobby).emit("start_round_1", {
        round: data.round,
        boxes: rows,
      });
    });

    // listens guessing_round_end event and updates the player's score
    socket.on("end_round_1", async (data) => {
      console.log("end_round_1 received");
      collection.findOne({ code: data.lobby }, (err, res) => {
        if (err) throw err;
        const scoreDelta = verify(data.guess, res.boxes); // calculate player drawing's score
        var score = res.scores;
        var receipt = res.received;
        receipt[data.player] = true;
        score[data.player] += scoreDelta;
        const done = receipt.every((value) => value); // if all players in receipt[] is true (all players score updated)
        const colours = ["red", "green", "yellow", "blue", "black"];
        const rows = [];
        for (let i = 0; i < 3; i++) {
          // create a grid filled with random colors
          const column = [];
          for (let j = 0; j < 3; j++) {
            const ind = Math.floor(Math.random() * 5);
            column.push(colours[ind]);
          }
          rows.push(column);
        }
        if (done) {
          receipt = receipt.fill(false);
        }

        // start new memorizing round
        collection
          .updateOne(
            { code: data.lobby },
            {
              $set: {
                round: data.round,
                boxes: rows,
                scores: score,
                received: receipt,
              },
            }
          )
          .then(() => {
            io.in(data.lobby).emit("start_round_0", {
              round: data.round,
              boxes: rows,
              scores: score,
            });
          });
      });
    });
  });
});

server.listen(4000, () => "Server is running on port 4000");
