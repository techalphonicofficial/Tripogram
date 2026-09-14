"use client";
import { allPackage } from "@/services/packageApi";
import TourCard from "../PopularTour/TourCard";
import DateMonthSlider from "@/components/HelpingCompnents/DateMonthSlider";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import RequestCallback from "../HelpingCompnents/RequestCallback";

const PAGE_SIZE = 12;

/* ─── Shimmer skeleton that mirrors TourCard layout ─── */
function TourCardSkeleton() {
  return (
    <div
      className="tour-box"
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      {/* image shimmer */}
      <div
        style={{
          height: "220px",
          background: "linear-gradient(90deg,#e8e8e8 25%,#f5f5f5 50%,#e8e8e8 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }}
      />
      {/* text shimmer lines */}
      <div style={{ padding: "16px" }}>
        <div
          style={{
            height: "18px",
            borderRadius: "6px",
            marginBottom: "10px",
            width: "70%",
            background: "linear-gradient(90deg,#e8e8e8 25%,#f5f5f5 50%,#e8e8e8 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite",
          }}
        />
        <div
          style={{
            height: "14px",
            borderRadius: "6px",
            marginBottom: "10px",
            width: "50%",
            background: "linear-gradient(90deg,#e8e8e8 25%,#f5f5f5 50%,#e8e8e8 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite 0.1s",
          }}
        />
        <div
          style={{
            height: "38px",
            borderRadius: "8px",
            marginTop: "14px",
            background: "linear-gradient(90deg,#e8e8e8 25%,#f5f5f5 50%,#e8e8e8 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite 0.2s",
          }}
        />
      </div>

      {/* keyframes injected once */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export default function UpcomingTripSection({ byCategory, searchQuery = "" }) {
  const [packages, setPackages] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef(null);

  // When category changes, reset page and packages
  const [currentCat, setCurrentCat] = useState(byCategory);
  if (byCategory !== currentCat) {
    setCurrentCat(byCategory);
    setPage(1);
    setHasMore(true);
    setPackages([]);
    setSelectedMonth(null);
  }

  /* ── Fetch data when category or page changes ── */
  useEffect(() => {
    let isMounted = true;
    async function fetchPackages() {
      if (page === 1 && packages.length === 0) setLoading(true);

      try {
        const data = await allPackage(currentCat, page);
        if (!isMounted) return;

        // console.log("fetched data for page", page, data);
        const fetchedList = Array.isArray(data) ? data : (data?.data || []);

        // Determine if there is more data
        if (fetchedList.length === 0 || fetchedList.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setPackages((prev) => {
          if (page === 1) return fetchedList;
          // De-duplicate newly fetched items using a Set
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = fetchedList.filter((item) => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
      } catch (err) {
        console.error("Failed to fetch upcoming trips:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }
    fetchPackages();
    return () => { isMounted = false; };
  }, [currentCat, page]);

  /* ── Build month labels from all packages ── */
  const allGroupedMonths = useMemo(() => {
    const monthSet = new Set();
    packages.forEach((pkg) => {
      pkg.package_dates.forEach((d) => {
        const date = new Date(d.start_date);
        if (isNaN(date)) return;
        const label =
          date.toLocaleString("en-US", { month: "short" }) +
          "-" +
          date.getFullYear().toString().slice(-2);
        monthSet.add(label);
      });
    });
    return [...monthSet].map((label) => ({ label, days: [] }));
  }, [packages]);

  const handleMonthFilter = (monthLabel) => setSelectedMonth(monthLabel);

  /* ── Apply search + month filters ── */
  const filtered = useMemo(() => {
    return packages
      .filter((it) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          it.title?.toLowerCase().includes(q) ||
          it.pickup?.toLowerCase().includes(q) ||
          it.drop?.toLowerCase().includes(q)
        );
      })
      .filter((it) => {
        if (!selectedMonth) return true;
        return it.package_dates.some((d) => {
          const date = new Date(d.start_date);
          if (isNaN(date)) return false;
          const label =
            date.toLocaleString("en-US", { month: "short" }) +
            "-" +
            date.getFullYear().toString().slice(-2);
          return label === selectedMonth;
        });
      })
      .map((it) => {
        if (!selectedMonth) return it;
        const filteredDates = it.package_dates.filter((d) => {
          const date = new Date(d.start_date);
          if (isNaN(date)) return false;
          const label =
            date.toLocaleString("en-US", { month: "short" }) +
            "-" +
            date.getFullYear().toString().slice(-2);
          return label === selectedMonth;
        });
        return { ...it, package_dates: filteredDates };
      });
  }, [packages, searchQuery, selectedMonth]);

  /* ── IntersectionObserver: load next page on scroll ── */
  const handleSentinel = useCallback(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      if (!hasMore || loadingMore || loading) return;

      setLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    },
    [hasMore, loadingMore, loading]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleSentinel, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleSentinel]);

  /* ── Full-page loader (initial fetch) ── */
  if (loading) {
    return (
      <div className="container th-container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <section
      className="tour-area position-relative bg-top-center overflow-hidden tripogram-upcoming-trips"
      id="service-sec"
    >
      <div className="slider-area tour-slider">
        <div className="container th-container mb-5">
          {/* Month Filter Slider */}
          {allGroupedMonths.length > 0 && (
            <DateMonthSlider
              handleMonthFilter={handleMonthFilter}
              monthsData={allGroupedMonths}
            />
          )}

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="text-center py-5" style={{ color: "#888" }}>
              <p style={{ fontSize: "18px", marginBottom: "8px" }}>🔍 No trips found</p>
              <p style={{ fontSize: "14px" }}>
                Try a different{" "}
                <span style={{ color: "#e74c3c", fontWeight: "600" }}>
                  search term or month
                </span>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="mt-4">
                <div className="row g-4">
                  {/* Real cards */}
                  {filtered.map((tour) => (
                    <div key={tour.id} className="col-xxl-4 col-lg-6">
                      <TourCard
                        data={tour}
                        onRequestCallback={() => setOpen(tour)}
                      />
                    </div>
                  ))}

                  {/* Skeleton cards while loading more */}
                  {loadingMore &&
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={`sk-${i}`} className="col-xxl-4 col-lg-6">
                        <TourCardSkeleton />
                      </div>
                    ))}
                </div>
              </div>

              {/* Sentinel — triggers next page load */}
              <div ref={sentinelRef} style={{ height: "1px", marginTop: "40px" }} />

              {/* End of results label */}
              {!hasMore && !loadingMore && (
                <p
                  className="text-center mt-4"
                  style={{ color: "#aaa", fontSize: "14px" }}
                >
                  ✅ All {" trips loaded"}
                </p>
              )}
            </>
          )}
        </div>

        {/* Callback Modal */}
        {open && <RequestCallback open={open} setOpen={setOpen} />}
      </div>
    </section>
  );
}
