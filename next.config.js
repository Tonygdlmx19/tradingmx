/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias['canvas'] = false;
    config.resolve.alias['canvg'] = false;
    return config;
  },
};

module.exports = nextConfig;
