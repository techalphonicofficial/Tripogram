"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faSolidStar, faStarHalfStroke, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import { getPagewithSection } from "@/services/pageSection";
import "./TestimonialSection.css"; 

export default function TestimonialSection() {
  const [mainpage, setMainpage] = useState(null);
  const [selectedTestimonialIndex, setSelectedTestimonialIndex] = useState(null);
  const testimonialss = mainpage?.section?.[2]?.data?.testimonials_items || [];

  useEffect(() => {
    getPagewithSection(1, "testimonials")
      .then(setMainpage)
      .catch((error) => console.error("Failed to fetch testimonials:", error));
  }, []);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (selectedTestimonialIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedTestimonialIndex]);

  const openModal = (index) => {
    setSelectedTestimonialIndex(index);
  };

  const closeModal = () => {
    setSelectedTestimonialIndex(null);
  };

  if (!mainpage || !testimonialss.length) return null;

  return (
    <section className="tripogram-modern-testimonials mb-60">
      <div className="container th-container">
        <div className="modern-testi-wrapper">
          <div className="row align-items-center">
            {/* LEFT INTRODUCTION AREA */}
            <div className="col-lg-4 col-xl-3 mb-5 mb-lg-0">
              <div className="modern-testi-intro">
                <div className="modern-testi-label">
                  {mainpage.section?.[0]?.data?.Text || "Testimonials"}
                </div>
                <h2 className="modern-testi-title">
                  {mainpage.section?.[1]?.data?.Text || "What Clients Say About Us"}
                </h2>
                <p className="modern-testi-desc">
                  Our travelers' happiness is our biggest achievement.
                </p>
              </div>
            </div>

            {/* RIGHT SLIDER AREA */}
            <div className="col-lg-8 col-xl-9">
              <div className="modern-testi-slider-area">
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  loop={true}
                  autoplay={{
                    delay: 3500,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: true,
                  }}
                  speed={800}
                  pagination={{ clickable: true, el: ".modern-slider-pagination" }}
                  navigation={{
                    nextEl: ".testi-button-next",
                    prevEl: ".testi-button-prev",
                  }}
                  spaceBetween={0} 
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    767: { slidesPerView: 2 },
                    992: { slidesPerView: 2 },
                    1200: { slidesPerView: 3 },
                  }}
                  className="modernTestiSlider"
                  onSlideChange={() => {
                    // close modal on slide if desired, or keep open
                  }}
                >
                  {testimonialss.map((item, index) => (
                    <SwiperSlide key={item.id || `${item.name}-${index}`}>
                      <div className="timeline-slide-wrapper">
                        {/* Independent Timeline Separator in the gap */}
                        <div className="testimonial-timeline-separator">
                          <span className="timeline-dot top-dot"></span>
                          <span className="timeline-line"></span>
                          <span className="timeline-dot bottom-dot"></span>
                        </div>
                        
                        <div className="modern-testi-card">
                          
                          {/* User Header */}
                          <div className="modern-testi-header">
                            <div className="modern-testi-avatar">
                              {item.image ? (
                                <Image
                                  src={process.env.NEXT_PUBLIC_MEDIA_PATH + item.image}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                  className="avatar-img"
                                />
                              ) : (
                                <div className="avatar-fallback">{item.name?.charAt(0) || 'U'}</div>
                              )}
                            </div>
                            <div className="modern-testi-user-info">
                              <h3 className="modern-testi-name">{item.name}</h3>
                              <span className="modern-testi-role">{item.type}</span>
                              <div className="modern-testi-rating" aria-label={`${item.rating} out of 5 rating`}>
                                {Array.from({ length: 5 }).map((_, i) => {
                                  const fullStars = Math.floor(item.rating);
                                  const hasHalfStar = item.rating % 1 !== 0;
                                  if (i < fullStars) return <FontAwesomeIcon key={i} icon={faSolidStar} />;
                                  else if (i === fullStars && hasHalfStar) return <FontAwesomeIcon key={i} icon={faStarHalfStroke} />;
                                  else return <FontAwesomeIcon key={i} icon={faRegularStar} />;
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="modern-testi-content">
                            <p className="modern-testi-text line-clamp-4">
                              {item.content}
                            </p>

                            {item.content.length > 150 && (
                              <button
                                className="modern-testi-read-more"
                                onClick={() => openModal(index)}
                              >
                                Read More <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Pagination */}
                <div className="modern-slider-pagination mt-4 text-center"></div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Testimonial Modal Popup */}
      {selectedTestimonialIndex !== null && (
        <div className="testimonial-modal-overlay" onClick={closeModal}>
          <div
            className="testimonial-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="testimonial-modal-close" onClick={closeModal}>
              &times;
            </button>
            <div className="modern-testi-header mb-3">
              <div className="modern-testi-avatar">
                {testimonialss[selectedTestimonialIndex].image ? (
                  <Image
                    src={process.env.NEXT_PUBLIC_MEDIA_PATH + testimonialss[selectedTestimonialIndex].image}
                    alt={testimonialss[selectedTestimonialIndex].name}
                    width={60}
                    height={60}
                    className="avatar-img"
                  />
                ) : (
                  <div className="avatar-fallback">
                    {testimonialss[selectedTestimonialIndex].name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div className="modern-testi-user-info">
                <h3 className="modern-testi-name">{testimonialss[selectedTestimonialIndex].name}</h3>
                <span className="modern-testi-role">{testimonialss[selectedTestimonialIndex].type}</span>
                <div className="modern-testi-rating">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const fullStars = Math.floor(testimonialss[selectedTestimonialIndex].rating);
                    const hasHalfStar = testimonialss[selectedTestimonialIndex].rating % 1 !== 0;
                    if (i < fullStars) return <FontAwesomeIcon key={i} icon={faSolidStar} />;
                    else if (i === fullStars && hasHalfStar) return <FontAwesomeIcon key={i} icon={faStarHalfStroke} />;
                    else return <FontAwesomeIcon key={i} icon={faRegularStar} />;
                  })}
                </div>
              </div>
            </div>
            <div className="testimonial-modal-body">
              <p className="modern-testi-text" style={{ WebkitLineClamp: "unset" }}>
                {testimonialss[selectedTestimonialIndex].content}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
