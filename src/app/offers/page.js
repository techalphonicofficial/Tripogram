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
  faPiggyBank,
  faTags,
  faHourglassHalf,
  faSyncAlt,
  faPlane
} from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import {
  getOffersHero,
  getOffersCards,
  getOffersTravelSpots,
  getOffersFaqs,
} from "@/services/offersApi";
import { getHomeDestination } from "@/services/destinationApi";
import { trendingPackage } from "@/services/packageApi";
import AvailableTrips from "@/components/TripDetail/AvailableTrips";
import PopularTourSeasonalCard from "@/components/PopularTour/PopularTourSeasonalCard";
import "./Offers.css";

const ICON_MAP = {
  tag: faTags,
  wallet: faWallet,
  percent: faPercent,
  users: faUsers,
  star: faStar,
  gift: faGift,
  piggybank: faPiggyBank,
  hourglass: faHourglassHalf,
  sync: faSyncAlt
};

const FALLBACK_HERO = {
  title: "Exclusive Travel Offers",
  subtitle: "Grab the best deals, limited-time offers and special discounts on your dream destinations. Travel more, spend less!",
  background_image: "/img/hero/hero_bg_1_1.jpg",
};

const FALLBACK_CARDS = [
  { id: 1, title: "Lowest Price, More Savings", icon: "piggybank" },
  { id: 2, title: "Book at just ₹999 only", icon: "tags" },
  { id: 3, title: "Exclusive Limited-Time Offer", icon: "hourglass" },
  { id: 4, title: "Hassle-Free Trip Reschedule", icon: "sync" },
];

const fallbackDestImages = [
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=400",
];

const FALLBACK_FAQS = [
  {
    question: "Can I book the trip before or after the Grand Travel Sale?",
    answer: "No, you cannot book any trip before the Grand Travel Sale starts or after it ends. To avail the slashed sale prices you have to book your preferred trip only during the designated days."
  },
  {
    question: "How can I avail offered trip prices during the Grand Travel Sale?",
    answer: "Offers and discounts are automatically applied to the listed prices on this page. Simply choose your desired package and proceed to checkout — no promo code required!"
  }
];

export default function OffersPage() {
  const [hero, setHero] = useState(null);
  const [cards, setCards] = useState([]);
  const [spots, setSpots] = useState([]);
  const [packages, setPackages] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOffersData() {
      try {
        const results = await Promise.allSettled([
          getOffersHero(),
          getOffersCards(),
          getOffersTravelSpots(),
          getOffersFaqs(),
        ]);

        if (results[0].status === "fulfilled" && results[0].value) {
          setHero(results[0].value);
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

        trendingPackage().then((res) => {
          if (res && res.success && Array.isArray(res.data)) {
            setPackages(res.data.slice(0, 4));
          }
        });
      } finally {
        setLoading(false);
      }
    }

    loadOffersData();
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (loading && !hero) {
    return <main className="offers-page-wrapper min-vh-100" />;
  }

  // Check visibility logic from API
  if (hero && (hero.website_visible === false || hero.is_visible === false)) {
    return (
      <main className="offers-page bg-light py-5 min-vh-100 d-flex align-items-center justify-content-center">
        <div className="container text-center py-5">
          <div className="card border-0 shadow-sm rounded-4 p-5 mx-auto" style={{ maxWidth: "500px" }}>
            <div className="mb-3 text-warning">
              <FontAwesomeIcon icon={faTags} size="3x" style={{ fontSize: "48px" }} />
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
    <main className="offers-page-wrapper">
      {/* 1. Hero Section (Premium Layout with Dynamic Data) */}
      {hero && (
        <section className="offers-hero" style={{ 
          backgroundImage: `linear-gradient(rgba(11, 28, 57, 0.7), rgba(11, 28, 57, 0.9)), url('${hero.background_image || "/img/hero/hero_bg_1_1.jpg"}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="container position-relative" style={{ zIndex: 2 }}>
            <div className="row align-items-center">
              <div className="col-lg-7">
                <nav className="offers-breadcrumb">
                  <Link href="/" className="offers-bread-link">🏠 Home</Link>
                  <span className="offers-bread-sep">&gt;</span>
                  <span className="offers-bread-current">Offers & Sale</span>
                </nav>
                {hero.title && (
                  <h1 className="offers-hero-title" dangerouslySetInnerHTML={{ __html: hero.title }} />
                )}
                {hero.subtitle && <p className="offers-hero-desc">{hero.subtitle}</p>}
              </div>
              <div className="col-lg-5 d-none d-lg-flex justify-content-end position-relative">
                <div className="offers-hero-tagline">
                  <span className="offers-tagline-line1">
                    More Trips <FontAwesomeIcon icon={faPlane} className="offers-plane-icon" />
                  </span>
                  <span className="offers-tagline-line2">More Happiness</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Benefits Section */}
      {cards.length > 0 && (
        <section className="container mb-5 mt-4 mt-lg-5">
          <div className="row g-4 justify-content-center">
            {cards.map((card, i) => {
              const iconProp = ICON_MAP[card.icon] || faTags;
              return (
                <div className="col-12 col-sm-6 col-md-3" key={card.id || i}>
                  <div className="benefit-card">
                    <div className="benefit-icon-wrap">
                      <FontAwesomeIcon icon={iconProp} />
                    </div>
                    <h4>{card.title}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Popular Travel Spots (Available Trips Grid Style) */}
      {spots.length > 0 && (
        <section className="container th-container mb-5 pb-4 border-bottom">
          <h2 className="offers-section-title">Popular Travel Spots</h2>
          <p className="offers-section-subtitle">Handpicked destinations for your next unforgettable journey.</p>
          <AvailableTrips trips={spots} />
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
      {faqs.length > 0 && (
        <section className="container mb-5">
          <h2 className="offers-section-title text-center">Grand Travel Sale FAQs</h2>
          <div className="offers-faq-list mt-5 mx-auto" style={{ maxWidth: '900px' }}>
            {faqs.map((faq, index) => {
              const faqId = faq.id || index;
              return (
                <div 
                  className={`offers-faq-item ${openFaq === faqId ? 'open' : ''}`} 
                  key={faqId}
                >
                  <button 
                    className="offers-faq-question" 
                    onClick={() => toggleFaq(faqId)}
                    aria-expanded={openFaq === faqId}
                  >
                    <span>{faq.question}</span>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`offers-faq-arrow ${openFaq === faqId ? 'rotated' : ''}`} 
                    />
                  </button>
                  <div className={`offers-faq-answer ${openFaq === faqId ? 'expanded' : ''}`}>
                    <div className="offers-faq-answer-inner">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </main>
  );
}
