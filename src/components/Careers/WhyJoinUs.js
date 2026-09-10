import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { whyJoinUs } from "@/data/careersData";

export default function WhyJoinUs() {
  return (
    <section className="why-join-section position-relative bg-light-blue" style={{ backgroundColor: "#f4f8fb" }}>
      <div className="container th-container">
        <div className="title-area text-center mb-5">
          <span className="careers-eyebrow">Why You'll Love It Here</span>
          <h2 className="sec-title">More Than a Workplace, It's a <span className="text-theme">Community</span></h2>
        </div>
        
        <div className="row g-4 justify-content-center">
          {whyJoinUs.map((feature) => (
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
