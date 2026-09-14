"use client";
import { api } from "@/services/config";
import { getPagewithSection } from "@/services/pageSection";
import { tripsWithPackagecount } from "@/services/tripsApi";
import {
  faFacebookF,
  faInstagram,
  faLinkedin,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { companyInfo } from "@/constants/companyInfo";

const whatsappMessage = "Hello Tripogram! I'm interested for a Trip";
const footerContact = {
  companyName: "Tripogram Club OPC Pvt Ltd",
  gst: "07AAJCT8023A1ZL",
  address: "2-A Kundan Mansion, Asaf Ali Rd, New Delhi (110002)",
  mapHref: "https://www.google.com/maps/search/?api=1&query=2-A%20Kundan%20Mansion%2C%20Asaf%20Ali%20Rd%2C%20New%20Delhi%20110002",
  phone: "+91 8287876816",
  phoneHref: "tel:+918287876816",
  email: "Mail@tripogramclub.com",
  emailHref: "mailto:Mail@tripogramclub.com",
  website: "www.tripogramclub.com",
  websiteHref: "https://www.tripogramclub.com",
};

function getWhatsappUrl(url) {
  try {
    const whatsappUrl = new URL(
      url || `https://api.whatsapp.com/send/?phone=918287876816`
    );
    whatsappUrl.searchParams.set("phone", "918287876816");
    whatsappUrl.searchParams.set("text", whatsappMessage);
    return whatsappUrl.toString();
  } catch {
    return `https://api.whatsapp.com/send/?phone=918287876816&text=${encodeURIComponent(whatsappMessage)}`;
  }
}

function getSafeHref(url, fallback = "#") {
  return typeof url === "string" && url.trim() ? url : fallback;
}

function getFooterTextValues(value) {
  if (!value) return [];
  if (typeof value === "string") return [value];
  if (typeof value === "number") return [String(value)];
  if (Array.isArray(value)) return value.flatMap(getFooterTextValues);
  if (typeof value === "object") return Object.values(value).flatMap(getFooterTextValues);
  return [];
}

function getBackendFooterContact(footer) {
  const values = footer?.section?.flatMap((item) => getFooterTextValues(item.data)) || [];
  const emailMatch = values.join(" ").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneSource = values.find((value) => /(?:\+?91[\s-]?)?[6-9]\d{9}/.test(value));
  const phoneMatch = phoneSource?.match(/(?:\+?91[\s-]?)?([6-9]\d{9})/);
  const phone = phoneMatch ? `+91 ${phoneMatch[1].slice(0, 5)} ${phoneMatch[1].slice(5)}` : "";

  return {
    phone,
    phoneHref: phone ? `tel:+91${phoneMatch[1]}` : "",
    email: emailMatch?.[0] || "",
    emailHref: emailMatch?.[0] ? `mailto:${emailMatch[0]}` : "",
  };
}

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [footer, setFooter] = useState(null);
  const [tripsWithcount, setTripsWithcount] = useState([]);
  const backendFooterContact = getBackendFooterContact(footer);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      getPagewithSection(6, "footer"),
      tripsWithPackagecount(),
    ]).then(([footerResult, tripsResult]) => {
      if (!isMounted) return;

      if (footerResult.status === "fulfilled") {
        setFooter(footerResult.value);
      }

      if (tripsResult.status === "fulfilled") {
        setTripsWithcount(tripsResult.value || []);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);
  const copyrightText = `Copyright © ${new Date().getFullYear()} ${footerContact.companyName}. All Rights Reserved.`;
  // console.log("footer", footer)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post("/booking/send-newsletter", { email });

      if (res.data.status) {
        setMessage(res.data.message || "Subscribed successfully!");
        setEmail("");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong, try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!footer) return null;

  return (
    <>
      <footer className="footer-wrapper bg-title footer-layout2 ">
        <div className="widget-area pb-0">
          <div className="container">
            {/* Newsletter */}
            <div className="newsletter-area">
              <div className="newsletter-top">
                <div className="row gy-4 align-items-center">
                  <div className="col-lg-5">
                    <h2 className="newsletter-title text-white text-capitalize mb-0">
                      get updated the latest newsletter
                    </h2>
                  </div>
                  <div className="col-lg-7">
                    <form
                      className="newsletter-form style2"
                      onSubmit={handleSubmit}
                    >
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <button
                        type="submit"
                        className="th-btn style1"
                        disabled={loading}
                      >
                        {loading ? "Subscribing..." : "Subscribe Now"}
                        <Image
                          src="/img/icon/plane.svg"
                          alt="subscribe"
                          width={20}
                          height={20}
                          className="style1"
                        />
                      </button>
                    </form>
                  </div>
                </div>
                {message && (
                  <div className="alert alert-info mt-2 py-2 text-center">
                    {message}
                  </div>
                )}
              </div>
            </div>

            {/* Widgets Row */}
            <div className="row justify-content-between">
              {/* About */}
              <div className="col-md-6 col-xl-3">
                <div className="widget footer-widget">
                  <div className="th-widget-about">
                    <div className="about-logo">
                      <Link href="/">
                        <Image
                          src={companyInfo.logoLight}
                          alt="Tripogram"
                          width={190}
                          height={84}
                          style={{ objectFit: "contain" }}
                        />
                      </Link>
                    </div>
                    <p className="about-text">
                      {footer.section?.[1]?.data?.content || ""}
                    </p>
                    <div className="th-social">
                      <Link href={getSafeHref(footer.section?.[9]?.data?.url)}>
                        <FontAwesomeIcon icon={faFacebookF} />
                      </Link>
                      <Link href={getSafeHref(footer.section?.[10]?.data?.url)}>
                        <FontAwesomeIcon icon={faTwitter} />
                      </Link>
                      <Link href={getSafeHref(footer.section?.[11]?.data?.url)}>
                        <FontAwesomeIcon icon={faLinkedin} />
                      </Link>
                      <Link href={getWhatsappUrl(footer.section?.[12]?.data?.url)}>
                        <FontAwesomeIcon icon={faWhatsapp} />
                      </Link>
                      <Link href={getSafeHref(footer.section?.[13]?.data?.url)}>
                        <FontAwesomeIcon icon={faInstagram} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-md-6 col-xl-auto">
                <div className="widget widget_nav_menu footer-widget">
                  <h3 className="widget_title">Quick Links</h3>
                  <ul className="menu">
                    <li>
                      <Link href="/">
                        <FontAwesomeIcon icon={faAngleRight} />
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/about">
                        <FontAwesomeIcon icon={faAngleRight} />
                        About us
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog">
                        <FontAwesomeIcon icon={faAngleRight} />
                        Blogs
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms-and-conditions">
                        <FontAwesomeIcon icon={faAngleRight} />
                        Terms & Conditions
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy-policy">
                        <FontAwesomeIcon icon={faAngleRight} />
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/feedback">
                        <FontAwesomeIcon icon={faAngleRight} />
                        Feedback
                      </Link>
                    </li>
                    <li>
                      {/* <Link href="/privacy-policy"> */}
                      <Link href="/cancellation-policy">
                        <FontAwesomeIcon icon={faAngleRight} />
                        Cancellation Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>


              <div className="col-md-6 col-xl-auto">
                <div className="widget widget_nav_menu footer-widget">
                  <h3 className="widget_title">Trips</h3>
                  <ul className="menu">
                    {tripsWithcount.slice(0, 6).map((item) => (
                      <li key={item.slug}>
                        <Link href={`/trips/${item.slug}`}>
                          <FontAwesomeIcon icon={faAngleRight} />
                          {item.heading}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Address */}
              <div className="col-md-6 col-xl-auto">
                <div className="widget footer-widget">
                  <h3 className="widget_title">Address</h3>
                  <div className="th-widget-contact">
                    {backendFooterContact.phone && (
                      <div className="info-box_text">
                        <div className="icon">
                          <Image
                            src="/img/icon/phone.svg"
                            alt="phone"
                            width={20}
                            height={20}
                          />
                        </div>
                        <div className="details">
                          <p>
                            <Link href={backendFooterContact.phoneHref}>
                              {backendFooterContact.phone}
                            </Link>
                          </p>
                        </div>
                      </div>
                    )}
                    {backendFooterContact.email && (
                      <div className="info-box_text">
                        <div className="icon">
                          <Image
                            src="/img/icon/envelope.svg"
                            alt="email"
                            width={20}
                            height={20}
                          />
                        </div>
                        <div className="details">
                          <p>
                            <Link href={backendFooterContact.emailHref}>
                              {backendFooterContact.email}
                            </Link>
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="info-box_text">
                      <div className="icon">
                        <Image
                          src="/img/icon/location-dot.svg"
                          alt="location"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="details">
                        <p>
                          <a
                            href={footerContact.mapHref}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {footerContact.address}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instagram */}
              {/* <div className="col-md-6 col-xl-auto">
                <div className="widget footer-widget">
                  <h3 className="widget_title">Instagram Post</h3>
                  <div className="sidebar-gallery">
                    {footer.section[7].data.gallery.map((gallery) => (
                        key={gallery.id}
                    ))}
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        {/* <div className="top_img w-100">
          <img src="/img/bg/bgbg.jpg" alt="" style={{ width: "100%" }} />
        </div> */}
        {/* Copyright */}
        <div
          className="copyright-wrap"
          style={{ backgroundImage: "url(/img/bg/copyright_bg_1.jpg)" }}
        >
          <div className="container">
            <div className="row justify-content-between align-items-center">
              <div className="col-md-6">
                <p
                  className="copyright-text"
                  dangerouslySetInnerHTML={{ __html: copyrightText }}
                />
              </div>
              <div className="col-md-6 text-end d-none d-md-block">
                <div className="footer-card">
                  <span className="title">We Accept</span>
                  <Image
                    src="/img/shape/cards.png"
                    alt="cards"
                    width={150}
                    height={30}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer >
      <a href={footerContact.phoneHref}>
        <button className={`btn-floating phone ${isHomePage ? "home-floating" : ""}`}>
          <Image src="https://i.imgur.com/FZuns9L.png" alt="Phone" width={24} height={24} unoptimized />
          <span>{footerContact.phone}</span>
        </button>
      </a>

      <a
        href={getWhatsappUrl(footer.section?.[12]?.data?.url)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className={`btn-floating whatsapp ${isHomePage ? "home-floating" : ""}`}>
          <Image
            src="https://i.imgur.com/LBW2Lso.png"
            alt="WhatsApp"
            width={32}
            height={32}
            unoptimized
          />
        </button>
      </a>
    </>
  );
}
