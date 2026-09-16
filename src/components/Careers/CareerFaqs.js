"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { getCareersFaqs } from "@/services/careersApi";

const FALLBACK_FAQS = [
  {
    id: 1,
    question: "How do I apply for a job at Tripogram?",
    answer: "You can apply directly through our Open Positions section by clicking on any job role and filling out the quick application form with your resume and contact details.",
  },
  {
    id: 2,
    question: "What happens after I submit my application?",
    answer: "Our HR team reviews every application within 3-5 business days. If your profile matches our requirements, we will reach out to schedule an initial interview.",
  },
  {
    id: 3,
    question: "Does Tripogram offer remote or hybrid work options?",
    answer: "Yes! Depending on the role and department, we offer flexible hybrid and remote work arrangements.",
  },
  {
    id: 4,
    question: "What is the work culture like at Tripogram?",
    answer: "We are a fast-paced, collaborative team of travel enthusiasts who value innovation, ownership, continuous learning, and work-life balance.",
  },
];

export default function CareerFaqs() {
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);
  const [openFaq, setOpenFaq] = useState(1);

  useEffect(() => {
    getCareersFaqs().then((data) => {
      if (data?.length > 0) {
        setFaqs(data);
      }
    });
  }, []);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section className="career-faqs-section py-5 bg-white">
      <div className="container th-container">
        <div className="title-area text-center mb-4">
          <span className="careers-eyebrow">Got Questions?</span>
          <h2 className="sec-title">Frequently Asked Questions</h2>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="accordion gap-3 d-flex flex-column">
              {faqs.map((faq, idx) => {
                const faqId = faq.id || idx + 1;
                const isOpen = openFaq === faqId;
                return (
                  <div
                    key={faqId}
                    className={`card border rounded-4 overflow-hidden shadow-sm ${isOpen ? "border-primary" : ""}`}
                    style={{ transition: "all 0.3s ease" }}
                  >
                    <button
                      className="card-header bg-white border-0 p-4 text-start d-flex justify-content-between align-items-center w-100"
                      onClick={() => toggleFaq(faqId)}
                      style={{ cursor: "pointer" }}
                    >
                      <h5 className="mb-0 fw-bold text-dark fs-6 d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faQuestionCircle} className="text-primary me-2" />
                        {faq.question}
                      </h5>
                      <FontAwesomeIcon
                        icon={isOpen ? faChevronUp : faChevronDown}
                        className="text-muted ms-3"
                      />
                    </button>
                    {isOpen && (
                      <div className="card-body px-4 pb-4 pt-0 text-muted" style={{ fontSize: "14px", lineHeight: "1.8" }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
