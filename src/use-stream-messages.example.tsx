import { useEffect, useState } from "react";
import { Wallet } from "@ethersproject/wallet";
import { useStreamMessages } from "./use-stream-messages";
import { useStartClient } from "./use-start-client";
import * as Views from "./example.views";
import { Client } from "@xmtp/xmtp-js";

export const UseStreamMessages = () => {
  const [wallet, setWallet] = useState<Wallet | undefined>();
  const client = useStartClient({ address: wallet?.address, wallet });
  const stream = useStreamMessages({ address: wallet?.address, wallet });

  useEffect(() => {
    if (client.start !== null) {
      console.log("Starting stream");
      client.start();
    }
  }, [client.start === null]);

  return (
    <Views.Section>
      <Views.SectionHeader>useStreamMessages</Views.SectionHeader>
      <Views.SectionDescription>
        Before you can do anything with XMTP, you need to have a reference to
        the user's wallet and you need start up the XMTP client. If you haven't
        already, check out the{" "}
        <Views.SectionLink href="#useStartClient">
          walkthrough
        </Views.SectionLink>
        . After you've done that, you can continue started by clicking the
        button below.
      </Views.SectionDescription>
      <Views.PrimaryButton
        inactiveText="Waiting for Worker"
        idleText="Start client"
        pendingText="Starting client..."
        errorText="Error starting client"
        successText="Client started"
        onClickIdle={() => setWallet(Wallet.createRandom())}
        status={(() => {
          if (client.isInactive) return "idle";
          if (client.isError) return "error";
          if (client.isSuccess) return "success";
          if (client.isPending) return "pending";
          if (client.isIdle) return "idle";
          throw new Error("Unhandled client state");
        })()}
      />
      <Views.SectionDescription>
        Once you've started the XMTP client, you can start and stop the message
        stream. Once a stream is started, you can listen to it for messages.
      </Views.SectionDescription>
      <Views.PrimaryButton
        inactiveText="Inactive"
        idleText="Start Stream"
        pendingText="Starting..."
        errorText="Error starting stream"
        successText="Stream started"
        onClickIdle={() => {
          if (stream.start === null) {
            throw new Error("Client start is null even though it's idle");
          } else {
            stream.start();
          }
        }}
        status={(() => {
          if (stream.isInactive) return "inactive";
          if (stream.isError) return "error";
          if (stream.isSuccess) return "success";
          if (stream.isPending) return "pending";
          if (stream.isIdle) return "idle";
          throw new Error("Unhandled stream state");
        })()}
      />
      <Views.SectionDescription>
        Now that you've started a stream, you can listen to it for messages. The
        following button will add a listener to the stream. When a message is
        received, it will be logged to the console.
      </Views.SectionDescription>
      <Views.PrimaryButton
        inactiveText="Can't listen to stream"
        idleText="Listen to Stream"
        pendingText="Starting listener..."
        successText="Listening to stream"
        errorText="Error listening to stream"
        onClickIdle={() => {
          if (stream.listen === null) {
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
          if (stream.isInactive) return "inactive";
          if (stream.isError) return "error";
          if (stream.isSuccess) return "idle";
          if (stream.isPending) return "inactive";
          if (stream.isIdle) return "inactive";
          throw new Error("Unhandled stream state");
        })()}
      />
      <Views.SectionDescription>
        Click the next button to send a message to the XMTP client we started.
        Or, for a more realistic example, you can send a message from another
        device. head over to{" "}
        <a href="https://xmpt.chat">and send a message to {wallet?.address}</a>.
        If you open up the developer console, you should see the message logged.
      </Views.SectionDescription>
      <Views.PrimaryButton
        inactiveText="Can't send message"
        idleText="Send Message"
        pendingText="Sending..."
        successText="Sent"
        errorText="Error sending message"
        onClickIdle={async () => {
          if (typeof wallet !== "object") {
            // do nothing;
          } else {
            const client = await Client.create(Wallet.createRandom(), {
              env: "production",
            });
            const convo = await client.conversations.newConversation(
              wallet.address
            );
            await convo.send("Hello, world!");
          }
        }}
        status={(() => {
          if (stream.isInactive) return "inactive";
          if (stream.isError) return "error";
          if (stream.isSuccess) return "idle";
          if (stream.isPending) return "inactive";
          if (stream.isIdle) return "inactive";
          throw new Error("Unhandled stream state");
        })()}
      />
    </Views.Section>
  );
};
