"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPiggyBank, faTags, faHourglassHalf, faSyncAlt, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { getHomeDestination } from "@/services/destinationApi";
import { trendingPackage } from "@/services/packageApi";
import PopularTourSeasonalCard from "@/components/PopularTour/PopularTourSeasonalCard";
import "./Offers.css";

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
        <div className="container">
          <h1>Exclusive Travel Offers</h1>
          <p>Grab the best deals, limited-time offers and special discounts on your dream destinations. Travel more, spend less!</p>
        </div>
      </section>

      {/* 2. Benefits Section */}
      <section className="container mb-5">
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
          <div className="offer-destination-scroll">
            {destinations.map((dest, i) => (
              <Link href={`/destination/${dest.slug}`} className="offer-dest-card" key={i}>
                <div className="offer-dest-img-wrap">
                  <Image 
                    src={dest.image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80"} 
                    alt={dest.name || "Destination"} 
                    width={150} height={150} 
                  />
                </div>
                <span className="offer-dest-title">{dest.name}</span>
              </Link>
            ))}
          </div>
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
