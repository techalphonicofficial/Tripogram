"use client";
<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faMapMarkerAlt, faSuitcase, faStar } from "@fortawesome/free-solid-svg-icons";
import { careerStats as FALLBACK_STATS } from "@/data/careersData";
import { getCareersStatistics } from "@/services/careersApi";
import CountUp from "react-countup";

// Icon map: backend se icon string aye to match karo
const ICON_MAP = {
  faUsers,
  faMapMarkerAlt,
  faSuitcase,
  faStar,
  users: faUsers,
  location: faMapMarkerAlt,
  briefcase: faSuitcase,
  star: faStar,
};

function formatStat(valueStr) {
  if (!valueStr) return { num: 0, suffix: "", decimals: 0 };
  const match = String(valueStr).match(/^([\d.]+)(.*)$/);
  if (match) {
    const num = parseFloat(match[1]);
    const suffix = match[2] || "";
    const decimals = String(valueStr).includes(".") ? 1 : 0;
    return { num, suffix, decimals };
  }
  return { num: 0, suffix: String(valueStr), decimals: 0 };
}

export default function CareerStats() {
  const [stats, setStats] = useState(FALLBACK_STATS);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCareersStatistics();
        if (data && data.length > 0) {
          // Map icon string to actual icon if provided
          const mapped = data.map((stat) => ({
            ...stat,
            icon: ICON_MAP[stat.icon] || faUsers,
          }));
          setStats(mapped);
        }
      } catch (err) {
        console.log("CareerStats: Using fallback data", err);
      }
    }
    fetchData();
  }, []);

=======
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
>>>>>>> 294c810c152a6484dbf379600ab573546fe3fd31
  return (
    <section className="career-stats-section bg-white position-relative z-index-1">
      <div className="container th-container">
        <div className="row g-4 justify-content-center">
<<<<<<< HEAD
          {stats.map((stat, index) => {
            const { num, suffix, decimals } = formatStat(stat.value);
            return (
              <div className="col-6 col-md-3" key={stat.id || index}>
=======
          {careerStats.map((stat, index) => {
            const { num, suffix, decimals } = formatStat(stat.value);
            return (
              <div className="col-6 col-md-3" key={index}>
>>>>>>> 294c810c152a6484dbf379600ab573546fe3fd31
                <div className="stats-card">
                  <div className="stats-icon">
                    <FontAwesomeIcon icon={stat.icon} />
                  </div>
                  <div className="stats-info">
                    <h3>
<<<<<<< HEAD
                      <CountUp
                        end={num}
                        decimals={decimals}
                        suffix={suffix}
                        duration={2.5}
                        enableScrollSpy
                        scrollSpyOnce
=======
                      <CountUp 
                        end={num} 
                        decimals={decimals} 
                        suffix={suffix} 
                        duration={2.5} 
                        enableScrollSpy 
                        scrollSpyOnce 
>>>>>>> 294c810c152a6484dbf379600ab573546fe3fd31
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
