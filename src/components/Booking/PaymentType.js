// import { decrypt, encrypt } from "@/functions/crypt";
// import { useEffect } from "react";

// export default function PaymentType({
//   paybleType,
//   setPaybleType,
//   fullAmount,
//   slug,
//   razorpay_key,
//   bookingAmount,
//   totalTravellers,
//   dif_days,
//   selectedDate
// }) {
//   const bookingData = (() => {
//     try {
//       return JSON.parse(decrypt(localStorage.getItem(`tripogram_${slug}`))) || {};
//     } catch {
//       return {};
//     }
//   })();

//   localStorage.setItem(
//     `tripogram_${slug}`,
//     encrypt(
//       JSON.stringify({
//         ...bookingData,
//         payment_type: paybleType,
//       }))
//   );
//   // console.log("paybleType", paybleType)
//   const diffDays = (() => {
//     if (!selectedDate?.start_date) return null;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Set to start of day for accurate day difference
//     const tripDate = new Date(selectedDate.start_date);
//     tripDate.setHours(0, 0, 0, 0);
//     const diffTime = tripDate - today;
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   })();

//   const showBookingAmount = diffDays !== null && diffDays >= (dif_days || 0);

//   // If booking amount option is hidden but was selected, switch to full
//   useEffect(() => {
//     if (!showBookingAmount && paybleType === "half") {
//       setPaybleType("full");
//     }
//   }, [showBookingAmount, paybleType, setPaybleType]);


"use client";
import { getBookingData, setBookingData } from "@/functions/bookingStorage";
import { useEffect, useRef } from "react";

export default function PaymentType({
  paybleType,
  setPaybleType,
  fullAmount,
  slug,
  razorpay_key,
  bookingAmount,
  totalTravellers,
  dif_days,
  selectedDate
}) {
  const hasDefaultedPaymentType = useRef(false);
  // const [bookingData, setBookingData] = useState({});

  // ✅ READ from localStorage safely
  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   try {
  //     const stored = localStorage.getItem(`tripogram_${slug}`);
  //     if (stored) {
  //       const parsed = JSON.parse(decrypt(stored));
  //       setBookingData(parsed || {});
  //     }
  //   } catch (err) {
  //     console.log("Read error:", err);
  //   }
  // }, [slug]);

  // ✅ WRITE to localStorage safely
  useEffect(() => {
    if (typeof window === "undefined") return;

    const freshBookingData = getBookingData(slug);
    setBookingData(slug, {
      ...freshBookingData,
      payment_type: paybleType,
    });
  }, [paybleType, slug]);

  // --------------------------
  // Your existing logic
  // --------------------------

  const diffDays = (() => {
    if (!selectedDate?.start_date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tripDate = new Date(selectedDate.start_date);
    tripDate.setHours(0, 0, 0, 0);
    const diffTime = tripDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  })();

  const payBookingAmount = Number(bookingAmount || 0) * Number(totalTravellers || 0);
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN").format(Number(amount || 0));
  const showBookingAmount = payBookingAmount > 0;
  const fullPaymentDeadlineDays = Number(dif_days || 0);
  const isBookingAmountDisabled =
    diffDays !== null && diffDays <= fullPaymentDeadlineDays;

  useEffect(() => {
    if (!showBookingAmount || isBookingAmountDisabled || hasDefaultedPaymentType.current) {
      return;
    }

    hasDefaultedPaymentType.current = true;
    if (paybleType !== "half") {
      setPaybleType("half");
    }
  }, [isBookingAmountDisabled, paybleType, setPaybleType, showBookingAmount]);

  useEffect(() => {
    if (paybleType === "half" && (!showBookingAmount || isBookingAmountDisabled)) {
      setPaybleType("full");
    }
  }, [isBookingAmountDisabled, paybleType, setPaybleType, showBookingAmount]);

  return (
    <div className="min_box-detail Age_limit container my-3">
      <div className="">
        <div className="title d-flex justify-content-between gap-3 mb-2">
          <h6 className="text-start fw-bold mb-2 page-title" style={{ fontSize: "16px" }}>Payment Type</h6>
        </div>

        <div className="d-flex flex-column flex-md-row gap-2">
          {/* Booking Amount */}
          {showBookingAmount && (
            <label
              className={`flex-grow-1 border rounded-3 p-2 ${isBookingAmountDisabled ? "opacity-50" : "cursor-pointer"} ${paybleType === "half" ? "border-primary bg-light" : ""
                }`}
            >
              <input
                type="radio"
                name="payment"
                value="half"
                checked={paybleType === "half"}
                onChange={() => setPaybleType("half")}
                disabled={isBookingAmountDisabled}
                className="form-check-input me-2"
                style={{ transform: "scale(0.8)" }}
              />
              <span className="fw-semibold" style={{ fontSize: "13px" }}>
                Pay Booking Amount
              </span>
              <div className="text-muted" style={{ fontSize: "11px" }}>₹ {formatAmount(payBookingAmount.toFixed(0))}</div>
              {isBookingAmountDisabled && (
                <div className="text-muted" style={{ fontSize: "11px" }}>
                  Disabled within {fullPaymentDeadlineDays} days of trip
                </div>
              )}
            </label>
          )}

          {/* Full Amount */}
          <label
            className={`flex-grow-1 border rounded-3 p-2 cursor-pointer ${paybleType === "full" ? "border-primary bg-light" : ""
              }`}
          >
            <input
              type="radio"
              name="payment"
              value="full"
              checked={paybleType === "full"}
              onChange={() => setPaybleType("full")}
              className="form-check-input me-2"
              style={{ transform: "scale(0.8)" }}
            />
            <span className="fw-semibold" style={{ fontSize: "13px" }}>Full Amount</span>
            <div className="text-muted" style={{ fontSize: "11px" }}>₹ {formatAmount(fullAmount.toFixed(0))}</div>
          </label>
        </div>
      </div>
    </div>
  );
}
