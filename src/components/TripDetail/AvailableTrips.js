// "use client"
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation, Pagination } from "swiper/modules";
// import TourCard from "../PopularTour/TourCard";
// import RequestCallback from "../HelpingCompnents/RequestCallback";
// import { useState } from "react";
// // import { Swiper, SwiperSlide } from "swiper/react";

// export default function AvailableTrips({ trips }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       <div className="mt-4 px-3 d-md-none swiper th-slider has-shadow slider-drag-wrap position-relative z-0">
//         <Swiper
//           spaceBetween={20}
//           slidesPerView={1}
//           loop={true}
//           modules={[Navigation, Autoplay, Pagination]}
//           autoplay={{ delay: 3000 }}
//           //   pagination={{ clickable: true }}
//           navigation={{
//             nextEl: ".swiper-button-next",
//             prevEl: ".swiper-button-prev",
//           }}
//           className="swiper"
//         >
//           {trips.map((tour) => (
//             <SwiperSlide key={tour.id} className="swiper-slide">
//               <TourCard data={tour} onRequestCallback={() => setOpen(tour.id)} />
//             </SwiperSlide>
//           ))}
//         </Swiper>

//         <div className="swiper-button-next"></div>
//         <div className="swiper-button-prev"></div>
//       </div>

//       {/* Grid for sm and above */}
//       <div className="d-none d-md-block mt-4">
//         <div className="row g-4">
//           {trips.map((tour) => (
//             <div key={tour.id} className="col-6 col-md-6 col-lg-4 col-xl-3">
//               <TourCard data={tour} onRequestCallback={() => setOpen(tour.id)} />
//             </div>
//           ))}


//           {/* Modal */}
//           {open && <RequestCallback open={open} setOpen={setOpen} />}
//         </div>
//       </div>
//     </>
//   );
// }




"use client"
import TourCard from "../PopularTour/TourCard";
import RequestCallback from "../HelpingCompnents/RequestCallback";
import { useState } from "react";

export default function AvailableTrips({ trips }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mt-4 px-1 px-md-3">
        <div className="row g-4">
          {trips.map((tour) => (
            <div key={tour.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <TourCard data={tour} onRequestCallback={() => setOpen(tour)} />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {open && <RequestCallback open={open} setOpen={setOpen} />}
    </>
  );
}
