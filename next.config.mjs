/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/reader",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
