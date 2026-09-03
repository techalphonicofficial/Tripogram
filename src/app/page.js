// import styles from "./page.module.css";
import Hero from "@/components/Hero/Hero";
import TourCategories from "@/components/TourCategories/TourCategories";
import PopularDestination from "@/components/PopularDestination/PopularDestination";
import AboutSection from "@/components/AboutSection/AboutSection";
import TestimonialSection from "@/components/TestimonialSection/TestimonialSection";
import BlogSection from "@/components/BlogSection/BlogSection";
import PopularTour from "@/components/PopularTour/PopularTour";
import WhyUs from "@/components/WhyChooseUs/WhyUs";
import AdvertisementSectionCard from "@/components/AdvertisementSection/AdvertisementSectionCard";
import { getPagewithSection } from "@/services/pageSection";

// function isCurrentBrandSchema(schema) {
//   return !/enlive|enlivetrips/i.test(schema?.schema || "");
// }


function isCurrentBrandSchema(schema) {
  return !/tripogram|tripogramclub/i.test(schema?.schema || "");
}


async function getHomeData() {
  try {
    const data = await getPagewithSection(1);
    return { data };
  } catch (err) {
    console.error("Failed to fetch home page data:", err);
    return { data: null };
  }
}

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
        <TourCategories />
        <PopularDestination />
        <PopularTour />
        <AboutSection />
        <TestimonialSection />
        <BlogSection />
        <WhyUs />
      </main>
    </>
  );
}

export const revalidate = 60;


