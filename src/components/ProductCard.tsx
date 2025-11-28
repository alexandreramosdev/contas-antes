import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Checkbox } from "@/src/components/ui/checkbox";
import { ItemProps } from "../types";

export const ProductCard = ({ id, name }: ItemProps) => {
  return (
    <Card key={id} className="my-2 py-4 border-zinc-800 bg-zinc-900">
      <CardContent className="flex flex-row itens-center flex-between gap-2 ">
        <Checkbox className="rounded-full w-6 h-6" />
        <span className="w-full pl-4 text-zinc-100">{name}</span>
        <Badge variant="outline" className="text-zinc-500">
          R$ 15,99
        </Badge>
      </CardContent>
    </Card>
  );
};
