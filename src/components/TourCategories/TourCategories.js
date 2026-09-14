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
      if (pageResult.status === "fulfilled" && pageResult.value?.section) {
        setMainpage(pageResult.value);
      } else {
        console.log("Failed to fetch tour category content:", pageResult.reason);
      }

      if (tripsResult.status === "fulfilled" && Array.isArray(tripsResult.value)) {
        setTrips(tripsResult.value);
      }
    });
  }, []);

  if (!trips || trips.length === 0) return null;

  return (
    <section
      className="category-area pt-8 pb-4"
      style={{ marginTop: 0 }}
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


