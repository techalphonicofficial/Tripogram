import { getPagewithSection } from "@/services/pageSection";
import Link from "next/link";
import React from "react";

export async function generateMetadata() {
  const mainpage = await getPagewithSection(9);
  console.log("mainpage",mainpage);

  return {
    title: mainpage?.meta_title || "Cancellation Policy | Tripogram",
    description:
      mainpage?.meta_description ||
      "Review the Tripogram cancellation policy before booking your trip.",
    keywords: mainpage?.meta_description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/cancellation-policy`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancellation-policy`,
      title: mainpage?.meta_title || "Cancellation Policy | Tripogram",
      description:
        mainpage?.meta_description ||
        "Review the Tripogram cancellation policy before booking your trip.",
      keywords: mainpage?.meta_description,
    },
    twitter: {
      card: "summary_large_image",
      title: mainpage?.meta_title || "Cancellation Policy | Tripogram",
      description:
        mainpage?.meta_description ||
        "Review the Tripogram cancellation policy before booking your trip.",
    },
  };
}

export default async function CancellationPolicy() {
  const mainpage = await getPagewithSection(9);
  // const policyContent = mainpage?.sections?.[0]?.section?.[0]?.data?.rich_text;
  const policyContent = mainpage?.sections
    ?.flatMap((pageSection) => pageSection?.section || [])
    ?.find((sectionItem) => sectionItem?.type === "rich_text" && sectionItem?.data?.rich_text)
    ?.data?.rich_text;

  return (
    <>
      <div
        className="breadcumb-wrapper"
        style={{
          backgroundImage: "url('/img/bg/breadcumb-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="breadcumb-content">
            <h1 className="breadcumb-title">
              {mainpage?.name || "Cancellation Policy"}
            </h1>
            <ul className="breadcumb-menu">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>{mainpage?.name || "Cancellation Policy"}</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="space">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12 col-lg-12">
              <div className="page-single">
                <div className="page-content d-block">
                  {policyContent ? (
                    <div dangerouslySetInnerHTML={{ __html: policyContent }} />
                  ) : (
                    <p>Cancellation policy content is currently unavailable.</p>
                  )}

                  {/* Previous hardcoded content kept for reference.
                  <h2>Cancellation Policy</h2>
                  <p>
                    We understand that travel plans can change. Please review the
                    cancellation terms below before confirming your booking with
                    Tripogram.
                  </p>
                  <h3>Cancellation Requests</h3>
                  <p>
                    All cancellation requests must be shared with our team through
                    the official support channels. The cancellation date will be
                    considered from the time our team receives the request.
                  </p>
                  <h3>Refund Eligibility</h3>
                  <p>
                    Refunds, if applicable, depend on the package type, departure
                    date, vendor policies, and the amount already paid for hotels,
                    transport, permits, activities, or other trip arrangements.
                  </p>
                  <h3>Non-Refundable Charges</h3>
                  <p>
                    Booking amounts, convenience fees, payment gateway charges,
                    permits, confirmed activity charges, and vendor cancellation
                    charges may be non-refundable.
                  </p>
                  <h3>Processing Time</h3>
                  <p>
                    Approved refunds are processed after verification and may take
                    standard banking or payment gateway timelines to reflect in the
                    original payment method.
                  </p>
                  <h3>Trip Changes By Tripogram</h3>
                  <p>
                    In case a trip is changed, postponed, or cancelled due to
                    weather, safety concerns, operational reasons, government
                    restrictions, or unavoidable circumstances, our team will guide
                    you with the available alternatives.
                  </p>
                  */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export const revalidate = 60;


