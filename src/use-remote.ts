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

type UseActionsProps = {
  address?: string | null;
};

export const useRemote = (props: UseActionsProps) => {
  if (props.address === null || props.address === undefined) {
    return null;
  } else {
    return setRemote({ address: props.address });
  }
};
