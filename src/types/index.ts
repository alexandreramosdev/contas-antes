import { ChangeEvent, MouseEvent } from "react";
interface AddItemInputProps {
  value: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleButtonClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

interface Item {
  id: number;
  name: string;
}

export type { AddItemInputProps, Item };
