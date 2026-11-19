"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./PartnershipSection.css";
import { getPartnerships } from "@/services/partnershipApi";

export default function PartnershipSection() {
  const [section, setSection] = useState(null);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPartnerships();
        if (data) {
          if (data.section) {
            setSection({
              sub_title: data.section.sub_title || "",
              title: data.section.title || "",
              description: data.section.description || "",
            });
          }
          if (data.partners && data.partners.length > 0) {
            setPartners(data.partners);
          }
        }
      } catch (err) {
        console.log("PartnershipSection: Failed to fetch data", err);
      }
    }
    fetchData();
  }, []);

  if (!partners || partners.length === 0) return null;

  return (
    <section className="partnership-area position-relative overflow-hidden">
      <div className="container">
        <div className="title-area text-center">
          {section?.sub_title && (
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="sub-title style1 text-uppercase"
            >
              {section.sub_title}
            </motion.span>
          )}
          {section?.title && (
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="sec-title mb-3"
            >
              {section.title}
            </motion.h2>
          )}
          {section?.description && (
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="sec-text"
            >
              {section.description}
            </motion.p>
          )}
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
