"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper as SwiperType } from "swiper"; // ✅ correct type import
import "swiper/swiper-bundle.css";
import "./Hero.css";

import { TypeAnimation } from "react-type-animation";
import CountUp from "react-countup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { getPagewithSection } from "@/services/pageSection";
import { api } from "@/services/config";

export default function Hero() {
  const [mainpage, setMainpage] = useState(null);
  const [results, setResults] = useState([]);
  const arr = mainpage?.section?.[2]?.data?.content?.split("|") || [];

  let newArr = arr.reduce((acc, item, index) => {
    acc.push(item);
    acc.push(1000); // index ke hisaab se nayi value
    return acc;
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    getPagewithSection(1, "hero")
      .then(setMainpage)
      .catch((error) => console.error("Failed to fetch hero data:", error));
  }, []);

  // Update debouncedTerm after a delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); // 500ms delay after user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedTerm) {
      const fetchData = async () => {
        try {
          const response = await api.get(`/packages/search/${debouncedTerm}`);
          setResults(response.data);
        } catch (error) {
          console.error("API error:", error);
        }
      };

      fetchData();
    }
  }, [debouncedTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  if (!mainpage) {
    return <div className="position-relative w-100 z-2 tripogram-hero" style={{ height: "90vh" }} />;
  }

  return (
    <div className="position-relative w-100 tripogram-hero d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      {/* Swiper */}
      <Swiper
        // modules={[Autoplay, EffectFade]}
        // autoplay={{ delay: 5000, disableOnInteraction: false }}
        // speed={1000}
        // effect="fade"
        // loop={true}
        // onSwiper={(swiper) => {
        //   swiperRef.current = swiper;   // ✅ works fine now
        // }}
        // slidesPerView={1}
        className="position-absolute top-0 start-0 w-100 h-100 z-0"
      >
        <SwiperSlide className="position-relative">
          <video
            className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
            src={
              process.env.NEXT_PUBLIC_MEDIA_PATH +
              (mainpage.section?.[6]?.data?.video || "")
            }
            autoPlay
            muted
            playsInline
          />
        </SwiperSlide>
      </Swiper>
      {/* <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={1000}
        effect="fade"
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;   // ✅ works fine now
        }}
        slidesPerView={1}
        className="h-100"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="position-relative">
            {slide.type === "video" ? (
              <video
                className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                src={slide.src}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
              />
            ) : (
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  backgroundImage: `url(${slide.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper> */}

      {/* Overlay */}
      {/* Tripogram refresh: keep the original overlay logic, but use a branded overlay class for a richer travel feel. */}
      {/* <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50 z-1"></div> */}
      <div className="position-absolute top-0 start-0 w-100 h-100 tripogram-hero-overlay z-1"></div>

      {/* Hero Content */}
      <div className="main_ct_box px-3 position-relative z-2 w-100">
        <div className="main_ct_contentin">
          <p className="sub-title mb-3">{mainpage.section?.[0]?.data?.Text}</p>
          <h1 className="sec-title fw-bold mb-2">
            {mainpage.section?.[1]?.data?.Text}
          </h1>

          {/* Typing Animation Wrapper */}
          <div className="typing-text-wrapper mb-3 mt-2">
            <TypeAnimation
              sequence={newArr}
              wrapper="span"
              speed={50}
              className="fs-4 text-warning d-block"
              repeat={Infinity}
            />
          </div>

          {/* Search Bar */}
          <div className="position-relative w-100 mx-auto tripogram-hero-search">
            <input
              type="text"
              className="form-control form-control-lg rounded-pill ps-4 pe-5"
              placeholder="Search Destination"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button className="btn btn-primary position-absolute top-50 end-0 translate-middle-y rounded-pill px-4 h-100">
              {/* <FaSearch /> */}
              <FontAwesomeIcon icon={faSearch} />
            </button>

            {searchTerm && (
              <ul className="list-group position-absolute top-100 start-0 w-100 mt-1 shadow">
                {results.map((item, index) => (
                  <Link
                    key={index}
                    href={`/${item.slug}`}
                    className="list-group-item list-group-item-action"
                  >
                    {item.title}
                  </Link>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Stats Row */}
        <div className="statsas container-fluid mt-4">
          <div className="row text-center justify-content-center ">
            {mainpage.section?.slice(3, 6).map((item, index) => (
              <div className=" adfsd col-md-4 col-4 mb-2" key={index}>
                <div className="mb-2">
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_MEDIA_PATH +
                      item.data.section[0].data.image
                    }
                    alt="Owl"
                    height={80}
                    width={80}
                  />
                </div>
                <h3>
                  <CountUp
                    end={Number(item.data.section[1].data.Text)}
                    duration={3}
                  />
                  +
                </h3>
                <p>{item.data.section[2].data.Text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
