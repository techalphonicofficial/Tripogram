import Image from "next/image";
import React from "react";

export default function AboutItem({ icon, title, text }) {
  return (
    <div className="about-item d-flex mb-3">
      <div className="about-item_img me-3">
        <Image src={icon} alt={title} width={40} height={40} />
      </div>
      <div className="about-item_centent">
        <h5 className="box-title">{title}</h5>
        <p className="about-item_text">{text}</p>
      </div>
    </div>
  ); 
}
