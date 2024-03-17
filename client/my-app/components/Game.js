import GameGrid from "./GameGrid";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ScoreList from "./ScoreList";
import { roundStates } from "../pages/game/[id]";
function Game({
  roundStatus,
  setRoundStatus,
  handleChangeRoundStatus,
  lobbyData,
  setLobbyData,
  boxes,
  setBoxes,
  timeLimit,
  adminId,
  round,
  playerId,
  players,
  socket,
}) {
  const router = useRouter();
  const [displayedRound, setDisplayedRound] = useState(round);
  const [timer, setTimer] = useState(timeLimit);

  const [colour, setColour] = useState("white");

  // switch (roundStatus) {
  //   case roundStates.preRound:
  //     setTimer(Math.ceil(timeLimit / 5));
  // }

  useEffect(() => {
    setTimer(timeLimit);
  }, [timeLimit]);

  //changes gameState: display round number, alternate between memorizing and guessing round events, display timer
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("time", timer, timeLimit);
      if (timer === 0) {
        //memory round
        if (roundStatus === roundStates.preRound) {
          handleChangeRoundStatus(roundStates.preRound, roundStates.inGame);
          clearInterval(interval);
        } else if (roundStatus === roundStates.inGame) {
          handleChangeRoundStatus(roundStates.inGame, roundStates.preRound);
          clearInterval(interval);
        }
      }
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <>
      <div className="header">
        <div className="code-info position-absolute m-3 top-0 start-0 display-1 font-weight-bold text-white title">
          <h2>Pixel Vision</h2>
        </div>
        <div className="code-info position-absolute m-3 mx-5 top-0 end-0 display-1 font-weight-bold text-white title">
          <h2>{timer}</h2>
        </div>
        <div className="position-absolute bottom-0">
          <button onClick={() => setRoundStatus(roundStates.preRound)}>
            preRound
          </button>
          <button
            onClick={() => {
              handleChangeRoundStatus(roundStates.preRound, roundStates.inGame);
            }}
          >
            inGame
          </button>
          <button onClick={() => setRoundStatus(roundStates.postRound)}>
            postRound
          </button>
        </div>
      </div>
      <div className="h-100 d-flex flex-row align-items-center justify-content-center">
        <div
          className="bg-light bg-light mx-3 rounded shadow col-sm-6 d-flex flex-column justify-content-center align-items-center"
          style={{ height: "75vh", width: "75vh" }}
        >
          <h1>Round: {displayedRound}</h1>
          <GameGrid
            inGame={roundStatus === roundStates.inGame}
            height={boxes.length}
            width={boxes[0].length}
            colour={colour}
            boxes={boxes}
            setBoxes={setBoxes}
          />
        </div>
        {roundStatus === roundStates.inGame && (
          <div className="colours col-5 d-flex flex-row justify-content-center gap-4 position-absolute top-0 p-3">
            <div
              className="rounded-circle shadow-lg border border-3 border-dark"
              style={{
                aspectRatio: "1 / 1",
                height: "100%",
                minHeight: "10px",
                backgroundColor: "red",
                cursor: "pointer",
              }}
              onClick={() => {
                setColour("red");
              }}
            ></div>
            <div
              className="rounded-circle shadow-lg border border-3 border-dark"
              style={{
                aspectRatio: "1 / 1",
                height: "100%",
                minHeight: "10px",
                backgroundColor: "blue",
                cursor: "pointer",
              }}
              onClick={() => setColour("blue")}
            ></div>
            <div
              className="rounded-circle shadow-lg border border-3 border-dark"
              style={{
                aspectRatio: "1 / 1",
                height: "100%",
                minHeight: "10px",
                backgroundColor: "yellow",
                cursor: "pointer",
              }}
              onClick={() => setColour("yellow")}
            ></div>
            <div
              className="rounded-circle shadow-lg border border-3 border-dark"
              style={{
                aspectRatio: "1 / 1",
                height: "100%",
                minHeight: "10px",
                backgroundColor: "green",
                cursor: "pointer",
              }}
              onClick={() => setColour("green")}
            ></div>
            <div
              className="rounded-circle shadow-lg border border-3 border-dark"
              style={{
                aspectRatio: "1 / 1",
                height: "100%",
                minHeight: "10px",
                backgroundColor: "black",
                cursor: "pointer",
              }}
              onClick={() => setColour("black")}
            ></div>
          </div>
        )}
        <div className="h-75 bg-light rounded shadow col-sm-3 d-flex flex-column justify-content-around overflow-auto">
          <ScoreList players={players} adminId={adminId} />
        </div>
      </div>
    </>
  );
}

export default Game;
