import GameGrid from "./GameGrid";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ScoreList from "./ScoreList";
function Game({
  boxes,
  setBoxes,
  adminId,
  timeLimit,
  isCreator,
  round,
  playerID,
  players,
  socket,
}) {
  const [colour, setColour] = useState("white");
  const [displayedRound, setDisplayedRound] = useState(Math.ceil(round / 2));
  //the data.round increments during the whiteboard time, so the correct displayed round is ceil(data.round/2)

  const router = useRouter();
  const [timer, setTimer] = useState(timeLimit);
  //changes gameState: display round number, alternate between memorizing and guessing round events, display timer
  useEffect(() => {
    setDisplayedRound(Math.ceil(round / 2));
    const interval = setInterval(() => {
      if (timer == 0) {
        if (round % 2) {
          //memory round
          if (isCreator) {
            socket.emit("end_round_0", { round: round + 1, lobby: socket.id });
          }
        } else {
          socket.emit("end_round_1", {
            lobby: router.query.id,
            round: round + 1,
            player: playerID,
            guess: boxes,
          });
        }
        setTimer(timeLimit);
      }
      setTimer((timer) => timer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, displayedRound]);

  return (
    <>
      <div className="header">
        <div className="code-info position-absolute m-3 top-0 start-0 display-1 font-weight-bold text-white title">
          <h2>Pixel Vision</h2>
        </div>
        <div className="code-info position-absolute m-3 mx-5 top-0 end-0 display-1 font-weight-bold text-white title">
          <h2>{timer}</h2>
        </div>
      </div>
      <div className="h-100 d-flex flex-row align-items-center justify-content-center">
        <div
          className="bg-light bg-light mx-3 rounded shadow col-sm-6 d-flex flex-column justify-content-center align-items-center"
          style={{ height: "75vh", width: "75vh" }}
        >
          <h1>Round: {displayedRound}</h1>
          <GameGrid
            height={boxes.length}
            width={boxes[0].length}
            colour={colour}
            boxes={boxes}
            setBoxes={setBoxes}
          />
        </div>
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
        <div className="h-75 bg-light rounded shadow col-sm-3 d-flex flex-column justify-content-around overflow-auto">
          <ScoreList players={players} adminId={adminId} />
        </div>
      </div>
    </>
  );
}

export default Game;
