import React from "react";
import CalendarStatItem from "../CalendarStatItem";
import { spartanFont } from "@/lib/fonts";

type Props = {
  target: number;
  progress: number;
  label: string;
};
function StatProgressItem({ target, progress, label }: Props) {
  return (
    <div className='flex flex-col items-center mt-3 p-1'>
      <CalendarStatItem target={target} progress={progress} strokeWidth={4}>
        <div
          className={`flex items-center justify-center text-xl font-bold ${spartanFont.className}`}
        >
          {((progress / target) * 100).toFixed(2) || "0.00"}%
        </div>
      </CalendarStatItem>
      <h1 className='text-center mt-3 text-wrap w-[75%] text-sm'>{label}</h1>
    </div>
  );
}

export default StatProgressItem;
