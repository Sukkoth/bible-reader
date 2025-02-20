import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  onClick: () => void;
  active?: boolean;
};
function MenuToggleItem({ title, onClick, active = false }: Props) {
  return (
    <Button
      onClick={onClick}
      variant={"outline"}
      className={cn(
        "border rounded-none h-14 flex flex-col items-center justify-center p-2",
        {
          "dark:bg-stone-800 bg-stone-200": active,
        }
      )}
    >
      {title.split(" ").map((t, index) => (
        <span key={index}>{t}</span>
      ))}
    </Button>
  );
}

export default MenuToggleItem;
