"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import Image from "next/image";

export default function Gallery({ gallery, title }) {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const image_base_url = process.env.NEXT_PUBLIC_MEDIA_PATH;
  // console.log("gallery", image_base_url)

  useEffect(() => {
    setMounted(true);
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const openModal = (index) => {
    setCurrentIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setThumbsSwiper(null);
  };


  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);


  return (
    <div className="min_box-detail Age_limit container my-4">
      <div className="title">
        <h6 className="text-center text-md-start fw-bold mb-4">Gallery</h6>
      </div>
      <div className="container my-5">
        <div className="row g-2">
          {/* Large Left Image */}
          <div className="col-md-6">
            <div
              className="h-100 position-relative"
              style={{ cursor: "pointer", borderRadius: "12px", overflow: "hidden" }}
              onClick={() => openModal(0)}
            >
              <Image
                src={image_base_url + gallery[0]?.image}
                className="w-100 h-100 img-fluid"
                style={{ objectFit: "cover" }}
                alt={title || "Gallery image"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            </div>
          </div>

          {/* Right Grid 2x2 */}
          <div className="col-md-6 d-grid gap-2">
            <div className="row g-2">
              {gallery.slice(1, 5).reverse().map((img, index) => (
                <div className="col-6" key={index + 1}>
                  <div
                    className="position-relative h-100"
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      index === 3
                        ? openModal(0)
                        : openModal(index + 1)
                    }
                  >
                    <Image
                      src={image_base_url + img?.image}
                      className="w-100 h-100 img-fluid"
                      style={{ objectFit: "cover" }}
                      alt={img?.alt_text || "Gallery image"}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      unoptimized
                    />

                    {/* Overlay for last image */}
                    {index === 3 && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                        <span className="text-white fw-bold fs-5">+{gallery.length} Photos</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal with Gallery Slider */}
        {showModal && mounted && createPortal(
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{ zIndex: "1000200", backgroundColor: "#000000" }}>
            {/* Close Button */}
            <button
              className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle"
              onClick={closeModal}
              style={{ zIndex: "1000201" }}
            >
              <FontAwesomeIcon icon={faClose} />
            </button>

            {/* Main Slider */}
            <div className="gallery-main-slider" style={{ width: "95%", maxWidth: "1200px", height: "70%" }}>
              <Swiper
                modules={[Navigation, Pagination, Thumbs, Keyboard]}
                navigation
                keyboard={{ enabled: true }}
                thumbs={{ swiper: thumbsSwiper }}
                initialSlide={currentIndex}
                className="h-100"
              >
                {gallery.slice().reverse().map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <Image
                        src={image_base_url + img?.image}
                        className="img-fluid rounded"
                        style={{
                          objectFit: "contain",
                        }}
                        alt={img?.alt_text || "Gallery modal image"}
                        fill
                        unoptimized
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Thumbnails Slider */}
            <div className="gallery-thumbs-slider mt-3" style={{ width: "95%", maxWidth: "1200px", height: "100px" }}>
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                spaceBetween={10}
                watchSlidesProgress
                className="h-100"
                breakpoints={{
                  0: { slidesPerView: 3 },
                  576: { slidesPerView: 5 },
                  992: { slidesPerView: 10 },
                }}
              >
                {gallery.slice().reverse().map((img, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={image_base_url + img?.image}
                      className="img-fluid rounded"
                      style={{
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      alt={img?.alt_text || "Gallery thumbnail"}
                      fill
                      unoptimized
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}
