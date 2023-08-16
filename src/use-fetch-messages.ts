import { z } from "zod";
import { useState } from "react";
import { Signer } from "@ethersproject/abstract-signer";
import { useRemote } from "./use-remote";
import { useMemo } from "react";
import * as Lib from "./lib";

export const useFetchMessages = (props: {
  address?: string | null;
  wallet?: Signer;
}) => {
  const remote = useRemote({ address: props.address });
  const [state, setState] = useState<
    Lib.AsyncState<Array<z.infer<typeof Lib.zMessage>>>
  >({ id: "idle" });

  const fetchMessages = useMemo(() => {
    if (remote === null) {
      return null;
    }

    if (typeof props.address !== "string") {
      return null;
    }

    if (typeof props.wallet !== "object") {
      return null;
    }

    return async ({ peerAddress }: { peerAddress: string }) => {
      setState({ id: "pending" });

      try {
        const messages = await remote.fetchMessages({
          conversation: { peerAddress },
        });
        setState({ id: "success", data: messages });
        return messages;
      } catch (error) {
        setState({ id: "error", error });
      }
    };
  }, [remote, props.address, props.wallet]);

  return {
    fetchMessages,
    isIdle: state.id === "idle",
    isPending: state.id === "pending",
    isSuccess: state.id === "success",
    isError: state.id === "error",
    error: state.error,
  };
};
