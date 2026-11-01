import { ChangeEvent, FormEvent } from "react";

export type Category =
  | "Hortifruti"
  | "Carnes e Peixes"
  | "Padaria"
  | "Laticínios e Ovos"
  | "Mercearia"
  | "Bebidas"
  | "Congelados"
  | "Limpeza"
  | "Higiene e Beleza"
  | "Outros";

export interface Item {
  id: string;
  name: string;
  nameKey: string;
  category: Category;
  categorySource: "auto" | "manual";
  quantity: number;
  priceCents: number | null;
  checked: boolean;
  updatedAt: number;
}

export interface PriceHistoryEntry {
  priceCents: number;
  updatedAt: number;
}

export type PriceHistory = Record<string, PriceHistoryEntry>;

export interface AddItemInputProps {
  value: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
