"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCalendarAlt, faUsers, faArrowRight, faMapMarkerAlt, faStar } from "@fortawesome/free-solid-svg-icons";
import "./PopularTour.css";

export default function PopularTourSeasonalCard({ data, onRequestCallback, isActive }) {
  // Format price
  function formatAmountIntl(amount) {
    if (!amount) return "0";
    return new Intl.NumberFormat('en-IN').format(amount);
  }

  const checkoutHref = `/${data.slug || "#"}`;
  const rating = data.rating || "4.8";
  const reviewsCount = data.reviews_count || "1.2K";

  return (
    <div className={`seasonal-tour-card bg-white rounded-4 overflow-hidden position-relative d-flex flex-column shadow-sm ${isActive ? 'active-card' : 'inactive-card'}`}>

      {/* Top Image Section — FIXED height, no dynamic changes */}
      <div className="seasonal-card-img-wrapper position-relative" style={{ height: '250px' }}>
        <Link href={checkoutHref} className="d-block h-100 w-100">
          <Image
            src={data.thumbnail || "/img/tour/1.jpg"}
            alt={data.title || "Tour Package"}
            width={400}
            height={300}
            className="seasonal-card-img w-100 h-100 object-fit-cover"
          />
        </Link>

        {/* Dynamic Badges */}
        <div className="seasonal-card-badges position-absolute top-0 start-0 w-100 p-3 d-flex justify-content-between align-items-start pointer-events-none">
          <span className="badge bg-white text-dark rounded-pill px-3 py-2 shadow-sm fw-bold d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-success" style={{ fontSize: "13px" }} /> {data.pickup || data.location || "Destination"}
          </span>

          <button
            className="btn bg-white rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center pointer-events-auto"
            style={{ width: '36px', height: '36px', color: '#666' }}
            onClick={(e) => { e.preventDefault(); onRequestCallback(); }}
            title="Add to Wishlist"
          >
            <i className="fa-regular fa-heart"></i>
          </button>
        </div>

        {/* Rating Overlay — always rendered, visibility controlled by CSS opacity */}
        <div className="seasonal-card-rating-overlay position-absolute bottom-0 start-0 p-3 w-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
          <div className="text-white d-flex flex-column">
            <span className="fw-bold fs-6 d-flex align-items-center gap-1">
              <FontAwesomeIcon icon={faStar} className="text-white" style={{ fontSize: '12px' }} /> {rating}
            </span>
            <span style={{ fontSize: '11px', opacity: 0.8 }}>({reviewsCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Content Section — FIXED layout, no conditional margins or sizing */}
      <div className="seasonal-card-content p-4 d-flex flex-column flex-grow-1 bg-white position-relative" style={{ zIndex: 2 }}>

        {/* Title */}
        <h3 className="seasonal-card-title fw-bold mb-3 text-truncate-2 h5 text-dark">
          <Link href={checkoutHref} className="text-decoration-none" style={{ color: 'inherit' }}>
            {data.title}
          </Link>
        </h3>

        {/* Meta Info: Duration & Group */}
        <div className="seasonal-card-meta d-flex flex-wrap align-items-center gap-3 mb-3 text-muted fw-medium" style={{ fontSize: '12px' }}>
          {data.duration && (
            <div className="d-flex align-items-center gap-2">
              <i className="fa-regular fa-calendar" style={{ color: '#94a3b8' }}></i>
              <span>{data.duration}</span>
            </div>
          )}

          <div className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-user-group" style={{ color: '#94a3b8' }}></i>
            <span>{data.group_size || "2 - 8 People"}</span>
          </div>
        </div>

        {/* Description — always rendered at fixed height, visibility controlled by CSS opacity */}
        <p className="seasonal-card-desc text-muted text-truncate-2 mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
          {data.excerpt || "Serene valleys, crystal lakes and snow-capped peaks await you."}
        </p>

        <div className="mt-auto"></div>

        {/* Footer: Price & Action */}
        <div className="seasonal-card-footer d-flex align-items-end justify-content-between pt-3 mt-2 border-top border-light">
          <div className="price-wrapper">
            <span className="d-block text-muted mb-1" style={{ fontSize: '11px' }}>From</span>
            <div className="d-flex align-items-baseline gap-1">
              <span className="fw-bold fs-5 text-primary">₹{formatAmountIntl(Number(data.starting_price || 0))}</span>
              <span className="text-muted" style={{ fontSize: '11px' }}>/ per person</span>
            </div>
          </div>

          <Link href={checkoutHref} className={`btn rounded-circle d-flex align-items-center justify-content-center p-0 action-btn ${isActive ? 'active-btn' : 'inactive-btn'}`} style={{ width: '40px', height: '40px' }}>
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

      </div>
    </div>
  );
}
