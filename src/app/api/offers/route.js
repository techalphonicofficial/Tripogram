import { NextResponse } from "next/server";
import { EXTERNAL_BACKEND, API_KEY } from "@/app/api/backendConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_OFFERS = {
  hero: {
    title: "Exclusive Travel Offers",
    subtitle: "Grab the best travel deals & discount vouchers on your favorite destinations.",
    background_image: "/img/hero/hero_bg_1_1.jpg",
  },
  cards: [
    { id: 1, title: "Limited Time Savings", icon: "tag" },
    { id: 2, title: "Book at just ₹999 only", icon: "wallet" },
    { id: 3, title: "Exclusive Early Bird Offer", icon: "percent" },
    { id: 4, title: "Unbeatable Group Deals", icon: "users" },
  ],
  travel_spots: [
    { id: 1, heading: "Himachal", slug: "himachal", image: "/img/hero/hero_1_1.jpg" },
    { id: 2, heading: "Uttarakhand", slug: "uttarakhand", image: "/img/hero/hero_2_1.jpg" },
    { id: 3, heading: "Rajasthan", slug: "rajasthan", image: "/img/hero/hero_3_1.jpg" },
    { id: 4, heading: "Meghalaya", slug: "meghalaya", image: "/img/hero/hero_6_1.jpg" },
    { id: 5, heading: "Kashmir", slug: "kashmir", image: "/img/hero/hero_8_1.jpg" },
    { id: 6, heading: "Kerala", slug: "kerala", image: "/img/hero/hero_9_1.jpg" },
  ],
  faqs: [
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
  ],
};

// GET /api/offers
export async function GET() {
  try {
    const res = await fetch(`${EXTERNAL_BACKEND}/offers`, {
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { "x-api-key": API_KEY } : {}),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(3500),
    });

    if (res.ok) {
      const data = await res.json();
      if (data) {
        return NextResponse.json(data);
      }
    }
  } catch (_) {}

  return NextResponse.json(FALLBACK_OFFERS);
}