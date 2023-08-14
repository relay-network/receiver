import { Signer } from "@ethersproject/abstract-signer";
import { useRemote } from "./use-remote.js";
import { useMemo } from "react";

export const useSendMessage = (props: {
  address?: string | null;
  wallet?: Signer;
}) => {
  const remote = useRemote({ address: props.address });

  return useMemo(() => {
    if (remote === null) {
      return null;
    }

    if (typeof props.address !== "string") {
      return null;
    }

    if (typeof props.wallet !== "object") {
      return null;
    }

    return remote.sendMessage;
  }, [remote, props.address, props.wallet]);
};
