import { ChangeEvent, FormEvent } from "react";

export interface AddItemInputProps {
  value: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export interface ItemProps {
  id: number;
  name: string;
}
