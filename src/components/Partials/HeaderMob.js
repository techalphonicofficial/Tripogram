"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { companyInfo } from "@/constants/companyInfo";

export default function HeaderMob({ mainpage, menuOpen, setMenuOpen, tripsWithcount }) {
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
                {tripsWithcount.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/trips/${item.slug}`} onClick={handleLinkClick}>
                      {item.heading}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

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
            <li>
              <Link href="/contact" onClick={handleLinkClick}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
