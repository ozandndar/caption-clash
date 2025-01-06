const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'image.prntscr.com',
      'via.placeholder.com',
      'i.imgur.com',
      'lh3.googleusercontent.com'
      // Add any other domains you need
    ],
  },
};

module.exports = withPWA(nextConfig); 