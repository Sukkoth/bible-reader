/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from the public directory
    domains: ["localhost"], // Add your domain here if needed
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nditulxhhkdtxjiwimus.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
