import { useMemo, useEffect } from "react";
import { create } from "zustand";
import * as Comlink from "comlink";
import { Signer } from "@ethersproject/abstract-signer";
import * as Lib from "./xmtp-hooks.lib";
// import XmtpWorker from "./xmtp-hooks.worker.js?worker&inline";
import * as Xmtp from "./xmtp-hooks.xmtp";

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * useXmtpStore
 *
 *
 *
 *
 *
 * *************************************************************************/

type Transition = [AsyncState<unknown>["id"], AsyncState<unknown>["id"]];

const VALID_TRANSITIONS: Transition[] = [
  ["idle", "pending"],
  ["idle", "success"],
  ["idle", "error"],
  ["pending", "idle"],
  ["pending", "success"],
  ["pending", "error"],
  ["success", "idle"],
  ["error", "idle"],
  ["error", "pending"],
];

const isValidTransition = (transition: Transition) => {
  return Boolean(
    VALID_TRANSITIONS.find(([prev, next]) => {
      return prev === transition[0] && next === transition[1];
    })
  );
};

type XmtpFromStore = {
  address: string;
  env?: "local" | "production" | "dev";
  export?: string;
  // worker: Comlink.Remote<Lib.Xmtp>;
  worker: typeof Xmtp;
};

const MISSES_STORE_KEY = "RANDOM STRING HERE";

const xmtpStore = create<Record<string, AsyncState<XmtpFromStore>>>(() => ({}));

