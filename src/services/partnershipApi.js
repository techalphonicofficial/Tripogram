const FALLBACK_LOGOS = {
  MakeMyTrip: "/img/brand/makemytrip.svg",
  IndiGo: "/img/brand/indigo.svg",
  "Goods & Services Tax": "/img/brand/gst.svg",
  IATO: "/img/brand/iato.svg",
  "Startup India": "/img/brand/startup-india.svg",
  MSME: "/img/brand/msme.svg",
};

function unwrap(response) {
  if (response?.data !== undefined) {
    return response.data?.data ?? response.data ?? null;
  }
  return response ?? null;
}

async function getPartnershipApi(path) {
  try {
    const response = await fetch(`/api/partnerships${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (_) {
    return null;
  }
}

function normalizePartner(partner) {
  return {
    ...partner,
    logo: partner.logo || FALLBACK_LOGOS[partner.name] || "/img/brand/brand_1_1.svg",
    label: partner.label || partner.tag_line || "Trusted Tripogram Partner",
  };
}

function normalizeSection(section) {
  if (!section) return null;
  return {
    ...section,
    sub_title: section.sub_title ?? section.small_label,
    title: section.title ?? section.heading,
  };
}

// GET /api/partnerships — Section + sab partners
export async function getPartnerships() {
  try {
    const res = await getPartnershipApi("");
    const data = unwrap(res);
    return data
      ? {
          ...data,
          section: normalizeSection(data.section),
          partners: Array.isArray(data.partners) ? data.partners.map(normalizePartner) : [],
        }
      : null;
  } catch (error) {
    console.log("Failed to fetch partnerships:", error.response?.data?.message || error.message);
    return null;
  }
}

// GET /api/partnerships/section — Sirf section heading data
export async function getPartnershipsSection() {
  try {
    const res = await getPartnershipApi("/section");
    return normalizeSection(unwrap(res));
  } catch (error) {
    console.log("Failed to fetch partnerships section:", error.response?.data?.message || error.message);
    return null;
  }
}

// GET /api/partnerships/partners — Sirf partners list
export async function getPartnersList() {
  try {
    const res = await getPartnershipApi("/partners");
    const data = unwrap(res);
    return Array.isArray(data) ? data.map(normalizePartner) : [];
  } catch (error) {
    console.log("Failed to fetch partners list:", error.response?.data?.message || error.message);
    return [];
  }
}
