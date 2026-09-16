export const EXTERNAL_BACKEND =
  process.env.EXTERNAL_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1/tripo/public/api";

export const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";