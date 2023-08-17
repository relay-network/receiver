import { create } from "zustand";
import * as Comlink from "comlink";
import * as Lib from "./lib";
import { useRemote } from "./use-remote";

const useClientStore = create<Record<string, Lib.AsyncState<string>>>(
  () => ({})
);

const setIdle = ({ address }: { address: string }) => {
  useClientStore.setState((state) => {
    return {
      ...state,
      [address]: { id: "idle" },
    };
  });
};

const setPending = ({ address }: { address: string }) => {
  useClientStore.setState((state) => {
    return {
      ...state,
      [address]: { id: "pending" },
    };
  });
};

const setSuccess = ({ address }: { address: string }) => {
  useClientStore.setState((state) => {
    return {
      ...state,
      [address]: { id: "success", data: address },
    };
  });
};

const setError = ({ address, error }: { address: string; error: unknown }) => {
  useClientStore.setState((state) => {
    return {
      ...state,
      [address]: { id: "error", error },
    };
  });
};

export const useStartClient = ({ wallet }: { wallet?: Lib.Signer }) => {
  const remote = useRemote({ address: wallet?.address });
  const store = useClientStore();

  const isRemoteReady = remote !== null;
  const isWalletReady = typeof wallet === "object";

  if (!isRemoteReady || !isWalletReady) {
    return {
      start: null,
      stop: null,
      isInactive: true,
      isIdle: false,
      isPending: false,
      isSuccess: false,
      isError: false,
    };
  }

  const client = store[wallet.address];

  if (client === undefined || client.id === "idle") {
    return {
      start: async () => {
        try {
          setPending({ address: wallet.address });
          await remote.startClient(Comlink.proxy(wallet));
          setSuccess({ address: wallet.address });
        } catch (error) {
          setError({ address: wallet.address, error });
        }
      },
      stop: null,
      isInactive: false,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
    };
  } else {
    return {
      start: null,
      stop: () => {
        setIdle({ address: wallet.address });
      },
      isInactive: false,
      isIdle: false,
      isPending: client.id === "pending",
      isSuccess: client.id === "success",
      isError: client.id === "error",
      error: client.error,
    };
  }
};
