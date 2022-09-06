/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['nftartmarketplace.infura-ipfs.io', 'ipfs.infura.io'],
  },
};

module.exports = nextConfig;
