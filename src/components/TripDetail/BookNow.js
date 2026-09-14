"use client";
import React, { useState } from "react";
import RequestCallback from "../HelpingCompnents/RequestCallback";

export default function BookNow({
  id,
  slug,
  starting_price,
  startingFrom,
  activeCosts = [],
  bookingButton,
  showBookNoButton,
  bookingAmont,
  completedata,
}) {
  const [open, setOpen] = useState(false);
  // console.log("bookingAmount", bookingAmont)
  const shouldShowBookNow = bookingButton && Number(showBookNoButton) === 1;
  // const shouldShowStartingBookNow = Number(bookingAmont) > 0;
  const shouldShowStartingBookNow =
    Number(showBookNoButton) === 1 && Number(bookingAmont) > 0;
  const checkoutStartingFrom = startingFrom ?? starting_price;
  // const checkoutHref = `/booking/${slug}?starting_from=${encodeURIComponent(
  //   checkoutStartingFrom || ""
  // )}`;
  const checkoutHref = `/booking/${slug}`;
  const normalizeAmount = (amount) => Number(String(amount || 0).replace(/,/g, ""));
  const startingCost = (() => {
    const startingAmount = normalizeAmount(checkoutStartingFrom);
    const costs = Array.isArray(activeCosts) ? activeCosts : [];
    const matchingCost = costs.find((item) => {
      const discountedAmount = normalizeAmount(item?.total_with_discount);
      const baseAmount = normalizeAmount(item?.cost);
      return discountedAmount === startingAmount || baseAmount === startingAmount;
    });

    if (matchingCost) return matchingCost;

    return [...costs]
      .sort((a, b) => {
        const amountA = normalizeAmount(a?.total_with_discount || a?.cost);
        const amountB = normalizeAmount(b?.total_with_discount || b?.cost);
        return amountA - amountB;
      })[0];
  })();
  const startingGstPercent = Number(startingCost?.gst_percent || startingCost?.gst || 5);




  function formatAmount(amount) {
    return new Intl.NumberFormat('en-IN').format(amount);
  }

  return (
    <div className="min_box-detail uiymyumyumyum trip-detail-booking-card container mt-80 px-4 py-4 rounded-4 shadow-sm">
      {/* <!-- Title --> */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fw-semibold text-secondary trip-detail-starting-price">
          <span className="trip-detail-start-label">Starts From</span>
          {/* <i className="bi bi-info-circle ms-1"></i> */}
          {Number(starting_price) > Number(checkoutStartingFrom) && (
            <span className="trip-detail-old-price">
              ₹{formatAmount(Number(starting_price))}
            </span>
          )}
          {/* <!-- Price --> */}
          {/* <h3 className="fw-bold text-primary mb-4"> */}
          <h3 className="fw-bold text-primary mb-1">
            {/* ₹{formatAmount(Number(starting_price))} */}
            ₹{formatAmount(Number(checkoutStartingFrom))}
          </h3>
          <span className="trip-detail-tax-note">+{startingGstPercent}% GST</span>
        </span>


        {/* <a
          href={`/booking/${slug}`}
          className="btn btn-primary w-40 py-2 rounded-xl fw-semibold d-flex flex-column align-items-center"
        >
          <span className="fw-bold">{formatAmount(Number(bookingAmont))}</span>
          <span>Start Booking</span>
        </a> */}

        {false && shouldShowStartingBookNow && (
          <a
            href={checkoutHref}
            className="btn btn-primary w-40 py-4 px-3 rounded-pill fw-semibold d-flex flex-column align-items-center shadow-sm"
            style={{
              background: "linear-gradient(135deg, #ff7a1a, #0598cc)",
              border: "0",
              color: "#fff",
              minWidth: "150px",
              lineHeight: 1.2,
              boxShadow: "0 10px 22px rgba(5, 152, 204, 0.22)",
            }}
          >
            {/* <span className="fw-bold">₹{formatAmount(Number(bookingAmont))}</span>
            <span>Book Now</span> */}
            <span className="fw-bold">
              {/* Book in just @ ₹{formatAmount(Number(bookingAmont))} */}
              Book Now @ ₹ {formatAmount(bookingAmont)} per person

            </span>
          </a>
        )}

        {/* Desktop inquiry button removed per updated design.
        <button
          className="btn btn-primary w-40 py-2 px-3 rounded-pill fw-semibold d-flex flex-column align-items-center shadow-sm trip-inquiry-btn"
          onClick={() => setOpen(id)}
          style={{
            minWidth: "150px",
          }}
        >
          Send Inquiry
        </button>
        */}

        {shouldShowBookNow && (
          <a
            href={checkoutHref}
            className="btn btn-primary py-2 px-4 rounded-pill fw-semibold shadow-sm trip-booknow-btn trip-booknow-btn-desktop d-none d-lg-flex flex-column align-items-center justify-content-center"
            style={{
              fontSize: "20px",
              lineHeight: 1.2,
              whiteSpace: "normal",
              minWidth: "180px",
            }}
          >
            <span>Book now at</span>
            <span>&#8377; {formatAmount(bookingAmont)}</span>
          </a>
        )}

        {/* <span className=" bg-light text-dark rounded-pill px-3 py-1 py-md-2">
          Per Person
        </span> */}




      </div>

      {/* <!-- Button --> */}
      <div className="d-flex align-items-center justify-content-between gap-4 trip-booknow-mobile-wrap d-lg-none">
        {shouldShowBookNow && (
          <a
            // href={`/booking/${slug}`}
            href={checkoutHref}
            // className="btn btn-primary w-100 py-2 rounded-pill fw-semibold"
            className="btn btn-primary w-100 py-2 rounded-pill fw-semibold shadow-sm trip-booknow-btn"
            style={{
              // background: "linear-gradient(135deg, #ff7a1a, #0598cc)",
              // background: "linear-gradient(135deg, var(--theme-color), var(--title-color))",
              // background: "var(--theme-color)",
              // border: "0",
              // color: "#fff",
              // boxShadow: "0 10px 22px rgba(5, 152, 204, 0.22)",
              // boxShadow: "0 10px 22px rgba(5, 152, 204, 0.22)",
              // fontSize: "15px",
              // fontSize: "16px",
              fontSize: "24px",
              lineHeight: 1.25,
              whiteSpace: "normal",
            }}
          >
            {/* {" "}
            Book Now{" "} */}
            {/* Book in just @ ₹{formatAmount(Number(bookingAmont))} */}
            {/* Previous split label kept for reference.
            <span>Book Now</span>
            <small>at ₹{formatAmount(bookingAmont)}</small>
            */}
            {/* Previous single-line mobile label kept for reference.
            <span>Book now at ₹ {formatAmount(bookingAmont)}</span>
            */}
            <span className="trip-booknow-mobile-label">Book now at</span>
            <span className="trip-booknow-mobile-amount">&#8377; {formatAmount(bookingAmont)}</span>

          </a>
        )}
        {/* <button
          className="btn btn-primary w-100 py-2 rounded-pill fw-semibold"
          onClick={() => setOpen(id)}
        >
          Send Inquiry
        </button> */}
      </div>
      {open && <RequestCallback open={open} setOpen={setOpen} packageData={completedata} />}
    </div>
  );
}
