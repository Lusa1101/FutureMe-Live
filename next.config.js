/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  //output: 'export',        // keep static export
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      { module: /require-in-the-middle/ },
      { module: /@genkit-ai/ },
    ];
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        '@genkit-ai/core',
        '@genkit-ai/ai',
        '@genkit-ai/googleai',
        '@genkit-ai/flow'
      );
    }
    return config;
  },
};

module.exports = nextConfig;

module.exports = nextConfig;
