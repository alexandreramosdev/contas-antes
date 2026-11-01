"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { AddItemInput } from "@/src/components/AddItemInput";
import { CartSummaryBar } from "@/src/components/CartSummaryBar";
import { Header } from "@/src/components/Header";
import { ItemSheet } from "@/src/components/ItemSheet";
import { ProductCard } from "@/src/components/ProductCard";
import { useShoppingList } from "@/src/hooks/useShoppingList";

export default function Home() {
  const [item, setItem] = useState<string>("");
  const [sheetItemId, setSheetItemId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSession, setSheetSession] = useState(0);

  const {
    items,
    addItem,
    checkItem,
    uncheckItem,
    getSuggestedPrice,
    cartTotalCents,
    estimatedTotalCents,
    cartCount,
  } = useShoppingList();

  const sheetItem = items.find((candidate) => candidate.id === sheetItemId) ?? null;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItem(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!item.trim()) return;

    addItem(item);
    setItem("");
  };

  const handleToggleCheck = (id: string) => {
    const target = items.find((candidate) => candidate.id === id);
    if (!target) return;

    if (target.checked) {
      uncheckItem(id);
      return;
    }

    setSheetItemId(id);
    setSheetSession((current) => current + 1);
    setSheetOpen(true);
  };

  const handleConfirmCheck = (priceCents: number, quantity: number) => {
    if (!sheetItem) return;

    checkItem(sheetItem.id, priceCents, quantity);
    setSheetOpen(false);
  };

  return (
    <div className="relative min-h-screen pb-32 font-sans">
      <Header estimatedTotalCents={estimatedTotalCents} />
      <AddItemInput
        value={item}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
      <div className="p-4">
        {items.map((listItem) => (
          <ProductCard
            key={listItem.id}
            item={listItem}
            suggestedPriceCents={getSuggestedPrice(listItem.nameKey)}
            onToggleCheck={handleToggleCheck}
          />
        ))}
      </div>
      <ItemSheet
        key={sheetSession}
        item={sheetItem}
        open={sheetOpen}
        suggestedPriceCents={sheetItem ? getSuggestedPrice(sheetItem.nameKey) : null}
        onOpenChange={setSheetOpen}
        onConfirm={handleConfirmCheck}
      />
      {cartCount > 0 && (
        <CartSummaryBar cartCount={cartCount} cartTotalCents={cartTotalCents} />
      )}
    </div>
  );
}
