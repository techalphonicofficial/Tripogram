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

export default function Popup({ initialPopup = null }) {
  const [popup, setPopup] = useState(initialPopup);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [mounted, setMounted] = useState(false);

  const formRef = useRef(null);

  /* ✅ Ensure component runs only on client */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ✅ Fetch popup data */
  useEffect(() => {
    if (!mounted || popup) return;

    const fetchPopup = async () => {
      try {
        const { getPagewithSection } = await import("@/services/pageSection");
        const data = await getPagewithSection(6, "popup");
        setPopup(data);
      } catch (err) {
        console.error("Popup fetch error:", err);
      }
    };

    fetchPopup();
  }, [mounted, popup]);

  /* ✅ Handle popup timing safely */
  useEffect(() => {
    if (!popup || !mounted) return;

    if (popup?.section?.[0]?.data?.status !== "1") return;

    const lastClosed = safeStorage.get("popupClosed");

    if (lastClosed) {
      const now = Date.now();
      if (now - parseInt(lastClosed) < 60000) return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, [popup, mounted]);

  /* ✅ Submit form */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(formRef.current);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await api.post("booking/popup-enquiry", payload);

      if (res.data.status) {
        setMessage(res.data.message || "Enquiry submitted successfully!");
        formRef.current.reset();

        safeStorage.set("popupClosed", Date.now().toString());

        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setMessage(res.data.message || "Submission failed");
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Something went wrong");
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
  if (popup?.section?.[0]?.data?.status !== "1") return null;

  const image =
    process.env.NEXT_PUBLIC_MEDIA_PATH +
    (popup?.section?.[1]?.data?.image || "");

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
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content popup-form-content">
              <div className="modal-body p-0 d-flex flex-column flex-md-row popup-form-body">

                {/* LEFT IMAGE */}
                <div className="col-md-6 d-none d-md-block">
                  {image && (
                    <Image
                      src={image}
                      alt="Popup"
                      width={600}
                      height={800}
                      className="w-100 h-100 popup-form-desktop-image"
                    />
                  )}
                </div>

                {/* RIGHT FORM */}
                <div className="col-md-6 p-4 popup-form-panel">
                  <div className="d-md-none popup-form-mobile-image-wrap">
                    {image && (
                      <Image
                        src={image}
                        alt="Popup"
                        width={600}
                        height={240}
                        className="w-100 popup-form-mobile-image"
                      />
                    )}
                  </div>
                  <h4 className="mb-3">Plan your Next Trip</h4>

                  {message && (
                    <div className="alert alert-info text-center">
                      {message}
                    </div>
                  )}

                  <form ref={formRef} onSubmit={handleSubmit} className="row g-3">

                    {/* <div className="col-md-6"> */}
                    <div className="col-12">
                      <input
                        name="fname"
                        className="form-control popup-form-control"
                        placeholder="First Name"
                        required
                      />
                    </div>

                    {/* <div className="col-md-6">
                      <input
                        name="lname"
                        className="form-control"
                        placeholder="Last Name"
                        required
                      />
                    </div> */}

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
                      {/* <textarea
                        name="message"
                        className="form-control"
                        placeholder="Message"
                      /> */}
                      <textarea
                        name="message"
                        className="form-control popup-form-control popup-form-message"
                        placeholder="Message"
                        rows={1}
                      />
                    </div>

                    <div className="col-12">
                      <button
                        className="btn btn-primary w-100"
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
                  className="btn btn-light"
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                  }}
                >
                  <FontAwesomeIcon icon={faClose} />
                </button>

              </div>
            </div>
          </div>
          <style jsx>{`
            .popup-form-content {
              max-height: calc(100vh - 24px);
              overflow: hidden;
            }

            .popup-form-body {
              max-height: calc(100vh - 24px);
            }

            .popup-form-desktop-image,
            .popup-form-mobile-image {
              object-fit: cover;
            }

            .popup-form-desktop-image {
              /* Previous height kept for reference: height: 100%; */
              height: min(70vh, 620px) !important;
              display: block;
            }

            .popup-form-panel {
              overflow-y: auto;
            }

            .popup-form-control {
              min-height: 44px;
              height: 44px;
              padding: 0 10px !important;
              border-radius: 8px;
            }

            .popup-form-message {
              line-height: 44px;
              resize: none;
              overflow: hidden;
            }

            .popup-form-mobile-image-wrap {
              margin: -16px -16px 16px;
            }

            .popup-form-mobile-image {
              /* Previous height kept for reference: height: 160px; */
              height: 135px;
              display: block;
            }

            @media (max-width: 767px) {
              .popup-form-content,
              .popup-form-body {
                max-height: calc(100vh - 16px);
              }

              .popup-form-panel {
                padding: 16px !important;
                max-height: calc(100vh - 16px);
              }

              .popup-form-mobile-image {
                /* Previous height kept for reference: height: min(30vh, 170px); */
                height: min(18vh, 105px);
              }

              .popup-form-control {
                min-height: 40px;
                height: 40px;
                padding: 0 8px !important;
              }

              .popup-form-message {
                line-height: 40px;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
