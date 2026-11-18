"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

export default function ThingsToPack({ things_to_pack }) {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState("200px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const defaultHeight = window.innerWidth < 768 ? "180px" : "200px";
      setHeight(expanded ? `${contentRef.current.scrollHeight}px` : defaultHeight);
    }
  }, [expanded, things_to_pack]);

  return (
    <div className="min_box-detail Age_limit container my-4">
      <div className="title">
        <h6 className="text-center text-md-start fw-bold mb-4 page-title">Things To Pack</h6>
      </div>

      <div className="tour-page-single mt-3">
        <div
          className="page-content"
          style={{
            maxHeight: height,
            overflow: "hidden",
            transition: "max-height 0.6s ease",
          }}
          ref={contentRef}
        >
          <div className="destination-checklist d-flex gap-4">
            {/* Things To Pack */}
            <div className="checklist style2 style4 flex-fill">
              <div
                id="things_to_packContent"
                dangerouslySetInnerHTML={{ __html: things_to_pack }}
              />
            </div>
            <div className="checklist style5 flex-fill"></div>
          </div>
        </div>
      </div>

      <div className="view_more_less d-flex justify-content-end mt-2">
        <Link
          href="#"
          role="button"
          className={expanded ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();
            setExpanded(!expanded);
          }}
        >
          {expanded ? "Read Less" : "Read More"}
        </Link>
      </div>
    </div>
  );
}
