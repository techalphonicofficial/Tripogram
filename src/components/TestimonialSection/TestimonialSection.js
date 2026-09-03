"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faSolidStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import { getPagewithSection } from "@/services/pageSection";

export default function TestimonialSection() {
  const [mainpage, setMainpage] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const testimonialss = mainpage?.section?.[2]?.data?.testimonials_items || [];

  useEffect(() => {
    getPagewithSection(1, "testimonials")
      .then(setMainpage)
      .catch((error) => console.error("Failed to fetch testimonials:", error));
  }, []);

  const toggleReadMore = (index) => {
    // If clicking the same item, collapse it
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  if (!mainpage || !testimonialss.length) return null;

  return (
    <section className="testi-area tripogram-testimonials overflow-hidden mb-60" id="testi-sec">
      <div className="container-fluid p-0">
        <div className="title-area mb-20 text-center">
          <span className="sub-title">{mainpage.section?.[0]?.data?.Text}</span>
          <h2 className="sec-title">{mainpage.section?.[1]?.data?.Text}</h2>
        </div>

        <div className="slider-area">
          <Swiper
            modules={[Autoplay, Pagination]}
            loop={true}
            autoplay={{
                delay: 2500,
                pauseOnMouseEnter: true,
                disableOnInteraction: true,
              }}
            speed={1000}
            pagination={{ clickable: true, el: ".slider-pagination" }}
            spaceBetween={30}
            centeredSlides={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              767: { slidesPerView: 2, centeredSlides: true },
              992: { slidesPerView: 2, centeredSlides: true },
              1200: { slidesPerView: 2, centeredSlides: true },
              1400: { slidesPerView: 3, centeredSlides: true },
            }}
            className="testiSlider1 has-shadow"
            onSlideChange={(swiper) => {
              if (expandedIndex !== null && expandedIndex !== swiper.realIndex) {
                setExpandedIndex(null);
              }
            }}
          >
            {testimonialss.map((item, index) => (
              <SwiperSlide key={item.id || `${item.name}-${index}`}>
                <div className="testi-card">
                  <div className="testi-card_wrapper">
                    <div className="testi-card_profile">
                      <div className="testi-card_avater">
                        <Image
                          src={process.env.NEXT_PUBLIC_MEDIA_PATH + item.image}
                          alt={item.name}
                          width={60}
                          height={60}
                        />
                      </div>
                      <div className="media-body">
                        <h3 className="box-title">{item.name}</h3>
                        <span className="testi-card_desig">{item.type}</span>
                      </div>
                    </div>

                    <div className="testi-card_review" aria-label={`${item.rating} out of 5 rating`}>
                      {Array.from({ length: 5 }).map((_, i) => {
                        const fullStars = Math.floor(item.rating);
                        const hasHalfStar = item.rating % 1 !== 0;

                        if (i < fullStars) {
                          return <FontAwesomeIcon key={i} icon={faSolidStar} />;
                        } else if (i === fullStars && hasHalfStar) {
                          return <FontAwesomeIcon key={i} icon={faStarHalfStroke} />;
                        } else {
                          return <FontAwesomeIcon key={i} icon={faRegularStar} />;
                        }
                      })}
                    </div>
                  </div>

                  <p
                    className="testi-card_text"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: expandedIndex === index ? "unset" : 4,
                      WebkitBoxOrient: "vertical",
                      overflow: expandedIndex === index ? "visible" : "hidden",
                      textOverflow: expandedIndex === index ? "clip" : "ellipsis",
                      transition: "all 0.3s ease",
                    }}
                  >
                    “{item.content}”
                  </p>

                  {item.content.length > 220 && (
                    <button
                      className="btn testi-read-more"
                      onClick={() => toggleReadMore(index)}
                    >
                      {expandedIndex === index ? "Read Less" : "Read More"}
                    </button>
                  )}

                  <div className="testi-card-quote">
                    <Image
                      src="/img/icon/testi-quote.svg"
                      alt="quote"
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="slider-pagination"></div>
        </div>
      </div>

      {/* Shapes */}
      <div
        className="shape-mockup d-none d-xl-block"
        data-bottom="-2%"
        data-right="0%"
      >
        <Image
          src="/img/shape/line2.png"
          alt="shape"
          width={200}
          height={200}
        />
      </div>
      <div
        className="shape-mockup movingX d-none d-xl-block"
        data-top="30%"
        data-left="5%"
      >
        <Image
          src="/img/shape/shape_7.png"
          alt="shape"
          width={100}
          height={100}
        />
      </div>
    </section>
  );
}
