import * as Comlink from "comlink";
import * as Lib from "./lib";
import Actions from "./use-remote.worker.js?worker&inline";

const WORKERS: Record<string, Comlink.Remote<Lib.Xmtp>> = {};

const setRemote = ({ address }: { address: string }) => {
  if (WORKERS[address + "production"]) {
    return WORKERS[address + "production"];
  } else {
    return (WORKERS[address + "production"] = Comlink.wrap(new Actions()));
  }
};

export const useRemote = ({ address }: { address?: string | null }) => {
  if (address === null || address === undefined) {
    return null;
  } else {
    return setRemote({ address: address });
  }
};
