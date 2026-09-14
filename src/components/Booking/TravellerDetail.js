import { decrypt } from "@/functions/crypt";
import React, { useEffect, useState } from "react";

export default function TravellerDetail() {
  const [details, setDetails] = useState({
    full_name: "",
    phone: "",
    email: "",
  });
  useEffect(() => {
    try {
      const stored = localStorage.getItem("personalDetails");
      if (stored) {
        setDetails(JSON.parse(decrypt(stored)));
      }
    } catch(e){}
  }, []);

  return (
    <div className="min_box-detail Age_limit book_Amount container my-4">
      <div className="traveller-detail d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center px-3 py-2 border rounded bg-white shadow-sm gap-2 gap-md-3">
        {/* Traveler */}
        <div className="mb-1">
          <small className="text-muted d-block" style={{ fontSize: "10px" }}>Traveler</small>
          <span className="fw-bold" style={{ fontSize: "13px" }}>{details.full_name}</span>
        </div>

        {/* Phone */}
        <div className="mb-1">
          <small className="text-muted d-block" style={{ fontSize: "10px" }}>Phone</small>
          <span className="fw-bold" style={{ fontSize: "13px" }}>{details.phone}</span>
        </div>

        {/* Email */}
        <div className="mb-1">
          <small className="text-muted d-block" style={{ fontSize: "10px" }}>Email Address</small>
          <span className="fw-bold" style={{ fontSize: "13px" }}>{details.email}</span>
        </div>
      </div>
    </div>
  );
}
