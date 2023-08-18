import * as Lib from "./lib";
import * as Comlink from "comlink";
import { create } from "zustand";
import { useXmtp } from "./use-xmtp";

type ClientStore = {
  client: Lib.AsyncState<undefined>;
  setClient: (client: Lib.AsyncState<undefined>) => void;
};

const useClientStore = create<ClientStore>((set) => ({
  client: { id: "idle" },
  setClient: (client) => set({ client }),
}));

export const useClient = ({ wallet }: { wallet?: Lib.Signer }) => {
  const xmtp = useXmtp({ wallet });
  const client = useClientStore((s) => s.client);
  const setClient = useClientStore((s) => s.setClient);

  if (typeof wallet !== "object") {
    return null;
  }

  if (xmtp === null) {
    return null;
  }

  xmtp.subscribeToClientStore(
    Comlink.proxy({
      onChange: (client) => {
        setClient(client);
      },
    })
  );

  return {
    start: () => xmtp.startClient(Comlink.proxy(wallet)),
    stop: () => xmtp.stopClient(),
    isIdle: client.id === "idle",
    isPending: client.id === "pending",
    isSuccess: client.id === "success",
    isError: client.id === "error",
    error: client.error,
  };
};
