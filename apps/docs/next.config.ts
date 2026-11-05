import type { NextConfig } from "next";

// A static export: CloudFront serves the files and redirects `/` to `/ui-foundation`.
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
