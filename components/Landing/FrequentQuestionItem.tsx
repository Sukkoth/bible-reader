"use client";

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
        <h3>{question}</h3>
        <ChevronDown
          className={`${
            isOpen ? "rotate-180" : ""
          } size-4 transition-transform duration-300`}
        />
      </div>
      {isOpen && (
        <p className={`ms-4 text-sm px-3 mt-2 text-stone-400`}>{answer}</p>
      )}
    </div>
  );
}

export default FrequentQuestionItem;
