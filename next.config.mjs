/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.module.rules.push({
                test: /\.node$/,
                use: "node-loader",
            });
        }

        return config;
    },
};

export default nextConfig;
