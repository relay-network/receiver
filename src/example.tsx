import "./polyfills";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Wallet } from "@ethersproject/wallet";
import { create } from "zustand";
import * as Lib from "./example.lib";
import { cn } from "./lib";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, zora } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton as BaseConnectButton } from "@rainbow-me/rainbowkit";
import { useClient } from "./use-client";
import { useMessageStream } from "./use-message-stream";
import { Client, Conversation } from "@xmtp/xmtp-js";
import { useConversationStream } from "./use-conversation-stream.js";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, zora],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Relay Reciever Tutorial",
  projectId: "18f0509314edaa4e93ceb0a4e9d534dd",
  chains,
});

const wagmiConfig = createConfig({
  connectors,
  publicClient,
});

/* ****************************************************************************
 *
 * APP
 *
 * ****************************************************************************/

const App = () => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <main className="h-screen w-screen flex flex-row p-8">
          <FeatureList />
          <Walkthrough />
        </main>
      </RainbowKitProvider>
    </WagmiConfig>
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
    "useFetchPeerOnNetwork",
    "useMessageStream",
    "useConversationsStream",
    "useConversationStream",
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
    <div className="flex-col items-center mr-8">
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
 * Walkthrough
 *
 * ****************************************************************************/

const Walkthrough = () => {
  return (
    <div className="flex flex-col w-[65ch]">
      <Lib.Section>
        <Lib.SectionHeader>Low-Level API Walkthrough</Lib.SectionHeader>
        <Lib.SectionDescription>
          Below you'll find a minimal viable example for each hook in the
          low-level API provided by Relay Receiver. We use these hooks as the
          building blocks for common higher-level feature hooks like{" "}
          <Lib.SectionLink href="#use-conversation">
            useConversation
          </Lib.SectionLink>
          . The low-level hooks are provided as a fallback, and knowing how they
          work will help keep the witch doctor away, but we recommend using the
          higher-level hooks whenever possible.
        </Lib.SectionDescription>
      </Lib.Section>
      <UseClient />
      <UseMessageStream />
      <UseConversationStream />
    </div>
  );
};

export const UseClient = () => {
  const wallet = Lib.useSigner();
  const client = useClient({ wallet });

  return (
    <Lib.Section>
      <div id="useStartClient" className="flex items-center">
        <Lib.SectionHeader className="mr-auto">
          useStartClient
        </Lib.SectionHeader>
        <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-client.ts">
          source
        </Lib.SectionLink>
      </div>
      <Lib.SectionDescription>
        The first thing you need is a reference to the user's wallet. The wallet
        is used to create an XMTP identity (for new users) or sign into an
        exising XMTP identity (for returning users).
      </Lib.SectionDescription>
      <Lib.SectionDescription>
        In this tutorial we use{" "}
        <Lib.SectionLink href="https://rainbowkit.com">
          RainbowKit
        </Lib.SectionLink>{" "}
        and <Lib.SectionLink href="https://wagmi.sh">Wagmi</Lib.SectionLink>,
        but any SDK that exposes a signer should work.
      </Lib.SectionDescription>
      <BaseConnectButton.Custom>
        {({ account, chain, openConnectModal, mounted }) => {
          const connected = mounted && account && chain;
          return (
            <Lib.PrimaryButton
              inactiveText="n/a"
              idleText="Click to connect a wallet."
              errorText="Error connecting wallet!"
              pendingText="Connecting wallet..."
              successText="Connected wallet!"
              onClickIdle={() => openConnectModal()}
              status={(() => {
                if (connected) {
                  return "success";
                } else {
                  return "idle";
                }
              })()}
            />
          );
        }}
      </BaseConnectButton.Custom>
      <Lib.SectionDescription>
        Now that we've connected a wallet, we can start the XMTP client.
      </Lib.SectionDescription>
      <Lib.PrimaryButton
        onClickIdle={() => {
          if (client === null) {
            throw new Error("Client is null even though it's idle");
          } else {
            client.start();
          }
        }}
        inactiveText="To start an XMTP client, first connect a wallet..."
        idleText="Click to start the XMTP client."
        errorText="Error starting XMTP client!"
        pendingText="Starting XMTP client..."
        successText="An XMTP client was started!"
        status={(() => {
          if (client === null) return "inactive";
          if (client.isError) return "error";
          if (client.isSuccess) return "success";
          if (client.isPending) return "pending";
          if (client.isIdle) return "idle";
          throw new Error("Unhandled client state");
        })()}
      />
      <Lib.SectionDescription>
        You can stop a client after you start it:
      </Lib.SectionDescription>
      <Lib.PrimaryButton
        onClickIdle={() => {
          if (client === null) {
            throw new Error("Client is null even though it's success");
          } else {
            client.stop();
          }
        }}
        onClickError={() => null}
        inactiveText="To stop a client, you must start it first."
        idleText="Click to stop the client."
        errorText="Error stopping client!"
        pendingText="Stopping..."
        successText="Client stopped!"
        status={(() => {
          if (client === null) return "inactive";
          if (client.isError) return "error";
          if (client.isSuccess) return "idle";
          if (client.isPending) return "inactive";
          if (client.isIdle) return "inactive";
          throw new Error("Unhandled client state");
        })()}
      />
      <Lib.SectionDescription>
        Once you have a wallet and a running client, you can start using XMTP!
        The rest of this tutorial will show you how to do that.
      </Lib.SectionDescription>
    </Lib.Section>
  );
};

