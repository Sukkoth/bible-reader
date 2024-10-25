"use client";

import { spartanFont } from "@/lib/fonts";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

type Props = {
  question: string;
  answer: string;
};
function FrequentQuestionItem({ question, answer }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div
        className='inline-flex justify-between border-b p-3 pb-1 border-b-white/20 hover:border-b-white/40 text-lg w-full cursor-pointer'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h3 className='text-xl'>{question}</h3>
        <ChevronDown className={`${isOpen ? "rotate-180" : ""} size-4`} />
      </div>
      {isOpen && (
        <p
          className={`${spartanFont.className} ms-4 text-lg px-3 mt-2 border-s-2 rounded-b-lg border-s-[#8bc0915f] border-b-4 border-b-[#8bc0915f]`}
        >
          {answer}
        </p>
      )}
    </div>
  );
}

export default FrequentQuestionItem;
