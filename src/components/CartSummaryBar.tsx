import { CheckCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { formatBRL } from "@/src/lib/currency";

interface CartSummaryBarProps {
  cartCount: number;
  cartTotalCents: number;
  onNewPurchase: () => void;
}

export const CartSummaryBar = ({
  cartCount,
  cartTotalCents,
  onNewPurchase,
}: CartSummaryBarProps) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-800 bg-zinc-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-md items-center justify-between gap-4 px-4 py-3">
        <div>
          <p className="text-xs text-zinc-500">
            {cartCount === 1 ? "1 item no carrinho" : `${cartCount} itens no carrinho`}
          </p>
          <p className="text-lg font-semibold text-emerald-500 tabular-nums" aria-live="polite">
            {formatBRL(cartTotalCents)}
          </p>
        </div>
        <Button
          type="button"
          className="h-11 gap-1.5 bg-emerald-600 px-4 font-semibold text-zinc-950 hover:bg-emerald-500"
          onClick={onNewPurchase}
        >
          <CheckCheck />
          Nova Compra
        </Button>
      </div>
    </div>
  );
};
