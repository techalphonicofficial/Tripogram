import { notFound } from "next/navigation";
import { api } from "./config";

export async function getMostPopularContent() {
  try {
    const res = await api.get("/packages/most-popular-content");
    return res.data?.data || res.data || null;
  } catch (error) {
    console.log("Failed to fetch most popular content:", error.response?.data?.message || error.message);
    return null;
  }
}

export async function trendingPackage(season) {
  try {
    const url = season
      ? `/packages/trending?season=${encodeURIComponent(season.toLowerCase())}`
      : "/packages/trending";
    const res = await api.get(url);
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
    const allRes = await api.get("/packages");
    return Array.isArray(allRes.data) ? allRes.data : (allRes.data?.data || []);
  } catch (error) {
    console.log("Failed to fetch trending packages:", error.response?.data?.message || error.message);
    try {
      const allRes = await api.get("/packages");
      return Array.isArray(allRes.data) ? allRes.data : (allRes.data?.data || []);
    } catch (e) {
      return [];
    }
  }
}

export async function allPackage(byCategory, page) {
  try {
    let url = "/packages";
    if (byCategory && byCategory !== "all") {
      url = `/packages?trip=${byCategory}&page=${page}&limit=12`;
    }
    const res = await api.get(url);
    const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
    if (data.length > 0) {
      return data;
    }
    const allRes = await api.get("/packages");
    return Array.isArray(allRes.data) ? allRes.data : [];
  } catch (error) {
    console.log("Failed to fetch all packages:", error.response?.data?.message || error.message);
    try {
      const allRes = await api.get("/packages");
      return Array.isArray(allRes.data) ? allRes.data : [];
    } catch (e) {
      return [];
    }
  }
}


export async function singlePackage(slug) {
  try {
    const res = await api.get(`/packages/single/${slug}`);
    if (!res.data.hasOwnProperty("id")) {
      return notFound();
    }
    return res.data;
  } catch (error) {
    return notFound();
  }
}

export async function packageRedirection(slug) {
  try {
    const res = await api.get(`/redirection/${slug}`);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch redirection:", error.response?.data?.message || error.message);
    return null;
  }
}

export async function costs_and_dates(slug) {
  try {
    const res = await api.get(`packages/${slug}/costs-and-dates`);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch costs and dates:", error.response?.data?.message || error.message);
    return [];
  }
}

export async function searchPackages(search) {
  try {
    const res = await api.get(`packages/search/${search}`);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch search packages:", error.response?.data?.message || error.message);
    return [];
  }
}

export async function razorpay() {
  try {
    const res = await api.get(`razorpay`);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch razorpay config:", error.response?.data?.message || error.message);
    return null;
  }
}

