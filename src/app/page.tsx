"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { AddItemInput } from "@/src/components/AddItemInput";
import { Header } from "@/src/components/Header";
import { ItemProps } from "@/src/types";

import { ProductCard } from "../components/ProductCard";

export default function Home() {
  const [item, setItem] = useState<string>("");
  const [itens, setItens] = useState<ItemProps[]>([]);

  const generateId = () => {
    return Math.floor(Math.random() * 1000);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setItem(e.target.value.trim());
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!item) return;

    setItens([...itens, { id: generateId(), name: item }]);
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
        {/* <h2 className="text-zinc-100 text-xl mb-4">Itens</h2> */}
        {itens.map(({ id, name }) => (
          <ProductCard key={id} id={id} name={name} />
        ))}
      </div>
    </div>
  );
}
