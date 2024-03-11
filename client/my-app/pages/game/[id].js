import { useRouter } from "next/router";
import React from "react";
import Lobby from "../Lobby";
import { useState, useEffect } from "react";
import Game from "../../components/Game";
import Leaderboard from "../Leaderboard";
export default function GameInstance({ name, socket, lobbyData }) {
  const router = useRouter();
  var [players, setPlayers] = useState(lobbyData?.players ?? []);
  var [inGame, setInGame] = useState(false);
  const [boxes, setBoxes] = useState([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(new Array(players.length).fill(0));
  const [endGame, setEndGame] = useState(false);
  let globalMaxRounds = -1;

  useEffect(() => {
    // new player joins the lobby
    socket.on("update_lobby", (data) => {
      setPlayers(data.players);
    });

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
  const isCreator = socket.id == router.query.id;

  if (endGame) {
    return (
      <Leaderboard
        players={players}
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
        isCreator={isCreator}
        playerID={players.findIndex((player) => player === name)}
        socket={socket}
        players={players}
      />
    );
  } else {
    return (
      <Lobby
        socket={socket}
        id={router.query.id}
        isCreator={isCreator}
        players={players}
      />
    );
  }
}