const UseMessageStream = () => {
  const wallet = Lib.useSigner();
  const client = useClient({ wallet });
  const stream = useMessageStream({ wallet });

  return (
    <Lib.Section>
      <div id="useStartClient" className="flex items-center">
        <Lib.SectionHeader className="mr-auto">
          useMessageStream
        </Lib.SectionHeader>
        <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-client.ts">
          source
        </Lib.SectionLink>
      </div>
      <Lib.SectionDescription>
        The XMTP client exposes a global message stream. Every message sent to
        an XMTP identity will pass through this stream, regardless of the
        conversation it's part of. useMessageStream allows you to start, stop,
        and listen to this stream. The following is an outline of the hook's
        usage:
      </Lib.SectionDescription>
      <ol className="mb-6">
        <li>1. Connect a Wallet</li>
        <li>2. Start the XMTP Client</li>
        <li>3. Start the Message Stream</li>
        <li>4. Listen to the Message Stream</li>
        <li>5. Stop the Message Stream</li>
      </ol>
      <Lib.StepHeader>Connect a Wallet</Lib.StepHeader>
      <Lib.SectionDescription>
        The first thing you need is a reference to the user's wallet. The wallet
        is used to create an XMTP identity (for new users) or sign into an
        exising XMTP identity (for returning users).
      </Lib.SectionDescription>
      <Lib.SectionDescription>
        In this tutorial we use{" "}
        <Lib.SectionLink href="https://rainbowkit.com">
          RainbowKit
        </Lib.SectionLink>{" "}
        and <Lib.SectionLink href="https://wagmi.sh">Wagmi</Lib.SectionLink>,
        but any SDK that exposes a signer should work.
      </Lib.SectionDescription>
      <BaseConnectButton.Custom>
        {({ account, chain, openConnectModal, mounted }) => {
          const connected = mounted && account && chain;
          return (
            <Lib.PrimaryButton
              inactiveText="n/a"
              idleText="Click to connect a wallet."
              errorText="Error connecting wallet!"
              pendingText="Connecting wallet..."
              successText="Connected wallet!"
              onClickIdle={() => openConnectModal()}
              status={(() => {
                if (connected) {
                  return "success";
                } else {
                  return "idle";
                }
              })()}
            />
          );
        }}
      </BaseConnectButton.Custom>
      <Lib.StepHeader>Start XMTP Client</Lib.StepHeader>
      <Lib.SectionDescription>
        Now that we've connected a wallet, we can start the XMTP client.
      </Lib.SectionDescription>
      <Lib.PrimaryButton
        onClickIdle={() => {
          if (client === null) {
            throw new Error("Client is null even though it's idle");
          } else {
            client.start();
          }
        }}
        inactiveText="To start an XMTP client, first connect a wallet..."
        idleText="Click to start the XMTP client."
        errorText="Error starting XMTP client!"
        pendingText="Starting XMTP client..."
        successText="An XMTP client was started!"
        status={(() => {
          if (client === null) return "inactive";
          if (client.isError) return "error";
          if (client.isSuccess) return "success";
          if (client.isPending) return "pending";
          if (client.isIdle) return "idle";
          throw new Error("Unhandled client state");
        })()}
      />
      <Lib.StepHeader>Start the Message Stream</Lib.StepHeader>
      <Lib.SectionDescription>
        You've started the XMTP client, the next step is to start the message
        stream. Sometimes it takes a few seconds to start.
      </Lib.SectionDescription>
      <Lib.PrimaryButton
        inactiveText="Inactive"
        idleText="Start Stream"
        pendingText="Starting..."
        errorText="Error starting stream"
        successText="Stream started"
        onClickIdle={() => {
          if (stream === null) {
            throw new Error("Client start is null even though it's idle");
          } else {
            stream.start();
          }
        }}
        status={(() => {
          if (stream === null) return "inactive";
          if (stream.isError) return "error";
          if (stream.isSuccess) return "success";
          if (stream.isPending) return "pending";
          if (stream.isIdle) return "idle";
          throw new Error("Unhandled stream state");
        })()}
      />

      <Lib.StepHeader>Listen to the Message Stream</Lib.StepHeader>
      <Lib.SectionDescription>
        Now that you've started a stream, you can listen for messages. The
        following button will add a listener to the stream. When a message is
        received, the listener will log it to the developer console.
      </Lib.SectionDescription>
      <Lib.PrimaryButton
        inactiveText="You must start the stream before you can listen to it."
        idleText="Click to listen to the stream."
        pendingText="Starting listener..."
        successText="Listening to stream."
        errorText="Error listening to stream."
        onClickIdle={() => {
          if (stream === null) {
            throw new Error("Listen is null even though it's success");
          } else {
            stream.listen((message) => {
              console.log(
                "Relay Receiver Tutorial, Message Received",
                message.content
              );
            });
          }
        }}
        status={(() => {
          if (stream === null) return "inactive";
          if (stream.isError) return "error";
          if (stream.isSuccess) return "idle";
          if (stream.isPending) return "inactive";
          if (stream.isIdle) return "inactive";
          throw new Error("Unhandled stream state");
        })()}
      />
      <Lib.StepHeader>Send Some Messages</Lib.StepHeader>
      <Lib.SectionDescription>
        You've started the stream and added a listener but, unless you happen to
        be 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045, you probably won't see
        any messages. The following button will create a burner wallet, start an
        XMTP client for it, and send a message to the XMTP identity you just
        started.
      </Lib.SectionDescription>
      <Lib.PrimaryButton
        onClickIdle={async () => {
          if (wallet === undefined) {
            throw new Error("Wallet is undefined even though it's idle");
          }

          const client = await Client.create(Wallet.createRandom(), {
            env: "production",
          });
          const conversation = await client.conversations.newConversation(
            wallet.address
          );

          conversation.send("Hello, superstar!");
        }}
        onClickError={() => null}
        inactiveText="Start the XMTP client to send a message to it."
        idleText="Send a message to your XMTP identity."
        errorText="Error sending message!"
        pendingText="Sending message!"
        successText="Message sent!"
        status={(() => {
          if (client === null) return "inactive";
          if (client.isError) return "inactive";
          if (client.isSuccess) return "idle";
          if (client.isPending) return "inactive";
          if (client.isIdle) return "inactive";
          throw new Error("Unhandled client state");
        })()}
      />
      <Lib.SectionDescription>
        For a more "realistic" experience, you could head to{" "}
        <Lib.SectionLink href="https://xmtp.chat">xmtp.chat</Lib.SectionLink>,
        login with a different address, and send yourself some messages. Note:
        when you head to XMTP, you must connect a <em>different</em> wallet
        because XMTP does not support self-sent messages for security reasons.
      </Lib.SectionDescription>
      <Lib.StepHeader>Stop the Message Stream</Lib.StepHeader>
      <Lib.SectionDescription>
        You can stop a client after you start it:
      </Lib.SectionDescription>
      <Lib.PrimaryButton
        onClickIdle={() => {
          if (client === null) {
            throw new Error("Client is null even though it's success");
          } else {
            client.stop();
          }
        }}
        onClickError={() => null}
        inactiveText="To stop a client, you must start it first."
        idleText="Click to stop the client."
        errorText="Error stopping client!"
        pendingText="Stopping..."
        successText="Client stopped!"
        status={(() => {
          if (client === null) return "inactive";
          if (client.isError) return "error";
          if (client.isSuccess) return "idle";
          if (client.isPending) return "inactive";
          if (client.isIdle) return "inactive";
          throw new Error("Unhandled client state");
        })()}
      />
      <Lib.StepHeader>Next Steps</Lib.StepHeader>
      <Lib.SectionDescription>
        We connected a wallet, started an XMTP client, started the global
        message stream, handled an inbound message, and stopped the stream.
        Oftentimes we don't want to listen to every message, we just want to
        listen to a specific conversation. The next hook allows us to do that.
      </Lib.SectionDescription>
    </Lib.Section>
  );
};

