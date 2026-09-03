// import { api } from "@/services/config";
// import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import React, { useMemo, useEffect, useState } from "react";
// import { redirect } from "next/navigation";
// import { useRouter } from "next/navigation";
// import { decrypt, encrypt } from "@/functions/crypt";

// export default function Pricing({
//   step,
//   setStep,
//   selectedCosts,
//   formCompleted,
//   setFullAmount,
//   paybleType,
//   slug,
//   razorpay_key,
// }) {
//   const router = useRouter();

//   const bookingData = (() => {
//     try {
//       return JSON.parse(decrypt(localStorage.getItem(`tripogram_${slug}`))) || {};
//     } catch {
//       return {};
//     }
//   })();

//   const getButtonLabel = () => {
//     if (step === 1) return "Proceed to Traveller Details";
//     if (step === 2) return "Proceed to Billing";
//     if (step === 3) return "Make a Trip";
//   };

//   const totals = useMemo(() => {
//     let subtotal = 0;
//     let totalDiscount = 0;
//     let totalAfterDiscount = 0;
//     let totalGst = 0;
//     let grandTotal = 0;

//     selectedCosts.forEach((item) => {
//       const qty = item.quantity;
//       const cost = item.cost;

//       const itemSubtotal = cost * qty;
//       const itemDiscount =
//         cost * (parseFloat(item.discount_percent) / 100) * qty;
//       const itemAfterDiscount = itemSubtotal - itemDiscount;
//       const itemGst = itemAfterDiscount * (parseFloat(item.gst_percent) / 100);
//       const itemGrand = itemAfterDiscount + itemGst;

//       subtotal += itemSubtotal;
//       totalDiscount += itemDiscount;
//       totalAfterDiscount += itemAfterDiscount;
//       totalGst += itemGst;
//       grandTotal += itemGrand;
//     });
//     return {
//       subtotal,
//       totalDiscount,
//       totalAfterDiscount,
//       totalGst,
//       grandTotal,
//     };
//   }, [selectedCosts]);

//   useEffect(() => {
//     setFullAmount(totals.grandTotal);
//   }, [totals.grandTotal, setFullAmount]);

//   const handleClick = () => {
//     if (step < 3) {
//       if (selectedCosts.length > 0) {
//         setStep(2);
//         if (formCompleted) {
//           setStep(3);
//         }
//       }
//     } else {
//       localStorage.setItem(
//         `tripogram_${slug}`,
//         encrypt(
//         JSON.stringify({
//           ...bookingData,
//           final_amount: Number(totals.grandTotal.toFixed(0)),
//           paid_amount:
//             paybleType == "full"
//               ? Number(totals.grandTotal.toFixed(0))
//               : Number(
//                   (
//                     (totals.grandTotal * razorpay_key.package_amount_percent) /
//                     100
//                   ).toFixed(0)
//                 ),
//           due_amount:
//             paybleType != "full"
//               ? Number(
//                   (
//                     (totals.grandTotal * razorpay_key.package_amount_percent) /
//                     100
//                   ).toFixed(0)
//                 )
//               : 0,
//         })
//         )
//       );
//       openRazorpay();
//     }
//   };
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   const openRazorpay = () => {
//     const weblogo = document.querySelector(".header-top").dataset.weblogo;
//     const options = {
//       key: razorpay_key.razorpay_key_id,
//       amount:
//         (paybleType == "full"
//           ? totals.grandTotal.toFixed(0)
//           : (
//               (totals.grandTotal * razorpay_key.package_amount_percent) /
//               100
//             ).toFixed(0)) * 100,
//       currency: "INR",
//       name: "Tripogram",
//       image: weblogo,
//       handler: async (response) => {
//         const payload =
//           JSON.parse(decrypt(localStorage.getItem(`tripogram_${slug}`))) || {};
//         try {
//           const res = await api.post("/booking/add-booking", {
//             ...payload,
//             ...response,
//           });
//           console.log("booking response", res)

//           if (res.data.success === true) {
//             console.log(JSON.stringify(res.data));
//             localStorage.removeItem(`tripogram_${slug}`);  
//             router.push("/thankyou");
//           }
//         } catch (error) {
//           if (error.response) {
//             console.error("Server Error:", error.response.data);
//             // setMessage(error.response.data.message || "Something went wrong");
//           } else if (error.request) {
//             console.error("No response from server:", error.request);
//             // setMessage("No response from server, please try again.");
//           } else {
//             console.error("Error:", error.message);
//             // setMessage(error.message || "Unexpected error occurred");
//           }
//         } finally {
//           // setLoading(false);
//         }
//       },
//       prefill: {
//         name: bookingData.ful_name,
//         email: bookingData.email,
//         contact: bookingData.phone,
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };
//   return (
//     <div className="min_box-detail Age_limit book_Amount container my-4">
//       <div className="title d-flex justify-content-between gap-5">
//         <h6 className="text-start flex-wrap fw-bold mb-4 page-title">
//           Amount to Pay{" "}
//           {paybleType == "full" ? (
//             <span>₹{totals.grandTotal.toFixed(0)}/-</span>
//           ) : (
//             <span>
//               ₹
//               {(
//                 (totals.grandTotal * razorpay_key.package_amount_percent) /
//                 100
//               ).toFixed(0)}
//               /-
//             </span>
//           )}
//         </h6>
//       </div>

//       <div className="pricing_box">
//         <div className="pricong-table">
//           <div className="table-responsive">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Room sharing</th>
//                   <th>Selling Cost (Per Person)</th>
//                   <th>Discounted Cost (Per Person)</th>
//                   <th>Qty.</th>
//                   <th>Cost</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedCosts.map((costs) => (
//                   <tr key={costs.id}>
//                     <td>{costs.activity}</td>
//                     <td className="text-decoration-line-through">
//                       ₹{costs.cost.toFixed(0)}/-
//                     </td>
//                     <td>
//                       ₹
//                       {costs.cost -
//                         (costs.cost * Number(costs.discount_percent)) / 100}
//                       /-
//                     </td>
//                     <td>{costs.quantity}</td>
//                     <td>
//                       ₹
//                       {(costs.cost -
//                         (costs.cost * Number(costs.discount_percent)) / 100) *
//                         costs.quantity}
//                       /-
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="pring_data">
//             <ul className="list-unstyled">
//               <li className="d-flex justify-content-between">
//                 Subtotal <span>₹{totals.subtotal.toFixed(0)}</span>
//               </li>
//               <li className="d-flex justify-content-between">
//                 GST (5%)<span>₹{totals.totalGst.toFixed(0)}</span>
//               </li>
//               <li className="d-flex justify-content-between">
//                 Discount{" "}
//                 <span className="text-decoration-line-through">
//                   ₹{totals.totalDiscount.toFixed(0)}
//                 </span>
//               </li>
//               <hr />
//               {paybleType == "full" ? (
//                 <li className="d-flex justify-content-between text-capitalize">
//                   Full Amount To Pay{" "}
//                   <span>₹{totals.grandTotal.toFixed(0)}/-</span>
//                 </li>
//               ) : (
//                 <li className="d-flex justify-content-between text-capitalize">
//                   {razorpay_key.package_amount_percent}% Amount To Pay{" "}
//                   <span>
//                     ₹
//                     {(
//                       (totals.grandTotal *
//                         razorpay_key.package_amount_percent) /
//                       100
//                     ).toFixed(0)}
//                     /-
//                   </span>
//                 </li>
//               )}
//             </ul>
//           </div>

