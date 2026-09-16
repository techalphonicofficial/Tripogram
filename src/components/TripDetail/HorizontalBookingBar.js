"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faArrowRight, faArrowDown, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/functions/dateFunction";
import "./HorizontalBookingBar.css";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function HorizontalBookingBar({
  id,
  slug,
  starting_price,
  startingFrom,
  activeCosts = [],
  bookingAmont,
  showBookNoButton,
  bookingButton,
  package_dates = [],
  pickup,
  drop,
}) {
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Batches logic
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(100);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const groupedDates = useMemo(() => {
    const groups = package_dates.reduce((acc, item) => {
      const date = new Date(item.start_date);
      const month = monthNames[date.getMonth()];
      if (!acc[month]) acc[month] = { month, dates: [] };
      acc[month].dates.push(item);
      return acc;
    }, {});
    return [{ month: "All", dates: package_dates }, ...Object.values(groups)];
  }, [package_dates]);

  useEffect(() => {
    const selectedGroup = groupedDates.find((itm) => itm.month === selectedFilter);
    if (selectedGroup) {
      setData(selectedGroup.dates);
    }
  }, [selectedFilter, groupedDates]);

  useEffect(() => {
    if (package_dates && package_dates.length > 0) {
      setSelectedBatchId(package_dates[0].id || 0);
      setSelectedBatch(package_dates[0]);
    }
  }, [package_dates]);

  const handleBatchSelect = (batch, index) => {
    setSelectedBatchId(batch.id || index);
    setSelectedBatch(batch);
    setActiveIndex(activeIndex === index ? null : index);
    // Do not close dropdown automatically so they can see expanded details
  };

  const shouldShowBookNow = bookingButton && Number(showBookNoButton) === 1;
  const shouldShowStartingBookNow = Number(showBookNoButton) === 1 && Number(bookingAmont) > 0;
  const checkoutStartingFrom = startingFrom ?? starting_price;
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
    return [...costs].sort((a, b) => {
      const amountA = normalizeAmount(a?.total_with_discount || a?.cost);
      const amountB = normalizeAmount(b?.total_with_discount || b?.cost);
      return amountA - amountB;
    })[0];
  })();
  
  const startingGstPercent = Number(startingCost?.gst_percent || startingCost?.gst || 5);

  function formatAmount(amount) {
    return new Intl.NumberFormat('en-IN').format(amount);
  }

  const displayStartPoint = pickup || selectedBatch?.start_point || "N/A";

  return (
    <div className="horizontal-booking-bar">
      {/* 1. Price Section */}
      <div className="hbb-section">
        <span className="hbb-label">Starts From</span>
        <div className="hbb-price-val">₹{formatAmount(Number(checkoutStartingFrom))}</div>
        <div className="hbb-gst">+{startingGstPercent}% GST</div>
      </div>
      <div className="hbb-divider"></div>

      {/* 2. Select Batch Date (Custom Dropdown) */}
      <div className="hbb-section" style={{ flexGrow: 1, position: 'relative' }} ref={dropdownRef}>
        <span className="hbb-label">Select Batch Date</span>
        
        <div 
          className={`hbb-custom-select ${isDropdownOpen ? 'open' : ''}`} 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedBatch ? `${formatDate(selectedBatch.start_date)} To ${formatDate(selectedBatch.end_date)}` : "Select Batch Date"}
          <FontAwesomeIcon icon={faChevronDown} style={{ color: '#6b7280', fontSize: '12px' }} />
        </div>

        {isDropdownOpen && (
          <div className="hbb-dropdown-menu">
            <div className="hbb-dropdown-header">
              <h6 className="fw-bold mb-0" style={{ color: '#0d2d46' }}>Batches</h6>
              <div className="hbb-month-tabs">
                {groupedDates.map((filter, index) => (
                  <span
                    key={index}
                    className={`hbb-month-tab ${selectedFilter === filter.month ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFilter(filter.month);
                      setActiveIndex(null);
                    }}
                  >
                    {filter.month}
                  </span>
                ))}
              </div>
            </div>

            <div className="hbb-dropdown-body">
              {data.length === 0 ? (
                <span className="text-danger small p-3 d-block">No Trips Available for the Selected Filter</span>
              ) : (
                data.slice(0, visibleCount).map((batch, index) => (
                  <div key={index} className="hbb-batch-item">
                    <div
                      className={`hbb-batch-header ${selectedBatchId === (batch.id || index) ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBatchSelect(batch, index);
                      }}
                    >
                      <span className="hbb-batch-dates">
                        {formatDate(batch.start_date)} To {formatDate(batch.end_date)}
                      </span>
                      <div className="hbb-batch-status-wrapper">
                        <span
                          className={`badge rounded-2 top-0 ${
                            batch.status?.toLowerCase() === "full" ? "bg-dark" :
                            batch.status?.toLowerCase() === "fast-filling" ? "bg-danger" :
                            batch.status?.toLowerCase() === "hot" ? "bg-warning text-dark" :
                            batch.status === "open" ? "bg-primary-custom" : "bg-secondary"
                          }`}
                        >
                          {batch.status ? batch.status.charAt(0).toUpperCase() + batch.status.slice(1) : "No Seat"}
                        </span>
                        <FontAwesomeIcon icon={faArrowDown} style={{ fontSize: '12px', transform: activeIndex === index ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>
                    </div>
                    {activeIndex === index && (
                      <div className="hbb-batch-details">
                        <div className="d-flex justify-content-between flex-wrap gap-2">
                          <div>
                            <strong>Start Point:</strong> {pickup}<br />
                            <span className="hbb-detail-date">({formatDate(batch.start_date)})</span> &nbsp;
                            {(batch?.day_name || batch?.slots) && (
                              <span className="hbb-detail-slot">
                                {batch?.day_name?.slice(0, 3)}
                                {batch?.day_name && batch?.slots && ', '}
                                {(() => {
                                  try {
                                    const parsed = JSON.parse(batch.slots);
                                    const value = Array.isArray(parsed) ? parsed.join(', ') : parsed;
                                    return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
                                  } catch {
                                    return batch.slots ? batch.slots.charAt(0).toUpperCase() + batch.slots.slice(1) : '';
                                  }
                                })()}
                              </span>
                            )}
                          </div>
                          <div>
                            <strong>End Point:</strong> {drop}<br />
                            <span className="hbb-detail-date">({formatDate(batch.end_date)})</span>
                            {(batch?.end_day || batch?.slot2) && (
                              <span className="hbb-detail-slot ms-1">
                                {batch?.end_day?.slice(0, 3)}
                                {batch?.end_day && batch?.slot2 && ', '}
                                {(() => {
                                  try {
                                    const parsed = JSON.parse(batch.slot2);
                                    const value = Array.isArray(parsed) ? parsed.join(', ') : parsed;
                                    return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
                                  } catch {
                                    return batch.slot2 ? batch.slot2.charAt(0).toUpperCase() + batch.slot2.slice(1) : '';
                                  }
                                })()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <div className="hbb-divider"></div>

      {/* 3. Start Point */}
      <div className="hbb-section">
        <span className="hbb-label">Start Point:</span>
        <div className="hbb-start-val">
          <FontAwesomeIcon icon={faMapMarkerAlt} /> 
          <div>
            {displayStartPoint}
            {selectedBatch && (
              <span className="fw-normal text-muted ms-1" style={{ fontSize: '13px' }}>
                ({formatDate(selectedBatch.start_date).split(' ')[0]})
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="hbb-divider"></div>

      {/* 4. Book Now Button */}
      <div className="hbb-section align-items-end">
        {shouldShowStartingBookNow && (
          <a href={checkoutHref} className="hbb-btn">
            <span>Book Now at ₹{formatAmount(Number(bookingAmont))}</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        )}
      </div>
    </div>
  );
}
