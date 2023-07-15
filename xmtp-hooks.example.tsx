import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Wallet } from "@ethersproject/wallet";
import { usePreviews } from "./xmtp-hooks.hooks";

/* ****************************************************************************
 *
 * WALLET CONNECT
 *
 * ****************************************************************************/

const wallet = new Wallet(import.meta.env.VITE_TEST_PK);

/* ****************************************************************************
 *
 * APP
 *
 * ****************************************************************************/

const App = () => {
  const previews = usePreviews({ wallet });

  useEffect(() => {
    if (previews.startClient !== null) {
      console.log("Starting client");
      console.log(previews);
      previews.startClient();
    }
  }, []);
  return (
    <div>
      <h1>
        {previews.isPreviewsIdle && "Idle"}
        {previews.isPreviewsPending && "Loading"}
        {previews.isPreviewsError && "Error"}
        {previews.isPreviewsSuccess && "Success"}
      </h1>
    </div>
  );
};

/* ****************************************************************************
 *
 * RUN THE APP
 *
 * ****************************************************************************/

const app = () => {
  const exampleAppRoot = document.getElementById("xmtp-hooks-example-root");

  if (exampleAppRoot === null) {
    throw new Error("Root element not found");
  }

  ReactDOM.createRoot(exampleAppRoot).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

app();