const UseConversationStream = () => {
  const wallet = Lib.useSigner();
  const client = useClient({ wallet });
  const [conversation, setConversation] = useState<Conversation | undefined>();
  const stream = useConversationStream({
    conversation: (() => {
      if (conversation === undefined) {
        return undefined;
      } else {
        // Because `conversation` was created by the *burner* identity, the
        // conversation's peerAddress is the *user's* address. We're going to be
        // streaming from the user's identity's perspective, so we need to set
        // peerAddress to the burner identity's address.
        return {
          peerAddress: conversation?.clientAddress,
        };
      }
    })(),
    wallet,
  });

  return (
    <Lib.Section>
      <div id="useConversationStream" className="flex items-center">
        <Lib.SectionHeader className="mr-auto">
          useConversationStream
        </Lib.SectionHeader>
        <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-conversation-stream.ts">
          source
        </Lib.SectionLink>
      </div>
      <Lib.SectionDescription>
        One of the core concepts in the XMTP protocol is the conversation. A
        conversation is a private, encrypted, and authenticated channel between
        two or more XMTP identities. The useConversationStream hook allows you
        to listen to all messages flowing through a specific conversation. The
        steps are as follows:
      </Lib.SectionDescription>
      <ol className="mb-6">
        <li>1. Connect a Wallet</li>
        <li>2. Start the XMTP Client</li>
        <li>3. Select or Create a Conversation</li>
        <li>4. Start the Conversation's Stream</li>
        <li>4. Listen to the Conversation's Stream</li>
        <li>5. Stop the Conversation Stream</li>
      </ol>
      <Lib.StepHeader>Connect a Wallet</Lib.StepHeader>
      <Lib.SectionDescription>
        The first thing you need is a reference to the user's wallet. The wallet
        is used to create an XMTP identity (for new users) or sign into an
        exising XMTP identity (for returning users).
      </Lib.SectionDescription>
      <Lib.SectionDescription>
        In this tutorial we use{" "}
        <Lib.SectionLink href="https://rainbowkit.com">
          RainbowKit
        </Lib.SectionLink>{" "}
        and <Lib.SectionLink href="https://wagmi.sh">Wagmi</Lib.SectionLink>,
        but any SDK that exposes a signer should work.
      </Lib.SectionDescription>
      <BaseConnectButton.Custom>
        {({ account, chain, openConnectModal, mounted }) => {
          const connected = mounted && account && chain;
          return (
            <Lib.PrimaryButton
              inactiveText="n/a"
              idleText="Click to connect a wallet."
              errorText="Error connecting wallet!"
              pendingText="Connecting wallet..."
              successText="Connected wallet!"
              onClickIdle={() => openConnectModal()}
              status={(() => {
                if (connected) {
                  return "success";
                } else {
                  return "idle";
                }
              })()}
            />
          );
        }}
      </BaseConnectButton.Custom>
      <Lib.StepHeader>Start XMTP Client</Lib.StepHeader>
      <Lib.SectionDescription>
        Now that we've connected a wallet, we can start the XMTP client.
      </Lib.SectionDescription>
      <Lib.PrimaryButton
        onClickIdle={() => {
          if (client === null) {
            throw new Error("Client is null even though it's idle");
          } else {
            client.start();
          }
        }}
        inactiveText="To start an XMTP client, first connect a wallet..."
        idleText="Click to start the XMTP client."
        errorText="Error starting XMTP client!"
        pendingText="Starting XMTP client..."
        successText="An XMTP client was started!"
        status={(() => {
          if (client === null) return "inactive";
          if (client.isError) return "error";
          if (client.isSuccess) return "success";
          if (client.isPending) return "pending";
          if (client.isIdle) return "idle";
          throw new Error("Unhandled client state");
        })()}
      />
      <Lib.StepHeader>Create a Conversation</Lib.StepHeader>
      <Lib.SectionDescription>
        The XMTP identity you just started may not have any conversations
        associated with it yet, so for this tutorial we're also going to create
        a new ephemeral identity using a burner wallet. We'll use the burner
        identity to create a conversation and send messages to the identity you
        just started.
      </Lib.SectionDescription>
      <Lib.PrimaryButton
        onClickIdle={async () => {
          if (wallet === undefined) {
            throw new Error("Wallet is undefined even though it's idle");
          }

          const burner = await Client.create(Wallet.createRandom(), {
            env: "production",
          });

          const convo = await burner.conversations.newConversation(
            wallet.address
          );

          setConversation(convo);
        }}
        onClickError={() => null}
        inactiveText="Start the XMTP client to create a conversation with it"
        idleText="Create an XTMP conversation."
        errorText="Error creating conversation!"
        pendingText="Creating a conversation!"
        successText="Conversation created!"
        status={(() => {
          if (wallet === undefined) return "inactive";
          if (conversation === undefined) return "idle";
          return "success";
        })()}
      />
      <Lib.StepHeader>Start the Message Stream</Lib.StepHeader>
      <Lib.SectionDescription>
        You've started your XMTP client, a burner XMTP client, and created a
        conversation between the two. The next step is to listen to the
        conversation's stream.
      </Lib.SectionDescription>
      <Lib.PrimaryButton
        inactiveText="Create a conversation before starting the stream."
        idleText="Start a conversation stream."
        pendingText="Starting stream..."
        errorText="Error starting stream!"
        successText="Stream started!"
        onClickIdle={async () => {
          if (stream === null) {
            throw new Error("Client start is null even though it's idle");
          } else {
            console.log("Starting stream");
            const res = await stream.start();
            console.log("Stream started", res);
          }
        }}
        status={(() => {
          if (stream === null) return "inactive";
          if (stream.isError) return "error";
          if (stream.isSuccess) return "success";
          if (stream.isPending) return "pending";
          if (stream.isIdle) return "idle";
          throw new Error("Unhandled stream state");
        })()}
      />

      <Lib.StepHeader>Listen to the Message Stream</Lib.StepHeader>
      <Lib.SectionDescription>
        Now that you've started a stream, you can listen for messages. The
        following button will add a listener to the stream. When a message is
        received, the listener will log it to the developer console.
      </Lib.SectionDescription>
      <Lib.PrimaryButton
        inactiveText="You must start the stream before you can listen to it."
        idleText="Click to listen to the stream."
        pendingText="Starting listener..."
        successText="Listening to stream."
        errorText="Error listening to stream."
        onClickIdle={() => {
          if (stream === null) {
            throw new Error("Listen is null even though it's success");
          } else {
            stream.listen((message) => {
              console.log(
                "Relay Receiver Tutorial, Message Received",
                message.content
              );
            });
          }
        }}
        status={(() => {
          if (stream === null) return "inactive";
          if (stream.isError) return "error";
          if (stream.isSuccess) return "idle";
          if (stream.isPending) return "inactive";
          if (stream.isIdle) return "inactive";
          throw new Error("Unhandled stream state");
        })()}
      />
      <Lib.StepHeader>Send Some Messages</Lib.StepHeader>
      <Lib.PrimaryButton
        onClickIdle={async () => {
          if (conversation === undefined) {
            throw new Error("Wallet is undefined even though it's idle");
          }

          conversation.send("Hello, superstar!");
        }}
        onClickError={() => null}
        inactiveText="Start the XMTP client to send a message to it."
        idleText="Send a message to your XMTP identity."
        errorText="Error sending message!"
        pendingText="Sending message!"
        successText="Message sent!"
        status={(() => {
          if (conversation === undefined) return "inactive";
          if (client === null) return "inactive";
          if (client.isError) return "error";
          if (client.isSuccess) return "idle";
          if (client.isPending) return "inactive";
          if (client.isIdle) return "inactive";
          throw new Error("Unhandled client state");
        })()}
      />
      <Lib.SectionDescription>
        For a more "realistic" experience, you could head to{" "}
        <Lib.SectionLink href="https://xmtp.chat">xmtp.chat</Lib.SectionLink>,
        login with a different address, and send yourself some messages. Note:
        when you head to XMTP, you must connect a <em>different</em> wallet
        because XMTP does not support self-sent messages for security reasons.
      </Lib.SectionDescription>
      <Lib.StepHeader>Stop the Message Stream</Lib.StepHeader>
      <Lib.SectionDescription>
        You can stop a client after you start it:
      </Lib.SectionDescription>
      <Lib.PrimaryButton
        onClickIdle={() => {
          if (client === null) {
            throw new Error("Client is null even though it's success");
          } else {
            client.stop();
          }
        }}
        onClickError={() => null}
        inactiveText="To stop a client, you must start it first."
        idleText="Click to stop the client."
        errorText="Error stopping client!"
        pendingText="Stopping..."
        successText="Client stopped!"
        status={(() => {
          if (client === null) return "inactive";
          if (client.isError) return "error";
          if (client.isSuccess) return "idle";
          if (client.isPending) return "inactive";
          if (client.isIdle) return "inactive";
          throw new Error("Unhandled client state");
        })()}
      />
      <Lib.StepHeader>Next Steps</Lib.StepHeader>
      <Lib.SectionDescription>
        We connected a wallet, started an XMTP client, created a burner wallet,
        created a conversation between the two, started the conversation's
        stream, and sent and handled some messages on the stream. We know how to
        use the global message stream and conversation-specific messages
        streams. The XMTP client exposes anothe stream as well, the global
        conversations stream. The next hook gives you access to that stream.
      </Lib.SectionDescription>
    </Lib.Section>
  );
};

