"use client";

import ListBooks from "@/components/BibleTracker/ListBooks";
import MenuToggle from "@/components/BibleTracker/MenuToggle";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

type Displaying = "stats" | "old" | "new";
type Props = {
  completed: string[];
};
function BibleTracker({ completed }: Props) {
  const [displaying, setDisplaying] = useState<Displaying>("new");
  function handleChangeMenu(menu: Displaying) {
    setDisplaying(menu);
  }

  return (
    <div>
      {/* menu toggle on top*/}
      <MenuToggle displaying={displaying} handleMenuChange={handleChangeMenu} />
      <Separator className='my-5' />
      {/*displaying === stats => list stats */}
      {/* displaying === [old, new] => list books based on 'displayng' */}
      {displaying !== "stats" && (
        <ListBooks displaying={displaying} completed={completed} />
      )}
    </div>
  );
}

export default BibleTracker;
