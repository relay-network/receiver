import { useState } from "react";
import { Wallet } from "@ethersproject/wallet";
import { useStartClient } from "./use-start-client";
import * as Views from "./example.views";

export const UseStartClient = () => {
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
  const client = useStartClient({ address: wallet?.address, wallet });

  return (
    <Views.Section>
      <div id="useStartClient" className="flex items-center">
        <Views.SectionHeader className="mr-auto">
          useStartClient
        </Views.SectionHeader>
        <Views.SectionLink
          className="mr-4"
          href="https://github.com/relay-network/receiver/src/use-start-client-example.tsx"
        >
          example source
        </Views.SectionLink>
        <Views.SectionLink href="https://github.com/relay-network/receiver/src/use-start-client.ts">
          hook source
        </Views.SectionLink>
      </div>
      <Views.SectionDescription>
        Before you can do anything with XMTP, you need to have a reference to
        the user's wallet. The wallet is used to create, and sign into, the
        user's XMTP identity. Accordingly, every hook requires at least the
        following parameters:
      </Views.SectionDescription>
      <pre className="mb-4">
        {"type Props = { address?: string | null; wallet?: Wallet | null; }"}
      </pre>
      <Views.SectionDescription>
        In your application, you'll want to use a robust wallet library like{" "}
        <Views.SectionLink href="https://rainbowkit.com">
          RainbowKit
        </Views.SectionLink>{" "}
        or <Views.SectionLink href="https://wagmi.sh">Wagmi</Views.SectionLink>.
        In this tutorial, for simplicity, we'll generate a random wallet:
      </Views.SectionDescription>
      <Views.PrimaryButton
        onClickIdle={() => setWallet(Wallet.createRandom())}
        inactiveText="N/A"
        idleText="Generate a wallet to get started."
        pendingText="Creating a wallet..."
        errorText="Error"
        successText="Wallet created!"
        status={wallet === undefined ? "idle" : "success"}
      />
      <Views.SectionDescription>
        Once you have a reference to the user's wallet, you can start the
        client:
      </Views.SectionDescription>
      <Views.PrimaryButton
        onClickIdle={() => {
          if (client.start === null) {
            throw new Error("Client start is null even though it's idle");
          } else {
            client.start();
          }
        }}
        inactiveText="Waiting for wallet..."
        idleText="Start"
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
      <Views.SectionDescription>
        You can stop a client after you start it:
      </Views.SectionDescription>
      <Views.PrimaryButton
        onClickIdle={() => {
          if (client.stop === null) {
            throw new Error("Client stop is null even though it's success");
          } else {
            client.stop();
          }
        }}
        onClickError={() => null}
        inactiveText="To stop a client, you must start it first."
        idleText="Stop Client"
        errorText="Error stopping client!"
        pendingText="Stopping..."
        successText="Client stopped!"
        status={(() => {
          if (client.isInactive) return "inactive";
          if (client.isIdle) return "inactive";
          if (client.isError) return "inactive";
          if (client.isSuccess) return "idle";
          if (client.isPending) return "inactive";
          throw new Error("Unhandled client state");
        })()}
      />
      <Views.SectionDescription>
        Once you have a wallet and a running client, you can start using XMTP!
        The rest of this tutorial will show you how to do that.
      </Views.SectionDescription>
    </Views.Section>
  );
};
