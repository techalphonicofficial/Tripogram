"use client";
import React from "react";

const Notes = ({ note }) => {

  return (
    <div className="min_box-detail Age_limit container my-5">
      <div className="title">
        <h6 className="text-center text-md-start fw-bold mb-4 page-title">Notes</h6>
      </div>
      <div className="notes-data p-3">
        <div dangerouslySetInnerHTML={{ __html: note }} />
      </div>

    </div>
  );
};

export default Notes;
