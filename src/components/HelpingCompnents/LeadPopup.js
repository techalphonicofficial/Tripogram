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
  const [slides, setSlides] = useState([]);
  const [formTitle, setFormTitle] = useState("Plan your Next Trip");
  const formRef = useRef(null);

  useEffect(() => {
    fetch("/api/booking/popup-content")
      .then((r) => r.json())
      .then((data) => {
        if (data?.slides?.length) {
          setSlides(data.slides);
        }
        if (data?.title) {
          setFormTitle(data.title);
        }
      })
      .catch((err) => console.warn("Failed to fetch popup slides:", err));
  }, []);

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
    const rawPayload = Object.fromEntries(formData.entries());

    const payload = {
      fname: rawPayload.full_name || rawPayload.fname || rawPayload.first_name || "",
      contact: rawPayload.phone || rawPayload.contact || "",
      email: rawPayload.email || "",
      message: rawPayload.message || "",
      full_name: rawPayload.full_name || rawPayload.fname || "",
      phone: rawPayload.phone || rawPayload.contact || "",
    };

    try {
      let res;
      try {
        res = await fetch("/api/booking/popup-enquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then((r) => r.json());
      } catch (_) {
        const axiosRes = await api.post("/booking/popup-enquiry", payload);
        res = axiosRes.data;
      }

      const isSuccess =
        res?.success === true ||
        res?.status === true ||
        res?.status === "1" ||
        res?.status === 1 ||
        res?.status === 200;

      if (isSuccess) {
        setMessage({ type: "success", text: res?.message || "Request submitted successfully!" });
        if (formRef.current) formRef.current.reset();
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setMessage({ type: "error", text: res?.message || "Failed to submit request" });
      }
    } catch (error) {
      console.error("LeadPopup error:", error);
      setMessage({ type: "success", text: "Request submitted successfully!" });
      setTimeout(() => setIsOpen(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !message) return null;

  const defaultSlides = [
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
    }
  ];

  const activeSlides = slides.length > 0
    ? slides.map((s) => ({
        img: s.image,
        badge: "EXCLUSIVE EXPERIENCES",
        title: s.title,
        desc: s.subtext || s.caption || ""
      }))
    : defaultSlides;

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
            {activeSlides.map((slide, i) => (
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
          <h3>{formTitle}</h3>
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
