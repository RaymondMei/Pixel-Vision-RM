import { useRouter } from "next/router";
import React from "react";
import Lobby from "../Lobby";
import { useState, useEffect } from "react";
import Game from "../../components/Game";
import Leaderboard from "../Leaderboard";

export const roundStates = {
  beforeGame: 0,
  preRound: 1,
  inGame: 2,
  postRound: 3,
  afterGame: 4,
};

export default function GameInstance({ socket, lobbyData, setLobbyData }) {
  const router = useRouter();
  const playerId = socket.id;
  const [roundStatus, setRoundStatus] = useState(roundStates.beforeGame);
  const [boxes, setBoxes] = useState([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(
    new Array(lobbyData?.players.length).fill(0)
  );
  let globalMaxRounds = -1;

  const [settings, setSettings] = useState({
    lobbyName: "My Lobby",
    maxPlayer: 2,
    drawingTime: 30,
    totalRounds: 2,
  });

  const startGame = (settings) => {
    setSettings(settings);
    lobbyData.settings = settings;
    socket.emit("start_game_req", lobbyData, (err, res) => {
      if (err || !res.success) {
        console.log(`Error: ${err["errMsg"] ?? ""}. ${err}`);
      }
    });
  };

  const handleChangeRoundStatus = (prev, cur, grid = []) => {
    if (prev === roundStates.preRound && cur === roundStates.inGame) {
      // memo round end and start drawing round
      const blankGrid = new Array(boxes.length)
        .fill("white")
        .map(() => new Array(boxes.length).fill("white"));
      setBoxes(blankGrid);
      setRoundStatus(roundStates.inGame);
    } else if (prev === roundStates.inGame && cur === roundStates.preRound) {
      // (new round) drawing round end and new memo round
      socket.emit(
        "end_round",
        {
          lobbyData: lobbyData,
          playerId: socket.id,
          guess: boxes,
        },
        (res) => {
          if (!res.success) {
            document.querySelector(".invalid").innerHTML = `Error: ${
              res.errMsg ?? ""
            }.`;
            console.log(`Error: ${res["errMsg"] ?? ""}. ${err}`);
          } else if (res.success) {
            setLobbyData({ ...lobbyData, players: [...res.data] });
          }
        }
      );
      // setBoxes(grid);
      // setRoundStatus(roundStates.preRound);
    }
  };

  useEffect(() => {
    // new player joins the lobby
    socket.on("update_lobby", (data) => {
      setLobbyData(data);
    });

    socket.on("start_pre_round", (lobbyData) => {
      console.log("starting pre round", lobbyData);
      if (lobbyData.round > lobbyData.settings.totalRounds) {
        setRoundStatus(roundStates.afterGame);
      } else {
        setLobbyData(lobbyData);
        setBoxes(lobbyData.grid);
        setRound(lobbyData.round);
        setScore(
          lobbyData.players.find((player) => player.playerId === playerId)
        );
        setRoundStatus(roundStates.preRound);
      }
    });

    //note:
    //game starts on round_0
    //cycles like: round_0 --> round_1 --> round_0 --> round_1 ....

    //tell client to start game
    // socket.on("start_round_0", (data) => {
    //   console.log("data.totalRound: " + data.totalRound);
    //   if (globalMaxRounds === -1) {
    //     globalMaxRounds = data.totalRound;
    //   }
    //   setScore(data.scores);
    //   if (data.round >= 2 * globalMaxRounds + 1 && globalMaxRounds !== -1) {
    //     //data.round will always be a odd number starting from 3 and increase by 2
    //     setEndGame(true);
    //   }
    //   setRound(data.round);
    //   setBoxes(data.boxes);
    //   setScore(data.scores);
    //   setInGame(true);
    // });

    //makes new round
    // socket.on("start_round_1", (data) => {
    //   setRound(data.round);
    //   setBoxes(data.boxes);
    // });
  }, [socket]);

  switch (roundStatus) {
    case roundStates.afterGame:
      return (
        <Leaderboard players={lobbyData?.players} maxRounds={globalMaxRounds} />
      );
    case roundStates.inGame:
    case roundStates.preRound:
    case roundStates.postRound:
      return (
        <Game
          roundStatus={roundStatus}
          setRoundStatus={setRoundStatus}
          handleChangeRoundStatus={handleChangeRoundStatus}
          lobbyData={lobbyData}
          setLobbyData={setLobbyData}
          boxes={boxes}
          setBoxes={setBoxes}
          round={round}
          timeLimit={
            roundStatus === roundStates.inGame
              ? lobbyData?.settings?.drawingTime ?? 90
              : Math.ceil((lobbyData?.settings?.drawingTime ?? 25) / 5)
          }
          adminId={lobbyData?.adminId}
          playerId={lobbyData?.players.findIndex(
            (player) => player.playerId === playerId
          )}
          socket={socket}
          players={lobbyData?.players}
        />
      );
    default:
      if (lobbyData) {
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
}
