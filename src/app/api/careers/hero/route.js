import { NextResponse } from "next/server";
import { EXTERNAL_BACKEND, API_KEY } from "@/app/api/backendConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK = {
  eyebrow: "Careers",
  heading_line1: "New Places.",
  heading_line2: "New Challenges.",
  heading_line3: "Limitless Growth.",
  description:
    "At Tripogram, we're a passionate team of explorers, dreamers and doers building meaningful travel experiences for people across India and beyond.\n\nJoin us and be part of a journey that matters.",
  cta_label: "Explore Open Positions",
  image_main: "/img/tour/tour-1_1.jpg",
  image_secondary: "/img/tour/tour-1_3.jpg",
};

export async function GET() {
  try {
    const endpoints = [
      `${EXTERNAL_BACKEND}/careers/hero`,
      `${EXTERNAL_BACKEND}/career-hero-sections`,
      `${EXTERNAL_BACKEND}/career-hero`,
      `${EXTERNAL_BACKEND}/career_hero_sections`,
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
          signal: AbortSignal.timeout(3500),
        });

        if (res.ok) {
          const raw = await res.json();
          const item = Array.isArray(raw)
            ? raw[0]
            : raw?.data
            ? Array.isArray(raw.data)
              ? raw.data[0]
              : raw.data
            : raw;

          if (item && typeof item === "object" && !item.message) {
            return NextResponse.json({
              id: item.id || 1,
              eyebrow: item.label || item.eyebrow || FALLBACK.eyebrow,
              heading_line1: item.heading_1 || item.heading_line_1 || item.heading_line1 || item.heading1 || FALLBACK.heading_line1,
              heading_line2: item.heading_2 || item.heading_line_2 || item.heading_line2 || item.heading2 || FALLBACK.heading_line2,
              heading_line3: item.heading_3 || item.heading_line_3 || item.heading_line3 || item.heading3 || FALLBACK.heading_line3,
              description: item.description || FALLBACK.description,
              cta_label: item.cta_label || item.button_text || FALLBACK.cta_label,
              image_main: item.main_image || item.image_main || item.image || item.photo || item.bg_image || FALLBACK.image_main,
              image_secondary: item.secondary_image || item.image_secondary || item.sub_image || FALLBACK.image_secondary,
            });
          }
        }
      } catch (_) {}
    }
  } catch (_) {}

  return NextResponse.json(FALLBACK);
}
