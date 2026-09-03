"use client";

import WhyUsClient from "./WhyUsClient";
import "./whyUs.css";
import "react-loading-skeleton/dist/skeleton.css";
import { getPagewithSection } from "@/services/pageSection";
import { useEffect, useState } from "react";

export default function WhyUs() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getPagewithSection(1, "why_choose_us")
      .then(setData)
      .catch((error) => console.error("Failed to fetch why-us section:", error));
  }, []);

  if (!data) return null;

  return <WhyUsClient data={data} mediaPath={process.env.NEXT_PUBLIC_MEDIA_PATH || ""} />;
}
