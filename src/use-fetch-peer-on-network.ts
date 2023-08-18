import { useXmtp } from "./use-xmtp";

export const useFetchPeerOnNetwork = ({
  wallet,
}: {
  wallet?: { address: string };
}) => {
  const xmtp = useXmtp({ wallet });

  if (xmtp === null) {
    return null;
  }

  return xmtp.fetchPeerOnNetwork;
};
