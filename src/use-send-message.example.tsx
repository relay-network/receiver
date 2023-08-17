import { Wallet } from "@ethersproject/wallet";
import { useSendMessage } from "./use-send-message";
import * as Ex from "./example.lib";
import { useStartClient } from "./use-start-client.js";

const wallet = Wallet.createRandom();

export const UseSendMessage = () => {
  const connected = Ex.useSigner();
  const client = useStartClient({ wallet });
  const sendToSelf = useSendMessage({ wallet });
  const sendToMaintainer = useSendMessage({ wallet });
  const sendToVitalik = useSendMessage({ wallet });

  console.log(sendToVitalik);
  return (
    <Ex.Section>
      <div id="useSendMessage" className="flex items-center">
        <Ex.SectionHeader className="mr-auto">useSendMessage</Ex.SectionHeader>
        <Ex.SectionLink
          className="mr-4"
          href="https://github.com/relay-network/receiver/src/use-send-message.example.tsx"
        >
          example source
        </Ex.SectionLink>
        <Ex.SectionLink href="https://github.com/relay-network/receiver/src/use-send-message.ts">
          hook source
        </Ex.SectionLink>
      </div>
      <Ex.SectionDescription>
        Before we start sending messages we need to start up a new XMTP client.
        We have to do this because it is not currently possible (for security
        reasons) to send yourself a message using XMTP. Click the button below
        to start the client.
      </Ex.SectionDescription>
      <Ex.PrimaryButton
        onClickIdle={() => {
          if (client.start === null) {
            throw new Error("Client start is null even though it's idle");
          } else {
            client.start();
          }
        }}
        inactiveText="Waiting for wallet..."
        idleText="Start the client"
        errorText="Error starting client!"
        pendingText="Starting..."
        successText="Client started!"
        status={(() => {
          if (client.isInactive) return "inactive";
          if (client.isError) return "error";
          if (client.isSuccess) return "success";
          if (client.isPending) return "pending";
          if (client.isIdle) return "idle";
          throw new Error("Unhandled client state");
        })()}
      />
      <Ex.SectionDescription>
        Before you send the message, you might want to open the developer
        console to see receipt in real time.
      </Ex.SectionDescription>
      <Ex.PrimaryButton
        inactiveText="Have you started the client?"
        idleText='Send yourself "Hello, superstar!"'
        pendingText="Sending..."
        errorText="Error sending"
        successText="Sent!"
        onClickIdle={async () => {
          if (sendToSelf.sendMessage === null || connected === undefined) {
            return undefined;
          } else {
            await sendToSelf.sendMessage({
              conversation: {
                peerAddress: connected.address,
              },
              content: "Hello, superstar!",
            });
          }
        }}
        status={(() => {
          if (sendToSelf.isIdle) return "idle";
          if (sendToSelf.isPending) return "pending";
          if (sendToSelf.isError) return "error";
          if (sendToSelf.isSuccess) return "success";
          return "inactive";
        })()}
      />
      <Ex.SectionDescription>
        Of course, you can send other people messages as well:
      </Ex.SectionDescription>
      <Ex.PrimaryButton
        inactiveText="Have you started the client?"
        idleText="Send the maintainer a 👍"
        pendingText="Sending..."
        errorText="Error sending"
        successText="Sent!"
        onClickIdle={async () => {
          if (sendToMaintainer.sendMessage === null) {
            return undefined;
          } else {
            await sendToMaintainer.sendMessage({
              conversation: {
                peerAddress: "0xf89773CF7cf0B560BC5003a6963b98152D84A15a",
              },
              content: "👍 from the Relay Receiver Tutorial site!",
            });
          }
        }}
        status={(() => {
          if (sendToMaintainer.isIdle) return "idle";
          if (sendToMaintainer.isPending) return "pending";
          if (sendToMaintainer.isError) return "error";
          if (sendToMaintainer.isSuccess) return "success";
          return "inactive";
        })()}
      />
      <Ex.SectionDescription>
        You can even send Vitalik a love note:
      </Ex.SectionDescription>
      <Ex.PrimaryButton
        inactiveText="Have you started the client?"
        idleText="🚀 ❤️"
        pendingText="Sending..."
        errorText="Error sending"
        successText="Sent!"
        onClickIdle={async () => {
          if (sendToVitalik.sendMessage === null) {
            return undefined;
          } else {
            try {
              const s = await sendToVitalik.sendMessage({
                conversation: {
                  peerAddress: "0xFAIL",
                },
                content: "👍 from the Relay Receiver Tutorial site!",
              });
              console.log(s);
            } catch (e) {
              console.log("error", e);
            }
          }
        }}
        status={(() => {
          if (sendToVitalik.isIdle) return "idle";
          if (sendToVitalik.isPending) return "pending";
          if (sendToVitalik.isError) return "error";
          if (sendToVitalik.isSuccess) return "success";
          return "inactive";
        })()}
      />
      <Ex.SectionDescription>
        Just kidding 😈, frens don't let frens spam frens. Let's learn more
        about how to harness our newfound powers ⚡️ more productively 🛠.
      </Ex.SectionDescription>
    </Ex.Section>
  );
};
