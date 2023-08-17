import { useState } from "react";
import { Wallet } from "@ethersproject/wallet";
import { useStreamConversation } from "./use-stream-conversation";
import * as Views from "./example.lib";

export const UseMessagesStream = ({ wallet }: { wallet: Wallet }) => {
  const [peerAddress, setPeerAddress] = useState<string | null>(null);
  const stream = useStreamConversation({
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
    <Views.Section>
      <Views.SectionHeader>useStreamConversation</Views.SectionHeader>
      <Views.SubSectionHeader>Status</Views.SubSectionHeader>
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
      <Views.PrimaryTextInput
        placeholder="Enter 0xAddress"
        onChange={(v) => setPeerAddress(v)}
        value={peerAddress}
      />
      <Views.PrimaryButton
        inactiveText="Can't start streaming"
        idleText="Start streaming"
        pendingText="Streaming..."
        errorText="Error streaming"
        onClickIdle={() => {
          if (stream.start === null) {
            throw new Error("Stream start is null even though it's idle");
          } else {
            stream.start();
          }
        }}
        onClickError={() => null}
        status={(() => {
          if (stream.isIdle) return "idle";
          if (stream.isPending) return "pending";
          if (stream.isError) return "error";
          return "inactive";
        })()}
      />
      <Views.PrimaryButton
        inactiveText="Can't stop streaming"
        idleText="Stop streaming"
        pendingText="Stopping..."
        errorText="Error stopping stream"
        onClickIdle={() => {
          if (stream.stop === null) {
            throw new Error("Stream stop is null even though it's success");
          } else {
            stream.stop();
          }
        }}
        status={(() => {
          if (stream.isIdle) return "inactive";
          if (stream.isPending) return "pending";
          if (stream.isError) return "error";
          return "idle";
        })()}
      />
      <Views.PrimaryButton
        inactiveText="Can't listen to stream"
        idleText="Start listening"
        pendingText="Stopping..."
        errorText="Error stopping listening"
        onClickIdle={() => {
          if (stream.listen === null) {
            throw new Error("Stream listen is null even though it's success");
          } else {
            stream.listen((message) => {
              setLastMessage({
                peerAddress: message.conversation.peerAddress,
                content: String(message.content),
              });
            });
          }
        }}
        status={(() => {
          if (stream.isIdle) return "inactive";
          if (stream.isPending) return "pending";
          if (stream.isError) return "error";
          return "idle";
        })()}
      />
      <Views.SubSectionHeader>Last Message</Views.SubSectionHeader>
      <p>{String(lastMessage?.peerAddress || "No message received yet.")}</p>
      <p>{String(lastMessage?.content || "No message received yet.")}</p>
    </Views.Section>
  );
};
