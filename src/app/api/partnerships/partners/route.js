import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://dashboard.tripogram.com/api";
const API_KEY     = process.env.NEXT_PUBLIC_API_KEY  || "";

const FALLBACK_PARTNERS = [
  { id: 1, logo: "/img/brand/startup-india.svg", name: "Startup India",        label: "DPIIT Recognized Startup" },
  { id: 2, logo: "/img/brand/msme.svg",          name: "MSME",                 label: "Government Registration" },
  { id: 3, logo: "/img/brand/makemytrip.svg",    name: "MakeMyTrip",           label: "Preferred Travel Partner" },
  { id: 4, logo: "/img/brand/indigo.svg",        name: "IndiGo",               label: "Preferred Airline Partner" },
  { id: 5, logo: "/img/brand/gst.svg",           name: "Goods & Services Tax", label: "GST Registered Company" },
  { id: 6, logo: "/img/brand/iato.svg",          name: "IATO",                 label: "Indian Association of Tour Operators" },
];

// GET /api/partnerships/partners — Sirf partners list
export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/partnerships/partners`, {
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
    return NextResponse.json(FALLBACK_PARTNERS);
  }
}
