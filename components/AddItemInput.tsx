import { Plus } from "lucide-react";

export default function AddItemInput() {
  return (
    <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-0 p-4">
      <form
        className="bg-zinc-900 rounded-2xl p-4 w-full flex relative "
        action=""
      >
        <input
          className="w-full border bg-zinc-900 border-zinc-800 rounded-full py-3 px-4 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all "
          type="text"
          name=""
          id=""
          placeholder="Adicionar item..."
        />
        <button className="absolute right-6 top-6 bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-400 p-1.5 rounded-full transition-colors">
          <Plus />
        </button>
      </form>
    </div>
  );
}
