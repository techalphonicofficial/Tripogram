// import styles from "./page.module.css";
import Hero from "@/components/Hero/Hero";
import TourCategories from "@/components/TourCategories/TourCategories";
import PopularDestination from "@/components/PopularDestination/PopularDestination";
import TestimonialSection from "@/components/TestimonialSection/TestimonialSection";
import BlogSection from "@/components/BlogSection/BlogSection";
import PopularTour from "@/components/PopularTour/PopularTour";
import WhyUs from "@/components/WhyChooseUs/WhyUs";
import PartnershipSection from "@/components/PartnershipSection/PartnershipSection";
import AdvertisementSectionCard from "@/components/AdvertisementSection/AdvertisementSectionCard";
import { getPagewithSection } from "@/services/pageSection";

// function isCurrentBrandSchema(schema) {
//   return !/enlive|enlivetrips/i.test(schema?.schema || "");
// }


import { cache } from "react";

function isCurrentBrandSchema(schema) {
  return !/tripogram|tripogramclub/i.test(schema?.schema || "");
}

const getHomeData = cache(async () => {
  try {
    const data = await getPagewithSection(1);
    return { data };
  } catch (err) {
    console.warn("Failed to fetch home page data:", err.message);
    return { data: null };
  }
});

export async function generateMetadata() {
  const { data } = await getHomeData();
  // console.log("gome scheama", data)

  if (!data) {
    return {
      title: "Tripogram",
      description: "Content temporarily unavailable – please try again later",
    };
  }

  return {
    title: data.meta_title,
    description: data.meta_description,
    keywords: data.meta_description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      title: data.meta_title,
      description: data.meta_description,
      keywords: data.meta_description,
    },
    twitter: {
      card: "summary_large_image",
      title: data.meta_title,
      description: data.meta_description,
      // images: [...]
    },
  };
}

export default async function Home() {
  const { data } = await getHomeData();
  // console.log("data", data);
  return (
    <>
      {data?.addon_schemas?.filter(isCurrentBrandSchema).map((schema) => (
        <script
          key={schema.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema.schema }}
        />
      ))}
      <main className="home-page">
        <Hero />
        <AdvertisementSectionCard />
        <div className="bg-top-center" style={{ backgroundImage: "url(/img/bg/about_bg_1.jpg)" }}>
          <TourCategories />
          <PopularDestination />
        </div>
        <div style={{ backgroundImage: "url(/img/bg/partnership-bg.png)", backgroundSize: "cover", backgroundPosition: "center bottom", backgroundRepeat: "no-repeat" }}>
          <PopularTour />
          <PartnershipSection />
        </div>
        <TestimonialSection />
        <BlogSection />
        <WhyUs />
      </main>
    </>
  );
}

export const revalidate = 60;


