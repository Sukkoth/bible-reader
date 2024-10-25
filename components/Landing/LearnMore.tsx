"use client";
import { ChevronDown } from "lucide-react";
import React from "react";

function LearnMore() {
  return (
    <div className='px-14 border-white-/50 pt-2 bg-card/40 center-all flex-col border border-white/30 animate-pulse rounded-lg absolute bottom-10 text-stone-400'>
      <p className='text-sm'>Learn More</p>
      <ChevronDown className=' size-5' />
    </div>
  );
}

export default LearnMore;
