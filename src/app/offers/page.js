"use client";
<<<<<<< HEAD

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
=======
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPiggyBank, faTags, faHourglassHalf, faSyncAlt, faChevronDown, faPlane } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { getHomeDestination } from "@/services/destinationApi";
import { trendingPackage } from "@/services/packageApi";
import PopularTourSeasonalCard from "@/components/PopularTour/PopularTourSeasonalCard";
import "./Offers.css";

const fallbackDestImages = [
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=400", // India/Taj Mahal style
  "https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&q=80&w=400", // Beach/Maldives
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400", // Mountains
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=400", // Paris/City
  "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80&w=400", // London/Urban
  "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=400", // Desert/Camel
  "https://images.unsplash.com/photo-1506461883276-594c8cb25bc3?auto=format&fit=crop&q=80&w=400", // Forest/Nature
  "https://images.unsplash.com/photo-1496372412473-e8a48b5ceae4?auto=format&fit=crop&q=80&w=400", // Tropical/Bali
];

const faqData = [
  {
    question: "Can I book the trip before or after the Grand Travel Sale?",
    answer: "No, you cannot book any trip before the Grand Travel Sale starts or after it ends. To avail the slashed sale prices you have to book your preferred trip only during the designated days. Though, you can still book the same trip once the Grand Travel Sale is over, but the prices will not be the same and therefore will come back to their original prices."
  },
  {
    question: "How can I avail offered trip prices during the Grand Travel Sale?",
    answer: "Offers and discounts are automatically applied to the listed prices on this page. Simply choose your desired package and proceed to checkout — no promo code required!"
  },
  {
    question: "When do I have to pay the remaining amount of the trip booked during the Grand Travel Sale?",
    answer: "You can reserve your spot by paying a minimal booking amount (e.g., ₹999). The remaining balance is usually due a few weeks before your departure date. Our team will guide you through the payment schedule."
  },
  {
    question: "What if I have to change or modify my trip/date?",
    answer: "We offer hassle-free trip rescheduling for packages booked during this sale! You can change your dates without hefty penalty fees, subject to our modification policy and availability."
  },
  {
    question: "Once I book a trip, how will I receive the confirmation of the payment?",
    answer: "You will immediately receive an email and an SMS confirmation with your booking ID and payment receipt once the transaction is successful. Our support team will also reach out to you shortly after."
  },
  {
    question: "I am a solo traveller, can I join the group trips?",
    answer: "Absolutely! Most of our trips are designed for group travel, and solo travellers are always welcome. You'll be paired with like-minded travellers and will have a fantastic experience."
  },
  {
    question: "I have a few doubts regarding the Grand Travel Sale, how can I get help?",
    answer: "You can reach out to our support team anytime via call, WhatsApp, or email. Our travel experts are always available to help you with any queries regarding the Grand Travel Sale."
  }
];

