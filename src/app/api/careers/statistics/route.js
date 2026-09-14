import { NextResponse } from "next/server";
import { careerStats } from "@/data/careersData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://dashboard.tripogram.com/api";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/careers/statistics`, {
      headers: { "Content-Type": "application/json", ...(API_KEY ? { "x-api-key": API_KEY } : {}) },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Backend ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (_) {
    // Fallback: strip FontAwesome icon objects, send icon name string
    const fallback = careerStats.map(({ icon, ...rest }) => ({
      ...rest,
      icon: icon?.iconName ?? "users",
    }));
    return NextResponse.json(fallback);
  }
}
