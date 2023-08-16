import { useState } from "react";
import { Wallet } from "@ethersproject/wallet";
import { useFetchConversations } from "./use-fetch-conversations";
import * as Views from "./example.views";

export const UseFetchConversations = ({ wallet }: { wallet: Wallet }) => {
  const fetchConversations = useFetchConversations({
    address: wallet.address,
    wallet,
  });
  const [numConversations, setNumConversations] = useState<number | null>(null);

  return (
    <Views.Section>
      <Views.SectionHeader>useFetchConversations</Views.SectionHeader>
      <Views.SubSectionHeader>Status</Views.SubSectionHeader>
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
      <Views.PrimaryButton
        inactiveText="Can't fetch conversations"
        idleText="Fetch Conversations"
        pendingText="Fetching Conversations"
        errorText="Error fetching conversations"
        onClickIdle={async () => {
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
        status={(() => {
          if (fetchConversations.isIdle) return "idle";
          if (fetchConversations.isPending) return "pending";
          if (fetchConversations.isError) return "error";
          return "inactive";
        })()}
      />
      <Views.SubSectionHeader>Number of Conversations</Views.SubSectionHeader>
      <p>
        {(() => {
          if (numConversations === null) {
            return "No conversations fetched yet";
          } else {
            return numConversations;
          }
        })()}
      </p>
    </Views.Section>
  );
};
