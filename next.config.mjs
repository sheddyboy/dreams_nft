/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tan-glamorous-whippet-563.mypinata.cloud",
        port: "",
        pathname: "/ipfs/**",
      },
      // If you need to support multiple Pinata gateways or subdomains
      {
        protocol: "https",
        hostname: "*.mypinata.cloud",
        port: "",
        pathname: "/ipfs/**",
      },
      // If you need to support gateway.pinata.cloud
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
        port: "",
        pathname: "/ipfs/**",
      },
    ],
  },
  // Other Next.js config options...
};

export default nextConfig;
