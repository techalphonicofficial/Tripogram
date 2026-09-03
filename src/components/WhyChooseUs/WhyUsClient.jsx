"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: {
    opacity: 0,
    x: -50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export default function WhyUsClient({ data, mediaPath }) {
  const grouped = useMemo(() => {
    const groupedArr = [];
    let temp = [];

    for (let i = 2; i <= 13; i++) {
      const obj = data?.section?.[i];
      if (!obj) continue;

      if (obj.type === "image") {
        if (temp.length) groupedArr.push(temp);
        temp = [{ key: obj.id || `why-us-${i}` }, { image: obj.data }];
      } else if (obj.type === "Text") {
        temp.push({ Text: obj.data });
      } else if (obj.type === "content") {
        temp.push({ content: obj.data });
      }
    }

    if (temp.length) groupedArr.push(temp);
    return groupedArr;
  }, [data]);

  return (
    <div className="whyus-container space">
      <div className="container">
        <div className="title-area mb-20 text-center">
          <span className="sub-title">{data?.section?.[0]?.data?.Text}</span>
          <h2 className="sec-title">{data?.section?.[1]?.data?.Text}</h2>
        </div>

        <div className="row mt-40">
          {grouped.map((item) => (
            <div className="col-lg-3 mb-3" key={item[0].key}>
              <motion.article
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                style={{
                  backgroundImage: `url('${mediaPath}${item[1]?.image?.image || ""}')`,
                }}
                className="whyus-card"
              >
                <div className="whyus-card-inner">
                  <h3 className="whyus-card-title">{item[2]?.Text?.Text}</h3>
                  <p className="whyus-card-description">
                    {item[3]?.content?.content}
                  </p>
                </div>
              </motion.article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
