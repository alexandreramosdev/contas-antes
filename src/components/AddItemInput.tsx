import { Plus } from "lucide-react";
import { AddItemInputProps } from "@/src/types";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

export const AddItemInput = ({
  value,
  handleInputChange,
  handleButtonClick,
}: AddItemInputProps) => {
  return (
    <div className="sticky top-0 z-10 bg-zinc-900/50 border-0 p-4 flex flex-row gap-2">
      <Input
        className="bg-zinc-900 border-zinc-800"
        type="text"
        name="item"
        placeholder="Adicionar item..."
        value={value}
        onChange={(e) => handleInputChange(e)}
      />
      <Button type="button" onClick={(e) => handleButtonClick(e)}>
        <Plus size={48} />
      </Button>
    </div>
  );
};
