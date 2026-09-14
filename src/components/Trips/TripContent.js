"use client";
import { useState, useRef, useEffect } from "react";

export default function TripContent({ content }) {
  const [showMore, setShowMore] = useState(false);
  const [maxHeight, setMaxHeight] = useState("140px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (showMore && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("140px");
    }
  }, [showMore]);

  return (
    <div className="d-flex flex-column align-items-start gap-3 container my-5">
      <div
        ref={contentRef}
        style={{
          maxHeight,
          overflow: "hidden",
          transition: "max-height 0.5s ease",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <button
        onClick={() => setShowMore(!showMore)}
        className="btn btn-primary px-4 py-2 shadow-sm align-self-center align-self-md-start"
      >
        {showMore ? "Read Less" : "Read More"}
      </button>
    </div>
  );
}
