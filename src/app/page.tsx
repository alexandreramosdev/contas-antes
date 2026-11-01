"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { AddItemInput } from "@/src/components/AddItemInput";
import { Header } from "@/src/components/Header";
import { ProductCard } from "@/src/components/ProductCard";
import { useShoppingList } from "@/src/hooks/useShoppingList";

export default function Home() {
  const [item, setItem] = useState<string>("");
  const { items, addItem } = useShoppingList();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItem(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!item.trim()) return;

    addItem(item);
    setItem("");
  };

  return (
    <div className="relative font-sans min-h-screen pb-32">
      <Header />
      <AddItemInput
        value={item}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
      <div className="p-4">
        {items.map(({ id, name }) => (
          <ProductCard key={id} id={id} name={name} />
        ))}
      </div>
    </div>
  );
}