/* ****************************************************************************
 *
 * HELPERS
 *
 * ****************************************************************************/

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

// import { useStreamMessages } from "./use-message-stream";
// import * as Ex from "./example.lib";

// export const UseStreamMessages = () => {
//   const wallet = Ex.useSigner();
//   const stream = useStreamMessages({ wallet });

//   return (
//     <Ex.Section>
//       <div id="useStreamMessages" className="flex items-center">
//         <Ex.SectionHeader className="mr-auto">
//           useStreamMessages
//         </Ex.SectionHeader>
//         <Ex.SectionLink
//           className="mr-4"
//           href="https://github.com/relay-network/receiver/src/use-stream-messages-example.tsx"
//         >
//           example source
//         </Ex.SectionLink>
//         <Ex.SectionLink href="https://github.com/relay-network/receiver/src/use-stream-messages.ts">
//           hook source
//         </Ex.SectionLink>
//       </div>
//       <Ex.SectionDescription>
//         Now that you've created a wallet and started the XMTP client, you can
//         start streaming messages (If you haven't already, please step through
//         the useStartClient
//         <Ex.SectionLink href="#useStartClient">
//           {" "}
//           walkthrough{" "}
//         </Ex.SectionLink>{" "}
//         above, then continue).
//       </Ex.SectionDescription>
//       <Ex.SectionDescription>
//         With useStreamMessages you can start, stop, and listen to the XMTP
//         client's global message stream. Every message sent to the client's XMTP
//         identity will pass through this stream.
//       </Ex.SectionDescription>
//       <Ex.SectionDescription>
//         You've started the stream and added a listener but, unless you happen to
//         be 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045, you probably won't see
//         any messages. In the next section you'll create another client and start
//         sending messages. For a more "realistic" experience, you could head to{" "}
//         <Ex.SectionLink href="https://xmtp.chat">xmtp.chat</Ex.SectionLink>,
//         login with a different address, and send yourself some messages.
//       </Ex.SectionDescription>
//     </Ex.Section>
//   );
// };

