"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faRupeeSign, faUserClock } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import { formatImageUrl } from "@/utils/formatImage";

export default function TripHero({ title, duration, starting_price, age_group, pickup, drop, banner, thumbnail }) {
  const heroImage = formatImageUrl(banner || thumbnail, "/img/tour/tour-1_1.jpg");

  return (
    <>
      {/* Hero Section */}
      <div className="trip-hero position-relative">
        {/* Background Image */}
        <Image
          className="img-fluid w-100 trip-hero-img" width={1900} height={900}
          src={heroImage}
          alt={title}
        />

        {/* Previous Overlay Content */}
        {/*
        <div className="trip-hero-overlay position-absolute bottom-0 w-100">
          <div className="bg-dark bg-opacity-75 p-3 rounded text-white">
            <div className="container th-container">
              <div className="row align-items-center">
                Title
                <div className=" col-lg-5 text-center text-lg-start mb-3 mb-lg-0">
                  <h1 className="h3 fw-bold mb-0 sec-title text-white">
                    {title}
                  </h1>
                </div>

                Details
                <div className="col-lg-7 ">
                  <div className="row text-center justify-content-center">
                    Duration
                    <div className="col-md-4  col">
                      <div className="icon-circle mb-2">
                        <FontAwesomeIcon icon={faClock} />
                      </div>
                      <p className="small mb-1 fw-semibold text-white text-nowrap">Duration</p>
                      <p className="mb-0 text-white text-nowrap">
                        {duration}
                      </p>
                    </div>

                    Price
                    <div className="col-md-4 col">
                      <div className="icon-circle mb-2">
                        <FontAwesomeIcon icon={faUserClock} />
                      </div>
                      <p className="small mb-1 fw-semibold text-white text-nowrap">Age Limit</p>
                      <p className="mb-0 text-white text-nowrap">
                        {age_group}
                      </p>
                    </div>

                    Pickup & Drop
                    <div className="col-md-4 col">
                      <div className="icon-circle mb-2">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                      </div>
                      <p className="small mb-1 fw-semibold text-white text-nowrap">Pick-up & Drop</p>
                      <p className="mb-0 text-white text-nowrap">
                        {pickup} → {drop}
                      </p>
                    </div>
                  </div>
                </div>
                End Details
              </div>
            </div>
          </div>
        </div>
        */}

        {/* Gradient Overlay Content */}
        <div
          className="trip-hero-overlay position-absolute bottom-0 w-100"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.82), rgba(0, 0, 0, 0.46), rgba(0, 0, 0, 0))",
          }}
        >
          <div className="p-3 text-white">
            <div className="container th-container">
              <div className="row align-items-center">
                {/* Title */}
                <div className=" col-lg-5 text-center text-lg-start mb-3 mb-lg-0">
                  <h1 className="h3 fw-bold mb-0 sec-title text-white">
                    {title}
                  </h1>
                </div>

                {/* Details */}
                <div className="col-lg-7 ">
                  <div className="row text-center justify-content-center">
                    {/* Duration */}
                    <div className="col-md-4  col">
                      <div className="icon-circle mb-2">
                        <FontAwesomeIcon icon={faClock} />
                      </div>
                      <p className="small mb-1 fw-semibold text-white text-nowrap">Duration</p>
                      <p className="mb-0 text-white text-nowrap">
                        {duration}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="col-md-4 col">
                      <div className="icon-circle mb-2">
                        <FontAwesomeIcon icon={faUserClock} />
                      </div>
                      <p className="small mb-1 fw-semibold text-white text-nowrap">Age Limit</p>
                      <p className="mb-0 text-white text-nowrap">
                        {age_group}
                      </p>
                    </div>

                    {/* Pickup & Drop */}
                    <div className="col-md-4 col">
                      <div className="icon-circle mb-2">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                      </div>
                      <p className="small mb-1 fw-semibold text-white text-nowrap">Pick-up & Drop</p>
                      <p className="mb-0 text-white text-nowrap">
                        {pickup} → {drop}
                      </p>
                    </div>
                  </div>
                </div>
                {/* End Details */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
