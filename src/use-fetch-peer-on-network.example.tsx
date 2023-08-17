import { useState } from "react";
import { Wallet } from "@ethersproject/wallet";
import { useFetchPeerOnNetwork } from "./use-fetch-peer-on-network";
import * as Views from "./example.lib";

export const UseFetchPeerOnNetwork = ({ wallet }: { wallet: Wallet }) => {
  const fetchPeerOnNetwork = useFetchPeerOnNetwork({
    address: wallet.address,
    wallet,
  });
  const [peerToCheck, setPeerToCheck] = useState<string | null>(null);
  const [peerOnNetwork, setPeerOnNetwork] = useState<boolean | null>(null);

  return (
    <Views.Section>
      <Views.SectionHeader>useFetchPeerOnNetwork</Views.SectionHeader>
      <Views.SubSectionHeader>Status</Views.SubSectionHeader>
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
      <Views.PrimaryTextInput
        placeholder="Enter 0xAddress"
        onChange={(v) => setPeerToCheck(v)}
        value={peerToCheck}
      />
      <Views.PrimaryButton
        inactiveText="Can't check peer"
        idleText="Check if Peer is on Network"
        pendingText="Checking..."
        errorText="Error checking peer"
        onClickIdle={async () => {
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
        status={(() => {
          if (fetchPeerOnNetwork.isIdle) return "idle";
          if (fetchPeerOnNetwork.isPending) return "pending";
          if (fetchPeerOnNetwork.isError) return "error";
          return "inactive";
        })()}
      />
      <Views.SubSectionHeader>Yes/No</Views.SubSectionHeader>
      <p>
        {(() => {
          if (peerOnNetwork === null) {
            return "Haven't checked yet";
          } else {
            return peerOnNetwork ? "Yes" : "No";
          }
        })()}
      </p>
    </Views.Section>
  );
};
