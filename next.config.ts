import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  /* No remote patterns allowed for madamambition.com */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
    ],
  },
};

export default nextConfig;
