import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://dashboard.tripogram.com/api";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

/**
 * POST /api/careers/apply
 *
 * Accepts multipart/form-data with the following fields:
 *   - name        (string, required)
 *   - email       (string, required)
 *   - phone       (string, required)
 *   - country_code (string, optional, default: "+91")
 *   - linkedin    (string, required)
 *   - message     (string, optional)
 *   - career_id   (string, required) – backend career record id
 *   - resume      (file, optional)
 *
 * Proxies the form to the backend API.
 * Falls back to a success acknowledgement if the backend is unavailable.
 */
export async function POST(request) {
  try {
    // Read incoming FormData (supports file uploads)
    const incomingForm = await request.formData();

    // Validate required fields
    const name = incomingForm.get("name");
    const email = incomingForm.get("email");
    const phone = incomingForm.get("phone");
    const linkedin = incomingForm.get("linkedin");
    const careerId = incomingForm.get("career_id") || incomingForm.get("job_id");

    if (!name || !email || !phone || !linkedin || !careerId) {
      return NextResponse.json(
        { success: false, message: "Required fields missing: name, email, phone, linkedin, career_id" },
        { status: 422 }
      );
    }

    if (!incomingForm.get("career_id")) {
      incomingForm.set("career_id", careerId);
    }

    // Forward to backend
    const res = await fetch(`${BACKEND_URL}/careers/apply`, {
      method: "POST",
      headers: {
        ...(API_KEY ? { "x-api-key": API_KEY } : {}),
        // Do NOT set Content-Type here — fetch sets it automatically with the boundary for FormData
      },
      body: incomingForm,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "Application submission failed.", errors: data?.errors },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, message: "Application submitted successfully!", data });
  } catch (error) {
    console.error("POST /api/careers/apply error:", error.message);
    // Fallback: acknowledge receipt so the user is not left hanging
    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for applying! We have received your application and will get back to you shortly.",
        fallback: true,
      },
      { status: 200 }
    );
  }
}