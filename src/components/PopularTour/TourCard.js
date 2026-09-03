import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faMapPin,
  faPhone,
  faPhoneAlt,
  faStar as faSolidStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCalendarDays,
  faClock,
  faStar as faRegularStar,
} from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import Image from "next/image";
import "./PopularTour.css";

export default function TourCard({ data, onRequestCallback }) {
  const packageDates = Array.isArray(data.package_dates) ? data.package_dates : [];
  const dates =
    packageDates
      .slice(0, 3)
      .map((d) =>
        new Date(d.start_date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        })
      )
      .join(", ") + (packageDates.length > 3 ? ", ..." : "");


      function formatAmountIntl(amount) {
        return new Intl.NumberFormat('en-US').format(amount);
      }

  const shouldShowBookNow = Number(data?.show_book_no_button) === 1;
  // const checkoutStartingFrom = data?.starting_from ?? data?.starting_price;
  // const checkoutHref = `/booking/${data.slug}?starting_from=${encodeURIComponent(
  //   checkoutStartingFrom || ""
  // )}`;
  const checkoutHref = `/booking/${data.slug}`;

  return (
    <div className="tour-box th-ani gsap-cursor h-100 d-flex flex-column">
      <div className="tour-box_img global-img" style={{ maxHeight: '345px', overflow: 'hidden' }}>
        <Link href={`/${data.slug}`}>
          <Image src={data.thumbnail} alt={data.title} width={300} height={150} />
        </Link>
      </div>
      <div className="tour-content position-absolute top-0 left-0 z-2 w-100 d-flex flex-column justify-content-between">
        <div className="tour_topbar d-flex align-item-center justify-content-between">
          <Link href={`/${data.slug}`} className="th-btn style4 rounded-1 px-2 py-1">
            <i className="d-none d-sm-block ">
              <FontAwesomeIcon icon={faLocationDot} />
            </i>{" "}
            {data.pickup} To {data.drop}
          </Link>
          <Link href={`/${data.slug}`} className="th-btn style4 rounded-1 px-2 py-1">
            <i className="d-none d-sm-block ">
              <FontAwesomeIcon icon={faClock} />
            </i>{" "}
            {data.duration}
          </Link>
        </div>
        {/* <div className="tour-rating">
            <div
              className="star-rating"
              role="img"
              aria-label={`Rated 4 out of 5`}
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const fullStars = Math.floor(4);
                const hasHalfStar = 4 % 1 !== 0;

                if (i < fullStars) {
                  return (
                    <FontAwesomeIcon
                      key={i}
                      icon={faSolidStar}
                      style={{ color: "#0598cc" }}
                    />
                  );
                } else if (i === fullStars && hasHalfStar) {
                  return (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStarHalfStroke}
                      style={{ color: "#0598cc" }}
                    />
                  );
                } else {
                  return (
                    <FontAwesomeIcon
                      key={i}
                      icon={faRegularStar}
                      style={{ color: "#0598cc" }}
                    />
                  );
                }
              })}
            </div>
            <Link href="#" className="woocommerce-review-link">
              {" "}
              (<span className="count">4</span> Rating)
            </Link>
          </div> */}
        {/* <div>
          <h3 className="box-title">
            <Link href={`/${data.slug}`}> {data.title} </Link>
          </h3>
          <h4 className="tour-box_price d-flex flex-wrap align-items-center justify-content-between w-100">
            <span>
              <i>
                <FontAwesomeIcon icon={faCalendarDays} />
              </i>
              {dates}
            </span>
            <span className="currency">
              ₹{Number(data.starting_price)}
              <span className="PerPserson"> /Person</span>
            </span>
          </h4>
        </div> */}
      </div>
      <div className="text-success px-3 pt-4 mb-0 flex-grow-1 d-flex flex-column">
        <h3 className="box-title">
          <Link href={`/${data.slug}`}> {data.title} </Link>
        </h3>
        {/* <div className="tour-rating">
            <div
              className="star-rating"
              role="img"
              aria-label={`Rated 4 out of 5`}
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const fullStars = Math.floor(4);
                const hasHalfStar = 4 % 1 !== 0;

                if (i < fullStars) {
                  return (
                    <FontAwesomeIcon
                      key={i}
                      icon={faSolidStar}
                      style={{ color: "#0598cc" }}
                    />
                  );
                } else if (i === fullStars && hasHalfStar) {
                  return (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStarHalfStroke}
                      style={{ color: "#0598cc" }}
                    />
                  );
                } else {
                  return (
                    <FontAwesomeIcon
                      key={i}
                      icon={faRegularStar}
                      style={{ color: "#0598cc" }}
                    />
                  );
                }
              })}
            </div>
            <Link href="#" className="woocommerce-review-link">
              {" "}
              (<span className="count">4</span> Rating)
            </Link>
          </div> */}

        <h4 className="tour-box_price mb-2 d-flex flex-wrap align-items-center justify-content-between w-100 mt-auto">
          <Link href={`/${data.slug}`}>
            {dates.length > 0 ? <span className="text-dark calender">
              <i >
                <FontAwesomeIcon icon={faCalendarDays} />
              </i>
              {dates}
            </span> : " "}
          </Link>
          <Link href={`/${data.slug}`}>

            <span className="currency">
             ₹{formatAmountIntl(Number(data.starting_price))}
              <span className="PerPserson text-dark"> /Person</span>
            </span>
          </Link>
        </h4>
      </div>
      <div className="tour-action px-3 gap-3  mb-2">
        <Link
          href="tel:8287828267"
          className="th-btn style4 w-auto px-xl-4 px-4 py-2"
        >
          <FontAwesomeIcon icon={faPhone} />
        </Link>
        <Link href="#" onClick={(e) => { e.preventDefault(); onRequestCallback(); }} className="th-btn style4 th-icon w-100">
          Request CallBack
        </Link>
        {shouldShowBookNow && (
          <Link href={checkoutHref} className="th-btn style4 th-icon w-100">
            Book Now
          </Link>
        )}
      </div>
    </div>
  );
}
