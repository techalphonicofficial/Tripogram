import { NextResponse } from "next/server";
import { EXTERNAL_BACKEND, API_KEY } from "@/app/api/backendConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_CARDS = [
  { id: 1, title: "Limited Time Savings", icon: "tag" },
  { id: 2, title: "Book at just ₹999 only", icon: "wallet" },
  { id: 3, title: "Exclusive Early Bird Offer", icon: "percent" },
  { id: 4, title: "Unbeatable Group Deals", icon: "users" },
];

// GET /api/offers/cards
export async function GET() {
  const endpoints = [
    `${EXTERNAL_BACKEND}/offer-cards`,
    `${EXTERNAL_BACKEND}/offers/cards`,
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
        const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : null;
        if (Array.isArray(list) && list.length > 0) {
          const mediaBase = process.env.NEXT_PUBLIC_MEDIA_PATH || "http://127.0.0.1/tripo/public/storage/";
          const formatted = list.map((item, idx) => ({
            id: item.id || idx + 1,
            title: item.title || item.name || FALLBACK_CARDS[idx % 4].title,
            description: item.description || "",
            icon: item.icon || FALLBACK_CARDS[idx % 4].icon,
            icon_image: item.icon_image
              ? (item.icon_image.startsWith("http")
                  ? item.icon_image
                  : `${mediaBase.replace(/\/+$/, "")}/${item.icon_image.replace(/^\//, "")}`)
              : null,
          }));
          return NextResponse.json(formatted);
        }
      }
    } catch (_) {}
  }

  return NextResponse.json(FALLBACK_CARDS);
}