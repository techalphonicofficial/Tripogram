"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTags } from "@fortawesome/free-solid-svg-icons";
import { companyInfo } from "@/constants/companyInfo";

export default function HeaderMob({
  mainpage,
  menuOpen,
  setMenuOpen,
  tripsWithcount,
  offersVisible = true,
  offersNavText = "Offers",
}) {
  const [activeMenu, setActiveMenu] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  // Toggle function
  const handleMenuClick = (e) => {
    e.stopPropagation();
    setActiveMenu(!activeMenu); // toggle open/close
  };

  // Close menu when clicking a link
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <div
      className={`th-menu-wrapper onepage-nav ${
        menuOpen ? "th-body-visible" : ""
      }`}
    >
      <div className="th-menu-area">
        {/* Close Button */}
        <button className="th-menu-toggle" onClick={() => setMenuOpen(false)}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Mobile Logo */}
        <div className="mobile-logo text-left">
          <Link href="/" className="inline-block" onClick={handleLinkClick}>
            <Image
              src={companyInfo.logoLight}
              alt="Tripogram"
              width={190}
              height={84}
              style={{ objectFit: "contain", margin: "8px" }}
            />
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="th-mobile-menu">
          <ul>
            {(mainpage?.sections?.find(s => s.section_key === "header")?.section?.find(item => item.type === "menu")?.data?.trip_items || []).map(
              (item) => (
                <li key={item.slug}>
                  <Link href={`/trips/${item.slug}`} onClick={handleLinkClick}>
                    {item.heading}
                  </Link>
                </li>
              )
            )}
            <li>
              <Link href="/trips/upcoming-trips/all" onClick={handleLinkClick}>
                Upcoming Trips
              </Link>
            </li>

            {/* Dropdown */}
            {(() => {
              const weekendTripItem = tripsWithcount.find(item => item.heading.toLowerCase().includes("weekend"));
              const domesticTripsFiltered = tripsWithcount.filter(item => !item.heading.toLowerCase().includes("weekend"));
              return (
                <>
                  <li
                    className={`menu-item-has-children th-item-has-children ${
                      activeMenu ? "th-active" : ""
                    }`}
                  >
                    <a onClick={handleMenuClick} style={{ cursor: "pointer" }}>
                      Domestic Trips
                      <span className="th-mean-expand"></span>
                    </a>
                    <ul
                      className="sub-menu th-submenu ms-3"
                      style={{ display: activeMenu ? "block" : "none" }}
                    >
                      {domesticTripsFiltered.map((item) => (
                        <li key={item.slug}>
                          <Link href={`/trips/${item.slug}`} onClick={handleLinkClick}>
                            {item.heading}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  
                  {weekendTripItem && (
                    <li>
                      <Link href={`/trips/${weekendTripItem.slug}`} onClick={handleLinkClick}>
                        {weekendTripItem.heading}
                      </Link>
                    </li>
                  )}
                </>
              );
            })()}

            <li>
              <Link href="/blog" onClick={handleLinkClick}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="/careers" onClick={handleLinkClick}>
                Careers
              </Link>
            </li>
            {offersVisible !== false && (
              <li>
                <Link href="/offers" onClick={handleLinkClick}>
                  {offersNavText || "Offers"} 🔥
                </Link>
              </li>
            )}
            <li>
              <Link href="/contact" onClick={handleLinkClick}>
                Contact Us
              </Link>
            </li>
            <li className="mt-2">
              <Link href="/offers" onClick={handleLinkClick} className="d-inline-flex align-items-center bg-primary text-white rounded-pill px-4 py-2 shadow-sm" style={{ fontWeight: "600", width: "fit-content" }}>
                <FontAwesomeIcon icon={faTags} className="me-2" style={{ fontSize: "14px" }} />
                Offers <span className="badge bg-danger ms-2" style={{ fontSize: "10px" }}>NEW</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
