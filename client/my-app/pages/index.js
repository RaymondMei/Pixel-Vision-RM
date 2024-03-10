import React, { useState, useEffect } from "react";
import Grid5x5 from "../components/Grid5x5";
import Link from "next/link";
import { useRouter } from "next/router";

function Home({ name, lobby, setName, setLobby, socket }) {
  const router = useRouter();
  const joinLobby = () => {
    if (lobby !== "" && name !== "") {
      socket.emit("join_lobby", { name, lobby });
    }
  };
  const createLobby = () => {
    if (name !== "") {
      const id = socket.id;
      socket.timeout(5000).emit("create_lobby", { id, name }, (err, res) => {
        if (err) {
          console.log(`Error: ${res["errMsg"] ?? ""}. ${err}`);
        } else if ("code" in res) {
          console.log("Created lobby " + res["code"]);
        }
      });

      // router.replace(`/game/${socket.id}`);
    }
  };

  useEffect(() => {
    socket.on("invalid_lobby", () => {
      document.querySelector(".invalid").innerHTML = "INVALID LOBBY CODE!";
    });
    socket.on("valid_lobby", (data) => {
      router.push(`/game/${data.lobby}`).then(() => {
        socket.emit("moved_lobbies");
        return;
      });
    });
  }, [socket]);

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
                onChange={(e) => setLobby(e.target.value)}
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
