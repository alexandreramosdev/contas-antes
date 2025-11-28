"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { AddItemInput } from "@/src/components/AddItemInput";
import { Header } from "@/src/components/Header";
import { Item } from "@/src/types";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Checkbox } from "@/src/components/ui/checkbox";

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

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
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
        handleFormSubmit={handleFormSubmit}
      />
      <div className="p-4">
        {/* <h2 className="text-zinc-100 text-xl mb-4">Itens</h2> */}
        {items.map(({ id, name }) => (
          <Card key={id} className="my-2 py-4 border-zinc-800 bg-zinc-900">
            <CardContent className="flex flex-row items-center flex-between gap-2 ">
              <Checkbox className="rounded-full w-6 h-6" />
              <div className="w-full pl-4 text-zinc-100">{name}</div>
              <Badge variant="outline" className="text-zinc-500">
                R$ 15,99
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
