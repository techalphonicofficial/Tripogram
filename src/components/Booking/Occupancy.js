import { getBookingData, setBookingData } from "@/functions/bookingStorage";
import React, { useState, useEffect } from "react";

export default function Occupancy({
  selectedDate,
  activeCosts,
  selectedCosts,
  setSelectedCosts,
  slug,
}) {
  useEffect(() => {
    setSelectedCosts((prev) =>
      prev.map((i) => ({
        ...i,
        quantity: 0,
        total_with_discount: 0,
        total_with_discount_and_gst: 0,
      }))
    );
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      const freshBookingData = getBookingData(slug);
      setBookingData(slug, {
        ...freshBookingData,
        package_id: selectedDate.package_id,
        start_date: selectedDate.start_date,
        end_date: selectedDate.end_date,
        active_cost: selectedCosts,
      });
    }
  }, [selectedCosts, selectedDate]);

  const calculateAdjustedPrice = (price, isDiscounted = false) => {
    const inc = Number(selectedDate?.increase_amount_by_percent) || 0;
    const dec = Number(selectedDate?.decrease_amount_by_percent) || 0;

    if (inc > 0) {
      return price + (price * inc) / 100;
    } else if (dec > 0) {
      return price - (price * dec) / 100;
    }
    return price;
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN").format(Math.round(Number(amount || 0)));

  const handleIncrease = (item) => {
    setSelectedCosts((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      const newQuantity = (exists ? exists.quantity : 0) + 1;
      const adjustedCost = calculateAdjustedPrice(Number(item.cost));
      
      const discountPercent = Number(item.discount_percent) || 0;
      const gstPercent = Number(item.gst_percent) || 0;
      
      // Calculate totals for the selected quantity
      const singleDiscountedCost = adjustedCost - (adjustedCost * discountPercent) / 100;
      const totalWithDiscount = singleDiscountedCost * newQuantity;
      const totalWithGst = totalWithDiscount + (totalWithDiscount * gstPercent) / 100;

      if (exists) {
        return prev.map((i) =>
          i.id === item.id
            ? {
              ...i,
              cost: adjustedCost,
              quantity: newQuantity,
              total_with_discount: totalWithDiscount,
              total_with_discount_and_gst: totalWithGst,
            }
            : i
        );
      } else {
        return [
          ...prev,
          {
            ...item,
            cost: adjustedCost,
            quantity: newQuantity,
            total_with_discount: totalWithDiscount,
            total_with_discount_and_gst: totalWithGst,
          },
        ];
      }
    });
  };

  const handleDecrease = (item) => {
    setSelectedCosts((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (!exists) return prev;
      
      const newQuantity = exists.quantity - 1;
      
      if (newQuantity <= 0) {
        return prev.filter((i) => i.id !== item.id);
      }

      const adjustedCost = calculateAdjustedPrice(Number(item.cost));
      const discountPercent = Number(item.discount_percent) || 0;
      const gstPercent = Number(item.gst_percent) || 0;

      // Calculate totals for the reduced quantity
      const singleDiscountedCost = adjustedCost - (adjustedCost * discountPercent) / 100;
      const totalWithDiscount = singleDiscountedCost * newQuantity;
      const totalWithGst = totalWithDiscount + (totalWithDiscount * gstPercent) / 100;

      return prev.map((i) =>
        i.id === item.id
          ? {
            ...i,
            cost: adjustedCost,
            quantity: newQuantity,
            total_with_discount: totalWithDiscount,
            total_with_discount_and_gst: totalWithGst,
          }
          : i
      );
    });
  };

  const getQuantity = (id) => {
    const exists = selectedCosts.find((i) => i.id === id);
    return exists ? exists.quantity : 0;
  };

  if (!activeCosts || !selectedDate) {
    return null;
  }

  return (
    <div className="min_box-detail Age_limit container my-4">
      {/* Header */}
      <div className="title d-flex flex-wrap gap-lg-3 gap-3 justify-content-between align-items-center">
        <div>
          <h6 className="fw-bold mb-0 page-title">Costing per person</h6>
          <small className="text-muted">
            (Select Number of People according to sharing)
          </small>
        </div>
      </div>

      {/* Occupancy List */}
      {activeCosts.map((item) => (
        <div className="bg-white p-2 m-2 rounded shadow-sm" key={item.id}>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div className="asdfasdf">
              <span className="fw-bold" style={{ fontSize: "14px" }}>{item.activity}</span>
            </div>
            <div className="d-flex align-items-center gap-4">
              <span className="fw-bold text-decoration-line-through text-light" style={{ fontSize: "13px" }}>
                ₹ {formatAmount(calculateAdjustedPrice(Number(item.cost)))}
              </span>
              <span className="fw-bold" style={{ fontSize: "14px" }}>
                ₹ {formatAmount(calculateAdjustedPrice(Number(item.total_with_discount)))}
              </span>

              <div className="d-flex align-items-center border rounded px-1" style={{ fontSize: "12px" }}>
                <button
                  className="btn btn-sm btn-light py-0 px-2"
                  onClick={() => handleDecrease(item)}
                >
                  -
                </button>
                <span className="mx-2 fw-bold">{getQuantity(item.id)}</span>
                <button
                  className="btn btn-sm btn-light py-0 px-2"
                  onClick={() => handleIncrease(item)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
