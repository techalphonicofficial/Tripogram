"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { careerStats } from "@/data/careersData";
import CountUp from "react-countup";

function formatStat(valueStr) {
  const match = valueStr.match(/^([\d.]+)(.*)$/);
  if (match) {
    const num = parseFloat(match[1]);
    const suffix = match[2] || "";
    const decimals = valueStr.includes(".") ? 1 : 0;
    return { num, suffix, decimals };
  }
  return { num: 0, suffix: valueStr, decimals: 0 };
}

export default function CareerStats() {
  return (
    <section className="career-stats-section bg-white position-relative z-index-1">
      <div className="container th-container">
        <div className="row g-4 justify-content-center">
          {careerStats.map((stat, index) => {
            const { num, suffix, decimals } = formatStat(stat.value);
            return (
              <div className="col-6 col-md-3" key={index}>
                <div className="stats-card">
                  <div className="stats-icon">
                    <FontAwesomeIcon icon={stat.icon} />
                  </div>
                  <div className="stats-info">
                    <h3>
                      <CountUp 
                        end={num} 
                        decimals={decimals} 
                        suffix={suffix} 
                        duration={2.5} 
                        enableScrollSpy 
                        scrollSpyOnce 
                      />
                    </h3>
                    <p>{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
