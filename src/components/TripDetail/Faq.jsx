"use client";
import React, { useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

export default function Faq({ faqs }) {
  // Load bootstrap JS for accordion toggle
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <div className=" min_box-detail Age_limit container my-5 mt-24 position-relative z-0">
      <div className="title">
        <h6 className="text-center text-md-start fw-bold mb-3  mb-md-4  page-title">
          Frequently Asked Questions
        </h6>
      </div>

      <style>{`
        .faq-button-custom::after {
          display: none !important;
        }
        .faq-button-custom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .faq-button-custom .faq-icon {
          transition: transform 0.3s ease;
          min-width: 24px;
          height: 24px;
          color: var(--theme-color, #ff6b6b);
        }
        .faq-button-custom.collapsed .faq-icon {
          transform: rotate(180deg);
          color: var(--body-color, #666);
        }
      `}</style>
      <div className="accordion-area accordion mb-30 mt-4" id="faqAccordion">
        {faqs.map((item, index) => (
          <div
            key={index}
            className={`accordion-card style3 mb-4 border-0 shadow-sm ${index === 0 ? "active" : ""}`}
            style={{ borderRadius: "16px", overflow: "hidden", background: "#ffffff", transition: "all 0.3s ease" }}
          >
            <div className="accordion-header" id={`heading-${index}`}>
              <button
                className={`accordion-button faq-button-custom ${index !== 0 ? "collapsed" : ""}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${index}`}
                aria-expanded={index === 0 ? "true" : "false"}
                aria-controls={`collapse-${index}`}
                style={{
                  fontWeight: "600",
                  // padding: "20px 25px",
                  padding: "14px 18px",
                  fontSize: "14px",
                  boxShadow: "none",
                  backgroundColor: "transparent",
                  color: "var(--title-color)",
                  borderRadius: "16px",
                  border: "none",
                  outline: "none"
                }}
              >
                <span style={{ paddingRight: "15px" }}>{item.question}</span>
                <svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
            </div>
            <div
              id={`collapse-${index}`}
              className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
              aria-labelledby={`heading-${index}`}
              data-bs-parent="#faqAccordion"
            >
              {/* <div className="accordion-body" style={{ padding: "0 25px 25px 25px" }}> */}
              <div className="accordion-body" style={{ padding: "0 18px 18px 18px" }}>
                {item.answer.includes("<p>") ? (
                  <div className="faq-text m-0" dangerouslySetInnerHTML={{ __html: item.answer }} style={{ color: "var(--body-color)", lineHeight: "1.7" }} />
                ) : (
                  <p className="faq-text m-0" style={{ color: "var(--body-color)", lineHeight: "1.7" }}>{item.answer}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
