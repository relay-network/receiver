import { create } from "zustand";
import * as Lib from "./lib";
import { useXmtp } from "./use-xmtp";
import * as Comlink from "comlink";

type MessageStreamStore = {
  stream: Lib.AsyncState<undefined>;
  setStream: (stream: Lib.AsyncState<undefined>) => void;
};

const useMessageStreamStore = create<MessageStreamStore>((set) => ({
  stream: { id: "idle" },
  setStream: (stream) => set({ stream }),
}));

export const useMessageStream = ({
  wallet,
}: {
  wallet?: { address: string };
}) => {
  const xmtp = useXmtp({ wallet });
  const stream = useMessageStreamStore((s) => s.stream);
  const setStream = useMessageStreamStore((s) => s.setStream);

  if (xmtp === null) {
    return null;
  }

  if (typeof wallet !== "object") {
    return null;
  }

  xmtp.subscribeToMessagesStreamStore(
    Comlink.proxy({
      onChange: (stream) => {
        setStream(stream);
      },
    })
  );

  return {
    start: xmtp.startMessagesStream,
    stop: xmtp.stopMessagesStream,
    listen: (handler: (m: Lib.Message) => void) =>
      xmtp.listenToMessagesStream(Comlink.proxy(handler)),
    isIdle: stream.id === "idle",
    isPending: stream.id === "pending",
    isSuccess: stream.id === "success",
    isError: stream.id === "error",
    error: stream.error,
  };
};
