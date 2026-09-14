"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { perksBenefits } from "@/data/careersData";
import { getCareersBenefits } from "@/services/careersApi";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function PerksSidebar() {
  const [benefits, setBenefits] = useState(perksBenefits);

  useEffect(() => {
    getCareersBenefits().then((data) => {
      if (data?.length) setBenefits(data.map((benefit) => ({ ...benefit, icon: faHeart })));
    });
  }, []);

  return (
    <div className="perks-sidebar">
      <span className="perks-eyebrow">Good Things, Great People</span>
      <h3>Perks & Benefits</h3>
      
      <div className="perks-grid">
        {benefits.map((perk) => (
          <div className="perk-item" key={perk.id}>
            <div className="perk-icon">
              <FontAwesomeIcon icon={perk.icon} />
            </div>
            <div className="perk-title">{perk.title}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-5 text-center">
        {/* Decorative mountain graphic at the bottom of sidebar, referenced in design */}
        <div className="mb-4" style={{ opacity: 0.1, fontSize: "40px", color: "var(--title-color)" }}>
           <i className="fa-solid fa-mountain"></i>
        </div>
        
        <Link href="mailto:hr@tripogram.com" className="th-btn w-100">
          Apply for this Role <i className="fa-solid fa-arrow-right ms-2"></i>
        </Link>
      </div>
    </div>
  );
}
