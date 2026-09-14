"use client";
import React, { useState } from "react";

export default function Itinerary({ itinerary, slots }) {
  const [openIndex, setOpenIndex] = useState(0);
  // console.log("itinerary", itinerary);
  // console.log("slots", slots);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // console.log("slots", slots)
  const startDay = slots === "evening" ? 0 : 1;

  return (
    <div className="min_box-detail Age_limit container my-4">
      <div className="title d-flex align-items-center justify-content-between gap-3 mb-4 pb-3">
        <h6 className="text-start fw-bold mb-0 page-title">Itinerary</h6>
        <span className="itinerary-count-badge">{itinerary.length} Days</span>
      </div>

      <div className="itinerary-timeline-container">
        <div className="itinerary-timeline">
          {itinerary.map((item, index) => {
            const isOpen = openIndex === index;
            const isLast = index === itinerary.length - 1;
            const dayNumber = index + startDay;
            return (
              <div key={index} className={`itn-row ${isLast ? "itn-row--last" : ""}`}>
                <div className="itn-left">
                  <div className={`itn-circle ${isOpen ? "itn-circle--active" : ""}`}>
                    {dayNumber}
                  </div>
                  {!isLast && <div className={`itn-line ${isOpen ? "itn-line--active" : ""}`} />}
                </div>
                <div className={`itn-card ${isOpen ? "itn-card--open" : ""}`}>
                  <button className="itn-card-header" onClick={() => toggle(index)} aria-expanded={isOpen}>
                    <div className="itn-header-info">
                      <span className="itn-day-label">Day {dayNumber}</span>
                      <span className="itn-card-title" dangerouslySetInnerHTML={{ __html: item.heading }} />
                    </div>
                    <span className={`itn-chevron ${isOpen ? "itn-chevron--open" : ""}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>
                  <div className={`itn-card-body ${isOpen ? "itn-card-body--open" : ""}`}>
                    <div className="itn-divider" />
                    <div className="itn-html-content" dangerouslySetInnerHTML={{ __html: item.content }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
