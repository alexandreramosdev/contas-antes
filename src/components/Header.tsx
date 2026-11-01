import { formatBRL } from "@/src/lib/currency";

interface HeaderProps {
  estimatedTotalCents: number;
}

export const Header = ({ estimatedTotalCents }: HeaderProps) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 px-4 pt-6 pb-4 backdrop-blur-md">
      <h1 className="text-2xl font-bold tracking-tight">
        Lista de compras <span className="text-emerald-500">.</span>
      </h1>
      <p className="mt-1 text-base text-zinc-500">
        Planejado:{" "}
        <span className="font-medium text-zinc-300 tabular-nums" aria-live="polite">
          {formatBRL(estimatedTotalCents)}
        </span>
      </p>
    </header>
  );
};
