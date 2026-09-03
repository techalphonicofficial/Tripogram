import { Poppins } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import 'swiper/css';

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Disable auto CSS injection
config.autoAddCss = false;

import Header from "@/components/Partials/Header";
import Footer from "@/components/Partials/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tripogramclub.com";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";



// ✅ Poppins font
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});



export const viewport = {
  themeColor: "#ffffff",
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Tripogram",
  description: "Tripogram",
  authors: [{ name: "Tripogram" }],
  keywords: [
    "Travel",
    "Tour Booking",
    "Tripogram",
    "Travel Agency",
    "Holiday Booking"
  ],
  robots: "index, follow",

  // 🔹 Open Graph (Facebook, LinkedIn, WhatsApp, etc.)
  openGraph: {
    title: "Tripogram",
    description: "Book your tours and travel experiences with Tripogram.",
    url: siteUrl,
    siteName: "Tripogram",
    images: [
      {
        url: "/tripogramLogo.png",
        width: 1200,
        height: 630,
        alt: "Tripogram",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // 🔹 Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Tripogram",
    description: "Plan your dream vacation with Tripogram, your trusted travel partner.",
    creator: "@yourtwitterhandle",
    images: ["/tripogramLogo.png"],
  },

  // 🔹 Favicons
  icons: {
    icon: [
      { url: "/tripogramIcon.jpg", sizes: "16x16", type: "image/jpeg" },
      { url: "/tripogramIcon.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/tripogramIcon.jpg", sizes: "96x96", type: "image/jpeg" },
    ],
    apple: [
      { url: "/tripogramIcon.jpg", sizes: "57x57" },
      { url: "/tripogramIcon.jpg", sizes: "60x60" },
      { url: "/tripogramIcon.jpg", sizes: "72x72" },
      { url: "/tripogramIcon.jpg", sizes: "76x76" },
      { url: "/tripogramIcon.jpg", sizes: "114x114" },
      { url: "/tripogramIcon.jpg", sizes: "120x120" },
      { url: "/tripogramIcon.jpg", sizes: "144x144" },
      { url: "/tripogramIcon.jpg", sizes: "152x152" },
      { url: "/tripogramIcon.jpg", sizes: "180x180" },
    ],
    other: [
      { rel: "msapplication-TileImage", url: "/tripogramIcon.jpg" },
    ],
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <head />
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
