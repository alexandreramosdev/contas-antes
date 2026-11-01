import { CheckCheck, ShoppingBasket } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface EmptyStateProps {
  variant: "empty" | "all-checked";
  className?: string;
}

export const EmptyState = ({ variant, className }: EmptyStateProps) => {
  const isAllChecked = variant === "all-checked";
  const Icon = isAllChecked ? CheckCheck : ShoppingBasket;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 px-6 py-16 text-center",
        className,
      )}
    >
      <Icon className="size-10 text-zinc-700" aria-hidden />
      <p className="text-lg font-medium text-zinc-300">
        {isAllChecked ? "Tudo comprado!" : "Sua lista está vazia"}
      </p>
      <p className="text-sm text-zinc-500">
        {isAllChecked
          ? "Todos os itens estão no carrinho. Toque em Nova Compra para recomeçar."
          : "Adicione itens acima para planejar suas compras."}
      </p>
    </div>
  );
};
