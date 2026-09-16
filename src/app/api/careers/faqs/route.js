import { NextResponse } from "next/server";
import { EXTERNAL_BACKEND, API_KEY } from "@/app/api/backendConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_FAQS = [
  {
    id: 1,
    question: "How do I apply for a job at Tripogram?",
    answer: "You can apply by expanding any open position on our Careers page and filling in the application form.",
  },
  {
    id: 2,
    question: "What is the recruitment process like?",
    answer: "Our recruitment process typically includes a resume review, a virtual interview, and a final discussion with the team lead.",
  },
  {
    id: 3,
    question: "Do you offer remote work options?",
    answer: "Yes, some roles at Tripogram support remote or hybrid working arrangements.",
  },
  {
    id: 4,
    question: "What perks do employees get?",
    answer: "Employees enjoy health insurance, annual trips, a learning budget, flexible hours, team outings, and performance rewards.",
  },
];

export async function GET() {
  try {
    const res = await fetch(`${EXTERNAL_BACKEND}/careers/faqs`, {
      headers: { "Content-Type": "application/json", ...(API_KEY ? { "x-api-key": API_KEY } : {}) },
      cache: "no-store",
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) throw new Error(`Backend ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (_) {
    return NextResponse.json(FALLBACK_FAQS);
  }
}