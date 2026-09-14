"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ThingsToPack({ things_to_pack }) {

  return (
    <div id="ThingsToPack" className="min_box-detail Age_limit container my-4">
      <div className="title">
        <h6 className="text-center text-md-start fw-bold mb-4 page-title">Things To Pack</h6>
      </div>

      <div className="tour-page-single mt-3">
        <div className="page-content">
          <div className="destination-checklist d-flex gap-4">
            {/* Inclusions */}
            <div className="checklist style2 style4 flex-fill">
              <div
                id="things_to_packContent"
                dangerouslySetInnerHTML={{ __html: things_to_pack }}
              />
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
