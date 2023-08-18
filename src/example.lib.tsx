import { ReactNode } from "react";
import { cn } from "./lib";
import { useAccount, useWalletClient } from "wagmi";

export const Section = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col mb-8">{children}</div>;
};

export const SectionHeader = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return <h1 className={`text-2xl font-bold mb-6 ${className}`}>{children}</h1>;
};

export const SectionLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <a
      href={href}
      className={`text-blue-500 mb-4 hover:underline ${className}`}
    >
      {children}
    </a>
  );
};

export const SectionDescription = ({ children }: { children: ReactNode }) => {
  return <p className="text-lg mb-2">{children}</p>;
};

export const SubSectionHeader = ({ children }: { children: ReactNode }) => {
  return <h2 className="text-xl font-bold mb-4">{children}</h2>;
};

export const StepHeader = ({ children }: { children: ReactNode }) => {
  return <h3 className="text-lg font-bold mb-2">{children}</h3>;
};

export const Instruction = ({ children }: { children: ReactNode }) => {
  return <p>{children}</p>;
};

export const PrimaryTextInput = ({
  placeholder,
  onChange,
  value,
}: {
  placeholder: string;
  onChange: (v: string | null) => void;
  value: string | null;
}) => {
  return (
    <input
      className="w-80 bg-gray-100 rounded-md p-2 mt-4"
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      value={value || ""}
    />
  );
};

export const PrimaryButton = ({
  inactiveText,
  idleText,
  pendingText,
  successText,
  errorText,
  onClickIdle,
  status,
}: {
  inactiveText?: string;
  idleText: string;
  pendingText: string;
  successText?: string;
  errorText: string;
  onClickIdle: () => void;
  onClickError?: () => void;
  status: "inactive" | "idle" | "pending" | "success" | "error";
}) => {
  return (
    <button
      className={cn({
        "font-bold py-2 px-4 mb-6 text-white rounded": true,
        "bg-gray-500": status === "inactive",
        "bg-blue-500 hover:bg-blue-700 cursor-pointer": status === "idle",
        "bg-blue-500 cursor-progress": status === "pending",
        "bg-green-500": status === "success",
        "bg-red-500": status === "error",
      })}
      onClick={() => {
        if (status !== "idle") {
          return undefined;
        } else {
          onClickIdle();
        }
      }}
      disabled={status !== "idle"}
    >
      {(() => {
        if (status === "error") return errorText;
        if (status === "success") return successText;
        if (status === "pending") return pendingText;
        if (status === "inactive") return inactiveText;
        return idleText;
      })()}
    </button>
  );
};

export const useSigner = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  /* This feels really stupid, there has to be an easier way. Ultimately the
   * problem is that we're using Wagmi -> Viem whereas XMTP expects an Ethers ->
   * Signer. */
  return (() => {
    if (
      walletClient === undefined ||
      walletClient === null ||
      typeof address !== "string"
    ) {
      return undefined;
    } else {
      return {
        address,
        getAddress: async () => address,
        signMessage: async (message: string) => {
          return walletClient.signMessage({
            account: address,
            message,
          });
        },
      };
    }
  })();
};
