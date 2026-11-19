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

let tripsWithCountInFlight = null;
let tripsWithCountCache = null;

export async function tripsWithPackagecount() {
  const isBrowser = typeof window !== "undefined";
  if (isBrowser) {
    if (tripsWithCountCache && Date.now() - tripsWithCountCache.ts < 10000) {
      return tripsWithCountCache.data;
    }
    if (tripsWithCountInFlight) {
      return tripsWithCountInFlight;
    }
  }

  const req = api
    .get(`/trips/trips-with-packagecount`)
    .then((res) => {
      if (isBrowser && Array.isArray(res.data)) {
        tripsWithCountCache = { data: res.data, ts: Date.now() };
      }
      return res.data;
    })
    .catch((error) => {
      console.log("Failed to fetch trips with package count:", error.response?.data?.message || error.message);
      return [];
    })
    .finally(() => {
      if (isBrowser) tripsWithCountInFlight = null;
    });

  if (isBrowser) tripsWithCountInFlight = req;
  return req;
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

