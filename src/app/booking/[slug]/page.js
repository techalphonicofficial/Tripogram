import { allPackage, razorpay, singlePackage, trendingPackage } from "@/services/packageApi";
import BookingPageClient from "./BookingPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;
const staticExportPlaceholderSlug = "_static-export-placeholder";

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
    console.error("Failed to generate booking static params:", error);
    return [{ slug: staticExportPlaceholderSlug }];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (slug === staticExportPlaceholderSlug) {
    return {
      title: "Not Found",
      robots: { index: false, follow: false },
    };
  }

  const single_package = await singlePackage(slug);

  if (!single_package) return {};
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
      images: [
        {
          url: single_package.meta_image,
          width: 1200,
          height: 630,
          alt: single_package.meta_title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: single_package.meta_title,
      description: single_package.meta_description,
      images: [single_package.meta_image],
    },
  };
}

export default async function BookingPage({ params }) {
  const { slug } = await params;
  if (slug === staticExportPlaceholderSlug) return null;

  const razorpay_key = await razorpay();

  return <BookingPageClient razorpay_key={razorpay_key} />;
}
