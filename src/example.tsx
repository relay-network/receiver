import "./polyfills";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, zora } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton as BaseConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Wallet } from "@ethersproject/wallet";
import * as Lib from "./example.lib";
import { Signer, AsyncState } from "./lib";
import { useClient } from "./use-client";
import { useMessageStream } from "./use-message-stream";
import { useConversationStream } from "./use-conversation-stream.js";
import { useConversationsStream } from "./use-conversations-stream.js";
import { useFetchConversations } from "./use-fetch-conversations.js";
import { useFetchMessages } from "./use-fetch-messages.js";
import { useSendMessage } from "./use-send-message.js";
import { useFetchPeerOnNetwork } from "./use-fetch-peer-on-network.js";

/* ****************************************************************************
 *
 * WALLET CONNECT CONFIG
 *
 * ****************************************************************************/

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
 * Walkthrough
 *
 * ****************************************************************************/

const Walkthrough = () => {
  return (
    <div className="flex flex-col w-[65ch]">
      <Lib.Section>
        <Lib.SectionHeader>Introduction 👋</Lib.SectionHeader>
        <Lib.SectionDescription>
          Relay Receiver is a React library for adding{" "}
          <Lib.SectionLink href="https://xmpt.org">XMTP </Lib.SectionLink>
          messaging to your application, powered by the excellent{" "}
          <Lib.SectionLink href="https://github.com/xmtp/xmtp-js">
            @xmtp/xmtp-js
          </Lib.SectionLink>{" "}
          SDK, built with ❤️ by{" "}
          <Lib.SectionLink href="https://relay.network">Relay</Lib.SectionLink>.
        </Lib.SectionDescription>
        <Lib.SubSectionHeader>Basic Hooks</Lib.SubSectionHeader>
        <ol className="text-lg mb-2">
          <li>
            <Lib.SectionLink href="/">useConversation</Lib.SectionLink>
          </li>
          <li>
            <Lib.SectionLink href="/">useContacts</Lib.SectionLink>
          </li>
        </ol>
        <Lib.SubSectionHeader>Advanced Hooks</Lib.SubSectionHeader>
        <ol className="text-lg mb-2">
          <li>
            <Lib.SectionLink href="/">useVault</Lib.SectionLink>
          </li>
          <li>
            <Lib.SectionLink href="/">useGroupChat</Lib.SectionLink>
          </li>
          <li>
            <Lib.SectionLink href="/">useBot</Lib.SectionLink>
          </li>
          <li>
            <Lib.SectionLink href="/">useRpc</Lib.SectionLink>
          </li>
        </ol>
        <Lib.SubSectionHeader>Wrapper Hooks</Lib.SubSectionHeader>
        <Lib.SectionDescription>
          Receiver provides a set of wrapper hooks that allow you to work with
          the XMTP SDK more-or-less directly. The Receiver library uses these
          hooks to build higher-level feature hooks (e.g.{" "}
          <Lib.SectionLink href="/">useConversation</Lib.SectionLink>). The
          low-level wrapper hooks are published as escape hatches, and knowing
          how they work will help keep the witch doctor away, but we recommend
          using the feature hooks whenever possible.
        </Lib.SectionDescription>
        <ol className="text-lg mb-2">
          <li>
            <Lib.SectionLink href="/">useClient</Lib.SectionLink>
          </li>
          <li>
            <Lib.SectionLink href="/">useMessageStream</Lib.SectionLink>
          </li>
          <li>
            <Lib.SectionLink href="/">useConversationsStream</Lib.SectionLink>
          </li>
          <li>
            <Lib.SectionLink href="/">useConversationStream</Lib.SectionLink>
          </li>
          <li>
            <Lib.SectionLink href="/">useFetchConversations</Lib.SectionLink>
          </li>
          <li>
            <Lib.SectionLink href="/">useFetchMessages</Lib.SectionLink>
          </li>
          <li>
            <Lib.SectionLink href="/">useSendMessage</Lib.SectionLink>
          </li>
          <li>
            <Lib.SectionLink href="/">useFetchPeerOnNetwork</Lib.SectionLink>
          </li>
        </ol>
      </Lib.Section>
      <UseConversation />
      <UseContacts />
      <UseVault />
      <UseGroupChat />
      <UseBot />
      <UseRpc />
      <UseClient />
      <UseMessageStream />
      <UseConversationsStream />
      <UseConversationStream />
      <UseFetchConversations />
      <UseFetchMessages />
      <UseSendMessage />
      <UseFetchPeerOnNetwork />
    </div>
  );
};

/* ****************************************************************************
 *
 * USE CONVERSATION
 *
 * ****************************************************************************/

const UseConversation = () => {
  return (
    <Lib.Section>
      <Lib.SectionHeader className="mb-0">useConversation</Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-conversation.ts">
        source
      </Lib.SectionLink>
    </Lib.Section>
  );
};

const UseContacts = () => {
  return (
    <Lib.Section>
      <Lib.SectionHeader className="mb-0">useContacts</Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-contacts.ts">
        source
      </Lib.SectionLink>
    </Lib.Section>
  );
};

const UseVault = () => {
  return (
    <Lib.Section>
      <Lib.SectionHeader className="mb-0">useVault</Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-vault.ts">
        source
      </Lib.SectionLink>
    </Lib.Section>
  );
};

const UseGroupChat = () => {
  return (
    <Lib.Section>
      <Lib.SectionHeader className="mb-0">useGroupChat</Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-group-chat.ts">
        source
      </Lib.SectionLink>
    </Lib.Section>
  );
};

const UseBot = () => {
  return (
    <Lib.Section>
      <Lib.SectionHeader className="mb-0">useBot</Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-bot.ts">
        source
      </Lib.SectionLink>
    </Lib.Section>
  );
};

const UseRpc = () => {
  return (
    <Lib.Section>
      <Lib.SectionHeader className="mb-0">useRpc</Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-rpc.ts">
        source
      </Lib.SectionLink>
    </Lib.Section>
  );
};

/* ****************************************************************************
 *
 * USE CLIENT
 *
 * ****************************************************************************/

const UseClient = () => {
  const wallet = Lib.useSigner();
  const client = useClient({ wallet });

  return (
    <Lib.Section>
      <Lib.SectionHeader className="mb-0">useClient</Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-client.ts">
        source
      </Lib.SectionLink>
      <ConnectWalletButton />
      <Lib.SectionDescription>
        <em>Client status indicator.</em>
      </Lib.SectionDescription>
      <Lib.StatusIndicator status={Lib.status(client || {})} />
      <StartXmtpButton wallet={wallet} />
      <StopXmtpButton wallet={wallet} />
    </Lib.Section>
  );
};

const ConnectWalletButton = ({ override }: { override?: Signer }) => {
  if (typeof override !== "undefined") {
    return (
      <Lib.PrimaryButton
        inactiveText="N/A"
        idleText="N/A"
        errorText="N/A"
        pendingText="N/A"
        successText="CONNECTED WALLET"
        onClickIdle={() => null}
        status={Lib.status({ isSuccess: true })}
      />
    );
  }

  return (
    <BaseConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        return (
          <Lib.PrimaryButton
            inactiveText="N/A"
            idleText="CONNECT WALLET"
            errorText="CONNECT WALLET ERROR"
            pendingText="CONNECTING WALLET"
            successText="CONNECTED WALLET"
            onClickIdle={() => openConnectModal()}
            status={Lib.status({
              isSuccess: !!connected,
              isIdle: !connected,
            })}
          />
        );
      }}
    </BaseConnectButton.Custom>
  );
};

const StartXmtpButton = ({ wallet }: { wallet?: Signer }) => {
  const client = useClient({ wallet });

  return (
    <Lib.PrimaryButton
      onClickIdle={() => {
        if (client === null) {
          throw new Error("Client is null even though it's idle");
        } else {
          client.start();
        }
      }}
      inactiveText="DISABLED (connect wallet first)"
      idleText="START XMTP"
      errorText="START XMTP ERROR"
      pendingText="STARTING XMTP"
      successText="STARTED XMTP"
      status={(() => {
        if (client === null) return "inactive";
        if (client.isError) return "error";
        if (client.isSuccess) return "success";
        if (client.isPending) return "pending";
        if (client.isIdle) return "idle";
        throw new Error("Unhandled client state");
      })()}
    />
  );
};

