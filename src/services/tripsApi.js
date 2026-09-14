import { notFound } from "next/navigation";
import { api } from "./config";

export async function allTrips() {
  try {
    const res = await api.get(`/trips`);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch trips:", error.response?.data?.message || error.message);
    return [];
  }
}

export async function homeTrips() {
  try {
    const res = await api.get(`/trips/home`);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch home trips:", error.response?.data?.message || error.message);
    return [];
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
    console.log("Failed to fetch trips with package count:", error.response?.data?.message || error.message);
    return [];
  }
}

export async function tripsWithDestination() {
  try {
    const res = await api.get(`/trips/trips-with-destination`);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch trips with destination:", error.response?.data?.message || error.message);
    return [];
  }
}

