import React from "react";
import MenuToggleItem from "./MenuToggleItem";
import { useRouter, useSearchParams } from "next/navigation";

type Displaying = "stats" | "old" | "new";
type Props = {
  displaying: Displaying;
};

function MenuToggle({ displaying }: Props) {
  const params = useSearchParams();
  const router = useRouter();

  const handleUpdateSearchParam = (menu: Displaying) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("tab", menu);
    router.push(`${window.location.pathname}?${newParams.toString()}`);
  };
  return (
    <div className='grid grid-cols-3 p-3 pb-0'>
      {menuItems.map((menu) => (
        <MenuToggleItem
          active={displaying === menu.set}
          title={menu.title}
          onClick={() => handleUpdateSearchParam(menu.set as Displaying)}
          key={menu.title}
        />
      ))}
    </div>
  );
}

const menuItems = [
  {
    title: "Old Testament",
    set: "old",
  },
  {
    title: "New Testament",
    set: "new",
  },
  {
    title: "Overview",
    set: "stats",
  },
];

export default MenuToggle;
