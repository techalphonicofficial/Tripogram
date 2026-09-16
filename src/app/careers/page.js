import React from "react";
import CareersHero from "@/components/Careers/CareersHero";
import CareerStats from "@/components/Careers/CareerStats";
import WhyJoinUs from "@/components/Careers/WhyJoinUs";
import OpenPositions from "@/components/Careers/OpenPositions";
import CareerFaqs from "@/components/Careers/CareerFaqs";

export const metadata = {
  title: "Careers at Tripogram | Explore Opportunities With Us",
  description: "Join Tripogram and build meaningful travel experiences. Explore career opportunities across sales, operations, marketing, HR and more.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/careers`,
  },
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/careers`,
    title: "Careers at Tripogram | Explore Opportunities With Us",
    description: "Join Tripogram and build meaningful travel experiences. Explore career opportunities across sales, operations, marketing, HR and more.",
  },
};

export default function CareersPage() {
  return (
    <main className="careers-page">
      <CareersHero />
      <CareerStats />
      <WhyJoinUs />
      <OpenPositions />
      <CareerFaqs />
    </main>
  );
}
