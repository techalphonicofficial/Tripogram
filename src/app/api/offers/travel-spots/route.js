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
    `${EXTERNAL_BACKEND}/destinations/home`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(API_KEY ? { "x-api-key": API_KEY } : {}),
        },
        cache: "no-store",
        signal: AbortSignal.timeout(3500),
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
              item.package?.banner ||
              item.destination?.image ||
              item.thumbnail;

            let imgUrl = FALLBACK_SPOTS[index % 6].image;
            if (imgSource) {
              imgUrl = imgSource.startsWith("http")
                ? imgSource
                : `${mediaBase.replace(/\/+$/, "")}/${imgSource.replace(/^\//, "")}`;
            }

            return {
              id: item.id || index + 1,
              heading: item.title || item.heading || item.name || FALLBACK_SPOTS[index % 6].heading,
              slug: extractedSlug,
              url: targetUrl,
              image: imgUrl,
            };
          });
          return NextResponse.json(formatted);
        }
      }
    } catch (_) {}
  }

  return NextResponse.json(FALLBACK_SPOTS);
}