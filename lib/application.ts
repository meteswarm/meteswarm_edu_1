export type Application = {
  number: string;
  planId: string;
  planName: string;
  price: number;
  name: string;
  phone: string;
  submittedAt: string;
};

const STORAGE_KEY = "change-application";

export function saveApplication(application: Application) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(application));
    return true;
  } catch {
    return false;
  }
}

export function readApplicationRaw() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function parseApplication(raw: string): Application | null {
  try {
    return raw ? (JSON.parse(raw) as Application) : null;
  } catch {
    return null;
  }
}

export function createApplicationNumber(date: Date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const serial = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `${date.getFullYear()}-${mm}${dd}-${serial}`;
}

export function formatSubmittedAt(iso: string) {
  const date = new Date(iso);
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${hh}:${mi}`;
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export function isValidPhone(value: string) {
  return /^01\d{8,9}$/.test(normalizePhone(value));
}

// Docs/PRD.md NFR-2: 고객 정보는 화면에서 마스킹한다.
export function maskName(name: string) {
  const chars = Array.from(name.trim());
  if (chars.length <= 1) return "*";
  if (chars.length === 2) return `${chars[0]}*`;
  return `${chars[0]}${"*".repeat(chars.length - 2)}${chars[chars.length - 1]}`;
}

export function maskPhone(phone: string) {
  const digits = normalizePhone(phone);
  return `${digits.slice(0, 3)}-****-${digits.slice(-4)}`;
}
