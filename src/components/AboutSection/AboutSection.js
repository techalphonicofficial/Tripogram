"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import AboutItem from "./AboutItem";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { getPagewithSection } from "@/services/pageSection";

const fallbackAboutImages = [
  "/img/normal/about_1_1.jpg",
  "/img/normal/about_1_2.jpg",
  "/img/normal/about_1_3.jpg",
];

const fallbackAboutIcons = [
  "/img/icon/about_1_1.svg",
  "/img/icon/about_1_2.svg",
];

function getImageSrc(imagePath, fallbackSrc) {
  if (!imagePath) return fallbackSrc;
  if (/^https?:\/\//i.test(imagePath) || imagePath.startsWith("/")) return imagePath;
  return `${process.env.NEXT_PUBLIC_MEDIA_PATH || ""}${imagePath}`;
}

function getRelativeUrl(url) {
  if (!url) return "#";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("tripogramclub.com") || parsed.hostname.includes("tripogram.com")) {
      return parsed.pathname + parsed.search + parsed.hash;
    }
  } catch (e) {
    return url;
  }
  return url;
}

export default function AboutSection() {
  const [mainpage, setMainpage] = useState(null);
  const shapesRef = useRef([]);

  useEffect(() => {
    getPagewithSection(1, "trip_with_us")
      .then(setMainpage)
      .catch((error) => console.error("Failed to fetch about section:", error));
  }, []);

  useEffect(() => {
    // Animate shapes on mount
    shapesRef.current.forEach(shape => {
      const top = shape.dataset.top || "0%";
      const left = shape.dataset.left || "0%";
      gsap.set(shape, { top, left, position: "absolute" });

      // Example simple floating animation
      gsap.to(shape, {
        y: 20,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    });
  }, []);

  if (!mainpage) return null;

  return (
    <section className="about-area position-relative overflow-hidden space" id="about-sec">
      <div className="container shape-mockup-wrap">
        <div className="row align-items-center">
          {/* Left Images */}
          <div className="col-xl-6">
            <div className="img-box1">
              <div className="img1 mb-3">
                <Image src={
                  getImageSrc(mainpage.section[0]?.data?.image, fallbackAboutImages[0])
                } alt="About" width={315} height={300} />
              </div>
              <div className="img2 mb-3">
                <Image src={
                  getImageSrc(mainpage.section[1]?.data?.image, fallbackAboutImages[1])
                } alt="About" width={315} height={300} />
              </div>
              <div className="img3 mb-3">
                <Image src={
                  getImageSrc(mainpage.section[2]?.data?.image, fallbackAboutImages[2])
                } alt="About" width={315} height={300} />
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="col-xl-6">
            <div className="ps-xl-4 ms-xl-2">
              <div className="title-area mb-20 pe-xl-5 me-xl-5">
                <span className="sub-title style1">{mainpage.section[3].data.Text}</span>
                <h2 className="sec-title mb-20 pe-xl-5 me-xl-5 heading">
                  {mainpage.section[4].data.Text}
                </h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mainpage.section[5].data.rich_text,
                  }}
                />
              </div>

              <div className="about-item-wrap">
                {mainpage.section
                  .slice(6, 8)
                  .map((item, index) => {
                    const title = item.data.section[1].data.Text;

                    return (
                      <AboutItem
                        key={item.id || `${title}-${index}`}
                        icon={getImageSrc(item.data.section[0]?.data?.image, fallbackAboutIcons[index])}
                        title={title}
                        text={item.data.section[2].data.content}
                      />
                    );
                  })}
              </div>

              <div className="mt-35">
                <Link href={getRelativeUrl(mainpage.section[8].data.button_link)} className="th-btn style3 th-icon">
                  {mainpage.section[8].data.button_label}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Shapes with GSAP */}
        <div
          className="shape-mockup shape1 d-none d-xl-block"
          data-top="12%"
          data-left="-16%"
          ref={el => shapesRef.current[0] = el}
        >
          <Image src="/img/shape/shape_1.png" alt="shape" width={15} height={15} />
        </div>

        <div
          className="shape-mockup shape2 d-none d-xl-block"
          data-top="20%"
          data-left="-16%"
          ref={el => shapesRef.current[1] = el}
        >
          <Image src="/img/shape/shape_2.png" alt="shape" width={60} height={60} />
        </div>

        <div
          className="shape-mockup shape3 d-none d-xl-block"
          data-top="14%"
          data-left="-10%"
          ref={el => shapesRef.current[2] = el}
        >
          <Image src="/img/shape/shape_3.png" alt="shape" width={40} height={40} />
        </div>

        <div
          className="shape-mockup about-shape movingX d-none d-xxl-block"
          style={{ right: "-11%", bottom: "0%", position: "absolute" }}
        >
          <Image src="/img/normal/about-slide-img.png" alt="shape" width={225} height={200} />
        </div>

        <div
          className="shape-mockup about-rating d-none d-xxl-block"
          style={{ right: "-20%", bottom: "50%", position: "absolute" }}
        >
          <FontAwesomeIcon icon={faStar} className="fs-6 d-block m-auto " style={{ color: "#ffb827" }} /> <span>4.9k</span>
        </div>

        <div
          className="shape-mockup about-emoji d-none d-xxl-block"
          style={{ right: "5%", bottom: "25%", position: "absolute" }}
        >
          <Image src="/img/icon/emoji.png" alt="emoji" width={62} height={62} />
        </div>
      </div>
    </section>
  );
}
