"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import TourCard from "./TourCard";
import { getPagewithSection } from "@/services/pageSection";
import { trendingPackage } from "@/services/packageApi";
import RequestCallback from "../HelpingCompnents/RequestCallback";

const fallbackContent = {
  section: [
    { data: { Text: "Featured Trips" } },
    { data: { Text: "Popular Tours" } },
    { data: { content: "Explore our most loved trips and upcoming travel experiences." } },
  ],
};

export default function PopularTour() {
  const [mainpage, setMainpage] = useState(fallbackContent);
  const [trendingPkg, setTrendingPkg] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      getPagewithSection(1, "popular_tour"),
      trendingPackage(),
    ]).then(([pageResult, packageResult]) => {
      if (pageResult.status === "fulfilled") {
        setMainpage(pageResult.value);
      } else {
        console.error("Failed to fetch popular tour content:", pageResult.reason);
      }

      if (packageResult.status === "fulfilled" && Array.isArray(packageResult.value)) {
        setTrendingPkg(packageResult.value);
      } else if (packageResult.status === "rejected") {
        console.error("Failed to fetch trending packages:", packageResult.reason);
      }
    });
  }, []);

  if (!trendingPkg.length) {
    return null;
  }

  return (
    <>
      <div
        className="shape-mockup movingCar d-none d-xxl-block z-2 right-0 top-0 mt-60"
          style={{ width: "300px" }}

      >
        <Image src="/img/shape/car_3.png" alt="shape" width={800} height={800} style={{ transform: "scaleX(1)" }} />
      </div>
      <section
        className="tour-area position-relative bg-top-center  overflow-hidden py-50"
        id="service-sec"
        style={{ backgroundImage: `url('/img/bg/team_bg_4.jpg')` }}
      >

        <div className="container th-container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="title-area text-center">
                <span className="sub-title">{mainpage.section[0].data.Text}</span>
                <h2 className="sec-title">{mainpage.section[1].data.Text}</h2>
                <p className="sec-text">
                  {mainpage.section[2].data.content}
                </p>
              </div>
            </div>
          </div>

          <div className="slider-area tour-slider">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={20}
              loop={true}
              grabCursor={true}
              speed={1000}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                0: { slidesPerView: 1 },
                576: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 2 },
                1200: { slidesPerView: 3 },
                1300: { slidesPerView: 4 },
              }}
              className="swiper th-slider has-shadow slider-drag-wrap"
            >
              {trendingPkg.map((tourpackage) => (
                <SwiperSlide key={tourpackage.id} className="swiper-slide">
                  <TourCard data={tourpackage} onRequestCallback={() => setOpen(tourpackage)} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        {/* Modal */}
        {open && <RequestCallback open={open} setOpen={setOpen} />}
      </section>
    </>
  );
}
