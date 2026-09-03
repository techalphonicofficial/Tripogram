"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Instavideo({ related_insta_video }) {
  const [playingIndex, setPlayingIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getInstagramEmbedUrl = (url) => {
    if (!url) return "";
    const cleanUrl = url.split("?")[0];
    if (cleanUrl.includes("/embed")) {
      return `${cleanUrl}?autoplay=1`;
    }
    return `${cleanUrl}embed/?autoplay=1`;
  };

  const renderVideoItem = (video, index) => (
    <div
      className="video-container shadow-sm"
      style={{
        height: "450px",
        overflow: "hidden",
        position: "relative",
        borderRadius: "15px",
        background: "#000"
      }}
    >
      {playingIndex === index ? (
        <>
          <iframe
            src={`${getInstagramEmbedUrl(video.video_url)}&hidecaption=1`}
            width="100%"
            height="100%"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture;"
            allowFullScreen
            frameBorder="0"
            scrolling="no"
            style={{
              pointerEvents: 'auto',
              background: '#000',
              display: 'block',
              borderRadius: "15px",
              overflow: "hidden",
              border: "none",
              transform: "translateY(-12%) translate3d(0,0,0)",
              transformOrigin: "center center",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              perspective: "1000"
            }}
          ></iframe>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPlayingIndex(null);
            }}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 10,
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transform: "translate3d(0,0,0)"
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </>
      ) : (
        <div
          className="thumbnail-wrapper"
          style={{
            position: "relative",
            height: "100%",
            width: "100%",
            cursor: "pointer",
            transform: "translate3d(0,0,0)",
            WebkitBackfaceVisibility: "hidden"
          }}
          onClick={() => setPlayingIndex(index)}
        >
          <img
            src={process.env.NEXT_PUBLIC_MEDIA_PATH + video.thumbnail}
            alt={`Instagram Video ${index + 1}`}
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              display: "block"
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              fontSize: "40px",
              zIndex: 2,
              opacity: 0.8,
              transition: "opacity 0.3s"
            }}
          >
            <FontAwesomeIcon icon={faInstagram} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="sidebar-gallery-area pt-5 bg-smoke space pt-0 mb-60  position-relative"
      style={{
        backgroundImage: "url(/img/bg/shape_bg_1.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container-fluid">
        <div className="title-area text-center">
          <span className="sub-title">Travelers On Instagram</span>
          <h2 className="sec-title">
            <i>
              <FontAwesomeIcon icon={faInstagram} />
            </i>{" "}
            Travel Reels
          </h2>
          <h5>Reviews that make me Blush</h5>
          <p className='text-center smp'>Testimonials, Reviews, Experiences, Virtual Tours & Much More</p>
        </div>

        <div className="slider-area mt-4">
          {isMobile ? (
            <div className="row gy-4 px-2">
              {related_insta_video?.map((video, index) => (
                <div key={index} className="col-12 col-md-6 px-3">
                  {renderVideoItem(video, index)}
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              loop={related_insta_video?.length > 6}
              touchRatio={1.2}
              speed={1000}
              modules={[Autoplay, Pagination, Navigation]}
              navigation={true}
              autoplay={playingIndex === null ? { delay: 3500, disableOnInteraction: false } : false}
              spaceBetween={20}
              breakpoints={{
                0: { slidesPerView: 1 },
                576: { slidesPerView: 2 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
                1400: { slidesPerView: 6 },
              }}
              className="has-shadow"
            >
              {related_insta_video?.map((video, index) => (
                <SwiperSlide key={index}>
                  {renderVideoItem(video, index)}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}
