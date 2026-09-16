"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faWallet,
  faPercent,
  faUsers,
  faStar,
  faGift,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  getOffersHero,
  getOffersCards,
  getOffersTravelSpots,
  getOffersFaqs,
} from "@/services/offersApi";

const ICON_MAP = {
  tag: faTag,
  wallet: faWallet,
  percent: faPercent,
  users: faUsers,
  star: faStar,
  gift: faGift,
};

const FALLBACK_HERO = {
  title: "Exclusive Travel Offers",
  subtitle: "Grab the best travel deals & discount vouchers on your favorite destinations.",
  background_image: "/img/hero/hero_bg_1_1.jpg",
};

const FALLBACK_CARDS = [
  { id: 1, title: "Limited Time Savings", icon: "tag" },
  { id: 2, title: "Book at just ₹999 only", icon: "wallet" },
  { id: 3, title: "Exclusive Early Bird Offer", icon: "percent" },
  { id: 4, title: "Unbeatable Group Deals", icon: "users" },
];

const FALLBACK_SPOTS = [
  { id: 1, heading: "Himachal", slug: "himachal", image: "/img/hero/hero_1_1.jpg" },
  { id: 2, heading: "Uttarakhand", slug: "uttarakhand", image: "/img/hero/hero_2_1.jpg" },
  { id: 3, heading: "Rajasthan", slug: "rajasthan", image: "/img/hero/hero_3_1.jpg" },
  { id: 4, heading: "Meghalaya", slug: "meghalaya", image: "/img/hero/hero_6_1.jpg" },
  { id: 5, heading: "Kashmir", slug: "kashmir", image: "/img/hero/hero_8_1.jpg" },
  { id: 6, heading: "Kerala", slug: "kerala", image: "/img/hero/hero_9_1.jpg" },
];

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

