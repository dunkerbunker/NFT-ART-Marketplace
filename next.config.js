/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['nftartmarketplace.infura-ipfs.io'],
  },
};

module.exports = nextConfig;
