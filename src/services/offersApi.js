async function getOffersApi(path) {
  try {
    const response = await fetch(`/api/offers${path}`, {
      cache: "no-store",
      // [LOCAL DEV]: Increased timeout from 8000ms to 30000ms for single-threaded local PHP server (restore 8000 for live if desired)
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (_) {
    return null;
  }
}

function unwrap(res) {
  return res?.data?.data ?? res?.data ?? res;
}

export async function getOffersHero() {
  try {
    const res = await getOffersApi("/hero");
    return res;
  } catch (error) {
    console.log("Failed to fetch offers hero:", error.message);
    return null;
  }
}

export async function getOffersCards() {
  try {
    const res = await getOffersApi("/cards");
    const list = unwrap(res);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.log("Failed to fetch offers cards:", error.message);
    return [];
  }
}

export async function getOffersTravelSpots() {
  try {
    const res = await getOffersApi("/travel-spots");
    const list = unwrap(res);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.log("Failed to fetch offers travel spots:", error.message);
    return [];
  }
}

export async function getOffersFaqs() {
  try {
    const res = await getOffersApi("/faqs");
    const list = unwrap(res);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.log("Failed to fetch offers faqs:", error.message);
    return [];
  }
}

export async function getOffers() {
  try {
    const hero = await getOffersHero();
    const cards = await getOffersCards();
    const travel_spots = await getOffersTravelSpots();
    const faqs = await getOffersFaqs();
    return { hero, cards, travel_spots, faqs };
  } catch (error) {
    console.log("Failed to fetch all offers:", error.message);
    return null;
  }
}