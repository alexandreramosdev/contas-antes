import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Item } from "@/src/types";
import {
  loadItems,
  loadPriceHistory,
  saveItems,
  savePriceHistory,
  upsertPriceHistory,
} from "@/src/lib/storage";

const ITEMS_KEY = "conta-antes:v1:items";
const PRICE_HISTORY_KEY = "conta-antes:v1:price-history";

const createStorageMock = (): Storage => {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear: () => {
      store.clear();
    },
    getItem: (key) => store.get(key) ?? null,
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => {
      store.delete(key);
    },
    setItem: (key, value) => {
      store.set(key, value);
    },
  };
};

const createItem = (overrides: Partial<Item> = {}): Item => ({
  id: "item-1",
  name: "Arroz",
  nameKey: "arroz",
  category: "Mercearia",
  categorySource: "auto",
  quantity: 1,
  priceCents: null,
  checked: false,
  updatedAt: 1700000000000,
  ...overrides,
});

let storage: Storage;

beforeEach(() => {
  storage = createStorageMock();
  vi.stubGlobal("localStorage", storage);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("loadItems", () => {
  it("returns an empty list when localStorage is unavailable", () => {
    vi.unstubAllGlobals();

    expect(loadItems()).toEqual([]);
  });

  it("returns an empty list when nothing is stored", () => {
    expect(loadItems()).toEqual([]);
  });

  it("round-trips saved items", () => {
    const items = [
      createItem(),
      createItem({
        id: "item-2",
        name: "Leite",
        nameKey: "leite",
        category: "Laticínios e Ovos",
      }),
    ];

    saveItems(items);

    expect(loadItems()).toEqual(items);
  });

  it("returns an empty list for corrupted JSON", () => {
    storage.setItem(ITEMS_KEY, "{not-json");

    expect(loadItems()).toEqual([]);
  });

  it("returns an empty list when the stored value is not an array", () => {
    storage.setItem(ITEMS_KEY, JSON.stringify({ id: "item-1" }));

    expect(loadItems()).toEqual([]);
  });

  it("filters structurally invalid entries", () => {
    const invalidEntries = [
      { id: "missing-fields" },
      null,
      "not-an-item",
      createItem({ id: "bad-quantity", quantity: 0 }),
      createItem({ id: "bad-quantity-range", quantity: 1000 }),
      createItem({ id: "bad-category", category: "Sem Categoria" as Item["category"] }),
      createItem({ id: "bad-price", priceCents: -10 }),
      createItem({ id: "bad-checked", checked: "yes" as unknown as boolean }),
      createItem({ id: "blank-name", name: "   " }),
    ];

    storage.setItem(ITEMS_KEY, JSON.stringify([createItem(), ...invalidEntries]));

    expect(loadItems()).toEqual([createItem()]);
  });

  it("recomputes the nameKey from the name on load", () => {
    storage.setItem(
      ITEMS_KEY,
      JSON.stringify([{ ...createItem(), name: "Pão de Queijo", nameKey: "stale-key" }]),
    );

    expect(loadItems()[0].nameKey).toBe("pao de queijo");
  });

  it("does not throw when writing fails", () => {
    vi.spyOn(storage, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });

    expect(() => saveItems([createItem()])).not.toThrow();
  });
});

describe("loadPriceHistory", () => {
  it("returns an empty object when nothing is stored", () => {
    expect(loadPriceHistory()).toEqual({});
  });

  it("round-trips a saved history", () => {
    const history = {
      arroz: { priceCents: 2599, updatedAt: 1 },
      leite: { priceCents: 549, updatedAt: 2 },
    };

    savePriceHistory(history);

    expect(loadPriceHistory()).toEqual(history);
  });

  it("returns an empty object for corrupted JSON", () => {
    storage.setItem(PRICE_HISTORY_KEY, "{not-json");

    expect(loadPriceHistory()).toEqual({});
  });

  it("filters invalid entries individually", () => {
    storage.setItem(
      PRICE_HISTORY_KEY,
      JSON.stringify({
        arroz: { priceCents: 2599, updatedAt: 1 },
        negative: { priceCents: -1, updatedAt: 2 },
        decimal: { priceCents: 10.5, updatedAt: 3 },
        noPrice: { updatedAt: 4 },
        nullEntry: null,
        stringEntry: "2599",
      }),
    );

    expect(loadPriceHistory()).toEqual({ arroz: { priceCents: 2599, updatedAt: 1 } });
  });

  it("returns an empty object when the stored value is not a plain object", () => {
    storage.setItem(
      PRICE_HISTORY_KEY,
      JSON.stringify([{ priceCents: 2599, updatedAt: 1 }]),
    );

    expect(loadPriceHistory()).toEqual({});
  });
});

describe("savePriceHistory", () => {
  it("does not throw when writing fails", () => {
    vi.spyOn(storage, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });

    expect(() =>
      savePriceHistory({ arroz: { priceCents: 2599, updatedAt: 1 } }),
    ).not.toThrow();
  });
});

describe("upsertPriceHistory", () => {
  it("adds a new entry without mutating the original object", () => {
    const history = {};

    const result = upsertPriceHistory(history, "arroz", 2599);

    expect(result.arroz.priceCents).toBe(2599);
    expect(result.arroz.updatedAt).toBeGreaterThan(0);
    expect(history).toEqual({});
  });

  it("updates an existing entry and keeps the others", () => {
    const history = {
      arroz: { priceCents: 1000, updatedAt: 1 },
      leite: { priceCents: 500, updatedAt: 2 },
    };

    const result = upsertPriceHistory(history, "arroz", 2599);

    expect(result.arroz.priceCents).toBe(2599);
    expect(result.leite).toEqual({ priceCents: 500, updatedAt: 2 });
    expect(history.arroz.priceCents).toBe(1000);
  });
});