const StopXmtpButton = ({ wallet }: { wallet?: Signer }) => {
  const client = useClient({ wallet });

  return (
    <Lib.PrimaryButton
      onClickIdle={async () => {
        if (client === null) {
          throw new Error("Client is null even though it's idle");
        } else {
          const result = await client.stop();
          console.log("STOP XMTP RESULT", result);
        }
      }}
      inactiveText="DISABLED (start client first)"
      idleText="STOP XMTP"
      errorText="STOP XMTP ERROR"
      pendingText="STOPPING XMTP"
      successText="STOPPED XMTP"
      status={(() => {
        if (client === null) return "inactive";
        if (client.isSuccess) return "idle";
        return "inactive";
      })()}
    />
  );
};

/* ****************************************************************************
 *
 * USE MESSAGE STREAM
 *
 * ****************************************************************************/

const umsWallet = Wallet.createRandom();

const UseMessageStream = () => {
  const wallet = umsWallet;
  const stream = useMessageStream({ wallet });
  const client = useClient({ wallet });

  return (
    <Lib.Section>
      <Lib.SectionHeader className="mb-0">useMessageStream</Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-message-stream.ts">
        source
      </Lib.SectionLink>
      <Lib.SectionDescription>
        <em>Note, we're using a burner wallet here.</em>
      </Lib.SectionDescription>
      <ConnectWalletButton override={wallet} />
      <Lib.SectionDescription>
        <em>Client status indicator.</em>
      </Lib.SectionDescription>
      <Lib.StatusIndicator status={Lib.status(client || {})} />
      <StartXmtpButton wallet={wallet} />
      <StopXmtpButton wallet={wallet} />
      <Lib.SectionDescription>
        <em>Stream status indicator.</em>
      </Lib.SectionDescription>
      <Lib.StatusIndicator status={Lib.status(stream || {})} />
      <StartMessageStreamButton wallet={wallet} />
      <StopMessageStreamButton wallet={wallet} />
      <Lib.SectionDescription>
        <em>Send a message from a random wallet to the burner wallet.</em>
      </Lib.SectionDescription>
      <SendMessageButton from={WALLETS[0]} to={umsWallet} content="Hello!" />
      <Lib.SectionDescription>
        <em>The most recent message will be displayed below.</em>
      </Lib.SectionDescription>
      <LastMessageDisplay wallet={wallet} />
    </Lib.Section>
  );
};

const StartMessageStreamButton = ({ wallet }: { wallet?: Signer }) => {
  const stream = useMessageStream({ wallet });

  return (
    <Lib.PrimaryButton
      inactiveText="DISABLED (start client first)"
      idleText="START STREAM"
      pendingText="STARTING STREAM"
      errorText="START STREAM ERROR"
      successText="STARTED STREAM"
      onClickIdle={async () => {
        if (stream === null) {
          throw new Error("Stream is null even though it's idle");
        }
        const result = await stream.start();
        console.log("Relay Receiver Tutorial, Stream Started", result);
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
  );
};

const StopMessageStreamButton = ({ wallet }: { wallet?: Signer }) => {
  const stream = useMessageStream({ wallet });

  return (
    <Lib.PrimaryButton
      inactiveText="DISABLED (start stream first)"
      idleText="STOP STREAM"
      pendingText="STOPPING STREAM"
      errorText="STOP STREAM ERROR"
      successText="STOPPED STREAM"
      onClickIdle={() => {
        if (stream === null) {
          throw new Error("Client start is null even though it's idle");
        } else {
          stream.stop();
        }
      }}
      status={(() => {
        if (stream === null) return "inactive";
        if (!stream.isSuccess) return "inactive";
        return "idle";
      })()}
    />
  );
};

const SendMessageButton = ({
  from,
  to,
  content,
}: {
  from: Signer;
  to: Signer;
  content: string;
}) => {
  const send = useSendMessage({ wallet: from });
  const [state, setState] = useState<AsyncState<undefined> | null>(null);

  useEffect(() => {
    if (send === null) {
      setState(null);
    } else {
      setState({ id: "idle" });
    }
  }, [send === null]);

  return (
    <Lib.PrimaryButton
      inactiveText="DISABLED (start client first)"
      idleText="SEND MESSAGE"
      pendingText="SENDING MESSAGE"
      errorText="SEND MESSAGE ERROR"
      successText="SENT MESSAGE"
      onClickIdle={async () => {
        if (send === null) {
          return;
        }

        setState({ id: "pending" });
        const result = await send({
          conversation: {
            peerAddress: to.address,
          },
          content,
        });
        switch (result.status) {
          case 200:
            setState({ id: "success", data: undefined });
            setTimeout(() => {
              setState({ id: "idle" });
            }, 3000);
            break;
          default:
            setState({ id: "error", error: "send failed" });
            setTimeout(() => {
              setState({ id: "idle" });
            }, 3000);
            break;
        }
      }}
      status={(() => {
        if (state === null) return "inactive";
        if (state.id === "idle") return "idle";
        if (state.id === "pending") return "pending";
        if (state.id === "success") return "success";
        if (state.id === "error") return "error";
        throw new Error("Unhandled state");
      })()}
    />
  );
};

const LastMessageDisplay = ({ wallet }: { wallet?: Signer }) => {
  const stream = useMessageStream({ wallet });
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (stream === null) {
      return;
    }

    if (!stream.isSuccess) {
      return;
    }

    stream.listen((message) => {
      setLastMessage(String(message.sent) + ": " + String(message.content));
    });
  }, [stream === null, stream?.isSuccess]);

  return (
    <p className="flex items-center p-2 mb-4 min-h-[2rem] min-w-full bg-gray-200">
      {lastMessage === null ? "No messages received yet" : lastMessage}
    </p>
  );
};

const ucsWallet = Wallet.createRandom();

const UseConversationsStream = () => {
  const wallet = ucsWallet;
  const client = useClient({ wallet });
  const stream = useConversationsStream({ wallet });

  return (
    <Lib.Section>
      <Lib.SectionHeader className="mb-0">
        useConversationsStream
      </Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-conversations-stream.ts">
        source
      </Lib.SectionLink>
      <Lib.SectionDescription>
        <em>Note, we're using a burner wallet here.</em>
      </Lib.SectionDescription>
      <ConnectWalletButton override={wallet} />
      <Lib.SectionDescription>
        <em>Client status indicator.</em>
      </Lib.SectionDescription>
      <Lib.StatusIndicator status={Lib.status(client || {})} />
      <StartXmtpButton wallet={wallet} />
      <StopXmtpButton wallet={wallet} />
      <Lib.SectionDescription>
        <em>Stream status indicator.</em>
      </Lib.SectionDescription>
      <Lib.StatusIndicator status={Lib.status(stream || {})} />
      <StartConversationsStreamButton wallet={wallet} />
      <StopConversationsStreamButton wallet={wallet} />
      <Lib.SectionDescription>
        <em>
          Each button below will send a message to the burner wallet from a
          different wallet. The first message from each wallet will create a new
          conversation, the rest of the messages will not.
        </em>
      </Lib.SectionDescription>
      <SendMessageButton from={WALLETS[0]} to={ucsWallet} content="Hello!" />
      <SendMessageButton from={WALLETS[1]} to={ucsWallet} content="Hello!" />
      <SendMessageButton from={WALLETS[2]} to={ucsWallet} content="Hello!" />
      <Lib.SectionDescription>
        <em>
          The peer address of the most recent new conversation will be displayed
          below.
        </em>
      </Lib.SectionDescription>
      <LastConversationDisplay wallet={wallet} />
    </Lib.Section>
  );
};

