"use client"
import React, { useState, useEffect } from "react";

// Dummy age limit data
const dummyAgeLimit = [
  {
    id: 1,
    title: "Backpacking Trips",
    age_limit: "18 - 40",
  },
  {
    id: 2,
    title: "Weekend Getaways",
    age_limit: "18 - 38",
  },
  {
    id: 3,
    title: "Himalayan Treks",
    age_limit: "18 - 48",
  },
  {
    id: 4,
    title: "Biking Trips",
    age_limit: "18 - 45",
  },
  {
    id: 6,
    title: "Customized Trips",
    age_limit: "No Limit",
  },
];

export default function AgeLimit() {
  const [ageLimit, setAgeLimit] = useState([]);

  useEffect(() => {
    // Simulate data fetching
    setAgeLimit(dummyAgeLimit);
  }, []);

  return (
    <div className="min_box-detail Age_limit container my-4">
      <div className="title">
        <h6 className="text-start fw-bold mb-4">Age Limit (Trip Wise) </h6>
      </div>
      <div className="row g-3 mt-3">
        {ageLimit.map((item) => (
          <div key={item.id} className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text ">{item.age_limit}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
