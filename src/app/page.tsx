"use client";

import { ChangeEvent, MouseEvent, useState } from "react";
import { AddItemInput } from "@/src/components/AddItemInput";
import { Header } from "@/src/components/Header";
import { Item } from "@/src/types";

export default function Home() {
  const [item, setItem] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setItem(e.target.value.trim());
  };

  const generateId = () => {
    return Math.floor(Math.random() * 1000);
  };

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setItems([...items, { id: generateId(), name: item }]);
    setItem("");
  };

  return (
    <div className="relative font-sans min-h-screen pb-32">
      <Header />
      <AddItemInput
        value={item}
        handleInputChange={handleInputChange}
        handleButtonClick={handleButtonClick}
      />
      <div className="pt-8 pb-4 px-4">
        lista produtos
        {items.map(({ id, name }) => (
          <li key={id}>{name}</li>
        ))}
      </div>
    </div>
  );
}
