/** @type {import('next').NextConfig} */
const nextConfig = {


    reactStrictMode:false,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '158f2f6d.telegraph-image-bya.pages.dev',
            port: '',
            pathname: '/file/**',
          },
        ],
    }
};

export default nextConfig;
