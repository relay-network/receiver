import { z } from "zod";
import { useState } from "react";
import { Signer } from "@ethersproject/abstract-signer";
import { useRemote } from "./use-remote";
import { useMemo } from "react";
import * as Lib from "./lib";

export const useFetchPeerOnNetwork = (props: {
  address?: string | null;
  wallet?: Signer;
}) => {
  const remote = useRemote({ address: props.address });
  const [state, setState] = useState<Lib.AsyncState<boolean>>({ id: "idle" });

  const fetchPeerOnNetwork = useMemo(() => {
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
        const peerOnNetwork = await remote.fetchPeerOnNetwork({ peerAddress });
        setState({ id: "success", data: peerOnNetwork });
        return peerOnNetwork;
      } catch (error) {
        setState({ id: "error", error });
      }
    };
  }, [remote, props.address, props.wallet]);

  return {
    fetchPeerOnNetwork,
    isIdle: state.id === "idle",
    isPending: state.id === "pending",
    isSuccess: state.id === "success",
    isError: state.id === "error",
    error: state.error,
  };
};
