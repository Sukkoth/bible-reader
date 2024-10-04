"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Compass, Plus } from "lucide-react";

function HomeNavButtons() {
  const router = useRouter();
  return (
    <div className='mt-5 space-y-2'>
      <Button
        size='default'
        className='w-full rounded-3xl py-5'
        onClick={() => router.push("plans/popular")}
      >
        <Compass className='mr-2 h-4 w-4' /> Browse Popular Plans
      </Button>

      <Button
        size='default'
        variant='outline'
        className='w-full rounded-3xl py-5'
        onClick={() => router.push("plans/create")}
      >
        <Plus className='mr-2 h-4 w-4' /> New Plan
      </Button>
    </div>
  );
}

export default HomeNavButtons;
