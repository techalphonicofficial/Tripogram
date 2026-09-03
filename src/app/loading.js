export default function Loading() {
  return (
    <div className="container th-container py-5 text-center my-5 d-flex flex-column align-items-center justify-content-center min-vh-50">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">Fetching your trips...</p>
    </div>
  );
}
