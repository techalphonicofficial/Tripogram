import { decrypt, encrypt } from "@/functions/crypt";

const currentBookingKey = (slug) => `tripogram_${slug}`;
const legacyBookingKey = (slug) => `tripogram_${slug}`;

function parseStoredValue(value) {
  if (!value) return {};
  const decrypted = decrypt(value);
  return typeof decrypted === "string" ? JSON.parse(decrypted) : decrypted;
}

export function getBookingData(slug) {
  if (typeof window === "undefined" || !slug) return {};

  try {
    const current = localStorage.getItem(currentBookingKey(slug));
    if (current) return parseStoredValue(current) || {};

    const legacy = localStorage.getItem(legacyBookingKey(slug));
    return legacy ? parseStoredValue(legacy) || {} : {};
  } catch {
    return {};
  }
}

export function setBookingData(slug, data) {
  if (typeof window === "undefined" || !slug) return;

  try {
    localStorage.setItem(currentBookingKey(slug), encrypt(JSON.stringify(data || {})));
    localStorage.removeItem(legacyBookingKey(slug));
  } catch {
    // localStorage can be unavailable in private browsing or blocked contexts.
  }
}

export function clearBookingData(slug) {
  if (typeof window === "undefined" || !slug) return;

  try {
    localStorage.removeItem(currentBookingKey(slug));
    localStorage.removeItem(legacyBookingKey(slug));
  } catch {
    // Ignore storage cleanup failures.
  }
}
