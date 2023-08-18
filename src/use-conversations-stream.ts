import { create } from "zustand";
import * as Lib from "./lib";
import { useXmtp } from "./use-xmtp";
import * as Comlink from "comlink";

type ConversationStreamStore = {
  stream: Lib.AsyncState<undefined>;
  setStream: (stream: Lib.AsyncState<undefined>) => void;
};

const useConversationStreamStore = create<ConversationStreamStore>((set) => ({
  stream: { id: "idle" },
  setStream: (stream) => set({ stream }),
}));

export const useConversationsStream = ({
  wallet,
}: {
  wallet?: { address: string };
}) => {
  const xmtp = useXmtp({ wallet });
  const stream = useConversationStreamStore((s) => s.stream);
  const setStream = useConversationStreamStore((s) => s.setStream);

  if (xmtp === null) {
    return null;
  }

  if (typeof wallet !== "object") {
    return null;
  }

  xmtp.subscribeToConversationsStreamStore(
    Comlink.proxy({
      onChange: (stream) => {
        setStream(stream);
      },
    })
  );

  return {
    start: xmtp.startConversationsStream,
    stop: xmtp.stopConversationsStream,
    listen: (handler: (c: Lib.Conversation) => void) =>
      xmtp.listenToConversationsStream(Comlink.proxy(handler)),
    isIdle: stream.id === "idle",
    isPending: stream.id === "pending",
    isSuccess: stream.id === "success",
    isError: stream.id === "error",
    error: stream.error,
  };
};
