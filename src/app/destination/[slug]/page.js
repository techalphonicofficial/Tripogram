import AvailableTrips from "@/components/TripDetail/AvailableTrips";
import Faq from "@/components/TripDetail/Faq";
import TripContent from "@/components/Trips/TripContent";
import { getFaqSchema, getPageFaqs } from "@/data/pageFaqData";
import { getHomeDestination, singleDestination } from "@/services/destinationApi";
import Link from "next/link";
// import TripContent from "@/components/TripContent"; // import client component

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

const getSingleDestinationData = async (slug) => {
  return await singleDestination(slug);
};

export async function generateStaticParams() {
  try {
    const destinations = await getHomeDestination();
    return (Array.isArray(destinations) ? destinations : [])
      .filter((destination) => destination?.slug)
      .map((destination) => ({ slug: destination.slug }));
  } catch (error) {
    console.error("Failed to generate destination static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const trips = await getSingleDestinationData(slug);
  // console.log("trips", trips);
  return {
    title: trips.trip.meta_title,
    description: trips.trip.meta_description,
    // keywords: trips.trip.meta_description,
    keywords: trips.trip.meta_keywords,
    // meta_schema is rendered as JSON-LD in the page body below.
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/destination/${slug}`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/destination/${slug}`,
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
  const trips = await getSingleDestinationData(slug);
  const faqs = getPageFaqs("destination", slug, trips.trip.faq);
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
            <h1 className="breadcumb-title">{trips.trip.name}</h1>
            <ul className="breadcumb-menu">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>{trips.trip.name}</li>
            </ul>
          </div>
        </div>
      </div>

      {trips.trip.content && <TripContent content={trips.trip.content} />}

      {faqs.length > 0 && <Faq faqs={faqs} />}

      {/* Trips Section */}
      <section
        className="tour-area position-relative bg-top-center overflow-hidden"
        id="service-sec"
      >
        <div className="slider-area tour-slider">
          <div className="container th-container my-5">
            <h2 className="fw-bold mb-4 text-center">Available Trips</h2>
            <AvailableTrips trips={trips.packages} />
          </div>
        </div>
      </section>
    </>
  );
}