export default function OffersPage() {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    getHomeDestination().then((res) => {
      if (Array.isArray(res)) setDestinations(res);
    });

    trendingPackage().then((res) => {
      if (res && res.success && Array.isArray(res.data)) {
        setPackages(res.data.slice(0, 4));
      }
    });
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main className="offers-page-wrapper">
      {/* 1. Hero Section */}
      <section className="offers-hero">
        <div className="offers-hero-bg"></div>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <nav className="offers-breadcrumb">
                <Link href="/" className="offers-bread-link">🏠 Home</Link>
                <span className="offers-bread-sep">&gt;</span>
                <span className="offers-bread-current">Offers & Sale</span>
              </nav>
              <h1 className="offers-hero-title">Exclusive Travel <span>Offers</span></h1>
              <p className="offers-hero-desc">Grab the best deals, limited-time offers and special discounts on your dream destinations. Travel more, spend less!</p>
            </div>
            <div className="col-lg-5 d-none d-lg-flex justify-content-end position-relative">
              <div className="offers-hero-tagline">
                <span className="offers-tagline-line1">
                  More Trips <FontAwesomeIcon icon={faPlane} className="offers-plane-icon" />
                </span>
                <span className="offers-tagline-line2">More Happiness</span>
              </div>
            </div>
>>>>>>> 23fc74fff222f566c3946969e96b1df9983f9680
          </div>
        </div>
      </section>

<<<<<<< HEAD
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
=======
      {/* 2. Benefits Section */}
      <section className="container mb-5 mt-4 mt-lg-5">
        <div className="row g-4 justify-content-center">
          <div className="col-12 col-sm-6 col-md-3">
            <div className="benefit-card">
              <div className="benefit-icon-wrap">
                <FontAwesomeIcon icon={faPiggyBank} />
              </div>
              <h4>Lowest Price, More Savings</h4>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="benefit-card">
              <div className="benefit-icon-wrap">
                <FontAwesomeIcon icon={faTags} />
              </div>
              <h4>Book at Just ₹999 only</h4>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="benefit-card">
              <div className="benefit-icon-wrap">
                <FontAwesomeIcon icon={faHourglassHalf} />
              </div>
              <h4>Exclusive Limited-Time Offer</h4>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="benefit-card">
              <div className="benefit-icon-wrap">
                <FontAwesomeIcon icon={faSyncAlt} />
              </div>
              <h4>Hassle-Free Trip Reschedule</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Travel Spots */}
      {destinations.length > 0 && (
        <section className="container mb-5 pb-4 border-bottom">
          <h2 className="offers-section-title">Popular Travel Spots</h2>
          <p className="offers-section-subtitle">Handpicked destinations for your next unforgettable journey.</p>
          <Swiper
            modules={[Autoplay]}
            loop={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            spaceBetween={20}
            slidesPerView={5}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 12 },
              576: { slidesPerView: 3, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
              1400: { slidesPerView: 4, spaceBetween: 30 },
            }}
            className="offer-destination-swiper"
          >
            {destinations.map((dest, i) => (
              <SwiperSlide key={i}>
                <Link href={`/destination/${dest.slug}`} className="offer-dest-card">
                  <div className="offer-dest-img-wrap">
                    <Image 
                      src={dest.image_url || dest.image || fallbackDestImages[i % fallbackDestImages.length]} 
                      alt={dest.name || "Destination"} 
                      width={180} height={180} 
                    />
                  </div>
                  <span className="offer-dest-title">{dest.name}</span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* 4. Best Deals on Popular Packages */}
      {packages.length > 0 && (
        <section className="container mb-5 pb-4 border-bottom">
          <h2 className="offers-section-title">Best Deals on Popular Packages</h2>
          <p className="offers-section-subtitle">Plan your next adventure with our exclusive travel packages and amazing offers.</p>
          <div className="row g-4">
            {packages.map((pkg, i) => (
              <div className="col-12 col-md-6 col-lg-3" key={pkg.id || i}>
                <PopularTourSeasonalCard 
                  data={pkg} 
                  isActive={true} 
                  onRequestCallback={() => {}} 
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. FAQs */}
      <section className="container mb-5">
        <h2 className="offers-section-title text-center">Grand Travel Sale FAQs</h2>
        <div className="offers-faq-list mt-5 mx-auto" style={{ maxWidth: '900px' }}>
          {faqData.map((faq, index) => (
            <div 
              className={`offers-faq-item ${openFaq === index ? 'open' : ''}`} 
              key={index}
            >
              <button 
                className="offers-faq-question" 
                onClick={() => toggleFaq(index)}
                aria-expanded={openFaq === index}
              >
                <span>{faq.question}</span>
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`offers-faq-arrow ${openFaq === index ? 'rotated' : ''}`} 
                />
              </button>
              <div className={`offers-faq-answer ${openFaq === index ? 'expanded' : ''}`}>
                <div className="offers-faq-answer-inner">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
>>>>>>> 23fc74fff222f566c3946969e96b1df9983f9680
