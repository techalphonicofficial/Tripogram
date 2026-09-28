
"use client";

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
  faBriefcase,
  faMoneyBillWave,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function JobCard({ job, isExpanded, onToggle }) {
  console.log("Job:", job);

  // Format deadline
  const formatDate = (date) => {
    if (!date) return "Not specified";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  return (
    <div
      className={`job-card-wrapper ${isExpanded ? "expanded" : ""}`}
      style={{
        marginBottom: "16px",
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #f0f0f0",
        transition: "all 0.3s ease",
        overflow: "hidden",
        boxShadow: isExpanded
          ? "0 8px 30px rgba(0,0,0,0.08)"
          : "0 2px 10px rgba(0,0,0,0.03)",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="job-card-header p-4"
        onClick={onToggle}
        style={{ cursor: "pointer" }}
      >
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">

          {/* LEFT SIDE */}
          <div className="job-details flex-grow-1">

            {/* Title + Hiring Badge */}
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <h4
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  margin: 0,
                  color: "var(--title-color)",
                }}
              >
                {job.title || "Untitled Position"}
              </h4>

              {job.is_active && (
                <span
                  className="badge"
                  style={{
                    backgroundColor: "#ffea00",
                    color: "#000",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontWeight: "600",
                    fontSize: "11px",
                  }}
                >
                  We're Hiring
                </span>
              )}
            </div>

            {/* Department */}
            {job.department && (
              <div
                style={{
                  fontSize: "14px",
                  color: "#6c757d",
                  marginBottom: "15px",
                }}
              >
                {job.department}
              </div>
            )}

            {/* =================================================
                IMPORTANT JOB DETAILS
            ================================================== */}
            <div
              className="d-flex flex-wrap gap-3"
              style={{
                fontSize: "13px",
                color: "#555",
              }}
            >
              {/* Location */}
              {job.location && (
                <span className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="me-2"
                    style={{ color: "var(--theme-color, #0d6efd)" }}
                  />
                  {job.location}
                </span>
              )}

              {/* Job Type */}
              {job.job_type && (
                <span className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    className="me-2"
                    style={{ color: "var(--theme-color, #0d6efd)" }}
                  />
                  {job.job_type}
                </span>
              )}

              {/* Experience */}
              {job.experience && (
                <span className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="me-2"
                    style={{ color: "var(--theme-color, #0d6efd)" }}
                  />
                  {job.experience} Years Experience
                </span>
              )}

              {/* Salary */}
              {job.salary && (
                <span
                  className="d-flex align-items-center"
                  style={{
                    fontWeight: "600",
                    color: "#198754",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faMoneyBillWave}
                    className="me-2"
                  />
                  ₹{job.salary}
                </span>
              )}

              {/* Deadline */}
              {job.application_deadline && (
                <span className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="me-2"
                    style={{ color: "#dc3545" }}
                  />
                  Apply by {formatDate(job.application_deadline)}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div
            className="d-flex align-items-center justify-content-end"
            style={{
              minWidth: "125px",
              alignSelf: "center",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: "500",
                marginRight: "10px",
                color: "#555",
              }}
            >
              {isExpanded ? "Hide Details" : "View Details"}
            </span>

            <FontAwesomeIcon
              icon={isExpanded ? faChevronUp : faChevronDown}
              style={{ color: "#777" }}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          EXPANDED BODY
      ====================================================== */}
      {isExpanded && (
        <div
          className="job-card-body p-4 pt-0"
          style={{
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <div className="row mt-4">

            {/* =================================================
                LEFT COLUMN
            ================================================== */}
            <div className="col-lg-6 mb-4 mb-lg-0 pe-lg-4">

              {/* Job Information Box */}
              <div
                className="p-3 mb-4"
                style={{
                  background: "#f8f9fa",
                  borderRadius: "12px",
                  border: "1px solid #eee",
                }}
              >
                <div className="row g-3">

                  {/* Location */}
                  <div className="col-sm-6">
                    <small
                      style={{
                        display: "block",
                        color: "#888",
                        fontSize: "12px",
                        marginBottom: "4px",
                      }}
                    >
                      LOCATION
                    </small>

                    <strong style={{ fontSize: "14px" }}>
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="me-2"
                        style={{ color: "var(--theme-color, #0d6efd)" }}
                      />
                      {job.location || "Not specified"}
                    </strong>
                  </div>

                  {/* Job Type */}
                  <div className="col-sm-6">
                    <small
                      style={{
                        display: "block",
                        color: "#888",
                        fontSize: "12px",
                        marginBottom: "4px",
                      }}
                    >
                      JOB TYPE
                    </small>

                    <strong style={{ fontSize: "14px" }}>
                      <FontAwesomeIcon
                        icon={faBriefcase}
                        className="me-2"
                        style={{ color: "var(--theme-color, #0d6efd)" }}
                      />
                      {job.job_type || "Not specified"}
                    </strong>
                  </div>

                  {/* Experience */}
                  <div className="col-sm-6">
                    <small
                      style={{
                        display: "block",
                        color: "#888",
                        fontSize: "12px",
                        marginBottom: "4px",
                      }}
                    >
                      EXPERIENCE
                    </small>

                    <strong style={{ fontSize: "14px" }}>
                      <FontAwesomeIcon
                        icon={faClock}
                        className="me-2"
                        style={{ color: "var(--theme-color, #0d6efd)" }}
                      />
                      {job.experience
                        ? `${job.experience} Years`
                        : "Not specified"}
                    </strong>
                  </div>

                  {/* Salary */}
                  <div className="col-sm-6">
                    <small
                      style={{
                        display: "block",
                        color: "#888",
                        fontSize: "12px",
                        marginBottom: "4px",
                      }}
                    >
                      SALARY
                    </small>

                    <strong
                      style={{
                        fontSize: "14px",
                        color: "#198754",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faMoneyBillWave}
                        className="me-2"
                      />
                      {job.salary
                        ? `₹${job.salary}`
                        : "Not disclosed"}
                    </strong>
                  </div>

                  {/* Deadline */}
                  <div className="col-sm-6">
                    <small
                      style={{
                        display: "block",
                        color: "#888",
                        fontSize: "12px",
                        marginBottom: "4px",
                      }}
                    >
                      APPLICATION DEADLINE
                    </small>

                    <strong style={{ fontSize: "14px" }}>
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="me-2"
                        style={{ color: "#dc3545" }}
                      />
                      {formatDate(job.application_deadline)}
                    </strong>
                  </div>

                  {/* Department */}
                  <div className="col-sm-6">
                    <small
                      style={{
                        display: "block",
                        color: "#888",
                        fontSize: "12px",
                        marginBottom: "4px",
                      }}
                    >
                      DEPARTMENT
                    </small>

                    <strong style={{ fontSize: "14px" }}>
                      {job.department || "Not specified"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* =================================================
                  SHORT DESCRIPTION
              ================================================== */}
              {job.short_description && (
                <>
                  <h5
                    className="mb-2"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    About the Role
                  </h5>

                  <p
                    style={{
                      color: "var(--body-color)",
                      fontSize: "14px",
                      lineHeight: "1.7",
                      marginBottom: "25px",
                    }}
                  >
                    {job.short_description}
                  </p>
                </>
              )}

              {/* =================================================
                  JOB DESCRIPTION
              ================================================== */}
              {job.description && (
                <>
                  <h5
                    className="mb-3"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Job Description
                  </h5>

                  <div
                    style={{
                      color: "var(--body-color)",
                      fontSize: "14px",
                      lineHeight: "1.8",
                      marginBottom: "25px",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: job.description,
                    }}
                  />
                </>
              )}

              {/* =================================================
                  REQUIREMENTS
              ================================================== */}
              {job.requirements && (
                <>
                  <h5
                    className="mb-3"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Requirements
                  </h5>

                  <div
                    style={{
                      color: "var(--body-color)",
                      fontSize: "14px",
                      lineHeight: "1.8",
                      marginBottom: "25px",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: job.requirements,
                    }}
                  />
                </>
              )}

              {/* =================================================
                  SKILLS
              ================================================== */}
              {Array.isArray(job.skills) && job.skills.length > 0 && (
                <>
                  <h5
                    className="mb-3"
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Desired Skills
                  </h5>

                  <div className="d-flex flex-wrap gap-2">
                    {job.skills.map((item, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: "inline-block",
                          padding: "7px 13px",
                          background: "#f1f3f5",
                          borderRadius: "20px",
                          fontSize: "13px",
                          color: "#444",
                          border: "1px solid #e5e5e5",
                        }}
                      >
                        {item.skill}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* =================================================
                RIGHT COLUMN - APPLICATION FORM
            ================================================== */}
            <div className="col-lg-6">
              <ApplicationForm job={job} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ============================================================
   APPLICATION FORM
============================================================ */

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
  const [status, setStatus] = React.useState("idle");
  const [feedback, setFeedback] = React.useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

      if (resume) {
        fd.append("resume", resume);
      }

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");

        setFeedback(
          data.message || "Application submitted successfully!"
        );

        setForm({
          name: "",
          phone: "",
          country_code: "+91",
          email: "",
          linkedin: "",
          message: "",
        });

        setResume(null);
      } else {
        setStatus("error");

        const fieldErrors = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : "";

        setFeedback(
          fieldErrors ||
            data.message ||
            "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      console.error(err);

      setStatus("error");
      setFeedback(
        "Network error. Please check your connection and try again."
      );
    }
  };

  /* ==========================================================
     SUCCESS STATE
  ========================================================== */

  if (status === "success") {
    return (
      <div
        className="application-form p-4 text-center"
        style={{
          background: "#f8f9fa",
          borderRadius: "16px",
          border: "1px solid #e9ecef",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            marginBottom: "16px",
          }}
        >
          🎉
        </div>

        <h4
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "var(--title-color)",
            marginBottom: "8px",
          }}
        >
          Application Received!
        </h4>

        <p
          style={{
            color: "var(--body-color)",
            fontSize: "14px",
          }}
        >
          {feedback}
        </p>

        <button
          className="th-btn mt-3"
          style={{
            padding: "10px 24px",
            borderRadius: "30px",
            fontSize: "14px",
          }}
          onClick={() => setStatus("idle")}
        >
          Apply for Another Role
        </button>
      </div>
    );
  }

  /* ==========================================================
     APPLICATION FORM
  ========================================================== */

  return (
    <div
      className="application-form p-4"
      style={{
        background: "#f8f9fa",
        borderRadius: "16px",
        border: "1px solid #e9ecef",
        position: "sticky",
        top: "20px",
      }}
    >
      <h4
        className="text-center mb-4"
        style={{
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        Apply for {job.title}
      </h4>

      <form onSubmit={handleSubmit}>

        {/* NAME */}
        <div className="mb-3 position-relative form-group">
          <span
            className="position-absolute"
            style={{
              left: "15px",
              top: "12px",
              color: "#adb5bd",
            }}
          >
            <FontAwesomeIcon icon={faUser} />
          </span>

          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Full Name*"
            required
            value={form.name}
            onChange={handleChange}
            style={{
              paddingLeft: "40px",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
              backgroundColor: "#fff",
            }}
          />
        </div>

        {/* PHONE */}
        <div className="mb-3 d-flex gap-2">

          <select
            name="country_code"
            className="form-select"
            value={form.country_code}
            onChange={handleChange}
            style={{
              width: "100px",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
              backgroundColor: "#fff",
            }}
          >
            <option value="+91">+91 (IN)</option>
            <option value="+1">+1 (US)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+971">+971 (UAE)</option>
          </select>

          <div className="position-relative flex-grow-1 form-group">

            <span
              className="position-absolute"
              style={{
                left: "15px",
                top: "12px",
                color: "#adb5bd",
              }}
            >
              <FontAwesomeIcon icon={faPhone} />
            </span>

            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Mobile Number*"
              required
              value={form.phone}
              onChange={handleChange}
              style={{
                paddingLeft: "40px",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
                backgroundColor: "#fff",
              }}
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="mb-3 position-relative form-group">

          <span
            className="position-absolute"
            style={{
              left: "15px",
              top: "12px",
              color: "#adb5bd",
            }}
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </span>

          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email Address*"
            required
            value={form.email}
            onChange={handleChange}
            style={{
              paddingLeft: "40px",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
              backgroundColor: "#fff",
            }}
          />
        </div>

        {/* LINKEDIN */}
        <div className="mb-3 position-relative form-group">

          <span
            className="position-absolute"
            style={{
              left: "15px",
              top: "12px",
              color: "#adb5bd",
            }}
          >
            <FontAwesomeIcon icon={faLink} />
          </span>

          <input
            type="url"
            name="linkedin"
            className="form-control"
            placeholder="LinkedIn URL*"
            required
            value={form.linkedin}
            onChange={handleChange}
            style={{
              paddingLeft: "40px",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
              backgroundColor: "#fff",
            }}
          />
        </div>

        {/* MESSAGE */}
        <div className="mb-3 position-relative form-group">

          <span
            className="position-absolute"
            style={{
              left: "15px",
              top: "12px",
              color: "#adb5bd",
            }}
          >
            <FontAwesomeIcon icon={faComment} />
          </span>

          <textarea
            name="message"
            className="form-control"
            placeholder="Message"
            rows="3"
            value={form.message}
            onChange={handleChange}
            style={{
              paddingLeft: "40px",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
              backgroundColor: "#fff",
            }}
          />
        </div>

        {/* RESUME */}
        <div className="mb-4">

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="form-control"
            onChange={(e) =>
              setResume(e.target.files?.[0] || null)
            }
            style={{
              borderRadius: "8px",
              border: "1px solid #dee2e6",
              backgroundColor: "#fff",
              padding: "8px 15px",
              fontSize: "14px",
            }}
          />

          <small
            className="text-muted"
            style={{
              fontSize: "12px",
            }}
          >
            Accepted: PDF, DOC, DOCX (Resume/CV)
          </small>
        </div>

        {/* ERROR */}
        {status === "error" && (
          <div
            className="alert alert-danger py-2 px-3 mb-3"
            style={{
              fontSize: "13px",
              borderRadius: "8px",
            }}
          >
            {feedback}
          </div>
        )}

        {/* SUBMIT */}
        <div className="text-center">

          <button
            type="submit"
            className="th-btn"
            disabled={status === "loading"}
            style={{
              padding: "12px 30px",
              width: "100%",
              borderRadius: "30px",
              fontSize: "16px",
              opacity: status === "loading" ? 0.7 : 1,
            }}
          >
            {status === "loading"
              ? "Submitting..."
              : "Apply Now"}
          </button>

        </div>

      </form>
    </div>
  );
}