"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import PopularTourSeasonalCard from "./PopularTourSeasonalCard";
import { getPagewithSection } from "@/services/pageSection";
import { getMostPopularContent, trendingPackage, allPackage } from "@/services/packageApi";
import RequestCallback from "../HelpingCompnents/RequestCallback";
import "./PopularTour.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faSun, faTree, faSnowflake, faArrowRight, faHeart } from "@fortawesome/free-solid-svg-icons";

const fallbackContent = {
  section: [
    { data: { Text: "MOST POPULAR" } },
    { data: { Text: "Most Popular\nTour" } },
    { data: { content: "Handpicked journeys loved by our travelers. These packages change every season, so you always get the best of every time." } },
  ],
};

const SEASONS = [
  { id: "Spring", name: "Spring", months: "Mar - May", icon: faLeaf, color: "#84cc16", monthsArray: [2, 3, 4] },
  { id: "Summer", name: "Summer", months: "Jun - Aug", icon: faSun, color: "#eab308", monthsArray: [5, 6, 7] },
  { id: "Autumn", name: "Autumn", months: "Sep - Nov", icon: faTree, color: "#d97706", monthsArray: [8, 9, 10] },
  { id: "Winter", name: "Winter", months: "Dec - Feb", icon: faSnowflake, color: "#3b82f6", monthsArray: [11, 0, 1] },
];

function getCurrentSeason() {
  const currentMonth = new Date().getMonth();
  const season = SEASONS.find(s => s.monthsArray.includes(currentMonth));
  return season ? season.id : "Spring";
}


function getPackageSeasons(pkg) {
  const explicitSeasons = pkg.seasons || pkg.season;
  if (Array.isArray(explicitSeasons)) {
    return explicitSeasons.map((season) => String(season).toLowerCase());
  }
  if (explicitSeasons) {
    return [String(explicitSeasons).toLowerCase()];
  }

  if (!Array.isArray(pkg.package_dates) || pkg.package_dates.length === 0) {
    return [];
  }

  const packageSeasons = new Set();
  pkg.package_dates.forEach(d => {
    const dateValue = d.start_date || d.departure_date;
    if (dateValue) {
      const month = new Date(dateValue).getMonth();
      const season = SEASONS.find(s => s.monthsArray.includes(month));
      if (season) packageSeasons.add(season.id.toLowerCase());
    }
  });

  return Array.from(packageSeasons);
}

