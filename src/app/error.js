"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default function GlobalError({ error, reset }) {
  return (
    <div className="container th-container py-5 text-center my-5 d-flex flex-column align-items-center justify-content-center min-vh-50">
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        size="4x"
        className="text-warning mb-4"
      />
      <h2 className="mb-3">Oops! Something went wrong.</h2>
      <p className="text-muted mb-4 max-w-2xl">
        We encountered a problem loading this section. This might be due to a temporary network issue or server error.
      </p>
      <button
        onClick={() => reset()}
        className="th-btn style3"
      >
        Try Again
      </button>
    </div>
  );
}
