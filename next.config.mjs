/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['email-origin-chain', 'email-forward-parser', 're2', 'mailparser', 'any-date-parser', 'mailsplit'],
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push({
                're2': 'commonjs re2',
            });
        }
        return config;
    },
};

export default nextConfig;
