import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/src/components/ui/drawer";
import { Input } from "@/src/components/ui/input";
import { CATEGORIES } from "@/src/lib/categories";
import { formatBRL, formatPriceInput, parsePriceToCents } from "@/src/lib/currency";
import { cn } from "@/src/lib/utils";
import { Category, Item } from "@/src/types";

export type ItemSheetMode = "cart" | "edit";

interface ItemSheetProps {
  item: Item | null;
  open: boolean;
  mode: ItemSheetMode;
  suggestedPriceCents: number | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (priceCents: number, quantity: number) => void;
  onSave: (id: string, name: string, categoryOverride: Category | null) => void;
  onRemove: (id: string) => void;
}

export const ItemSheet = ({
  item,
  open,
  mode,
  suggestedPriceCents,
  onOpenChange,
  onConfirm,
  onSave,
  onRemove,
}: ItemSheetProps) => {
  const initialPriceCents = item?.priceCents ?? suggestedPriceCents ?? null;

  const [priceText, setPriceText] = useState(
    initialPriceCents !== null ? formatPriceInput(initialPriceCents) : "",
  );
  const [quantity, setQuantity] = useState(item?.quantity ?? 1);
  const [priceError, setPriceError] = useState<string | null>(null);

  const [nameText, setNameText] = useState(item?.name ?? "");
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    item?.category ?? "Outros",
  );
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const isEdit = mode === "edit";
  const suggestedFromHistory =
    item !== null && item.priceCents === null && suggestedPriceCents !== null;

  const handleConfirm = () => {
    const priceCents = parsePriceToCents(priceText);

    if (priceCents === null) {
      setPriceError("Informe um preço válido, como 15,99");
      return;
    }

    onConfirm(priceCents, quantity);
  };

  const handleSave = () => {
    if (!item) return;

    const trimmed = nameText.trim();
    if (!trimmed) {
      setNameError("Informe um nome para o item");
      return;
    }

    onSave(item.id, trimmed, categoryTouched ? selectedCategory : null);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{isEdit ? "Editar item" : (item?.name ?? "")}</DrawerTitle>
          <DrawerDescription>
            {isEdit
              ? "Altere o nome, a categoria ou remova o item"
              : "Informe o preço e a quantidade para adicionar ao carrinho"}
          </DrawerDescription>
        </DrawerHeader>

        {isEdit ? (
          <div className="flex min-h-0 flex-col gap-5 overflow-y-auto px-4 pb-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="sheet-name" className="text-sm text-muted-foreground">
                Nome
              </label>
              <Input
                id="sheet-name"
                value={nameText}
                onChange={(e) => {
                  setNameText(e.target.value);
                  setNameError(null);
                }}
                className="h-11 text-base"
              />
              {nameError !== null && (
                <p role="alert" className="text-sm text-destructive">
                  {nameError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Categoria</span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant="outline"
                    aria-pressed={category === selectedCategory}
                    className={cn(
                      "h-11 rounded-full px-4",
                      category === selectedCategory
                        ? "border-zinc-400 bg-zinc-800 text-zinc-100"
                        : "border-zinc-800 text-zinc-500",
                    )}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCategoryTouched(true);
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-col gap-5 overflow-y-auto px-4 pb-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="sheet-price" className="text-sm text-muted-foreground">
                Preço
              </label>
              <Input
                id="sheet-price"
                inputMode="decimal"
                placeholder="0,00"
                value={priceText}
                onChange={(e) => {
                  setPriceText(e.target.value);
                  setPriceError(null);
                }}
                className="h-11 text-base"
              />
              {suggestedFromHistory && (
                <p className="text-xs text-muted-foreground">
                  Último preço pago: {formatBRL(suggestedPriceCents)}
                </p>
              )}
              {priceError !== null && (
                <p role="alert" className="text-sm text-destructive">
                  {priceError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Quantidade</span>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-11"
                  aria-label="Diminuir quantidade"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                >
                  <Minus />
                </Button>
                <span className="min-w-8 text-center text-lg font-semibold tabular-nums">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-11"
                  aria-label="Aumentar quantidade"
                  disabled={quantity >= 999}
                  onClick={() => setQuantity((current) => Math.min(999, current + 1))}
                >
                  <Plus />
                </Button>
              </div>
            </div>
          </div>
        )}

        <DrawerFooter>
          {isEdit ? (
            <>
              <Button
                type="button"
                className="h-12 bg-emerald-600 text-base font-semibold text-zinc-950 hover:bg-emerald-500"
                onClick={handleSave}
              >
                Salvar
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="h-11"
                onClick={() => {
                  if (item) onRemove(item.id);
                }}
              >
                Remover item
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                className="h-12 bg-emerald-600 text-base font-semibold text-zinc-950 hover:bg-emerald-500"
                onClick={handleConfirm}
              >
                Adicionar ao carrinho
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-11"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
