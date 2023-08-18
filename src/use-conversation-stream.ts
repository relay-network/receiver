import * as Comlink from "comlink";
import * as Lib from "./lib";
import { useXmtp } from "./use-xmtp";
import { create } from "zustand";

type ConversationStreamsStore = {
  streams: Record<string, Lib.AsyncState<undefined>>;
  setStream: (
    conversation: Lib.Conversation,
    stream: Lib.AsyncState<undefined>
  ) => void;
};

const useConversationStreamsStore = create<ConversationStreamsStore>((set) => ({
  streams: {},
  setStream: (conversation, stream) => {
    const key = Lib.uniqueConversationKey(conversation);
    return set((prev) => ({
      ...prev,
      streams: {
        ...prev.streams,
        [key]: stream,
      },
    }));
  },
}));

export const useConversationStream = ({
  wallet,
  conversation,
}: {
  wallet?: {
    address: string;
  };
  conversation?: {
    peerAddress: string;
  };
}) => {
  const key = (() => {
    if (typeof conversation !== "object") {
      return "STORE_MISS";
    } else {
      return Lib.uniqueConversationKey(conversation);
    }
  })();
  const xmtp = useXmtp({ wallet });
  const stream = useConversationStreamsStore((s) => s.streams[key]) || {
    id: "idle",
  };
  const setStream = useConversationStreamsStore((s) => s.setStream);

  if (xmtp === null) {
    return null;
  }

  if (typeof conversation !== "object") {
    return null;
  }

  xmtp.subscribeToConversationStreamsStore(
    conversation,
    Comlink.proxy((stream) => {
      setStream(conversation, stream);
    })
  );

  return {
    start: () => xmtp.startConversationStream({ conversation }),
    stop: () => xmtp.stopConversationStream({ conversation }),
    listen: (handler: (m: Lib.Message) => void) =>
      xmtp.listenToConversationStream(conversation, Comlink.proxy(handler)),
    isIdle: stream.id === "idle",
    isPending: stream.id === "pending",
    isSuccess: stream.id === "success",
    isError: stream.id === "error",
    error: stream.error,
  };
};