export const useXmtpStore = ({
  clientAddress,
}: {
  clientAddress?: string | null;
}) => {
  const key = clientAddress || MISSES_STORE_KEY;
  const xmtp = xmtpStore((state) => state[key]) || { id: "idle" };
  const setXmtp = (nextXmtp: AsyncState<XmtpFromStore>) => {
    xmtpStore.setState((state) => {
      const prevXmtp = state[key] || { id: "idle" };
      const transition: Transition = [prevXmtp.id, nextXmtp.id];
      if (!isValidTransition(transition)) {
        return state;
      } else {
        return {
          ...state,
          [key]: nextXmtp,
        };
      }
    });
  };

  return [xmtp, setXmtp] as const;
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * useXmtp
 *
 *
 *
 *
 *
 * *************************************************************************/

export const useXmtp = ({
  clientAddress,
  wallet,
  opts,
}: {
  clientAddress?: string | null;
  wallet?: Signer | null;
  opts?: Partial<Lib.ClientOptions>;
}) => {
  /* **************************************************************************
   *
   * Client
   *
   * *************************************************************************/

  const [xmtp, setXmtp] = useXmtpStore({ clientAddress });

  const isStartClientReady =
    (isIdle(xmtp) || isError(xmtp)) &&
    (wallet !== null || typeof opts?.privateKeyOverride === "string");

  const startClient = useMemo(() => {
    if (!isStartClientReady) {
      return null;
    } else {
      return async () => {
        try {
          setXmtp({ id: "pending" });
          // const worker = Comlink.wrap<Lib.Xmtp>(new XmtpWorker());
          const worker = Xmtp;
          const client = await worker.startClient(
            (() => {
              if (wallet === null) {
                return null;
              } else {
                return Comlink.proxy(wallet);
              }
            })(),
            opts
          );
          setXmtp({
            id: "success",
            data: {
              ...client,
              worker,
            },
          });
        } catch (error) {
          setXmtp({ id: "error", error });
        }
      };
    }
  }, [xmtp.id, clientAddress, wallet, opts]);

  const stopClient: Lib.Xmtp["stopClient"] | null = useMemo(() => {
    if (!isSuccess(xmtp)) {
      return null;
    } else {
      return async () => {
        setXmtp({ id: "idle" });
        return true;
      };
    }
  }, [xmtp.id, clientAddress, wallet, opts]);

  /* **************************************************************************
   *
   * Actions
   *
   * *************************************************************************/

  const fetchConversations: Lib.Xmtp["fetchConversations"] | null =
    useMemo(() => {
      if (!isSuccess(xmtp)) {
        return null;
      } else {
        return xmtp.data.worker.fetchConversations;
      }
    }, [xmtp]);

  const fetchMessages: Lib.Xmtp["fetchMessages"] | null = useMemo(() => {
    if (!isSuccess(xmtp)) {
      return null;
    } else {
      return async ({ conversation, opts }) => {
        return await xmtp.data.worker.fetchMessages({ conversation, opts });
      };
    }
  }, [xmtp]);

  const fetchPeerOnNetwork: Lib.Xmtp["fetchPeerOnNetwork"] | null =
    useMemo(() => {
      if (!isSuccess(xmtp)) {
        return null;
      } else {
        return xmtp.data.worker.fetchPeerOnNetwork;
      }
    }, [xmtp]);

  const sendMessage: Lib.Xmtp["sendMessage"] | null = useMemo(() => {
    if (!isSuccess(xmtp)) {
      return null;
    } else {
      return xmtp.data.worker.sendMessage;
    }
  }, [xmtp]);

  const startStreamingMessages: Lib.Xmtp["startStreamingMessages"] | null =
    useMemo(() => {
      if (!isSuccess(xmtp)) {
        return null;
      } else {
        return xmtp.data.worker.startStreamingMessages;
      }
    }, [xmtp]);

  const stopStreamingMessages: Lib.Xmtp["stopStreamingMessages"] | null =
    useMemo(() => {
      if (!isSuccess(xmtp)) {
        return null;
      } else {
        return xmtp.data.worker.stopStreamingMessages;
      }
    }, [xmtp]);

  const listenToStreamingMessages:
    | Lib.Xmtp["listenToStreamingMessages"]
    | null = useMemo(() => {
    if (!isSuccess(xmtp)) {
      return null;
    } else {
      return async (conversation, handler) => {
        return await xmtp.data.worker.listenToStreamingMessages(
          conversation,
          Comlink.proxy(handler)
        );
      };
    }
  }, [xmtp]);

  const startStreamingConversations:
    | Lib.Xmtp["startStreamingConversations"]
    | null = useMemo(() => {
    if (!isSuccess(xmtp)) {
      return null;
    } else {
      return xmtp.data.worker.startStreamingConversations;
    }
  }, [xmtp]);

  const stopStreamingConversations:
    | Lib.Xmtp["stopStreamingConversations"]
    | null = useMemo(() => {
    if (!isSuccess(xmtp)) {
      return null;
    } else {
      return xmtp.data.worker.stopStreamingConversations;
    }
  }, [xmtp]);

  const listenToStreamingConversations:
    | Lib.Xmtp["listenToStreamingConversations"]
    | null = useMemo(() => {
    if (!isSuccess(xmtp)) {
      return null;
    } else {
      return async (handler) => {
        return await xmtp.data.worker.listenToStreamingConversations(
          Comlink.proxy(handler)
        );
      };
    }
  }, [xmtp]);

  const startStreamingAllMessages:
    | Lib.Xmtp["startStreamingAllMessages"]
    | null = useMemo(() => {
    if (!isSuccess(xmtp)) {
      return null;
    } else {
      return xmtp.data.worker.startStreamingAllMessages;
    }
  }, [xmtp]);

  const stopStreamingAllMessages: Lib.Xmtp["stopStreamingAllMessages"] | null =
    useMemo(() => {
      if (!isSuccess(xmtp)) {
        return null;
      } else {
        return xmtp.data.worker.stopStreamingAllMessages;
      }
    }, [xmtp]);

  const listenToStreamingAllMessages:
    | Lib.Xmtp["listenToStreamingAllMessages"]
    | null = useMemo(() => {
    if (!isSuccess(xmtp)) {
      return null;
    } else {
      return async (handler) => {
        return await xmtp.data.worker.listenToStreamingAllMessages(
          Comlink.proxy(handler)
        );
      };
    }
  }, [xmtp]);

  return {
    startClient,
    stopClient,
    isClientIdle: isIdle(xmtp),
    isClientPending: isPending(xmtp),
    isClientSuccess: isSuccess(xmtp),
    isClientError: isError(xmtp),
    client: xmtp.data,
    clientError: xmtp.error,
    fetchConversations,
    fetchMessages,
    fetchPeerOnNetwork,
    sendMessage,
    startStreamingMessages,
    stopStreamingMessages,
    listenToStreamingMessages,
    startStreamingConversations,
    stopStreamingConversations,
    listenToStreamingConversations,
    startStreamingAllMessages,
    stopStreamingAllMessages,
    listenToStreamingAllMessages,
  };
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * usePeerOnNetworkStore
 *
 *
 *
 *
 *
 * *************************************************************************/

const peerOnNetworkStore = create<Record<string, AsyncState<boolean>>>(
  () => ({})
);

export const usePeerOnNetwork = ({
  peerAddress,
  env,
}: {
  peerAddress?: string | null;
  env?: "local" | "dev" | "production" | null;
}) => {
  const key = (() => {
    if (typeof env !== "string" || typeof peerAddress !== "string") {
      return MISSES_STORE_KEY;
    } else {
      return `${env}-${peerAddress}`;
    }
  })();
  const peerOnNetwork = peerOnNetworkStore((state) => state[key]) || {
    id: "idle",
  };

  const setPeerOnNetwork = (
    input: AsyncState<boolean> | Identity<AsyncState<boolean>>
  ) => {
    peerOnNetworkStore.setState((state) => {
      return {
        ...state,
        [key]:
          typeof input === "function"
            ? input(state[key] || { id: "idle" })
            : input,
      };
    });
  };

  return [peerOnNetwork, setPeerOnNetwork] as const;
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * useMessagesStore
 *
 *
 *
 *
 *
 * *************************************************************************/

const useMessagesStore = create<Record<string, AsyncState<Lib.Message[]>>>(
  () => ({})
);

export const useMessages = ({
  clientAddress,
  conversation,
}: {
  clientAddress?: string | null;
  conversation?: Lib.Conversation | null;
}) => {
  const key = (() => {
    if (nullish(clientAddress) || nullish(conversation)) {
      return MISSES_STORE_KEY;
    } else {
      return `${clientAddress}-${Lib.uniqueConversationKey(conversation)}`;
    }
  })();
  const messages = useMessagesStore((state) => state[key]) || { id: "idle" };

  const setMessages = (
    input: AsyncState<Lib.Message[]> | Identity<AsyncState<Lib.Message[]>>
  ) => {
    useMessagesStore.setState((state) => {
      return {
        ...state,
        [key]:
          typeof input === "function"
            ? input(state[key] || { id: "idle" })
            : input,
      };
    });
  };

  return [messages, setMessages] as const;
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * useStreamingStore
 *
 *
 *
 *
 *
 * *************************************************************************/

const useStreamingStore = create<Record<string, AsyncState<boolean>>>(
  () => ({})
);

export const useStreaming = ({
  clientAddress,
  conversation,
}: {
  clientAddress?: string | null;
  conversation?: Lib.Conversation | null;
}) => {
  const key = (() => {
    if (nullish(clientAddress) || nullish(conversation)) {
      return MISSES_STORE_KEY;
    } else {
      return `${clientAddress}-${Lib.uniqueConversationKey(conversation)}`;
    }
  })();
  const streaming = useStreamingStore((state) => state[key]) || { id: "idle" };

  const setStreaming = (
    input: AsyncState<boolean> | Identity<AsyncState<boolean>>
  ) => {
    useStreamingStore.setState((state) => {
      return {
        ...state,
        [key]:
          typeof input === "function"
            ? input(state[key] || { id: "idle" })
            : input,
      };
    });
  };

  return [streaming, setStreaming] as const;
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * useSentMessagesStore
 *
 *
 *
 *
 *
 * *************************************************************************/

const sentMessagesStore = create<Record<string, AsyncStateArray<Lib.Message>>>(
  () => ({})
);

export const useSentMessagesStore = ({
  clientAddress,
  conversation,
}: {
  clientAddress?: string | null;
  conversation?: Lib.Conversation | null;
}) => {
  const key = (() => {
    if (nullish(clientAddress) || nullish(conversation)) {
      return MISSES_STORE_KEY;
    } else {
      return `${clientAddress}-${Lib.uniqueConversationKey(conversation)}`;
    }
  })();
  const sentMessages = sentMessagesStore((state) => state[key]) || [];

  const setSentMessages = (
    input: AsyncStateArray<Lib.Message> | Identity<AsyncStateArray<Lib.Message>>
  ) => {
    sentMessagesStore.setState((state) => {
      return {
        ...state,
        [key]: typeof input === "function" ? input(state[key] || []) : input,
      };
    });
  };

  return [sentMessages, setSentMessages] as const;
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * useConversation
 *
 *
 *
 *
 *
 * *************************************************************************/

export const useConversation = ({
  clientAddress,
  wallet,
  opts,
  conversation,
}: {
  clientAddress?: string | null;
  wallet?: Signer | null;
  opts?: Partial<Lib.ClientOptions>;
  conversation?: Lib.Conversation | null;
}) => {
  const {
    startClient,
    isClientIdle,
    isClientPending,
    isClientSuccess,
    isClientError,
    client,
    clientError,
    fetchMessages,
    fetchPeerOnNetwork,
    startStreamingMessages,
    stopStreamingMessages,
    listenToStreamingMessages,
    sendMessage,
  } = useXmtp({ clientAddress, wallet, opts });

  /* **************************************************************************
   *
   * Messages
   *
   * *************************************************************************/

  const [messages, setMessages] = useMessages({ clientAddress, conversation });

  useEffect(() => {
    if (
      !isSuccess(messages) ||
      nullish(fetchMessages) ||
      nullish(conversation)
    ) {
      return;
    } else {
      (async () => {
        try {
          setMessages({ id: "pending" });
          const messages = await fetchMessages({
            conversation,
            opts: Lib.getNextPageOptions({}),
          });
          setMessages({ id: "success", data: messages });
        } catch (error) {
          setMessages({ id: "error", error });
        }
      })();
    }
  }, [fetchMessages, conversation]);

  const fetchMoreMessages = useMemo(() => {
    if (
      !isSuccess(messages) ||
      nullish(fetchMessages) ||
      nullish(conversation)
    ) {
      return null;
    } else {
      return async () => {
        try {
          setMessages((prev) => {
            if (prev.id !== "success") {
              return prev;
            } else {
              return {
                id: "fetching",
                data: prev.data,
              };
            }
          });
          const newMessages = await fetchMessages({
            conversation,
            opts: Lib.getNextPageOptions({ messages: messages.data }),
          });
          setMessages((prev) => {
            if (prev.id !== "fetching") {
              return prev;
            } else {
              return {
                id: "success",
                data: Lib.insertMessagesIfNew({
                  messages: prev.data,
                  newMessages,
                }),
              };
            }
          });
        } catch (error) {
          setMessages((prev) => {
            if (prev.id !== "fetching") {
              return prev;
            } else {
              return {
                id: "error",
                error,
              };
            }
          });
        }
      };
    }
  }, [fetchMessages, messages]);

  /* **************************************************************************
   *
   * Streaming
   *
   * *************************************************************************/

  const [streaming, setStreaming] = useStreaming({
    clientAddress,
    conversation,
  });

  useEffect(() => {
    if (
      !isIdle(streaming) ||
      nullish(startStreamingMessages) ||
      nullish(stopStreamingMessages) ||
      nullish(listenToStreamingMessages) ||
      nullish(conversation)
    ) {
      return;
    } else {
      (async () => {
        try {
          setStreaming({ id: "pending" });
          await startStreamingMessages({ conversation });
          await listenToStreamingMessages(conversation, (message) => {
            setMessages((prev) => {
              if (prev.id === "error") {
                return prev;
              } else {
                return {
                  id: "success",
                  data: Lib.insertMessagesIfNew({
                    messages: prev.data || [],
                    newMessages: [message],
                  }),
                };
              }
            });
          });
          setStreaming({ id: "success", data: true });
          return () => {
            stopStreamingMessages({ conversation });
          };
        } catch (error) {
          setStreaming({ id: "error", error });
        }
      })();
    }
  }, [streaming.id, startStreamingMessages]);

  /* **************************************************************************
   *
   * Peer On Network
   *
   * *************************************************************************/

  const [peerOnNetwork, setPeerOnNetwork] = usePeerOnNetwork({
    peerAddress: conversation?.peerAddress,
    env: client?.env,
  });

  useEffect(() => {
    if (fetchPeerOnNetwork === null || nullish(conversation)) {
      return;
    } else {
      (async () => {
        try {
          setPeerOnNetwork({ id: "pending" });
          const result = await fetchPeerOnNetwork(conversation);
          setPeerOnNetwork({ id: "success", data: result });
        } catch (error) {
          setPeerOnNetwork({ id: "error", error });
        }
      })();
    }
    // Conversation.peerAddress in the deps is a hack to refetch for different conversations.
  }, [fetchPeerOnNetwork, conversation?.peerAddress]);

  /* **************************************************************************
   *
   * Send A Message
   *
   * *************************************************************************/

  const [sentMessages, setSentMessages] = useSentMessagesStore({
    clientAddress,
    conversation,
  });

  const isSending = useMemo(() => {
    return sentMessages.some((sentMessage) => sentMessage.id === "pending");
  }, [sentMessages]);

  const send = useMemo(() => {
    if (
      peerOnNetwork.data !== true ||
      sendMessage === null ||
      nullish(conversation)
    ) {
      return null;
    } else {
      return async ({ content }: { content: unknown }) => {
        const uuid = `${Math.random()}${Math.random()}${Math.random()}${
          Math.random
        }`;
        try {
          setSentMessages((prev) => [...prev, { id: "pending", uuid }]);
          // TODO OPTS
          const sent = await sendMessage({ conversation, content });
          setMessages((prev) => {
            if (prev.id !== "success" && prev.id !== "fetching") {
              return prev;
            } else {
              return {
                id: prev.id,
                data: Lib.insertMessagesIfNew({
                  messages: prev.data || [],
                  newMessages: [sent],
                }),
              };
            }
          });
          setSentMessages((prev) => {
            return prev.map((sentMessage) => {
              if (sentMessage.uuid !== uuid) {
                return sentMessage;
              } else {
                return { id: "success", uuid, data: sent };
              }
            });
          });
        } catch (error) {
          return setSentMessages((prev) => {
            return prev.map((sentMessage) => {
              if (sentMessage.uuid !== uuid) {
                return sentMessage;
              } else {
                return { id: "error", uuid, error };
              }
            });
          });
        }
      };
    }
  }, [sendMessage, peerOnNetwork.data, conversation]);

  /* **************************************************************************
   *
   * Conversation
   *
   * *************************************************************************/

  return {
    conversation,
    startClient,
    isClientIdle,
    isClientPending,
    isClientError,
    isClientSuccess,
    clientError,
    client,
    isMessagesSuccess: isSuccess(messages),
    isMessagesError: isError(messages),
    isMessagesFetching: isFetching(messages),
    messagesError: messages.error,
    messages: messages.data,
    fetchMoreMessages,
    isPeerOnNetworkIdle: isIdle(peerOnNetwork),
    isPeerOnNetworkPending: isPending(peerOnNetwork),
    isPeerOnNetworkError: isError(peerOnNetwork),
    isPeerOnNetworkSuccess: isSuccess(peerOnNetwork),
    isPeerOnNetwork: peerOnNetwork.data,
    peerOnNetworkError: peerOnNetwork.error,
    isStreamingIdle: isIdle(streaming),
    isStreamingPending: isPending(streaming),
    isStreamingError: isError(streaming),
    isStreamingSuccess: isSuccess(streaming),
    isStreaming: streaming.data,
    streamingError: streaming.error,
    isSending,
    send,
  };
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * usePreviewsStore
 *
 *
 *
 *
 *
 * *************************************************************************/

const previewsStore = create<Record<string, AsyncState<Lib.Preview[]>>>(
  () => ({})
);

export const usePreviewsStore = ({
  clientAddress,
}: {
  clientAddress?: string | null;
}) => {
  const key = clientAddress || MISSES_STORE_KEY;
  const previews = previewsStore((state) => state[key]) || { id: "idle" };

  const setPreviews = (
    input: AsyncState<Lib.Preview[]> | Identity<AsyncState<Lib.Preview[]>>
  ) => {
    previewsStore.setState((state) => {
      return {
        ...state,
        [key]:
          typeof input === "function"
            ? input(state[key] || { id: "idle" })
            : input,
      };
    });
  };

  return [previews, setPreviews] as const;
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * useGlobalStreamingStore
 *
 *
 *
 *
 *
 * *************************************************************************/

const globalStreamingStore = create<Record<string, AsyncState<boolean>>>(
  () => ({})
);

export const useGlobalStreamingStore = ({
  clientAddress,
}: {
  clientAddress?: string | null;
}) => {
  const key = clientAddress || MISSES_STORE_KEY;
  const streaming = globalStreamingStore((state) => state[key]) || {
    id: "idle",
  };

  const setStreaming = (
    input: AsyncState<boolean> | Identity<AsyncState<boolean>>
  ) => {
    globalStreamingStore.setState((state) => {
      return {
        ...state,
        [key]:
          typeof input === "function"
            ? input(state[key] || { id: "idle" })
            : input,
      };
    });
  };

  return [streaming, setStreaming] as const;
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * usePreviews
 *
 *
 *
 *
 *
 * *************************************************************************/

export const usePreviews = ({
  clientAddress,
  wallet,
  opts,
}: {
  clientAddress?: string | null;
  wallet?: Signer | null;
  opts?: Partial<Lib.ClientOptions>;
}) => {
  const {
    startClient,
    isClientIdle,
    isClientPending,
    isClientSuccess,
    isClientError,
    client,
    clientError,
    fetchMessages,
    fetchConversations,
    startStreamingAllMessages,
    stopStreamingAllMessages,
    listenToStreamingAllMessages,
  } = useXmtp({ clientAddress, wallet, opts });

  /* **************************************************************************
   *
   * Messages
   *
   * *************************************************************************/

  const fetchMostRecentMessage = useMemo(() => {
    if (fetchMessages === null) {
      return null;
    } else {
      return async (
        conversation: Lib.Conversation
      ): Promise<Lib.Message | null> => {
        const messages = await fetchMessages({
          conversation,
          opts: {
            limit: 1,
            direction: "descending",
          },
        });
        if (messages.length === 0) {
          return null;
        } else {
          return messages[0];
        }
      };
    }
  }, [fetchMessages]);

  /* **************************************************************************
   *
   * Previews
   *
   * *************************************************************************/

  const [previews, setPreviews] = usePreviewsStore({
    clientAddress,
  });

  const fetchPreview = useMemo(() => {
    if (fetchMostRecentMessage === null) {
      return null;
    } else {
      return async (
        conversation: Lib.Conversation
      ): Promise<Lib.Preview | null> => {
        const mostRecentMessage = await fetchMostRecentMessage(conversation);
        if (mostRecentMessage === null) {
          return null;
        } else {
          return {
            ...conversation,
            preview: mostRecentMessage,
          };
        }
      };
    }
  }, [fetchMostRecentMessage]);

  useEffect(() => {
    if (
      !isIdle(previews) ||
      fetchConversations === null ||
      fetchPreview === null
    ) {
      return;
    } else {
      (async () => {
        try {
          setPreviews((prev) => {
            if (prev.id !== "idle") {
              return prev;
            } else {
              return { id: "pending" };
            }
          });
          const conversations = await fetchConversations();
          const maybeNullPreviews = await Promise.all(
            conversations.map((conversation) => {
              return fetchPreview(conversation);
            })
          );
          const previews = maybeNullPreviews.filter(
            (preview): preview is Lib.Preview => preview !== null
          );
          setPreviews((prev) => {
            if (prev.id !== "pending") {
              return prev;
            } else {
              return {
                id: "success",
                data: Lib.insertOrUpdatePreviews(prev.data || [], previews),
              };
            }
          });
        } catch (error) {
          setPreviews({ id: "error", error });
        }
      })();
    }
  }, [previews.id, fetchConversations, fetchPreview]);

  /* **************************************************************************
   *
   * Streaming Messages
   *
   * *************************************************************************/

  const [streaming, setStreaming] = useGlobalStreamingStore({ clientAddress });

  useEffect(() => {
    if (
      !isIdle(streaming) ||
      startStreamingAllMessages === null ||
      stopStreamingAllMessages === null ||
      listenToStreamingAllMessages === null
    ) {
      return;
    } else {
      (async () => {
        try {
          setStreaming((prev) => {
            if (prev.id !== "idle") {
              return prev;
            } else {
              return { id: "pending" };
            }
          });
          await startStreamingAllMessages();
          await listenToStreamingAllMessages((message) => {
            const preview: Lib.Preview = {
              ...message.conversation,
              preview: message,
            };
            setPreviews((prev) => {
              if (prev.id !== "success") {
                return prev;
              } else {
                return {
                  ...prev,
                  data: Lib.insertOrUpdatePreviews(prev.data || [], preview),
                };
              }
            });
          });

          return () => {
            stopStreamingAllMessages();
          };
        } catch (error) {
          setStreaming({ id: "error", error });
        }
      })();
    }
  }, [
    streaming.id,
    startStreamingAllMessages,
    stopStreamingAllMessages,
    listenToStreamingAllMessages,
  ]);

  const sortedPreviews = useMemo(() => {
    if (previews.data === undefined) {
      return null;
    } else {
      return Lib.sortByMostRecentPreview(previews.data);
    }
  }, [previews.data]);

  return {
    startClient,
    isClientIdle,
    isClientPending,
    isClientSuccess,
    isClientError,
    client,
    clientError,
    isStreamingIdle: isIdle(streaming),
    isStreamingPending: isPending(streaming),
    isStreamingError: isError(streaming),
    isStreaming: streaming.data,
    streamingError: streaming.error,
    isPreviewsIdle: isIdle(previews),
    isPreviewsPending: isPending(previews),
    isPreviewsError: isError(previews),
    isPreviewsSuccess: isSuccess(previews),
    previews: sortedPreviews,
    previewsError: previews.error,
  };
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * ASYNC STATE
 *
 *
 *
 *
 *
 * *************************************************************************/

type AsyncStateArray<T> = Array<
  | {
      id: "idle";
      uuid: string;
      data?: undefined;
      error?: undefined;
    }
  | {
      id: "pending";
      uuid: string;
      data?: undefined;
      error?: undefined;
    }
  | {
      id: "success";
      uuid: string;
      data: T;
      error?: undefined;
    }
  | {
      id: "fetching";
      uuid: string;
      data: T;
      error?: undefined;
    }
  | {
      id: "error";
      uuid: string;
      error: unknown;
      data?: undefined;
    }
>;

type AsyncIdle = {
  id: "idle";
  data?: undefined;
  error?: undefined;
};

type AsyncPending = {
  id: "pending";
  data?: undefined;
  error?: undefined;
};

type AsyncSuccess<T> = {
  id: "success";
  data: T;
  error?: undefined;
};

type AsyncFetching<T> = {
  id: "fetching";
  data: T;
  error?: undefined;
};

type AsyncError = {
  id: "error";
  error: unknown;
  data?: undefined;
};

type AsyncState<T> =
  | AsyncIdle
  | AsyncPending
  | AsyncFetching<T>
  | AsyncSuccess<T>
  | AsyncError;

const isIdle = <T>(state: AsyncState<T>): state is AsyncIdle =>
  state.id === "idle";
const isPending = <T>(state: AsyncState<T>): state is AsyncPending =>
  state.id === "pending";
const isSuccess = <T>(state: AsyncState<T>): state is AsyncSuccess<T> =>
  state.id === "success";
const isFetching = <T>(state: AsyncState<T>): state is AsyncFetching<T> =>
  state.id === "fetching";
const isError = <T>(state: AsyncState<T>): state is AsyncError =>
  state.id === "error";

// We us nullish because we think it's important to distiguish between null,
// undefined, "", 0, and false.
const nullish = (v: unknown): v is null | undefined => {
  return v === null || v === undefined;
};

type Identity<T> = (x: T) => T;
