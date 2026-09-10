import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { careerStats } from "@/data/careersData";

export default function CareerStats() {
  return (
    <section className="career-stats-section bg-white position-relative z-index-1">
      <div className="container th-container">
        <div className="row g-4 justify-content-center">
          {careerStats.map((stat, index) => (
            <div className="col-6 col-md-3" key={index}>
              <div className="stats-card">
                <div className="stats-icon">
                  <FontAwesomeIcon icon={stat.icon} />
                </div>
                <div className="stats-info">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
