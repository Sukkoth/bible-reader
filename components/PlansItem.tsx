import Link from "next/link";
import CalendarStatItem from "./CalendarStatItem";
import { AlertTriangle, CheckCheck, ChevronRight } from "lucide-react";

type Props = {
  type: "chapters" | "pages" | string;
  target: number;
  progress: number;
  text: string;
  subText: string;
  to: string;
  ended?: boolean;
};
function PlansItem({
  target,
  progress,
  type,
  text,
  subText,
  to,
  ended,
}: Props) {
  const isDone = Math.round((progress / target) * 100) === 100;
  return (
    <Link
      href={to}
      className='border my-3 border-border hover:bg-secondary cursor-pointer px-2 py-2 rounded-xl flex items-center'
    >
      <div className='w-16 me-5 flex justify-center'>
        <CalendarStatItem
          {...{ target, progress, type }}
          text={`${Math.round((progress / target) * 100) || 0}%`}
          rangeColor
        />
      </div>
      <div className='flex items-center justify-between w-full pe-5'>
        <div>
          <h3 className='text-xs xs:text-lg'>{text}</h3>
          <p className='text-xs text-stone-400 pt-1'>{subText}</p>
        </div>
        <div className='rounded-lg p-1 hidden xxs:block'>
          {isDone ? (
            <CheckCheck className='size-5' />
          ) : ended ? (
            <AlertTriangle className='size-5' />
          ) : (
            <ChevronRight className='size-5' />
          )}
        </div>
      </div>
    </Link>
  );
}

export default PlansItem;
