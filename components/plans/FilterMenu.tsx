"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

function FilterMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "In Progress";

  function handleFilterChange(filter: string) {
    const params = new URLSearchParams(window.location.search);
    params.set("filter", filter);
    router.replace(`?${params.toString()}`);
  }

  return (
    <div className='flex gap-1 justify-evenly mt-5 text-xs'>
      {menuItems.map((item) => (
        <MenuItem
          label={item.label}
          key={item.label}
          active={item.label === currentFilter}
          onClick={() => handleFilterChange(item.label)}
        />
      ))}
    </div>
  );
}

type MenuItemProp = {
  active?: boolean;
  label: string;
  onClick: () => void;
};
function MenuItem({ active = false, label, onClick }: MenuItemProp) {
  return (
    <Button variant={active ? "secondary" : "ghost"} onClick={onClick}>
      {label}
    </Button>
  );
}

const menuItems = [
  { label: "All" },
  { label: "In Progress" },
  { label: "Paused" },
  { label: "Completed" },
];

export default FilterMenu;
