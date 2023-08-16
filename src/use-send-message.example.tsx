import { useState } from "react";
import { Wallet } from "@ethersproject/wallet";
import { useSendMessage } from "./use-send-message";
import * as Views from "./example.views";

export const UseSendMessage = ({ wallet }: { wallet: Wallet }) => {
  const send = useSendMessage({ address: wallet.address, wallet });
  const [recipientAddress, setRecipientAddress] = useState<string | null>(null);
  const [messageToSend, setMessageToSend] = useState<string | null>(null);

  return (
    <Views.Section>
      <Views.SectionHeader>useSendMessage</Views.SectionHeader>
      <Views.PrimaryTextInput
        placeholder="Enter 0xAddress"
        onChange={(v) => setRecipientAddress(v)}
        value={recipientAddress}
      />
      <Views.PrimaryTextInput
        placeholder="Enter Message"
        onChange={(v) => setMessageToSend(v)}
        value={messageToSend}
      />
      <Views.PrimaryButton
        inactiveText="Can't send yet"
        idleText="Send"
        pendingText="Sending..."
        errorText="Error sending"
        onClickIdle={async () => {
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
        status={(() => {
          if (send.isIdle) return "idle";
          if (send.isPending) return "pending";
          if (send.isError) return "error";
          return "inactive";
        })()}
      />
    </Views.Section>
  );
};
