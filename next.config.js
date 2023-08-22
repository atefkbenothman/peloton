/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.mapbox.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "image.mux.com",
        port: "",
        pathname: "/**"
      }
    ]
  }
}

module.exports = nextConfig
