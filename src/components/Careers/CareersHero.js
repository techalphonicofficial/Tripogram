"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./Careers.css";
import { getCareersHero, getCareersHeroLabels } from "@/services/careersApi";
import { formatImageUrl } from "@/utils/formatImage";

const FALLBACK_HERO = {
  eyebrow: "Careers",
  heading_line1: "New Places.",
  heading_line2: "New Challenges.",
  heading_line3: "Limitless Growth.",
  description:
    "At Tripogram, we're a passionate team of explorers, dreamers and doers building meaningful travel experiences for people across India and beyond.\n\nJoin us and be part of a journey that matters.",
  cta_label: "Explore Open Positions",
  image_main: "/img/tour/tour-1_1.jpg",
  image_secondary: "/img/tour/tour-1_3.jpg",
};

const FALLBACK_LABELS = {
  team_label: "40+ amazing people building experiences",
  avatars: [
    { image: "/img/team/team_1_1.jpg", name: "Team member" },
    { image: "/img/team/team_1_2.jpg", name: "Team member" },
    { image: "/img/team/team_1_3.jpg", name: "Team member" },
    { image: "/img/team/team_1_4.jpg", name: "Team member" },
  ],
};

export default function CareersHero() {
  const [hero, setHero] = useState(FALLBACK_HERO);
  const [labels, setLabels] = useState(FALLBACK_LABELS);

  useEffect(() => {
    async function fetchData() {
      try {
        const [heroData, labelsData] = await Promise.all([
          getCareersHero(),
          getCareersHeroLabels(),
        ]);
        if (heroData) setHero({ ...FALLBACK_HERO, ...heroData });
        if (labelsData) {
          setLabels({
            ...FALLBACK_LABELS,
            ...labelsData,
            avatars: labelsData.avatars?.length ? labelsData.avatars : FALLBACK_LABELS.avatars,
          });
        }
      } catch (err) {
        console.log("CareersHero: Using fallback data", err);
      }
    }
    fetchData();
  }, []);

  const scrollToPositions = (e) => {
    e.preventDefault();
    const element = document.getElementById("open-positions");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="careers-hero bg-top-center"
      style={{ backgroundImage: "url(/img/bg/about_bg_1.jpg)", backgroundSize: "cover" }}
    >
      <div className="container th-container">
        <div className="row align-items-center">

          {/* Left Column - Text */}
          <div className="col-lg-6 careers-hero-content text-center text-lg-start">
            <span className="careers-eyebrow">{hero.eyebrow}</span>
            <h1>
              {hero.heading_line1 && <>{hero.heading_line1}<br /></>}
              {hero.heading_line2 && <>{hero.heading_line2}<br /></>}
              {hero.heading_line3 && <span>{hero.heading_line3}</span>}
            </h1>
            <p>
              {hero.description?.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < hero.description.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>

            <Link href="#open-positions" className="th-btn" onClick={scrollToPositions}>
              {hero.cta_label || "Explore Open Positions"}{" "}
              <i className="fa-solid fa-arrow-right ms-2"></i>
            </Link>

            {/* Team members label */}
            <div className="mt-4 d-flex justify-content-center justify-content-lg-start align-items-center gap-3">
              <div className="d-flex" style={{ marginLeft: "10px" }}>
                {labels.avatars?.filter((avatar) => avatar?.image || avatar?.avatar || avatar?.url).length > 0 ? (
                  labels.avatars.filter((avatar) => avatar?.image || avatar?.avatar || avatar?.url).slice(0, 4).map((avatar, i) => (
                    <img
                      key={i}
                      src={formatImageUrl(avatar.image || avatar.avatar || avatar.url, "/img/team/team_1_1.jpg")}
                      alt={avatar.name || "Team member"}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: i === 0 ? "0" : "-10px",
                        border: "2px solid #fff",
                      }}
                    />
                  ))
                ) : (
                  // Placeholder circles if no avatars
                  ["#ccc", "#ddd", "#eee", "#ccc"].map((bg, i) => (
                    <div
                      key={i}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: bg,
                        marginLeft: i === 0 ? "0" : "-10px",
                        border: "2px solid #fff",
                      }}
                    />
                  ))
                )}
              </div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                {labels.team_label}
              </span>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="col-lg-6 mt-5 mt-lg-0">
            <div className="careers-hero-images">
              <div className="hero-decoration-dots dots-1"></div>
              <div className="hero-decoration-dots dots-2"></div>

              <div className="hero-img-main">
                <Image
                  src={formatImageUrl(hero.image_main, "/img/tour/tour-1_1.jpg")}
                  alt="Team exploring"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>

              <div className="hero-img-secondary">
                <Image
                  src={formatImageUrl(hero.image_secondary, "/img/tour/tour-1_3.jpg")}
                  alt="Van driving in mountains"
                  fill
                  style={{ objectFit: "cover" }}
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
