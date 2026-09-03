"use client";
import AvailableDates from "@/components/Booking/AvailableDates";
import BillingDetail from "@/components/Booking/BillingDetail";
import Coupons from "@/components/Booking/Coupons";
import Occupancy from "@/components/Booking/Occupancy";
import PaymentType from "@/components/Booking/PaymentType";
import Pricing from "@/components/Booking/Pricing";
import TravellerDetail from "@/components/Booking/TravellerDetail";
import TripSummary from "@/components/Booking/TripSummary";
import { getBookingData } from "@/functions/bookingStorage";
import { costs_and_dates, singlePackage } from "@/services/packageApi";
import { useParams } from "next/navigation";
// import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function BookingPageClient({ razorpay_key }) {
  const params = useParams();
  // const searchParams = useSearchParams();
  const slug = params?.slug;
  // const startingFromParam = searchParams.get("starting_from");
  // console.log("slug",slug);
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(false);
  const [selectedCosts, setSelectedCosts] = useState([]);
  const [paybleType, setPaybleType] = useState("half");
  const [formCompleted, setFormCompleted] = useState(false);
  const [fullAmount, setFullAmount] = useState(0);
  const [step, setStep] = useState(1);
  const [appliedCoupons, setAppliedCoupons] = useState([]);

  // console.log("datqqqqqqqqqqqqqa", data);

  const handleApplyCoupon = (coupon) => {
    setAppliedCoupons([...appliedCoupons, coupon]);
  };

  const handleRemoveCoupon = (couponCode) => {
    setAppliedCoupons(appliedCoupons.filter(c => c.coupon_code !== couponCode));
  };

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        const [costRes, packageRes] = await Promise.all([
          costs_and_dates(slug),
          singlePackage(slug)
        ]);
        setData({ ...costRes, package: packageRes });

        // Restore state from localStorage after data is fetched
        try {
          const freshData = getBookingData(slug);
          if (Object.keys(freshData).length > 0) {
            
            if (freshData.active_cost) {
              setSelectedCosts(freshData.active_cost);
            }
            if (freshData.payable_type) {
              setPaybleType(freshData.payable_type);
            }
            if (freshData.selectedBatch && costRes.packageDates) {
              const selected = costRes.packageDates.find(itm => itm.id == freshData.selectedBatch);
              if (selected) setSelectedDate(selected);
            }
            if (freshData.applied_coupons && freshData.applied_coupons.length > 0) {
               // Coupons state management is complex, but we'll try to sync it if needed
            }
          }
        } catch (e) {
          console.error("Error restoring state:", e);
        }
      } catch (err) {
        // console.log(err.message);
      }
    };
    fetchData();
  }, [slug]);

  const groupedDates = useMemo(() => {
    if (!data.packageDates) return [];
    const groups = data.packageDates.reduce((acc, item) => {
      const date = new Date(item.start_date);
      const month = monthNames[date.getMonth()];
      if (!acc[month]) acc[month] = { month, dates: [] };
      acc[month].dates.push(item);
      return acc;
    }, {});
    const monthGroups = Object.values(groups);
    return [{ month: "All", dates: data.packageDates }, ...monthGroups];
  }, [data]);

  const handleSetDates = (id) => {
    if (!data.packageDates) return;
    const selected = data.packageDates.find((itm) => itm.id == id);
    setSelectedDate(selected);
    setSelectedCosts([]);
  };

  const totalTravellers = useMemo(() => {
    return selectedCosts.reduce((acc, item) => acc + item.quantity, 0);
  }, [selectedCosts]);

  const bookingAmount = data?.package?.booking_amount || data?.booking_amount || 0;
  // const bookingAmount = startingFromParam || data?.package?.booking_amount || data?.booking_amount || 0;

  return (
    <div className="booking_page">
      <div className="container th-container">
        <div className="row">
          <div className="col-lg-8 mb-3 mb-md-5">
            <div style={{ position: "sticky", top: "130px" }}>
              {step === 1 && (
                <>
                  <AvailableDates
                    groupedDates={groupedDates}
                    packageDates={data.packageDates}
                    handleSetDates={handleSetDates}
                    slug={slug}
                  />
                  <Occupancy
                    selectedDate={selectedDate}
                    activeCosts={data.activeCosts}
                    selectedCosts={selectedCosts}
                    setSelectedCosts={setSelectedCosts}
                    slug={slug}
                  />
                </>
              )}
              {step === 2 && (
                <BillingDetail
                  formCompleted={formCompleted}
                  setFormCompleted={setFormCompleted}
                  slug={slug}
                />
              )}
              {step === 3 && (
                <>
                  <TravellerDetail slug={slug} />
                  <TripSummary slug={slug} selectedDate={selectedDate} />
                  <PaymentType
                    razorpay_key={razorpay_key}
                    slug={slug}
                    paybleType={paybleType}
                    setPaybleType={setPaybleType}
                    fullAmount={fullAmount}
                    bookingAmount={bookingAmount}
                    totalTravellers={totalTravellers}
                    dif_days={data?.package?.day}
                    selectedDate={selectedDate}
                  />
                </>
              )}
            </div>
          </div>
          <div className="col-lg-4 mb-5">
            {step === 1 && (
              <Coupons
                appliedCoupons={appliedCoupons}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                totalTravellers={totalTravellers}
              />
            )}
            <Pricing
              step={step}
              slug={slug}
              setStep={setStep}
              selectedCosts={selectedCosts}
              formCompleted={formCompleted}
              setFullAmount={setFullAmount}
              paybleType={paybleType}
              razorpay_key={razorpay_key}
              bookingAmount={bookingAmount}
              totalTravellers={totalTravellers}
              appliedCoupons={appliedCoupons}
              showBookNoButton={data?.package?.show_book_no_button}
              packageId={data?.package?.id || data?.package_id}
              packageName={data?.package?.title}
              dif_days={data?.package?.day}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
