import type { NextConfig } from "next";

// Photos uploaded from the admin are served from Supabase Storage.
const storage = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
  : null;

const nextConfig: NextConfig = {
  // The Space Canvas configurator is a static page in public/space-canvas/.
  async rewrites() {
    return [{ source: "/space-canvas", destination: "/space-canvas/index.html" }];
  },
  images: {
    remotePatterns: storage
      ? [
          {
            protocol: storage.protocol.replace(":", "") as "http" | "https",
            hostname: storage.hostname,
            port: storage.port,
            // Self-hosted Supabase can sit under a path (https://veloraone.co/supabase).
            pathname: `${storage.pathname.replace(/\/$/, "")}/storage/v1/object/public/**`,
          },
        ]
      : [],
    // The local Supabase runs on 127.0.0.1, which the optimiser refuses by default.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;
