"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { api } from "@/services/config";

/* ✅ Safe localStorage wrapper */
const safeStorage = {
  get(key) {
    try {
      if (typeof window !== "undefined") {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn("localStorage blocked");
    }
    return null;
  },
  set(key, value) {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn("localStorage blocked");
    }
  },
};

function formatSlideImage(imagePath, fallback) {
  if (!imagePath || typeof imagePath !== "string") return fallback;
  const trimmed = imagePath.trim();
  if (!trimmed) return fallback;

  if (
    trimmed.startsWith("/img/") ||
    trimmed.startsWith("img/") ||
    trimmed.startsWith("/images/") ||
    trimmed.startsWith("images/")
  ) {
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  const mediaBase = process.env.NEXT_PUBLIC_MEDIA_PATH || "https://admin.tripogramclub.com/storage/";
  const cleanPath = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;

  if (cleanPath.startsWith("storage/")) {
    const rootUrl = mediaBase.replace(/\/storage\/$/, "/");
    return `${rootUrl}${cleanPath}`;
  }

  return `${mediaBase}${cleanPath}`;
}

const DEFAULT_POPUP = {
  status: "1",
  title: "Plan your Next Trip",
  slides: [
    {
      image: "/img/hero/hero_1_1.jpg",
      title: "Book a Group Trip",
      caption: "Make memories with friends, family, or your special someone.",
    },
    {
      image: "/img/hero/hero_2_1.jpg",
      title: "Travel Your Way",
      caption: "Solo adventures, couple escapes, and unforgettable group journeys.",
    },
    {
      image: "/img/hero/hero_3_1.jpg",
      title: "Your Next Adventure",
      caption: "Handpicked experiences, made simple by Tripogram.",
    },
  ],
};

export default function Popup({ initialPopup = null }) {
  const [popup, setPopup] = useState(initialPopup || DEFAULT_POPUP);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const formRef = useRef(null);

  /* ✅ Ensure component runs only on client */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ✅ Synchronize popup fetch and status check before opening */
  useEffect(() => {
    if (!mounted) return;

    let isMounted = true;

    const loadAndCheckPopup = async () => {
      let activePopup = initialPopup;

      try {
        const { getPopupContent } = await import("@/services/bookingForm");
        const data = await getPopupContent();
        if (data && (data.slides || data.status || data.data)) {
          activePopup = data;
        } else if (!activePopup) {
          const { getPagewithSection } = await import("@/services/pageSection");
          const pageData = await getPagewithSection(6, "popup");
          if (pageData && (pageData.section || pageData.status)) {
            activePopup = pageData;
          }
        }
      } catch (err) {
        console.error("Popup fetch error:", err);
      }

      if (!isMounted) return;

      const finalPopup = activePopup || DEFAULT_POPUP;
      setPopup(finalPopup);

      // Evaluate status (Check section[0].data.status or top-level status)
      const statusVal =
        finalPopup?.section?.[0]?.data?.status ??
        finalPopup?.status;

      // Enable if status is "1", 1, true, or undefined (default enabled)
      const enabled =
        statusVal === "1" ||
        statusVal === 1 ||
        statusVal === true ||
        (statusVal === undefined && finalPopup !== null);

      const wasClosed = safeStorage.get("popupClosed");
      const isRecentlyClosed = wasClosed && (Date.now() - parseInt(wasClosed, 10)) < 1800000; // 30 mins

      if (enabled && !isRecentlyClosed) {
        setTimeout(() => {
          if (isMounted) setIsOpen(true);
        }, 200);
      }
    };

    loadAndCheckPopup();

    return () => {
      isMounted = false;
    };
  }, [mounted, initialPopup]);

  const popupImage = popup?.section?.[1]?.data?.image;
  const defaultSlides = [
    {
      image: popupImage ? formatSlideImage(popupImage, "/img/hero/hero_1_1.jpg") : "/img/hero/hero_1_1.jpg",
      title: "Book a Group Trip",
      caption: "Make memories with friends, family, or your special someone.",
    },
    {
      image: "/img/hero/hero_2_1.jpg",
      title: "Travel Your Way",
      caption: "Solo adventures, couple escapes, and unforgettable group journeys.",
    },
    {
      image: "/img/hero/hero_3_1.jpg",
      title: "Your Next Adventure",
      caption: "Handpicked experiences, made simple by Tripogram.",
    },
  ];

  const rawSlides = Array.isArray(popup?.slides)
    ? popup.slides
    : Array.isArray(popup?.data?.slides)
    ? popup.data.slides
    : Array.isArray(popup?.data)
    ? popup.data
    : [];

  const popupSlides =
    rawSlides.length > 0
      ? rawSlides.map((item, index) => {
          const fallback = defaultSlides[index % defaultSlides.length].image;
          const rawImg = item?.image || item?.image_path || item?.img || item?.photo || item?.banner;
          return {
            image: formatSlideImage(rawImg, fallback),
            title: item?.title || item?.heading || item?.name || "Your Next Adventure",
            caption: item?.subtext || item?.caption || item?.description || item?.sub_title || "",
          };
        })
      : defaultSlides;

  useEffect(() => {
    if (!isOpen || popupSlides.length < 2) return;
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % popupSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isOpen, popupSlides.length]);

  /* ✅ Submit form */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(formRef.current);
    const payload = Object.fromEntries(formData.entries());

    try {
      let res;
      try {
        res = await api.post("/booking/popup-enquiries", payload);
      } catch (_) {
        res = await api.post("/booking/popup-enquiry", payload);
      }

      const isSuccess =
        res?.data?.status === true ||
        res?.data?.status === "1" ||
        res?.data?.status === 1 ||
        res?.data?.success === true ||
        res?.status === 200;

      if (isSuccess) {
        setMessage(res.data?.message || "Enquiry submitted successfully!");
        if (formRef.current) formRef.current.reset();

        safeStorage.set("popupClosed", Date.now().toString());

        setTimeout(() => {
          setIsOpen(false);
        }, 800);
      } else {
        setMessage(res.data?.message || "Submission failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Enquiry submitted successfully!");
      safeStorage.set("popupClosed", Date.now().toString());
      setTimeout(() => {
        setIsOpen(false);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  /* ✅ Close popup */
  const handleClose = () => {
    setIsOpen(false);
    safeStorage.set("popupClosed", Date.now().toString());
  };

  /* ✅ Prevent crash */
  if (!popup) return null;
  const statusVal =
    popup?.section?.[0]?.data?.status ??
    popup?.status;

  const isEnabled =
    statusVal === "1" ||
    statusVal === 1 ||
    statusVal === true ||
    (statusVal === undefined && popup !== null);

  if (!isEnabled) return null;

  const safeIndex = popupSlides.length > 0 ? activeSlide % popupSlides.length : 0;
  const currentSlide = popupSlides[safeIndex] || popupSlides[0] || defaultSlides[0];

  return (
    <>
      {isOpen && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 2147483647,
            position: "fixed",
          }}
        >
          <div className="modal-dialog modal-dialog-centered popup-modal-dialog">
            <div className="modal-content popup-form-content">
              <div className="modal-body p-0 d-flex flex-column flex-md-row popup-form-body">

                {/* LEFT IMAGE */}
                <div className="col-md-6 d-none d-md-block position-relative popup-image-column">
                  {currentSlide?.image && (
                    <Image
                      src={currentSlide.image}
                      alt={currentSlide.title || "Tripogram"}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                      className="popup-form-desktop-image"
                      priority
                    />
                  )}
                  <div className="popup-slide-copy">
                    <h3>{currentSlide?.title || ""}</h3>
                    <p>{currentSlide?.caption || ""}</p>
                    <div className="popup-slide-dots">
                      {popupSlides.map((slide, index) => (
                        <button
                          key={slide.title || index}
                          type="button"
                          aria-label={`Show slide ${index + 1}`}
                          className={index === activeSlide ? "active" : ""}
                          onClick={() => setActiveSlide(index)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT FORM */}
                <div className="col-md-6 popup-form-panel">
                  <div className="d-md-none popup-form-mobile-image-wrap">
                    {currentSlide?.image && (
                      <Image
                        src={currentSlide.image}
                        alt={currentSlide.title || "Tripogram"}
                        fill
                        sizes="100vw"
                        style={{ objectFit: "cover" }}
                        className="popup-form-mobile-image"
                      />
                    )}
                  </div>
                  <h4 className="mb-4 popup-form-title">Plan your Next Trip</h4>

                  {message && (
                    <div className="alert alert-info text-center py-2 mb-3" style={{ fontSize: "14px" }}>
                      {message}
                    </div>
                  )}

                  <form ref={formRef} onSubmit={handleSubmit} className="row g-3">

                    <div className="col-12">
                      <input
                        name="fname"
                        className="form-control popup-form-control"
                        placeholder="First Name"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <input
                        name="contact"
                        className="form-control popup-form-control"
                        placeholder="Contact"
                        required
                        maxLength={13}
                        minLength={10}
                        title="Please enter a valid phone number."
                        pattern="[0-9\s\-]+"
                      />
                    </div>

                    <div className="col-12">
                      <input
                        type="email"
                        name="email"
                        className="form-control popup-form-control"
                        placeholder="Email"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <textarea
                        name="message"
                        className="form-control popup-form-control popup-form-message"
                        placeholder="Message"
                        rows={1}
                      />
                    </div>

                    <div className="col-12 mt-4">
                      <button
                        className="btn btn-primary w-100 popup-submit-btn"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </button>
                    </div>

                  </form>
                </div>

                {/* CLOSE BUTTON */}
                <button
                  onClick={handleClose}
                  type="button"
                  aria-label="Close"
                  className="btn popup-close-btn"
                >
                  <FontAwesomeIcon icon={faClose} />
                </button>

              </div>
            </div>
          </div>
          <style jsx>{`
            .popup-modal-dialog {
              max-width: 820px;
              width: 92%;
              margin-left: auto;
              margin-right: auto;
            }

            .popup-form-content {
              max-height: calc(100vh - 24px);
              overflow: hidden;
              border-radius: 16px;
              border: 0;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
            }

            .popup-form-body {
              max-height: calc(100vh - 24px);
            }

            .popup-image-column {
              position: relative;
              min-height: 480px;
              overflow: hidden;
            }

            .popup-image-column::after {
              content: '';
              position: absolute;
              inset: 0;
              background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.05) 100%);
              z-index: 1;
              pointer-events: none;
            }

            .popup-slide-copy {
              position: absolute;
              left: 24px;
              right: 24px;
              bottom: 28px;
              color: #fff;
              text-align: center;
              text-shadow: 0 2px 8px rgba(0, 0, 0, 0.65);
              z-index: 2;
            }

            .popup-slide-copy h3 {
              margin: 0 0 6px;
              font-size: 24px;
              font-weight: 700;
              line-height: 1.3;
              color: #ffffff;
            }

            .popup-slide-copy p {
              margin: 0 auto 14px;
              max-width: 320px;
              font-size: 13px;
              opacity: 0.9;
              color: #ffffff;
            }

            .popup-slide-dots {
              display: flex;
              justify-content: center;
              gap: 6px;
            }

            .popup-slide-dots button {
              width: 8px;
              height: 8px;
              padding: 0;
              border: 0;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.55);
              transition: all 0.3s ease;
            }

            .popup-slide-dots button.active {
              width: 22px;
              border-radius: 8px;
              background: #fff;
            }

            .popup-form-panel {
              padding: 36px 32px !important;
              display: flex;
              flex-direction: column;
              justify-content: center;
              background: #ffffff;
              overflow-y: auto;
            }

            .popup-form-title {
              font-size: 22px;
              font-weight: 700;
              color: #0b1c39;
            }

            .popup-form-control {
              min-height: 46px;
              height: 46px;
              padding: 0 14px !important;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
              font-size: 14px;
              background-color: #fff;
            }

            .popup-form-control:focus {
              border-color: #0598cc;
              box-shadow: 0 0 0 3px rgba(5, 152, 204, 0.15);
            }

            .popup-form-message {
              line-height: 44px;
              resize: none;
              overflow: hidden;
            }

            .popup-submit-btn {
              height: 46px;
              font-size: 15px;
              font-weight: 600;
              border-radius: 8px;
              background-color: #0598cc;
              border-color: #0598cc;
            }

            .popup-submit-btn:hover {
              background-color: #0482ae;
              border-color: #0482ae;
            }

            .popup-close-btn {
              position: absolute;
              top: 12px;
              right: 12px;
              z-index: 10;
              width: 32px;
              height: 32px;
              padding: 0;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f1f5f9;
              border: 1px solid #e2e8f0;
              color: #475569;
              transition: all 0.2s ease;
            }

            .popup-close-btn:hover {
              background: #e2e8f0;
              color: #0f172a;
            }

            .popup-form-mobile-image-wrap {
              position: relative;
              height: 160px;
              margin: -36px -32px 20px -32px;
              overflow: hidden;
            }

            @media (max-width: 767px) {
              .popup-form-content,
              .popup-form-body {
                max-height: calc(100vh - 16px);
              }

              .popup-form-panel {
                padding: 24px 20px !important;
                max-height: calc(100vh - 16px);
              }

              .popup-form-mobile-image-wrap {
                height: 140px;
                margin: -24px -20px 16px -20px;
              }

              .popup-form-control {
                min-height: 42px;
                height: 42px;
                padding: 0 10px !important;
              }

              .popup-form-message {
                line-height: 42px;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
