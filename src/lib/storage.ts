import { Item, PriceHistory, PriceHistoryEntry } from "@/src/types";
import { CATEGORIES, normalizeNameKey } from "@/src/lib/categories";

const ITEMS_KEY = "conta-antes:v1:items";
const PRICE_HISTORY_KEY = "conta-antes:v1:price-history";

const getLocalStorage = (): Storage | null => {
  try {
    if (typeof localStorage === "undefined") return null;

    return localStorage;
  } catch {
    return null;
  }
};

const isValidItem = (value: unknown): value is Item => {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    typeof item.name === "string" &&
    item.name.length > 0 &&
    typeof item.category === "string" &&
    (CATEGORIES as string[]).includes(item.category) &&
    (item.categorySource === "auto" || item.categorySource === "manual") &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1 &&
    item.quantity <= 999 &&
    (item.priceCents === null ||
      (typeof item.priceCents === "number" &&
        Number.isInteger(item.priceCents) &&
        item.priceCents >= 0)) &&
    typeof item.checked === "boolean" &&
    typeof item.updatedAt === "number" &&
    Number.isFinite(item.updatedAt)
  );
};

const isValidPriceHistoryEntry = (value: unknown): value is PriceHistoryEntry => {
  if (typeof value !== "object" || value === null) return false;

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.priceCents === "number" &&
    Number.isInteger(entry.priceCents) &&
    entry.priceCents >= 0 &&
    typeof entry.updatedAt === "number" &&
    Number.isFinite(entry.updatedAt)
  );
};

export const loadItems = (): Item[] => {
  const storage = getLocalStorage();
  if (storage === null) return [];

  try {
    const raw = storage.getItem(ITEMS_KEY);
    if (raw === null) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidItem).map((item) => ({
      ...item,
      nameKey: normalizeNameKey(item.name),
    }));
  } catch {
    return [];
  }
};

export const saveItems = (items: Item[]): void => {
  const storage = getLocalStorage();
  if (storage === null) return;

  try {
    storage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch {
    return;
  }
};

export const loadPriceHistory = (): PriceHistory => {
  const storage = getLocalStorage();
  if (storage === null) return {};

  try {
    const raw = storage.getItem(PRICE_HISTORY_KEY);
    if (raw === null) return {};

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};

    const entries = Object.entries(parsed as Record<string, unknown>).filter(
      (entry): entry is [string, PriceHistoryEntry] => isValidPriceHistoryEntry(entry[1]),
    );

    return Object.fromEntries(entries);
  } catch {
    return {};
  }
};

export const savePriceHistory = (history: PriceHistory): void => {
  const storage = getLocalStorage();
  if (storage === null) return;

  try {
    storage.setItem(PRICE_HISTORY_KEY, JSON.stringify(history));
  } catch {
    return;
  }
};

export const upsertPriceHistory = (
  history: PriceHistory,
  nameKey: string,
  priceCents: number,
): PriceHistory => ({
  ...history,
  [nameKey]: { priceCents, updatedAt: Date.now() },
});
