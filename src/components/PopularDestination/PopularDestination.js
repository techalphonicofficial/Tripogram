"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import PopularCard from "./PopularCard";
import { getPagewithSection } from "@/services/pageSection";
import { getHomeDestination } from "@/services/destinationApi";

const fallbackMainpage = {
  section: [
    { data: { Text: "Destination Lists" } },
    { data: { Text: "Popular Destinations" } },
  ],
};

export default function PopularDestination() {
  const [mainpage, setMainpage] = useState(fallbackMainpage);
  const [homeDestination, setHomeDestination] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      getPagewithSection(1, "destination"),
      getHomeDestination(),
    ]).then(([pageResult, destinationResult]) => {
      if (pageResult.status === "fulfilled" && pageResult.value?.section) {
        setMainpage(pageResult.value);
      } else {
        console.log("Failed to fetch destination section:", pageResult.reason);
      }

      if (destinationResult.status === "fulfilled" && Array.isArray(destinationResult.value)) {
        setHomeDestination(destinationResult.value);
      }
    });
  }, []);

  if (!homeDestination || homeDestination.length === 0) return null;

  const pageDataToDisplay = mainpage?.section?.[0]?.data?.Text ? mainpage : fallbackMainpage;

  return (
    <div className="position-relative overflow-hidden pt-8 mb-35">
      <div className="container">
        <div className="title-area text-center mb-4">
          <span className="sub-title text-success fw-bold">{pageDataToDisplay.section?.[0]?.data?.Text || "Destination Lists"}</span>
          <h2 className="sec-title fw-bold text-dark">{pageDataToDisplay.section?.[1]?.data?.Text || "Popular Destinations"}</h2>
        </div>

        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={homeDestination.length > 2}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
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
                subtitle={item.active_packages_count ?? 0}
                slug={item.slug}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}



