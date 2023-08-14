import { z } from "zod";
import { useState } from "react";
import { Signer } from "@ethersproject/abstract-signer";
import { useRemote } from "./use-remote";
import { useMemo } from "react";
import * as Lib from "./lib";

export const useSendMessage = (props: {
  address?: string | null;
  wallet?: Signer;
}) => {
  const remote = useRemote({ address: props.address });
  const [state, setState] = useState<
    Lib.AsyncState<z.infer<typeof Lib.zMessage>>
  >({ id: "idle" });

  const sendMessage = useMemo(() => {
    if (remote === null) {
      return null;
    }

    if (typeof props.address !== "string") {
      return null;
    }

    if (typeof props.wallet !== "object") {
      return null;
    }

    return async ({
      conversation,
      content,
    }: {
      conversation: z.infer<typeof Lib.zConversation>;
      content: string;
    }) => {
      const id = Lib.uid();

      setState({ id: "pending" });

      try {
        const sent = await remote.sendMessage({ conversation, content });
        setState({ id: "success", data: sent });
        return sent;
      } catch (error) {
        setState({ id: "error", error });
      }
    };
  }, [remote, props.address, props.wallet]);

  return {
    sendMessage,
    isIdle: state.id === "idle",
    isPending: state.id === "pending",
    isSuccess: state.id === "success",
    isError: state.id === "error",
    error: state.error,
  };
};
