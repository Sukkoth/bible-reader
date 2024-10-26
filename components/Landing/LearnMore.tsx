"use client";
import { ChevronDown } from "lucide-react";
import React from "react";

function LearnMore() {
  const handleScroll = () => {
    const section = document.getElementById("features");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      onClick={handleScroll}
      className='px-5 border-white-/50 pt-2 bg-card/40 center-all flex-col border border-white/30 animate-pulse rounded-lg absolute bottom-24 text-stone-400 cursor-pointer hover:border-white/50'
    >
      <p className='text-xs'>Learn More</p>
      <ChevronDown className='size-4' />
    </div>
  );
}

export default LearnMore;
