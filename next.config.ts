import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/projects/:slug",
        destination: "/work/:slug",
        permanent: true,
      },
      {
        source: "/work/automated-data-extraction",
        destination: "/work/automated-data-extraction-system",
        permanent: true,
      },
      {
        source: "/work/cricchat",
        destination: "/work/cricchat-cricket-chatbot",
        permanent: true,
      },
      {
        source: "/work/ssf-rpa",
        destination: "/work/social-security-fund-rpa",
        permanent: true,
      },
      {
        source: "/work/bank-churn-prediction",
        destination: "/work/bank-customer-churn-prediction",
        permanent: true,
      },
      {
        source: "/work/udemy-data-analysis",
        destination: "/work/udemy-courses-data-analysis",
        permanent: true,
      },
    ];
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
};

export default nextConfig;
