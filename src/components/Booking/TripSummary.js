"use client";
import { getBookingData, setBookingData } from "@/functions/bookingStorage";
import { formatDate } from "@/functions/dateFunction";
import { singlePackage } from "@/services/packageApi";
import { faCalendarAlt, faClock } from "@fortawesome/free-regular-svg-icons";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function TripSummary({selectedDate}) {
  const [trip, setTrip] = useState(null);
  const { slug } = useParams();
  useEffect(() => {
    if (!slug) return;
    async function fetchTrip() {
      try {
        const res = await singlePackage(slug);
        setTrip(res);
        const bookingData = getBookingData(slug);
        setBookingData(slug, {
          ...bookingData,
          package_title: res.title,
          duration: res.duration,
          pickup: res.pickup,
          drop: res.drop,
        });
      } catch (error) {
        console.error("Failed to fetch trip:", error);
      }
    }
    fetchTrip();
  }, [slug]);

  if(trip == null) return;
  return (
    <div className="min_box-detail Age_limit container my-3">
      <div className="bg-white">
        {/* Header */}
        <div className="title d-flex justify-content-between gap-3 mb-2">
          <h6 className="text-start fw-bold mb-2 page-title" style={{ fontSize: "16px" }}>Trip Summary</h6>
        </div>

        {/* Trip Title + Details */}
        <div className="mb-2">
          <p className="fw-semibold mb-1" style={{ fontSize: "14px" }}>
            {trip.title} ({trip.duration})
          </p>
          <div className="d-flex flex-wrap text-muted gap-2 mt-1" style={{ fontSize: "11px" }}>
            <span>
              <FontAwesomeIcon icon={faMapMarkedAlt} className="me-1" />{" "}
              {trip.pickup} to {trip.drop}
            </span>
            <span>
              <FontAwesomeIcon icon={faClock} className="me-1" />{" "}
              {trip.duration.split("-")[1].replace("D", "")} Days
            </span>
            <span>
              <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
              {formatDate(selectedDate.start_date)} to {formatDate(selectedDate.end_date)}
            </span>
          </div>
        </div>

        {/* <hr /> */}

        {/* Trip Options */}
        {/* <div className="bg-light rounded-3 p-3">
          <div className="d-flex justify-content-between py-2 border-bottom ">
            <span>Tempo Traveller</span>
            <span className="fw-semibold">1</span>
          </div>
          <div className="d-flex justify-content-between py-2">
            <span>Triple Occupancy</span>
            <span className="fw-semibold">₹ 23,500</span>
          </div>
        </div> */}
      </div>
    </div>
  );
}
