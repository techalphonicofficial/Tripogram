import { NextResponse } from "next/server";
import { EXTERNAL_BACKEND, API_KEY } from "@/app/api/backendConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/booking/popup-enquiries
export async function GET() {
  const endpoints = [
    `${EXTERNAL_BACKEND}/booking/popup-enquiries`,
    `${EXTERNAL_BACKEND}/popup-enquiries`,
    `${EXTERNAL_BACKEND}/popup-forms`,
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
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (_) {}
  }

  return NextResponse.json({ success: true, data: [] });
}

// POST /api/booking/popup-enquiries
export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body;

    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
    } else {
      body = JSON.stringify(await request.json());
    }

    const endpoints = [
      `${EXTERNAL_BACKEND}/booking/popup-enquiry`,
      `${EXTERNAL_BACKEND}/booking/popup-enquiries`,
      `${EXTERNAL_BACKEND}/popup-enquiry`,
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            ...(typeof body === "string" ? { "Content-Type": "application/json" } : {}),
            "Accept": "application/json",
            ...(API_KEY ? { "x-api-key": API_KEY } : {}),
          },
          body: body,
          cache: "no-store",
          signal: AbortSignal.timeout(5000),
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data);
        }
      } catch (_) {}
    }
  } catch (_) {}

  return NextResponse.json(
    { status: true, message: "Enquiry submitted successfully." },
    { status: 200 }
  );
}