//           {/* Step Buttons */}
//           <div className="d-flex flex-lg-nowrap flex-wrap gap-lg-4 gap-1">
//             {/* Back Button only if not in Step 1 */}
//             {step > 1 && (
//               <button
//                 className="btn btn-primary d-flex align-items-center gap-3 w-auto rounded-pill mt-3 fw-semibold py-2 px-4"
//                 onClick={() => setStep(step - 1)}
//               >
//                 <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Back
//               </button>
//             )}

//             <button
//               className="btn btn-primary w-100 rounded-pill mt-3 fw-semibold py-2"
//               onClick={handleClick}
//             >
//               {getButtonLabel()}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


Pricing.js



// import { api } from "@/services/config";
// import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import React, { useMemo, useEffect, useState } from "react";
// import { redirect } from "next/navigation";
// import { useRouter } from "next/navigation";
// import { decrypt, encrypt } from "@/functions/crypt";

// export default function Pricing({
//   step,
//   setStep,
//   selectedCosts,
//   formCompleted,
//   setFullAmount,
//   paybleType,
//   slug,
//   razorpay_key,
// }) {
//   const router = useRouter();

//   const bookingData = (() => {
//     try {
//       return JSON.parse(decrypt(localStorage.getItem(`tripogram_${slug}`))) || {};
//     } catch {
//       return {};
//     }
//   })();

//   const getButtonLabel = () => {
//     if (step === 1) return "Proceed to Traveller Details";
//     if (step === 2) return "Proceed to Billing";
//     if (step === 3) return "Make a Trip";
//   };

//   const totals = useMemo(() => {
//     let subtotal = 0;
//     let totalDiscount = 0;
//     let totalAfterDiscount = 0;
//     let totalGst = 0;
//     let grandTotal = 0;

//     selectedCosts.forEach((item) => {
//       const qty = item.quantity;
//       const cost = item.cost;

//       const itemSubtotal = cost * qty;
//       const itemDiscount =
//         cost * (parseFloat(item.discount_percent) / 100) * qty;
//       const itemAfterDiscount = itemSubtotal - itemDiscount;
//       const itemGst = itemAfterDiscount * (parseFloat(item.gst_percent) / 100);
//       const itemGrand = itemAfterDiscount + itemGst;

//       subtotal += itemSubtotal;
//       totalDiscount += itemDiscount;
//       totalAfterDiscount += itemAfterDiscount;
//       totalGst += itemGst;
//       grandTotal += itemGrand;
//     });
//     return {
//       subtotal,
//       totalDiscount,
//       totalAfterDiscount,
//       totalGst,
//       grandTotal,
//     };
//   }, [selectedCosts]);

//   useEffect(() => {
//     setFullAmount(totals.grandTotal);
//   }, [totals.grandTotal, setFullAmount]);

//   const handleClick = () => {
//     if (step < 3) {
//       if (selectedCosts.length > 0) {
//         setStep(2);
//         if (formCompleted) {
//           setStep(3);
//         }
//       }
//     } else {
//       localStorage.setItem(
//         `tripogram_${slug}`,
//         encrypt(
//         JSON.stringify({
//           ...bookingData,
//           final_amount: Number(totals.grandTotal.toFixed(0)),
//           paid_amount:
//             paybleType == "full"
//               ? Number(totals.grandTotal.toFixed(0))
//               : Number(
//                   (
//                     (totals.grandTotal * razorpay_key.package_amount_percent) /
//                     100
//                   ).toFixed(0)
//                 ),
//           due_amount:
//             paybleType != "full"
//               ? Number(
//                   (
//                     (totals.grandTotal * razorpay_key.package_amount_percent) /
//                     100
//                   ).toFixed(0)
//                 )
//               : 0,
//         })
//         )
//       );
//       openRazorpay();
//     }
//   };
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   const openRazorpay = () => {
//     const weblogo = document.querySelector(".header-top").dataset.weblogo;
//     const options = {
//       key: razorpay_key.razorpay_key_id,
//       amount:
//         (paybleType == "full"
//           ? totals.grandTotal.toFixed(0)
//           : (
//               (totals.grandTotal * razorpay_key.package_amount_percent) /
//               100
//             ).toFixed(0)) * 100,
//       currency: "INR",
//       name: "Tripogram",
//       image: weblogo,
//       handler: async (response) => {
//         const payload =
//           JSON.parse(decrypt(localStorage.getItem(`tripogram_${slug}`))) || {};
//         try {
//           const res = await api.post("/booking/add-booking", {
//             ...payload,
//             ...response,
//           });
//           console.log("booking response", res)

//           if (res.data.success === true) {
//             console.log(JSON.stringify(res.data));
//             localStorage.removeItem(`tripogram_${slug}`);  
//             router.push("/thankyou");
//           }
//         } catch (error) {
//           if (error.response) {
//             console.error("Server Error:", error.response.data);
//             // setMessage(error.response.data.message || "Something went wrong");
//           } else if (error.request) {
//             console.error("No response from server:", error.request);
//             // setMessage("No response from server, please try again.");
//           } else {
//             console.error("Error:", error.message);
//             // setMessage(error.message || "Unexpected error occurred");
//           }
//         } finally {
//           // setLoading(false);
//         }
//       },
//       prefill: {
//         name: bookingData.ful_name,
//         email: bookingData.email,
//         contact: bookingData.phone,
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };
//   return (
//     <div className="min_box-detail Age_limit book_Amount container my-4">
//       <div className="title d-flex justify-content-between gap-5">
//         <h6 className="text-start flex-wrap fw-bold mb-4 page-title">
//           Amount to Pay{" "}
//           {paybleType == "full" ? (
//             <span>₹{totals.grandTotal.toFixed(0)}/-</span>
//           ) : (
//             <span>
//               ₹
//               {(
//                 (totals.grandTotal * razorpay_key.package_amount_percent) /
//                 100
//               ).toFixed(0)}
//               /-
//             </span>
//           )}
//         </h6>
//       </div>

//       <div className="pricing_box">
//         <div className="pricong-table">
//           <div className="table-responsive">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Room sharing</th>
//                   <th>Selling Cost (Per Person)</th>
//                   <th>Discounted Cost (Per Person)</th>
//                   <th>Qty.</th>
//                   <th>Cost</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedCosts.map((costs) => (
//                   <tr key={costs.id}>
//                     <td>{costs.activity}</td>
//                     <td className="text-decoration-line-through">
//                       ₹{costs.cost.toFixed(0)}/-
//                     </td>
//                     <td>
//                       ₹
//                       {costs.cost -
//                         (costs.cost * Number(costs.discount_percent)) / 100}
//                       /-
//                     </td>
//                     <td>{costs.quantity}</td>
//                     <td>
//                       ₹
//                       {(costs.cost -
//                         (costs.cost * Number(costs.discount_percent)) / 100) *
//                         costs.quantity}
//                       /-
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="pring_data">
//             <ul className="list-unstyled">
//               <li className="d-flex justify-content-between">
//                 Subtotal <span>₹{totals.subtotal.toFixed(0)}</span>
//               </li>
//               <li className="d-flex justify-content-between">
//                 GST (5%)<span>₹{totals.totalGst.toFixed(0)}</span>
//               </li>
//               <li className="d-flex justify-content-between">
//                 Discount{" "}
//                 <span className="text-decoration-line-through">
//                   ₹{totals.totalDiscount.toFixed(0)}
//                 </span>
//               </li>
//               <hr />
//               {paybleType == "full" ? (
//                 <li className="d-flex justify-content-between text-capitalize">
//                   Full Amount To Pay{" "}
//                   <span>₹{totals.grandTotal.toFixed(0)}/-</span>
//                 </li>
//               ) : (
//                 <li className="d-flex justify-content-between text-capitalize">
//                   {razorpay_key.package_amount_percent}% Amount To Pay{" "}
//                   <span>
//                     ₹
//                     {(
//                       (totals.grandTotal *
//                         razorpay_key.package_amount_percent) /
//                       100
//                     ).toFixed(0)}
//                     /-
//                   </span>
//                 </li>
//               )}
//             </ul>
//           </div>

