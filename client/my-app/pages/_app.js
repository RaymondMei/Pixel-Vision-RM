import "../styles/globals.css";
import Head from "next/head";
import { useState } from "react";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.css";
import io from "socket.io-client";
const socket = io.connect("http://localhost:4000");

function MyApp({ Component, pageProps }) {
  const [name, setName] = useState("");
  const [lobby, setLobby] = useState("");
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>PixelVision</title>
        {/* <link rel="icon" type="image/png" href="../assets/favicon.png" /> */}
      </Head>

      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
        crossOrigin="anonymous"
      />
      <Component
        {...pageProps}
        name={name}
        lobby={lobby}
        setName={setName}
        setLobby={setLobby}
        socket={socket}
      />
    </>
  );
}
export default MyApp;
