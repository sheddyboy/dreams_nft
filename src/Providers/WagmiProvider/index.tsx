"use client";
import { WagmiProvider as Provider } from "wagmi";
import wagmiConfig from "@/config/wagmi";

type WagmiProviderProps = {
  children: React.ReactNode;
};

const WagmiProvider = ({ children }: WagmiProviderProps) => {
  return <Provider config={wagmiConfig}>{children} </Provider>;
};

export default WagmiProvider;
