import { NextResponse } from "next/server";
import { EXTERNAL_BACKEND, API_KEY } from "@/app/api/backendConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK = {
  eyebrow: "Why You'll Love It Here",
  heading: "More Than a Workplace, It's a Community",
  heading_highlight: "Community",
};

export async function GET() {
  try {
    const res = await fetch(`${EXTERNAL_BACKEND}/careers/why-join-us`, {
      headers: { "Content-Type": "application/json", ...(API_KEY ? { "x-api-key": API_KEY } : {}) },
      cache: "no-store",
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) throw new Error(`Backend ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (_) {
    return NextResponse.json(FALLBACK);
  }
}
