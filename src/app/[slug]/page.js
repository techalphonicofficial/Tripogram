import TestimonialPackageSection from "@/components/TestimonialSection/TestimonialPackageSection";
import AgeLimit from "@/components/TripDetail/AgeLimit";
import Batches from "@/components/TripDetail/Batches";
import BookNow from "@/components/TripDetail/BookNow";
import Dates from "@/components/TripDetail/Dates";
import DownloadPdf from "@/components/TripDetail/DownloadPdf";
import Exclusions from "@/components/TripDetail/Exclusions";
import Faq from "@/components/TripDetail/Faq";
import Gallery from "@/components/TripDetail/Gallery";
import Inclusions from "@/components/TripDetail/Inclusions";
import Instavideo from "@/components/TripDetail/Instavideo";
import Itinerary from "@/components/TripDetail/Itinerary";
import Notes from "@/components/TripDetail/Notes";
import Overview from "@/components/TripDetail/Overview";
import OverviewCont from "@/components/TripDetail/OverviewCont";
import RelatedBlogs from "@/components/TripDetail/RelatedBlogs";
import RelatedTrips from "@/components/TripDetail/RelatedTrips";
import RelatedYoutube from "@/components/TripDetail/RelatedYoutube";

import TripHero from "@/components/TripDetail/TripHero";
import TripInfo from "@/components/TripDetail/TripInfo";
import HorizontalBookingBar from "@/components/TripDetail/HorizontalBookingBar";
import { allPackage, packageRedirection, singlePackage, trendingPackage } from "@/services/packageApi";
import { singleTrips } from "@/services/tripsApi";
import { notFound } from "next/navigation";
import { permanentRedirect } from "next/navigation";
import { cache } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;
const staticExportPlaceholderSlug = "_static-export-placeholder";

const getSinglePackage = cache(async (slug) => {
  return await singlePackage(slug);
});

function getPackageItems(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.packages)) return data.packages;
  if (Array.isArray(data?.data?.data)) return data.data.data;
  return [];
}

export async function generateStaticParams() {
  try {
    const [allPackagesResult, trendingPackagesResult] = await Promise.allSettled([
      allPackage("", 1),
      trendingPackage(),
    ]);

    const packages = [
      ...(allPackagesResult.status === "fulfilled" ? getPackageItems(allPackagesResult.value) : []),
      ...(trendingPackagesResult.status === "fulfilled" ? getPackageItems(trendingPackagesResult.value) : []),
    ];

    const slugs = Array.from(new Set(packages.map((item) => item?.slug).filter(Boolean)));
    return (slugs.length ? slugs : [staticExportPlaceholderSlug])
      .map((slug) => ({ slug }));
  } catch (error) {
    console.error("Failed to generate package static params:", error);
    return [{ slug: staticExportPlaceholderSlug }];
  }
}

function formatAmountIntl(amount) {
  return new Intl.NumberFormat('en-US').format(amount);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (slug === staticExportPlaceholderSlug) {
    return {
      title: "Not Found",
      robots: { index: false, follow: false },
    };
  }

  const single_package = await getSinglePackage(slug);
  // console.log("ggggggg",slug);

  return {
    title: single_package.meta_title,
    description: single_package.meta_description,
    keywords: single_package.meta_description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`,
    },
    openGraph: {
      type: "article",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`,
      title: single_package.meta_title,
      description: single_package.meta_description,
      images: [{ url: single_package.banner }],
    },
    twitter: {
      card: "summary_large_image",
      title: single_package.meta_title,
      description: single_package.meta_description,
      images: [single_package.banner],
    },
  };
}

