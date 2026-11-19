import { NextResponse } from "next/server";
import { EXTERNAL_BACKEND, API_KEY } from "@/app/api/backendConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_SPOTS = [
  { id: 1, heading: "Himachal", slug: "himachal", url: "/himachal", image: "/img/hero/hero_1_1.jpg" },
  { id: 2, heading: "Uttarakhand", slug: "uttarakhand", url: "/uttarakhand", image: "/img/hero/hero_2_1.jpg" },
  { id: 3, heading: "Rajasthan", slug: "rajasthan", url: "/rajasthan", image: "/img/hero/hero_3_1.jpg" },
  { id: 4, heading: "Meghalaya", slug: "meghalaya", url: "/meghalaya", image: "/img/hero/hero_6_1.jpg" },
  { id: 5, heading: "Kashmir", slug: "kashmir", url: "/kashmir", image: "/img/hero/hero_8_1.jpg" },
  { id: 6, heading: "Kerala", slug: "kerala", url: "/kerala", image: "/img/hero/hero_9_1.jpg" },
];

// GET /api/offers/travel-spots
export async function GET() {
  const endpoints = [
    `${EXTERNAL_BACKEND}/offer-travel-spots`,
    `${EXTERNAL_BACKEND}/offers/travel-spots`,
  ];

  const headers = {
    "Content-Type": "application/json",
    ...(API_KEY ? { "x-api-key": API_KEY } : {}),
  };

  let packagesBySlug = new Map();
  let packagesById = new Map();
  try {
    const pkgRes = await fetch(`${EXTERNAL_BACKEND}/packages`, {
      headers,
      cache: "no-store",
      // [LOCAL DEV]: Increased timeout from 3500ms to 25000ms for single-threaded local PHP server
      signal: AbortSignal.timeout(25000),
    });
    if (pkgRes.ok) {
      const pkgRaw = await pkgRes.json();
      const pkgList = Array.isArray(pkgRaw) ? pkgRaw : pkgRaw?.data || [];
      if (Array.isArray(pkgList)) {
        pkgList.forEach((p) => {
          if (p?.slug) packagesBySlug.set(p.slug, p);
          if (p?.id) packagesById.set(Number(p.id), p);
        });
      }
    }
  } catch (_) {}

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers,
        cache: "no-store",
        // [LOCAL DEV]: Increased timeout from 3500ms to 25000ms for single-threaded local PHP server
        signal: AbortSignal.timeout(25000),
      });

      if (res.ok) {
        const raw = await res.json();
        const data = raw?.data || raw;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.spots)
          ? data.spots
          : Array.isArray(data?.destinations)
          ? data.destinations
          : null;

        if (Array.isArray(list) && list.length > 0) {
          const mediaBase = process.env.NEXT_PUBLIC_MEDIA_PATH || "http://127.0.0.1/tripo/public/storage/";
          const formatted = list.slice(0, 12).map((item, index) => {
            let extractedSlug = FALLBACK_SPOTS[index % 6].slug;
            if (item.slug) {
              extractedSlug = item.slug;
            } else if (item.package?.slug) {
              extractedSlug = item.package.slug;
            } else if (item.url) {
              const parts = item.url.replace(/\/+$/, "").split("/");
              extractedSlug = parts[parts.length - 1] || extractedSlug;
            }

            const fullPkg =
              packagesBySlug.get(extractedSlug) ||
              (item.package?.id ? packagesById.get(Number(item.package.id)) : null) ||
              null;

            let targetUrl = `/${extractedSlug}`;
            if (item.url) {
              if (item.url.startsWith("http://") || item.url.startsWith("https://")) {
                targetUrl = item.url;
              } else if (item.url.startsWith("/packages/")) {
                targetUrl = `/${item.url.replace("/packages/", "")}`;
              } else if (item.url.startsWith("/destinations/")) {
                targetUrl = `/${item.url.replace("/destinations/", "")}`;
              } else if (item.url.startsWith("/trips/")) {
                targetUrl = item.url;
              } else {
                targetUrl = item.url.startsWith("/") ? item.url : `/${item.url}`;
              }
            }

            let imgSource =
              item.image ||
              item.package?.thumbnail ||
              fullPkg?.thumbnail ||
              item.package?.banner ||
              fullPkg?.banner ||
              item.destination?.image ||
              item.thumbnail;

            let imgUrl = FALLBACK_SPOTS[index % 6].image;
            if (imgSource) {
              imgUrl = imgSource.startsWith("http")
                ? imgSource
                : `${mediaBase.replace(/\/+$/, "")}/${imgSource.replace(/^\//, "")}`;
            }

            const title =
              item.title ||
              item.package?.title ||
              fullPkg?.title ||
              item.heading ||
              item.name ||
              FALLBACK_SPOTS[index % 6].heading;

            return {
              id: fullPkg?.id || item.package?.id || item.id || index + 1,
              title,
              heading: title,
              slug: extractedSlug,
              url: targetUrl,
              image: imgUrl,
              thumbnail: imgUrl,
              banner: item.package?.banner || fullPkg?.banner || imgUrl,
              pickup: fullPkg?.pickup || item.package?.pickup || item.pickup || "Delhi",
              drop: fullPkg?.drop || item.package?.drop || item.drop || "Delhi",
              duration: item.package?.duration || fullPkg?.duration || item.duration || "",
              starting_price:
                item.package?.starting_price || fullPkg?.starting_price || item.starting_price || 0,
              package_dates:
                fullPkg?.package_dates || item.package?.package_dates || item.package_dates || [],
              show_book_no_button:
                fullPkg?.show_book_no_button ?? item.package?.show_book_no_button ?? null,
            };
          });
          return NextResponse.json(formatted);
        }
      }
    } catch (_) {}
  }

  return NextResponse.json([]);
}