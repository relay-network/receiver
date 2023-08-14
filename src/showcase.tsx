import "./polyfills";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Wallet } from "@ethersproject/wallet";
import { create } from "zustand";
import { useClient } from "./use-client";
import { useAllMessagesStream } from "./use-all-messages-stream";
import { useSendMessage } from "./use-send-message";
import { useFetchConversations } from "./use-fetch-conversations";
import { useFetchPeerOnNetwork } from "./use-fetch-peer-on-network";
import { useAllConversationsStream } from "./use-all-conversations-stream";
import { useFetchMessages } from "./use-fetch-messages";
import { useMessagesStream } from "./use-messages-stream";

/* ****************************************************************************
 *
 * APP
 *
 * ****************************************************************************/

const App = () => {
  return (
    <main className="h-screen w-screen flex flex-row">
      <FeatureList />
      <Showcase wallet={WALLETS[0]} />
      <Showcase wallet={WALLETS[1]} />
      <Showcase wallet={WALLETS[2]} />
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
  basic: [
    "useClient",
    "useFetchConversations",
    "useFetchMessages",
    "useSendMessage",
    "useAllMessagesStream",
    "useAllConversationsStream",
    "useMessagesStream",
    "useFetchPeerOnNetwork",
  ],
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
      <UseFetchConversations wallet={wallet} />
      <UseFetchPeerOnNetwork wallet={wallet} />
      <UseAllConversationsStream wallet={wallet} />
      <UseFetchMessages wallet={wallet} />
      <UseMessagesStream wallet={wallet} />
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
  const stream = useAllMessagesStream({ address: wallet.address, wallet });
  const [lastMessage, setLastMessage] = useState<Date | null>(null);

  if (stream.isError) {
    console.error(stream.error);
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl mb-6">useAllMessagesStream</h1>
      <h2>Status</h2>
      <p>
        {(() => {
          if (stream.isIdle) {
            return "Idle";
          } else if (stream.isPending) {
            return "Pending";
          } else if (stream.isSuccess) {
            return "Success";
          } else if (stream.isError) {
            return "Error";
          } else {
            throw new Error("Unhandled stream state");
          }
        })()}
      </p>
      {stream.isIdle && (
        <button
          className={cn({
            "bg-green-200 hover:bg-green-300 rounded-md p-2 mt-4 w-64": true,
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
            "bg-red-200 hover:bg-red-300 rounded-md p-2 mt-4 w-64": true,
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
          className={cn({ "bg-gray-200 rounded-md p-2 mt-4 w-64": true })}
          onClick={undefined}
        >
          Pending...
        </button>
      )}
      <button
        className={cn({
          "bg-green-200 hover:bg-green-300 rounded-md p-2 mt-4 w-64":
            stream.isSuccess,
          "bg-gray-200 rounded-md p-2 mt-4 w-64": !stream.isSuccess,
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
  const [messageToSend, setMessageToSend] = useState<string | null>(null);

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
        onChange={(e) => setMessageToSend(e.target.value)}
        value={messageToSend || ""}
      />
      <button
        className={cn({
          "bg-green-200 hover:bg-green-300 rounded-md p-2 mt-4 w-64":
            (send.sendMessage !== null && send.isIdle) || send.isSuccess,
          "bg-gray-200 rounded-md p-2 mt-4 w-64":
            send === null || send.isPending,
          "bg-red-200 rounded-md p-2 mt-4 w-64": send.isError,
        })}
        onClick={async () => {
          if (
            send.sendMessage === null ||
            recipientAddress === null ||
            messageToSend === null
          ) {
            return undefined;
          } else {
            await send.sendMessage({
              conversation: {
                peerAddress: recipientAddress,
              },
              content: messageToSend,
            });
            setMessageToSend(null);
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
 * UseFetchConversations
 *
 * ****************************************************************************/

const UseFetchConversations = ({ wallet }: { wallet: Wallet }) => {
  const fetchConversations = useFetchConversations({
    address: wallet.address,
    wallet,
  });
  const [numConversations, setNumConversations] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl mb-6">useFetchConversations</h1>
      <h2>Status</h2>
      <p>
        {(() => {
          if (fetchConversations.isIdle) {
            return "Idle";
          } else if (fetchConversations.isPending) {
            return "Pending";
          } else if (fetchConversations.isSuccess) {
            return "Success";
          } else if (fetchConversations.isError) {
            return "Error";
          } else {
            throw new Error("Unhandled stream state");
          }
        })()}
      </p>
      <button
        className={cn({
          "bg-green-200 hover:bg-green-300 rounded-md p-2 mt-4 w-64":
            (fetchConversations.fetchConversations !== null &&
              fetchConversations.isIdle) ||
            fetchConversations.isSuccess,
          "bg-gray-200 rounded-md p-2 mt-4 w-64":
            fetchConversations === null || fetchConversations.isPending,
          "bg-red-200 rounded-md p-2 mt-4 w-64": fetchConversations.isError,
        })}
        onClick={async () => {
          if (fetchConversations.fetchConversations === null) {
            return undefined;
          } else {
            const conversations = await fetchConversations.fetchConversations();
            if (conversations === undefined) {
              console.error("Error fetching conversations");
            } else {
              setNumConversations(conversations.length);
            }
          }
        }}
      >
        Fetch Conversations
      </button>
      <h2>Number of Conversations</h2>
      <p>
        {(() => {
          if (numConversations === null) {
            return "No conversations fetched yet";
          } else {
            return numConversations;
          }
        })()}
      </p>
    </div>
  );
};

/* ****************************************************************************
 *
 * UseFetchPeerOnNetwork
 *
 * ****************************************************************************/

const UseFetchPeerOnNetwork = ({ wallet }: { wallet: Wallet }) => {
  const fetchPeerOnNetwork = useFetchPeerOnNetwork({
    address: wallet.address,
    wallet,
  });
  const [peerToCheck, setPeerToCheck] = useState<string | null>(null);
  const [peerOnNetwork, setPeerOnNetwork] = useState<boolean | null>(null);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl mb-6">useFetchPeerOnNetwork</h1>
      <h2>Status</h2>
      <p>
        {(() => {
          if (fetchPeerOnNetwork.isIdle) {
            return "Idle";
          } else if (fetchPeerOnNetwork.isPending) {
            return "Pending";
          } else if (fetchPeerOnNetwork.isSuccess) {
            return "Success";
          } else if (fetchPeerOnNetwork.isError) {
            return "Error";
          } else {
            throw new Error("Unhandled stream state");
          }
        })()}
      </p>
      <input
        className="w-80 bg-gray-100 rounded-md p-2 mt-4"
        placeholder="Enter 0xAddress"
        onChange={(e) => setPeerToCheck(e.target.value)}
        value={peerToCheck || ""}
      />
      <button
        className={cn({
          "bg-green-200 hover:bg-green-300 rounded-md p-2 mt-4 w-64":
            (fetchPeerOnNetwork.fetchPeerOnNetwork !== null &&
              fetchPeerOnNetwork.isIdle) ||
            fetchPeerOnNetwork.isSuccess,
          "bg-gray-200 rounded-md p-2 mt-4 w-64":
            fetchPeerOnNetwork === null || fetchPeerOnNetwork.isPending,
          "bg-red-200 rounded-md p-2 mt-4 w-64": fetchPeerOnNetwork.isError,
        })}
        onClick={async () => {
          if (
            fetchPeerOnNetwork.fetchPeerOnNetwork === null ||
            peerToCheck === null
          ) {
            return undefined;
          } else {
            const peerOnNetwork = await fetchPeerOnNetwork.fetchPeerOnNetwork({
              peerAddress: peerToCheck,
            });
            if (peerOnNetwork === undefined) {
              console.error("Error fetching peer on network");
            } else {
              setPeerOnNetwork(peerOnNetwork);
            }
          }
        }}
      >
        Check if Peer is on Network
      </button>
      <h2>Yes/No</h2>
      <p>
        {(() => {
          if (peerOnNetwork === null) {
            return "Haven't checked yet";
          } else {
            return peerOnNetwork ? "Yes" : "No";
          }
        })()}
      </p>
    </div>
  );
};

/* ****************************************************************************
 *
 * UseAllConversationsStream
 *
 * ****************************************************************************/

const UseAllConversationsStream = ({ wallet }: { wallet: Wallet }) => {
  const stream = useAllConversationsStream({ address: wallet.address, wallet });
  const [lastConversation, setLastConversation] = useState<string | null>(null);

  if (stream.isError) {
    console.error(stream.error);
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl mb-6">useAllConversationsStream</h1>
      <h2>Status</h2>
      <p>
        {(() => {
          if (stream.isIdle) {
            return "Idle";
          } else if (stream.isPending) {
            return "Pending";
          } else if (stream.isSuccess) {
            return "Success";
          } else if (stream.isError) {
            return "Error";
          } else {
            throw new Error("Unhandled stream state");
          }
        })()}
      </p>
      {stream.isIdle && (
        <button
          className={cn({
            "bg-green-200 hover:bg-green-300 rounded-md p-2 mt-4 w-64": true,
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
            "bg-red-200 hover:bg-red-300 rounded-md p-2 mt-4 w-64": true,
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
          className={cn({ "bg-gray-200 rounded-md p-2 mt-4 w-64": true })}
          onClick={undefined}
        >
          Pending...
        </button>
      )}
      <button
        className={cn({
          "bg-green-200 hover:bg-green-300 rounded-md p-2 mt-4 w-64":
            stream.isSuccess,
          "bg-gray-200 rounded-md p-2 mt-4 w-64": !stream.isSuccess,
        })}
        onClick={() => {
          if (stream.listen === null) {
            return undefined;
          } else {
            stream.listen((conversation) => {
              setLastConversation(conversation.peerAddress);
            });
          }
        }}
      >
        Listen
      </button>
      <h2 className="my-4">Last Conversation Address</h2>
      <p>{String(lastConversation || "No conversation streamed yet.")}</p>
    </div>
  );
};

/* ****************************************************************************
 *
 * UseFetchMessages
 *
 * ****************************************************************************/

const UseFetchMessages = ({ wallet }: { wallet: Wallet }) => {
  const fetchMessages = useFetchMessages({
    address: wallet.address,
    wallet,
  });
  const [peerAddress, setPeerAddress] = useState<string | null>(null);
  const [numMessages, setNumMessages] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl mb-6">useFetchMessages</h1>
      <h2>Status</h2>
      <p>
        {(() => {
          if (fetchMessages.isIdle) {
            return "Idle";
          } else if (fetchMessages.isPending) {
            return "Pending";
          } else if (fetchMessages.isSuccess) {
            return "Success";
          } else if (fetchMessages.isError) {
            return "Error";
          } else {
            throw new Error("Unhandled stream state");
          }
        })()}
      </p>
      <input
        className="w-80 bg-gray-100 rounded-md p-2 mt-4"
        placeholder="Enter 0xAddress"
        onChange={(e) => setPeerAddress(e.target.value)}
        value={peerAddress || ""}
      />
      <button
        className={cn({
          "bg-green-200 hover:bg-green-300 rounded-md p-2 mt-4 w-64":
            (fetchMessages.fetchMessages !== null && fetchMessages.isIdle) ||
            fetchMessages.isSuccess,
          "bg-gray-200 rounded-md p-2 mt-4 w-64":
            fetchMessages === null || fetchMessages.isPending,
          "bg-red-200 rounded-md p-2 mt-4 w-64": fetchMessages.isError,
        })}
        onClick={async () => {
          if (fetchMessages.fetchMessages === null || peerAddress === null) {
            return undefined;
          } else {
            const messages = await fetchMessages.fetchMessages({
              peerAddress,
            });
            if (messages === undefined) {
              console.error("Error fetching conversations");
            } else {
              setNumMessages(messages.length);
            }
          }
        }}
      >
        Fetch Messages
      </button>
      <h2>Number of Messages</h2>
      <p>
        {(() => {
          if (numMessages === null) {
            return "No messages fetched yet";
          } else {
            return numMessages;
          }
        })()}
      </p>
    </div>
  );
};

/* ****************************************************************************
 *
 * UseMessagesStream
 *
 * ****************************************************************************/

const UseMessagesStream = ({ wallet }: { wallet: Wallet }) => {
  const [peerAddress, setPeerAddress] = useState<string | null>(null);
  const stream = useMessagesStream({
    address: wallet.address,
    wallet,
    peerAddress,
  });
  const [lastMessage, setLastMessage] = useState<{
    peerAddress: string;
    content: string;
  } | null>(null);

  if (stream.isError) {
    console.error(stream.error);
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl mb-6">useMessagesStream</h1>
      <h2>Status</h2>
      <p>
        {(() => {
          if (stream.isIdle) {
            return "Idle";
          } else if (stream.isPending) {
            return "Pending";
          } else if (stream.isSuccess) {
            return "Success";
          } else if (stream.isError) {
            return "Error";
          } else {
            throw new Error("Unhandled stream state");
          }
        })()}
      </p>
      <input
        className="w-80 bg-gray-100 rounded-md p-2 mt-4"
        placeholder="Enter 0xAddress"
        onChange={(e) => setPeerAddress(e.target.value)}
        value={peerAddress || ""}
      />
      {stream.isIdle && (
        <button
          className={cn({
            "bg-green-200 hover:bg-green-300 rounded-md p-2 mt-4 w-64": true,
          })}
          onClick={() => {
            if (stream.start === null) {
              throw new Error("Stream start is null even though it's idle");
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
            "bg-red-200 hover:bg-red-300 rounded-md p-2 mt-4 w-64": true,
          })}
          onClick={() => {
            if (stream.stop === null) {
              throw new Error("Stream stop is null even though it's success");
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
          className={cn({ "bg-gray-200 rounded-md p-2 mt-4 w-64": true })}
          onClick={undefined}
        >
          Pending...
        </button>
      )}
      <button
        className={cn({
          "bg-green-200 hover:bg-green-300 rounded-md p-2 mt-4 w-64":
            stream.isSuccess,
          "bg-gray-200 rounded-md p-2 mt-4 w-64": !stream.isSuccess,
        })}
        onClick={() => {
          if (stream.listen === null) {
            return undefined;
          } else {
            stream.listen((message) => {
              setLastMessage({
                peerAddress: message.conversation.peerAddress,
                content: String(message.content),
              });
            });
          }
        }}
      >
        Listen
      </button>
      <h2 className="my-4">Last Message</h2>
      <p>{String(lastMessage?.peerAddress || "No message received yet.")}</p>
      <p>{String(lastMessage?.content || "No message received yet.")}</p>
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
