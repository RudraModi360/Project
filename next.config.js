const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  scope: '/',
  sw: 'service-worker.js'
});

module.exports = withPWA({
  reactStrictMode: true,
  i18n: {
    locales: ["en", "fr", "es"], // Add the languages you support
    defaultLocale: "en", // Set a default language
  },
  swcMinify: true,
  images: {
    domains: [
      "wsrv.nl",
      "blobimageshikshafinder.blob.core.windows.net",
      "unsplash.com",
      "images.unsplash.com",
      "source.unsplash",
    ],
  },
  experimental: {},
});