export default function OffersPage() {
  const [hero, setHero] = useState(FALLBACK_HERO);
  const [cards, setCards] = useState(FALLBACK_CARDS);
  const [spots, setSpots] = useState(FALLBACK_SPOTS);
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);
  const [openFaq, setOpenFaq] = useState(1);

  useEffect(() => {
    async function loadOffersData() {
      const results = await Promise.allSettled([
        getOffersHero(),
        getOffersCards(),
        getOffersTravelSpots(),
        getOffersFaqs(),
      ]);

      if (results[0].status === "fulfilled" && results[0].value) {
        setHero((prev) => ({ ...prev, ...results[0].value }));
      }
      if (results[1].status === "fulfilled" && Array.isArray(results[1].value) && results[1].value.length > 0) {
        setCards(results[1].value);
      }
      if (results[2].status === "fulfilled" && Array.isArray(results[2].value) && results[2].value.length > 0) {
        setSpots(results[2].value);
      }
      if (results[3].status === "fulfilled" && Array.isArray(results[3].value) && results[3].value.length > 0) {
        setFaqs(results[3].value);
      }
    }

    loadOffersData();
  }, []);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  if (hero && (hero.website_visible === false || hero.is_visible === false)) {
    return (
      <main className="offers-page bg-light py-5 min-vh-100 d-flex align-items-center justify-content-center">
        <div className="container text-center py-5">
          <div className="card border-0 shadow-sm rounded-4 p-5 mx-auto" style={{ maxWidth: "500px" }}>
            <div className="mb-3 text-warning">
              <FontAwesomeIcon icon={faTag} size="3x" style={{ fontSize: "48px" }} />
            </div>
            <h2 className="fw-bold mb-2 text-dark">No Active Offers</h2>
            <p className="text-muted mb-4" style={{ fontSize: "15px" }}>
              There are currently no active offers or sales available. Please check back later or explore our travel packages.
            </p>
            <div>
              <Link href="/" className="btn btn-primary px-4 py-2 rounded-pill">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="offers-page bg-light pb-5">
      {/* 🔹 HERO BANNER (GET /api/offers/hero) */}
      <section
        className="offers-hero text-center text-white py-5 position-relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(5, 152, 204, 0.75), rgba(11, 28, 57, 0.85)), url('${hero.background_image || "/img/hero/hero_bg_1_1.jpg"}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          paddingTop: "100px",
          paddingBottom: "100px",
        }}
      >
        <div className="container py-4">
          <h1 className="fw-bold mb-3 display-5 text-white">{hero.title || FALLBACK_HERO.title}</h1>
          <p className="lead mx-auto mb-0" style={{ maxWidth: "680px", color: "rgba(255,255,255,0.9)" }}>
            {hero.subtitle || FALLBACK_HERO.subtitle}
          </p>
        </div>
      </section>

      {/* 🔹 FEATURE CARDS BADGES (GET /api/offers/cards) */}
      <section className="offers-features-sec py-4" style={{ marginTop: "-30px" }}>
        <div className="container">
          <div className="row g-3 justify-content-center">
            {cards.map((card, idx) => {
              const iconProp = ICON_MAP[card.icon] || ICON_MAP[FALLBACK_CARDS[idx % 4].icon] || faTag;
              return (
                <div className="col-6 col-md-3" key={card.id || idx}>
                  <div className="card border-0 shadow-sm rounded-4 text-center p-3 h-100 feature-offer-card">
                    <div className="icon-wrap mx-auto mb-2 text-primary">
                      <FontAwesomeIcon icon={iconProp} size="lg" />
                    </div>
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "14px" }}>
                      {card.title}
                    </h6>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🔹 POPULAR TRAVEL SPOTS (GET /api/offers/travel-spots) */}
      <section className="offers-spots-sec py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark mb-1">Popular Travel Spots</h2>
            <p className="text-muted" style={{ fontSize: "14px" }}>
              Handpicked destinations for your next unforgettable journey.
            </p>
          </div>

          <div className="row g-3 justify-content-center">
            {spots.map((spot, idx) => (
              <div className="col-6 col-sm-4 col-md-2" key={spot.id || idx}>
                <Link href={spot.url || `/${spot.slug}`} className="text-decoration-none">
                  <div className="card border-0 rounded-4 overflow-hidden shadow-sm spot-card h-100">
                    <div className="position-relative" style={{ height: "140px" }}>
                      <Image
                        src={spot.image || FALLBACK_SPOTS[idx % 6].image}
                        alt={spot.heading || "Destination"}
                        fill
                        sizes="(max-width: 768px) 50vw, 16vw"
                        style={{ objectFit: "cover" }}
                        className="spot-img"
                      />
                    </div>
                    <div className="card-body p-2 text-center bg-white">
                      <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "13px" }}>
                        {spot.heading}
                      </h6>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 GRAND TRAVEL SALE FAQS (GET /api/offers/faqs) */}
      <section className="offers-faq-sec py-5 bg-white">
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark mb-2">Grand Travel Sale FAQs</h2>
          </div>

          <div className="accordion custom-offers-accordion">
            {faqs.map((faq, idx) => {
              const faqId = faq.id || idx + 1;
              const isOpen = openFaq === faqId;
              return (
                <div
                  className={`card mb-3 border-0 rounded-3 shadow-xs ${
                    isOpen ? "active-faq-card" : ""
                  }`}
                  key={faqId}
                  style={{ border: "1px solid #e2e8f0" }}
                >
                  <div
                    className="card-header bg-white border-0 p-3 d-flex justify-content-between align-items-center cursor-pointer"
                    onClick={() => toggleFaq(faqId)}
                    style={{ cursor: "pointer" }}
                  >
                    <h6 className={`mb-0 fw-bold ${isOpen ? "text-primary" : "text-dark"}`} style={{ fontSize: "15px" }}>
                      {faq.question}
                    </h6>
                    <span className="ms-2 text-muted" style={{ fontSize: "12px" }}>
                      <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
                    </span>
                  </div>

                  {isOpen && (
                    <div className="card-body pt-0 px-3 pb-3 text-muted" style={{ fontSize: "13px", lineHeight: "1.6" }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style jsx>{`
        .feature-offer-card {
          background: #ffffff;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .feature-offer-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(5, 152, 204, 0.12) !important;
        }
        .spot-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .spot-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12) !important;
        }
        .active-faq-card {
          border-left: 3px solid #0598cc !important;
        }
      `}</style>
    </main>
  );
}