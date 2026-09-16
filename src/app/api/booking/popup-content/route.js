import { NextResponse } from "next/server";
import { EXTERNAL_BACKEND, API_KEY } from "@/app/api/backendConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_POPUP_CONTENT = {
  status: "1",
  title: "Plan your Next Trip",
  slides: [
    {
      image: "/img/hero/hero_1_1.jpg",
      title: "Book a Group Trip",
      caption: "Make memories with friends, family, or your special someone.",
    },
    {
      image: "/img/hero/hero_2_1.jpg",
      title: "Travel Your Way",
      caption: "Solo adventures, couple escapes, and unforgettable group journeys.",
    },
    {
      image: "/img/hero/hero_3_1.jpg",
      title: "Your Next Adventure",
      caption: "Handpicked experiences, made simple by Tripogram.",
    },
  ],
};

// GET /api/booking/popup-content
export async function GET() {
  const endpoints = [
    `${EXTERNAL_BACKEND}/page/6/popup`,
    `${EXTERNAL_BACKEND}/booking/popup-content`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(API_KEY ? { "x-api-key": API_KEY } : {}),
        },
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && (data.slides || data.section || data.status)) {
          return NextResponse.json(data);
        }
      }
    } catch (_) {}
  }

  // Fallback to local default popup content
  return NextResponse.json(FALLBACK_POPUP_CONTENT);
}