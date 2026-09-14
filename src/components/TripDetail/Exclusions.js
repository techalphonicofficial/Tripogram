"use client";
import React from "react";

export default function Exclusions({ exclusion }) {
  return (
    <div className="min_box-detail Age_limit container my-4">
      <div className="title">
        <h6 className="text-center text-md-start fw-bold mb-4 page-title">
          Exclusions
        </h6>
      </div>

      <div className="tour-page-single mt-3">
        <div className="page-content">
          <div className="destination-checklist d-flex gap-4">


            {/* Exclusions */}
            <div className="checklist style5 flex-fill">
              <div
                id="exclusionContent"
                dangerouslySetInnerHTML={{ __html: exclusion }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
