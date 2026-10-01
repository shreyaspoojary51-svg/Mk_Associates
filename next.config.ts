import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: process.cwd(),
  serverExternalPackages: ["@react-pdf/renderer", "pdfkit"],
  outputFileTracingIncludes: {
    "/api/proposal-pdf": [
      "./node_modules/**/pdfkit/js/standard-fonts/**/*",
      "./public/fonts/**/*",
    ],
    "/configure": [
      "./node_modules/**/pdfkit/js/standard-fonts/**/*",
      "./public/fonts/**/*",
    ],
    "/estimator": [
      "./node_modules/**/pdfkit/js/standard-fonts/**/*",
      "./public/fonts/**/*",
    ],
  },
  experimental: {
    cpus: 2,
    webpackMemoryOptimizations: true,
    serverActions: { bodySizeLimit: "12mb" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/configurator",
        destination: "/configure",
        permanent: true,
      },
      {
        source: "/locations/bandra",
        destination: "/locations/bandra-west",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
