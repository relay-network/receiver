import "./polyfills";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Wallet } from "@ethersproject/wallet";
import { create } from "zustand";
import { useClient } from "./use-client";
import { useAllMessageStream } from "./use-all-messages-stream";
import { useSendMessage } from "./use-send-message";

/* ****************************************************************************
 *
 * APP
 *
 * ****************************************************************************/

const App = () => {
  return (
    <main className="h-screen w-screen flex flex-row overflow-hidden">
      <FeatureList />
      <Showcase wallet={WALLETS[0]} />
      <Showcase wallet={WALLETS[1]} />
    </main>
  );
};

/* ****************************************************************************
 *
 * FeatureList
 *
 * ****************************************************************************/

const useFeaturesList = create<{
  basic: string[];
  advanced: string[];
  selectedFeature: string | null;
  setSelectedFeature: (feature: string | null) => void;
}>((set) => ({
  basic: ["useClient", "useAllMessagesStream", "useSendMessage"],
  advanced: [
    "groupchat (coming soon!)",
    "kv (coming soon!)",
    "rpc (coming soon!)",
    "streaming (coming soon!)",
    "chatbot (coming soon!)",
  ],
  selectedFeature: "use-client",
  setSelectedFeature: (selectedFeature) => set({ selectedFeature }),
}));

