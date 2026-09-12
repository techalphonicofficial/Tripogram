import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faClock, faUser, faPhone, faEnvelope, faLink, faComment, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function JobCard({ job, isExpanded, onToggle }) {
  return (
    <div className={`job-card-wrapper ${isExpanded ? 'expanded' : ''}`} style={{ marginBottom: "16px", background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", transition: "all 0.3s ease", overflow: "hidden" }}>
      
      {/* Header / Summary (Clickable to toggle) */}
      <div 
        className="job-card-header d-flex flex-column flex-md-row align-items-center justify-content-between p-4 text-center text-md-start gap-3 gap-md-0" 
        onClick={onToggle}
        style={{ cursor: "pointer" }}
      >
        <div className="job-details">
          <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px", color: "var(--title-color)" }}>{job.title}</h4>
          <div className="job-meta d-flex justify-content-center justify-content-md-start gap-3 text-muted" style={{ fontSize: "13px" }}>
            <span>{job.department} &bull; {job.type}</span>
          </div>
        </div>

        <div className="job-actions d-flex justify-content-center justify-content-md-end align-items-center gap-4 w-100" style={{ maxWidth: "fit-content" }}>
          {/* Badge */}
          <span className="badge" style={{ backgroundColor: "#ffea00", color: "#000", padding: "6px 12px", borderRadius: "20px", fontWeight: "600", fontSize: "12px" }}>
            We're Hiring
          </span>
          {/* Toggle Arrow */}
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
                {job.description?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                )) || <li>Details not available.</li>}
              </ul>

              <h5 className="mb-3" style={{ fontSize: "16px", fontWeight: "600" }}>Desired Skills:</h5>
              <ul style={{ paddingLeft: "20px", color: "var(--body-color)", fontSize: "14px", lineHeight: "1.8" }}>
                {job.skills?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                )) || <li>Details not available.</li>}
              </ul>
            </div>

            {/* Right Column: Application Form */}
            <div className="col-lg-6">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
