import { NextResponse } from "next/server";
import { EXTERNAL_BACKEND, API_KEY } from "@/app/api/backendConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK = {
  sub_title:   "TRUSTED BY & RECOGNIZED BY",
  title:       "Partnership & Recognition",
  description: "Proud to be associated with trusted travel, government and industry partners.",
};

// GET /api/partnerships/section — Sirf section heading data
export async function GET() {
  try {
    const res = await fetch(`${EXTERNAL_BACKEND}/partnerships/section`, {
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { "x-api-key": API_KEY } : {}),
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Backend ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (_) {
    return NextResponse.json(FALLBACK);
  }
}