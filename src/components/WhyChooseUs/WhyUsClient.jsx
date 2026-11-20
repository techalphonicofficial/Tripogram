"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard } from "swiper/modules";
import "swiper/css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const fadeUp = {
  initial: {
    opacity: 0,
    x: -50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export default function WhyUsClient({ data, mediaPath }) {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const grouped = useMemo(() => {
    const groupedArr = [];
    let temp = [];

    for (let i = 2; i <= 13; i++) {
      const obj = data?.section?.[i];
      if (!obj) continue;

      if (obj.type === "image") {
        if (temp.length) groupedArr.push(temp);
        temp = [{ key: obj.id || `why-us-${i}` }, { image: obj.data }];
      } else if (obj.type === "Text") {
        temp.push({ Text: obj.data });
      } else if (obj.type === "content") {
        temp.push({ content: obj.data });
      }
    }

    if (temp.length) groupedArr.push(temp);
    return groupedArr;
  }, [data]);

  if (!grouped || grouped.length === 0) return null;

  const renderCard = (item, animated = true) => {
    const imgPath = item[1]?.image?.image || "";
    const bgUrl = /^https?:\/\//i.test(imgPath) ? imgPath : `${mediaPath}${imgPath}`;

    const cardContent = (
      <article
        style={{
          backgroundImage: `url('${bgUrl}')`,
        }}
        className="whyus-card"
      >
        <div className="whyus-card-inner">
          <h3 className="whyus-card-title">{item[2]?.Text?.Text}</h3>
          <p className="whyus-card-description">{item[3]?.content?.content}</p>
        </div>
      </article>
    );

    if (!animated) {
      return cardContent;
    }

    return (
      <motion.div
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        {cardContent}
      </motion.div>
    );
  };

  return (
    <div className="whyus-container space">
      <div className="container">
        <div className="title-area mb-20 text-center">
          <span className="sub-title">{data?.section?.[0]?.data?.Text}</span>
          <h2 className="sec-title">{data?.section?.[1]?.data?.Text}</h2>
        </div>

        {/* Desktop 4-Column View */}
        <div className="row mt-40 d-none d-lg-flex">
          {grouped.map((item) => (
            <div className="col-lg-3 mb-3" key={item[0].key}>
              {renderCard(item, true)}
            </div>
          ))}
        </div>

        {/* Mobile / Tablet Single-Card Slider View with Previous & Next Arrows */}
        <div className="whyus-mobile-slider d-block d-lg-none mt-40">
          <div className="whyus-swiper-wrapper">
            <button
              type="button"
              aria-label="Previous card"
              className="whyus-arrow-btn whyus-arrow-prev"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <Swiper
              modules={[Keyboard]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              slidesPerView={1}
              spaceBetween={16}
              loop={grouped.length > 1}
              keyboard={{ enabled: true, onlyInViewport: true }}
              className="whyus-swiper"
            >
              {grouped.map((item) => (
                <SwiperSlide key={`mob-${item[0].key}`}>
                  {renderCard(item, false)}
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              type="button"
              aria-label="Next card"
              className="whyus-arrow-btn whyus-arrow-next"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>

          <div className="whyus-mobile-controls">
            <div className="whyus-dots">
              {grouped.map((item, idx) => (
                <button
                  key={`dot-${item[0].key}`}
                  type="button"
                  aria-label={`Go to card ${idx + 1}`}
                  className={`whyus-dot ${activeIndex === idx ? "active" : ""}`}
                  onClick={() => swiperRef.current?.slideToLoop(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
