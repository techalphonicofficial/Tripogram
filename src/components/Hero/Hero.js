"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useMemo } from "react";
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
  const newArr = useMemo(() => {
    const arr = mainpage?.section?.[2]?.data?.content?.split("|") || [];
    return arr.reduce((acc, item) => {
      acc.push(item);
      acc.push(1000);
      return acc;
    }, []);
  }, [mainpage]);

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
    <div className="position-relative tripogram-hero w-100" style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "1fr" }}>

      {/* Background Layer */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
        <Swiper className="w-100 h-100">
          <SwiperSlide className="w-100 h-100">
            <video
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
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
        <div className="position-absolute top-0 start-0 w-100 h-100 tripogram-hero-overlay" style={{ zIndex: 1 }}></div>
      </div>

      {/* Content Layer (Grid Area 1) */}
      <div style={{ gridArea: "1 / 1 / 2 / 2", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }} className="py-5">
        <div className="main_ct_box px-3 w-100 d-flex flex-column justify-content-center mt-5 pt-5 mt-md-0 pt-md-0">

          {/* Stats Row (Order 1 on mobile, Order 2 on desktop) */}
          <div className="statsas container-fluid order-1 order-md-2 mb-4 mb-md-0">
            <div className="row text-center justify-content-center">
              {mainpage.section?.slice(3, 6).map((item, index) => (
                <div className="adfsd col-md-4 col-4 mb-2" key={index}>
                  <div className="mb-2 review-icon-wrapper">
                    <Image
                      src={
                        process.env.NEXT_PUBLIC_MEDIA_PATH +
                        item.data.section[0].data.image
                      }
                      alt="Owl"
                      height={80}
                      width={80}
                      className="review-icon-img"
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

          {/* Text and Search Content (Order 2 on mobile, Order 1 on desktop) */}
          <div className="main_ct_contentin order-2 order-md-1 mt-4 mt-md-0 mb-md-5 pb-md-4">
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
                className="hero-typing-text text-warning d-block"
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

        </div>
      </div>
    </div>
  );
}
