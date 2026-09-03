"use client";

import { useEffect, useState } from "react";
import { getPagewithSection } from "@/services/pageSection";
import CurveSlider from "./CurveSlider";
import { homeTrips } from "@/services/tripsApi";

const fallbackContent = {
  section: [
    { data: { Text: "Choose Your Experience" } },
    { data: { Text: "Tour Categories" } },
  ],
};

export default function TourCategories() {
  const [mainpage, setMainpage] = useState(fallbackContent);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      getPagewithSection(1, "categories"),
      homeTrips(),
    ]).then(([pageResult, tripsResult]) => {
      if (pageResult.status === "fulfilled") {
        setMainpage(pageResult.value);
      } else {
        console.error("Failed to fetch tour category content:", pageResult.reason);
      }

      if (tripsResult.status === "fulfilled" && Array.isArray(tripsResult.value)) {
        setTrips(tripsResult.value);
      } else if (tripsResult.status === "rejected") {
        console.error("Failed to fetch home trips:", tripsResult.reason);
      }
    });
  }, []);

  if (!trips.length) {
    return null;
  }

  return (
    <section
      className="category-area bg-top-center pt-8 pb-4"
      style={{ backgroundImage: "url(/img/bg/about_bg_1.jpg)" }}
    >
      <div className="container th-container">
        <div className="title-area text-center">
          <span className="sub-title">
            {mainpage?.section?.[0]?.data?.Text || "Choose Your Experience"}
          </span>
          <h2 className="sec-title">{mainpage?.section?.[1]?.data?.Text || "Tour Categories"}</h2>
        </div>

        <CurveSlider trips={trips} />

        <div className="slider-pagination mt-6 text-center"></div>
      </div>
    </section>
  );
}