export default function PopularTour() {
  const [mainpage, setMainpage] = useState(fallbackContent);
  const [trendingPkg, setTrendingPkg] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeSeason, setActiveSeason] = useState(getCurrentSeason);
  const [isLoading, setIsLoading] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !swiperInstance) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!swiperInstance.autoplay) return;

        if (entry.isIntersecting) {
          swiperInstance.autoplay.start();
        } else {
          swiperInstance.autoplay.stop();
        }
      },
      { threshold: 0.1 } // Start autoplay when 10% of the section is visible
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [swiperInstance]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    Promise.allSettled([
      getMostPopularContent(),
      getPagewithSection(1, "popular_tour"),
      trendingPackage(activeSeason),
    ]).then(async ([contentResult, pageResult, packageResult]) => {
      if (cancelled) return;
      if (contentResult.status === "fulfilled" && contentResult.value?.title) {
        setMainpage({
          section: [
            { data: { Text: "MOST POPULAR" } },
            { data: { Text: contentResult.value.title } },
            { data: { content: contentResult.value.description } },
          ],
        });
      } else if (pageResult.status === "fulfilled" && pageResult.value?.section) {
        setMainpage(pageResult.value);
      } else {
        console.log("Failed to fetch popular tour content:", contentResult.reason || pageResult.reason);
      }

      let fetchedPackages = [];
      if (packageResult.status === "fulfilled" && Array.isArray(packageResult.value) && packageResult.value.length > 0) {
        fetchedPackages = packageResult.value;
      } else {
        try {
          const fallbackRes = await allPackage("all", 1);
          if (Array.isArray(fallbackRes)) {
            fetchedPackages = fallbackRes;
          } else if (fallbackRes?.data && Array.isArray(fallbackRes.data)) {
            fetchedPackages = fallbackRes.data;
          }
        } catch (err) {
          console.log("Failed to fetch all packages:", err.message);
        }
      }

      if (!cancelled) {
        setTrendingPkg(fetchedPackages);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeSeason]);

  // Filter packages based on the active season
  const filteredPackages = useMemo(() => {
    return trendingPkg.filter(pkg => {
      const seasons = getPackageSeasons(pkg);
      return seasons.includes(activeSeason.toLowerCase());
    });
  }, [trendingPkg, activeSeason]);

  const activeSeasonData = SEASONS.find(s => s.id === activeSeason);

  // Instead of returning null, we will let the empty state handle it.

  return (
    <>
      <section ref={sectionRef} className="seasonal-popular-tour py-50 overflow-hidden position-relative">

        {/* Subtle Decorative Background Elements */}
        <div className="position-absolute top-0 end-0 opacity-10 pointer-events-none d-none d-lg-block" style={{ width: '600px', height: '600px', zIndex: 0 }}>
          {/* Subtle world map or mountains can go here, using CSS pattern or existing img */}
        </div>

        <div className="container th-container position-relative z-1">
          <div className="row align-items-center g-4">

            {/* LEFT SIDE: Intro & Season Selector */}
            <div className="col-lg-3 col-md-12 pe-lg-4 d-flex flex-column justify-content-center">

              <div className="title-area mb-4 text-lg-start text-center">
                <h2 className="sec-title text-primary fw-bolder mb-3" style={{ fontSize: 'clamp(32px, 4vw, 42px)', lineHeight: '1.2' }}>

                  {(mainpage.section[1]?.data?.Text || "Most Popular\nTour").split('\n').map((line, i) => (
                    <React.Fragment key={i}>{line}<br /></React.Fragment>
                  ))}
                </h2>

                <p className="sec-text text-muted mb-0" style={{ fontSize: '15px' }}>
                  {mainpage.section[2]?.data?.content || "Handpicked journeys loved by our travelers. These packages change every season, so you always get the best of every time."}
                </p>
              </div>

              {/* Season Selector */}
              <div className="season-selector-wrapper bg-white p-3 rounded-4 shadow-sm mb-4 mx-auto mx-lg-0" style={{ maxWidth: '400px' }}>
                <h6 className="text-dark fw-bold mb-3 fs-6 ps-2">Select Season</h6>
                <div className="d-flex justify-content-between gap-2">
                  {SEASONS.map((season) => {
                    const isActive = activeSeason === season.id;
                    return (
                      <button
                        key={season.id}
                        onClick={() => setActiveSeason(season.id)}
                        className={`season-btn flex-fill d-flex flex-column align-items-center justify-content-center p-2 rounded-3 border transition-all ${isActive ? 'active shadow-sm' : 'bg-light border-light text-muted'}`}
                        style={{
                          borderColor: isActive ? season.color : 'transparent',
                          backgroundColor: isActive ? '#fff' : '',
                        }}
                      >
                        <FontAwesomeIcon
                          icon={season.icon}
                          className={`mb-1 fs-5 ${isActive ? '' : 'text-muted'}`}
                          style={{ color: isActive ? season.color : '' }}
                        />
                        <span className={`fw-bold ${isActive ? 'text-dark' : ''}`} style={{ fontSize: '12px' }}>{season.name}</span>
                        <span style={{ fontSize: '10px' }}>{season.months}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="d-flex justify-content-center mb-4">
                <div className="season-info-badge bg-white px-3 py-2 rounded-3 shadow-sm d-inline-flex align-items-center gap-2 border" style={{ borderColor: '#e2e8f0' }}>
                  <FontAwesomeIcon icon={activeSeasonData?.icon} style={{ color: activeSeasonData?.color }} />
                  <div className="text-start">
                    <span className="d-block text-muted" style={{ fontSize: '11px' }}>Showing top picks for</span>
                    <span className="d-block fw-bold text-success" style={{ fontSize: '13px' }}>{activeSeasonData?.name} Season ({activeSeasonData?.months})</span>
                  </div>
                </div>
              </div>

              <div className="d-none d-lg-block mt-auto text-center text-lg-start">
                {/* Subtle illustration could go here */}
              </div>

            </div>

            {/* RIGHT SIDE: Carousel */}
            <div className="col-lg-9 col-md-12 ps-lg-4">

              <div className="slider-area tour-slider seasonal-swiper-wrapper position-relative">

                {isLoading ? (
                  // Skeleton Loading State
                  <div className="row flex-nowrap overflow-hidden g-4">
                    {[1, 2, 3, 4].map(i => (
                      <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={i}>
                        <div className="card border-0 rounded-4 shadow-sm" aria-hidden="true">
                          <div className="placeholder-glow">
                            <div className="placeholder w-100 rounded-top-4" style={{ height: '280px' }}></div>
                          </div>
                          <div className="card-body p-4">
                            <h5 className="card-title placeholder-glow mb-3"><span className="placeholder col-8 rounded"></span></h5>
                            <p className="card-text placeholder-glow mb-4">
                              <span className="placeholder col-5 rounded me-2"></span>
                              <span className="placeholder col-5 rounded"></span>
                            </p>
                            <div className="d-flex justify-content-between mt-4">
                              <span className="placeholder col-4 rounded"></span>
                              <span className="placeholder col-2 rounded-circle" style={{ height: '35px', width: '35px' }}></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredPackages.length > 0 ? (
                  <>
                    <Swiper
                      onSwiper={(swiper) => {
                        setSwiperInstance(swiper);
                        swiper.autoplay.stop();
                      }}
                      modules={[Autoplay, Navigation, Pagination]}
                      spaceBetween={24}
                      loop={filteredPackages.length > 3}
                      grabCursor={true}
                      speed={800}
                      autoHeight={false}
                      autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      navigation={{
                        nextEl: '.seasonal-swiper-next',
                        prevEl: '.seasonal-swiper-prev',
                      }}
                      pagination={{
                        el: '.seasonal-swiper-pagination',
                        clickable: true,
                        dynamicBullets: true
                      }}
                      breakpoints={{
                        0: { slidesPerView: 1 },
                        576: { slidesPerView: 1.2 },
                        768: { slidesPerView: 2.2 },
                        992: { slidesPerView: 2.5 },
                        1200: { slidesPerView: 3 },
                        1400: { slidesPerView: 3.5 },
                        1600: { slidesPerView: 4 },
                      }}
                      className="swiper seasonal-slider pb-5 px-2 pt-2"
                    >
                      {filteredPackages.map((tourpackage) => (
                        <SwiperSlide key={tourpackage.id} className="swiper-slide h-100 py-4">
                          {({ isActive }) => (
                            <PopularTourSeasonalCard data={tourpackage} isActive={isActive} onRequestCallback={() => setOpen(tourpackage)} />
                          )}
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Custom Swiper Controls */}
                    <div className="d-flex align-items-center justify-content-between mt-1">
                      <div className="seasonal-swiper-pagination position-static w-auto"></div>
                      <div className="d-flex align-items-center gap-3">
                        <Link href="/trips/upcoming-trips/all" className="fw-bold text-primary text-decoration-none border-bottom border-primary pb-1 view-all-link">
                          View all tours <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                        </Link>
                        <div className="swiper-nav-buttons d-flex gap-2 ms-3">
                          <button className="btn btn-light rounded-circle shadow-sm seasonal-swiper-prev d-flex align-items-center justify-content-center border" style={{ width: '40px', height: '40px' }}>
                            <i className="fas fa-arrow-left text-primary"></i>
                          </button>
                          <button className="btn btn-primary rounded-circle shadow-sm seasonal-swiper-next d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            <i className="fas fa-arrow-right text-white"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Empty State
                  <div className="bg-white rounded-4 shadow-sm p-5 text-center border">
                    <div className="mb-4 text-muted opacity-50">
                      <FontAwesomeIcon icon={activeSeasonData?.icon} style={{ fontSize: '60px' }} />
                    </div>
                    <h4 className="fw-bold text-dark mb-3">No tours scheduled for {activeSeasonData?.name} yet</h4>
                    <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>
                      We&apos;re currently preparing our {activeSeasonData?.name} season packages. Check back soon or explore our other available tours!
                    </p>
                    <Link href="/trips/upcoming-trips/all" className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm">
                      Explore All Tours <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {open && <RequestCallback open={open} setOpen={setOpen} />}
      </section>
    </>
  );
}
