"use client";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { api } from "@/services/config";
import "./LeadPopup.css";

export default function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem("hasSeenLeadPopup");
    
    if (!hasSeenPopup) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("hasSeenLeadPopup", "true");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Disable background scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(formRef.current);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await api.post("/packages/request-call-back", payload);

      if (res.data.success) {
        setMessage({ type: "success", text: "Request submitted successfully!" });
        formRef.current.reset();
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setMessage({ type: "error", text: res.data.message || "Failed to submit request" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !message) return null;

  return (
    <div className={`lead-popup-overlay ${isOpen ? "active" : ""}`}>
      <div className="lead-popup-container">
        <button className="lead-popup-close" onClick={() => setIsOpen(false)}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="lead-popup-left p-0">
          <Swiper
            modules={[Autoplay, Pagination]}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true, el: '.lp-pagination' }}
            className="w-100 h-100"
          >
            {[
              {
                img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80",
                badge: "HOT DEAL • GROUP PKG",
                title: "Trans India",
                desc: "Explore multiple cultures, iconic landmarks, and historic cities together."
              },
              {
                img: "https://images.unsplash.com/photo-1476900543704-4312b78632f8?auto=format&fit=crop&q=80",
                badge: "COUPLE SPECIAL",
                title: "Romantic Getaways",
                desc: "Discover breathtaking destinations perfect for you and your loved one."
              },
              {
                img: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80",
                badge: "SOLO TRAVEL",
                title: "Adventure Awaits",
                desc: "Find yourself exploring the most exciting and pristine landscapes."
              },
              {
                img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80",
                badge: "LUXURY STAYS",
                title: "Premium Resorts",
                desc: "Unwind in the most exclusive and stunning 5-star properties."
              },
              {
                img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80",
                badge: "ISLAND ESCAPE",
                title: "Tropical Vibes",
                desc: "Relax on white-sand beaches with crystal clear turquoise waters."
              },
              {
                img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80",
                badge: "ROAD TRIPS",
                title: "Scenic Routes",
                desc: "Hit the road and experience the journey of a lifetime."
              }
            ].map((slide, i) => (
              <SwiperSlide key={i} className="h-100 position-relative" style={{ background: '#000' }}>
                <img src={slide.img} alt={slide.title} className="lp-slide-img" />
                <div className="lp-slide-overlay">
                  <div className="lp-slide-content">
                    <span className="lp-slide-badge">{slide.badge}</span>
                    <h3 className="lp-slide-title">{slide.title}</h3>
                    <p className="lp-slide-desc">{slide.desc}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="lp-pagination"></div>
          </Swiper>
        </div>

        <div className="lead-popup-right">
          <h3>Plan your Next Trip</h3>
          <form className="lead-popup-form" ref={formRef} onSubmit={handleSubmit}>
            <input type="text" name="full_name" placeholder="First Name" required />
            <input type="tel" name="phone" placeholder="Contact" required pattern="\d{10}" title="Phone number must be 10 digits" />
            <input type="email" name="email" placeholder="Email" required />
            <textarea name="message" placeholder="Message" required></textarea>
            
            {message && (
              <div className={`lead-popup-message ${message.type === 'success' ? 'text-success' : 'text-danger'}`}>
                {message.text}
              </div>
            )}
            
            <button type="submit" className="lead-popup-submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
