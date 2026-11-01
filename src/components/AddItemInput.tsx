import { FormEvent, useRef } from "react";
import { AlertCircle, Plus } from "lucide-react";
import { AddItemInputProps } from "@/src/types";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

export const AddItemInput = ({
  value,
  feedback,
  handleInputChange,
  handleFormSubmit,
}: AddItemInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    handleFormSubmit(e);
    inputRef.current?.focus();
  };

  return (
    <form
      className="flex flex-col gap-2 border-0 bg-zinc-900/50 p-4 backdrop-blur-md"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-row gap-2">
        <Input
          ref={inputRef}
          className="h-11 bg-zinc-900 border-zinc-800"
          type="text"
          name="item"
          placeholder="Adicionar item..."
          aria-label="Nome do item"
          aria-describedby={feedback ? "add-item-feedback" : undefined}
          value={value}
          onChange={(e) => handleInputChange(e)}
        />
        <Button
          className="h-11 bg-zinc-800 border border-zinc-700"
          type="submit"
          aria-label="Adicionar item"
        >
          <Plus className="text-emerald-500" />
        </Button>
      </div>
      {feedback !== null && (
        <p
          id="add-item-feedback"
          role="status"
          className="flex items-center gap-1.5 text-sm text-amber-500"
        >
          <AlertCircle className="size-4" />
          {feedback}
        </p>
      )}
    </form>
  );
};
