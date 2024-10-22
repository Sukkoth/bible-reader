import React from "react";
import MenuToggleItem from "./MenuToggleItem";

type Displaying = "stats" | "old" | "new";
type Props = {
  // eslint-disable-next-line no-unused-vars
  handleMenuChange: (menu: Displaying) => void;
  displaying: Displaying;
};

function MenuToggle({ displaying, handleMenuChange }: Props) {
  return (
    <div className='flex justify-between p-3'>
      {menuItems.map((menu) => (
        <MenuToggleItem
          active={displaying === menu.set}
          title={menu.title}
          onClick={() => handleMenuChange(menu.set as Displaying)}
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
    title: "Stats",
    set: "stats",
  },
];

export default MenuToggle;
