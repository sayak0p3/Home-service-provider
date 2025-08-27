/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["lh3.googleusercontent.com", "media.graphassets.com"], // Added media.graphassets.com
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ap-south-1.graphassets.com",
      },
      {
        protocol: "https",
        hostname: "media.graphassets.com",
      },
    ],
  },
};

export default nextConfig;


  