// import { Wallet } from "@ethersproject/wallet";
// import { useSendMessage } from "./use-send-message";
// import * as Ex from "./example.lib";
// import { useStartClient } from "./use-start-client.js";

// const wallet = Wallet.createRandom();

// export const UseSendMessage = () => {
//   const connected = Ex.useSigner();
//   const client = useStartClient({ wallet });
//   const sendToSelf = useSendMessage({ wallet });
//   const sendToMaintainer = useSendMessage({ wallet });
//   const sendToVitalik = useSendMessage({ wallet });

//   console.log(sendToVitalik);
//   return (
//     <Ex.Section>
//       <div id="useSendMessage" className="flex items-center">
//         <Ex.SectionHeader className="mr-auto">useSendMessage</Ex.SectionHeader>
//         <Ex.SectionLink
//           className="mr-4"
//           href="https://github.com/relay-network/receiver/src/use-send-message.example.tsx"
//         >
//           example source
//         </Ex.SectionLink>
//         <Ex.SectionLink href="https://github.com/relay-network/receiver/src/use-send-message.ts">
//           hook source
//         </Ex.SectionLink>
//       </div>
//       <Ex.SectionDescription>
//         Before we start sending messages we need to start up a new XMTP client.
//         We have to do this because it is not currently possible (for security
//         reasons) to send yourself a message using XMTP. Click the button below
//         to start the client.
//       </Ex.SectionDescription>
//       <Ex.PrimaryButton
//         onClickIdle={() => {
//           if (client.start === null) {
//             throw new Error("Client start is null even though it's idle");
//           } else {
//             client.start();
//           }
//         }}
//         inactiveText="Waiting for wallet..."
//         idleText="Start the client"
//         errorText="Error starting client!"
//         pendingText="Starting..."
//         successText="Client started!"
//         status={(() => {
//           if (client.isInactive) return "inactive";
//           if (client.isError) return "error";
//           if (client.isSuccess) return "success";
//           if (client.isPending) return "pending";
//           if (client.isIdle) return "idle";
//           throw new Error("Unhandled client state");
//         })()}
//       />
//       <Ex.SectionDescription>
//         Before you send the message, you might want to open the developer
//         console to see receipt in real time.
//       </Ex.SectionDescription>
//       <Ex.PrimaryButton
//         inactiveText="Have you started the client?"
//         idleText='Send yourself "Hello, superstar!"'
//         pendingText="Sending..."
//         errorText="Error sending"
//         successText="Sent!"
//         onClickIdle={async () => {
//           if (sendToSelf.sendMessage === null || connected === undefined) {
//             return undefined;
//           } else {
//             await sendToSelf.sendMessage({
//               conversation: {
//                 peerAddress: connected.address,
//               },
//               content: "Hello, superstar!",
//             });
//           }
//         }}
//         status={(() => {
//           if (sendToSelf.isIdle) return "idle";
//           if (sendToSelf.isPending) return "pending";
//           if (sendToSelf.isError) return "error";
//           if (sendToSelf.isSuccess) return "success";
//           return "inactive";
//         })()}
//       />
//       <Ex.SectionDescription>
//         Of course, you can send other people messages as well:
//       </Ex.SectionDescription>
//       <Ex.PrimaryButton
//         inactiveText="Have you started the client?"
//         idleText="Send the maintainer a 👍"
//         pendingText="Sending..."
//         errorText="Error sending"
//         successText="Sent!"
//         onClickIdle={async () => {
//           if (sendToMaintainer.sendMessage === null) {
//             return undefined;
//           } else {
//             await sendToMaintainer.sendMessage({
//               conversation: {
//                 peerAddress: "0xf89773CF7cf0B560BC5003a6963b98152D84A15a",
//               },
//               content: "👍 from the Relay Receiver Tutorial site!",
//             });
//           }
//         }}
//         status={(() => {
//           if (sendToMaintainer.isIdle) return "idle";
//           if (sendToMaintainer.isPending) return "pending";
//           if (sendToMaintainer.isError) return "error";
//           if (sendToMaintainer.isSuccess) return "success";
//           return "inactive";
//         })()}
//       />
//       <Ex.SectionDescription>
//         You can even send Vitalik a love note:
//       </Ex.SectionDescription>
//       <Ex.PrimaryButton
//         inactiveText="Have you started the client?"
//         idleText="🚀 ❤️"
//         pendingText="Sending..."
//         errorText="Error sending"
//         successText="Sent!"
//         onClickIdle={async () => {
//           if (sendToVitalik.sendMessage === null) {
//             return undefined;
//           } else {
//             try {
//               const s = await sendToVitalik.sendMessage({
//                 conversation: {
//                   peerAddress: "0xFAIL",
//                 },
//                 content: "👍 from the Relay Receiver Tutorial site!",
//               });
//               console.log(s);
//             } catch (e) {
//               console.log("error", e);
//             }
//           }
//         }}
//         status={(() => {
//           if (sendToVitalik.isIdle) return "idle";
//           if (sendToVitalik.isPending) return "pending";
//           if (sendToVitalik.isError) return "error";
//           if (sendToVitalik.isSuccess) return "success";
//           return "inactive";
//         })()}
//       />
//       <Ex.SectionDescription>
//         Just kidding 😈, frens don't let frens spam frens. Let's learn more
//         about how to harness our newfound powers ⚡️ more productively 🛠.
//       </Ex.SectionDescription>
//     </Ex.Section>
//   );
// };

// import { useClient } from "./use-client";
// import * as Ex from "./example.lib";
// import { ConnectButton as BaseConnectButton } from "@rainbow-me/rainbowkit";
