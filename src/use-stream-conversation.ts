import { z } from "zod";
import { create } from "zustand";
import { useMemo } from "react";
import * as Comlink from "comlink";
import * as Lib from "./lib";
import { useRemote } from "./use-remote";
import { Signer } from "@ethersproject/abstract-signer";
import { zMessage } from "./lib";

const useStreamConversationStore = create<
  Record<string, Record<string, Lib.AsyncState<string>>>
>(() => ({}));

const setIdle = ({
  address,
  peerAddress,
}: {
  address: string;
  peerAddress: string;
}) => {
  useStreamConversationStore.setState((state) => {
    return {
      ...state,
      [address]: {
        ...state[address],
        [peerAddress]: { id: "idle" },
      },
    };
  });
};

const setPending = ({
  address,
  peerAddress,
}: {
  address: string;
  peerAddress: string;
}) => {
  useStreamConversationStore.setState((state) => {
    return {
      ...state,
      [address]: {
        ...state[address],
        [peerAddress]: { id: "pending" },
      },
    };
  });
};

const setSuccess = ({
  address,
  peerAddress,
}: {
  address: string;
  peerAddress: string;
}) => {
  useStreamConversationStore.setState((state) => {
    return {
      ...state,
      [address]: {
        ...state[address],
        [peerAddress]: { id: "success", data: address },
      },
    };
  });
};

const setError = ({
  address,
  peerAddress,
  error,
}: {
  address: string;
  peerAddress: string;
  error: unknown;
}) => {
  useStreamConversationStore.setState((state) => {
    return {
      ...state,
      [address]: {
        ...state[address],
        [peerAddress]: { id: "error", error },
      },
    };
  });
};

export const useStreamConversation = (props: {
  address?: string | null;
  wallet?: Signer;
  peerAddress?: string | null;
}) => {
  const remote = useRemote({ address: props.address });
  const store = useStreamConversationStore();

  const stream: Lib.AsyncState<string> = useMemo(() => {
    if (typeof props.address !== "string") {
      return { id: "idle" };
    }

    if (typeof props.peerAddress !== "string") {
      return { id: "idle" };
    }

    if (store[props.address]) {
      if (store[props.address][props.peerAddress]) {
        return store[props.address][props.peerAddress];
      }
    }

    return { id: "idle" };
  }, [store, props.address, props.peerAddress]);

  const listen = useMemo(() => {
    if (remote === null) {
      return null;
    }

    if (stream.id !== "success") {
      return null;
    }

    const address = props.address;
    if (typeof address !== "string") {
      return null;
    }

    const peerAddress = props.peerAddress;
    if (typeof peerAddress !== "string") {
      return null;
    }

    const wallet = props.wallet;
    if (typeof wallet !== "object") {
      return null;
    }

    return async (handler: (m: z.infer<typeof zMessage>) => unknown) => {
      try {
        remote.listenToStreamingMessages(
          { peerAddress },
          Comlink.proxy(handler)
        );
      } catch (error) {
        setError({ address, peerAddress, error });
      }
    };
  }, [
    stream.id === "success",
    remote === null,
    typeof props.address,
    typeof props.peerAddress,
  ]);

  const start = useMemo(() => {
    if (remote === null) {
      console.log("Remote is null");
      return null;
    }

    if (stream.id !== "idle") {
      console.log("Stream is not idle");
      return null;
    }

    const address = props.address;
    if (typeof address !== "string") {
      console.log("Address is not string");
      return null;
    }

    const peerAddress = props.peerAddress;
    if (typeof peerAddress !== "string") {
      console.log("Peer address is not string");
      return null;
    }

    const wallet = props.wallet;
    if (typeof wallet !== "object") {
      console.log("Wallet is not object");
      return null;
    }

    console.log("Start stream is function", { address, peerAddress });

    return async () => {
      try {
        setPending({ address, peerAddress });
        await remote.startStreamingMessages({ conversation: { peerAddress } });
        setSuccess({ address, peerAddress });
      } catch (error) {
        setError({ address, peerAddress, error });
      }
    };
  }, [
    stream.id === "idle",
    remote === null,
    typeof props.address,
    typeof props.peerAddress,
  ]);

  const stop = useMemo(() => {
    if (remote === null) {
      return null;
    }

    const address = props.address;
    if (typeof address !== "string") {
      return null;
    }

    const peerAddress = props.peerAddress;
    if (typeof peerAddress !== "string") {
      return null;
    }

    return () => {
      setIdle({ address, peerAddress });
    };
  }, [remote === null, typeof props.address, typeof props.peerAddress]);

  return {
    start,
    stop,
    listen,
    isIdle: stream.id === "idle",
    isPending: stream.id === "pending",
    isSuccess: stream.id === "success",
    isError: stream.id === "error",
    error: stream.error,
  };
};
