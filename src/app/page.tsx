"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { AddItemInput } from "@/src/components/AddItemInput";
import { CartSummaryBar } from "@/src/components/CartSummaryBar";
import { EmptyState } from "@/src/components/EmptyState";
import { Header } from "@/src/components/Header";
import { ItemSheet, ItemSheetMode } from "@/src/components/ItemSheet";
import { ProductCard } from "@/src/components/ProductCard";
import { useShoppingList } from "@/src/hooks/useShoppingList";
import { Category } from "@/src/types";

export default function Home() {
  const [item, setItem] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sheetItemId, setSheetItemId] = useState<string | null>(null);
  const [sheetMode, setSheetMode] = useState<ItemSheetMode>("cart");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSession, setSheetSession] = useState(0);

  const {
    items,
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
  } = useShoppingList();

  const sheetItem = items.find((candidate) => candidate.id === sheetItemId) ?? null;

  const openSheet = (id: string, mode: ItemSheetMode) => {
    setSheetItemId(id);
    setSheetMode(mode);
    setSheetSession((current) => current + 1);
    setSheetOpen(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItem(e.target.value);
    setFeedback(null);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!item.trim()) return;

    if (!addItem(item)) {
      setFeedback("Este item já está na lista");
      return;
    }

    setFeedback(null);
    setItem("");
  };

  const handleToggleCheck = (id: string) => {
    const target = items.find((candidate) => candidate.id === id);
    if (!target) return;

    if (target.checked) {
      uncheckItem(id);
      return;
    }

    openSheet(id, "cart");
  };

  const handleEdit = (id: string) => {
    openSheet(id, "edit");
  };

  const handleConfirmCheck = (priceCents: number, quantity: number) => {
    if (!sheetItem) return;

    checkItem(sheetItem.id, priceCents, quantity);
    setSheetOpen(false);
  };

  const handleSaveEdit = (id: string, name: string, categoryOverride: Category | null) => {
    renameItem(id, name);

    if (categoryOverride !== null) {
      setCategory(id, categoryOverride);
    }

    setSheetOpen(false);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    setSheetOpen(false);
  };

  const handleNewPurchase = () => {
    clearChecked();
    setSheetOpen(false);
  };

  return (
    <div className="relative min-h-screen pb-32 font-sans">
      <Header estimatedTotalCents={estimatedTotalCents} />
      <AddItemInput
        value={item}
        feedback={feedback}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
      <div className="p-4">
        {items.length === 0 ? (
          <EmptyState variant="empty" />
        ) : (
          <>
            {cartCount === items.length && (
              <EmptyState variant="all-checked" className="py-6" />
            )}
            {items.map((listItem) => (
              <ProductCard
                key={listItem.id}
                item={listItem}
                suggestedPriceCents={getSuggestedPrice(listItem.nameKey)}
                onToggleCheck={handleToggleCheck}
                onEdit={handleEdit}
              />
            ))}
          </>
        )}
      </div>
      <ItemSheet
        key={sheetSession}
        item={sheetItem}
        open={sheetOpen}
        mode={sheetMode}
        suggestedPriceCents={sheetItem ? getSuggestedPrice(sheetItem.nameKey) : null}
        onOpenChange={setSheetOpen}
        onConfirm={handleConfirmCheck}
        onSave={handleSaveEdit}
        onRemove={handleRemoveItem}
      />
      {cartCount > 0 && (
        <CartSummaryBar
          cartCount={cartCount}
          cartTotalCents={cartTotalCents}
          onNewPurchase={handleNewPurchase}
        />
      )}
    </div>
  );
}
