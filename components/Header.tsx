export default function Header() {
  return (
    <header className="min-w-full">
      <div className="bg-zinc-900 rounded-2xl p-4">
        <h1 className="text-2xl">Lista de compras</h1>
        <p className="text-base text-zinc-500">
          Planejado: <span>R$ 200,00</span>
        </p>
      </div>
    </header>
  );
}
