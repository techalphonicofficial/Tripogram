// lib/crypt.js
import crypto from "crypto";

const ALGO = "aes-256-cbc";
const APP_KEY = "envlivestrips2025knbvftyui8765px"; // 32 char

// 16 byte IV
const IV = Buffer.alloc(16, 0);

export function encrypt(value) {
  const cipher = crypto.createCipheriv(ALGO, Buffer.from(APP_KEY), IV);
  let encrypted = cipher.update(JSON.stringify(value), "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

export function decrypt(value) {
  const decipher = crypto.createDecipheriv(ALGO, Buffer.from(APP_KEY), IV);
  let decrypted = decipher.update(value, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}
