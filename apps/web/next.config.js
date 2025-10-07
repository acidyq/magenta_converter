const REPO_NAME = 'magenta_converter';
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@magenta-converter/shared'],
  images: {
    unoptimized: true,
  },
};

if (isGithubActions) {
  nextConfig.basePath = `/${REPO_NAME}`;
  nextConfig.assetPrefix = `/${REPO_NAME}/`;
}

if (!isProd) {
  nextConfig.rewrites = async () => [
    {
      source: '/api/:path*',
      destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/:path*`,
    },
  ];
}

module.exports = nextConfig;
