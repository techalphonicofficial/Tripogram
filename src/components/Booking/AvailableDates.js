import { getBookingData, setBookingData } from "@/functions/bookingStorage";
import { formatDate } from "@/functions/dateFunction";
import React, { useEffect, useState } from "react";

export default function AvailableDates({ groupedDates, handleSetDates, slug }) {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [dates, setDates] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);


  // console.log("groupedDates", groupedDates);

  useEffect(() => {
    // Set initial visible count based on screen width
    if (window.innerWidth < 768) {
      setVisibleCount(4);
    }
  }, []);

  useEffect(() => {
    const bookingData = getBookingData(slug);
    setBookingData(slug, { ...bookingData, selectedBatch });
    handleSetDates(selectedBatch);
  }, [selectedBatch]);

  useEffect(() => {
    if (groupedDates.length == 0) return;
    const selectedGroup = groupedDates.find(
      (itm) => itm.month === selectedMonth
    );
    if (selectedGroup) {
      setDates(selectedGroup.dates);
      // Reset count based on current screen width when changing month
      setVisibleCount(window.innerWidth < 768 ? 4 : 6);
    }
  }, [selectedMonth, groupedDates]);

  return (
    <div className="min_box-detail Age_limit container my-4">
      {/* Title */}
      <div className="title d-flex flex-wrap justify-content-between gap-lg-5 gap-3 align-items-center">
        <div className="d-flex flex-column">
          <h6 className="text-start fw-bold page-title" style={{ marginBottom: "0 !important" }}>Batches</h6>
          <small className=" fw-bold" style={{ marginBottom: "0 !important" }}>Select a Date to book your trip</small>
        </div>

        {/* Month Filter Buttons */}
        <div className="d-flex gap-2 gap-md-3 mb-3 flex-wrap">
          {groupedDates.slice(0, 3).map((month) => (
            <button
              key={month.month}
              onClick={() => setSelectedMonth(month.month)}
              className={`btn btn-link text-decoration-none buttonsda ${selectedMonth === month.month
                ? "fw-bold text-primary border-bottom border-primary"
                : "text-dark"
                }`}
            >
              {month.month}
            </button>
          ))}

          {/* More Dropdown */}
          {groupedDates.length > 0 && (
            <select
              className="form-select buttonsdaasd form-select-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ width: "auto" }}
            >
              {groupedDates.map((month, index) => (
                <option key={index} value={month.month}>
                  {month.month}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Batch List with Custom Scrollbar */}
      <div
        className="mt-3"
        style={{
          paddingRight: "8px"
        }}
      >
        <div className="row gy-3 mx-0 py-2">
          {dates
            .filter((batch) => !["full", "no seat", "closed"].includes(batch?.status?.toLowerCase()))
            .slice(0, visibleCount)
            .map((batch, index) => {
              return (
                <div key={index} className="col-md-6 px-2">
                  <label
                    className={`d-flex justify-content-between align-items-center position-relative p-1 p-md-3 border rounded shadow-sm w-100 transition-all ${selectedBatch === batch.id ? "bg-light" : "bg-white"} ${batch.status?.toLowerCase() === "close" || batch.status?.toLowerCase() === "closed" ? "opacity-75" : ""}`}
                    style={{
                      cursor: batch.status?.toLowerCase() === "close" || batch.status?.toLowerCase() === "closed" ? "not-allowed" : "pointer",
                      transition: "0.2s",
                      borderColor: selectedBatch === batch.id ? "#0598cc" : undefined,
                    }}
                    onClick={(e) => {
                      if (batch.status?.toLowerCase() === "close" || batch.status?.toLowerCase() === "closed") {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="d-flex align-items-center gap-3" >
                      <div className="position-relative d-flex align-items-center">
                        <input
                          type="radio"
                          name="batch"
                          checked={selectedBatch === batch.id}
                          disabled={batch.status?.toLowerCase() === "close" || batch.status?.toLowerCase() === "closed"}
                          onChange={() => setSelectedBatch(batch.id)}
                          className="form-check-input mt-0"
                          style={{
                            width: "22px",
                            height: "22px",
                            cursor: batch.status?.toLowerCase() === "close" || batch.status?.toLowerCase() === "closed" ? "not-allowed" : "pointer",
                            borderColor: selectedBatch === batch.id ? "#0598cc" : "#dee2e6"
                          }}
                        />
                      </div>
                      <div>
                        <span className="fw-bold d-block" style={{ fontSize: "15px" }}>
                          {formatDate(batch.start_date)} To {formatDate(batch.end_date)}
                        </span>
                        {(batch?.day_name || batch?.slots) && (
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#0598cc', display: 'block' }} >
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
                            &nbsp; to &nbsp;
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

                    <span
                      className={`badge rounded-pill px-3 py-2 ${batch.status?.toLowerCase() === "full"
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
                        fontSize: "12px",
                        minWidth: "80px",
                        ...(batch.status === "open" ? { backgroundColor: "#0598cc" } : {}),
                      }}
                    >
                      {batch.status
                        ? batch.status.charAt(0).toUpperCase() + batch.status.slice(1)
                        : "No Seat"}
                    </span>
                  </label>
                </div>
              );
            })}
        </div>

        {/* Show More Button */}
        {dates.filter((batch) => !["full", "no seat", "closed"].includes(batch?.status?.toLowerCase())).length > visibleCount && (
          <div className="text-center mt-2 mt-md-4 ">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="btn btn-primary px-4 rounded-pill fw-bold shadow-sm"
              style={{ fontSize: "14px", letterSpacing: "0.5px" }}
            >
              Show More Batches
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0598cc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0598cc;
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
