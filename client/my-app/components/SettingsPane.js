function SettingsPane({ socket, startGame }) {
  //clicking create game button starts game event
  // const startGame = () => {
  //   const round = parseInt(document.querySelector("#rounds-select").value, 10);
  //   //working on getting the restrictions from settings
  //   const maxPlayer = parseInt(
  //     document.querySelector("#players-select").value,
  //     10
  //   );
  //   const time = parseInt(document.querySelector("#time-select").value, 10);

  //   const score = new Array(players.length).fill(0);
  //   socket.emit("start_game_req", { lobby, score, round });
  // };
  const onClickStartGame = () => {
    let lobbyName =
      document.querySelector("#gameSettingsLobbyName").value ?? "";
    if (lobbyName.length === 0) {
      lobbyName = "My Lobby";
    }
    const settings = {
      lobbyName: lobbyName,
      maxPlayer: parseInt(document.querySelector("#players-select").value) ?? 2,
      drawingTime: parseInt(document.querySelector("#time-select").value) ?? 30,
      rounds: parseInt(document.querySelector("#rounds-select").value) ?? 2,
    };
    console.log("settings", settings);
    startGame(settings);
  };

  return (
    <div className="settings-pane h-75 px-3 pb-2 bg-light rounded shadow mx-5 col-sm-5 d-flex flex-column justify-content-around">
      <h1 className="text-center"> Settings </h1>
      <div className="h-75 d-flex flex-column justify-content-between">
        <div className="h-75 p-2 d-flex flex-column justify-content-between">
          <div className="form-group pb-3">
            <label htmlFor="gameSettingsLobbyName" className="form-label fs-5">
              Lobby Name
            </label>
            <input
              className="form-control form-control-lg"
              placeholder="My Lobby"
              id="gameSettingsLobbyName"
              maxLength="25"
            />
          </div>
          <div className="form-group pb-3">
            <label htmlFor="gameSettingsLobbyName" className="form-label fs-5">
              Max Players
            </label>
            <select
              className="form-select form-select-lg"
              id="players-select"
              defaultValue={"4"}
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>
          <div className="form-group pb-3">
            <label htmlFor="gameSettingsLobbyName" className="form-label fs-5">
              Drawing Time (Seconds)
            </label>
            <select
              className="form-select form-select-lg"
              id="time-select"
              defaultValue={"90"}
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
              <option value="60">60</option>
              <option value="75">75</option>
              <option value="90">90</option>
              <option value="100">100</option>
              <option value="120">120</option>
              <option value="160">160</option>
              <option value="180">175</option>
              <option value="200">215</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="gameSettingsLobbyName" className="form-label fs-5">
              Rounds
            </label>
            <select
              className="form-select form-select-lg"
              id="rounds-select"
              defaultValue={"3"}
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
        </div>

        <div className="d-grid">
          <input
            className="mt-2 create-room-button btn btn-lg btn-success mx-2 w-auto"
            type="button"
            value="START GAME"
            onClick={onClickStartGame}
          />
        </div>
      </div>
    </div>
  );
}

export default SettingsPane;
