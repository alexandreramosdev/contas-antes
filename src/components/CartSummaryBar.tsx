import { formatBRL } from "@/src/lib/currency";

interface CartSummaryBarProps {
  cartCount: number;
  cartTotalCents: number;
}

export const CartSummaryBar = ({ cartCount, cartTotalCents }: CartSummaryBarProps) => {
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
      </div>
    </div>
  );
};
