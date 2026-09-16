
import { api } from "./config";

// Get all blogs
// export async function getPagewithSection(pageId, sectionKey = false) {
//   try {
//     // console.log(`Fetching page ${pageId} from: ${api.defaults.baseURL}`);
//     const res = await api.get(sectionKey ? `pages/${pageId}/${sectionKey}` : `pages/${pageId}`);
//     // console.log(`Successfully fetched page ${pageId}`);
//     return res.data;
//   } catch (error) {
//     console.error('Error fetching page:', {
//       pageId,
//       sectionKey,
//       errorMessage: error.message,
//       responseStatus: error.response?.status,
//       responseData: error.response?.data,
//       apiUrl: api.defaults.baseURL
//     });
//     throw new Error(error.response?.data?.message || "Failed to fetch page data");
//   }
// }


const FALLBACK_PAGE_DATA = {
  1: {
    id: 1,
    title: "Home",
    meta_title: "Tripogram | Explore Opportunities & Travel Experiences",
    meta_description: "Book your dream tours and travel experiences with Tripogram, your trusted travel partner.",
    sections: [],
    section: [],
  },
};

export async function getPagewithSection(pageId, sectionKey = false) {
  try {
    const url = sectionKey
      ? `pages/${pageId}/${sectionKey}`
      : `pages/${pageId}`;

    const res = await api.get(url, { timeout: 3500 });
    return res.data;

  } catch (_) {
    // Return structured fallback data to prevent page hangs/crashes when backend is slow
    return FALLBACK_PAGE_DATA[pageId] || { section: [], sections: [] };
  }
}