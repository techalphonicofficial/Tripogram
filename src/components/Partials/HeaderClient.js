"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import HeaderMob from "./HeaderMob";
import Popup from "../HelpingCompnents/Popup";
import { companyInfo } from "@/constants/companyInfo";
import { getPagewithSection } from "@/services/pageSection";
import { tripsWithPackagecount } from "@/services/tripsApi";
import { getOffersHero } from "@/services/offersApi";

export default function HeaderClient({
  mainpage: initialMainpage = null,
  tripsWithcount: initialTripsWithcount = [],
  popup: initialPopup = null,
}) {
  const [mainpage, setMainpage] = useState(initialMainpage);
  const [tripsWithcount, setTripsWithcount] = useState(initialTripsWithcount);
  const [popup, setPopup] = useState(initialPopup);
  const [offersHero, setOffersHero] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      getPagewithSection(6),
      tripsWithPackagecount(),
      getPagewithSection(6, "popup"),
      getOffersHero(),
    ]).then(([mainResult, tripsResult, popupResult, offersHeroResult]) => {
      if (!isMounted) return;

      if (mainResult.status === "fulfilled") {
        setMainpage(mainResult.value);
      }

      if (tripsResult.status === "fulfilled") {
        setTripsWithcount(tripsResult.value || []);
      }

      if (popupResult.status === "fulfilled") {
        setPopup(popupResult.value);
      }

      if (offersHeroResult.status === "fulfilled" && offersHeroResult.value) {
        setOffersHero(offersHeroResult.value);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logo = companyInfo.logo;
  const phone = companyInfo.phone;
  const email = companyInfo.email;
  const topTrips = mainpage?.sections?.find(s => s.section_key === "top_header")?.section?.find(item => item.type === "menu")?.data?.trip_items || [];
  const menuTrips = mainpage?.sections?.find(s => s.section_key === "header")?.section?.find(item => item.type === "menu")?.data?.trip_items || [];

  return (
    <>
      <header className={`th-header header-layout1 ${scrolled ? "scrolled" : ""}`}>
        <div className="header-top d-none d-lg-block" data-weblogo={companyInfo.icon}>
          <div className="container th-container">
            <div className="row justify-content-between align-items-center">
              <div className="col-auto">
                <ul className="header-links d-flex align-items-center m-0 p-0">
                  <li>
                    <FontAwesomeIcon icon={faPhone} />{" "}
                    <Link href={companyInfo.phoneHref}>{phone}</Link>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faEnvelope} />{" "}
                    <Link href={companyInfo.emailHref}>{email}</Link>
                  </li>
                </ul>
              </div>

              <div className="col-auto">
                <ul className="header-links d-flex align-items-center m-0 p-0">
                  {topTrips.map((item, i) => (
                    <li key={i}>
                      <Link href={`/trips/${item.slug}`}>{item.heading}</Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky-wrapper">
          <div className="menu-area">
            <div className="container th-container">
              <div className="row align-items-center position-relative">
                {/* Logo - Left Aligned with custom margin on Desktop */}
                <div className="col-auto logo-custom-margin">
                  <Link href="/">
                    {logo && (
                      <Image
                        src={logo}
                        alt="Tripogram"
                        width={135}
                        height={60}
                        priority
                        style={{ objectFit: "contain", margin: "8px" }}
                      />
                    )}
                  </Link>
                </div>

                {/* Absolute Centered Navigation for Desktop (Shifted slightly left per user request) */}
                <div className="d-none d-xl-flex justify-content-center position-absolute" style={{ left: '48%', transform: 'translateX(-50%)', width: 'auto' }}>
                  <nav className="main-menu">
                    <ul className="grid-nav-list m-0 p-0">
                      {menuTrips.map((item, i) => (
                        <li key={i}>
                          <Link href={`/trips/${item.slug}`}>{item.heading}</Link>
                        </li>
                      ))}

                      <li>
                        <Link href="/trips/upcoming-trips/all">Upcoming Trips</Link>
                      </li>

                      <li className="menu-item-has-children">
                        <span>Domestic Trips</span>
                        <ul className="sub-menu">
                          {tripsWithcount.map((item) => (
                            <li key={item.id}>
                              <Link href={`/trips/${item.slug}`}>{item.heading}</Link>
                            </li>
                          ))}
                        </ul>
                      </li>

                      <li>
                        <Link href="/blog">Blogs</Link>
                      </li>
                      <li>
                        <Link href="/careers">Careers</Link>
                      </li>
                      {offersHero?.website_visible !== false && offersHero?.is_visible !== false && (
                        <li>
                          <Link href="/offers">
                            {offersHero?.navbar_text || "Offers"}
                          </Link>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>

                {/* Mobile Menu Toggle - Right aligned */}
                <div className="col-auto d-xl-none ms-auto">
                  <button
                    className="th-menu-toggle"
                    onClick={() => setMenuOpen(true)}
                    type="button"
                    aria-label="Open menu"
                  >
                    <FontAwesomeIcon icon={faBars} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <HeaderMob
        mainpage={mainpage}
        tripsWithcount={tripsWithcount}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        offersVisible={offersHero?.website_visible !== false && offersHero?.is_visible !== false}
        offersNavText={offersHero?.navbar_text || "Offers"}
      />

      <Popup initialPopup={popup} />
    </>
  );
}
