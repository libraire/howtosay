/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '158f2f6d.telegraph-image-bya.pages.dev',
        port: '',
        pathname: '/file/**',
      },
      {
        protocol: 'https',
        hostname: 'images.bytegush.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/hts/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_HOST}/hts/api/v1/:path*`
      },
      {
        source: '/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_HOST}/auth/:path*`
      }
    ]
  }
};

export default nextConfig;
