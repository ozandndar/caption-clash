/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'image.prntscr.com',
      'via.placeholder.com',
      'i.imgur.com',
      'lh3.googleusercontent.com'
      // Add any other domains you need
    ],
  },
}

module.exports = nextConfig 