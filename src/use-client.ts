import { create } from "zustand";
import { useMemo } from "react";
import * as Comlink from "comlink";
import * as Lib from "./lib";
import { useRemote } from "./use-remote";
import { Signer } from "@ethersproject/abstract-signer";

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

export const useClient = (props: {
  address?: string | null;
  wallet?: Signer;
}) => {
  const remote = useRemote({ address: props.address });
  const store = useClientStore();

  const client: Lib.AsyncState<string> = useMemo(() => {
    if (typeof props.address !== "string") {
      return { id: "idle" };
    } else if (store[props.address]) {
      return store[props.address];
    } else {
      return { id: "idle" };
    }
  }, [store, props.address]);

  const start = useMemo(() => {
    if (remote === null) {
      return null;
    }

    if (client.id !== "idle") {
      return null;
    }

    const address = props.address;
    if (typeof address !== "string") {
      return null;
    }

    const wallet = props.wallet;
    if (typeof wallet !== "object") {
      return null;
    }

    return async () => {
      try {
        setPending({ address });
        await remote.startClient(Comlink.proxy(props.wallet));
        setSuccess({ address });
      } catch (error) {
        setError({ address, error });
      }
    };
  }, [client.id === "idle", remote === null, typeof props.address]);

  const stop = useMemo(() => {
    if (remote === null) {
      return null;
    }

    const address = props.address;
    if (typeof address !== "string") {
      return null;
    }

    return () => {
      setIdle({ address });
    };
  }, [remote === null, typeof props.address]);

  return {
    client,
    start,
    stop,
    isIdle: client.id === "idle",
    isPending: client.id === "pending",
    isSuccess: client.id === "success",
    isError: client.id === "error",
    error: client.error,
  };
};
