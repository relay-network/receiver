import * as Comlink from "comlink";
import * as Lib from "./lib";
import Actions from "./use-xmtp.worker.js?worker&inline";

const WORKERS: Record<string, Comlink.Remote<Lib.Actions>> = {};

export const useXmtp = ({ wallet }: { wallet?: { address: string } }) => {
  if (typeof wallet !== "object") {
    return null;
  } else {
    if (WORKERS[wallet.address + "production"]) {
      return WORKERS[wallet.address + "production"];
    } else {
      return (WORKERS[wallet.address + "production"] = Comlink.wrap(
        new Actions()
      ));
    }
  }
};