//           {/* Step Buttons */}
//           <div className="d-flex flex-lg-nowrap flex-wrap gap-lg-4 gap-1">
//             {/* Back Button only if not in Step 1 */}
//             {step > 1 && (
//               <button
//                 className="btn btn-primary d-flex align-items-center gap-3 w-auto rounded-pill mt-3 fw-semibold py-2 px-4"
//                 onClick={() => setStep(step - 1)}
//               >
//                 <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Back
//               </button>
//             )}

//             <button
//               className="btn btn-primary w-100 rounded-pill mt-3 fw-semibold py-2"
//               onClick={handleClick}
//             >
//               {getButtonLabel()}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// import { api } from "@/services/config";
// import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import React, { useMemo, useEffect, useState } from "react";
// import { redirect } from "next/navigation";
// import { useRouter } from "next/navigation";
// import { decrypt, encrypt } from "@/functions/crypt";

// export default function Pricing({
//   step,
//   setStep,
//   selectedCosts,
//   formCompleted,
//   setFullAmount,
//   paybleType,
//   slug,
//   razorpay_key,
//   bookingAmount,
//   totalTravellers,
//   appliedCoupons = [],
// }) {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false); // Loading state
//   const [couponError, setCouponError] = useState("");

//   console.log("step", step);
//   console.log("setStep", setStep);
//   console.log("selectedCosts", selectedCosts);
//   console.log("formCompleted", formCompleted);
//   console.log("setFullAmount", setFullAmount);
//   console.log("paybleType", paybleType);
//   console.log("slug", slug);
//   console.log("razorpay_key", razorpay_key);
//   console.log("bookingAmount", bookingAmount);
//   console.log("totalTravellers", totalTravellers);
//   console.log("appliedCoupons", appliedCoupons);

//   const getBookingData = () => {
//     if (typeof window === "undefined") return {};
//     try {
//       const data = localStorage.getItem(`tripogram_${slug}`);
//       if (!data) return {};
//       const decrypted = decrypt(data);
//       // Handle potential double stringification
//       const parsed = typeof decrypted === "string" ? JSON.parse(decrypted) : decrypted;
//       console.log("Fetched booking data:", parsed);
//       return parsed;
//     } catch (e) {
//       console.error("Error reading booking data:", e);
//       return {};
//     }
//   };

//   const getButtonLabel = () => {
//     if (isLoading) return "Processing..."; // Show loading text
//     if (step === 1) return "Proceed to Traveller Details";
//     if (step === 2) return "Proceed to Billing";
//     if (step === 3) return "Make a Trip";
//   };

//   const totals = useMemo(() => {
//     let subtotal = 0;
//     let totalDiscount = 0;
//     let totalAfterDiscount = 0;
//     let totalGst = 0;
//     let grandTotal = 0;
//     let gstPercent = 0;
//     const couponDiscount = appliedCoupons.reduce((sum, c) => sum + Number(c.coupon_final_amount || 0), 0);

//     selectedCosts.forEach((item) => {
//       const qty = item.quantity;
//       const cost = item.cost;

//       const itemSubtotal = cost * qty;
//       const itemDiscount =
//         cost * (parseFloat(item.discount_percent) / 100) * qty;
//       const itemAfterDiscount = itemSubtotal - itemDiscount - couponDiscount;
//       const itemGst = itemAfterDiscount * (parseFloat(item.gst_percent) / 100);
//       const itemGrand = itemAfterDiscount + itemGst;
//       gstPercent = item.gst_percent;

//       subtotal += itemSubtotal;
//       totalDiscount += itemDiscount;
//       totalAfterDiscount += itemAfterDiscount;
//       totalGst += itemGst;
//       grandTotal += itemGrand;
//     });

//     grandTotal;

//     return {
//       subtotal,
//       totalDiscount,
//       totalAfterDiscount,
//       totalGst,
//       grandTotal,
//       gstPercent,
//       couponDiscount,
//     };
//   }, [selectedCosts, appliedCoupons]);

//   useEffect(() => {
//     setFullAmount(totals.grandTotal);
//   }, [totals.grandTotal, setFullAmount]);

//   const handleClick = () => {
//     if (step === 1 && appliedCoupons.length > totalTravellers) {
//       setCouponError("First remove coupon code, per person 1 coupon can be applied.");
//       return;
//     }
//     setCouponError("");

//     if (step < 3) {
//       if (selectedCosts.length > 0) {
//         setStep(2);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         if (formCompleted) {
//           setStep(3);
//         }
//       }
//     } else {
//       setIsLoading(true);
//       const freshBookingData = getBookingData();

//       // Comprehensive validation before opening Razorpay
//       const missingFields = [];
//       if (!freshBookingData.email) missingFields.push("Email");
//       if (!freshBookingData.full_name && !freshBookingData.ful_name) missingFields.push("Full Name");
//       if (!freshBookingData.phone) missingFields.push("Phone");
//       if (!freshBookingData.package_id) missingFields.push("Package Selection");
//       if (!freshBookingData.start_date) missingFields.push("Trip Date");

//       if (missingFields.length > 0) {
//         alert(`Please complete the following details before proceeding: ${missingFields.join(", ")}`);

//         // Redirect to appropriate step
//         if (!freshBookingData.package_id || !freshBookingData.start_date) {
//           setStep(1);
//         } else {
//           setStep(2);
//         }

//         setIsLoading(false);
//         return;
//       }

