/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        return config;
    },
    experimental: {
        outputFileTracing: true,
    },
    webSocketTimeout: 30000,
    server: {
        host: '0.0.0.0',
        port: 3000,
    },
};

export default nextConfig;