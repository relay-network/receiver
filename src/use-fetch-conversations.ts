import { z } from "zod";
import { useState } from "react";
import { Signer } from "@ethersproject/abstract-signer";
import { useRemote } from "./use-remote";
import { useMemo } from "react";
import * as Lib from "./lib";

export const useFetchConversations = (props: {
  address?: string | null;
  wallet?: Signer;
}) => {
  const remote = useRemote({ address: props.address });
  const [state, setState] = useState<
    Lib.AsyncState<Array<z.infer<typeof Lib.zConversation>>>
  >({ id: "idle" });

  const fetchConversations = useMemo(() => {
    if (remote === null) {
      return null;
    }

    if (typeof props.address !== "string") {
      return null;
    }

    if (typeof props.wallet !== "object") {
      return null;
    }

    return async () => {
      setState({ id: "pending" });

      try {
        const conversations = await remote.fetchConversations();
        setState({ id: "success", data: conversations });
        return conversations;
      } catch (error) {
        setState({ id: "error", error });
      }
    };
  }, [remote, props.address, props.wallet]);

  return {
    fetchConversations,
    isIdle: state.id === "idle",
    isPending: state.id === "pending",
    isSuccess: state.id === "success",
    isError: state.id === "error",
    error: state.error,
  };
};
