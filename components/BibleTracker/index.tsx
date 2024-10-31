"use client";

import ListBooks from "@/components/BibleTracker/ListBooks";
import MenuToggle from "@/components/BibleTracker/MenuToggle";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Stats from "./Stats";
import { useSearchParams } from "next/navigation";
import ResetStatsButton from "./ResetStatsButton";

type StatItemProp = {
  oldTestament: number;
  newTestament: number;
  wholeBible: number;
};

type Displaying = "stats" | "old" | "new";
type Props = {
  completed: string[];
  stats: {
    chapters: StatItemProp;
    books: StatItemProp;
  };
};
function BibleTracker({ completed, stats }: Props) {
  const params = useSearchParams();
  const tab = params.get("tab");
  const displaying =
    tab && ["stats", "old", "new"].includes(tab)
      ? (tab as Displaying)
      : "stats";

  return (
    <div className='max-w-[700px] mx-auto'>
      {/* menu toggle on top*/}
      <MenuToggle displaying={displaying} />
      <Separator className='my-5' />
      {/*displaying === stats => list stats */}
      {displaying === "stats" && (
        <>
          <Stats stats={stats} />
          <div className='mt-5'>
            <ResetStatsButton />
          </div>
        </>
      )}
      {/* displaying === [old, new] => list books based on 'displayng' */}
      {displaying !== "stats" && (
        <>
          <ListBooks displaying={displaying} completed={completed} />
        </>
      )}
    </div>
  );
}

export default BibleTracker;
