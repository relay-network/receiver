import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import { Wallet } from "@ethersproject/wallet";
import { create } from "zustand";
import { UseStartClient } from "./use-start-client.example";
import { UseStreamMessages } from "./use-stream-messages.example";
import { UseSendMessage } from "./use-send-message.example";
import { UseFetchConversations } from "./use-fetch-conversations.example";
import { UseFetchPeerOnNetwork } from "./use-fetch-peer-on-network.example";
import { UseStreamConversations } from "./use-stream-conversations.example";
import { UseFetchMessages } from "./use-fetch-messages.example";
import { UseMessagesStream } from "./use-stream-conversation.example";
import * as Views from "./example.lib";
import { cn } from "./lib";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, zora } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { WalletConnectConnector } from "wagmi/dist/connectors/walletConnect";

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
          <Examples wallet={WALLETS[0]} />
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
    "useStreamMessages",
    "useStreamConversations",
    "useStreamConversation",
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
 * EXAMPLES
 *
 * ****************************************************************************/

const Examples = ({ wallet }: { wallet: Wallet }) => {
  return (
    <div className="flex flex-col w-[65ch]">
      <Views.SectionHeader>Relay Receiver Live Tutorial</Views.SectionHeader>
      <Views.SectionDescription>
        The following is a live walkthrough of the low-level hooks API provided
        by Relay Receiver. We use these hooks as the building blocks for common
        higher-level feature hooks like{" "}
        <Views.SectionLink href="#use-conversation">
          useConversation
        </Views.SectionLink>
        . These hooks are provided as a fallback, but we recommend using the
        higher-level hooks whenever possible.
      </Views.SectionDescription>
      <UseStartClient />
      <UseStreamMessages />
      <UseSendMessage />
      <UseFetchConversations wallet={wallet} />
      <UseFetchPeerOnNetwork wallet={wallet} />
      <UseStreamConversations wallet={wallet} />
      <UseFetchMessages wallet={wallet} />
      <UseMessagesStream wallet={wallet} />
    </div>
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
