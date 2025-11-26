export const Header = () => {
  return (
    <header className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 pt-8 pb-4 px-4">
      <div className="bg-zinc-900 rounded-2xl p-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Lista de compras <span className="text-emerald-500">.</span>
        </h1>
        <p className="text-base text-zinc-500 mt-1">
          Planejado: <span>R$ 200,00</span>
        </p>
      </div>
    </header>
  );
};
