const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

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

// First apply next-intl, then PWA
module.exports = withPWA(withNextIntl(nextConfig));