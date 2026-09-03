// "use client";
// import React, { useState, useEffect } from "react";
// import { faIndianRupee } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { convertMyDate } from "@/functions/dateFunction";

// function Dates({ active_costs, package_dates }) {
//   const [specialDates, setSpecialDates] = useState([]);

//   useEffect(() => {
//     // console.log(package_dates);
//     setSpecialDates(package_dates.filter((item) => item.special == 1));
//   }, []);

//   return (
//     <div className="min_box-detail Age_limit container my-4">
//       <div className="title">
//         <h6 className="text-center text-md-start fw-bold mb-4 page-title">
//           Costing
//         </h6>
//       </div>

//       <div className="tour-page-single mt-3">
//         <div className="page-content">
//           {/* Regular Costs */}
//           <div className="row g-4 mb-4">
//             {active_costs.map((activity, idx) => (
//               <div key={idx} className="col-auto">
//                 <div className="activity-card shadow-sm">
//                   <h3 className="activity-title">{activity.activity}</h3>
//                   <p className="activity-cost">
//                     <FontAwesomeIcon icon={faIndianRupee} />{" "}
//                     {Number(activity?.discount_percent) > 0 && (
//                       <span className="text-decoration-line-through text-body-secondary">
//                         {Number(activity?.cost)}
//                       </span>
//                     )}{" "}
//                     {Number(activity?.total_with_discount)} +{" "}
//                     {Number(activity?.gst_percent)}% GST
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Special Dates */}
//           {specialDates.length !== 0 && (
//             <>
//               <h3 className="section-title d-flex align-items-center border-bottom pb-2 mb-4 mt-5">
//                 <img
//                   src="/img/icon/party_emoji.png"
//                   alt="Special Dates"
//                   className="me-2"
//                 />
//                 Special Dates
//               </h3>
//               <div className="row justify-content-center">
//                 {specialDates.map((item) => (
//                   <div className="col-12 mb-5" key={item.id}>
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                       <p className="date-range">
//                         {convertMyDate(item.start_date)} -{" "}
//                         {convertMyDate(item.end_date)}
//                       </p>
//                     </div>
//                     <div className="row g-4">
//                       {active_costs.map((activity, idx) => (
//                         <div key={idx} className="col-auto">
//                           <div className="activity-card shadow-sm">
//                             <h3 className="activity-title">
//                               {activity.activity}
//                             </h3>
//                             {Number(item.increase_amount_by_percent) > 0 ? (
//                               <p className="activity-cost">
//                                 <FontAwesomeIcon icon={faIndianRupee} />
//                                 {Number(activity.total_with_discount) +
//                                   (Number(activity.total_with_discount) *
//                                     Number(item.increase_amount_by_percent)) /
//                                     100}{" "}
//                                 + {Number(activity.gst_percent)}% GST
//                               </p>
//                             ) : Number(item.decrease_amount_by_percent) > 0 ? (
//                               <p className="activity-cost">
//                                 <FontAwesomeIcon icon={faIndianRupee} />
//                                 {Number(activity.total_with_discount) -
//                                   (Number(activity.total_with_discount) *
//                                     Number(item.decrease_amount_by_percent)) /
//                                     100}{" "}
//                                 + {Number(activity.gst_percent)}% GST
//                               </p>
//                             ) : (
//                               <p className="activity-cost">
//                                 <FontAwesomeIcon icon={faIndianRupee} />
//                                 {Number(activity.total_with_discount)} +{" "}
//                                 {Number(activity.gst_percent)}% GST
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dates;









"use client";
import React, { useState, useEffect } from "react";
import { faIndianRupee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertMyDate } from "@/functions/dateFunction";

function Dates({ active_costs = [], package_dates = [] }) {
  const [specialDates, setSpecialDates] = useState([]);

  useEffect(() => {
    setSpecialDates(
      package_dates.filter((item) => Number(item.special) === 1)
    );
  }, [package_dates]);

  // ✅ Safe formatter (handles string, null, commas)
  function formatAmountIntl(amount) {
    const cleanAmount = Number(
      String(amount || 0).replace(/,/g, "")
    );
    return new Intl.NumberFormat("en-IN").format(cleanAmount);
  }

  return (
    <div className="min_box-detail Age_limit container my-4">
      <div className="title">
        <h6 className="text-center text-md-start fw-bold mb-4 page-title">
          Costing
        </h6>
      </div>

      <div className="tour-page-single mt-3">
        <div className="page-content">
          
          {/* ✅ Regular Costs */}
          <div className="row g-4 mb-4">
            {active_costs.map((activity, idx) => (
              <div key={idx} className="col-auto">
                <div className="activity-card shadow-sm">
                  <h3 className="activity-title">
                    {activity.activity}
                  </h3>

                  <p className="activity-cost">
                    <FontAwesomeIcon icon={faIndianRupee} />{" "}

                    {Number(activity?.discount_percent) > 0 && (
                      <span className="text-decoration-line-through text-body-secondary">
                        {formatAmountIntl(activity?.cost)}
                      </span>
                    )}{" "}

                    {formatAmountIntl(activity?.total_with_discount)} +{" "}
                    {Number(activity?.gst_percent)}% GST
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Special Dates */}
          {specialDates.length > 0 && (
            <>
              <h3 className="section-title d-flex align-items-center border-bottom pb-2 mb-4 mt-5">
                <img
                  src="/img/icon/party_emoji.png"
                  alt="Special Dates"
                  className="me-2"
                />
                Special Dates
              </h3>

              <div className="row justify-content-center">
                {specialDates.map((item) => (
                  <div className="col-12 mb-5" key={item.id}>
                    
                    {/* Date Range */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <p className="date-range">
                        {convertMyDate(item.start_date)} -{" "}
                        {convertMyDate(item.end_date)}
                      </p>
                    </div>

                    <div className="row g-4">
                      {active_costs.map((activity, idx) => {
                        let finalPrice = Number(
                          String(activity?.total_with_discount || 0).replace(/,/g, "")
                        );

                        // 🔥 Apply increase / decrease if exists
                        if (Number(item.increase_amount_by_percent) > 0) {
                          finalPrice +=
                            (finalPrice *
                              Number(item.increase_amount_by_percent)) /
                            100;
                        } else if (Number(item.decrease_amount_by_percent) > 0) {
                          finalPrice -=
                            (finalPrice *
                              Number(item.decrease_amount_by_percent)) /
                            100;
                        }

                        return (
                          <div key={idx} className="col-auto">
                            <div className="activity-card shadow-sm">
                              <h3 className="activity-title">
                                {activity.activity}
                              </h3>

                              <p className="activity-cost">
                                <FontAwesomeIcon icon={faIndianRupee} />{" "}

                                {Number(activity?.discount_percent) > 0 && (
                                  <span className="text-decoration-line-through text-body-secondary">
                                    {formatAmountIntl(activity?.cost)}
                                  </span>
                                )}{" "}

                                {formatAmountIntl(finalPrice)} +{" "}
                                {Number(activity?.gst_percent)}% GST
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Dates;