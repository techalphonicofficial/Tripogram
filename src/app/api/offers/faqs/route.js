import { NextResponse } from "next/server";
import { EXTERNAL_BACKEND, API_KEY } from "@/app/api/backendConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_FAQS = [
  {
    id: 1,
    question: "How do I get the offer code for the Grand Travel Sale?",
    answer:
      "All tour travel deals & offers on the Grand Travel Sale are automatic. You do not need to enter any code during checkout/booking. Though you can still book the same trip once the sale is over, our site gives you the maximum value and maximum saving during the Sale.",
  },
  {
    id: 2,
    question: "How can I avail offered trip price during the Grand Travel Sale?",
    answer:
      "Simply select your desired destination, choose your travel dates, and click 'Book Now'. The discounted price is automatically applied to your booking during the Grand Travel Sale.",
  },
  {
    id: 3,
    question: "When do I have to pay the remaining amount of the trip booked during the Grand Travel Sale?",
    answer:
      "You only pay a nominal token amount of ₹999 to lock your seat during the sale. The remaining balance can be paid up to 7 days before your departure date.",
  },
  {
    id: 4,
    question: "What if I have to change or modify my trip later?",
    answer:
      "We offer 1-time free date modification on all bookings made during the Grand Travel Sale up to 15 days before your trip.",
  },
  {
    id: 5,
    question: "What status of the format is the confirmation ticket sent?",
    answer:
      "You will receive an instant digital voucher and detailed PDF itinerary via WhatsApp & Email as soon as your token booking is completed.",
  },
  {
    id: 6,
    question: "Can I book multiple slots with a group trip?",
    answer:
      "Yes! You can select multiple seats for your friends & family under a single booking and avail extra group discounts automatically.",
  },
  {
    id: 7,
    question: "I have a query regarding the Grand Travel Sale, how can I get help?",
    answer:
      "Our dedicated travel support team is available 24/7. You can reach out to us via call, WhatsApp, or by filling out the enquiry form on our site.",
  },
];

// GET /api/offers/faqs
export async function GET() {
  const endpoints = [
    `${EXTERNAL_BACKEND}/offer-faqs`,
    `${EXTERNAL_BACKEND}/offers/faqs`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(API_KEY ? { "x-api-key": API_KEY } : {}),
        },
        cache: "no-store",
        signal: AbortSignal.timeout(3500),
      });

      if (res.ok) {
        const raw = await res.json();
        const data = raw?.data || raw;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.faqs)
          ? data.faqs
          : null;

        if (Array.isArray(list) && list.length > 0) {
          const formatted = list.map((item, idx) => ({
            id: item.id || idx + 1,
            question: item.question || item.title || FALLBACK_FAQS[idx % 7].question,
            answer: item.answer || item.description || FALLBACK_FAQS[idx % 7].answer,
          }));
          return NextResponse.json(formatted);
        }
      }
    } catch (_) {}
  }

  return NextResponse.json(FALLBACK_FAQS);
}