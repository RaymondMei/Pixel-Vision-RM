import React, { useState, useEffect } from "react";
import Grid5x5 from "../components/Grid5x5";
import Link from "next/link";
import { useRouter } from "next/router";

function Home({
  name,
  lobbyCode,
  setName,
  setLobbyCode,
  setLobbyData,
  socket,
}) {
  const router = useRouter();

  const playerId = socket.id;

  const createLobby = () => {
    if (name !== "") {
      socket
        .timeout(5000)
        .emit("create_lobby", { playerId, name }, (err, res) => {
          if (err || !res.success) {
            document.querySelector(".invalid").innerHTML = `Error: ${
              res.errMsg ?? ""
            }.`;
            console.log(`Error: ${res["errMsg"] ?? ""}.`);
          } else if (res.success && "code" in res.data) {
            console.log("Created lobby " + res.data.code);
            setLobbyData(res.data);
            router.push(`/game/${res.data.code}`);
          }
        });
    }
  };

  const joinLobby = () => {
    if (lobbyCode !== "" && name !== "") {
      socket
        .timeout(5000)
        .emit("join_lobby", { lobbyCode, playerId, name }, (err, res) => {
          if (err || !res.success) {
            document.querySelector(".invalid").innerHTML = `Error: ${
              res.errMsg ?? ""
            }.`;
            console.log(`Error: ${res["errMsg"] ?? ""}. ${err}`);
          } else if (res.success && "code" in res.data) {
            console.log("Joined lobby " + res.data.code);
            setLobbyData(res.data);
            router.push(`/game/${lobbyCode}`);
          }
        });
    }
  };

  return (
    <div className="h-100 position-absolute container-fluid d-flex flex-column">
      <header className="text-center display-1 font-weight-bold text-white title">
        Pixel Vision{" "}
      </header>
      <div className="row flex-fill justify-content-center">
        <div className="col-sm-5 d-flex justify-content-center align-items-center">
          <Grid5x5 />
        </div>

        <div className="userinfo-div col-sm-5 d-flex flex-column justify-content-center">
          <div className="userinfo-pane h-40 p-4 bg-light rounded shadow mx-5 d-flex flex-column justify-content-around">
            <div className="input-group input-group-lg">
              <span className="input-group-text">USERNAME</span>
              <input
                className="form-control"
                type="text"
                maxLength="15"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group input-group-lg">
              <input
                className="form-control"
                type="text"
                placeholder="CODE"
                onChange={(e) => setLobbyCode(e.target.value)}
              />
              <button
                className="btn btn-success"
                type="button"
                onClick={joinLobby}
              >
                JOIN
              </button>
            </div>

            <div className="text-center text-danger">
              <h5 className="invalid"></h5>
            </div>

            <div className="d-grid">
              <input
                className="create-room-button btn btn-lg btn-success w-auto"
                type="button"
                value="CREATE ROOM"
                onClick={createLobby}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
