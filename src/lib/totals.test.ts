import { describe, expect, it } from "vitest";
import { Item } from "@/src/types";
import {
  getCartCount,
  getCartTotalCents,
  getEstimatedTotalCents,
} from "@/src/lib/totals";

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

describe("getCartTotalCents", () => {
  it("returns zero for an empty list", () => {
    expect(getCartTotalCents([])).toBe(0);
  });

  it("sums checked items with price multiplied by quantity", () => {
    const items = [
      createItem({ checked: true, priceCents: 2599, quantity: 2 }),
      createItem({ id: "item-2", checked: true, priceCents: 500, quantity: 3 }),
    ];

    expect(getCartTotalCents(items)).toBe(2599 * 2 + 500 * 3);
  });

  it("ignores unchecked items and checked items without price", () => {
    const items = [
      createItem({ checked: true }),
      createItem({ id: "item-2", checked: false, priceCents: 1000 }),
      createItem({ id: "item-3", checked: true, priceCents: 300 }),
    ];

    expect(getCartTotalCents(items)).toBe(300);
  });
});

describe("getEstimatedTotalCents", () => {
  it("equals the cart total when there is no history", () => {
    const items = [createItem({ checked: true, priceCents: 2599 })];

    expect(getEstimatedTotalCents(items, {})).toBe(2599);
  });

  it("adds the last known price for unchecked items with history", () => {
    const items = [
      createItem({ checked: false, quantity: 2 }),
      createItem({ id: "item-2", name: "Leite", nameKey: "leite" }),
    ];
    const history = {
      arroz: { priceCents: 2599, updatedAt: 1 },
      leite: { priceCents: 549, updatedAt: 2 },
    };

    expect(getEstimatedTotalCents(items, history)).toBe(2599 * 2 + 549);
  });

  it("uses history for unchecked items even when they have a registered price", () => {
    const items = [createItem({ checked: false, priceCents: 1000 })];
    const history = { arroz: { priceCents: 2599, updatedAt: 1 } };

    expect(getEstimatedTotalCents(items, history)).toBe(2599);
  });

  it("counts checked items once, via their real price", () => {
    const items = [createItem({ checked: true, priceCents: 1000 })];
    const history = { arroz: { priceCents: 2599, updatedAt: 1 } };

    expect(getEstimatedTotalCents(items, history)).toBe(1000);
  });

  it("ignores the registered price of unchecked items without history", () => {
    const items = [
      createItem({ checked: false, priceCents: 1000, quantity: 2 }),
      createItem({
        id: "item-2",
        name: "Leite",
        nameKey: "leite",
        checked: false,
        priceCents: 549,
      }),
    ];

    expect(getEstimatedTotalCents(items, {})).toBe(0);
  });

  it("ignores items without price or history", () => {
    const items = [
      createItem(),
      createItem({ id: "item-2", name: "Leite", nameKey: "leite" }),
    ];

    expect(getEstimatedTotalCents(items, {})).toBe(0);
  });
});

describe("getCartCount", () => {
  it("returns zero for an empty list", () => {
    expect(getCartCount([])).toBe(0);
  });

  it("counts only checked items", () => {
    const items = [
      createItem({ checked: true }),
      createItem({ id: "item-2", checked: false }),
      createItem({ id: "item-3", checked: true }),
    ];

    expect(getCartCount(items)).toBe(2);
  });
});
