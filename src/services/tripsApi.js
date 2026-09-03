import { notFound } from "next/navigation";
import { api } from "./config";

function getApiErrorMessage(error, fallbackMessage) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.status) return `${fallbackMessage} (${error.response.status})`;
  if (error.code === "ECONNABORTED") return `${fallbackMessage}: request timed out`;
  if (error.request) return `${fallbackMessage}: no response from server`;
  return fallbackMessage;
}

export async function allTrips() {
  try {
    const res = await api.get(`/trips`);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch trips"));
  }
}
export async function homeTrips() {
  try {
    const res = await api.get(`/trips/home`);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch home trips"));
  }
}
export async function singleTrips(slug) {
  try {
    const res = await api.get(`/trips/single/${slug}`);
    return res.data;
  } catch (error) {
    return notFound();
  }
}

export async function tripsWithPackagecount() {
  try {
    const res = await api.get(`/trips/trips-with-packagecount`);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch trips with package count"));
  }
}

export async function tripsWithDestination() {
  try {
    const res = await api.get(`/trips/trips-with-destination`);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch trips with destination"));
  }
}
