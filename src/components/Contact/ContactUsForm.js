"use client";
import { api } from "@/services/config";
import { getDestination } from "@/services/destinationApi";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ContactUsForm({ heading, banner, video }) {
  const [destinations, setDestinations] = useState([]);
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(formRef.current);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await api.post("/packages/send-enquiry", payload);
      if (res.data.success == true) {
        setMessage(res.data.message);
        formRef.current.reset(); // clear form
      }
    } catch (error) {
      // console.log(error.response.data);
      setMessage(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const data = await getDestination();
        setDestinations(data);
      } catch (err) {
        // console.log(err.message);
      }
    }

    fetchDestinations();
  }, []);

  return (
    <div
      className="space-extra2-top space-extra2-bottom"
      style={{
        backgroundImage: `url('${
          process.env.NEXT_PUBLIC_MEDIA_PATH + banner
        }')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="container">
        <div className="row flex-row-reverse justify-content-center align-items-center">
          {/* Video Section */}
          <div className="col-lg-6">
            <div className="video-box1">
              <a
                href={video}
                className="play-btn style2 popup-video"
                target="_blank"
              >
                <i className="">
                  {" "}
                  <FontAwesomeIcon icon={faPlay} />
                </i>
              </a>
            </div>
          </div>

          {/* Booking Form */}
          <div className="col-lg-6">
            <div>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="contact-form style2 ajax-contact"
              >
                <h3 className="sec-title mb-30 text-capitalize">{heading}</h3>

                <div className="row">
                  {/* First Name */}
                  <div className="col-12 form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="First Name"
                      required
                    />
                    <Image src="/img/icon/user.svg" alt="" width={16} height={16} />
                  </div>

                  {/* Email */}
                  <div className="col-12 form-group">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Your Mail"
                      required
                    />
                    <Image src="/img/icon/mail.svg" alt="" width={16} height={16} />
                  </div>

                  {/* Phone */}
                  <div className="col-12 form-group">
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      placeholder="Phone"
                      required
                      pattern="\d{10,12}"
                      title="Phone number must be 10 to 12 digits"
                    />
                    <Image src="/img/icon/phone.svg" alt="" width={16} height={16} />
                  </div>

                  {/* Age */}
                  <div className="col-6 form-group">
                    <input
                      type="number"
                      className="form-control"
                      name="age"
                      placeholder="Age"
                      required
                      min="18"
                    />
                    <Image src="/img/icon/phone.svg" alt="" width={16} height={16} />
                  </div>

                  {/* Date */}
                  <div className="col-6 form-group">
                    <input
                      type="date"
                      className="form-control"
                      name="travel_date"
                      required
                      min={
                        new Date(Date.now() + 86400000)
                          .toISOString()
                          .split("T")[0]
                      } // tomorrow
                    />
                    <Image src="/img/icon/calander.svg" alt="" width={16} height={16} />
                  </div>

                  {/* Destination */}
                  <div className="form-group col-12">
                    <select
                      name="destination"
                      className="form-select"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Select Your Destination
                      </option>
                      {destinations.map((dest, index) => (
                        <option key={index} value={dest.name}>
                          {dest.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="form-group col-12">
                    <textarea
                      name="message"
                      cols="30"
                      rows="3"
                      className="form-control"
                      placeholder="Your Message"
                      required
                    ></textarea>
                    <Image src="/img/icon/chat.svg" alt="" width={16} height={16} />
                  </div>

                  {/* Submit */}
                  <div className="form-btn col-12 mt-24">
                    <button
                      type="submit"
                      className="th-btn style3"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send message"}
                      <Image src="/img/icon/plane.svg" alt="" width={16} height={16} />
                    </button>
                    {message != null ? (
                      <div
                        className="alert alert-success mt-3 py-2"
                        role="alert"
                      >
                        {message}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
