import React from "react";
import PlayerListTile from "./PlayerListTile.js";
import ScoreListTile from "./ScoreListTile.js";
const colorList = [
  "red",
  "darkorange",
  "gold",
  "lime",
  "turquoise",
  "indigo",
  "purple",
  "mediumvioletred",
];

//displays players and their scores
function ScoreList({ players, scores }) {
  let listIndex = -1;
  return (
    <div className="h-100 d-flex flex-column justify-content-start overflow-auto list-group list-group-flush">
      {players.map((player) => {
        listIndex = (listIndex + 1) % 8;
        return (
          <ScoreListTile
            username={player}
            color={colorList[listIndex]}
            score={scores[listIndex]}
            isAdmin={listIndex == 0}
          />
        );
      })}
    </div>
  );
}

export default ScoreList;
