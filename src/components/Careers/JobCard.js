<<<<<<< HEAD
﻿"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faClock,
  faUser,
  faPhone,
  faEnvelope,
  faLink,
  faComment,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

export default function JobCard({ job, isExpanded, onToggle }) {
  return (
    <div
      className={`job-card-wrapper ${isExpanded ? "expanded" : ""}`}
      style={{
        marginBottom: "16px",
        background: "white",
        borderRadius: "16px",
        border: "1px solid #f0f0f0",
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
    >
      {/* Header / Summary (Clickable to toggle) */}
      <div
        className="job-card-header d-flex flex-column flex-md-row align-items-center justify-content-between p-4 text-center text-md-start gap-3 gap-md-0"
=======
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faClock, faUser, faPhone, faEnvelope, faLink, faComment, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function JobCard({ job, isExpanded, onToggle }) {
  return (
    <div className={`job-card-wrapper ${isExpanded ? 'expanded' : ''}`} style={{ marginBottom: "16px", background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", transition: "all 0.3s ease", overflow: "hidden" }}>
      
      {/* Header / Summary (Clickable to toggle) */}
      <div 
        className="job-card-header d-flex flex-column flex-md-row align-items-center justify-content-between p-4 text-center text-md-start gap-3 gap-md-0" 
>>>>>>> 294c810c152a6484dbf379600ab573546fe3fd31
        onClick={onToggle}
        style={{ cursor: "pointer" }}
      >
        <div className="job-details">
<<<<<<< HEAD
          <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px", color: "var(--title-color)" }}>
            {job.title}
          </h4>
          <div className="job-meta d-flex justify-content-center justify-content-md-start gap-3 text-muted" style={{ fontSize: "13px" }}>
            <span>
              {job.department} &bull; {job.type}
            </span>
=======
          <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px", color: "var(--title-color)" }}>{job.title}</h4>
          <div className="job-meta d-flex justify-content-center justify-content-md-start gap-3 text-muted" style={{ fontSize: "13px" }}>
            <span>{job.department} &bull; {job.type}</span>
>>>>>>> 294c810c152a6484dbf379600ab573546fe3fd31
          </div>
        </div>

        <div className="job-actions d-flex justify-content-center justify-content-md-end align-items-center gap-4 w-100" style={{ maxWidth: "fit-content" }}>
<<<<<<< HEAD
          <span className="badge" style={{ backgroundColor: "#ffea00", color: "#000", padding: "6px 12px", borderRadius: "20px", fontWeight: "600", fontSize: "12px" }}>
            We&apos;re Hiring
          </span>
=======
          {/* Badge */}
          <span className="badge" style={{ backgroundColor: "#ffea00", color: "#000", padding: "6px 12px", borderRadius: "20px", fontWeight: "600", fontSize: "12px" }}>
            We're Hiring
          </span>
          {/* Toggle Arrow */}
>>>>>>> 294c810c152a6484dbf379600ab573546fe3fd31
          <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="text-muted" />
        </div>
      </div>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="job-card-body p-4 pt-0" style={{ borderTop: "1px solid #f0f0f0" }}>
          <div className="row mt-4">
            {/* Left Column: Job Details */}
            <div className="col-lg-6 mb-4 mb-lg-0 pe-lg-4">
              <div className="d-flex align-items-center gap-4 mb-4 text-muted" style={{ fontSize: "14px" }}>
                <span>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-theme" />
                  {job.location}
                </span>
                <span>
                  <FontAwesomeIcon icon={faClock} className="me-2 text-theme" />
                  Experience: {job.experience}
                </span>
              </div>

              <h5 className="mb-3" style={{ fontSize: "16px", fontWeight: "600" }}>Job Description:</h5>
              <ul className="mb-4" style={{ paddingLeft: "20px", color: "var(--body-color)", fontSize: "14px", lineHeight: "1.8" }}>
<<<<<<< HEAD
                {job.description?.map((item, idx) => <li key={idx}>{item}</li>) || <li>Details not available.</li>}
=======
                {job.description?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                )) || <li>Details not available.</li>}
>>>>>>> 294c810c152a6484dbf379600ab573546fe3fd31
              </ul>

              <h5 className="mb-3" style={{ fontSize: "16px", fontWeight: "600" }}>Desired Skills:</h5>
              <ul style={{ paddingLeft: "20px", color: "var(--body-color)", fontSize: "14px", lineHeight: "1.8" }}>
<<<<<<< HEAD
                {job.skills?.map((item, idx) => <li key={idx}>{item}</li>) || <li>Details not available.</li>}
=======
                {job.skills?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                )) || <li>Details not available.</li>}
>>>>>>> 294c810c152a6484dbf379600ab573546fe3fd31
              </ul>
            </div>

            {/* Right Column: Application Form */}
            <div className="col-lg-6">
<<<<<<< HEAD
              <ApplicationForm job={job} />
=======
              <div className="application-form p-4" style={{ background: "#f8f9fa", borderRadius: "16px", border: "1px solid #e9ecef" }}>
                <h4 className="text-center mb-4" style={{ fontSize: "18px", fontWeight: "600" }}>Make your move, fill out your details now!</h4>
                <form onSubmit={(e) => { e.preventDefault(); alert("Application submitted!"); }}>
                  
                  <div className="mb-3 position-relative form-group">
                    <span className="position-absolute" style={{ left: "15px", top: "12px", color: "#adb5bd" }}>
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <input type="text" className="form-control" placeholder="Full Name*" required style={{ paddingLeft: "40px", borderRadius: "8px", border: "1px solid #dee2e6", backgroundColor: "#fff" }} />
                  </div>

                  <div className="mb-3 d-flex gap-2">
                    <select className="form-select" style={{ width: "90px", borderRadius: "8px", border: "1px solid #dee2e6", backgroundColor: "#fff" }}>
                      <option>+91 (IN)</option>
                    </select>
                    <div className="position-relative flex-grow-1 form-group">
                      <span className="position-absolute" style={{ left: "15px", top: "12px", color: "#adb5bd" }}>
                        <FontAwesomeIcon icon={faPhone} />
                      </span>
                      <input type="tel" className="form-control" placeholder="Mobile Number*" required style={{ paddingLeft: "40px", borderRadius: "8px", border: "1px solid #dee2e6", backgroundColor: "#fff" }} />
                    </div>
                  </div>

                  <div className="mb-3 position-relative form-group">
                    <span className="position-absolute" style={{ left: "15px", top: "12px", color: "#adb5bd" }}>
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <input type="email" className="form-control" placeholder="Email Address*" required style={{ paddingLeft: "40px", borderRadius: "8px", border: "1px solid #dee2e6", backgroundColor: "#fff" }} />
                  </div>

                  <div className="mb-3 position-relative form-group">
                    <span className="position-absolute" style={{ left: "15px", top: "12px", color: "#adb5bd" }}>
                      <FontAwesomeIcon icon={faLink} />
                    </span>
                    <input type="url" className="form-control" placeholder="Enter Linkedin URL*" required style={{ paddingLeft: "40px", borderRadius: "8px", border: "1px solid #dee2e6", backgroundColor: "#fff" }} />
                  </div>

                  <div className="mb-3 position-relative form-group">
                    <span className="position-absolute" style={{ left: "15px", top: "12px", color: "#adb5bd" }}>
                      <FontAwesomeIcon icon={faComment} />
                    </span>
                    <textarea className="form-control" placeholder="Message" rows="3" style={{ paddingLeft: "40px", borderRadius: "8px", border: "1px solid #dee2e6", backgroundColor: "#fff" }}></textarea>
                  </div>

                  <div className="mb-4">
                    <input type="file" className="form-control" style={{ borderRadius: "8px", border: "1px solid #dee2e6", backgroundColor: "#fff", padding: "8px 15px", fontSize: "14px" }} />
                  </div>

                  <div className="text-center">
                    <button type="submit" className="th-btn" style={{ padding: "12px 30px", width: "100%", borderRadius: "30px", fontSize: "16px" }}>
                      Apply Now
                    </button>
                  </div>
                </form>
              </div>
>>>>>>> 294c810c152a6484dbf379600ab573546fe3fd31
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
<<<<<<< HEAD

function ApplicationForm({ job }) {
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    country_code: "+91",
    email: "",
    linkedin: "",
    message: "",
  });
  const [resume, setResume] = React.useState(null);
  const [status, setStatus] = React.useState("idle"); // idle | loading | success | error
  const [feedback, setFeedback] = React.useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const fd = new FormData();
      fd.append("career_id", job.id);
      fd.append("job_id", job.id);
      fd.append("job_title", job.title);
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("country_code", form.country_code);
      fd.append("linkedin", form.linkedin);
      fd.append("message", form.message);
      if (resume) fd.append("resume", resume);

      const res = await fetch("/api/careers/apply", { method: "POST", body: fd });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setFeedback(data.message || "Application submitted successfully!");
        setForm({ name: "", phone: "", country_code: "+91", email: "", linkedin: "", message: "" });
        setResume(null);
      } else {
        setStatus("error");
        const fieldErrors = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : "";
        setFeedback(fieldErrors || data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setFeedback("Network error. Please check your connection and try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="application-form p-4 text-center" style={{ background: "#f8f9fa", borderRadius: "16px", border: "1px solid #e9ecef" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
        <h4 style={{ fontSize: "18px", fontWeight: "600", color: "var(--title-color)", marginBottom: "8px" }}>Application Received!</h4>
        <p style={{ color: "var(--body-color)", fontSize: "14px" }}>{feedback}</p>
        <button className="th-btn mt-3" style={{ padding: "10px 24px", borderRadius: "30px", fontSize: "14px" }} onClick={() => setStatus("idle")}>
          Apply for Another Role
        </button>
      </div>
    );
  }

  return (
    <div className="application-form p-4" style={{ background: "#f8f9fa", borderRadius: "16px", border: "1px solid #e9ecef" }}>
      <h4 className="text-center mb-4" style={{ fontSize: "18px", fontWeight: "600" }}>Make your move, fill out your details now!</h4>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-3 position-relative form-group">
          <span className="position-absolute" style={{ left: "15px", top: "12px", color: "#adb5bd" }}>
            <FontAwesomeIcon icon={faUser} />
          </span>
          <input type="text" name="name" className="form-control" placeholder="Full Name*" required value={form.name} onChange={handleChange} style={{ paddingLeft: "40px", borderRadius: "8px", border: "1px solid #dee2e6", backgroundColor: "#fff" }} />
        </div>

        {/* Phone */}
        <div className="mb-3 d-flex gap-2">
          <select name="country_code" className="form-select" value={form.country_code} onChange={handleChange} style={{ width: "100px", borderRadius: "8px", border: "1px solid #dee2e6", backgroundColor: "#fff" }}>
            <option value="+91">+91 (IN)</option>
            <option value="+1">+1 (US)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+971">+971 (UAE)</option>
          </select>
          <div className="position-relative flex-grow-1 form-group">
            <span className="position-absolute" style={{ left: "15px", top: "12px", color: "#adb5bd" }}>
              <FontAwesomeIcon icon={faPhone} />
            </span>
            <input type="tel" name="phone" className="form-control" placeholder="Mobile Number*" required value={form.phone} onChange={handleChange} style={{ paddingLeft: "40px", borderRadius: "8px", border: "1px solid #dee2e6", backgroundColor: "#fff" }} />
          </div>
        </div>

        {/* Email */}
        <div className="mb-3 position-relative form-group">
          <span className="position-absolute" style={{ left: "15px", top: "12px", color: "#adb5bd" }}>
            <FontAwesomeIcon icon={faEnvelope} />
          </span>
          <input type="email" name="email" className="form-control" placeholder="Email Address*" required value={form.email} onChange={handleChange} style={{ paddingLeft: "40px", borderRadius: "8px", border: "1px solid #dee2e6", backgroundColor: "#fff" }} />
        </div>

        {/* LinkedIn */}
        <div className="mb-3 position-relative form-group">
          <span className="position-absolute" style={{ left: "15px", top: "12px", color: "#adb5bd" }}>
            <FontAwesomeIcon icon={faLink} />
          </span>
          <input type="url" name="linkedin" className="form-control" placeholder="Enter LinkedIn URL*" required value={form.linkedin} onChange={handleChange} style={{ paddingLeft: "40px", borderRadius: "8px", border: "1px solid #dee2e6", backgroundColor: "#fff" }} />
        </div>

        {/* Message */}
        <div className="mb-3 position-relative form-group">
          <span className="position-absolute" style={{ left: "15px", top: "12px", color: "#adb5bd" }}>
            <FontAwesomeIcon icon={faComment} />
          </span>
          <textarea name="message" className="form-control" placeholder="Message" rows="3" value={form.message} onChange={handleChange} style={{ paddingLeft: "40px", borderRadius: "8px", border: "1px solid #dee2e6", backgroundColor: "#fff" }}></textarea>
        </div>

        {/* Resume Upload */}
        <div className="mb-4">
          <input type="file" accept=".pdf,.doc,.docx" className="form-control" onChange={(e) => setResume(e.target.files?.[0] || null)} style={{ borderRadius: "8px", border: "1px solid #dee2e6", backgroundColor: "#fff", padding: "8px 15px", fontSize: "14px" }} />
          <small className="text-muted" style={{ fontSize: "12px" }}>Accepted: PDF, DOC, DOCX (Resume/CV)</small>
        </div>

        {/* Error Message */}
        {status === "error" && (
          <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: "13px", borderRadius: "8px" }}>
            {feedback}
          </div>
        )}

        {/* Submit */}
        <div className="text-center">
          <button type="submit" className="th-btn" disabled={status === "loading"} style={{ padding: "12px 30px", width: "100%", borderRadius: "30px", fontSize: "16px", opacity: status === "loading" ? 0.7 : 1 }}>
            {status === "loading" ? "Submitting..." : "Apply Now"}
          </button>
        </div>
      </form>
    </div>
  );
}
=======
>>>>>>> 294c810c152a6484dbf379600ab573546fe3fd31
