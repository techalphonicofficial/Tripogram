"use client";
import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { CategoriesCard } from "./CategoriesCard";

const CurveSlider = ({trips}) => {

  const swiperRef = useRef(null);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (swiperRef.current) {
        swiperRef.current.update();
      }
    }, 500);

    return () => clearTimeout(handle);
  }, []);

  return (
    <div
      className="swiper th-slider has-shadow categorySlider"
      id="categorySlider1"
      style={{
        backgroundImage: "url('/img/bg/category_bg_1.png')",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={5}
        loop={true}
        grabCursor={true}
        simulateTouch={true}
        draggable={true}
        spaceBetween={24}
        touchRatio={1.2}
        speed={1000}
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".slider-pagination" }}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 16 },
          576: { slidesPerView: 2, spaceBetween: 18 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          992: { slidesPerView: 3, spaceBetween: 22 },
          1200: { slidesPerView: 4, spaceBetween: 24 },
          1400: { slidesPerView: 5, spaceBetween: 24 },
        }}
      > 
        {trips.map((item, index) => (
            <SwiperSlide key={index}>
              <CategoriesCard image={item.thumbnail} title={item.heading} slug={item.slug} />
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="slider-pagination"></div>
    </div>
  );
};

export default CurveSlider;
