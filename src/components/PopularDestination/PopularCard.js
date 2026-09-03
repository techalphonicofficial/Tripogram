import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function PopularCard({ image, title, subtitle, slug }) {
  return (
    <div className="destination-box gsap-cursor">
      <div className="destination-img" >
        <Image
          src={image}
          alt={title}
          fill
          className="object-fit-cover w-100 h-100 rounded"
        />
        <div className="destination-content">
          <div className="media-left">
            <h4 className="box-title text-white">{title}</h4>
            <span className="destination-subtitle ">{subtitle} Pckages</span>
          </div>
          <div className="mt-2">
            <Link
              href={`/destination/${slug}`}
              className="th-btn style2 th-icon"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
