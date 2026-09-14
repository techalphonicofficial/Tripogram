/** @type {import('next').NextConfig} */
function getImageOrigin(value) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return { protocol: url.protocol.slice(0, -1), hostname: url.hostname };
  } catch {
    const hostname = value.replace(/^https?:\/\//, "").split("/")[0] || null;
    return hostname ? { protocol: "https", hostname } : null;
  }
}

const imageHosts = [
  process.env.NEXT_PUBLIC_DASHBOARD_HOST,
  process.env.NEXT_PUBLIC_API_URL,
  process.env.NEXT_PUBLIC_MEDIA_PATH,
  "dashboard.tripogram.com",
]
  .map(getImageOrigin)
  .filter(Boolean);

const remotePatterns = imageHosts.filter(
  (origin, index, origins) => origins.findIndex((item) => item.protocol === origin.protocol && item.hostname === origin.hostname) === index
);

const nextConfig = {
  devIndicators: false,
  output: "standalone",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns,
  },
};

export default nextConfig;
