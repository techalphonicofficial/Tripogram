"use client";
import { api } from "@/services/config"; // <- axios instance
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function RequestCallback({ heading = "Request Callback", open, setOpen, packageData = null }) {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  const pkg = typeof open === 'object' ? open : packageData;
  const packageId = pkg?.id || open;
  const packageTitle = pkg?.title || pkg?.heading || "Trip";
  const packageDates = pkg?.package_dates || [];
  const banner = pkg?.banner || pkg?.featured_image || null;
  const price = pkg?.starting_price || pkg?.booking_amount || "";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(formRef.current);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await api.post("/packages/request-call-back", payload);

      if (res.data.success) {
        setMessage(res.data.message || "Callback requested successfully!");
        formRef.current.reset();
        setTimeout(() => setOpen(false), 2000);
      } else {
        setMessage(res.data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000150, position: "fixed", inset: 0, overflow: "auto" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content" style={{ border: 'none', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
          <div className="modal-header border-0 pb-0 pt-4 px-4">
            <h4 className="modal-title fw-bold" style={{ color: 'var(--theme-color)' }}>{heading}</h4>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
              style={{ padding: '1rem' }}
            ></button>
          </div>
          <div className="modal-body px-4 pt-3 pb-4">
            <form ref={formRef} onSubmit={handleSubmit}>
              <input
                type="hidden"
                name="package_id"
                value={packageId}
              />
              
              {pkg && (
                <div className="mb-4 p-3 rounded text-start d-flex flex-column gap-1" style={{ backgroundColor: '#f4f7f8', border: '1px solid #e9ecef', borderRadius: '12px' }}>
                  <h6 className="fw-bold mb-0" style={{ color: 'var(--title-color)', fontSize: '1.1rem' }}>{packageTitle}</h6>
                  {pkg.duration && <span className="text-muted" style={{ fontSize: '0.9rem' }}><i className="fa fa-clock me-1"></i>{pkg.duration}</span>}
                  {price && <span className="fw-bold mt-1" style={{ color: 'var(--theme-color)', fontSize: '1rem' }}>Starting from: ₹{new Intl.NumberFormat('en-IN').format(price)}</span>}
                </div>
              )}
              <div className="mb-3">
                <input
                  type="text"
                  name="full_name"
                  className="form-control shadow-none"
                  placeholder="Your Name"
                  required
                  style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #dee2e6', backgroundColor: '#fcfcfc' }}
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  name="phone"
                  className="form-control shadow-none"
                  placeholder="Phone Number"
                  required
                  pattern="\d{10}"
                  title="Phone number must be 10 digits"
                  style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #dee2e6', backgroundColor: '#fcfcfc' }}
                />
              </div>

              {packageDates && packageDates.length > 0 && (
                <div className="mb-3">
                  <select name="selected_date" className="form-select form-control shadow-none" required style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #dee2e6', backgroundColor: '#fcfcfc', cursor: 'pointer' }}>
                    <option value="">Select Preferred Date</option>
                    {packageDates.map((dateObj, idx) => (
                      <option key={idx} value={`${dateObj.start_date} to ${dateObj.end_date}`}>
                        {new Date(dateObj.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} - {new Date(dateObj.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="mb-4">
                <input
                  type="number"
                  name="travelers"
                  className="form-control shadow-none"
                  placeholder="Number of Travelers"
                  min="1"
                  style={{ borderRadius: '10px', padding: '12px 16px', border: '1px solid #dee2e6', backgroundColor: '#fcfcfc' }}
                />
              </div>

              <button
                type="submit"
                className="btn w-100 fw-bold text-white"
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, var(--theme-color), #047ba6)',
                  boxShadow: '0 8px 20px rgba(5, 152, 204, 0.3)',
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? "Submitting..." : "Submit Inquiry"}
              </button>

              {message && (
                <div className="alert alert-info text-center mt-3 py-2">
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