export default async function Tripdetail({ params }) {
  const { slug } = await params;
  if (slug === staticExportPlaceholderSlug) return notFound();

  const single_package = await getSinglePackage(slug);
  // console.log("single_package------",single_package)
  // console.log("params", await params)

  if (!single_package) return notFound();
  const trips = single_package?.trips?.length > 0 ? await singleTrips(single_package.trips[0].slug) : { packages: [] };
  const redirection = await packageRedirection(single_package.slug);

  if (redirection.hasOwnProperty("id")) {
    if (redirection.to_type == "trip") {
      return permanentRedirect(`/trips/${redirection.to_url}`);
    } else {
      return permanentRedirect(`/${redirection.to_url}`);
    }
  }
  // console.log("singlePackage asdj", single_package)
  return (
    <>
      {Array.isArray(single_package?.addon_schema) &&
        single_package.addon_schema.map((item, index) => {
          try {
            // Test if it's valid JSON
            JSON.parse(item.schema);

            return (
              <script
                key={item.id || index}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: item.schema,
                }}
              />
            );
          } catch (error) {
            console.error("Invalid schema skipped:", error.message);
            return null;
          }
        })}
      <TripHero
        title={single_package.title}
        duration={single_package.duration}
        starting_price={single_package.starting_price}
        age_group={single_package.age_group}
        pickup={single_package.pickup}
        drop={single_package.drop}
        banner={single_package?.banner}
        thumbnail={single_package?.thumbnail}
      />
      <div className="container th-container">
        <div className="row orderchage-formob">
          <div className="col-xxl-12 col-lg-12 position-relative z-3">
            <TripInfo
              pickup={single_package.pickup}
              drop={single_package.drop}
              duration={single_package.duration}
              trip={single_package.trips?.[0]?.heading || ''}
              completedata={single_package}
            />

            <div className="mt-4">
              <HorizontalBookingBar
                id={single_package.id}
                slug={single_package.slug}
                starting_price={single_package.starting_price}
                startingFrom={single_package?.starting_from}
                activeCosts={single_package?.active_costs || []}
                bookingAmont={single_package?.booking_amount}
                showBookNoButton={single_package?.show_book_no_button}
                bookingButton={
                  single_package?.package_dates?.length > 0 &&
                  single_package?.active_costs?.length > 0
                }
                package_dates={single_package.package_dates || []}
                pickup={single_package.pickup}
                drop={single_package.drop}
              />
              
              {/* Moved DownloadPdf / Send Inquiry directly below HorizontalBookingBar */}
              <div className="d-flex justify-content-end w-100 mt-2">
                <div style={{ maxWidth: '400px', width: '100%' }}>
                  <DownloadPdf
                    id={single_package.id}
                    itinerary_pdf={single_package.itinerary_pdf}
                    completedata={single_package}
                  />
                </div>
              </div>
            </div>

            {/* <TripBanner /> */}
            <OverviewCont hasGallery={single_package.gallery?.length > 0} />
            <div id="Overview">
              <Overview
                description={single_package.description}
                itinerary_pdf={single_package.itinerary_pdf}
              />
            </div>
            {/* <AgeLimit /> */}
            <div id="Itinerary">
              <Itinerary itinerary={single_package.itinerary} slots={single_package.slot} />
            </div>
            {single_package.gallery?.length > 0 && (
              <div id="Gallery">
                <Gallery gallery={single_package.gallery || []} title={single_package.title} />
              </div>
            )}
            <div id="Inclusions">
              <Inclusions inclusion={single_package.inclusion} />
            </div>
            <div id="Exclusions">
              <Exclusions exclusion={single_package.exclusion} />
            </div>
            {single_package.package_dates?.length > 0 && (
              <div id="Costing">
                <Dates
                  active_costs={single_package.active_costs || []}
                  package_dates={single_package.package_dates || []}
                />
              </div>
            )}

            {single_package.note &&
              single_package.note.replace(/<[^>]*>/g, '').trim() !== '' && (
                <Notes note={single_package.note} />
              )}

            {single_package.faqs && single_package.faqs.length > 0 && (
              <Faq faqs={single_package.faqs || []} />
            )}

            {single_package.map_image && (
              // <div className="container d-lg-none">
              // <div className="container mt-4 mb-4">
              <div className="min_box-detail Age_limit container mt-24 position-relative z-0">
                <div className="title">
                  <h6 className="text-center text-md-start fw-bold mb-3 mb-md-4 page-title">
                    Route Map
                  </h6>
                </div>
                <img src={`${single_package.map_image}`} alt={single_package.title} className="img-fluid rounded" />
              </div>
            )}

          </div>

        </div>
      </div>

      {/* <MiddleContent /> */}
      <Instavideo related_insta_video={single_package.related_insta_video} />

      {single_package?.related_youtube_video?.length > 0 && (
        <RelatedYoutube
          related_youtube_video={single_package.related_youtube_video}
        />
      )}


      <TestimonialPackageSection testimonials={single_package?.testimonials} />

      {/* <RelatedBlogs
        title={single_package.title}
        destination={single_package.destination.name}
        trip={single_package.trip.heading}
      /> */}
      <RelatedTrips trips={trips?.packages || []} />
    </>
  );
}
