"use client";
import React from "react";

export default function Inclusions({ inclusion }) {
  // JSON Data
  const data = {
    inclusions: [
      "Hotel Fair Hotel Fair Hotel Fair Hotel Fair Hotel Fair Hotel Fair Hotel Fair Hotel Fair Hotel Fair Hotel Fair Hotel Fair Hotel Fair",
      "Transportation",
      "Breakfast",
      "Sightseeing",
      "Travel Tax",
      "Seasonal Food",
      "Hotel Fair",
      "Transportation",
      "Breakfast",
      "Sightseeing",
      "Travel Tax",
      "Seasonal Food",
    ],
  };

  return (
    <div className="min_box-detail Age_limit container my-4">
      <div className="title">
        <h6 className="text-center text-md-start fw-bold mb-4 page-title">Inclusions</h6>
      </div>

      <div className="tour-page-single mt-3">
        <div className="page-content">
          <div className="destination-checklist d-flex gap-4">
            {/* Inclusions */}
            <div className="checklist style2 style4 flex-fill">
              <div id="InclusionsContent" dangerouslySetInnerHTML={{ __html: inclusion }} />
            </div>
            <div className="checklist style5 flex-fill"></div>
          </div>

        </div>
      </div>
    </div>
  );
}
