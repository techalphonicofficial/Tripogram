export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { API_KEY, API_URL } from "@/services/config";

function joinUrl(baseUrl, path = "") {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  return cleanPath ? `${cleanBaseUrl}/${cleanPath}` : cleanBaseUrl;
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tripogramclub.com";
  const apiHeaders = {
    "Content-Type": "application/json",
    ...(API_KEY ? { "x-api-key": API_KEY } : {}),
  };
  const today = new Date().toISOString().split("T")[0];

  // Static pages
  const staticUrls = [
    { url: joinUrl(baseUrl), lastmod: today, changefreq: "weekly", priority: "1.0" },
    { url: joinUrl(baseUrl, "about"), lastmod: today, changefreq: "weekly", priority: "0.8" },
    { url: joinUrl(baseUrl, "contact"), lastmod: today, changefreq: "weekly", priority: "0.8" },
    { url: joinUrl(baseUrl, "blog"), lastmod: today, changefreq: "weekly", priority: "0.8" },
  ];

  try {
    // Fetch both APIs in parallel
    const [sitemapRes, packagesRes] = await Promise.allSettled([
      fetch(`${API_URL}/sitemap-xml`, {
        headers: apiHeaders,
        cache: "no-store"
      }),
      fetch(`${API_URL}/packages`, {
        headers: apiHeaders,
        cache: "no-store"
      }),
    ]);

    // --- sitemap-xml API (blogs, destinations, trip categories, packages) ---
    let sitemapUrls = [];
    if (sitemapRes.status === "fulfilled" && sitemapRes.value.ok) {
      const data = await sitemapRes.value.json();
      sitemapUrls = data.map((page) => ({
        key: page.url,
        url: joinUrl(baseUrl, page.url),
        lastmod: page.lastmod ? page.lastmod.split("T")[0] : today,
        changefreq: page.changefreq || "weekly",
        priority: page.priority || "0.8",
      }));
    }

    // --- /packages API — direct package list (ensures nothing is missed) ---
    let packageUrls = [];
    if (packagesRes.status === "fulfilled" && packagesRes.value.ok) {
      const packages = await packagesRes.value.json();
      packageUrls = packages
        .filter((pkg) => pkg.slug)
        .map((pkg) => ({
          key: pkg.slug,
          url: joinUrl(baseUrl, pkg.slug),
          lastmod: pkg.updated_at
            ? pkg.updated_at.split("T")[0]
            : pkg.created_at
              ? pkg.created_at.split("T")[0]
              : today,
          changefreq: "weekly",
          priority: "0.8",
        }));
    }

    // Merge — add packages that are NOT already in sitemapUrls (dedup by slug key)
    const sitemapKeys = new Set(sitemapUrls.map((u) => u.key));
    const extraPackages = packageUrls.filter((p) => !sitemapKeys.has(p.key));
    const allDynamicUrls = [...sitemapUrls, ...extraPackages];

    const allUrls = [...staticUrls, ...allDynamicUrls];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
        .map(
          (u) => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
        )
        .join("\n")}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-store",
      },
    });

  } catch (error) {
    console.error("Sitemap generation error:", error);

    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls
        .map(
          (u) => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
        )
        .join("\n")}
</urlset>`;

    return new Response(fallbackSitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-cache",
      },
    });
  }
}
