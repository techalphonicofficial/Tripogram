import { NextResponse } from "next/server";
import { EXTERNAL_BACKEND, API_KEY } from "@/app/api/backendConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_HERO = {
  is_visible: true,
  website_visible: true,
  navbar_text: "Offers",
  title: "Exclusive Travel Offers",
  subtitle: "Grab the best travel deals & discount vouchers on your favorite destinations.",
  background_image: "/img/hero/hero_bg_1_1.jpg",
};

// GET /api/offers/hero
export async function GET() {
  const endpoints = [
    `${EXTERNAL_BACKEND}/offer-hero-sections`,
    `${EXTERNAL_BACKEND}/offers/hero`,
    `${EXTERNAL_BACKEND}/offer-hero`,
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
        const heroObj = data?.hero || (data && typeof data === "object" && !data.hero ? data : null);

        if (heroObj && typeof heroObj === "object") {
          const isVisible =
            data?.is_visible !== undefined
              ? Boolean(data.is_visible)
              : data?.show_offers !== undefined
              ? Boolean(data.show_offers)
              : heroObj?.is_visible !== undefined
              ? Boolean(heroObj.is_visible)
              : true;

          const bgImg = heroObj.background_image || heroObj.bg_image || heroObj.image || data?.background_image;
          const mediaBase = process.env.NEXT_PUBLIC_MEDIA_PATH || "http://127.0.0.1/tripo/public/storage/";

          let formattedBg = FALLBACK_HERO.background_image;
          if (bgImg) {
            formattedBg = bgImg.startsWith("http")
              ? bgImg
              : `${mediaBase.replace(/\/+$/, "")}/${bgImg.replace(/^\//, "")}`;
          }

          return NextResponse.json({
            id: heroObj.id || 1,
            is_visible: isVisible,
            website_visible: isVisible,
            navbar_text: heroObj.navbar_text || data?.navbar_text || "Offers",
            title: heroObj.heading || heroObj.title || FALLBACK_HERO.title,
            subtitle: heroObj.description || heroObj.subtitle || heroObj.sub_text || FALLBACK_HERO.subtitle,
            background_image: formattedBg,
          });
        }
      }
    } catch (_) {}
  }

  return NextResponse.json(FALLBACK_HERO);
}