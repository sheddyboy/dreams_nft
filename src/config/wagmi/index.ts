import { http, createConfig } from "wagmi";
import { sepolia,baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const config = createConfig({
  chains: [baseSepolia],
  connectors: [injected()],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: true,
});

export default config;
