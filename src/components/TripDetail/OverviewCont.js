"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export default function OverviewCont({ hasGallery = true }) {
  const [activeSection, setActiveSection] = useState("Overview");
  const isClickScrolling = useRef(false);
  const navRef = useRef(null);

  const sections = [
    { id: "Overview", label: "Overview" },
    { id: "Itinerary", label: "Itinerary" },
    ...(hasGallery ? [{ id: "Gallery", label: "Gallery" }] : []),
    { id: "Inclusions", label: "Inclusions" },
    { id: "Exclusions", label: "Exclusions" },
    { id: "Costing", label: "Costing" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Don't update active section while user clicked a tab (smooth scroll in progress)
      if (isClickScrolling.current) return;

      let current = sections[0].id;
      const scrollPosition = window.scrollY + 300;

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= elementPosition) {
            current = section.id;
          }
        }
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Automatically scroll the tab bar horizontally to keep the active tab in view (useful for mobile)
    if (navRef.current) {
      const activeElement = navRef.current.querySelector(".active");
      if (activeElement) {
        const container = navRef.current;
        const scrollLeft =
          activeElement.offsetLeft - container.offsetWidth / 2 + activeElement.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [activeSection]);

  const handleClick = (e, id) => {
    e.preventDefault();
    setActiveSection(id);

    // Lock scroll-based updates for 800ms so clicked tab stays active during smooth scroll
    isClickScrolling.current = true;
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);

    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 260;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="trip-nav-container sticky-top mt-5 mx-auto">
      <div className="container th-container">
        <nav className="trip-nav-tabs">
          <ul 
            ref={navRef}
            className="d-flex flex-wrap gap-2 gap-md-2 list-unstyled align-items-center justify-content-center mb-0 "
          >
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`#${section.id}`}
                  className={`nav-tab-item ${activeSection === section.id ? "active" : ""}`}
                  onClick={(e) => handleClick(e, section.id)}
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
