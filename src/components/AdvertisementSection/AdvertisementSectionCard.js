"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getPagewithSection } from "@/services/pageSection";

export default function AdvertisementSectionCard() {
  const [section, setSection] = useState(null);

  useEffect(() => {
    getPagewithSection(1, "banner_hero_section")
      .then((mainpage) => setSection(mainpage?.section?.[0] || null))
      .catch((error) => console.error("Failed to fetch advertisement section:", error));
  }, []);

  if (!section) return null;

  return (
    <section
      className={`category-bit-area bg-top-center ${section?.data?.show_type === "none" ? "d-none" : ""}`}
    >
      <div className="container ">
        <div
          className="adv-area text-center w-100"
          style={{
            borderRadius: "24px",
            overflow: "hidden",
          }}
        >
          {section?.data?.show_type === "image" ? (
            <Image
              className="img-fluid h-100 w-100"
              width={1200}
              height={560}
              src={
                process.env.NEXT_PUBLIC_MEDIA_PATH +
                section.data.image
              }
              alt="Advertisement"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <video
              className="img-fluid w-100 h-100"
              autoPlay
              muted
              loop
              playsInline
              style={{ objectFit: "cover" }}
            >
              <source
                src={
                  process.env.NEXT_PUBLIC_MEDIA_PATH +
                  section.data.video
                }
                type="video/mp4"
              />
            </video>
          )}
        </div>
      </div>
    </section>
  );
}

//   <section
//     className="category-area bg-top-center mb-5" style={{marginTop:'24px', paddingTop:'24px' }}>
//     <div className="container">
//       <div className="adv-area text-center w-100" style={{height:'560px'}}  >
//           {mainpage?.section?.[1]?.data?.type === "image" ? 
//        <Image className="img-fluid h-100" style={{borderRadius:'24px', overflow:'hidden'}} width={1200} height={560} src={process.env.NEXT_PUBLIC_MEDIA_PATH + mainpage?.section?.[1]?.data?.image} alt=""/>
//              : 
//         <video
//       className="img-fluid w-100 h-100"
//       autoPlay
//       muted
//       loop
//       playsInline
//     >
//       <source src="img/hero/hero-video3.mp4" type="video/mp4" />
//       Your browser does not support the video tag.
//     </video>

//              }
//       </div>
//     </div>
//   </section>
