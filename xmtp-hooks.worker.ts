import * as Comlink from "comlink";
import * as Lib from "./xmtp-hooks.lib";
import * as Sdk from "@xmtp/xmtp-js";

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * Worker State
 *
 *
 *
 *
 *
 * *************************************************************************/

const WORKER_STATE: {
  client: {
    client: Sdk.Client;
    env: "production";
    export: string;
  } | null;
  messagesStream: MessageStream | null;
  conversationsStream: ConversationStream | null;
  messageStreams: Record<string, MessageStream>;
} = {
  client: null,
  messagesStream: null,
  conversationsStream: null,
  messageStreams: {},
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * Exposed Actions
 *
 *
 *
 *
 *
 * *************************************************************************/

const test = async (fn: () => null) => {
  return fn();
};

const startClient: Lib.Xmtp["startClient"] = async (wallet, opts) => {
  if (WORKER_STATE.client !== null) {
    throw new Error(Lib.ErrorCodes.CLIENT_ALREADY_EXISTS);
  } else {
    const finalOpts = Lib.zClientOptions
      .transform((val) => {
        return {
          ...val,
          privateKeyOverride: (() => {
            if (val.privateKeyOverride === undefined) {
              return undefined;
            } else {
              return Buffer.from(val.privateKeyOverride, "base64");
            }
          })(),
        };
      })
      .parse(opts);

    const keys = await (async () => {
      if (wallet === null) {
        if (!(finalOpts.privateKeyOverride instanceof Uint8Array)) {
          throw new Error(Lib.ErrorCodes.BAD_ARGUMENTS);
        } else {
          return finalOpts.privateKeyOverride;
        }
      } else {
        return await Sdk.Client.getKeys(wallet, finalOpts);
      }
    })();

    const xmtpClient = await Sdk.Client.create(null, {
      ...finalOpts,
      privateKeyOverride: keys,
    });
    WORKER_STATE.client = {
      client: xmtpClient,
      env: "production",
      export: Buffer.from(keys).toString("base64"),
    };
    return {
      address: xmtpClient.address,
      env: "production",
      export: Buffer.from(keys).toString("base64"),
    };
  }
};

const stopClient: Lib.Xmtp["stopClient"] = async () => {
  getClientOrThrow();
  WORKER_STATE.client = null;
  return true;
};

const fetchClient: Lib.Xmtp["fetchClient"] = async ({ opts }) => {
  return {
    address: getClientOrThrow().address,
    env: getEnvOrThrow(),
    export: (() => {
      if (!opts?.includeExport) {
        return undefined;
      } else {
        return getExportOrThrow();
      }
    })(),
  };
};

const fetchMessages: Lib.Xmtp["fetchMessages"] = async ({
  conversation,
  opts,
}) => {
  const client = getClientOrThrow();
  const convo = await client.conversations.newConversation(
    conversation.peerAddress,
    conversation.context
  );
  const messages = await convo.messages({
    ...opts,
    direction: (() => {
      if (opts?.direction === "ascending") {
        return Sdk.SortDirection.SORT_DIRECTION_ASCENDING;
      } else {
        return Sdk.SortDirection.SORT_DIRECTION_DESCENDING;
      }
    })(),
  });
  return messages.map((message) => Lib.zMessage.parse(message));
};

const fetchConversations: Lib.Xmtp["fetchConversations"] = async () => {
  const client = getClientOrThrow();
  const conversations = await client.conversations.list();
  return conversations.map((c) => Lib.zConversation.parse(c));
};

const fetchPeerOnNetwork: Lib.Xmtp["fetchPeerOnNetwork"] = async ({
  peerAddress,
}) => {
  const client = getClientOrThrow();
  return client.canMessage(peerAddress);
};

const sendMessage: Lib.Xmtp["sendMessage"] = async ({
  conversation,
  content,
}) => {
  const client = getClientOrThrow();
  const convo = await client.conversations.newConversation(
    conversation.peerAddress,
    conversation.context
  );
  const sent = await convo.send(content);
  return Lib.zMessage.parse(sent);
};

const startStreamingMessages: Lib.Xmtp["startStreamingMessages"] = async ({
  conversation,
}) => {
  const client = getClientOrThrow();
  const key = Lib.uniqueConversationKey(conversation);
  const preexisting = WORKER_STATE.messageStreams[key];
  if (preexisting !== undefined) {
    throw new Error(Lib.ErrorCodes.STREAM_ALREADY_EXISTS);
  } else {
    const convo = await client.conversations.newConversation(
      conversation.peerAddress,
      conversation.context
    );
    const stream = await convo.streamMessages();
    WORKER_STATE.messageStreams[key] = new MessageStream(stream);
    return true;
  }
};

const stopStreamingMessages: Lib.Xmtp["stopStreamingMessages"] = async ({
  conversation,
}) => {
  getClientOrThrow();
  const key = Lib.uniqueConversationKey(conversation);
  const preexisting = WORKER_STATE.messageStreams[key];
  if (preexisting === undefined) {
    throw new Error(Lib.ErrorCodes.STREAM_NOT_FOUND);
  } else {
    preexisting.stop();
  }
};

const listenToStreamingMessages: Lib.Xmtp["listenToStreamingMessages"] = async (
  conversation,
  handler
) => {
  getClientOrThrow();
  const key = Lib.uniqueConversationKey(conversation);
  const preexisting = WORKER_STATE.messageStreams[key];
  if (preexisting === undefined) {
    throw new Error(Lib.ErrorCodes.STREAM_NOT_FOUND);
  } else {
    return preexisting.addHandler(handler);
  }
};

const startStreamingConversations: Lib.Xmtp["startStreamingConversations"] =
  async () => {
    const client = getClientOrThrow();
    const preexisting = WORKER_STATE.conversationsStream;
    if (preexisting !== null) {
      throw new Error(Lib.ErrorCodes.STREAM_ALREADY_EXISTS);
    } else {
      const stream = await client.conversations.stream();
      WORKER_STATE.conversationsStream = new ConversationStream(stream);
      return true;
    }
  };

const stopStreamingConversations: Lib.Xmtp["stopStreamingConversations"] =
  async () => {
    getClientOrThrow();
    const preexisting = WORKER_STATE.conversationsStream;
    if (preexisting === null) {
      throw new Error(Lib.ErrorCodes.STREAM_NOT_FOUND);
    } else {
      preexisting.stop();
    }
  };

const listenToStreamingConversations: Lib.Xmtp["listenToStreamingConversations"] =
  async (handler) => {
    getClientOrThrow();
    const preexisting = WORKER_STATE.conversationsStream;
    if (preexisting === null) {
      throw new Error(Lib.ErrorCodes.STREAM_NOT_FOUND);
    } else {
      return preexisting.addHandler(handler);
    }
  };

const startStreamingAllMessages: Lib.Xmtp["startStreamingAllMessages"] =
  async () => {
    const client = getClientOrThrow();
    if (WORKER_STATE.messagesStream !== null) {
      throw new Error(Lib.ErrorCodes.STREAM_ALREADY_EXISTS);
    } else {
      const stream = await client.conversations.streamAllMessages();
      WORKER_STATE.messagesStream = new MessageStream(stream);
      return true;
    }
  };

const stopStreamingAllMessages: Lib.Xmtp["stopStreamingAllMessages"] =
  async () => {
    const preexisting = WORKER_STATE.messagesStream;
    if (preexisting === null) {
      throw new Error(Lib.ErrorCodes.STREAM_NOT_FOUND);
    } else {
      preexisting.stop();
    }
  };

const listenToStreamingAllMessages: Lib.Xmtp["listenToStreamingAllMessages"] =
  async (handler) => {
    const preexisting = WORKER_STATE.messagesStream;
    if (preexisting === null) {
      throw new Error(Lib.ErrorCodes.STREAM_NOT_FOUND);
    } else {
      return preexisting.addHandler(handler);
    }
  };

const getClientOrThrow = (): Sdk.Client => {
  if (WORKER_STATE.client === null) {
    throw new Error(Lib.ErrorCodes.CLIENT_NOT_FOUND);
  } else {
    return WORKER_STATE.client.client;
  }
};

const getEnvOrThrow = (): "production" => {
  if (WORKER_STATE.client === null) {
    throw new Error(Lib.ErrorCodes.CLIENT_NOT_FOUND);
  } else {
    return WORKER_STATE.client.env;
  }
};

const getExportOrThrow = (): string => {
  if (WORKER_STATE.client === null) {
    throw new Error(Lib.ErrorCodes.CLIENT_NOT_FOUND);
  } else {
    return WORKER_STATE.client.export;
  }
};

Comlink.expose({
  startClient,
  stopClient,
  fetchClient,
  fetchMessages,
  fetchConversations,
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
  test,
});

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * Helpers
 *
 *
 *
 *
 *
 * *************************************************************************/

class SerializedStream<P, S> {
  private handlers: Record<string, (s: S) => unknown> = {};

  public constructor(
    private stream: Sdk.Stream<P> | AsyncGenerator<P, unknown, unknown>,
    private serializer: (p: P) => S
  ) {
    this.start();
  }

  private async start() {
    for await (const p of this.stream) {
      for (const handler of Object.values(this.handlers)) {
        handler(this.serializer(p));
      }
    }
  }

  public async stop() {
    return this.stream.return(true);
  }

  public addHandler(handler: (s: S) => unknown) {
    const key = this.buildKey();
    this.handlers[key] = handler;
    return key;
  }

  public removeHandler(key: string) {
    if (this.handlers[key] === undefined) {
      return null;
    } else {
      delete this.handlers[key];
      return key;
    }
  }

  public buildKey() {
    return `${Math.random()}${Math.random()}${Math.random()}${Math.random()}`;
  }
}

class MessageStream extends SerializedStream<Sdk.DecodedMessage, Lib.Message> {
  public constructor(
    stream:
      | Sdk.Stream<Sdk.DecodedMessage>
      | AsyncGenerator<Sdk.DecodedMessage, unknown, unknown>
  ) {
    super(stream, (message: Sdk.DecodedMessage) => Lib.zMessage.parse(message));
  }
}

class ConversationStream extends SerializedStream<
  Sdk.Conversation,
  Lib.Conversation
> {
  public constructor(
    stream:
      | Sdk.Stream<Sdk.Conversation>
      | AsyncGenerator<Sdk.Conversation, unknown, unknown>
  ) {
    super(stream, (c) => Lib.zConversation.parse(c));
  }
}
