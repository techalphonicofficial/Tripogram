import { api } from "./config";
import { notFound } from "next/navigation";

export async function getBlogs(page = 1, perPage = 10) {
  try {
    const res = await api.get("/blogs", {
      params: { page, per_page: perPage },
    });
    return res.data;
  } catch (error) {
    console.log("Failed to fetch blogs:", error.response?.data?.message || error.message);
    return []; // Return empty array to prevent crash
  }
}
export async function getBlogsByTripDestination(text) {
  try {
    const res = await api.get(`/blogs/search/${text}`);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch blogs by destination:", error.response?.data?.message || error.message);
    return []; // Return empty array to prevent crash
  }
}
export async function getSingleBlog(slug) {
  try {
    const res = await api.get(`/blogs/${slug}`);
    // console.log("res blog", res);
    return res.data;
  } catch (error) {
    return notFound();
  }
}
