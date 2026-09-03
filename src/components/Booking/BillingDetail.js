import { faUser, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import RequestCallback from "../HelpingCompnents/RequestCallback";
import { encrypt } from "@/functions/crypt";
import { getBookingData, setBookingData } from "@/functions/bookingStorage";

const validate = (data) => {
  let errs = {};

  // full_name validation
  if (!data.full_name || data.full_name.trim().length < 3) {
    errs.full_name = "Full name must be at least 3 characters";
  }

  // phone validation
  if (!data.phone) {
    errs.phone = "Phone is required";
  } else if (!/^[0-9]{10}$/.test(data.phone)) {
    errs.phone = "Phone must be 10 digits only";
  }

  // email validation
  if (!data.email) {
    errs.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errs.email = "Email is not valid";
  }

  return errs;
};

export default function BillingDetail({
  setFormCompleted,
  formCompleted,
  slug,
}) {
  const [payload, setPayload] = useState(null);

  // console.log("BillingDetail Rendered",setFormCompleted, formCompleted, slug);

  const [personalDetails, setPersonalDetails] = useState({
    full_name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const errs = validate(personalDetails);

    if (Object.keys(errs).length === 0) {
      setFormCompleted(true);
      try {
        localStorage.setItem("personalDetails", encrypt(JSON.stringify(personalDetails)));
      } catch(e){}
      const freshBookingData = getBookingData(slug);

      setBookingData(slug, {
        ...freshBookingData,
        ...personalDetails,
      });
      setPayload(personalDetails);
    } else {
      setFormCompleted(false);
      setPayload(errs);
    }
  }, [personalDetails]);

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0 rounded-4 p-3">
        {/* Title */}
        <div className="mb-3 text-center">
          <h6 className="fw-bold text-primary" style={{ fontSize: "18px" }}>Personal Details</h6>
          <p className="text-muted mb-0" style={{ fontSize: "11px" }}>
            Please provide your details to continue with booking.
          </p>
        </div>

        {/* Full Name */}
        <div className="mb-2">
          <label htmlFor="full_name" className="form-label fw-semibold mb-1" style={{ fontSize: "13px" }}>
            Full Name
          </label>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-light">
              <FontAwesomeIcon icon={faUser} className="text-secondary" style={{ fontSize: "12px" }} />
            </span>
            <input
              id="full_name"
              type="text"
              placeholder="Enter your full name"
              className="form-control rounded-end"
              style={{ fontSize: "13px" }}
              onChange={(e) =>
                setPersonalDetails({
                  ...personalDetails,
                  full_name: e.target.value,
                })
              }
            />
          </div>
          {payload?.full_name &&
          personalDetails.full_name != "" &&
          formCompleted == false ? (
            <span className="text-danger" style={{ fontSize: "11px" }}>{payload.full_name}</span>
          ) : (
            ""
          )}
        </div>

        {/* Contact No */}
        <div className="mb-2">
          <label htmlFor="contact" className="form-label fw-semibold mb-1" style={{ fontSize: "13px" }}>
            Contact No
          </label>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-light">
              <FontAwesomeIcon icon={faPhone} className="text-secondary" style={{ fontSize: "12px" }} />
            </span>
            <input
              id="contact"
              type="text"
              placeholder="Enter your phone number"
              className="form-control rounded-end"
              style={{ fontSize: "13px" }}
              onChange={(e) =>
                setPersonalDetails({
                  ...personalDetails,
                  phone: e.target.value,
                })
              }
            />
          </div>
          {payload?.phone &&
          personalDetails.phone != "" &&
          formCompleted == false ? (
            <span className="text-danger" style={{ fontSize: "11px" }}>{payload.phone}</span>
          ) : (
            ""
          )}
        </div>

        {/* E-mail */}
        <div className="mb-2">
          <label htmlFor="email" className="form-label fw-semibold mb-1" style={{ fontSize: "13px" }}>
            E-mail
          </label>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-light">
              <FontAwesomeIcon icon={faEnvelope} className="text-secondary" style={{ fontSize: "12px" }} />
            </span>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="form-control rounded-end"
              style={{ fontSize: "13px" }}
              onChange={(e) =>
                setPersonalDetails({
                  ...personalDetails,
                  email: e.target.value,
                })
              }
            />
          </div>
          {payload?.email &&
          personalDetails.email != "" &&
          formCompleted == false ? (
            <span className="text-danger" style={{ fontSize: "11px" }}>{payload.email}</span>
          ) : (
            ""
          )}
        </div>
      </div>
      <RequestCallback />
    </div>
  );
}
