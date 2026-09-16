export function formatImageUrl(imagePath, fallback = "") {
  if (!imagePath || typeof imagePath !== "string") return fallback;
  const trimmed = imagePath.trim();
  if (!trimmed) return fallback;

  // Local static asset paths
  if (
    trimmed.startsWith("/img/") ||
    trimmed.startsWith("img/") ||
    trimmed.startsWith("/images/") ||
    trimmed.startsWith("images/")
  ) {
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }

  // Already a full absolute URL or data URI
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  const mediaBase = process.env.NEXT_PUBLIC_MEDIA_PATH || "http://127.0.0.1/tripo/public/storage/";
  const cleanPath = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;

  if (cleanPath.startsWith("storage/")) {
    const rootUrl = mediaBase.replace(/\/storage\/$/, "/");
    return `${rootUrl}${cleanPath}`;
  }

  return `${mediaBase}${cleanPath}`;
}
