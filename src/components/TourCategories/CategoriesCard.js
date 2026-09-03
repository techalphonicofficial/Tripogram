import Link from "next/link";
import Image from "next/image";
import React from "react";

export const CategoriesCard = ({ image, title, slug }) => {
    // console.log("CategoriesCard" , image)
  return (
               <div className="category-card">
                <div
                  className="box-img global-img position-relative"
                  style={{ width: "100%", height: "250px" }}
                >
                  <Link href={`/trips/${slug}`}>
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-fit-cover w-100 h-100"
                  />
                  </Link>
                </div>
                <h3 className="box-title">
                  <Link href={`/trips/${slug}`}>{title}</Link>
                </h3>
                <Link href={`/trips/${slug}`} className="line-btn">
                  See more
                </Link>
              </div> 
  );
};
