import React, { useEffect } from "react";
import PlayerList from "../components/PlayerList.js";
import SettingsPane from "../components/SettingsPane.js";

function Lobby({ socket, id, isCreator, players }) {
  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <div className="lobby-head">
        <div className="code-info position-absolute m-3 top-0 start-0 display-1 font-weight-bold text-white title">
          <h4> Code: </h4>
          <h2> {id} </h2>
        </div>
      </div>
      {/* <div className="box-container">
                <div className="settings-box">
                    <Slider />
                </div>
            </div> */}

      {/* {isCreator ? <SettingsPane socket={socket} lobby={id} players={players}/> : null} */}
      <SettingsPane socket={socket} lobby={id} players={players} />

      <div className="h-75 bg-light rounded shadow col-sm-3 d-flex flex-column justify-content-around overflow-auto">
        <PlayerList players={players} />
      </div>
    </div>
  );
}

export default Lobby;
