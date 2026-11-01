import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { formatBRL } from "@/src/lib/currency";
import { cn } from "@/src/lib/utils";
import { Item } from "@/src/types";

interface ProductCardProps {
  item: Item;
  suggestedPriceCents: number | null;
  onToggleCheck: (id: string) => void;
  onEdit: (id: string) => void;
}

export const ProductCard = ({
  item,
  suggestedPriceCents,
  onToggleCheck,
  onEdit,
}: ProductCardProps) => {
  const displayPriceCents = item.priceCents ?? suggestedPriceCents;
  const isSuggestedPrice = item.priceCents === null && suggestedPriceCents !== null;

  return (
    <Card className="my-2 border-zinc-800 bg-zinc-900 py-4">
      <CardContent className="flex flex-row items-center gap-3">
        <Checkbox
          checked={item.checked}
          onCheckedChange={() => onToggleCheck(item.id)}
          aria-label={
            item.checked ? `Desmarcar ${item.name}` : `Adicionar ${item.name} ao carrinho`
          }
          className="relative size-6 shrink-0 rounded-full border-zinc-700 before:absolute before:-inset-2.5 before:content-[''] dark:data-[state=checked]:border-emerald-600 dark:data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:text-zinc-950"
        />
        <button
          type="button"
          onClick={() => onEdit(item.id)}
          className="flex min-w-0 flex-1 flex-col items-start gap-1 text-left"
        >
          <span
            className={cn(
              "w-full text-zinc-100",
              item.checked && "text-zinc-500 line-through",
            )}
          >
            {item.name}
          </span>
          <Badge
            variant="outline"
            className="border-zinc-800 text-[11px] font-normal text-zinc-500"
          >
            {item.category}
          </Badge>
        </button>
        {displayPriceCents !== null && (
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 border-zinc-700 tabular-nums",
              isSuggestedPrice ? "text-zinc-500" : "text-zinc-100",
            )}
          >
            {formatBRL(displayPriceCents)}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
