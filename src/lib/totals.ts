import { Item, PriceHistory } from "@/src/types";

export const getCartTotalCents = (items: Item[]): number =>
  items.reduce(
    (total, item) =>
      item.checked && item.priceCents !== null
        ? total + item.priceCents * item.quantity
        : total,
    0,
  );

export const getEstimatedTotalCents = (
  items: Item[],
  priceHistory: PriceHistory,
): number =>
  items.reduce((total, item) => {
    if (item.checked) {
      return item.priceCents !== null ? total + item.priceCents * item.quantity : total;
    }

    const entry = priceHistory[item.nameKey];

    return entry ? total + entry.priceCents * item.quantity : total;
  }, 0);

export const getCartCount = (items: Item[]): number =>
  items.filter((item) => item.checked).length;
