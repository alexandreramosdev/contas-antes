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
import { formatBRL, formatPriceInput, parsePriceToCents } from "@/src/lib/currency";
import { Item } from "@/src/types";

interface ItemSheetProps {
  item: Item | null;
  open: boolean;
  suggestedPriceCents: number | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (priceCents: number, quantity: number) => void;
}

export const ItemSheet = ({
  item,
  open,
  suggestedPriceCents,
  onOpenChange,
  onConfirm,
}: ItemSheetProps) => {
  const initialPriceCents = item?.priceCents ?? suggestedPriceCents ?? null;

  const [priceText, setPriceText] = useState(
    initialPriceCents !== null ? formatPriceInput(initialPriceCents) : "",
  );
  const [quantity, setQuantity] = useState(item?.quantity ?? 1);
  const [error, setError] = useState<string | null>(null);

  const suggestedFromHistory =
    item !== null && item.priceCents === null && suggestedPriceCents !== null;

  const handleConfirm = () => {
    const priceCents = parsePriceToCents(priceText);

    if (priceCents === null) {
      setError("Informe um preço válido, como 15,99");
      return;
    }

    onConfirm(priceCents, quantity);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{item?.name ?? ""}</DrawerTitle>
          <DrawerDescription>
            Informe o preço e a quantidade para adicionar ao carrinho
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-5 px-4 pb-2">
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
                setError(null);
              }}
              className="h-11 text-base"
            />
            {suggestedFromHistory && (
              <p className="text-xs text-muted-foreground">
                Último preço pago: {formatBRL(suggestedPriceCents)}
              </p>
            )}
            {error !== null && (
              <p role="alert" className="text-sm text-destructive">
                {error}
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

        <DrawerFooter>
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
