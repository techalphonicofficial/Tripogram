import { NextResponse } from "next/server";
import { perksBenefits } from "@/data/careersData";
import { EXTERNAL_BACKEND, API_KEY } from "@/app/api/backendConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const res = await fetch(`${EXTERNAL_BACKEND}/careers/benefits`, {
      headers: { "Content-Type": "application/json", ...(API_KEY ? { "x-api-key": API_KEY } : {}) },
      cache: "no-store",
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) throw new Error(`Backend ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (_) {
    const fallback = perksBenefits.map(({ icon, ...rest }) => ({
      ...rest,
      icon: icon?.iconName ?? "heart",
    }));
    return NextResponse.json(fallback);
  }
}