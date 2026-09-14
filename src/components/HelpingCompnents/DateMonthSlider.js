"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

export default function MonthDateSlider({ monthsData: unsortedMonthsData, handleMonthFilter }) {
  const monthOrder = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
  };

  const monthsData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const sorted = [...unsortedMonthsData]
      .filter((m) => {
        try {
          const [abbr, yr] = m.label.split("-");
          const year = parseInt(`20${yr}`);
          const month = monthOrder[abbr] || 0;
          if (year < currentYear) return false;
          if (year === currentYear && month < currentMonth) return false;
          return true;
        } catch { return true; }
      })
      .sort((a, b) => {
        const [aM, aY] = a.label.split("-");
        const [bM, bY] = b.label.split("-");
        const yearA = parseInt(`20${aY}`), yearB = parseInt(`20${bY}`);
        if (yearA !== yearB) return yearA - yearB;
        return (monthOrder[aM] || 0) - (monthOrder[bM] || 0);
      });

    return [{ label: "All" }, ...sorted];
  }, [unsortedMonthsData]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [monthsData]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  const handleSelect = (index) => {
    if (monthsData[index].label === "All") {
      setSelectedIndex(0);
      handleMonthFilter(null);
      return;
    }
    const next = selectedIndex === index ? 0 : index;
    setSelectedIndex(next);
    handleMonthFilter(next !== 0 && next !== null ? monthsData[next].label : null);
  };

  // Parse label into full month name + year
  const parseLabel = (label) => {
    if (label === "All") return { month: "All", year: "Trips" };
    const [abbr, yr] = label.split("-");
    const fullMonth = new Date(`${abbr} 1, 20${yr}`).toLocaleString("en-US", { month: "long" });
    return { month: fullMonth, year: `20${yr}` };
  };

  if (monthsData.length === 0) return null;

  return (
    <div style={{ marginBottom: "32px" }}>
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FontAwesomeIcon
            icon={faCalendarAlt}
            style={{ color: "var(--theme-color, #1c9fea)", fontSize: "15px" }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#333",
              letterSpacing: "0.3px",
            }}
          >
            Filter by Month
          </span>
        </div>
        {selectedIndex !== 0 && (
          <button
            onClick={() => { setSelectedIndex(0); handleMonthFilter(null); }}
            style={{
              fontSize: "12px",
              color: "var(--theme-color, #1c9fea)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              padding: "0",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Slider Row */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {/* Left Arrow */}
        <button
          onClick={() => scroll(-1)}
          disabled={!canScrollLeft}
          style={{
            flexShrink: 0,
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1.5px solid #e0e0e0",
            background: canScrollLeft ? "#fff" : "#f5f5f5",
            color: canScrollLeft ? "#444" : "#bbb",
            cursor: canScrollLeft ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: canScrollLeft ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.2s",
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: "11px" }} />
        </button>

        {/* Scrollable Pills */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            flex: 1,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingTop: "4px",
          }}
        >
          {monthsData.map((month, i) => {
            const isActive = selectedIndex === i;
            const { month: mName, year } = parseLabel(month.label);
            return (
              <button
                key={month.label}
                onClick={() => handleSelect(i)}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "70px",
                  padding: "6px 14px",
                  borderRadius: "12px",
                  border: isActive
                    ? "2px solid var(--theme-color, #1c9fea)"
                    : "1.5px solid #e8e8e8",
                  background: isActive
                    ? "var(--theme-color, #1c9fea)"
                    : "#fafafa",
                  color: isActive ? "#fff" : "#444",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isActive
                    ? "0 4px 12px rgba(28,159,234,0.25)"
                    : "0 1px 3px rgba(0,0,0,0.05)",
                  transform: isActive ? "translateY(-2px)" : "none",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    lineHeight: "1.2",
                    letterSpacing: "0.2px",
                  }}
                >
                  {mName.slice(0, 3)}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "500",
                    opacity: isActive ? 0.85 : 0.55,
                    marginTop: "2px",
                    lineHeight: "16px"
                  }}
                >
                  {year}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll(1)}
          disabled={!canScrollRight}
          style={{
            flexShrink: 0,
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1.5px solid #e0e0e0",
            background: canScrollRight ? "#fff" : "#f5f5f5",
            color: canScrollRight ? "#444" : "#bbb",
            cursor: canScrollRight ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: canScrollRight ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.2s",
          }}
        >
          <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: "11px" }} />
        </button>
      </div>

      {/* Hide scrollbar via global trick */}
      <style>{`
        div[data-month-scroll]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
