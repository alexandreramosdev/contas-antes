import { AddItemInput } from "@/components/AddItemInput";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="relative font-sans min-h-screen pb-32">
      <Header />
      <AddItemInput />
    </div>
  );
}