const FeatureList = () => {
  const { basic, advanced, selectedFeature, setSelectedFeature } =
    useFeaturesList();
  return (
    <div className="flex-col items-center p-6 pr-0 w-96">
      <h1 className="text-2xl mb-4">Basic Hooks</h1>
      <ul>
        {basic.map((hook) => {
          return (
            <li
              onClick={() => setSelectedFeature(hook)}
              key={hook}
              className={cn({
                "cursor-pointer hover:font-bold": true,
                "border-r-4 border-gray-500": hook === selectedFeature,
              })}
            >
              {hook}
            </li>
          );
        })}
      </ul>
      <h1 className="text-2xl my-4">Advanced Features</h1>
      <ul>
        {advanced.map((feature) => {
          return (
            <li
              onClick={() => setSelectedFeature(feature)}
              key={feature}
              className={cn({
                "cursor-pointer hover:font-bold": true,
                "border-r-4 border-gray-500": feature === selectedFeature,
              })}
            >
              {feature}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/* ****************************************************************************
 *
 * Showcase
 *
 * ****************************************************************************/

const Showcase = ({ wallet }: { wallet: Wallet }) => {
  return (
    <div className="flex flex-col gap-12 p-6 w-[1080px]">
      <UseClient wallet={wallet} />
      <UseAllMessagesStream wallet={wallet} />
      <UseSendMessage wallet={wallet} />
    </div>
  );
};

/* ****************************************************************************
 *
 * UseClient
 *
 * ****************************************************************************/

const UseClient = ({ wallet }: { wallet: Wallet }) => {
  const client = useClient({ address: wallet.address, wallet });

  if (client.isError) {
    console.error(client.error);
  }

  console.log(client);

  return (
    <div>
      <h1 className="text-2xl mb-6">useClient</h1>
      <h2>Status</h2>
      <p>{client.client.id}</p>
      <h2>Address</h2>
      <p>
        {(() => {
          if (client.isSuccess) {
            return client.client.data;
          } else {
            return "Client Not Started";
          }
        })()}
      </p>
      {client.isIdle && (
        <button
          className={cn({
            "bg-green-200 hover:bg-green-300 rounded-md p-2 mt-4 w-24": true,
          })}
          onClick={() => {
            if (client.start === null) {
              throw new Error("Client start is null even though it's idle");
            } else {
              client.start();
            }
          }}
        >
          Start
        </button>
      )}
      {client.isSuccess && (
        <button
          className={cn({
            "bg-red-200 hover:bg-red-300 rounded-md p-2 mt-4 w-24": true,
          })}
          onClick={() => {
            if (client.stop === null) {
              throw new Error("Client stop is null even though it's success");
            } else {
              client.stop();
            }
          }}
        >
          Stop
        </button>
      )}
      {client.isPending && (
        <button
          className={cn({ "bg-gray-200 rounded-md p-2 mt-4 w-24": true })}
          onClick={undefined}
        >
          Pending...
        </button>
      )}
    </div>
  );
};

/* ****************************************************************************
 *
 * UseAllMessagesStream
 *
 * ****************************************************************************/

const UseAllMessagesStream = ({ wallet }: { wallet: Wallet }) => {
  const stream = useAllMessageStream({ address: wallet.address, wallet });
  const [lastMessage, setLastMessage] = useState<Date | null>(null);

  if (stream.isError) {
    console.error(stream.error);
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl mb-6">useAllMessagesStream</h1>
      <h2>Status</h2>
      <p>{stream.stream.id}</p>
      {stream.isIdle && (
        <button
          className={cn({
            "bg-green-200 hover:bg-green-300 rounded-md p-2 mt-4 w-32": true,
          })}
          onClick={() => {
            if (stream.start === null) {
              throw new Error("Client start is null even though it's idle");
            } else {
              stream.start();
            }
          }}
        >
          Start Stream
        </button>
      )}
      {stream.isSuccess && (
        <button
          className={cn({
            "bg-red-200 hover:bg-red-300 rounded-md p-2 mt-4 w-32": true,
          })}
          onClick={() => {
            if (stream.stop === null) {
              throw new Error("Client stop is null even though it's success");
            } else {
              stream.stop();
            }
          }}
        >
          Stop Stream
        </button>
      )}
      {stream.isPending && (
        <button
          className={cn({ "bg-gray-200 rounded-md p-2 mt-4 w-32": true })}
          onClick={undefined}
        >
          Pending...
        </button>
      )}
      <button
        className={cn({
          "bg-green-200 hover:bg-green-300 rounded-md p-2 mt-4 w-32":
            stream.isSuccess,
          "bg-gray-200 rounded-md p-2 mt-4 w-32": !stream.isSuccess,
        })}
        onClick={() => {
          if (stream.listen === null) {
            return undefined;
          } else {
            stream.listen((message) => {
              setLastMessage(message.sent);
            });
          }
        }}
      >
        Listen
      </button>
      <h2 className="my-4">Last Message Timestamp</h2>
      <time>{String(lastMessage || "No message received yet.")}</time>
    </div>
  );
};

/* ****************************************************************************
 *
 * UseSendMessage
 *
 * ****************************************************************************/

const UseSendMessage = ({ wallet }: { wallet: Wallet }) => {
  const send = useSendMessage({ address: wallet.address, wallet });
  const [recipientAddress, setRecipientAddress] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl mb-6">useSendMessage</h1>
      <input
        className="w-80 bg-gray-100 rounded-md p-2 mt-4"
        placeholder="Enter 0xAddress"
        onChange={(e) => setRecipientAddress(e.target.value)}
        value={recipientAddress || ""}
      />
      <input
        className="w-80 bg-gray-100 rounded-md p-2 mt-4"
        placeholder="Enter Message"
        onChange={(e) => setMessage(e.target.value)}
        value={message || ""}
      />
      <button
        className={cn({
          "bg-green-200 hover:bg-green-300 rounded-md p-2 mt-4 w-32":
            send !== null && recipientAddress !== null && message !== null,
          "bg-gray-200 rounded-md p-2 mt-4 w-32":
            send === null || recipientAddress === null || message === null,
        })}
        onClick={async () => {
          if (send === null || recipientAddress === null || message === null) {
            return undefined;
          } else {
            await send({
              conversation: {
                peerAddress: recipientAddress,
              },
              content: message,
            });
            setMessage(null);
          }
        }}
      >
        Send
      </button>
    </div>
  );
};

/* ****************************************************************************
 *
 * HELPERS
 *
 * ****************************************************************************/

const cn = (names: Record<string, boolean>) => {
  return Object.entries(names)
    .filter(([, condition]) => condition)
    .map(([name]) => name)
    .join(" ");
};

const WALLETS = [
  (() => {
    try {
      return new Wallet(import.meta.env.VITE_TEST_PK);
    } catch (e) {
      console.error("Couldn't create wallet, did you set VITE_TEST_PK?");
      throw e;
    }
  })(),

  (() => {
    try {
      return Wallet.createRandom();
    } catch (e) {
      console.error("Wallet.createRandom() failed");
      throw e;
    }
  })(),
];

/* ****************************************************************************
 *
 * RUN APP
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
