import { Wallet } from "@ethersproject/wallet";

const BURNER_KEY = "relay-network-burner-key";

export const useBurner = () => {
  const key = localStorage.getItem(BURNER_KEY);

  const burner = (() => {
    try {
      if (key === null) {
        return Wallet.createRandom();
      } else {
        return new Wallet(key);
      }
    } catch (e) {
      return Wallet.createRandom();
    }
  })();

  localStorage.setItem(BURNER_KEY, burner.privateKey);

  return burner;
};
