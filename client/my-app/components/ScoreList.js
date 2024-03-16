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
function ScoreList({ players, adminId }) {
  let listIndex = -1;
  return (
    <div className="h-100 d-flex flex-column justify-content-start overflow-auto list-group list-group-flush">
      {players.map((player) => {
        listIndex = (listIndex + 1) % 8;
        return (
          <ScoreListTile
            key={player.playerId}
            player={player}
            color={colorList[listIndex]}
            isAdmin={player.playerId === adminId}
          />
        );
      })}
    </div>
  );
}

export default ScoreList;
