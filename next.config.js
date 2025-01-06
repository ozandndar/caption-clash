const withPWA = require('next-pwa')({
  dest: 'public',
  disable: false,
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
    ],
  },
};

module.exports = withPWA(nextConfig); 