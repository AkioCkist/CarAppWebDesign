/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/logo/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/png',
          },
        ],
      },
      {
        source: '/hero/:path*.webp',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/webp',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
