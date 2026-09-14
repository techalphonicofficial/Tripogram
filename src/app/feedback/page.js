/*
"use client";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faSolidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import {
    faUser,
    faEnvelope,
    faPhone,
    faPaperPlane,
    faCheckCircle,
    faExclamationCircle,
    faCommentDots,
    faMapMarkerAlt,
    faHeadset,
    faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { redirect, useSearchParams } from "next/navigation";

const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Feedback() {
    const searchParams = useSearchParams();

    const [bookId, setbookId] = useState(searchParams.get("booking_id"));
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        rating: "",
        message: "",
        booking_id: bookId,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for the changed field
        if (errors[e.target.name]) {
            setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
        }
    };

    const handleRating = (value) => {
        setRating(value);
        setFormData((prev) => ({ ...prev, rating: value }));
        if (errors.rating) {
            setErrors((prev) => ({ ...prev, rating: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required.";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        } else if (!/^[\d\s\-\+\(\)]{7,15}$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number.";
        }
        if (!formData.message.trim()) newErrors.message = "Message is required.";
        if (!formData.rating) newErrors.rating = "Please select a star rating.";
        return newErrors;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            console.log("Feedback validation errors:", validationErrors);
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setIsSubmitting(true);
        setSubmitStatus(null);
        try {
            const response = await axios.post(API_URL + "/feedback-post", formData);
            setSubmitStatus("success");
            setFormData({ name: "", email: "", phone: "", rating: "", message: "" });
            setRating(0);
            setbookId("");
            if (response.status === 201) {
                setTimeout(() => {
                    redirect("/");
                }, 2000);
            }
        } catch (error) {
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const activeRatingLabel = ratingLabels[hover || rating] || "";

    return (
        <>

            <section className="p-md-4 p-2" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fef9f0 100%)" }}>
                <div className="container">


                    <div style={{ textAlign: "center", marginBottom: "52px" }}>
                        <span style={{
                            display: "inline-block",
                            background: "linear-gradient(90deg, #0598cc, #0598cc)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontWeight: 700,
                            fontSize: "14px",
                            letterSpacing: "3px",
                            textTransform: "uppercase",
                            marginBottom: "12px",
                        }}>
                            Share Your Experience
                        </span>
                        <h2 style={{
                            fontSize: "clamp(28px, 4vw, 42px)",
                            fontWeight: 800,
                            color: "#1a1a2e",
                            lineHeight: 1.2,
                            margin: "0 0 16px",
                        }}>
                            Your Feedback <span style={{
                                background: "linear-gradient(90deg, #0598cc, #0598cc)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}>Matters to Us</span>
                        </h2>
                        <p style={{ color: "#6b7280", fontSize: "16px", maxWidth: "520px", margin: "0 auto" }}>
                            Help us improve your travel experience. We read every single response.
                        </p>
                    </div>


                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1.6fr",
                        gap: "0",
                        maxWidth: "1000px",
                        margin: "0 auto",
                        borderRadius: "24px",
                        overflow: "hidden",
                        boxShadow: "0 30px 80px rgba(0,0,0,0.12)",
                        alignItems: "center",
                    }}
                        className="feedback-card-grid"
                    >

                        <div className="p-md-5 p-3 h-100" style={{
                            background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            position: "relative",
                            overflow: "hidden",

                        }}>
                            <div style={{
                                position: "absolute", top: "-60px", right: "-60px",
                                width: "200px", height: "200px",
                                borderRadius: "50%",
                                background: "rgba(255,169,68,0.08)",
                            }} />
                            <div style={{
                                position: "absolute", bottom: "-40px", left: "-40px",
                                width: "160px", height: "160px",
                                borderRadius: "50%",
                                background: "rgba(255,107,53,0.08)",
                            }} />

                            <div>
                                <div style={{
                                    width: "52px", height: "52px", borderRadius: "14px",
                                    background: "linear-gradient(135deg, #0598cc, #0598cc)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    marginBottom: "28px",
                                    boxShadow: "0 8px 20px rgba(255,169,68,0.35)",
                                }}>
                                    <FontAwesomeIcon icon={faCommentDots} style={{ color: "#fff", fontSize: "22px" }} />
                                </div>

                                <h3 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, marginBottom: "12px" }}>
                                    We Value Your<br />Opinion
                                </h3>
                                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.7, marginBottom: "36px" }}>
                                    Every piece of feedback helps us craft better journeys and unforgettable experiences for you.
                                </p>


                                {[
                                    { icon: faMapMarkerAlt, label: "12,000+ Destinations Covered" },
                                    { icon: faHeadset, label: "24/7 Customer Support" },
                                    { icon: faGlobe, label: "Trusted by 50,000+ Travelers" },
                                ].map((item, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
                                        <div style={{
                                            width: "36px", height: "36px", borderRadius: "10px",
                                            background: "rgba(255,169,68,0.15)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            flexShrink: 0,
                                        }}>
                                            <FontAwesomeIcon icon={item.icon} style={{ color: "#0598cc", fontSize: "14px" }} />
                                        </div>
                                        <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px" }}>{item.label}</span>
                                    </div>
                                ))}
                            </div>


                            <div style={{
                                background: "rgba(255,255,255,0.06)",
                                backdropFilter: "blur(10px)",
                                borderRadius: "14px",
                                padding: "18px 20px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                marginTop: "32px",
                            }}>
                                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                    Average Rating
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{ color: "#fff", fontSize: "28px", fontWeight: 800 }}>4.8</span>
                                    <div>
                                        {[...Array(5)].map((_, i) => (
                                            <FontAwesomeIcon key={i} icon={faSolidStar} style={{ color: "#0598cc", fontSize: "13px" }} />
                                        ))}
                                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", margin: 0 }}>From 3,200+ reviews</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="p-md-5 p-3 h-100" style={{
                            background: "#fff",
                        }}>

                            {submitStatus === "success" && (
                                <div style={{
                                    background: "linear-gradient(135deg, #e6f7fd, #cdeefa)",
                                    border: "1px solid #0598cc",
                                    borderRadius: "12px",
                                    padding: "16px 20px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    marginBottom: "24px",
                                }}>
                                    <FontAwesomeIcon icon={faCheckCircle} style={{ color: "#0598cc", fontSize: "20px" }} />
                                    <div>
                                        <p style={{ fontWeight: 700, color: "#0598cc", margin: 0 }}>Thank you for your feedback!</p>
                                        <p style={{ fontSize: "13px", color: "#0598cc", margin: 0 }}>We'll review it and get back to you shortly.</p>
                                    </div>
                                </div>
                            )}
                            {submitStatus === "error" && (
                                <div style={{
                                    background: "#fef2f2",
                                    border: "1px solid #fca5a5",
                                    borderRadius: "12px",
                                    padding: "16px 20px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    marginBottom: "24px",
                                }}>
                                    <FontAwesomeIcon icon={faExclamationCircle} style={{ color: "#dc2626", fontSize: "20px" }} />
                                    <p style={{ fontWeight: 600, color: "#991b1b", margin: 0 }}>Something went wrong. Please try again.</p>
                                </div>
                            )}

                            <form onSubmit={handleFormSubmit}>


                                <div style={{ marginBottom: "32px" }}>
                                    <label style={{
                                        display: "block",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        color: "#374151",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        marginBottom: "12px",
                                    }}>
                                        How was your experience? <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        {[...Array(5)].map((_, index) => {
                                            const value = index + 1;
                                            return (
                                                <button
                                                    type="button"
                                                    key={value}
                                                    onClick={() => handleRating(value)}
                                                    onMouseEnter={() => setHover(value)}
                                                    onMouseLeave={() => setHover(0)}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        padding: "4px 2px",
                                                        cursor: "pointer",
                                                        transition: "transform 0.15s ease",
                                                        transform: value <= (hover || rating) ? "scale(1.2)" : "scale(1)",
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={value <= (hover || rating) ? faSolidStar : faRegularStar}
                                                        style={{
                                                            color: value <= (hover || rating) ? "#72d322ff" : (errors.rating ? "#fca5a5" : "#d1d5db"),
                                                            fontSize: "28px",
                                                            filter: value <= (hover || rating)
                                                                ? "drop-shadow(0 2px 6px rgba(255,169,68,0.5))"
                                                                : "none",
                                                            transition: "color 0.15s ease, filter 0.15s ease",
                                                        }}
                                                    />
                                                </button>
                                            );
                                        })}
                                        {activeRatingLabel && (
                                            <span style={{
                                                marginLeft: "8px",
                                                fontSize: "14px",
                                                fontWeight: 600,
                                                color: "#0598cc",
                                                minWidth: "80px",
                                                animation: "fadeIn 0.2s ease",
                                            }}>
                                                {activeRatingLabel}
                                            </span>
                                        )}
                                    </div>
                                    {errors.rating && (
                                        <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                                            <FontAwesomeIcon icon={faExclamationCircle} style={{ fontSize: "11px" }} />
                                            {errors.rating}
                                        </p>
                                    )}
                                </div>


                                <div className="feedback-input-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                                    <InputField icon={faUser} type="text" name="name" placeholder="Your Name *" value={formData.name} onChange={handleChange} error={errors.name} />
                                    <InputField icon={faEnvelope} type="email" name="email" placeholder="Your Email *" value={formData.email} onChange={handleChange} error={errors.email} />
                                </div>
                                <div style={{ marginBottom: "16px" }}>
                                    <InputField icon={faPhone} type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleChange} error={errors.phone} />
                                </div>


                                <div style={{ marginBottom: "28px", position: "relative" }}>
                                    <FontAwesomeIcon
                                        icon={faCommentDots}
                                        style={{
                                            position: "absolute", top: "16px", left: "16px",
                                            color: errors.message ? "#ef4444" : "#9ca3af", fontSize: "15px", pointerEvents: "none", zIndex: 1,
                                        }}
                                    />
                                    <textarea
                                        name="message"
                                        placeholder="Write your experience, suggestions or compliments... *"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        style={{
                                            width: "100%",
                                            paddingLeft: "44px",
                                            paddingTop: "14px",
                                            paddingRight: "16px",
                                            paddingBottom: "14px",
                                            border: `1.5px solid ${errors.message ? "#ef4444" : "#e5e7eb"}`,
                                            borderRadius: "12px",
                                            fontSize: "14px",
                                            color: "#111827",
                                            outline: "none",
                                            resize: "vertical",
                                            fontFamily: "inherit",
                                            transition: "border-color 0.2s, box-shadow 0.2s",
                                            boxSizing: "border-box",
                                            background: errors.message ? "#fff5f5" : "#fff",
                                        }}
                                        onFocus={e => {
                                            e.target.style.borderColor = errors.message ? "#ef4444" : "#6ea740ff";
                                            e.target.style.boxShadow = errors.message ? "0 0 0 3px rgba(239,68,68,0.12)" : "0 0 0 3px rgba(255,169,68,0.12)";
                                        }}
                                        onBlur={e => {
                                            e.target.style.borderColor = errors.message ? "#ef4444" : "#e5e7eb";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    />
                                    {errors.message && (
                                        <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                                            <FontAwesomeIcon icon={faExclamationCircle} style={{ fontSize: "11px" }} />
                                            {errors.message}
                                        </p>
                                    )}
                                </div>


                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{
                                        width: "100%",
                                        padding: "16px 32px",
                                        background: isSubmitting
                                            ? "#d1d5db"
                                            : "linear-gradient(135deg, #0598cc 0%, #0598cc 100%)",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        fontWeight: 700,
                                        cursor: isSubmitting ? "not-allowed" : "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                        boxShadow: isSubmitting ? "none" : "0 8px 24px 46ff3559",
                                        letterSpacing: "0.5px",
                                    }}
                                    onMouseEnter={e => {
                                        if (!isSubmitting) {
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = "0 12px 30px 46ff3559";
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = isSubmitting ? "none" : "0 8px 24px 46ff3559";
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span style={{
                                                width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.4)",
                                                borderTopColor: "#fff", borderRadius: "50%",
                                                animation: "spin 0.8s linear infinite",
                                                display: "inline-block",
                                            }} />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                            Submit Feedback
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-6px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @media (max-width: 768px) {
                    .feedback-card-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .feedback-input-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </>
    );
}

function InputField({ icon, type, name, placeholder, value, onChange, error }) {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{ position: "relative" }}>
            <FontAwesomeIcon
                icon={icon}
                style={{
                    position: "absolute", top: "50%", left: "16px",
                    transform: "translateY(-50%)",
                    color: error ? "#ef4444" : focused ? "#52a112ff" : "#9ca3af",
                    fontSize: "14px",
                    pointerEvents: "none",
                    transition: "color 0.2s",
                    zIndex: 1,
                }}
            />
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={e => {
                    setFocused(true);
                    e.target.style.borderColor = error ? "#ef4444" : "#0598cc";
                    e.target.style.boxShadow = error ? "0 0 0 3px rgba(239,68,68,0.12)" : "0 0 0 3px rgba(255,169,68,0.12)";
                }}
                onBlur={e => {
                    setFocused(false);
                    e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb";
                    e.target.style.boxShadow = "none";
                }}
                style={{
                    width: "100%",
                    height: "50px",
                    paddingLeft: "44px",
                    paddingRight: "16px",
                    border: `1.5px solid ${error ? "#ef4444" : "#e5e7eb"}`,
                    borderRadius: "12px",
                    fontSize: "14px",
                    color: "#111827",
                    outline: "none",
                    background: error ? "#fff5f5" : "#f9fafb",
                    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
                    boxSizing: "border-box",
                }}
            />
            {error && (
                <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <FontAwesomeIcon icon={faExclamationCircle} style={{ fontSize: "11px" }} />
                    {error}
                </p>
            )}
        </div>
    );
}
*/

