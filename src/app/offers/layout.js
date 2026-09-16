export const metadata = {
  title: "Exclusive Travel Offers & Deals | Tripogram",
  description: "Grab the best deals, limited-time offers and special discounts on your dream destinations. Travel more, spend less with Tripogram.",
  keywords: ["Travel Offers", "Trip Discounts", "Vacation Deals", "Holiday Packages Sale", "Tripogram Offers"],
  openGraph: {
    title: "Exclusive Travel Offers & Deals | Tripogram",
    description: "Grab the best deals, limited-time offers and special discounts on your dream destinations.",
    url: "https://www.tripogramclub.com/offers",
    images: [
      {
        url: "/tripogramLogo.png",
        width: 1200,
        height: 630,
        alt: "Tripogram Offers",
      },
    ],
  },
};

export default function OffersLayout({ children }) {
  return <>{children}</>;
}
