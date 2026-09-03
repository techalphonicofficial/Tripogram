/** @type {import('next').NextConfig} */
function getHostname(value) {
  if (!value) return null;

  try {
    return new URL(value).hostname;
  } catch {
    return value.replace(/^https?:\/\//, "").split("/")[0] || null;
  }
}

const imageHosts = [
  process.env.NEXT_PUBLIC_DASHBOARD_HOST,
  process.env.NEXT_PUBLIC_API_URL,
  process.env.NEXT_PUBLIC_MEDIA_PATH,
  "dashboard.tripogram.com",
]
  .map(getHostname)
  .filter(Boolean);

const remotePatterns = [...new Set(imageHosts)].map((hostname) => ({
  protocol: "https",
  hostname,
}));

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
