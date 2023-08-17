import { z } from "zod";
import { useEffect, useState } from "react";
import { useRemote } from "./use-remote";
import { useStartClient } from "./use-start-client";
import * as Lib from "./lib";

export const useSendMessage = ({ wallet }: { wallet?: Lib.Signer }) => {
  const remote = useRemote({ address: wallet?.address });
  const client = useStartClient({ wallet });
  const [state, setState] = useState<
    Lib.AsyncState<z.infer<typeof Lib.zMessage>>
  >(
    (() => {
      if (client.isSuccess) {
        return { id: "idle" };
      } else {
        return { id: "inactive" };
      }
    })()
  );

  useEffect(() => {
    if (client.isSuccess) {
      setState({ id: "idle" });
    }
  }, [client.isSuccess]);

  return {
    sendMessage: (() => {
      if (state.id !== "idle") {
        return null;
      } else {
        return async ({
          conversation,
          content,
        }: {
          conversation: z.infer<typeof Lib.zConversation>;
          content: string;
        }) => {
          setState({ id: "pending" });

          try {
            if (remote === null) {
              throw new Error("remote is null even thought state.id is idle");
            }
            const sent = await remote.sendMessage({ conversation, content });
            setState({ id: "success", data: sent });
            return sent;
          } catch (error) {
            console.error(error);
            setState({ id: "error", error });
          }
        };
      }
    })(),
    isInactive: state.id === "inactive",
    isIdle: state.id === "idle",
    isPending: state.id === "pending",
    isSuccess: state.id === "success",
    isError: state.id === "error",
    error: state.error,
  };
};
