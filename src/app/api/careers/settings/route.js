import { NextResponse } from "next/server";
import { EXTERNAL_BACKEND, API_KEY } from "@/app/api/backendConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK = {
  contact_email: "hr@tripogram.com",
  apply_email: "hr@tripogram.com",
  social_links: {
    linkedin: "https://www.linkedin.com/company/tripogram",
    instagram: "https://www.instagram.com/tripogram",
  },
  meta_title: "Careers at Tripogram | Explore Opportunities With Us",
  meta_description:
    "Join Tripogram and build meaningful travel experiences. Explore career opportunities across sales, operations, marketing, HR and more.",
};

export async function GET() {
  try {
    const res = await fetch(`${EXTERNAL_BACKEND}/careers/settings`, {
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