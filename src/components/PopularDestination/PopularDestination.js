"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PopularCard from "./PopularCard";
import { getPagewithSection } from "@/services/pageSection";
import { getHomeDestination } from "@/services/destinationApi";

export default function PopularDestination() {
  const [mainpage, setMainpage] = useState(null);
  const [homeDestination, setHomeDestination] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      getPagewithSection(1, "destination"),
      getHomeDestination(),
    ]).then(([pageResult, destinationResult]) => {
      if (pageResult.status === "fulfilled") {
        setMainpage(pageResult.value);
      } else {
        console.error("Failed to fetch destination section:", pageResult.reason);
      }

      if (destinationResult.status === "fulfilled" && Array.isArray(destinationResult.value)) {
        setHomeDestination(destinationResult.value);
      } else if (destinationResult.status === "rejected") {
        console.error("Failed to fetch destinations:", destinationResult.reason);
      }
    });
  }, []);

  if (!mainpage || !homeDestination.length) return null;

  return (
    <div className="position-relative overflow-hidden pt-8 mt-60 mb-35">
      <div className="container">
        <div className="title-area text-center">
          <span className="sub-title">{mainpage.section?.[0]?.data?.Text}</span>
          <h2 className="sec-title">{mainpage.section?.[1]?.data?.Text}</h2>
        </div>

        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          autoplay={{ delay: 2500 }}
          speed={1000}
          slidesPerView={3}
          coverflowEffect={{
            rotate: 0,
            stretch: 95,
            depth: 212,
            modifier: 1,
            slideShadows: false,
          }}
          modules={[Autoplay, EffectCoverflow]}
          breakpoints={{
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 3 },
          }}
          className="th-slider destination-slider slider-drag-wrap"
        >
          {homeDestination.map((item) => (
            <SwiperSlide key={item.id}>
              <PopularCard
                image={item.thumbnail}
                title={item.name}
                subtitle={item.active_packages_count}
                slug={item.slug}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
