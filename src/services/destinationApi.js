import { api } from "./config";

export async function singleDestination(slug) {
  try {
    const res = await api.get(`/destinations/single/${slug}`);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch single destination:", error.response?.data?.message || error.message);
    return null;
  }
}

export async function getHomeDestination() {
  try {
    const res = await api.get("/destinations/home");
    return res.data;
  } catch (error) {
    console.log("Failed to fetch home destinations:", error.response?.data?.message || error.message);
    return [];
  }
}

export async function getDestination() {
  try {
    const res = await api.get("/destinations");
    return res.data;
  } catch (error) {
    console.log("Failed to fetch destinations:", error.response?.data?.message || error.message);
    return [];
  }
}