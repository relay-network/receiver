import "./xmtp-hooks.polyfills";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Wallet } from "@ethersproject/wallet";
import { usePreviews } from "./xmtp-hooks.hooks";

/* ****************************************************************************
 *
 * WALLET CONNECT
 *
 * ****************************************************************************/

const wallet = (() => {
  try {
    return new Wallet(import.meta.env.VITE_TEST_PK);
  } catch (e) {
    console.error("Couldn't create wallet, did you set VITE_TEST_PK?");
    throw e;
  }
})();

/* ****************************************************************************
 *
 * APP
 *
 * ****************************************************************************/

const App = () => {
  const previews = usePreviews({ wallet });

  useEffect(() => {
    if (previews.startClient !== null) {
      previews.startClient();
    }
  }, []);

  return (
    <main>
      <h1>Previews Status</h1>
      <ul>
        <li>{`Idle: ${previews.isPreviewsIdle && "Idle"}`}</li>
        <li>{`Pending: ${previews.isPreviewsPending}`}</li>
        <li>{`Success: ${previews.isPreviewsSuccess}`}</li>
        <li>{`Error: ${previews.isPreviewsError}`}</li>
      </ul>
      <h1>Address</h1>
      <p>{String(previews.client?.address)}</p>
      <h1>Conversations</h1>
      {previews.previews !== null && (
        <ul>
          {previews.previews.map((preview) => {
            return (
              <li
                key={
                  preview.peerAddress + "-" + preview.context?.conversationId
                }
              >
                <h2>{preview.peerAddress}</h2>
                <h3>{String(preview.preview.sent)}</h3>
                <p>{String(preview.preview.content)}</p>
              </li>
            );
          })}
        </ul>
      )}
    </main>
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
