import { NextResponse } from "next/server";
import { careerStats, whyJoinUs, openPositions, perksBenefits } from "@/data/careersData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://dashboard.tripogram.com/api";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

async function proxyGet(path) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(API_KEY ? { "x-api-key": API_KEY } : {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Backend ${res.status}`);
  return res.json();
}

export async function GET() {
  try {
    const data = await proxyGet("/careers");
    return NextResponse.json(data);
  } catch (_) {
    return NextResponse.json({
      statistics: careerStats.map(({ icon, ...r }) => ({ ...r, icon: icon?.iconName ?? "users" })),
      why_join_us: whyJoinUs.map(({ icon, ...r }) => ({ ...r, icon: icon?.iconName ?? "star" })),
      jobs: openPositions,
      benefits: perksBenefits.map(({ icon, ...r }) => ({ ...r, icon: icon?.iconName ?? "heart" })),
    });
  }
}
