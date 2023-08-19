import { useEffect, useMemo, useState } from "react";
import * as Lib from "./lib";
import { useClient } from "./use-client";
import { useConversationStream } from "./use-conversation-stream";
import { useSendMessage } from "./use-send-message";
import { useFetchPeerOnNetwork } from "./use-fetch-peer-on-network";
import { useBurner } from "./use-burner";
import { useFetchMessages } from "./use-fetch-messages";

export const useConversation = ({
  wallet,
  conversation,
}: {
  wallet?: Lib.Signer;
  conversation?: Lib.Conversation;
}) => {
  /* ***************************************************************************
   * Client
   * **************************************************************************/

  const client = useClient({ wallet });

  /* ***************************************************************************
   * Stream
   * **************************************************************************/

  const stream = useConversationStream({ conversation, wallet });

  /* ***************************************************************************
   * Burner
   * **************************************************************************/

  const burner = useBurner();

  /* ***************************************************************************
   * fetchUserOnNetwork
   * **************************************************************************/

  const fetchUserOnNetwork = useFetchPeerOnNetwork({ wallet: burner });
  const [fetchUserOnNetworkState, setFetchUserOnNetworkState] =
    useState<Lib.AsyncState<boolean> | null>(null);

  useEffect(() => {
    if (fetchUserOnNetwork === null) {
      return;
    }

    if (typeof wallet !== "object") {
      return;
    }

    (async () => {
      try {
        setFetchUserOnNetworkState({ id: "pending" });
        const user = await fetchUserOnNetwork({ peerAddress: wallet.address });
        if (user.status === 200) {
          setFetchUserOnNetworkState({ id: "success", data: user.data });
        } else {
          setFetchUserOnNetworkState({ id: "error", error: undefined });
        }
      } catch {
        setFetchUserOnNetworkState({ id: "error", error: undefined });
      }
    })();
  }, [fetchUserOnNetwork === null, typeof wallet !== "object"]);

  /* ***************************************************************************
   * Enable
   * **************************************************************************/

  const [_enableState, setEnableState] =
    useState<Lib.AsyncState<undefined> | null>(null);

  const enable = useMemo(() => {
    if (client === null) {
      return null;
    }

    return async () => {
      try {
        setEnableState({ id: "pending" });
        const enabled = await client.start();
        if (enabled.status === 200) {
          setEnableState({ id: "success", data: undefined });
        } else {
          setEnableState({ id: "error", error: undefined });
        }
      } catch {
        setEnableState({ id: "error", error: undefined });
      }
    };
  }, [client === null]);

  const enableState: typeof _enableState = (() => {
    if (client === null) {
      return null;
    }

    if (_enableState === null) {
      return { id: "idle" };
    }

    return _enableState;
  })();

  /* ****************************************************************************
   * Login
   * ***************************************************************************/

  const [_loginState, setLoginState] =
    useState<Lib.AsyncState<undefined> | null>(null);

  const login = useMemo(() => {
    if (client === null) {
      return null;
    }

    return async () => {
      try {
        setLoginState({ id: "pending" });
        const loggedIn = await client.start();
        if (loggedIn.status === 200) {
          setLoginState({ id: "success", data: undefined });
        } else {
          setLoginState({ id: "error", error: undefined });
        }
      } catch {
        setLoginState({ id: "error", error: undefined });
      }
    };
  }, [client === null]);

  const loginState: typeof _loginState = (() => {
    if (client === null) {
      return null;
    }

    if (_loginState === null) {
      return { id: "idle" };
    }

    return _loginState;
  })();

  /* ***************************************************************************
   * Fetch
   * **************************************************************************/

  const fetchMessages = useFetchMessages({ wallet });
  const [_fetchState, setFetchState] = useState<Lib.AsyncState<
    Lib.Message[]
  > | null>(null);

  const fetch = useMemo(() => {
    if (typeof conversation !== "object") {
      return null;
    }

    if (typeof wallet !== "object") {
      return null;
    }

    if (fetchMessages === null) {
      return null;
    }

    return async () => {
      try {
        setFetchState({ id: "pending" });
        const response = await fetchMessages(conversation, {});

        if (response.status === 200) {
          setFetchState({ id: "success", data: response.data });
        } else {
          setFetchState({ id: "error", error: undefined });
        }
      } catch {
        setFetchState({ id: "error", error: undefined });
      }
    };
  }, [
    typeof conversation !== "object",
    typeof wallet !== "object",
    fetchMessages === null,
  ]);

  const fetchState: typeof _fetchState = (() => {
    if (typeof conversation !== "object") {
      return null;
    }

    if (typeof wallet !== "object") {
      return null;
    }

    if (_fetchState === null) {
      return { id: "idle" };
    }

    return _fetchState;
  })();

  /* ***************************************************************************
   * Send
   * **************************************************************************/

  const sendMessage = useSendMessage({ wallet });
  const [_sendMessageState, setSendMessageState] =
    useState<Lib.AsyncState<Lib.Message> | null>(null);

  const send = useMemo(() => {
    if (typeof conversation !== "object") {
      return null;
    }

    if (typeof wallet !== "object") {
      return null;
    }

    if (sendMessage === null) {
      return null;
    }

    return async (content: string) => {
      try {
        setSendMessageState({ id: "pending" });
        const response = await sendMessage({
          conversation,
          content,
        });

        if (response.status === 200) {
          setSendMessageState({ id: "success", data: response.data });
          return response.data;
        } else {
          setSendMessageState({ id: "error", error: undefined });
          throw new Error();
        }
      } catch {
        setSendMessageState({ id: "error", error: undefined });
        throw new Error();
      }
    };
  }, [
    typeof conversation !== "object",
    typeof wallet !== "object",
    sendMessage === null,
  ]);

  const sendMessageState: typeof _sendMessageState = (() => {
    if (typeof conversation !== "object") {
      return null;
    }

    if (typeof wallet !== "object") {
      return null;
    }

    if (_sendMessageState === null) {
      return { id: "idle" };
    }

    return _sendMessageState;
  })();

  /* ***************************************************************************
   * Return
   * **************************************************************************/

  if (client === null) {
    return null;
  }

  if (typeof wallet !== "object") {
    return null;
  }

  if (typeof conversation !== "object") {
    return null;
  }

  if (stream === null) {
    return null;
  }

  if (stream.start === null) {
    throw new Error("stream.start is null even though stream is not null");
  }

  if (enableState === null) {
    return null;
  }

  if (enable === null) {
    throw new Error("enable is null even though enableState is not null");
  }

  if (loginState === null) {
    return null;
  }

  if (login === null) {
    throw new Error("login is null even though loginState is not null");
  }

  if (fetchState === null) {
    return null;
  }

  if (fetch === null) {
    throw new Error("fetch is null even though fetchState is not null");
  }

  if (sendMessageState === null) {
    return null;
  }

  if (send === null) {
    throw new Error("send is null even though sendMessageState is not null");
  }

  return {
    enable,
    isEnableIdle: enableState?.id === "idle",
    isEnablePending: enableState?.id === "pending",
    isEnableSuccess: enableState?.id === "success",
    isEnableError: enableState?.id === "error",
    enableError: enableState?.error,
    login,
    isLoginIdle: loginState?.id === "idle",
    isLoginPending: loginState?.id === "pending",
    isLoginSuccess: loginState?.id === "success",
    isLoginError: loginState?.id === "error",
    loginError: loginState?.error,
    fetch,
    isFetchIdle: fetchState?.id === "idle",
    isFetchPending: fetchState?.id === "pending",
    isFetchSuccess: fetchState?.id === "success",
    isFetchError: fetchState?.id === "error",
    fetchError: fetchState?.error,
    messages: fetchState?.data ?? [],
    stream: stream.start,
    isStreamIdle: stream.isIdle,
    isStreamPending: stream.isPending,
    isStreamSuccess: stream.isSuccess,
    isStreamError: stream.isError,
    streamError: stream.error,
    send,
    isSendIdle: sendMessageState?.id === "idle",
    isSendPending: sendMessageState?.id === "pending",
    isSendSuccess: sendMessageState?.id === "success",
    isSendError: sendMessageState?.id === "error",
    sendError: sendMessageState?.error,
  };
};
