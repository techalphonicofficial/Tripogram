"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import "./Careers.css";

export default function CareersHero() {
  const scrollToPositions = (e) => {
    e.preventDefault();
    const element = document.getElementById("open-positions");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="careers-hero bg-top-center" style={{ backgroundImage: "url(/img/bg/about_bg_1.jpg)", backgroundSize: "cover" }}>
      <div className="container th-container">
        <div className="row align-items-center">
          
          {/* Left Column - Text */}
          <div className="col-lg-6 careers-hero-content">
            <span className="careers-eyebrow">Careers</span>
            <h1>
              New Places.<br />
              New Challenges.<br />
              <span>Limitless Growth.</span>
            </h1>
            <p>
              At Tripogram, we're a passionate team of explorers, dreamers and doers building meaningful travel experiences for people across India and beyond.
              <br /><br />
              Join us and be part of a journey that matters.
            </p>
            
            <Link href="#open-positions" className="th-btn" onClick={scrollToPositions}>
              Explore Open Positions <i className="fa-solid fa-arrow-right ms-2"></i>
            </Link>
            
            {/* Small team members graphic similar to reference */}
            <div className="mt-4 d-flex align-items-center gap-3">
              <div className="d-flex" style={{ marginLeft: "10px" }}>
                {/* These are just placeholder circles if no small avatars exist, 
                    using inline styles to mimic overlapping avatars */}
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#ccc", marginLeft: "-10px", border: "2px solid #fff" }}></div>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#ddd", marginLeft: "-10px", border: "2px solid #fff" }}></div>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#eee", marginLeft: "-10px", border: "2px solid #fff" }}></div>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#ccc", marginLeft: "-10px", border: "2px solid #fff" }}></div>
              </div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                40+ amazing people<br />building experiences
              </span>
            </div>
          </div>

          {/* Right Column - Images Composition */}
          <div className="col-lg-6 mt-5 mt-lg-0">
            <div className="careers-hero-images">
              <div className="hero-decoration-dots dots-1"></div>
              <div className="hero-decoration-dots dots-2"></div>
              
              {/* Main Blob Image */}
              <div className="hero-img-main">
                <Image 
                  src="/img/trip/tour_1_1.jpg" // Fallback to existing tour image
                  alt="Team exploring" 
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>

              {/* Secondary Overlapping Image */}
              <div className="hero-img-secondary">
                <Image 
                  src="/img/trip/tour_1_3.jpg" // Fallback to existing tour image
                  alt="Van driving in mountains" 
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
