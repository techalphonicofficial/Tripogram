"use client"
import { useState } from "react";
import RequestCallback from "../HelpingCompnents/RequestCallback";

export default function DownloadPdf({ id, itinerary_pdf, completedata }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min_box-detail asdfasdfasdfasd Age_limit container my-6 mt-24">
      <div className="d-flex align-items-center justify-content-center gap-3">

        {/* <a
          href={footer.section[12].data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex w-100 btn btn-primary w-100 px-3 py-2 gap-2 rounded-pill fw-semibold shrer_pdf align-items-center justify-content-center rounded-circle"

        >
          <span className="d-flex align-items-center justify-content-center rounded-circle">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              style={{ width: "24px", height: "24px" }}
            />
          </span>
          <span>WhatsApp</span>
        </a> */}

        {/* Send Inquiry Button */}
        <button
          onClick={() => setOpen(id)}
          className="btn btn-primary w-100 px-3 py-2 rounded-pill fw-semibold shrer_pdf"
        >
          Send Inquiry
        </button>

        {/* Send Query Button */}
        {/* <button
          onClick={() => setOpen(id)}
          className="btn btn-primary w-100 px-3 py-2 rounded-pill fw-semibold shrer_pdf"
        >
          Send Query
        </button> */}

        {/* Get PDF Button */}
        {itinerary_pdf != null && (
          <a
            href={itinerary_pdf}
            target="_blank"
            className="btn btn-primary w-100 px-3 py-2 rounded-pill fw-semibold shrer_pdf"
          >
            Get PDF
          </a>
        )}
      </div>
      {open && <RequestCallback open={open} setOpen={setOpen} packageData={completedata} />}
    </div>
  );
}
