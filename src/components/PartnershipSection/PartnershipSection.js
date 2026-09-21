"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./PartnershipSection.css";
import { getPartnerships } from "@/services/partnershipApi";

// Fallback static data (agar API down ho)
const FALLBACK_SECTION = {
  sub_title: "",
  title: "Partnership & Recognition",
  description:
    "Proud to be associated with trusted travel, government and industry partners.",
};

const FALLBACK_PARTNERS = [
  { id: 1, logo: "/img/brand/brand_1_1.svg", name: "Startup India", label: "DPIIT Recognized Startup" },
  { id: 2, logo: "/img/brand/brand_1_2.svg", name: "MSME", label: "Government Registration" },
  { id: 3, logo: "/img/brand/brand_1_3.svg", name: "MakeMyTrip", label: "Preferred Travel Partner" },
  { id: 4, logo: "/img/brand/brand_1_4.svg", name: "IndiGo", label: "Preferred Airline Partner" },
  { id: 5, logo: "/img/brand/brand_1_5.svg", name: "Goods & Services Tax", label: "GST Registered Company" },
  { id: 6, logo: "/img/brand/brand_1_6.svg", name: "IATO", label: "Indian Association of Tour Operators" },
];

export default function PartnershipSection() {
  const [section, setSection] = useState(FALLBACK_SECTION);
  const [partners, setPartners] = useState(FALLBACK_PARTNERS);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPartnerships();
        if (data) {
          // Section heading data
          if (data.section) {
            setSection({
              sub_title: data.section.sub_title || FALLBACK_SECTION.sub_title,
              title: data.section.title || FALLBACK_SECTION.title,
              description: data.section.description || FALLBACK_SECTION.description,
            });
          }
          // Partners list
          if (data.partners && data.partners.length > 0) {
            setPartners(data.partners);
          }
        }
      } catch (err) {
        console.log("PartnershipSection: Using fallback data", err);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="partnership-area position-relative overflow-hidden">
      <div className="container">
        <div className="title-area text-center">
          {section.sub_title && (
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="sub-title style1 text-uppercase"
            >
              {section.sub_title}
            </motion.span>
          )}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="sec-title mb-3"
          >
            {section.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="sec-text"
          >
            {section.description}
          </motion.p>
        </div>

        <div className="marquee-container mt-5">
          <div className="marquee-track">
            {/* First Set */}
            {partners.map((partner) => (
              <div className="marquee-item d-flex justify-content-center align-items-center" key={`set1-${partner.id}`}>
                <img
                  src={partner.logo}
                  alt={partner.name || 'Partner Logo'}
                  style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                  onError={(e) => { e.target.src = "/img/brand/brand_1_1.svg"; }}
                />
              </div>
            ))}

            {/* Second Set (Duplicate for seamless loop) */}
            {partners.map((partner) => (
              <div className="marquee-item d-flex justify-content-center align-items-center" key={`set2-${partner.id}`}>
                <img
                  src={partner.logo}
                  alt={partner.name || 'Partner Logo'}
                  style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                  onError={(e) => { e.target.src = "/img/brand/brand_1_1.svg"; }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
