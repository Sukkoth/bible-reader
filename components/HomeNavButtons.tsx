"use client";

import { Compass, Plus } from "lucide-react";
import Link from "next/link";

function HomeNavButtons() {
  return (
    <div className='mt-5 space-y-3'>
      <Link
        href='plans/popular'
        className='w-full text-white rounded-3xl py-[10px] center-all text-sm hover:bg-primary/90 bg-primary'
      >
        <Compass className='mr-2 h-4 w-4' /> Browse Popular Plans
      </Link>
      <Link
        href='plans/create'
        className='w-full rounded-3xl py-[10px] center-all text-sm border border-input bg-background shadow-md hover:bg-accent hover:text-accent-foreground'
      >
        <Plus className='mr-2 h-4 w-4' /> New Plan
      </Link>
    </div>
  );
}

export default HomeNavButtons;
