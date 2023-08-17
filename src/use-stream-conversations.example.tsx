import { useState } from "react";
import { Wallet } from "@ethersproject/wallet";
import { useStreamConversations } from "./use-stream-conversations";
import * as Views from "./example.lib";

export const UseStreamConversations = ({ wallet }: { wallet: Wallet }) => {
  const stream = useStreamConversations({ address: wallet.address, wallet });
  const [lastConversation, setLastConversation] = useState<string | null>(null);

  if (stream.isError) {
    console.error(stream.error);
  }

  return (
    <Views.Section>
      <Views.SectionHeader>useStreamConversations</Views.SectionHeader>
      <Views.SectionDescription>
        This is a description of the hook. TODO.
      </Views.SectionDescription>
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
      <Views.PrimaryButton
        inactiveText="Can't start streaming yet."
        idleText="Click to start streaming."
        pendingText="Starting..."
        errorText="Error starting stream."
        onClickIdle={() => {
          if (stream.start === null) {
            throw new Error("Client start is null even though it's idle");
          } else {
            stream.start();
          }
        }}
        status={(() => {
          if (stream.isError) return "error";
          if (stream.isIdle) return "idle";
          if (stream.isPending) return "pending";
          return "inactive";
        })()}
      />
      <Views.PrimaryButton
        inactiveText="Can't stop streaming yet."
        idleText="Click to stop streaming."
        pendingText="Stopping..."
        errorText="Error stopping stream."
        onClickIdle={() => {
          if (stream.stop === null) {
            throw new Error("Client stop is null even though it's success");
          } else {
            stream.stop();
          }
        }}
        onClickError={() => null}
        status={stream.isSuccess ? "idle" : "inactive"}
      />
      <Views.PrimaryButton
        inactiveText="Can't listen yet."
        idleText="Click to listen."
        pendingText="Listening..."
        errorText="Error listening."
        onClickIdle={() => {
          if (stream.listen === null) {
            throw new Error("Client listen is null even though it's success");
          } else {
            stream.listen((conversation) => {
              setLastConversation(conversation.peerAddress);
            });
          }
        }}
        onClickError={() => null}
        status={stream.isSuccess ? "idle" : "inactive"}
      />
      <Views.SubSectionHeader>Last Conversation Address</Views.SubSectionHeader>
      <p>{String(lastConversation || "No conversation streamed yet.")}</p>
    </Views.Section>
  );
};
