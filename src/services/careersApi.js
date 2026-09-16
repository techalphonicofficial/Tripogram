import { api } from "./config";

async function getCareersApi(path) {
  try {
    const response = await fetch(`/api/careers${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (_) {
    return null;
  }
}

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? null;
}

function normalizeHero(data) {
  if (!data) return null;
  return {
    ...data,
    eyebrow: data.eyebrow ?? data.label,
    heading_line1: data.heading_line1 ?? data.heading_line_1 ?? data.heading_1,
    heading_line2: data.heading_line2 ?? data.heading_line_2 ?? data.heading_2,
    heading_line3: data.heading_line3 ?? data.heading_line_3 ?? data.heading_3,
    cta_label: data.cta_label ?? data.button_text,
    image_main: data.image_main ?? data.main_image ?? data.image ?? data.photo ?? data.bg_image,
    image_secondary: data.image_secondary ?? data.secondary_image ?? data.sub_image,
  };
}

function normalizeList(response, mapItem = (item) => item) {
  const data = unwrap(response);
  return Array.isArray(data) ? data.map(mapItem) : [];
}

// GET /api/careers — Sab kuch (full careers page data)
export async function getCareers() {
  try {
    const res = await getCareersApi("");
    return unwrap(res);
  } catch (error) {
    console.log("Failed to fetch careers:", error.response?.data?.message || error.message);
    return null;
  }
}

// GET /api/careers/hero — Hero section data
export async function getCareersHero() {
  try {
    const res = await getCareersApi("/hero");
    return normalizeHero(unwrap(res));
  } catch (error) {
    console.log("Failed to fetch careers hero:", error.response?.data?.message || error.message);
    return null;
  }
}

// GET /api/careers/hero/labels — Hero labels (team members avatars etc.)
export async function getCareersHeroLabels() {
  try {
    const res = await getCareersApi("/hero/labels");
    const data = unwrap(res);
    if (Array.isArray(data)) {
      return { avatars: data.filter((avatar) => avatar?.image || avatar?.avatar || avatar?.url) };
    }
    return data;
  } catch (error) {
    console.log("Failed to fetch careers hero labels:", error.response?.data?.message || error.message);
    return null;
  }
}

// GET /api/careers/team-members — Team members list
export async function getCareersTeamMembers() {
  try {
    const res = await getCareersApi("/team-members");
    return normalizeList(res);
  } catch (error) {
    console.log("Failed to fetch team members:", error.response?.data?.message || error.message);
    return [];
  }
}

// GET /api/careers/statistics — Stats (70+ team, 25+ destinations etc.)
export async function getCareersStatistics() {
  try {
    const res = await getCareersApi("/statistics");
    return normalizeList(res, (stat) => ({
      ...stat,
      value: stat.value ?? stat.number,
      label: stat.label ?? stat.title,
    }));
  } catch (error) {
    console.log("Failed to fetch careers statistics:", error.response?.data?.message || error.message);
    return [];
  }
}

// GET /api/careers/why-join-us — Why Join Us section heading
export async function getCareersWhyJoinUs() {
  try {
    const res = await getCareersApi("/why-join-us");
    return unwrap(res);
  } catch (error) {
    console.log("Failed to fetch why-join-us:", error.response?.data?.message || error.message);
    return null;
  }
}

// GET /api/careers/why-join-us/cards — Why Join Us cards list
export async function getCareersWhyJoinUsCards() {
  try {
    const res = await getCareersApi("/why-join-us/cards");
    return normalizeList(res);
  } catch (error) {
    console.log("Failed to fetch why-join-us cards:", error.response?.data?.message || error.message);
    return [];
  }
}

// GET /api/careers/jobs — All open job positions
export async function getCareersJobs() {
  try {
    const res = await getCareersApi("/jobs");
    return normalizeList(res, (job) => ({
      ...job,
      id: job.id ?? job.slug,
      type: job.type ?? job.job_type,
      description: Array.isArray(job.description)
        ? job.description
        : [job.description ?? job.short_description].filter(Boolean),
      skills: Array.isArray(job.skills) ? job.skills : [],
    }));
  } catch (error) {
    console.log("Failed to fetch jobs:", error.response?.data?.message || error.message);
    return [];
  }
}

// GET /api/careers/jobs/{slug} — Single job detail by slug
export async function getCareerJobBySlug(slug) {
  try {
    const res = await getCareersApi(`/jobs/${encodeURIComponent(slug)}`);
    const data = unwrap(res);
    return data ? {
      ...data,
      id: data.id ?? data.slug,
      type: data.type ?? data.job_type,
      description: Array.isArray(data.description)
        ? data.description
        : [data.description ?? data.short_description].filter(Boolean),
      skills: Array.isArray(data.skills) ? data.skills : [],
    } : null;
  } catch (error) {
    console.log(`Failed to fetch job [${slug}]:`, error.response?.data?.message || error.message);
    return null;
  }
}

// GET /api/careers/benefits — Perks & Benefits list
export async function getCareersBenefits() {
  try {
    const res = await getCareersApi("/benefits");
    return normalizeList(res);
  } catch (error) {
    console.log("Failed to fetch benefits:", error.response?.data?.message || error.message);
    return [];
  }
}

// GET /api/careers/faqs — FAQs list
export async function getCareersFaqs() {
  try {
    const res = await getCareersApi("/faqs");
    return normalizeList(res);
  } catch (error) {
    console.log("Failed to fetch careers faqs:", error.response?.data?.message || error.message);
    return [];
  }
}

// GET /api/careers/settings — Settings (contact email, social links etc.)
export async function getCareersSettings() {
  try {
    const res = await getCareersApi("/settings");
    return unwrap(res);
  } catch (error) {
    console.log("Failed to fetch careers settings:", error.response?.data?.message || error.message);
    return null;
  }
}

// POST /api/careers/apply — Job application form submit
export async function submitCareerApplication(formData) {
  try {
    const res = await api.post("/careers/apply", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, data: res.data };
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Something went wrong";
    console.log("Failed to submit application:", message);
    return { success: false, message };
  }
}
