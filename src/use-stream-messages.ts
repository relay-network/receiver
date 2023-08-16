import { z } from "zod";
import { create } from "zustand";
import { useMemo } from "react";
import * as Comlink from "comlink";
import * as Lib from "./lib";
import { useRemote } from "./use-remote";
import { useStartClient } from "./use-start-client.js";
import { Signer } from "@ethersproject/abstract-signer";
import { zMessage } from "./lib";

const useStreamMessagesStore = create<Record<string, Lib.AsyncState<string>>>(
  () => ({})
);

const setIdle = ({ address }: { address: string }) => {
  useStreamMessagesStore.setState((state) => {
    return {
      ...state,
      [address]: { id: "idle" },
    };
  });
};

const setPending = ({ address }: { address: string }) => {
  useStreamMessagesStore.setState((state) => {
    return {
      ...state,
      [address]: { id: "pending" },
    };
  });
};

const setSuccess = ({ address }: { address: string }) => {
  useStreamMessagesStore.setState((state) => {
    return {
      ...state,
      [address]: { id: "success", data: address },
    };
  });
};

const setError = ({ address, error }: { address: string; error: unknown }) => {
  useStreamMessagesStore.setState((state) => {
    return {
      ...state,
      [address]: { id: "error", error },
    };
  });
};

export const useStreamMessages = ({
  address,
  wallet,
}: {
  address?: string | null;
  wallet?: Signer;
}) => {
  const remote = useRemote({ address: address });
  const store = useStreamMessagesStore();
  const client = useStartClient({ address: address, wallet: wallet });

  const isRemoteReady = remote !== null;
  const isWalletReady =
    typeof wallet === "object" && typeof address === "string";
  const isClientReady = client.isSuccess;

  if (!isRemoteReady || !isWalletReady || !isClientReady) {
    return {
      start: null,
      stop: null,
      listen: null,
      isInactive: true,
      isIdle: false,
      isPending: false,
      isSuccess: false,
      isError: false,
    };
  }

  const stream = store[address];

  if (stream === undefined || stream.id === "idle") {
    return {
      start: async () => {
        try {
          setPending({ address });
          await remote.startStreamingAllMessages();
          setSuccess({ address });
        } catch (error) {
          setError({ address, error });
        }
      },
      stop: null,
      listen: null,
      isInactive: false,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
    };
  } else if (stream.id === "pending") {
    return {
      start: null,
      stop: null,
      listen: null,
      isInactive: false,
      isIdle: false,
      isPending: true,
      isSuccess: false,
      isError: false,
    };
  } else if (stream.id === "success") {
    return {
      start: null,
      stop: async () => {
        try {
          setIdle({ address });
          await remote.stopStreamingAllMessages();
        } catch (error) {
          setError({ address, error });
        }
      },
      listen: async (handler: (m: z.infer<typeof zMessage>) => unknown) => {
        try {
          remote.listenToStreamingAllMessages(Comlink.proxy(handler));
        } catch (error) {
          setError({ address, error });
        }
      },
      isInactive: false,
      isIdle: false,
      isPending: false,
      isSuccess: true,
      isError: false,
    };
  } else if (stream.id === "error") {
    return {
      start: null,
      stop: null,
      listen: null,
      isInactive: false,
      isIdle: false,
      isPending: false,
      isSuccess: false,
      isError: true,
      error: stream.error,
    };
  } else {
    throw new Error("unreachable");
  }
};