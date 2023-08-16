import { useState } from "react";
import { Wallet } from "@ethersproject/wallet";
import { useFetchMessages } from "./use-fetch-messages";
import * as Views from "./example.views";

export const UseFetchMessages = ({ wallet }: { wallet: Wallet }) => {
  const fetchMessages = useFetchMessages({
    address: wallet.address,
    wallet,
  });
  const [peerAddress, setPeerAddress] = useState<string | null>(null);
  const [numMessages, setNumMessages] = useState<number | null>(null);

  return (
    <Views.Section>
      <Views.SectionHeader>useFetchMessages</Views.SectionHeader>
      <Views.SubSectionHeader>Status</Views.SubSectionHeader>
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
      <Views.PrimaryTextInput
        placeholder="Enter 0xAddress"
        onChange={(v) => setPeerAddress(v)}
        value={peerAddress}
      />
      <Views.PrimaryButton
        inactiveText="Can't fetch messages"
        idleText="Fetch Messages"
        pendingText="Fetching..."
        errorText="Error fetching messages"
        onClickIdle={async () => {
          if (fetchMessages.fetchMessages === null || peerAddress === null) {
            return undefined;
          } else {
            const messages = await fetchMessages.fetchMessages({
              peerAddress,
            });
            if (messages === undefined) {
              console.error("Error fetching messages");
            } else {
              setNumMessages(messages.length);
            }
          }
        }}
        status={(() => {
          if (fetchMessages.isIdle) return "idle";
          if (fetchMessages.isPending) return "pending";
          if (fetchMessages.isError) return "error";
          return "inactive";
        })()}
      />
      <Views.SubSectionHeader>Number of Messages</Views.SubSectionHeader>
      <p>
        {(() => {
          if (numMessages === null) {
            return "No messages fetched yet";
          } else {
            return numMessages;
          }
        })()}
      </p>
    </Views.Section>
  );
};
