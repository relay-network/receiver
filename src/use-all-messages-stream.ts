import { z } from "zod";
import { create } from "zustand";
import { useMemo } from "react";
import * as Comlink from "comlink";
import * as Lib from "./lib";
import { useRemote } from "./use-remote";
import { Signer } from "@ethersproject/abstract-signer";
import { zMessage } from "./lib";

const useAllMessagesStreamStore = create<
  Record<string, Lib.AsyncState<string>>
>(() => ({}));

const setIdle = ({ address }: { address: string }) => {
  useAllMessagesStreamStore.setState((state) => {
    return {
      ...state,
      [address]: { id: "idle" },
    };
  });
};

const setPending = ({ address }: { address: string }) => {
  useAllMessagesStreamStore.setState((state) => {
    return {
      ...state,
      [address]: { id: "pending" },
    };
  });
};

const setSuccess = ({ address }: { address: string }) => {
  useAllMessagesStreamStore.setState((state) => {
    return {
      ...state,
      [address]: { id: "success", data: address },
    };
  });
};

const setError = ({ address, error }: { address: string; error: unknown }) => {
  useAllMessagesStreamStore.setState((state) => {
    return {
      ...state,
      [address]: { id: "error", error },
    };
  });
};

export const useAllMessagesStream = (props: {
  address?: string | null;
  wallet?: Signer;
}) => {
  const remote = useRemote({ address: props.address });
  const store = useAllMessagesStreamStore();

  const stream: Lib.AsyncState<string> = useMemo(() => {
    if (typeof props.address !== "string") {
      return { id: "idle" };
    } else if (store[props.address]) {
      return store[props.address];
    } else {
      return { id: "idle" };
    }
  }, [store, props.address]);

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

    const wallet = props.wallet;
    if (typeof wallet !== "object") {
      return null;
    }

    return async (handler: (m: z.infer<typeof zMessage>) => unknown) => {
      try {
        remote.listenToStreamingAllMessages(Comlink.proxy(handler));
      } catch (error) {
        setError({ address, error });
      }
    };
  }, [stream.id === "success", remote === null, typeof props.address]);

  const start = useMemo(() => {
    if (remote === null) {
      return null;
    }

    if (stream.id !== "idle") {
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
        await remote.startStreamingAllMessages();
        setSuccess({ address });
      } catch (error) {
        setError({ address, error });
      }
    };
  }, [stream.id === "idle", remote === null, typeof props.address]);

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
