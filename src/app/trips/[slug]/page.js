import TourCard from "@/components/PopularTour/TourCard";
import AvailableTrips from "@/components/TripDetail/AvailableTrips";
import Faq from "@/components/TripDetail/Faq";
import TripContent from "@/components/Trips/TripContent";
import { getFaqSchema, getPageFaqs } from "@/data/pageFaqData";
import { singleTrips, tripsWithPackagecount } from "@/services/tripsApi";
import { allPackage } from "@/services/packageApi";
import Link from "next/link";
// import TripContent from "@/components/TripContent"; // import client component

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

const fallbackTripSlugs = [
  "weekend-trips-from-delhi",
  "spiti-valley",
  "backpacking-trips",
  "treks-trails",
  "Best-char-dham-Packages",
  "xmas-new-year-trips-from-delhi",
  "holi-special-trip-from-delhi",
];

const getTrips = async (slug) => {
  return await singleTrips(slug);
};

export async function generateStaticParams() {
  try {
    const trips = await tripsWithPackagecount();
    const apiSlugs = (Array.isArray(trips) ? trips : [])
      .map((trip) => trip?.slug)
      .filter(Boolean);

    return Array.from(new Set([...apiSlugs, ...fallbackTripSlugs]))
      .map((slug) => ({ slug }));
  } catch (error) {
    console.error("Failed to generate trip static params:", error);
    return fallbackTripSlugs.map((slug) => ({ slug }));
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const trips = await getTrips(slug);
  return {
    title: trips.trip.meta_title,
    description: trips.trip.meta_description,
    // keywords: trips.trip.meta_description,
    keywords: trips.trip.meta_keywords,
    // meta_schema is rendered as JSON-LD in the page body below.
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/trips/${slug}`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/trips/${slug}`,
      title: trips.trip.meta_title,
      description: trips.trip.meta_description,
      images: [{ url: trips.trip.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: trips.trip.meta_title,
      description: trips.trip.meta_description,
      images: [trips.trip.thumbnail],
    },
  };
}

export default async function Trips({ params }) {
  const { slug } = await params;
  const trips = await getTrips(slug);
  const fetchedPackages = await allPackage(slug, 1);
  const packagesList = Array.isArray(fetchedPackages) ? fetchedPackages : (fetchedPackages?.data || []);
  const faqs = getPageFaqs("trip", slug, trips.trip.faq);
  const fallbackFaqSchema = getFaqSchema(faqs);
  const pageSchema = trips.trip.meta_schema || fallbackFaqSchema;

  return (
    <>
      {pageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              typeof pageSchema === "string"
                ? pageSchema
                : JSON.stringify(pageSchema),
          }}
        />
      )}

      {/* Breadcrumb */}
      <div
        className="breadcumb-wrapper"
        style={{
          backgroundImage: `url('${trips.trip.banner}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="breadcumb-content">
            <h1 className="breadcumb-title">{trips.trip.heading}</h1>
            <ul className="breadcumb-menu">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>{trips.trip.heading}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* About Trip with toggle */}
      <TripContent content={trips.trip.content} />

      {faqs.length > 0 && <Faq faqs={faqs} />}

      {/* Trips Section */}
      <section
        className="tour-area position-relative bg-top-center overflow-hidden"
        id="service-sec"
      >
        <div className="slider-area tour-slider">
          <div className="container th-container my-5">
            <h2 className="fw-bold mb-4 text-center">Available Trips</h2>
            <AvailableTrips trips={packagesList} />
          </div>
        </div>
      </section>
    </>
  );
}
