"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

export default function Overview({ description }) {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const defaultHeight = window.innerWidth < 768 ? "180px" : "200px";
      setHeight(expanded ? `${contentRef.current.scrollHeight}px` : defaultHeight);
    }
  }, [expanded]);

  return (
    <div className="min_box-detail Age_limit container my-4">
      <div className="title">
        <h6 className="text-center text-md-start fw-bold page-title mb-4">Overview</h6>
      </div>

      <div className="tour-page-single mt-20">
        <div
          className="page-content"
          style={{
            maxHeight: height,
            overflow: "hidden",
            transition: "max-height 0.6s ease",
          }}
          ref={contentRef}
        >
          <div id="OverviewContent" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>

      <div className="view_more_less d-flex justify-content-end">
        <Link
          href="#"
          role="button"
          className={expanded ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();
            setExpanded(!expanded);
          }}
        >
          {expanded ? "View Less" : "View More"}
        </Link>
      </div>
    </div>
  );
}
