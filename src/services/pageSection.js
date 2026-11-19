
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


const PAGE_CACHE_TTL_MS = 10000;
const clientPageCache = new Map();
const clientInFlight = new Map();

async function fetchFullPageCached(pageId) {
  const key = String(pageId);
  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    const cached = clientPageCache.get(key);
    if (cached && Date.now() - cached.ts < PAGE_CACHE_TTL_MS) {
      return cached.data;
    }
    if (clientInFlight.has(key)) {
      return clientInFlight.get(key);
    }
  }

  // [LOCAL DEV]: Increased timeout from 8000ms to 30000ms for single-threaded local PHP server.
  // Also fetches `pages/{pageId}` once and shares across sections so 10 section calls become 1 request (works in both local & live).
  const reqPromise = api
    .get(`pages/${pageId}`, { timeout: 30000 }) // Production timeout was: 8000
    .then((res) => {
      if (isBrowser && res?.data) {
        clientPageCache.set(key, { data: res.data, ts: Date.now() });
      }
      return res?.data || null;
    })
    .finally(() => {
      if (isBrowser) clientInFlight.delete(key);
    });

  if (isBrowser) {
    clientInFlight.set(key, reqPromise);
  }

  return reqPromise;
}

export async function getPagewithSection(pageId, sectionKey = false) {
  try {
    const pageData = await fetchFullPageCached(pageId);
    if (!sectionKey) {
      return pageData;
    }

    if (Array.isArray(pageData?.sections)) {
      const matched = pageData.sections.find((s) => s.section_key === sectionKey);
      if (matched) return matched;
    }

    // Fallback to direct section endpoint if not present in pageData.sections
    const res = await api.get(`pages/${pageId}/${sectionKey}`, { timeout: 30000 }); // Production timeout was: 8000
    return res.data;
  } catch (_) {
    return null;
  }
}