"use client";

import { Suspense, useMemo, useState } from "react";
import { api } from "@/services/config";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faSolidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import {
    faCalendarAlt,
    faCheckCircle,
    faClipboardList,
    faCommentDots,
    faExclamationCircle,
    faHeadset,
    faHotel,
    faMapMarkerAlt,
    faPaperPlane,
    faPhone,
    faRoute,
    faUtensils,
    faUser,
    faUserTie,
} from "@fortawesome/free-solid-svg-icons";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const ratingSections = [
    { key: "travel", label: "Travel", icon: faRoute },
    { key: "stay", label: "Stay", icon: faHotel },
    { key: "meal", label: "Meal", icon: faUtensils },
    { key: "captain", label: "Captain", icon: faUserTie },
    { key: "itinerary", label: "Itinerary", icon: faClipboardList },
];

function FeedbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const bookingId = searchParams.get("booking_id") || "";
    const memberId = searchParams.get("member_id") || "";
    const initialTripDetails = useMemo(() => ({
        name: searchParams.get("name") || "",
        contact: searchParams.get("contact") || "",
        destination: searchParams.get("destination") || searchParams.get("package_name") || "",
        departureDate: searchParams.get("departure_date") || searchParams.get("start_date") || "",
    }), [searchParams]);

    const [tripDetails, setTripDetails] = useState(initialTripDetails);
    const [ratings, setRatings] = useState({
        travel: 0,
        stay: 0,
        meal: 0,
        captain: 0,
        itinerary: 0,
    });
    const [hoveredRating, setHoveredRating] = useState({});
    const [suggestion, setSuggestion] = useState("");
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const overallRating = useMemo(() => {
        const values = Object.values(ratings);
        const total = values.reduce((sum, value) => sum + value, 0);
        return total ? Number((total / values.length).toFixed(1)) : 0;
    }, [ratings]);

    const handleTripDetailChange = (e) => {
        setTripDetails({ ...tripDetails, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
        }
    };

    const handleRating = (key, value) => {
        setRatings((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!tripDetails.name.trim()) newErrors.name = "Name is required.";
        if (!tripDetails.contact.trim()) newErrors.contact = "Contact is required.";
        if (!tripDetails.destination.trim()) newErrors.destination = "Destination is required.";
        if (!tripDetails.departureDate.trim()) newErrors.departureDate = "Departure date is required.";

        ratingSections.forEach((section) => {
            if (!ratings[section.key]) {
                newErrors[section.key] = `Please rate ${section.label}.`;
            }
        });

        return newErrors;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
            return;
        }

        setErrors({});
        setSubmitStatus(null);
        setIsSubmitting(true);

        const payload = {
            booking_id: bookingId,
            member_id: memberId,
            name: tripDetails.name,
            contact: tripDetails.contact,
            destination: tripDetails.destination,
            departure_date: tripDetails.departureDate,
            travel_rating: ratings.travel,
            stay_rating: ratings.stay,
            meal_rating: ratings.meal,
            captain_rating: ratings.captain,
            itinerary_rating: ratings.itinerary,
            suggestion,
            overall_rating: overallRating,
        };

        try {
            const response = await api.post("/feedback-post", payload);
            setSubmitStatus("success");
            if (response.status === 201) {
                setTimeout(() => router.push("/"), 2000);
            }
        } catch (error) {
            console.error("Feedback submission error:", error);
            setSubmitStatus("error");
            setApiError(error.response?.data ? JSON.stringify(error.response.data) : error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <section className="p-md-4 p-2 feedback-page-shell">
                <div className="container">
                    <div className="feedback-heading">
                        <span className="feedback-kicker">Share Your Experience</span>
                        <h2>
                            Your Feedback <span>Matters to Us</span>
                        </h2>
                        <p>Tell us how your trip went. Your ratings help us shape better journeys.</p>
                    </div>

                    <div className="feedback-card-grid">
                        <aside className="feedback-sidebar p-md-5 p-3">
                            <div className="feedback-sidebar-glow feedback-sidebar-glow-top" />
                            <div className="feedback-sidebar-glow feedback-sidebar-glow-bottom" />

                            <div>
                                <div className="feedback-icon-box">
                                    <FontAwesomeIcon icon={faCommentDots} />
                                </div>
                                <h3>Rate Your<br />Experience</h3>
                                <p>
                                    A quick category-wise review helps our travel team understand what worked well and what can be improved.
                                </p>

                                {[
                                    { icon: faMapMarkerAlt, label: tripDetails.destination || "Destination from booking link" },
                                    { icon: faCalendarAlt, label: tripDetails.departureDate || "Departure date from booking link" },
                                    { icon: faHeadset, label: "Support team reviews every response" },
                                ].map((item, index) => (
                                    <div className="feedback-sidebar-item" key={index}>
                                        <div>
                                            <FontAwesomeIcon icon={item.icon} />
                                        </div>
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="feedback-average-panel">
                                <p>Overall Rating</p>
                                <div>
                                    <strong>{overallRating || "0.0"}</strong>
                                    <div>
                                        <StarDisplay value={overallRating} />
                                        <span>{overallRating ? ratingLabels[Math.round(overallRating)] : "Waiting for your ratings"}</span>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <div className="feedback-form-panel p-md-5 p-3">
                            {submitStatus === "success" && (
                                <StatusMessage
                                    type="success"
                                    icon={faCheckCircle}
                                    title="Thank you for your feedback!"
                                    text="Your response has been submitted successfully."
                                />
                            )}

                            {submitStatus === "error" && (
                                <StatusMessage
                                    type="error"
                                    icon={faExclamationCircle}
                                    title="Something went wrong."
                                    text={apiError || "Please try submitting your feedback again."}
                                />
                            )}

                            <form onSubmit={handleFormSubmit}>
                                <div className="feedback-detail-grid">
                                    <InputField
                                        icon={faUser}
                                        label="Name"
                                        name="name"
                                        value={tripDetails.name}
                                        onChange={handleTripDetailChange}
                                        error={errors.name}
                                    />
                                    <InputField
                                        icon={faPhone}
                                        label="Contact"
                                        name="contact"
                                        value={tripDetails.contact}
                                        onChange={handleTripDetailChange}
                                        error={errors.contact}
                                    />
                                    <InputField
                                        icon={faMapMarkerAlt}
                                        label="Destination"
                                        name="destination"
                                        value={tripDetails.destination}
                                        onChange={handleTripDetailChange}
                                        error={errors.destination}
                                    />
                                    <InputField
                                        icon={faCalendarAlt}
                                        label="Departure Date"
                                        name="departureDate"
                                        value={tripDetails.departureDate}
                                        onChange={handleTripDetailChange}
                                        error={errors.departureDate}
                                    />
                                </div>

                                <div className="feedback-rating-list">
                                    {ratingSections.map((section) => (
                                        <RatingRow
                                            key={section.key}
                                            section={section}
                                            value={ratings[section.key]}
                                            hover={hoveredRating[section.key] || 0}
                                            error={errors[section.key]}
                                            onRate={handleRating}
                                            onHover={(key, value) => setHoveredRating((prev) => ({ ...prev, [key]: value }))}
                                        />
                                    ))}
                                </div>

                                <div className="feedback-suggestion-field">
                                    <label htmlFor="suggestion">Suggestion Box</label>
                                    <textarea
                                        id="suggestion"
                                        name="suggestion"
                                        rows={5}
                                        value={suggestion}
                                        onChange={(e) => setSuggestion(e.target.value)}
                                        placeholder="Share suggestions, highlights, or anything you want our team to know..."
                                    />
                                </div>

                                <div className="feedback-overall-box">
                                    <div>
                                        <span>Auto Generated Overall Rating</span>
                                        <strong>{overallRating || "0.0"} / 5</strong>
                                    </div>
                                    <StarDisplay value={overallRating} size="large" />
                                </div>

                                <button className="feedback-submit-button" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <span className="feedback-spinner" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                            Submit Feedback
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .feedback-page-shell {
                    background: linear-gradient(135deg, #f0f4ff 0%, #fef9f0 100%);
                }

                .feedback-heading {
                    text-align: center;
                    margin-bottom: 52px;
                }

                .feedback-kicker,
                .feedback-heading h2 span {
                    background: linear-gradient(90deg, #0598cc, #0598cc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .feedback-kicker {
                    display: inline-block;
                    font-weight: 700;
                    font-size: 14px;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                }

                .feedback-heading h2 {
                    font-size: clamp(28px, 4vw, 42px);
                    font-weight: 800;
                    color: #1a1a2e;
                    line-height: 1.2;
                    margin: 0 0 16px;
                }

                .feedback-heading p {
                    color: #6b7280;
                    font-size: 16px;
                    max-width: 560px;
                    margin: 0 auto;
                }

                .feedback-card-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.65fr;
                    max-width: 1080px;
                    margin: 0 auto;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.12);
                    align-items: stretch;
                }

                .feedback-sidebar {
                    background: linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                    min-height: 100%;
                }

                .feedback-sidebar-glow {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(5, 152, 204, 0.08);
                    pointer-events: none;
                }

                .feedback-sidebar-glow-top {
                    top: -60px;
                    right: -60px;
                    width: 200px;
                    height: 200px;
                }

                .feedback-sidebar-glow-bottom {
                    bottom: -40px;
                    left: -40px;
                    width: 160px;
                    height: 160px;
                }

                .feedback-icon-box {
                    width: 52px;
                    height: 52px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, #0598cc, #0598cc);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 28px;
                    box-shadow: 0 8px 20px rgba(5, 152, 204, 0.35);
                    color: #fff;
                    font-size: 22px;
                }

                .feedback-sidebar h3 {
                    color: #fff;
                    font-size: 22px;
                    font-weight: 700;
                    margin-bottom: 12px;
                }

                .feedback-sidebar p {
                    color: rgba(255, 255, 255, 0.65);
                    font-size: 14px;
                    line-height: 1.7;
                    margin-bottom: 36px;
                }

                .feedback-sidebar-item {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin-bottom: 20px;
                    position: relative;
                    z-index: 1;
                }

                .feedback-sidebar-item div {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: rgba(5, 152, 204, 0.12);
                    color: #0598cc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 14px;
                }

                .feedback-sidebar-item span {
                    color: rgba(255, 255, 255, 0.78);
                    font-size: 13px;
                    line-height: 1.4;
                }

                .feedback-average-panel {
                    background: rgba(255, 255, 255, 0.06);
                    backdrop-filter: blur(10px);
                    border-radius: 14px;
                    padding: 18px 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin-top: 32px;
                    position: relative;
                    z-index: 1;
                }

                .feedback-average-panel p {
                    color: rgba(255, 255, 255, 0.55);
                    font-size: 12px;
                    margin-bottom: 6px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .feedback-average-panel > div {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .feedback-average-panel strong {
                    color: #fff;
                    font-size: 28px;
                    font-weight: 800;
                }

                .feedback-average-panel span {
                    display: block;
                    color: rgba(255, 255, 255, 0.55);
                    font-size: 11px;
                    margin-top: 2px;
                }

                .feedback-form-panel {
                    background: #fff;
                }

                .feedback-detail-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .feedback-rating-list {
                    display: grid;
                    gap: 14px;
                    margin-bottom: 24px;
                }

                .feedback-suggestion-field {
                    margin-bottom: 22px;
                }

                .feedback-suggestion-field label {
                    display: block;
                    font-size: 13px;
                    font-weight: 700;
                    color: #374151;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 10px;
                }

                .feedback-suggestion-field textarea {
                    width: 100%;
                    padding: 14px 16px;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 12px;
                    font-size: 14px;
                    color: #111827;
                    outline: none;
                    resize: vertical;
                    font-family: inherit;
                    background: #f9fafb;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    box-sizing: border-box;
                }

                .feedback-suggestion-field textarea:focus {
                    border-color: #6ea740;
                    box-shadow: 0 0 0 3px rgba(110, 167, 64, 0.12);
                    background: #fff;
                }

                .feedback-overall-box {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 18px;
                    padding: 16px 18px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, #f7ffe9, #eef7ff);
                    border: 1px solid #dff2ce;
                    margin-bottom: 26px;
                }

                .feedback-overall-box span {
                    display: block;
                    color: #6b7280;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                }

                .feedback-overall-box strong {
                    color: #1a1a2e;
                    font-size: 24px;
                    font-weight: 800;
                }

                .feedback-submit-button {
                    width: 100%;
                    padding: 16px 32px;
                    background: linear-gradient(135deg, #0598cc 0%, #0598cc 100%);
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
                    box-shadow: 0 8px 24px rgba(55, 157, 1, 0.28);
                    letter-spacing: 0.5px;
                }

                .feedback-submit-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 30px rgba(55, 157, 1, 0.32);
                }

                .feedback-submit-button:disabled {
                    cursor: not-allowed;
                    background: #d1d5db;
                    box-shadow: none;
                }

                .feedback-spinner {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255, 255, 255, 0.4);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: feedback-spin 0.8s linear infinite;
                    display: inline-block;
                }

                @keyframes feedback-spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                @media (max-width: 768px) {
                    .feedback-card-grid,
                    .feedback-detail-grid {
                        grid-template-columns: 1fr;
                    }

                    .feedback-heading {
                        margin-bottom: 32px;
                    }

                    .feedback-overall-box {
                        align-items: flex-start;
                        flex-direction: column;
                    }
                }
            `}</style>
        </>
    );
}

export default function Feedback() {
    return (
        <Suspense fallback={null}>
            <FeedbackContent />
        </Suspense>
    );
}

function InputField({ icon, label, name, value, onChange, error }) {
    const [focused, setFocused] = useState(false);

    return (
        <div className="feedback-input-wrap">
            <label htmlFor={name}>{label}</label>
            <div>
                <FontAwesomeIcon icon={icon} />
                <input
                    id={name}
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={error ? "has-error" : ""}
                />
            </div>
            {error && <p><FontAwesomeIcon icon={faExclamationCircle} /> {error}</p>}

            <style jsx>{`
                .feedback-input-wrap label {
                    display: block;
                    font-size: 12px;
                    font-weight: 700;
                    color: #374151;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                }

                .feedback-input-wrap > div {
                    position: relative;
                }

                .feedback-input-wrap :global(svg) {
                    position: absolute;
                    top: 50%;
                    left: 16px;
                    transform: translateY(-50%);
                    color: ${error ? "#ef4444" : focused ? "#52a112" : "#9ca3af"};
                    font-size: 14px;
                    pointer-events: none;
                    transition: color 0.2s;
                    z-index: 1;
                }

                .feedback-input-wrap input {
                    width: 100%;
                    height: 50px;
                    padding-left: 44px;
                    padding-right: 16px;
                    border: 1.5px solid ${error ? "#ef4444" : focused ? "#6ea740" : "#e5e7eb"};
                    border-radius: 12px;
                    font-size: 14px;
                    color: #111827;
                    outline: none;
                    background: ${error ? "#fff5f5" : focused ? "#fff" : "#f9fafb"};
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    box-sizing: border-box;
                    box-shadow: ${focused ? "0 0 0 3px rgba(110, 167, 64, 0.12)" : "none"};
                }

                .feedback-input-wrap p {
                    color: #ef4444;
                    font-size: 12px;
                    margin-top: 6px;
                    margin-bottom: 0;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .feedback-input-wrap p :global(svg) {
                    position: static;
                    transform: none;
                    color: #ef4444;
                    font-size: 11px;
                }
            `}</style>
        </div>
    );
}

function RatingRow({ section, value, hover, error, onRate, onHover }) {
    const activeValue = hover || value;

    return (
        <div className={`feedback-rating-row ${error ? "has-error" : ""}`}>
            <div className="feedback-rating-title">
                <div>
                    <FontAwesomeIcon icon={section.icon} />
                </div>
                <span>{section.label}</span>
            </div>

            <div className="feedback-rating-stars">
                <StarPicker
                    value={value}
                    hover={hover}
                    onRate={(rating) => onRate(section.key, rating)}
                    onHover={(rating) => onHover(section.key, rating)}
                />
                <strong>{ratingLabels[activeValue] || "Rate"}</strong>
            </div>

            {error && <p><FontAwesomeIcon icon={faExclamationCircle} /> {error}</p>}

            <style jsx>{`
                .feedback-rating-row {
                    display: grid;
                    grid-template-columns: minmax(130px, 1fr) auto;
                    align-items: center;
                    gap: 14px;
                    padding: 14px 16px;
                    border: 1.5px solid ${error ? "#fca5a5" : "#eef2f7"};
                    border-radius: 14px;
                    background: ${error ? "#fff5f5" : "#fbfcfe"};
                }

                .feedback-rating-title,
                .feedback-rating-stars {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .feedback-rating-title div {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    background: #f1fae9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #52a112;
                    flex-shrink: 0;
                }

                .feedback-rating-title span {
                    color: #1f2937;
                    font-size: 15px;
                    font-weight: 700;
                }

                .feedback-rating-stars strong {
                    color: ${activeValue ? "#0598cc" : "#9ca3af"};
                    font-size: 13px;
                    font-weight: 700;
                    min-width: 74px;
                }

                .feedback-rating-row p {
                    grid-column: 1 / -1;
                    color: #ef4444;
                    font-size: 12px;
                    margin: -4px 0 0;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                @media (max-width: 576px) {
                    .feedback-rating-row {
                        grid-template-columns: 1fr;
                    }

                    .feedback-rating-stars {
                        justify-content: space-between;
                    }
                }
            `}</style>
        </div>
    );
}

function StarPicker({ value, hover, onRate, onHover }) {
    const activeValue = hover || value;

    return (
        <div className="feedback-star-picker" onMouseLeave={() => onHover(0)}>
            {[1, 2, 3, 4, 5].map((rating) => (
                <button
                    type="button"
                    key={rating}
                    onClick={() => onRate(rating)}
                    onMouseEnter={() => onHover(rating)}
                    aria-label={`${rating} star rating`}
                    className={rating <= activeValue ? "is-filled" : "is-empty"}
                >
                    <FontAwesomeIcon icon={rating <= activeValue ? faSolidStar : faRegularStar} />
                </button>
            ))}

            <style jsx>{`
                .feedback-star-picker {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .feedback-star-picker button {
                    background: none;
                    border: none;
                    padding: 3px 2px;
                    cursor: pointer;
                    line-height: 1;
                    color: #d1d5db;
                    transition: transform 0.15s ease, color 0.15s ease;
                }

                .feedback-star-picker button:hover {
                    transform: scale(1.16);
                }

                .feedback-star-picker button :global(svg) {
                    color: inherit;
                    font-size: 24px;
                    transition: color 0.15s ease, filter 0.15s ease;
                }

                .feedback-star-picker button.is-filled {
                    color: #5fbf1f;
                    filter: drop-shadow(0 2px 6px rgba(95, 191, 31, 0.35));
                }

                .feedback-star-picker button.is-empty {
                    color: #d1d5db;
                    filter: none;
                }
            `}</style>
        </div>
    );
}

function StarDisplay({ value, size = "small" }) {
    const roundedValue = Math.round(value);
    const fontSize = size === "large" ? 28 : 13;

    return (
        <div className="feedback-star-display">
            {[1, 2, 3, 4, 5].map((rating) => (
                <FontAwesomeIcon
                    key={rating}
                    icon={rating <= roundedValue ? faSolidStar : faRegularStar}
                    className={rating <= roundedValue ? "is-filled" : "is-empty"}
                />
            ))}

            <style jsx>{`
                .feedback-star-display {
                    display: flex;
                    align-items: center;
                    gap: ${size === "large" ? "6px" : "2px"};
                    font-size: ${fontSize}px;
                }

                .feedback-star-display :global(svg.is-filled) {
                    color: #5fbf1f;
                    filter: drop-shadow(0 2px 6px rgba(95, 191, 31, 0.24));
                }

                .feedback-star-display :global(svg.is-empty) {
                    color: #d1d5db;
                    filter: none;
                }
            `}</style>
        </div>
    );
}

function StatusMessage({ type, icon, title, text }) {
    const isSuccess = type === "success";

    return (
        <div className="feedback-status-message">
            <FontAwesomeIcon icon={icon} />
            <div>
                <p>{title}</p>
                <span>{text}</span>
            </div>

            <style jsx>{`
                .feedback-status-message {
                    background: ${isSuccess ? "linear-gradient(135deg, #e6f7fd, #cdeefa)" : "#fef2f2"};
                    border: 1px solid ${isSuccess ? "#0598cc" : "#fca5a5"};
                    border-radius: 12px;
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                }

                .feedback-status-message :global(svg) {
                    color: ${isSuccess ? "#0598cc" : "#dc2626"};
                    font-size: 20px;
                    flex-shrink: 0;
                }

                .feedback-status-message p {
                    font-weight: 700;
                    color: ${isSuccess ? "#0598cc" : "#991b1b"};
                    margin: 0;
                }

                .feedback-status-message span {
                    font-size: 13px;
                    color: ${isSuccess ? "#0598cc" : "#991b1b"};
                }
            `}</style>
        </div>
    );
}
