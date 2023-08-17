import { useStreamMessages } from "./use-stream-messages";
import * as Ex from "./example.lib";

export const UseStreamMessages = () => {
  const wallet = Ex.useSigner();
  const stream = useStreamMessages({ wallet });

  return (
    <Ex.Section>
      <div id="useStreamMessages" className="flex items-center">
        <Ex.SectionHeader className="mr-auto">
          useStreamMessages
        </Ex.SectionHeader>
        <Ex.SectionLink
          className="mr-4"
          href="https://github.com/relay-network/receiver/src/use-stream-messages-example.tsx"
        >
          example source
        </Ex.SectionLink>
        <Ex.SectionLink href="https://github.com/relay-network/receiver/src/use-stream-messages.ts">
          hook source
        </Ex.SectionLink>
      </div>
      <Ex.SectionDescription>
        Now that you've created a wallet and started the XMTP client, you can
        start streaming messages (If you haven't already, please step through
        the useStartClient
        <Ex.SectionLink href="#useStartClient">
          {" "}
          walkthrough{" "}
        </Ex.SectionLink>{" "}
        above, then continue).
      </Ex.SectionDescription>
      <Ex.SectionDescription>
        With useStreamMessages you can start, stop, and listen to the XMTP
        client's global message stream. Every message sent to the client's XMTP
        identity will pass through this stream.
      </Ex.SectionDescription>
      <Ex.PrimaryButton
        inactiveText="Inactive"
        idleText="Start Stream"
        pendingText="Starting..."
        errorText="Error starting stream"
        successText="Stream started"
        onClickIdle={() => {
          if (stream.start === null) {
            throw new Error("Client start is null even though it's idle");
          } else {
            stream.start();
          }
        }}
        status={(() => {
          if (stream.isInactive) return "inactive";
          if (stream.isError) return "error";
          if (stream.isSuccess) return "success";
          if (stream.isPending) return "pending";
          if (stream.isIdle) return "idle";
          throw new Error("Unhandled stream state");
        })()}
      />
      <Ex.SectionDescription>
        Now that you've started a stream, you can listen to it for messages. The
        following button will add a listener to the stream. When a message is
        received, it will be logged to the developer console.
      </Ex.SectionDescription>
      <Ex.PrimaryButton
        inactiveText="Can't listen to stream"
        idleText="Listen to Stream"
        pendingText="Starting listener..."
        successText="Listening to stream"
        errorText="Error listening to stream"
        onClickIdle={() => {
          if (stream.listen === null) {
            throw new Error("Listen is null even though it's success");
          } else {
            stream.listen((message) => {
              console.log(
                "Relay Receiver Tutorial, Message Received",
                message.content
              );
            });
          }
        }}
        status={(() => {
          if (stream.isInactive) return "inactive";
          if (stream.isError) return "error";
          if (stream.isSuccess) return "idle";
          if (stream.isPending) return "inactive";
          if (stream.isIdle) return "inactive";
          throw new Error("Unhandled stream state");
        })()}
      />
      <Ex.SectionDescription>
        You've started the stream and added a listener but, unless you happen to
        be 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045, you probably won't see
        any messages. In the next section you'll create another client and start
        sending messages. For a more "realistic" experience, you could head to{" "}
        <Ex.SectionLink href="https://xmtp.chat">xmtp.chat</Ex.SectionLink>,
        login with a different address, and send yourself some messages.
      </Ex.SectionDescription>
    </Ex.Section>
  );
};
