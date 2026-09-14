"use client";

import React, { useEffect, useMemo, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/functions/dateFunction";

// Dummy JSON data (replace with API response if needed)
const jsonData = {
  packageDetail: {
    slug: "trip-to-manali",
    enquiry_price: 19800,
  },
  activity_cost: [
    { activity: "Triple Occupancy", cost: 19800 },
    { activity: "Double Occupancy", cost: 22500 },
  ],
  packageDateRanges: [
    {
      id: 1,
      start_date: "2025-09-15T08:00:00",
      end_date: "2025-09-20T20:00:00",
      months: "Jan",
      note: "Hot",
      start_point: "Delhi",
      end_point: "Manali",
    },
    {
      id: 2,
      start_date: "2025-10-05T06:30:00",
      end_date: "2025-10-10T18:00:00",
      months: "Feb",
      note: "Available",
      start_point: "Mumbai",
      end_point: "Goa",
    },
    {
      id: 3,
      start_date: "2025-11-01T09:00:00",
      end_date: "2025-11-07T21:00:00",
      months: "Mar",
      note: "Full",
      start_point: "Bangalore",
      end_point: "Kerala",
    },
  ],
};
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export default function Batches({ package_dates, drop, pickup }) {
  const [visibleCount, setVisibleCount] = useState(100); // Default to a large number for desktop
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [data, setData] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setVisibleCount(4); // Reset to 4 on mobile
      } else {
        setVisibleCount(100); // Show more on desktop
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onDropDown = (index) => {
    setActiveIndex(index !== activeIndex ? index : null);
  };

  const groupedDates = useMemo(() => {
    const groups = package_dates.reduce((acc, item) => {
      const date = new Date(item.start_date);
      const month = monthNames[date.getMonth()];

      if (!acc[month]) {
        acc[month] = { month, dates: [] };
      }
      acc[month].dates.push(item);
      return acc;
    }, {});

    const monthGroups = Object.values(groups);

    return [{ month: "All", dates: package_dates }, ...monthGroups];
  }, [package_dates]);

  useEffect(() => {
    const selectedGroup = groupedDates.find(
      (itm) => itm.month === selectedFilter
    );
    setData(selectedGroup.dates);
    if (isMobile) setVisibleCount(4); // Reset on mobile filter changes
  }, [selectedFilter, groupedDates, isMobile]);

  if (package_dates.length == 0) {
    return;
  }

  return (
    <div className="min_box-detail Age_limit container my-6 mt-24">
      <div className="d-flex gap-3 justify-content-between border-bottom pb-2">
        <h6 className="fw-bold">Batches</h6>
        <div className="d-flex gap-3 overflow-x-auto">
          {groupedDates.map((filter, index) => (
            <span
              key={index}
              className={`cursor-pointer ${selectedFilter == filter.month
                ? "fw-bold border-bottom"
                : ""
                }`}
              style={selectedFilter == filter.month ? {
                color: "#0598cc",
                borderColor: "#0598cc",
              } : undefined}
              onClick={() => (
                setSelectedFilter(filter.month), setActiveIndex(null)
              )}
            >
              {filter.month}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3" style={{ maxHeight: isMobile ? "none" : "350px", overflowY: "auto" }}>
        {groupedDates?.length <= 0 ? (
          <span className="text-danger small">
            No Trips Available for the Selected Filter
          </span>
        ) : (
          <>
            {data.slice(0, visibleCount).map((batch, index) => (
              <div key={index} className="mb-2">
                <div
                  className="d-flex justify-content-between align-items-center border rounded p-2 bg-white"
                  onClick={() => onDropDown(index)}
                  style={{ cursor: "pointer" }}
                >
                  <span>
                    {formatDate(batch.start_date)} To {formatDate(batch.end_date)}
                  </span>
                  <div className="d-flex align-items-center gap-2 position-relative">
                    {/* ✅ Status Badge */}
                    <span
                      className={`badge rounded-2 top-0 ${batch.status?.toLowerCase() === "full"
                        ? "bg-dark"
                        : batch.status?.toLowerCase() === "fast-filling"
                          ? "bg-danger"
                          : batch.status?.toLowerCase() === "hot"
                            ? "bg-warning text-dark"
                            : batch.status === "open"
                              ? ""
                              : "bg-secondary"
                        }`}
                      style={{
                        right: "32px",
                        fontSize: "14px",
                        ...(batch.status === "open" ? { backgroundColor: "#0598cc" } : {}),
                      }}
                    >
                      {batch.status
                        ? batch.status.charAt(0).toUpperCase() + batch.status.slice(1)
                        : "No Seat"}
                    </span>
                    <FontAwesomeIcon icon={faArrowDown} />
                  </div>
                </div>
                {activeIndex === index && (
                  <div className="bg-light rounded p-2 mt-1 small">
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>Start Point:</strong> {pickup}
                        <br />({formatDate(batch.start_date)}) &nbsp;
                        {(batch?.day_name || batch?.slots) && (
                          <span
                            style={{ fontSize: '12px', fontWeight: '600', color: '#0598cc' }}
                          >
                            {batch?.day_name?.slice(0, 3)}
                            {batch?.day_name && batch?.slots && ', '}
                            {(() => {
                              const capitalize = (str) =>
                                str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

                              try {
                                const parsed = JSON.parse(batch.slots);
                                const value = Array.isArray(parsed) ? parsed.join(', ') : parsed;
                                return capitalize(value);
                              } catch {
                                return capitalize(batch.slots?.slice(0));
                              }
                            })()}
                          </span>
                        )}
                      </div>
                      <div>
                        <strong>End Point:</strong> {drop}
                        <br />({formatDate(batch.end_date)})
                        {(batch?.end_day || batch?.slot2) && (
                          <span
                            style={{ fontSize: '12px', fontWeight: '600', color: '#0598cc' }}
                          >
                            {batch?.end_day?.slice(0, 3)}
                            {batch?.end_day && batch?.slot2 && ', '}
                            {(() => {
                              const capitalize = (str) =>
                                str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

                              try {
                                const parsed = JSON.parse(batch.slot2);
                                const value = Array.isArray(parsed) ? parsed.join(', ') : parsed;
                                return capitalize(value);
                              } catch {
                                return capitalize(batch.slot2?.slice(0));
                              }
                            })()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isMobile && visibleCount < data.length && (
              <div className="text-center mt-3">
                <button
                  className="btn btn-outline-primary btn-sm rounded-pill px-4"
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                >
                  Show More Slots
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
