/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['re2', 'mailparser'],
    typescript: {
        ignoreBuildErrors: true,
    },
    turbopack: {}
};

export default nextConfig;
