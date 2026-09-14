/** @type {import('next').NextConfig} */
<<<<<<< HEAD
function getImageOrigin(value) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return { protocol: url.protocol.slice(0, -1), hostname: url.hostname };
  } catch {
    const hostname = value.replace(/^https?:\/\//, "").split("/")[0] || null;
    return hostname ? { protocol: "https", hostname } : null;
=======
function getHostname(value) {
  if (!value) return null;

  try {
    return new URL(value).hostname;
  } catch {
    return value.replace(/^https?:\/\//, "").split("/")[0] || null;
>>>>>>> 294c810c152a6484dbf379600ab573546fe3fd31
  }
}

const imageHosts = [
  process.env.NEXT_PUBLIC_DASHBOARD_HOST,
  process.env.NEXT_PUBLIC_API_URL,
  process.env.NEXT_PUBLIC_MEDIA_PATH,
  "dashboard.tripogram.com",
]
<<<<<<< HEAD
  .map(getImageOrigin)
  .filter(Boolean);

const remotePatterns = imageHosts.filter(
  (origin, index, origins) => origins.findIndex((item) => item.protocol === origin.protocol && item.hostname === origin.hostname) === index
);
=======
  .map(getHostname)
  .filter(Boolean);

const remotePatterns = [...new Set(imageHosts)].map((hostname) => ({
  protocol: "https",
  hostname,
}));
>>>>>>> 294c810c152a6484dbf379600ab573546fe3fd31

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
