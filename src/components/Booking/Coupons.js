"use client";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { applyCoupon } from "@/services/bookingForm";

export default function Coupons({ appliedCoupons, onApplyCoupon, onRemoveCoupon, totalTravellers }) {

  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  // console.log("appliedCoupons", appliedCoupons);

  if (totalTravellers <= 0) return null;

  const handleApply = async () => {
    if (!couponCode) return;

    if (appliedCoupons.some(c => c.coupon_code === couponCode)) {
      setError("Coupon already applied");
      return;
    }

    if (appliedCoupons.length >= totalTravellers) {
      setError(`You can only apply ${totalTravellers} coupon${totalTravellers > 1 ? 's' : ''} for this trip.`);
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const response = await applyCoupon(couponCode);
      // console.log("Coupon API response:", response);

      const isSuccess = response.success || response.status === true || response.message === "Coupon applied successfully";
      const couponData = response.coupon || response.data;

      if (isSuccess && (couponData || response.message === "Coupon applied successfully" || response.discount)) {
        const normalizedCoupon = {
          coupon_code: (couponData?.coupon_code || couponData?.code || couponCode).toString(),
          coupon_final_amount: Number(
            couponData?.coupon_final_amount ||
            couponData?.amount ||
            couponData?.discount ||
            response.amount ||
            response.discount ||
            0
          )
        };

        onApplyCoupon(normalizedCoupon);
        setCouponCode("");
        setSuccessMsg("Coupon applied successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(response.message || "Invalid coupon code");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setError(error.message || "Failed to apply coupon");
    } finally {
      setLoading(false);
    }
  };

  const totalDiscount = appliedCoupons.reduce((sum, c) => sum + Number(c.coupon_final_amount || 0), 0);
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN").format(Number(amount || 0));

  return (
    <div className="min_box-detail Age_limit container my-4">

      <div className="title d-flex justify-content-between gap-5">
        <h6 className="text-start fw-bold mb-4 page-title"> Apply Coupons </h6>
      </div>

      {/* Gift Card */}
      <div className="d-flex my-3">
        <input
          type="text"
          placeholder="Enter Coupon Code"
          className="form-control rounded-pill me-2"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value);
            setError("");
            setSuccessMsg("");
          }}
        />
        <button
          className="btn btn-outline-primary rounded-pill px-4"
          onClick={handleApply}
          disabled={loading}
        >
          {loading ? "..." : "Apply"}
        </button>
      </div>
      {error && <p className="text-danger small ms-2">{error}</p>}
      {successMsg && <p className="text-success small ms-2">{successMsg}</p>}

      {/* Applied Coupons List */}
      {appliedCoupons && appliedCoupons.length > 0 && (
        <div className="applied_coupons_list mt-4">
          <p className="fw-bold mb-2 small text-uppercase text-muted">Applied Coupons</p>
          <div className="bg-white border rounded-4 p-2 shadow-sm">
            <ul className="list-unstyled mb-0">
              {appliedCoupons.map((c, index) => (
                <li key={index} className="d-flex justify-content-between align-items-center p-2 mb-1 rounded-3 bg-light-subtle border-bottom last-child-no-border">
                  <div className="d-flex flex-column">
                    <span className="fw-bold text-dark">{c.coupon_code}</span>
                    <span className="small text-muted text-uppercase" style={{ fontSize: '10px' }}>Coupon Applied</span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bolder text-success">
                      - ₹{formatAmount(c.coupon_final_amount)}
                    </span>
                    <button
                      className="btn btn-link text-danger p-0 border-0"
                      onClick={() => onRemoveCoupon(c.coupon_code)}
                      title="Remove Coupon"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between align-items-center p-2 mt-2 bg-success bg-opacity-10 rounded-3">
              <span className="fw-bold text-success small">Total Savings</span>
              <span className="fw-bolder text-success">₹{formatAmount(totalDiscount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