const StartConversationsStreamButton = ({ wallet }: { wallet?: Signer }) => {
  const stream = useConversationsStream({ wallet });

  return (
    <Lib.PrimaryButton
      inactiveText="DISABLED (start client first)"
      idleText="START STREAM"
      pendingText="STARTING STREAM"
      errorText="START STREAM ERROR"
      successText="STARTED STREAM"
      onClickIdle={async () => {
        if (stream === null) {
          throw new Error("Stream is null even though it's idle");
        }
        const result = await stream.start();
        console.log("Relay Receiver Tutorial, Stream Started", result);
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
  );
};

const StopConversationsStreamButton = ({ wallet }: { wallet?: Signer }) => {
  const stream = useConversationsStream({ wallet });

  return (
    <Lib.PrimaryButton
      inactiveText="DISABLED (start stream first)"
      idleText="STOP STREAM"
      pendingText="STOPPING STREAM"
      errorText="STOP STREAM ERROR"
      successText="STOPPED STREAM"
      onClickIdle={() => {
        if (stream === null) {
          throw new Error("Client start is null even though it's idle");
        } else {
          stream.stop();
        }
      }}
      status={(() => {
        if (stream === null) return "inactive";
        if (!stream.isSuccess) return "inactive";
        return "idle";
      })()}
    />
  );
};

const LastConversationDisplay = ({ wallet }: { wallet?: Signer }) => {
  const stream = useConversationsStream({ wallet });
  const [lastPeerAddress, setLastPeerAddress] = useState<string | null>(null);

  useEffect(() => {
    if (stream === null) {
      return;
    }

    if (!stream.isSuccess) {
      return;
    }

    stream.listen((convo) => {
      setLastPeerAddress(convo.peerAddress);
    });
  }, [stream === null, stream?.isSuccess]);

  return (
    <p className="flex items-center p-2 mb-4 min-h-[2rem] min-w-full bg-gray-200">
      {lastPeerAddress === null
        ? "No conversations received yet"
        : lastPeerAddress}
    </p>
  );
};

const uccsWallet = Wallet.createRandom();

const UseConversationStream = () => {
  const wallet = uccsWallet;
  const client = useClient({ wallet });
  const stream0 = useConversationsStream({ wallet: WALLETS[0] });
  const stream1 = useConversationsStream({ wallet: WALLETS[1] });

  return (
    <Lib.Section>
      <Lib.SectionHeader className="mb-0">
        useConversationStream
      </Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-conversation-stream.ts">
        source
      </Lib.SectionLink>
      <Lib.SectionDescription>
        <em>Note, we're using a burner wallet here.</em>
      </Lib.SectionDescription>
      <ConnectWalletButton override={wallet} />
      <Lib.SectionDescription>
        <em>Client status indicator.</em>
      </Lib.SectionDescription>
      <Lib.StatusIndicator status={Lib.status(client || {})} />
      <StartXmtpButton wallet={wallet} />
      <StopXmtpButton wallet={wallet} />
      <Lib.SectionDescription className="mb-6">
        <em>
          Start two different conversation-specific message streams, send
          messages to them, and watch the messages appear.
        </em>
      </Lib.SectionDescription>
      <Lib.StatusIndicator status={Lib.status(stream0 || {})} />
      <StartConversationStreamButton
        conversation={{ peerAddress: WALLETS[0].address }}
        wallet={wallet}
      />
      <StopConversationStreamButton
        conversation={{ peerAddress: WALLETS[0].address }}
        wallet={wallet}
      />
      <SendMessageButton from={WALLETS[0]} to={uccsWallet} content="Hello!" />
      <LastMessageInConversationDisplay
        conversation={{ peerAddress: WALLETS[0].address }}
        wallet={wallet}
      />
      <Lib.StatusIndicator status={Lib.status(stream1 || {})} />
      <StartConversationStreamButton
        conversation={{ peerAddress: WALLETS[1].address }}
        wallet={wallet}
      />
      <StopConversationStreamButton
        conversation={{ peerAddress: WALLETS[1].address }}
        wallet={wallet}
      />
      <SendMessageButton from={WALLETS[1]} to={uccsWallet} content="Hello!" />
      <LastMessageInConversationDisplay
        conversation={{ peerAddress: WALLETS[1].address }}
        wallet={wallet}
      />
    </Lib.Section>
  );
};

const StartConversationStreamButton = ({
  conversation,
  wallet,
}: {
  conversation?: { peerAddress: string };
  wallet?: Signer;
}) => {
  const stream = useConversationStream({ conversation, wallet });

  return (
    <Lib.PrimaryButton
      inactiveText="DISABLED (start client first)"
      idleText="START STREAM"
      pendingText="STARTING STREAM"
      errorText="START STREAM ERROR"
      successText="STARTED STREAM"
      onClickIdle={async () => {
        if (stream === null) {
          throw new Error("Stream is null even though it's idle");
        }
        const result = await stream.start();
        console.log("Relay Receiver Tutorial, Stream Started", result);
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
  );
};

const StopConversationStreamButton = ({
  conversation,
  wallet,
}: {
  conversation?: { peerAddress: string };
  wallet?: Signer;
}) => {
  const stream = useConversationStream({ conversation, wallet });

  return (
    <Lib.PrimaryButton
      inactiveText="DISABLED (start stream first)"
      idleText="STOP STREAM"
      pendingText="STOPPING STREAM"
      errorText="STOP STREAM ERROR"
      successText="STOPPED STREAM"
      onClickIdle={() => {
        if (stream === null) {
          throw new Error("Client start is null even though it's idle");
        } else {
          stream.stop();
        }
      }}
      status={(() => {
        if (stream === null) return "inactive";
        if (!stream.isSuccess) return "inactive";
        return "idle";
      })()}
    />
  );
};

const LastMessageInConversationDisplay = ({
  conversation,
  wallet,
}: {
  conversation?: { peerAddress: string };
  wallet?: Signer;
}) => {
  const stream = useConversationStream({ conversation, wallet });
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (stream === null) {
      return;
    }

    if (!stream.isSuccess) {
      return;
    }

    stream.listen((message) => {
      setLastMessage(String(message.sent) + ": " + String(message.content));
    });
  }, [stream === null, stream?.isSuccess]);

  return (
    <p className="flex items-center p-2 mb-6 min-h-[2rem] min-w-full bg-gray-200">
      {lastMessage === null ? "No messages received yet" : lastMessage}
    </p>
  );
};

const ufcWallet = Wallet.createRandom();

const UseFetchConversations = () => {
  const wallet = ufcWallet;
  const client = useClient({ wallet });
  const fetchConversations = useFetchConversations({ wallet });
  const [numConversations, setNumConversations] = useState<number | null>(null);
  const [state, setState] = useState<AsyncState<undefined> | null>(null);

  useEffect(() => {
    if (fetchConversations === null) {
      setState(null);
    } else {
      setState({ id: "idle" });
    }
  }, [fetchConversations === null]);

  return (
    <Lib.Section>
      <Lib.SectionHeader className="mb-0">
        useFetchConversations
      </Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-fetch-conversations.ts">
        source
      </Lib.SectionLink>
      <Lib.SectionDescription>
        <em>Note, we're using a burner wallet here.</em>
      </Lib.SectionDescription>
      <ConnectWalletButton override={wallet} />
      <Lib.SectionDescription>
        <em>Client status indicator.</em>
      </Lib.SectionDescription>
      <Lib.StatusIndicator status={Lib.status(client || {})} />
      <StartXmtpButton wallet={wallet} />
      <StopXmtpButton wallet={wallet} />
      <CreateConversationButton from={WALLETS[0]} to={wallet} />
      <CreateConversationButton from={WALLETS[1]} to={wallet} />
      <Lib.PrimaryButton
        inactiveText="DISABLED (start client first)"
        idleText="FETCH CONVERSATIONS"
        pendingText="FETCHING CONVERSATIONS"
        errorText="FETCH CONVERSATIONS ERROR"
        successText="FETCHED CONVERSATIONS"
        onClickIdle={async () => {
          if (fetchConversations === null) {
            return;
          }

          setState({ id: "pending" });
          const result = await fetchConversations();
          if (result.status === 200) {
            setNumConversations(result.data.length);
          } else {
            setNumConversations(null);
          }

          console.log("FETCH CONVERSATIONS RESULT", result);
          switch (result.status) {
            case 200:
              setState({ id: "success", data: undefined });
              setTimeout(() => {
                setState({ id: "idle" });
              }, 3000);
              break;
            default:
              setState({ id: "error", error: "send failed" });
              setTimeout(() => {
                setState({ id: "idle" });
              }, 3000);
              break;
          }
        }}
        status={(() => {
          if (state === null) return "inactive";
          if (state.id === "idle") return "idle";
          if (state.id === "pending") return "pending";
          if (state.id === "success") return "success";
          if (state.id === "error") return "error";
          throw new Error("Unhandled state");
        })()}
      />
      <p className="flex items-center p-2 mb-6 min-h-[2rem] min-w-full bg-gray-200">
        {numConversations === null
          ? "Haven't fetched conversations yet."
          : `${numConversations} conversations fetched.`}
      </p>
    </Lib.Section>
  );
};

const CreateConversationButton = ({
  from,
  to,
}: {
  from: Signer;
  to: Signer;
}) => {
  const send = useSendMessage({ wallet: from });
  const [state, setState] = useState<AsyncState<undefined> | null>(null);

  useEffect(() => {
    if (send === null) {
      setState(null);
    } else {
      setState({ id: "idle" });
    }
  }, [send === null]);

  return (
    <Lib.PrimaryButton
      inactiveText="DISABLED (start client first)"
      idleText="CREATE CONVERSATION"
      pendingText="CREATING CONVERSATION"
      errorText="CREATE CONVERSATION ERROR"
      successText="CREATED CONVERSATION"
      onClickIdle={async () => {
        if (send === null) {
          return;
        }

        setState({ id: "pending" });
        const result = await send({
          conversation: {
            peerAddress: to.address,
          },
          content: "Starting a conversation!",
        });
        switch (result.status) {
          case 200:
            setState({ id: "success", data: undefined });
            break;
          default:
            setState({ id: "error", error: "send failed" });
            setTimeout(() => {
              setState({ id: "idle" });
            }, 3000);
            break;
        }
      }}
      status={(() => {
        if (state === null) return "inactive";
        if (state.id === "idle") return "idle";
        if (state.id === "pending") return "pending";
        if (state.id === "success") return "success";
        if (state.id === "error") return "error";
        throw new Error("Unhandled state");
      })()}
    />
  );
};

const ufmWallet = Wallet.createRandom();

const UseFetchMessages = () => {
  const wallet = ufmWallet;
  const client = useClient({ wallet });
  const fetchMessages = useFetchMessages({ wallet });
  const [state, setState] = useState<AsyncState<undefined> | null>(null);
  const [numMessages, setNumMessages] = useState<number | null>(null);

  useEffect(() => {
    if (fetchMessages === null) {
      setState(null);
    } else {
      setState({ id: "idle" });
    }
  }, [fetchMessages === null]);

  return (
    <Lib.Section>
      <Lib.SectionHeader className="mb-0">useFetchMessages</Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-fetch-messages.ts">
        source
      </Lib.SectionLink>
      <Lib.SectionDescription>
        <em>Note, we're using a burner wallet here.</em>
      </Lib.SectionDescription>
      <ConnectWalletButton override={wallet} />
      <Lib.SectionDescription>
        <em>Client status indicator.</em>
      </Lib.SectionDescription>
      <Lib.StatusIndicator status={Lib.status(client || {})} />
      <StartXmtpButton wallet={wallet} />
      <StopXmtpButton wallet={wallet} />
      <SendMessageButton from={WALLETS[0]} to={wallet} content="Hello!" />
      <Lib.PrimaryButton
        inactiveText="DISABLED (start client first)"
        idleText="FETCH MESSAGES"
        pendingText="FETCHING MESSAGES"
        errorText="FETCH MESSAGES ERROR"
        successText="FETCHED MESSAGES"
        onClickIdle={async () => {
          if (fetchMessages === null) {
            return;
          }

          setState({ id: "pending" });
          const result = await fetchMessages(
            {
              peerAddress: WALLETS[0].address,
            },
            {}
          );

          if (result.status === 200) {
            setNumMessages(result.data.length);
          } else {
            setNumMessages(null);
          }

          console.log("FETCH MESSAGES RESULT", result);

          switch (result.status) {
            case 200:
              setState({ id: "success", data: undefined });
              setTimeout(() => {
                setState({ id: "idle" });
              }, 3000);
              break;
            default:
              setState({ id: "error", error: "fetch messages failed" });
              setTimeout(() => {
                setState({ id: "idle" });
              }, 3000);
              break;
          }
        }}
        status={(() => {
          if (state === null) return "inactive";
          if (state.id === "idle") return "idle";
          if (state.id === "pending") return "pending";
          if (state.id === "success") return "success";
          if (state.id === "error") return "error";
          throw new Error("Unhandled state");
        })()}
      />
      <p className="flex items-center p-2 mb-6 min-h-[2rem] min-w-full bg-gray-200">
        {numMessages === null
          ? "Haven't fetched messages yet."
          : `${numMessages} messages fetched.`}
      </p>
    </Lib.Section>
  );
};

const usmWallet = Wallet.createRandom();

const UseSendMessage = () => {
  const wallet = usmWallet;
  const client = useClient({ wallet });
  const stream0 = useMessageStream({ wallet: WALLETS[0] });
  const stream1 = useMessageStream({ wallet: WALLETS[1] });

  useEffect(() => {
    if (client === null) {
      return;
    }

    if (!client.isSuccess) {
      client.start();
    }
  }, [client]);

  useEffect(() => {
    if (stream0 === null) {
      return;
    }

    if (!stream0.isSuccess) {
      stream0.start();
    }
  }, [stream0]);

  useEffect(() => {
    if (stream1 === null) {
      return;
    }

    if (!stream1.isSuccess) {
      stream1.start();
    }
  }, [stream1]);

  return (
    <Lib.Section>
      <Lib.SectionHeader className="mb-0">useSendMessage</Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-send-message.ts">
        source
      </Lib.SectionLink>
      <Lib.SectionDescription className="mb-6">
        <em>
          Note, we're using 3 different burner wallets here: 1 to send messages
          and another 2 to receive those messages. For the 2 recipients, we're
          automatically starting their message streams when this component
          mounts.
        </em>
      </Lib.SectionDescription>
      <Lib.SectionDescription>
        <em>Sender status indicator.</em>
      </Lib.SectionDescription>
      <Lib.StatusIndicator status={Lib.status(client || {})} />
      <Lib.SectionDescription>
        <em>Recipient 1 messages stream status indicator.</em>
      </Lib.SectionDescription>
      <Lib.StatusIndicator status={Lib.status(stream0 || {})} />
      <SendMessageButton from={wallet} to={WALLETS[0]} content="Hello!" />
      <LastMessageDisplay wallet={WALLETS[0]} />
      <Lib.SectionDescription>
        <em>Recipient 2 messages stream status indicator.</em>
      </Lib.SectionDescription>
      <Lib.StatusIndicator status={Lib.status(stream1 || {})} />
      <SendMessageButton from={wallet} to={WALLETS[1]} content="Hello!" />
      <LastMessageDisplay wallet={WALLETS[1]} />
    </Lib.Section>
  );
};

const ufponWallet = Wallet.createRandom();

const UseFetchPeerOnNetwork = () => {
  const wallet = ufponWallet;

  return (
    <Lib.Section>
      <Lib.SectionHeader className="mb-0">
        useFetchPeerOnNetwork
      </Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-fetch-peer-on-network.ts">
        source
      </Lib.SectionLink>
      <Lib.SectionDescription>
        <em>Note, we're using a burner wallet here.</em>
      </Lib.SectionDescription>
      <ConnectWalletButton override={wallet} />
      <Lib.SectionDescription>
        <em>Confirm that our burner wallet is not on the network.</em>
      </Lib.SectionDescription>
      <FetchPeerOnNetworkButton peerAddress={wallet.address} />
      <Lib.SectionDescription>
        <em>If we try to send a message, it will fail.</em>
      </Lib.SectionDescription>
      <SendMessageButton
        from={WALLETS[1]}
        to={wallet}
        content="You are on XMTP now!"
      />
      <Lib.SectionDescription>
        <em>Now let's join XMTP by starting up a client.</em>
      </Lib.SectionDescription>
      <StartXmtpButton wallet={wallet} />
      <Lib.SectionDescription>
        <em>Confirm the burner wallet is now on the network.</em>
      </Lib.SectionDescription>
      <FetchPeerOnNetworkButton peerAddress={wallet.address} />
      <Lib.SectionDescription>
        <em>And the send message succeeds.</em>
      </Lib.SectionDescription>
      <SendMessageButton
        from={WALLETS[1]}
        to={wallet}
        content="You are on XMTP now!"
      />
    </Lib.Section>
  );
};

const FetchPeerOnNetworkButton = ({
  peerAddress,
}: {
  peerAddress?: string;
}) => {
  const fetchPeerOnNetwork = useFetchPeerOnNetwork({ wallet: WALLETS[0] });
  const [state, setState] = useState<AsyncState<boolean> | null>(null);

  useEffect(() => {
    if (fetchPeerOnNetwork === null) {
      setState(null);
    } else {
      setState({ id: "idle" });
    }
  }, [fetchPeerOnNetwork === null]);

  return (
    <Lib.PrimaryButton
      inactiveText="DISABLED (start client first)"
      idleText="FETCH PEER"
      pendingText="FETCHING PEER"
      errorText="FETCH PEER ERROR"
      successText={state?.data ? "PEER FOUND" : "PEER NOT FOUND"}
      onClickIdle={async () => {
        if (fetchPeerOnNetwork === null) {
          return;
        }

        if (peerAddress === undefined) {
          return;
        }

        setState({ id: "pending" });
        const result = await fetchPeerOnNetwork({ peerAddress });
        console.log("FETCH PEER RESULT", result);
        switch (result.status) {
          case 200:
            setState({ id: "success", data: result.data });
            break;
          default:
            setState({ id: "error", error: "send failed" });
            setTimeout(() => {
              setState({ id: "idle" });
            }, 3000);
            break;
        }
      }}
      status={(() => {
        if (peerAddress === undefined) return "inactive";
        if (state === null) return "inactive";
        if (state.id === "idle") return "idle";
        if (state.id === "pending") return "pending";
        if (state.id === "success") return "success";
        if (state.id === "error") return "error";
        throw new Error("Unhandled state");
      })()}
    />
  );
};

// export const ConnectAWallet = () => {
//   return (
//     <Lib.Section>
//       <Lib.SectionDescription>
//         The first thing we need is a reference to the user's wallet. The wallet
//         is used to create an XMTP identity (for new users) or sign into an
//         exising XMTP identity (for returning users). In this tutorial we use{" "}
//         <Lib.SectionLink href="https://rainbowkit.com">
//           RainbowKit
//         </Lib.SectionLink>{" "}
//         and <Lib.SectionLink href="https://wagmi.sh">Wagmi</Lib.SectionLink>,
//         but any SDK that exposes a signer should work. Today, you're the user,
//         use the button to connect a wallet:
//       </Lib.SectionDescription>
//     </Lib.Section>
//   );
// };

// export const EnableXmtp = () => {
//   const wallet = Lib.useSigner();
//   const client = useClient({ wallet });

//   return (
//     <Lib.Section>
//       <div id="EnableXmtp" className="flex items-center">
//         <Lib.SectionHeader className="mr-auto">Enable XMTP</Lib.SectionHeader>
//         <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-client.ts">
//           useClient
//         </Lib.SectionLink>
//       </div>
//       <Lib.SectionDescription>
//         A user enables XMTP by signing a special message. The resulting
//         signature is used to create an XMTP identity, authenticate with the
//         network, and secure message payloads. Once a user has enabled XMTP, they
//         can sign into their identity using a similar signing process.
//       </Lib.SectionDescription>
//       <Lib.SectionDescription>
//         If the button above is green, you've successfully started an XMTP client
//         and can start working with streaming.
//       </Lib.SectionDescription>
//     </Lib.Section>
//   );
// };

// const UseMessageStream = () => {
//   const wallet = Lib.useSigner();
//   const client = useClient({ wallet });
//   const stream = useMessageStream({ wallet });
//   const [lastMessage, setLastMessage] = useState<string | null>(null);

//   console.log(stream);
//   return (
//     <Lib.Section>
//       <div id="useStartClient" className="flex items-center">
//         <Lib.SectionHeader className="mr-auto">
//           Global Messages Stream
//         </Lib.SectionHeader>
//         <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-client.ts">
//           useMessageStream
//         </Lib.SectionLink>
//       </div>
//       <ol className="mb-6">
//         <li>1. Connect a Wallet ✅</li>
//         <li>2. Start the XMTP Client ✅</li>
//         <li>3. Start the Message Stream {stream?.isSuccess && "✅"}</li>
//         <li>4. Listen to the Message Stream {stream?.isSuccess && "✅"}</li>
//       </ol>
//       <Lib.SubSectionHeader>Start the Message Stream</Lib.SubSectionHeader>
//       <Lib.PrimaryButton
//         inactiveText="Inactive"
//         idleText="Start Stream"
//         pendingText="Starting..."
//         errorText="Error starting stream"
//         successText="Stream started"
//         onClickIdle={() => {
//           if (stream === null) {
//             throw new Error("Client start is null even though it's idle");
//           } else {
//             stream.start();
//           }
//         }}
//         status={(() => {
//           if (client === null) return "inactive";
//           if (!client.isSuccess) return "inactive";
//           if (stream === null) return "idle";
//           if (stream.isError) return "error";
//           if (stream.isSuccess) return "success";
//           if (stream.isPending) return "pending";
//           if (stream.isIdle) return "idle";
//           throw new Error("Unhandled stream state");
//         })()}
//       />

//       <Lib.SubSectionHeader>Listen to the Message Stream</Lib.SubSectionHeader>
//       <Lib.SectionDescription>
//         Now that the stream is running, we can listen for messages. The
//         following button will add a listener to the stream. When a message is
//         received, the listener will update this component's state and the
//         message's content will be displayed in the gray box below.
//       </Lib.SectionDescription>
//       <Lib.PrimaryButton
//         inactiveText="You must start the stream before you can listen to it."
//         idleText="Click to listen to the stream."
//         pendingText="Starting listener..."
//         successText="Listening to stream."
//         errorText="Error listening to stream."
//         onClickIdle={() => {
//           if (stream === null) {
//             throw new Error("Listen is null even though it's success");
//           } else {
//             stream.listen((message) => {
//               console.log(
//                 "Relay Receiver Tutorial, Message Received",
//                 message.content
//               );
//             });
//           }
//         }}
//         status={(() => {
//           if (stream === null) return "inactive";
//           if (stream.isError) return "error";
//           if (stream.isSuccess) return "idle";
//           if (stream.isPending) return "inactive";
//           if (stream.isIdle) return "inactive";
//           throw new Error("Unhandled stream state");
//         })()}
//       />
//       <p className="flex items-center p-2 mb-4 min-h-[2rem] min-w-full bg-gray-200">
//         {lastMessage === null ? "No messages received yet" : lastMessage}
//       </p>
//       <Lib.SubSectionHeader>Next Steps</Lib.SubSectionHeader>
//       <Lib.SectionDescription>
//         You probably aren't receiving messages yet (because we aren't having any
//         conversations!). At this point you can either continue setting up the
//         other 2 kinds of streams or you can{" "}
//         <Lib.SectionLink href="/">jump ahead </Lib.SectionLink>
//         to where we start sending messages.
//       </Lib.SectionDescription>
//     </Lib.Section>
//   );
// };

// const UseConversationsStream = () => {
//   const wallet = Lib.useSigner();
//   const client = useClient({ wallet });
//   const stream = useConversationsStream({ wallet });
//   const [recentConversations, setRecentConversations] = useState<
//     Conversation[]
//   >([]);

//   return (
//     <Lib.Section>
//       <div id="UseConversationsStrema" className="flex items-center">
//         <Lib.SectionHeader className="mr-auto">
//           Global Conversations Stream
//         </Lib.SectionHeader>
//         <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-conversations-stream.ts">
//           useConversationsStream
//         </Lib.SectionLink>
//       </div>
//       <ol className="mb-6">
//         <li>1. Connect a Wallet ✅</li>
//         <li>2. Start the XMTP Client ✅</li>
//         <li>3. Start the Conversation Stream {stream?.isSuccess && "✅"}</li>
//         <li>
//           4. Listen to the Conversation Stream {stream?.isSuccess && "✅"}
//         </li>
//       </ol>
//       <Lib.SubSectionHeader>Start the Stream</Lib.SubSectionHeader>
//       <Lib.PrimaryButton
//         inactiveText="Inactive"
//         idleText="Start Stream"
//         pendingText="Starting..."
//         errorText="Error starting stream"
//         successText="Stream started"
//         onClickIdle={() => {
//           if (stream === null) {
//             throw new Error("Client start is null even though it's idle");
//           } else {
//             stream.start();
//           }
//         }}
//         status={(() => {
//           if (client === null) return "inactive";
//           if (!client.isSuccess) return "inactive";
//           if (stream === null) return "idle";
//           if (stream.isError) return "error";
//           if (stream.isSuccess) return "success";
//           if (stream.isPending) return "pending";
//           if (stream.isIdle) return "idle";
//           throw new Error("Unhandled stream state");
//         })()}
//       />

//       <Lib.SubSectionHeader>Listen to the Stream</Lib.SubSectionHeader>
//       <Lib.SectionDescription>
//         Now that the stream is running, we can listen for conversations. The
//         following button will add a listener to the stream. When a conversation
//         is created, the listener will update this component's state and the peer
//         address of the 3 most recent conversation will be displayed in the gray
//         boxes below.
//       </Lib.SectionDescription>
//       <Lib.PrimaryButton
//         inactiveText="You must start the stream before you can listen to it."
//         idleText="Click to listen to the stream."
//         pendingText="Starting listener..."
//         successText="Listening to stream."
//         errorText="Error listening to stream."
//         onClickIdle={() => {
//           if (stream === null) {
//             throw new Error("Listen is null even though it's success");
//           } else {
//             stream.listen((conversation) => {
//               console.log(
//                 "Relay Receiver Tutorial, Message Received",
//                 conversation
//               );
//             });
//           }
//         }}
//         status={(() => {
//           if (stream === null) return "inactive";
//           if (stream.isError) return "error";
//           if (stream.isSuccess) return "idle";
//           if (stream.isPending) return "inactive";
//           if (stream.isIdle) return "inactive";
//           throw new Error("Unhandled stream state");
//         })()}
//       />
//       <p className="flex items-center p-2 mb-4 min-h-[2rem] min-w-full bg-gray-200">
//         {(() => {
//           if (recentConversations.length < 1) {
//             return "Haven't seen any conversations yet.";
//           } else {
//             return recentConversations[0].peerAddress;
//           }
//         })()}
//       </p>
//       <p className="flex items-center p-2 mb-4 min-h-[2rem] min-w-full bg-gray-200">
//         {(() => {
//           if (recentConversations.length < 2) {
//             return "Haven't seen a second conversation yet.";
//           } else {
//             return recentConversations[1].peerAddress;
//           }
//         })()}
//       </p>
//       <p className="flex items-center p-2 mb-4 min-h-[2rem] min-w-full bg-gray-200">
//         {(() => {
//           if (recentConversations.length < 3) {
//             return "Haven't seen a third conversation yet.";
//           } else {
//             return recentConversations[1].peerAddress;
//           }
//         })()}
//       </p>
//       <Lib.SubSectionHeader>Next Steps</Lib.SubSectionHeader>
//       <Lib.SectionDescription>
//         You probably don't see any conversations yet (if you are, the spammers
//         may have won 😭). At this point you can either continue setting up the
//         last kind of stream or you can{" "}
//         <Lib.SectionLink href="/">jump ahead </Lib.SectionLink>
//         to where we start sending messages.
//       </Lib.SectionDescription>
//     </Lib.Section>
//   );
// };

// const UseConversationStream = () => {
//   const wallet = Lib.useSigner();
//   const client = useClient({ wallet });
//   const [conversation, setConversation] = useState<Conversation | undefined>();
//   const stream = useConversationStream({
//     conversation: (() => {
//       if (conversation === undefined) {
//         return undefined;
//       } else {
//         // Because `conversation` was created by the *burner* identity, the
//         // conversation's peerAddress is the *user's* address. We're going to be
//         // streaming from the user's identity's perspective, so we need to set
//         // peerAddress to the burner identity's address.
//         return {
//           peerAddress: conversation?.clientAddress,
//         };
//       }
//     })(),
//     wallet,
//   });

//   return (
//     <Lib.Section>
//       <div id="useConversationStream" className="flex items-center">
//         <Lib.SectionHeader className="mr-auto">
//           Conversation-Specific Stream
//         </Lib.SectionHeader>
//         <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-conversation-stream.ts">
//           source
//         </Lib.SectionLink>
//       </div>
//       <Lib.SectionDescription>
//         One of the core concepts in the XMTP protocol is the conversation. A
//         conversation is a private, encrypted, and authenticated channel between
//         two or more XMTP identities. The useConversationStream hook allows you
//         to listen to all messages flowing through a specific conversation. The
//         steps are:
//       </Lib.SectionDescription>
//       <ol className="mb-6">
//         <li>1. Connect a Wallet {wallet && "✅"}</li>
//         <li>2. Start the XMTP Client {client?.isSuccess && "✅"}</li>
//         <li>3. Select or Create a Conversation</li>
//         <li>4. Start the Conversation's Stream</li>
//         <li>4. Listen to the Conversation's Stream</li>
//       </ol>
//       <Lib.SubSectionHeader>Create a Conversation</Lib.SubSectionHeader>
//       <Lib.SectionDescription>
//         The XMTP identity you just started may not have any conversations
//         associated with it yet. To create a few conversations, please{" "}
//         <Lib.SectionLink href="/">jump ahead </Lib.SectionLink>
//         to where we start sending messages, then come back here.
//       </Lib.SectionDescription>

//       <Lib.SubSectionHeader>Start the Message Stream</Lib.SubSectionHeader>
//       <Lib.SectionDescription>
//         You've started your XMTP client, a burner XMTP client, and created a
//         conversation between the two. The next step is to listen to the
//         conversation's stream.
//       </Lib.SectionDescription>
//       <Lib.PrimaryButton
//         inactiveText="Create a conversation before starting the stream."
//         idleText="Start a conversation stream."
//         pendingText="Starting stream..."
//         errorText="Error starting stream!"
//         successText="Stream started!"
//         onClickIdle={async () => {
//           if (stream === null) {
//             throw new Error("Client start is null even though it's idle");
//           } else {
//             console.log("Starting stream");
//             const res = await stream.start();
//             console.log("Stream started", res);
//           }
//         }}
//         status={(() => {
//           if (stream === null) return "inactive";
//           if (stream.isError) return "error";
//           if (stream.isSuccess) return "success";
//           if (stream.isPending) return "pending";
//           if (stream.isIdle) return "idle";
//           throw new Error("Unhandled stream state");
//         })()}
//       />

//       <Lib.SubSectionHeader>Listen to the Message Stream</Lib.SubSectionHeader>
//       <Lib.SectionDescription>
//         Now that you've started a stream, you can listen for messages. The
//         following button will add a listener to the stream. When a message is
//         received, the listener will log it to the developer console.
//       </Lib.SectionDescription>
//       <Lib.PrimaryButton
//         inactiveText="You must start the stream before you can listen to it."
//         idleText="Click to listen to the stream."
//         pendingText="Starting listener..."
//         successText="Listening to stream."
//         errorText="Error listening to stream."
//         onClickIdle={() => {
//           if (stream === null) {
//             throw new Error("Listen is null even though it's success");
//           } else {
//             stream.listen((message) => {
//               console.log(
//                 "Relay Receiver Tutorial, Message Received",
//                 message.content
//               );
//             });
//           }
//         }}
//         status={(() => {
//           if (stream === null) return "inactive";
//           if (stream.isError) return "error";
//           if (stream.isSuccess) return "idle";
//           if (stream.isPending) return "inactive";
//           if (stream.isIdle) return "inactive";
//           throw new Error("Unhandled stream state");
//         })()}
//       />
//       <Lib.SubSectionHeader>Send Some Messages</Lib.SubSectionHeader>
//       <Lib.PrimaryButton
//         onClickIdle={async () => {
//           if (conversation === undefined) {
//             throw new Error("Wallet is undefined even though it's idle");
//           }

//           conversation.send("Hello, superstar!");
//         }}
//         onClickError={() => null}
//         inactiveText="Start the XMTP client to send a message to it."
//         idleText="Send a message to your XMTP identity."
//         errorText="Error sending message!"
//         pendingText="Sending message!"
//         successText="Message sent!"
//         status={(() => {
//           if (conversation === undefined) return "inactive";
//           if (client === null) return "inactive";
//           if (client.isError) return "error";
//           if (client.isSuccess) return "idle";
//           if (client.isPending) return "inactive";
//           if (client.isIdle) return "inactive";
//           throw new Error("Unhandled client state");
//         })()}
//       />
//       <Lib.SectionDescription>
//         For a more "realistic" experience, you could head to{" "}
//         <Lib.SectionLink href="https://xmtp.chat">xmtp.chat</Lib.SectionLink>,
//         login with a different address, and send yourself some messages. Note:
//         when you head to XMTP, you must connect a <em>different</em> wallet
//         because XMTP does not support self-sent messages for security reasons.
//       </Lib.SectionDescription>
//       <Lib.SubSectionHeader>Stop the Message Stream</Lib.SubSectionHeader>
//       <Lib.SectionDescription>
//         You can stop a client after you start it:
//       </Lib.SectionDescription>
//       <Lib.PrimaryButton
//         onClickIdle={() => {
//           if (client === null) {
//             throw new Error("Client is null even though it's success");
//           } else {
//             client.stop();
//           }
//         }}
//         onClickError={() => null}
//         inactiveText="To stop a client, you must start it first."
//         idleText="Click to stop the client."
//         errorText="Error stopping client!"
//         pendingText="Stopping..."
//         successText="Client stopped!"
//         status={(() => {
//           if (client === null) return "inactive";
//           if (client.isError) return "error";
//           if (client.isSuccess) return "idle";
//           if (client.isPending) return "inactive";
//           if (client.isIdle) return "inactive";
//           throw new Error("Unhandled client state");
//         })()}
//       />
//       <Lib.SubSectionHeader>Next Steps</Lib.SubSectionHeader>
//       <Lib.SectionDescription>
//         We connected a wallet, started an XMTP client, created a burner wallet,
//         created a conversation between the two, started the conversation's
//         stream, and sent and handled some messages on the stream. We know how to
//         use the global message stream and conversation-specific messages
//         streams. The XMTP client exposes anothe stream as well, the global
//         conversations stream. The next hook gives you access to that stream.
//       </Lib.SectionDescription>
//     </Lib.Section>
//   );
// };

// const SendMessages = () => {
//   return (
//     <Lib.Section>
//       <div id="useSendMessage" className="flex items-center">
//         <Lib.SectionHeader className="mr-auto">Send Messages</Lib.SectionHeader>
//         <Lib.SectionLink href="https://github.com/relay-network/receiver/src/use-send-message.ts">
//           source
//         </Lib.SectionLink>
//       </div>
//       <Lib.SectionDescription>
//         Unless you happen to be 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045, you
//         probably haven't seen any activity on the streams we've started. There's
//         no fun in a message streaming protocol if you're not receiving any
//         messages, so in this section we'll create a few different ephemeral XMTP
//         identities and use them to send messages to our actual XMTP identity
//         (the one we created in the previous section). The hook involved is{" "}
//         <em>useSendMessage</em> and the steps to use it are:
//       </Lib.SectionDescription>
//       <ol className="mb-6">
//         <li>1. Connect a Wallet </li>
//         <li>2. Start the XMTP Client</li>
//         <li>3. Select or Create a Conversation</li>
//         <li>4. Compose a message.</li>
//         <li>5. Send the message.</li>
//       </ol>
//     </Lib.Section>
//   );
// };

/* ****************************************************************************
 *
 * HELPERS
 *
 * ****************************************************************************/

const WALLETS = [
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
 * APP
 *
 * ****************************************************************************/

const App = () => {
  const client0 = useClient({ wallet: WALLETS[0] });
  const client1 = useClient({ wallet: WALLETS[1] });
  const client2 = useClient({ wallet: WALLETS[2] });

  useEffect(() => {
    if (client0 !== null) {
      client0.start();
    }
  }, [client0 === null]);

  useEffect(() => {
    if (client1 !== null) {
      client1.start();
    }
  }, [client1]);

  useEffect(() => {
    if (client2 !== null) {
      client2.start();
    }
  }, [client2]);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <main className="h-screen w-screen flex flex-row p-8">
          <Walkthrough />
        </main>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

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

// // export const UseSendMessage = () => {
// //   const connected = Ex.useSigner();
// //   const client = useStartClient({ wallet });
// //   const sendToSelf = useSendMessage({ wallet });
// //   const sendToMaintainer = useSendMessage({ wallet });
// //   const sendToVitalik = useSendMessage({ wallet });

// //   console.log(sendToVitalik);
// //   return (
// //     <Ex.Section>
// //       <div id="useSendMessage" className="flex items-center">
// //         <Ex.SectionHeader className="mr-auto">useSendMessage</Ex.SectionHeader>
// //         <Ex.SectionLink
// //           className="mr-4"
// //           href="https://github.com/relay-network/receiver/src/use-send-message.example.tsx"
// //         >
// //           example source
// //         </Ex.SectionLink>
// //         <Ex.SectionLink href="https://github.com/relay-network/receiver/src/use-send-message.ts">
// //           hook source
// //         </Ex.SectionLink>
// //       </div>
// //       <Ex.SectionDescription>
// //         Before we start sending messages we need to start up a new XMTP client.
// //         We have to do this because it is not currently possible (for security
// //         reasons) to send yourself a message using XMTP. Click the button below
// //         to start the client.
// //       </Ex.SectionDescription>
// //       <Ex.PrimaryButton
// //         onClickIdle={() => {
// //           if (client.start === null) {
// //             throw new Error("Client start is null even though it's idle");
// //           } else {
// //             client.start();
// //           }
// //         }}
// //         inactiveText="Waiting for wallet..."
// //         idleText="Start the client"
// //         errorText="Error starting client!"
// //         pendingText="Starting..."
// //         successText="Client started!"
// //         status={(() => {
// //           if (client.isInactive) return "inactive";
// //           if (client.isError) return "error";
// //           if (client.isSuccess) return "success";
// //           if (client.isPending) return "pending";
// //           if (client.isIdle) return "idle";
// //           throw new Error("Unhandled client state");
// //         })()}
// //       />
// //       <Ex.SectionDescription>
// //         Before you send the message, you might want to open the developer
// //         console to see receipt in real time.
// //       </Ex.SectionDescription>
// //       <Ex.PrimaryButton
// //         inactiveText="Have you started the client?"
// //         idleText='Send yourself "Hello, superstar!"'
// //         pendingText="Sending..."
// //         errorText="Error sending"
// //         successText="Sent!"
// //         onClickIdle={async () => {
// //           if (sendToSelf.sendMessage === null || connected === undefined) {
// //             return undefined;
// //           } else {
// //             await sendToSelf.sendMessage({
// //               conversation: {
// //                 peerAddress: connected.address,
// //               },
// //               content: "Hello, superstar!",
// //             });
// //           }
// //         }}
// //         status={(() => {
// //           if (sendToSelf.isIdle) return "idle";
// //           if (sendToSelf.isPending) return "pending";
// //           if (sendToSelf.isError) return "error";
// //           if (sendToSelf.isSuccess) return "success";
// //           return "inactive";
// //         })()}
// //       />
// //       <Ex.SectionDescription>
// //         Of course, you can send other people messages as well:
// //       </Ex.SectionDescription>
// //       <Ex.PrimaryButton
// //         inactiveText="Have you started the client?"
// //         idleText="Send the maintainer a 👍"
// //         pendingText="Sending..."
// //         errorText="Error sending"
// //         successText="Sent!"
// //         onClickIdle={async () => {
// //           if (sendToMaintainer.sendMessage === null) {
// //             return undefined;
// //           } else {
// //             await sendToMaintainer.sendMessage({
// //               conversation: {
// //                 peerAddress: "0xf89773CF7cf0B560BC5003a6963b98152D84A15a",
// //               },
// //               content: "👍 from the Relay Receiver Tutorial site!",
// //             });
// //           }
// //         }}
// //         status={(() => {
// //           if (sendToMaintainer.isIdle) return "idle";
// //           if (sendToMaintainer.isPending) return "pending";
// //           if (sendToMaintainer.isError) return "error";
// //           if (sendToMaintainer.isSuccess) return "success";
// //           return "inactive";
// //         })()}
// //       />
// //       <Ex.SectionDescription>
// //         You can even send Vitalik a love note:
// //       </Ex.SectionDescription>
// //       <Ex.PrimaryButton
// //         inactiveText="Have you started the client?"
// //         idleText="🚀 ❤️"
// //         pendingText="Sending..."
// //         errorText="Error sending"
// //         successText="Sent!"
// //         onClickIdle={async () => {
// //           if (sendToVitalik.sendMessage === null) {
// //             return undefined;
// //           } else {
// //             try {
// //               const s = await sendToVitalik.sendMessage({
// //                 conversation: {
// //                   peerAddress: "0xFAIL",
// //                 },
// //                 content: "👍 from the Relay Receiver Tutorial site!",
// //               });
// //               console.log(s);
// //             } catch (e) {
// //               console.log("error", e);
// //             }
// //           }
// //         }}
// //         status={(() => {
// //           if (sendToVitalik.isIdle) return "idle";
// //           if (sendToVitalik.isPending) return "pending";
// //           if (sendToVitalik.isError) return "error";
// //           if (sendToVitalik.isSuccess) return "success";
// //           return "inactive";
// //         })()}
// //       />
// //       <Ex.SectionDescription>
// //         Just kidding 😈, frens don't let frens spam frens. Let's learn more
// //         about how to harness our newfound powers ⚡️ more productively 🛠.
// //       </Ex.SectionDescription>
// //     </Ex.Section>
// //   );
// // };

// // import { useClient } from "./use-client";
// // import * as Ex from "./example.lib";
// // import { ConnectButton as BaseConnectButton } from "@rainbow-me/rainbowkit";

// //   <Lib.SectionDescription>
// //     Before we can do anything with XMTP, we need to create an identity and
// //     sign into that identity. There's a hook for this, we'll start with it:
// //   </Lib.SectionDescription>
// //   <Lib.SectionLink className="text-xl" href="/">
// //     useClient
// //   </Lib.SectionLink>
// //   <Lib.SectionDescription>
// //     Once we've created an identity and signed in, we can start listening
// //     for messages.
// //   </Lib.SectionDescription>
// //   <Lib.SectionDescription>
// //     Receiver exposes a hook for each kind of stream that XMTP provides.
// //     Each hook exposes the stream's state and callbacks for starting,
// //     stopping, and listening to the stream. We'll create a minimal
// //     component for each hook:
// //   </Lib.SectionDescription>
// //   <ul className="mb-6">
// //     <li>
// //       <Lib.SectionLink className="text-xl" href="/">
// //         {" "}
// //         useMessageStream
// //       </Lib.SectionLink>
// //     </li>
// //     <li>
// //       <Lib.SectionLink className="text-xl" href="/">
// //         {" "}
// //         useConversationsStream
// //       </Lib.SectionLink>
// //     </li>
// //     <li>
// //       <Lib.SectionLink className="text-xl" href="/">
// //         {" "}
// //         useConversationStream
// //       </Lib.SectionLink>
// //     </li>
// //   </ul>
// //   <Lib.SectionDescription>
// //     Unless you happen to be 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,
// //     you probably won't see any activity on the streams we start. So the
// //     next thing we'll learn how to do is send a message. We'll create a few
// //     different ephemeral XMTP identities using burner wallets and start
// //     sending messages. The hook to send a message is:
// //   </Lib.SectionDescription>
// //   <Lib.SectionLink className="text-xl" href="/">
// //     useSendMessage
// //   </Lib.SectionLink>
// //   <Lib.SectionDescription>
// //     Ok, let's get started, this should be quick! ⚡️
// //   </Lib.SectionDescription>
// // </Lib.Section>

// <Lib.SectionHeader className="mr-auto">Usage</Lib.SectionHeader>
// <ol className="text-lg mb-2">
//   <li>1. Connect a wallet.</li>
//   <li>2. Enable XMTP (if necessary)</li>
//   <li>3. Start XMTP</li>
//   <li>4. Start the stream</li>
//   <li>5. Add listeners to the stream</li>
//   <li>6. Stop the stream</li>
// </ol>
// <Lib.SectionHeader className="mr-auto">
//   Connect a Wallet
// </Lib.SectionHeader>
// <Lib.SectionDescription>
//   The first thing we need is a reference to the user's wallet. The
//   wallet is used to create an XMTP identity (for new users) or sign into
//   an exising XMTP identity (for returning users). In this tutorial we
//   use{" "}
//   <Lib.SectionLink href="https://rainbowkit.com">
//     RainbowKit
//   </Lib.SectionLink>{" "}
//   and <Lib.SectionLink href="https://wagmi.sh">Wagmi</Lib.SectionLink>,
//   but any SDK that exposes a signer should work.
// </Lib.SectionDescription>
// <Lib.SectionHeader className="mr-auto">Enable XMTP</Lib.SectionHeader>
// <Lib.SectionDescription>
//   After connecting a wallet, a user enables XMTP by signing a special
//   message. The resulting signature is used to create an XMTP identity,
//   authenticate with the network, and secure message payloads. Once a
//   user has enabled XMTP, they can sign into their identity using a
//   similar signing process.
// </Lib.SectionDescription>
// <Lib.SectionDescription>
//   Once a user is signed into their XMTP identity, we can start the
//   various kinds of streams.
// </Lib.SectionDescription>
// <Lib.SectionHeader className="mr-auto">
//   Global Messages Stream
// </Lib.SectionHeader>
// <Lib.SectionDescription>
//   The XMTP SDK exposes a global message stream for each client.
//   Listeners attached to the global message stream will receive every
//   message sent to the XMTP identity, regardless of the conversation it's
//   part of. Receiver provides the useMessageStream hook to help you work
//   with the global message stream, the steps to use it are:
// </Lib.SectionDescription>
// <Lib.SectionHeader className="mr-auto">
//   Global Conversations Stream
// </Lib.SectionHeader>
// <Lib.SectionDescription>
//   The XMTP SDK exposes another global stream for each client, this one
//   for conversations. Listeners attached to the global conversations
//   stream will receive every conversation created by the XMTP identity{" "}
//   <em>
//     (note that this includes conversations initiated by other XMTP
//     identities)
//   </em>
//   . Receiver provides the useConversationsStream hook to help you work
//   with the global conversations stream, the steps to use it are:
// </Lib.SectionDescription>
