import { useRouter } from "next/router";
import React from "react";
import Lobby from "../Lobby";
import { useState, useEffect } from "react";
import Game from "../../components/Game";
import Leaderboard from "../Leaderboard";
export default function GameInstance({
  name,
  socket,
  lobbyData,
  setLobbyData,
}) {
  const router = useRouter();
  const [inGame, setInGame] = useState(false);
  const [boxes, setBoxes] = useState([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(
    new Array(lobbyData?.players.length).fill(0)
  );
  const [endGame, setEndGame] = useState(false);
  let globalMaxRounds = -1;

  const [settings, setSettings] = useState({
    lobbyName: "My Lobby",
    maxPlayer: 2,
    drawingTime: 30,
    rounds: 2,
  });

  const startGame = (settings) => {
    setSettings(settings);
    lobbyData.settings = settings;
    socket.emit("start_game_req", { lobbyData });
  };

  useEffect(() => {
    // new player joins the lobby
    socket.on("update_lobby", (data) => {
      setLobbyData(data);
    });

    socket.on("start_pre_round", (lobbyData) => {});

    //note:
    //game starts on round_0
    //cycles like: round_0 --> round_1 --> round_0 --> round_1 ....

    //tell client to start game
    socket.on("start_round_0", (data) => {
      console.log("data.totalRound: " + data.totalRound);
      if (globalMaxRounds === -1) {
        globalMaxRounds = data.totalRound;
      }
      setScore(data.scores);
      if (data.round >= 2 * globalMaxRounds + 1 && globalMaxRounds !== -1) {
        //data.round will always be a odd number starting from 3 and increase by 2
        setEndGame(true);
      }
      setRound(data.round);
      setBoxes(data.boxes);
      setScore(data.scores);
      setInGame(true);
    });

    //makes new round
    socket.on("start_round_1", (data) => {
      setRound(data.round);
      setBoxes(data.boxes);
    });
  }, [socket]);

  if (endGame) {
    return (
      <Leaderboard
        players={lobbyData?.players}
        scores={score}
        maxRounds={globalMaxRounds}
      />
    );
  }
  if (inGame) {
    return (
      <Game
        score={score}
        boxes={boxes}
        setBoxes={setBoxes}
        round={round}
        timeLimit={5 * round}
        adminId={adminId}
        playerID={lobbyData?.players.findIndex(
          (player) => player.name === name
        )}
        socket={socket}
        players={lobbyData?.players}
      />
    );
  } else if (lobbyData) {
    return (
      <Lobby
        socket={socket}
        lobbyCode={lobbyData?.code}
        adminId={lobbyData?.adminId}
        players={lobbyData?.players}
        startGame={startGame}
      />
    );
  } else {
    return (
      <div className="d-flex w-100 h-100 justify-content-center align-items-center">
        <div className="card text-center p-5">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>Sorry, the page you are looking for does not exist.</p>
        </div>
      </div>
    );
  }
}
