/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['re2', 'mailparser', 'email-forward-parser'],
    typescript: {
        ignoreBuildErrors: true,
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push({
                're2': 'commonjs re2',
            });
        }
        return config;
    },
    turbopack: {}
};

export default nextConfig;
