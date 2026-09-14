import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://dashboard.tripogram.com/api";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

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
    const res = await fetch(`${BACKEND_URL}/careers/hero`, {
      headers: { "Content-Type": "application/json", ...(API_KEY ? { "x-api-key": API_KEY } : {}) },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Backend ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (_) {
    return NextResponse.json(FALLBACK);
  }
}