//       try {
//         localStorage.setItem(
//           `tripogram_${slug}`,
//           encrypt(
//             JSON.stringify({
//               ...freshBookingData,
//               active_cost: selectedCosts,
//               applied_coupons: appliedCoupons.map(c => c.coupon_code),
//               total_coupon_discount: totals.couponDiscount,
//               final_amount: Number(totals.grandTotal.toFixed(0)),
//               total_amount: Number(totals.grandTotal.toFixed(0)),
//               payable_type: paybleType,
//               paid_amount:
//                 paybleType == "full"
//                   ? Number(totals.grandTotal.toFixed(0))
//                   : Number((bookingAmount * totalTravellers).toFixed(0)),
//               due_amount:
//                 paybleType != "full"
//                   ? Number((totals.grandTotal - (bookingAmount * totalTravellers)).toFixed(0))
//                   : 0,
//             })
//           )
//         );
//       } catch (e) { 
//         console.error("Error saving booking data:", e);
//       }
//       openRazorpay();
//     }
//   };

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   const openRazorpay = () => {
//     const weblogo = document.querySelector(".header-top")?.dataset?.weblogo || '';
//     const freshBookingData = getBookingData();

//     const options = {
//       key: razorpay_key.razorpay_key_id,
//       amount:
//         (paybleType == "full"
//           ? totals.grandTotal.toFixed(0)
//           : (bookingAmount * totalTravellers).toFixed(0)) * 100,
//       currency: "INR",
//       name: "Tripogram",
//       image: weblogo,
//       handler: async (response) => {
//         let payload = {};
//         try {
//           payload = getBookingData();
//           console.log("Fresh payload for submission:", payload);
//         } catch (e) { }
//         try {
//           const res = await api.post("/booking/add-booking", {
//             ...payload,
//             ...response,
//           });
//           console.log("Booking submission response:", res)
//           if (res.data.success === true) {
//             try {
//               localStorage.removeItem(`tripogram_${slug}`);
//             } catch (e) { }
//             router.push("/thankyou");
//           } else {
//             alert(res.data.message || "Booking failed. Please try again.");
//           }
//         } catch (error) {
//           if (error.response) {
//             console.error("Server Error:", error.response.data);
//             alert(error.response.data.message || "Validation failed. Please check your details.");
//           } else if (error.request) {
//             console.error("No response from server:", error.request);
//             alert("No response from server, please try again.");
//           } else {
//             console.error("Error:", error.message);
//             alert(error.message || "Unexpected error occurred");
//           }
//         } finally {
//           setIsLoading(false);
//         }
//       },
//       modal: {
//         ondismiss: () => {
//           setIsLoading(false);
//           alert("Payment cancelled. You can try again when you're ready.");
//         },
//       },
//       prefill: {
//         name: freshBookingData.full_name || freshBookingData.ful_name || '',
//         email: freshBookingData.email || '',
//         contact: freshBookingData.phone || '',
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     const rzp = new window.Razorpay(options);

//     // Handle case where Razorpay fails to open
//     rzp.on('payment.failed', function (response) {
//       console.error('Payment failed:', response.error);
//       setIsLoading(false); // Remove loading state on payment failure
//       alert('Payment failed: ' + (response.error.description || 'Please try again'));
//     });

//     rzp.open();
//   };

//   // Handle Razorpay modal close (alternative method)
//   useEffect(() => {
//     const handleRazorpayClose = () => {
//       // Check if there's an active Razorpay instance and modal is closed
//       // This is a fallback in case the modal.ondismiss doesn't work
//       setTimeout(() => {
//         // Check if Razorpay modal is not visible
//         const razorpayModal = document.querySelector('.razorpay-container');
//         if (!razorpayModal || razorpayModal.style.display === 'none') {
//           setIsLoading(false);
//         }
//       }, 500);
//     };

//     window.addEventListener('popstate', handleRazorpayClose);
//     window.addEventListener('blur', handleRazorpayClose);

//     return () => {
//       window.removeEventListener('popstate', handleRazorpayClose);
//       window.removeEventListener('blur', handleRazorpayClose);
//     };
//   }, []);

//   return (
//     <div className="min_box-detail Age_limit book_Amount container my-4">
//       <div className="title d-flex justify-content-between gap-5">
//         <h6 className="text-start flex-wrap fw-bold mb-4 page-title">
//           Amount to Pay{" "}
//           {paybleType == "full" ? (
//             <span>₹{totals.grandTotal.toFixed(0)}/-</span>
//           ) : (
//             <span>
//               ₹{(bookingAmount * totalTravellers).toFixed(0)}/-
//             </span>
//           )}
//         </h6>
//       </div>

//       <div className="pricing_box">
//         <div className="pricong-table">
//           <div className="table-responsive">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Room sharing</th>
//                   <th>Selling Cost (Per Person)</th>
//                   <th>Discounted Cost (Per Person)</th>
//                   <th>Qty.</th>
//                   <th>Cost</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedCosts.map((costs) => (
//                   <tr key={costs.id}>
//                     <td>{costs.activity}</td>
//                     <td className="text-decoration-line-through">
//                       ₹{Number(costs.cost).toFixed(0)}/-
//                     </td>
//                     <td>
//                       ₹
//                       {costs.cost -
//                         (costs.cost * Number(costs.discount_percent)) / 100}
//                       /-
//                     </td>
//                     <td>{costs.quantity}</td>
//                     <td>
//                       ₹
//                       {(costs.cost -
//                         (costs.cost * Number(costs.discount_percent)) / 100) *
//                         costs.quantity}
//                       /-
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="pring_data">
//             <ul className="list-unstyled">
//               <li className="d-flex justify-content-between">
//                 Subtotal <span>₹{totals.subtotal.toFixed(0)}</span>
//               </li>
//               {totals.couponDiscount > 0 && (
//                 <li className="d-flex justify-content-between text-success fw-bold">
//                   Coupon Discount <span>- ₹{totals.couponDiscount}</span>
//                 </li>
//               )}
//               <li className="d-flex justify-content-between">
//                 GST ({totals?.gstPercent}%)<span>₹{totals.totalGst.toFixed(0)}</span>
//               </li>
//               <li className="d-flex justify-content-between">
//                 Discount{" "}
//                 <span className="text-decoration-line-through">
//                   ₹{totals.totalDiscount.toFixed(0)}
//                 </span>
//               </li>
//               <hr />
//               {paybleType == "full" ? (
//                 <li className="d-flex justify-content-between text-capitalize">
//                   Full Amount To Pay{" "}
//                   <span>₹{totals.grandTotal.toFixed(0)}/-</span>
//                 </li>
//               ) : (
//                 <>
//                   <li className="d-flex justify-content-between text-capitalize">
//                     Booking Amount To Pay{" "}
//                     <span>
//                       ₹{(bookingAmount * totalTravellers).toFixed(0)}/-
//                     </span>
//                   </li>
//                   <li className="d-flex justify-content-between text-capitalize text-danger fw-bold">
//                     Remaining Amount{" "}
//                     <span>
//                       ₹{(totals.grandTotal - (bookingAmount * totalTravellers)).toFixed(0)}/-
//                     </span>
//                   </li>
//                 </>
//               )}
//             </ul>
//           </div>

//           {/* Step Buttons */}
//           <div className="d-flex flex-lg-nowrap flex-wrap gap-lg-4 gap-1">
//             {/* Back Button only if not in Step 1 */}
//             {step > 1 && (
//               <button
//                 className="btn btn-primary d-flex align-items-center gap-3 w-auto rounded-pill mt-3 fw-semibold py-2 px-4"
//                 onClick={() => setStep(step - 1)}
//                 disabled={isLoading} // Disable back button when loading
//               >
//                 <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Back
//               </button>
//             )}

//             <button
//               className="btn btn-primary w-100 rounded-pill mt-3 fw-semibold py-2"
//               onClick={handleClick}
//               disabled={isLoading} // Disable button when loading
//             >
//               {isLoading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                   {getButtonLabel()}
//                 </>
//               ) : (
//                 getButtonLabel()
//               )}
//             </button>
//           </div>
//           {couponError && <p className="text-danger small mt-2 fw-bold">{couponError}</p>}
//         </div>
//       </div>

//       {/* Optional: Add a full-page overlay loader */}
//       {isLoading && (
//         <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
//           style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
//           <div className="bg-white p-4 rounded-3 text-center">
//             <div className="spinner-border text-primary mb-3" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <h5>Processing your booking...</h5>
//             <p className="text-muted mb-0">Please don't close this window</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





Pricing.js



// import { api } from "@/services/config";
// import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import React, { useMemo, useEffect, useState } from "react";
// import { redirect } from "next/navigation";
// import { useRouter } from "next/navigation";
// import { decrypt, encrypt } from "@/functions/crypt";

// export default function Pricing({
//   step,
//   setStep,
//   selectedCosts,
//   formCompleted,
//   setFullAmount,
//   paybleType,
//   slug,
//   razorpay_key,
// }) {
//   const router = useRouter();

//   const bookingData = (() => {
//     try {
//       return JSON.parse(decrypt(localStorage.getItem(`tripogram_${slug}`))) || {};
//     } catch {
//       return {};
//     }
//   })();

//   const getButtonLabel = () => {
//     if (step === 1) return "Proceed to Traveller Details";
//     if (step === 2) return "Proceed to Billing";
//     if (step === 3) return "Make a Trip";
//   };

//   const totals = useMemo(() => {
//     let subtotal = 0;
//     let totalDiscount = 0;
//     let totalAfterDiscount = 0;
//     let totalGst = 0;
//     let grandTotal = 0;

//     selectedCosts.forEach((item) => {
//       const qty = item.quantity;
//       const cost = item.cost;

//       const itemSubtotal = cost * qty;
//       const itemDiscount =
//         cost * (parseFloat(item.discount_percent) / 100) * qty;
//       const itemAfterDiscount = itemSubtotal - itemDiscount;
//       const itemGst = itemAfterDiscount * (parseFloat(item.gst_percent) / 100);
//       const itemGrand = itemAfterDiscount + itemGst;

//       subtotal += itemSubtotal;
//       totalDiscount += itemDiscount;
//       totalAfterDiscount += itemAfterDiscount;
//       totalGst += itemGst;
//       grandTotal += itemGrand;
//     });
//     return {
//       subtotal,
//       totalDiscount,
//       totalAfterDiscount,
//       totalGst,
//       grandTotal,
//     };
//   }, [selectedCosts]);

//   useEffect(() => {
//     setFullAmount(totals.grandTotal);
//   }, [totals.grandTotal, setFullAmount]);

//   const handleClick = () => {
//     if (step < 3) {
//       if (selectedCosts.length > 0) {
//         setStep(2);
//         if (formCompleted) {
//           setStep(3);
//         }
//       }
//     } else {
//       localStorage.setItem(
//         `tripogram_${slug}`,
//         encrypt(
//         JSON.stringify({
//           ...bookingData,
//           final_amount: Number(totals.grandTotal.toFixed(0)),
//           paid_amount:
//             paybleType == "full"
//               ? Number(totals.grandTotal.toFixed(0))
//               : Number(
//                   (
//                     (totals.grandTotal * razorpay_key.package_amount_percent) /
//                     100
//                   ).toFixed(0)
//                 ),
//           due_amount:
//             paybleType != "full"
//               ? Number(
//                   (
//                     (totals.grandTotal * razorpay_key.package_amount_percent) /
//                     100
//                   ).toFixed(0)
//                 )
//               : 0,
//         })
//         )
//       );
//       openRazorpay();
//     }
//   };
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   const openRazorpay = () => {
//     const weblogo = document.querySelector(".header-top").dataset.weblogo;
//     const options = {
//       key: razorpay_key.razorpay_key_id,
//       amount:
//         (paybleType == "full"
//           ? totals.grandTotal.toFixed(0)
//           : (
//               (totals.grandTotal * razorpay_key.package_amount_percent) /
//               100
//             ).toFixed(0)) * 100,
//       currency: "INR",
//       name: "Tripogram",
//       image: weblogo,
//       handler: async (response) => {
//         const payload =
//           JSON.parse(decrypt(localStorage.getItem(`tripogram_${slug}`))) || {};
//         try {
//           const res = await api.post("/booking/add-booking", {
//             ...payload,
//             ...response,
//           });
//           console.log("booking response", res)

//           if (res.data.success === true) {
//             console.log(JSON.stringify(res.data));
//             localStorage.removeItem(`tripogram_${slug}`);  
//             router.push("/thankyou");
//           }
//         } catch (error) {
//           if (error.response) {
//             console.error("Server Error:", error.response.data);
//             // setMessage(error.response.data.message || "Something went wrong");
//           } else if (error.request) {
//             console.error("No response from server:", error.request);
//             // setMessage("No response from server, please try again.");
//           } else {
//             console.error("Error:", error.message);
//             // setMessage(error.message || "Unexpected error occurred");
//           }
//         } finally {
//           // setLoading(false);
//         }
//       },
//       prefill: {
//         name: bookingData.ful_name,
//         email: bookingData.email,
//         contact: bookingData.phone,
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };
//   return (
//     <div className="min_box-detail Age_limit book_Amount container my-4">
//       <div className="title d-flex justify-content-between gap-5">
//         <h6 className="text-start flex-wrap fw-bold mb-4 page-title">
//           Amount to Pay{" "}
//           {paybleType == "full" ? (
//             <span>₹{totals.grandTotal.toFixed(0)}/-</span>
//           ) : (
//             <span>
//               ₹
//               {(
//                 (totals.grandTotal * razorpay_key.package_amount_percent) /
//                 100
//               ).toFixed(0)}
//               /-
//             </span>
//           )}
//         </h6>
//       </div>

//       <div className="pricing_box">
//         <div className="pricong-table">
//           <div className="table-responsive">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Room sharing</th>
//                   <th>Selling Cost (Per Person)</th>
//                   <th>Discounted Cost (Per Person)</th>
//                   <th>Qty.</th>
//                   <th>Cost</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedCosts.map((costs) => (
//                   <tr key={costs.id}>
//                     <td>{costs.activity}</td>
//                     <td className="text-decoration-line-through">
//                       ₹{costs.cost.toFixed(0)}/-
//                     </td>
//                     <td>
//                       ₹
//                       {costs.cost -
//                         (costs.cost * Number(costs.discount_percent)) / 100}
//                       /-
//                     </td>
//                     <td>{costs.quantity}</td>
//                     <td>
//                       ₹
//                       {(costs.cost -
//                         (costs.cost * Number(costs.discount_percent)) / 100) *
//                         costs.quantity}
//                       /-
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="pring_data">
//             <ul className="list-unstyled">
//               <li className="d-flex justify-content-between">
//                 Subtotal <span>₹{totals.subtotal.toFixed(0)}</span>
//               </li>
//               <li className="d-flex justify-content-between">
//                 GST (5%)<span>₹{totals.totalGst.toFixed(0)}</span>
//               </li>
//               <li className="d-flex justify-content-between">
//                 Discount{" "}
//                 <span className="text-decoration-line-through">
//                   ₹{totals.totalDiscount.toFixed(0)}
//                 </span>
//               </li>
//               <hr />
//               {paybleType == "full" ? (
//                 <li className="d-flex justify-content-between text-capitalize">
//                   Full Amount To Pay{" "}
//                   <span>₹{totals.grandTotal.toFixed(0)}/-</span>
//                 </li>
//               ) : (
//                 <li className="d-flex justify-content-between text-capitalize">
//                   {razorpay_key.package_amount_percent}% Amount To Pay{" "}
//                   <span>
//                     ₹
//                     {(
//                       (totals.grandTotal *
//                         razorpay_key.package_amount_percent) /
//                       100
//                     ).toFixed(0)}
//                     /-
//                   </span>
//                 </li>
//               )}
//             </ul>
//           </div>

//           {/* Step Buttons */}
//           <div className="d-flex flex-lg-nowrap flex-wrap gap-lg-4 gap-1">
//             {/* Back Button only if not in Step 1 */}
//             {step > 1 && (
//               <button
//                 className="btn btn-primary d-flex align-items-center gap-3 w-auto rounded-pill mt-3 fw-semibold py-2 px-4"
//                 onClick={() => setStep(step - 1)}
//               >
//                 <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Back
//               </button>
//             )}

//             <button
//               className="btn btn-primary w-100 rounded-pill mt-3 fw-semibold py-2"
//               onClick={handleClick}
//             >
//               {getButtonLabel()}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { api } from "@/services/config";
import {
  faArrowAltCircleLeft,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearBookingData,
  getBookingData as getStoredBookingData,
  setBookingData,
} from "@/functions/bookingStorage";
import RequestCallback from "../HelpingCompnents/RequestCallback";

export default function Pricing({
  step,
  setStep,
  selectedCosts,
  formCompleted,
  setFullAmount,
  paybleType,
  slug,
  razorpay_key,
  bookingAmount,
  totalTravellers,
  appliedCoupons = [],
  showBookNoButton,
  packageId,
  packageName,
  dif_days,
  selectedDate,
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [couponError, setCouponError] = useState("");
  const [open, setOpen] = useState(false);
  const [specialNote, setSpecialNote] = useState("");
  const [showMobileCostBreakup, setShowMobileCostBreakup] = useState(false);
  const canProceedToBooking = Number(showBookNoButton) === 1;
  console.log("Pricing Component Props:", {
    step,
    setStep,
    setFullAmount,
  });

  const getBookingData = () => {
    return getStoredBookingData(slug);
  };

  const formatPackageName = (name) => {
    const value = String(name || "Package");
    return value.length > 20 ? `${value.slice(0, 20)}...` : value;
  };

  const formatApiDate = (date) => {
    if (!date) return "";
    return String(date).split("T")[0];
  };

  // const formatDisplayDate = (date) => {
  //   if (!date) return "";
  //   return date.toLocaleDateString("en-IN", {
  //     day: "2-digit",
  //     month: "short",
  //     year: "numeric",
  //   });
  // };

  // const getLocalDateFromApiDate = (date) => {
  //   if (!date) return null;
  //   const [year, month, day] = String(date).split("T")[0].split("-").map(Number);
  //   if (!year || !month || !day) return null;
  //   return new Date(year, month - 1, day);
  // };

  const bookingData = getBookingData();
  // const fullPaymentDeadlineDate = useMemo(() => {
  //   const startDate = selectedDate?.start_date || bookingData?.start_date;
  //   const daysBeforeStart = Number(dif_days);
  //   const paymentDate = getLocalDateFromApiDate(startDate);

  //   if (!paymentDate || Number.isNaN(daysBeforeStart)) return "";

  //   paymentDate.setDate(paymentDate.getDate() - daysBeforeStart);
  //   return formatDisplayDate(paymentDate);
  // }, [selectedDate?.start_date, bookingData?.start_date, dif_days]);

  const fullPaymentDeadlineDays = useMemo(() => {
    const daysBeforeStart = Number(dif_days);
    return Number.isNaN(daysBeforeStart) ? "" : daysBeforeStart;
  }, [dif_days]);

  const bookingAmountToPay = Number(bookingAmount || 0) * Number(totalTravellers || 0);
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN").format(Number(amount || 0));
  const mobileButtonLabel = step === 3 ? "Pay Now" : "Continue";

  const getButtonLabel = () => {
    if (isLoading) return "Processing..."; // Show loading text
    if (step === 1) return "Proceed to Traveller Details";
    if (step === 2) return "Proceed to Billing";
    if (step === 3) return "Make a Trip";
  };

  const totals = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalAfterDiscount = 0;
    let totalGst = 0;
    let grandTotal = 0;
    let gstPercent = 0;
    const items = selectedCosts.map((item) => {
      const qty = item.quantity;
      const cost = item.cost;

      const itemSubtotal = cost * qty;
      const itemDiscount =
        cost * (parseFloat(item.discount_percent) / 100) * qty;

      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;

      return {
        afterDiscount: itemSubtotal - itemDiscount,
        gstPercent: parseFloat(item.gst_percent) || 0,
      };
    });

    const beforeCouponTotal = items.reduce(
      (sum, item) => sum + item.afterDiscount,
      0
    );
    const couponDiscount = Math.min(
      appliedCoupons.reduce(
        (sum, coupon) => sum + Number(coupon.coupon_final_amount || 0),
        0
      ),
      beforeCouponTotal
    );

    items.forEach((item) => {
      const couponShare =
        beforeCouponTotal > 0
          ? couponDiscount * (item.afterDiscount / beforeCouponTotal)
          : 0;
      const taxableAmount = Math.max(item.afterDiscount - couponShare, 0);
      const itemGst = taxableAmount * (item.gstPercent / 100);

      gstPercent = item.gstPercent;
      totalAfterDiscount += taxableAmount;
      totalGst += itemGst;
      grandTotal += taxableAmount + itemGst;
    });

    return {
      subtotal,
      totalDiscount,
      totalAfterDiscount,
      totalGst,
      grandTotal,
      gstPercent,
      couponDiscount,
    };
  }, [selectedCosts, appliedCoupons]);

  const amountToPay =
    paybleType == "full"
      ? Number(totals.grandTotal.toFixed(0))
      : Number(bookingAmountToPay.toFixed(0));
  const remainingAmountToPay =
    paybleType != "full"
      ? Number((totals.grandTotal - bookingAmountToPay).toFixed(0))
      : 0;

  useEffect(() => {
    setFullAmount(totals.grandTotal);
  }, [totals.grandTotal, setFullAmount]);

  const handleClick = async () => {
    if (step === 1 && appliedCoupons.length > totalTravellers) {
      setCouponError("First remove coupon code, per person 1 coupon can be applied.");
      return;
    }
    setCouponError("");

    if (step < 3) {
      if (selectedCosts.length > 0) {
        setStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (formCompleted) {
          setStep(3);
        }
      }
    } else {
      setIsLoading(true); // Start loading
      try {
        const freshBookingData = getBookingData();
        const amountToPay =
          paybleType == "full"
            ? Number(totals.grandTotal.toFixed(0))
            : Number((bookingAmount * totalTravellers).toFixed(0));
        const bookingPayloadBeforePayment = {
          ...freshBookingData,
          active_cost: selectedCosts,
          applied_coupons: appliedCoupons.map(c => c.coupon_code),
          total_coupon_discount: totals.couponDiscount,
          final_amount: Number(totals.grandTotal.toFixed(0)),
          total_amount: Number(totals.grandTotal.toFixed(0)),
          payable_type: paybleType,
          paid_amount: amountToPay,
          due_amount:
            paybleType != "full"
              ? Number((totals.grandTotal - amountToPay).toFixed(0))
              : 0,
        };

        setBookingData(slug, bookingPayloadBeforePayment);

        const createBookingPayload = {
          full_name: freshBookingData.full_name || freshBookingData.ful_name || "",
          email: freshBookingData.email || "",
          phone: freshBookingData.phone || "",
          start_date: formatApiDate(freshBookingData.start_date),
          end_date: formatApiDate(freshBookingData.end_date),
          package_id: freshBookingData.package_id,
          payment_type: paybleType,
          final_amount: Number(totals.grandTotal.toFixed(0)),
          active_cost: selectedCosts,
          applied_coupons: appliedCoupons.map(c => c.coupon_code),
          total_coupon_discount: totals.couponDiscount,
          special_note: specialNote,
        };


        // console.log("Create booking payload:", createBookingPayload);

        const createBookingRes = await api.post(
          "/post-order/create-booking",
          createBookingPayload
        );

        if (createBookingRes.data.success === true) {
          // openRazorpay();
          openRazorpay({
            createdBooking: createBookingRes.data.data,
            amountToPay,
          });
        } else {
          setIsLoading(false);
          alert(createBookingRes.data.message || "Booking could not be created.");
        }
      } catch (error) {
        setIsLoading(false);
        if (error.response) {
          console.error("Create booking server error:", error.response.data);
          alert(error.response.data.message || "Booking could not be created.");
        } else if (error.request) {
          console.error("No response from create booking API:", error.request);
          alert("No response from server, please try again.");
        } else {
          console.error("Create booking error:", error.message);
          alert(error.message || "Unexpected error occurred");
        }
      }
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openRazorpay = ({ createdBooking, amountToPay }) => {
    const weblogo = document.querySelector(".header-top")?.dataset?.weblogo || '';
    const freshBookingData = getBookingData();
    const clearBookingDraft = () => {
      clearBookingData(slug);
    };

    const options = {
      key: razorpay_key.razorpay_key_id,
      // amount:
      //   (paybleType == "full"
      //     ? totals.grandTotal.toFixed(0)
      //     : (bookingAmount * totalTravellers).toFixed(0)) * 100,
      amount: amountToPay * 100,
      currency: "INR",
      name: "Tripogram",
      image: weblogo,
      handler: async (response) => {
        let payload = {};
        let updatePaymentAttempted = false;
        payload = getBookingData();
        try {
          const bookingPayload = {
            ...payload,
            ...response,
          };

          // console.log("booking/add-booking payload:", bookingPayload);
          // const res = await api.post("/booking/add-booking", {
          //   ...bookingPayload,
          // });
          // console.log("booking response", res)

          const updatePaymentPayload = {
            booking_id: createdBooking.id,
            razorpay_payment_id: response.razorpay_payment_id,
            paid_amount: amountToPay,
            payment_type: paybleType,
          };

          updatePaymentAttempted = true;
          const res = await api.post(
            "/post-order/update-payment",
            updatePaymentPayload
          );

          if (res.data.success === true) {
            router.push("/thankyou");
          }
        } catch (error) {
          if (error.response) {
            console.error("Server Error:", error.response.data);
            // Show error message to user
            alert(error.response.data.message || "Something went wrong");
          } else if (error.request) {
            console.error("No response from server:", error.request);
            alert("No response from server, please try again.");
          } else {
            console.error("Error:", error.message);
            alert(error.message || "Unexpected error occurred");
          }
        } finally {
          if (updatePaymentAttempted) {
            clearBookingDraft();
          }
          setIsLoading(false); // Stop loading
        }
      },
      modal: {
        ondismiss: () => {
          // This function is called when the user closes the Razorpay modal
          // console.log("Payment modal closed by user");
          setIsLoading(false); // Remove loading state on cancel

          // Optional: Show a message to user
          alert("Payment cancelled. You can try again when you're ready.");
        },
      },
      prefill: {
        name: freshBookingData.full_name || freshBookingData.ful_name || '',
        email: freshBookingData.email || '',
        contact: freshBookingData.phone || '',
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);

    // Handle case where Razorpay fails to open
    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      setIsLoading(false); // Remove loading state on payment failure
      alert('Payment failed: ' + (response.error.description || 'Please try again'));
    });

    rzp.open();
  };

  // Handle Razorpay modal close (alternative method)
  useEffect(() => {
    const handleRazorpayClose = () => {
      // Check if there's an active Razorpay instance and modal is closed
      // This is a fallback in case the modal.ondismiss doesn't work
      setTimeout(() => {
        // Check if Razorpay modal is not visible
        const razorpayModal = document.querySelector('.razorpay-container');
        if (!razorpayModal || razorpayModal.style.display === 'none') {
          setIsLoading(false);
        }
      }, 500);
    };

    window.addEventListener('popstate', handleRazorpayClose);
    window.addEventListener('blur', handleRazorpayClose);

    return () => {
      window.removeEventListener('popstate', handleRazorpayClose);
      window.removeEventListener('blur', handleRazorpayClose);
    };
  }, []);

  return (
    <div className="min_box-detail Age_limit book_Amount container my-4">
      <div className="title d-flex justify-content-between gap-5">
        <div>
          <h6 className="text-start flex-wrap fw-bold mb-2 page-title">
            Full Amount to Pay <span>₹{formatAmount(totals.grandTotal.toFixed(0))}/-</span>
          </h6>
          {/* Previous reddish booking amount box removed per updated design. */}
          {false && bookingAmountToPay > 0 && (
            <p
              className="mb-4 px-3 py-4 rounded-pill fw-semibold d-inline-block"
              style={{
                backgroundColor: "#fff7ed",
                border: "1px solid #fed7aa",
                color: "#9a3412",
                fontSize: "13px",
              }}
            >
              {/* Book in just @ ₹{formatAmount(bookingAmountToPay)} */}
              Book Now @ ₹ {formatAmount(bookingAmountToPay)}
            </p>
          )}
          {/* {bookingAmountToPay > 0 && (
            <p className="mb-4 fw-semibold text-primary">
              Booking starts from ₹ {formatAmount(bookingAmountToPay)}
            </p>
          )} */}
        </div>
      </div>

      <div className="mobile-cost-breakup d-lg-none">
        <button
          type="button"
          className="mobile-cost-toggle"
          onClick={() => setShowMobileCostBreakup((prev) => !prev)}
          aria-expanded={showMobileCostBreakup}
        >
          <span className="mobile-cost-icon">
            <FontAwesomeIcon icon={showMobileCostBreakup ? faChevronUp : faChevronDown} />
            <small>Cost Breakup</small>
          </span>
        </button>

        {showMobileCostBreakup && (
          <div className="mobile-cost-card">
            <div className="mobile-cost-table-wrap">
              <table className="mobile-cost-table">
                <thead>
                  <tr>
                    <th>Particular</th>
                    <th>Person</th>
                    <th>Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCosts.map((costs) => (
                    <tr key={costs.id}>
                      <td>{formatPackageName(packageName || bookingData?.package_title)}</td>
                      <td>{costs.quantity}</td>
                      <td>₹{Number(costs.cost || 0).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-cost-lines">
              <div>
                <span>Subtotal</span>
                <strong>₹{formatAmount(totals.subtotal.toFixed(0))}</strong>
              </div>
              {totals.couponDiscount > 0 && (
                <div className="mobile-cost-discount">
                  <span>Discount {appliedCoupons?.[0]?.coupon_code ? `(${appliedCoupons[0].coupon_code})` : ""}</span>
                  <strong>-₹{formatAmount(totals.couponDiscount)}</strong>
                </div>
              )}
              <div>
                <span>GST ({totals?.gstPercent}%)</span>
                <strong>₹{formatAmount(totals.totalGst.toFixed(0))}</strong>
              </div>
              <div className="mobile-cost-total">
                <span>Total Amount</span>
                <strong>₹{formatAmount(totals.grandTotal.toFixed(0))}</strong>
              </div>
              {remainingAmountToPay > 0 && fullPaymentDeadlineDays !== "" && (
                <div>
                <p className="mobile-remaining-payment-note">
                  Balance amount to paid {fullPaymentDeadlineDays} days before boarding
                </p>
                <strong>₹{formatAmount(remainingAmountToPay)}</strong>
                </div>
              )}
              <div>
                <span>Total Travelers:</span>
                <strong>{totalTravellers} {totalTravellers === 1 ? "Person" : "People"}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pricing_box">
        <div className="pricong-table">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Room sharing</th>
                  <th>Selling Cost (Per Person)</th>
                  <th>Discounted Cost (Per Person)</th>
                  <th>Qty.</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {selectedCosts.map((costs) => (
                  <tr key={costs.id}>
                    <td>{costs.activity}</td>
                    <td className="text-decoration-line-through">
                      ₹{formatAmount(Number(costs.cost).toFixed(0))}/-
                    </td>
                    <td>
                      ₹{formatAmount(
                        costs.cost -
                        (costs.cost * Number(costs.discount_percent)) / 100
                      )}
                      /-
                    </td>
                    <td>{costs.quantity}</td>
                    <td>
                      ₹{formatAmount(
                        (costs.cost -
                        (costs.cost * Number(costs.discount_percent)) / 100) *
                        costs.quantity
                      )}
                      /-
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pring_data">
            <ul className="list-unstyled">
              <li className="d-flex justify-content-between">
                Subtotal <span>₹{formatAmount(totals.subtotal.toFixed(0))}</span>
              </li>
              {totals.couponDiscount > 0 && (
                <li className="d-flex justify-content-between text-success fw-bold">
                  Coupon Discount <span>- ₹{formatAmount(totals.couponDiscount)}</span>
                </li>
              )}
              <li className="d-flex justify-content-between">
                GST ({totals?.gstPercent}%)<span>₹{formatAmount(totals.totalGst.toFixed(0))}</span>
              </li>
              <li className="d-flex justify-content-between">
                Discount{" "}
                <span className="text-decoration-line-through">
                  ₹{formatAmount(totals.totalDiscount.toFixed(0))}
                </span>
              </li>
              <hr />
              {paybleType == "full" ? (
                <li className="d-flex justify-content-between text-capitalize">
                  Full Amount To Pay{" "}
                  <span>₹{formatAmount(totals.grandTotal.toFixed(0))}/-</span>
                </li>
              ) : (
                <>
                  <li className="d-flex justify-content-between text-capitalize">
                    Booking Amount To Pay{" "}
                    <span>
                      ₹{formatAmount((bookingAmount * totalTravellers).toFixed(0))}/-
                    </span>
                  </li>
                  <li className="d-flex justify-content-between text-capitalize fw-bold">
                    Balance amount to be paid {fullPaymentDeadlineDays} days before boarding
                    <span>
                      ₹{formatAmount((totals.grandTotal - (bookingAmount * totalTravellers)).toFixed(0))}/-
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Step Buttons */}
          {canProceedToBooking && step === 3 && (
            <div className="mb-2">
              {paybleType !== "full" && fullPaymentDeadlineDays !== "" && (
                <p className="small text-danger fw-semibold mb-2">
                  {/* Balance Payment to be Completed {fullPaymentDeadlineDays} Days Before Boarding */}
                  {/* {fullPaymentDeadlineDate}. */}
                </p>
              )}
              <label className="form-label fw-semibold text-primary mb-2">
                Special Note
              </label>
              <textarea
                className="form-control rounded-3"
                rows={3}
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                placeholder="Add any special request or note for your trip..."
                style={{
                  borderColor: "#d8e7cb",
                  backgroundColor: "#fbfff7",
                  resize: "vertical",
                }}
              />
            </div>
          )}

          {/* Step Buttons */}
          <div className="d-flex flex-lg-nowrap flex-wrap gap-lg-4 gap-1">
            {/* Previous step controls kept for reference.
            {step > 1 && (
              <button
                className="btn btn-primary d-flex align-items-center gap-3 w-auto rounded-pill mt-3 fw-semibold py-2 px-4"
                onClick={() => setStep(step - 1)}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Back
              </button>
            )}
            <button
              className="btn btn-primary w-100 rounded-pill mt-3 fw-semibold py-2"
              onClick={handleClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {getButtonLabel()}
                </>
              ) : (
                getButtonLabel()
              )}
            </button>
            */}

            {canProceedToBooking ? (
              <>
                {/* Back Button only if not in Step 1 */}
                {step > 1 && (
                  <button
                    className="btn btn-primary d-flex align-items-center gap-3 w-auto rounded-pill mt-3 fw-semibold py-2 px-4"
                    onClick={() => setStep(step - 1)}
                    disabled={isLoading} // Disable back button when loading
                  >
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Back
                  </button>
                )}

                <div className="w-100">
                  {/* Previous reddish booking amount box removed per updated design. */}
                  {false && step === 1 && bookingAmountToPay > 0 && (
                    <div
                      className="mt-3 mb-2 px-3 py-4 rounded-pill text-center fw-semibold"
                      style={{
                        backgroundColor: "#fff7ed",
                        border: "1px solid #fed7aa",
                        color: "#9a3412",
                      }}
                    >
                      {/* Book in just @ ₹{formatAmount(bookingAmountToPay)} */}
                      Book Now @ ₹ {formatAmount(bookingAmountToPay)}

                    </div>
                  )}
                  {/* {step === 1 && bookingAmountToPay > 0 && (
                    <p className="mt-3 mb-2 text-center fw-semibold text-primary">
                      Booking starts from ₹ {formatAmount(bookingAmountToPay)}
                    </p>
                  )} */}

                  <button
                    className="btn btn-primary w-100 rounded-pill mt-3 fw-semibold py-2"
                    onClick={handleClick}
                    disabled={isLoading} // Disable button when loading
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {getButtonLabel()}
                      </>
                    ) : (
                      getButtonLabel()
                    )}
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-primary w-100 rounded-pill mt-3 fw-semibold py-2"
                onClick={() => setOpen(packageId || bookingData?.package_id || true)}
                disabled={isLoading}
              >
                Send Inquiry
              </button>
            )}
          </div>
          {couponError && <p className="text-danger small mt-2 fw-bold">{couponError}</p>}
        </div>
      </div>

      <div className="mobile-booking-paybar d-lg-none">
        <div>
          <strong>₹{formatAmount(totals.grandTotal.toFixed(0))}</strong>
          <span>GST Inc.</span>
        </div>
        {canProceedToBooking ? (
          <button
            type="button"
            className="mobile-paybar-button"
            onClick={handleClick}
            disabled={isLoading || selectedCosts.length === 0}
          >
            <span>{isLoading ? "Processing..." : mobileButtonLabel}</span>
            <small>₹{formatAmount(amountToPay)}</small>
          </button>
        ) : (
          <button
            type="button"
            className="mobile-paybar-button"
            onClick={() => setOpen(packageId || bookingData?.package_id || true)}
            disabled={isLoading}
          >
            <span>Send Inquiry</span>
          </button>
        )}
      </div>
      {open && <RequestCallback open={open} setOpen={setOpen} packageData={typeof bookingData !== 'undefined' ? bookingData : null} />}

      {/* Optional: Add a full-page overlay loader */}
      {isLoading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="bg-white p-4 rounded-3 text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5>Processing your booking...</h5>
            <p className="text-muted mb-0">Please don&apost close this window</p>
          </div>
        </div>
      )}
    </div>
  );
}
