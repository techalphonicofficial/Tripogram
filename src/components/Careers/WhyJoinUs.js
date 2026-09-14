<<<<<<< HEAD
"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { whyJoinUs } from "@/data/careersData";
import { getCareersWhyJoinUs, getCareersWhyJoinUsCards } from "@/services/careersApi";
import { faUsers, faChartLine, faTrophy, faGlobe } from "@fortawesome/free-solid-svg-icons";

const ICON_MAP = { users: faUsers, chart: faChartLine, trophy: faTrophy, globe: faGlobe };

export default function WhyJoinUs() {
  const [section, setSection] = useState(null);
  const [cards, setCards] = useState(whyJoinUs);

  useEffect(() => {
    Promise.all([getCareersWhyJoinUs(), getCareersWhyJoinUsCards()]).then(([sectionData, cardsData]) => {
      if (sectionData) setSection(sectionData);
      if (cardsData?.length) {
        setCards(cardsData.map((card) => ({ ...card, icon: ICON_MAP[card.icon] || faUsers })));
      }
    });
  }, []);

=======
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { whyJoinUs } from "@/data/careersData";

export default function WhyJoinUs() {
>>>>>>> 294c810c152a6484dbf379600ab573546fe3fd31
  return (
    <section className="why-join-section position-relative bg-light-blue" style={{ backgroundColor: "#f4f8fb" }}>
      <div className="container th-container">
        <div className="title-area text-center mb-5">
<<<<<<< HEAD
          <span className="careers-eyebrow">{section?.small_label || "Why You'll Love It Here"}</span>
          <h2 className="sec-title">{section?.heading || "More Than a Workplace, It's a Community"}</h2>
        </div>
        
        <div className="row g-4 justify-content-center">
          {cards.map((feature) => (
=======
          <span className="careers-eyebrow">Why You'll Love It Here</span>
          <h2 className="sec-title">More Than a Workplace, It's a <span className="text-theme">Community</span></h2>
        </div>
        
        <div className="row g-4 justify-content-center">
          {whyJoinUs.map((feature) => (
>>>>>>> 294c810c152a6484dbf379600ab573546fe3fd31
            <div className="col-12 col-md-6 col-lg-3" key={feature.id}>
              <div className="why-join-card">
                <div className="why-icon-wrapper">
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
                
                {/* Subtle decorative mountain-like line element */}
                <div className="why-decoration">
                  <FontAwesomeIcon icon={feature.icon} opacity={0.1} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
