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
    `${EXTERNAL_BACKEND}/booking/popup-content`,
    `${EXTERNAL_BACKEND}/page/6/popup`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(API_KEY ? { "x-api-key": API_KEY } : {}),
        },
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        const raw = await res.json();
        const content = raw?.data || raw;
        const slides = content?.slides || raw?.slides || [];
        const setting = content?.setting || {};

        if (Array.isArray(slides) && slides.length > 0) {
          const formattedSlides = slides.map((s) => ({
            id: s.id,
            image: s.image || s.image_path || s.photo || "/img/hero/hero_1_1.jpg",
            title: s.title || s.heading || "Your Next Adventure",
            caption: s.description || s.subtext || s.caption || "",
            subtext: s.description || s.subtext || s.caption || "",
          }));

          return NextResponse.json({
            success: true,
            status: "1",
            title: setting.form_heading || content.title || "Plan your Next Trip",
            slides: formattedSlides,
            data: {
              setting,
              slides: formattedSlides,
            },
          });
        }
      }
    } catch (_) {}
  }

  // Fallback to local default popup content
  return NextResponse.json(FALLBACK_POPUP_CONTENT);
}