"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { gsap } from "gsap";
import "swiper/css";
import "swiper/css/pagination";
import { getPagewithSection } from "@/services/pageSection";
import { getBlogs } from "@/services/blogApi";

export default function BlogSection() {
  const [mainpage, setMainpage] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const shapesRef = useRef([]);

  useEffect(() => {
    Promise.allSettled([
      getPagewithSection(1, "blogs"),
      getBlogs(),
    ]).then(([pageResult, blogsResult]) => {
      if (pageResult.status === "fulfilled") {
        setMainpage(pageResult.value);
      } else {
        console.error("Failed to fetch blog section:", pageResult.reason);
      }

      if (blogsResult.status === "fulfilled") {
        setBlogPosts(Array.isArray(blogsResult.value?.data) ? blogsResult.value.data : []);
      } else {
        console.error("Failed to fetch blog posts:", blogsResult.reason);
      }
    });
  }, []);

  useEffect(() => {
    // Animate shapes on mount
    shapesRef.current.forEach((shape) => {
      const top = shape.dataset.top || "0%";
      const left = shape.dataset.left || "0%";
      gsap.set(shape, { top, left, position: "absolute" });

      // Example simple floating animation
      gsap.to(shape, {
        y: 20,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    });
  }, []);


  if (!mainpage || !blogPosts.length) return null;

  return (
    <section className="bg-smoke overflow-hidden space !pb-20" id="blog-sec">
      <div className="container">
        <div className="mb-30 text-center text-md-start">
          <div className="row align-items-center justify-content-between">
            <div className="col-md-7">
              <div className="title-area mb-md-0">
                <span className="sub-title">{mainpage.section?.[0]?.data?.Text}</span>
                <h2 className="sec-title">{mainpage.section?.[1]?.data?.Text}</h2>
              </div>
            </div>
            <div className="col-md-auto">
              <Link href="blog" className="th-btn style4 th-icon">
                See More Articles
              </Link>
            </div>
          </div>
        </div>

        <div className="slider-area">
          <Swiper
            modules={[Autoplay]}
            loop={true}
            grabCursor={true}
            speed={1000}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={30}
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            className="th-slider has-shadow"
          >
            {blogPosts.map((blog) => (
              <SwiperSlide key={blog.id}>
                <div className="blog-box th-ani h-100 d-flex flex-column">
                  <div className="blog-img global-img">
                    <Image
                      src={blog.image}
                      alt="nothing"
                      width={500}
                      height={300}
                      className="w-100"
                      style={{ height: "240px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="blog-box_content d-flex flex-column flex-grow-1">
                    <div className="blog-meta">
                      <Link className="author" href="blog">
                        {blog.created_at}
                      </Link>
                    </div>
                    <h3 className="box-title flex-grow-1">
                      <Link href={`blog/${blog.slug}`}>{blog.heading}</Link>
                    </h3>
                    <Link
                      href={`blog/${blog.slug}`}
                      className="th-btn style4 th-icon mt-auto align-self-start"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Shapes with GSAP */}
        <div
          className="shape-mockup shape1 d-none d-xl-block"
          data-top="12%"
          data-left="-16%"
          ref={(el) => (shapesRef.current[0] = el)}
        >
          <Image
            src="/img/shape/shape_1.png"
            alt="shape"
            width={15}
            height={15}
          />
        </div>

        <div
          className="shape-mockup shape2 d-none d-xl-block"
          data-top="20%"
          data-left="-16%"
          ref={(el) => (shapesRef.current[1] = el)}
        >
          <Image
            src="/img/shape/shape_2.png"
            alt="shape"
            width={60}
            height={60}
          />
        </div>

        <div
          className="shape-mockup shape3 d-none d-xl-block"
          data-top="14%"
          data-left="-10%"
          ref={(el) => (shapesRef.current[2] = el)}
        >
          <Image
            src="/img/shape/shape_3.png"
            alt="shape"
            width={40}
            height={40}
          />
        </div>
      </div>
    </section>
  );
}
//sssss 