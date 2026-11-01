"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { Category, Item, PriceHistory } from "@/src/types";
import { inferCategory, normalizeNameKey } from "@/src/lib/categories";
import {
  loadItems,
  loadPriceHistory,
  saveItems,
  savePriceHistory,
  upsertPriceHistory,
} from "@/src/lib/storage";
import { getCartCount, getCartTotalCents, getEstimatedTotalCents } from "@/src/lib/totals";
import { generateId } from "@/src/lib/utils";

interface ShoppingListState {
  items: Item[];
  priceHistory: PriceHistory;
}

const EMPTY_STATE: ShoppingListState = { items: [], priceHistory: {} };

let state: ShoppingListState = EMPTY_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

const getSnapshot = (): ShoppingListState => {
  if (!hydrated) {
    state = { items: loadItems(), priceHistory: loadPriceHistory() };
    hydrated = true;
  }

  return state;
};

const getServerSnapshot = (): ShoppingListState => EMPTY_STATE;

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const update = (updater: (current: ShoppingListState) => ShoppingListState) => {
  state = updater(getSnapshot());

  saveItems(state.items);
  savePriceHistory(state.priceHistory);

  listeners.forEach((listener) => listener());
};

export const useShoppingList = () => {
  const { items, priceHistory } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const addItem = useCallback((name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    const nameKey = normalizeNameKey(trimmed);
    const isPendingDuplicate = getSnapshot().items.some(
      (item) => item.nameKey === nameKey && !item.checked,
    );
    if (isPendingDuplicate) return false;

    update((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: generateId(),
          name: trimmed,
          nameKey,
          category: inferCategory(trimmed),
          categorySource: "auto",
          quantity: 1,
          priceCents: null,
          checked: false,
          updatedAt: Date.now(),
        },
      ],
    }));

    return true;
  }, []);

  const removeItem = useCallback((id: string) => {
    update((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
  }, []);

  const renameItem = useCallback((id: string, name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    update((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id
          ? {
              ...item,
              name: trimmed,
              nameKey: normalizeNameKey(trimmed),
              category:
                item.categorySource === "auto" ? inferCategory(trimmed) : item.category,
              updatedAt: Date.now(),
            }
          : item,
      ),
    }));

    return true;
  }, []);

  const setCategory = useCallback((id: string, category: Category) => {
    update((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id
          ? { ...item, category, categorySource: "manual", updatedAt: Date.now() }
          : item,
      ),
    }));
  }, []);

  const checkItem = useCallback((id: string, priceCents: number, quantity: number) => {
    const target = getSnapshot().items.find((item) => item.id === id);
    if (!target) return;

    update((current) => ({
      items: current.items.map((item) =>
        item.id === id
          ? { ...item, checked: true, priceCents, quantity, updatedAt: Date.now() }
          : item,
      ),
      priceHistory: upsertPriceHistory(current.priceHistory, target.nameKey, priceCents),
    }));
  }, []);

  const uncheckItem = useCallback((id: string) => {
    update((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, checked: false, updatedAt: Date.now() } : item,
      ),
    }));
  }, []);

  const clearChecked = useCallback(() => {
    update((current) => ({
      ...current,
      items: current.items.filter((item) => !item.checked),
    }));
  }, []);

  const getSuggestedPrice = useCallback(
    (nameKey: string): number | null => priceHistory[nameKey]?.priceCents ?? null,
    [priceHistory],
  );

  const cartTotalCents = useMemo(() => getCartTotalCents(items), [items]);
  const estimatedTotalCents = useMemo(
    () => getEstimatedTotalCents(items, priceHistory),
    [items, priceHistory],
  );
  const cartCount = useMemo(() => getCartCount(items), [items]);

  return {
    items,
    priceHistory,
    addItem,
    removeItem,
    renameItem,
    setCategory,
    checkItem,
    uncheckItem,
    clearChecked,
    getSuggestedPrice,
    cartTotalCents,
    estimatedTotalCents,
    cartCount,
  };
};
