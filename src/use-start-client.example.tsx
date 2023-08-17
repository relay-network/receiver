import { useState } from "react";
import { Wallet } from "@ethersproject/wallet";
import { useStartClient } from "./use-start-client";
import * as Ex from "./example.lib";
import { ConnectButton as BaseConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage, useWalletClient } from "wagmi";

export const UseStartClient = () => {
  const wallet = Ex.useSigner();
  const client = useStartClient({ wallet });

  return (
    <Ex.Section>
      <div id="useStartClient" className="flex items-center">
        <Ex.SectionHeader className="mr-auto">useStartClient</Ex.SectionHeader>
        <Ex.SectionLink
          className="mr-4"
          href="https://github.com/relay-network/receiver/src/use-start-client-example.tsx"
        >
          example source
        </Ex.SectionLink>
        <Ex.SectionLink href="https://github.com/relay-network/receiver/src/use-start-client.ts">
          hook source
        </Ex.SectionLink>
      </div>
      <Ex.SectionDescription>
        Before you can do anything with XMTP, you need to have a reference to
        the user's wallet. The wallet is used to create, and sign into, the
        user's XMTP identity. Accordingly, every hook requires at least the
        following parameters:
      </Ex.SectionDescription>
      <pre className="mb-4">
        {"type Props = { address?: string | null; wallet?: Wallet | null; }"}
      </pre>
      <Ex.SectionDescription>
        In your application, you'll want to use a robust wallet library like{" "}
        <Ex.SectionLink href="https://rainbowkit.com">
          RainbowKit
        </Ex.SectionLink>{" "}
        or <Ex.SectionLink href="https://wagmi.sh">Wagmi</Ex.SectionLink>. In
        this tutorial, for simplicity, we'll generate a random wallet:
      </Ex.SectionDescription>
      <BaseConnectButton.Custom>
        {({ account, chain, openConnectModal, mounted }) => {
          const connected = mounted && account && chain;
          return (
            <Ex.PrimaryButton
              inactiveText="Connected"
              idleText="Connect"
              errorText="Error connecting!"
              pendingText="Connecting..."
              successText="Connected!"
              onClickIdle={() => openConnectModal()}
              status={(() => {
                if (connected) {
                  return "inactive";
                } else {
                  return "idle";
                }
              })()}
            />
          );
        }}
      </BaseConnectButton.Custom>
      <Ex.SectionDescription>
        Once you have a reference to the user's wallet, you can start the
        client:
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
      <Ex.SectionDescription>
        You can stop a client after you start it:
      </Ex.SectionDescription>
      <Ex.PrimaryButton
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
      <Ex.SectionDescription>
        Once you have a wallet and a running client, you can start using XMTP!
        The rest of this tutorial will show you how to do that.
      </Ex.SectionDescription>
    </Ex.Section>
  );
};
