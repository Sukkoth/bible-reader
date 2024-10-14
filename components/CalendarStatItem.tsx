"use client";

import { ReactNode } from "react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Props = {
  text?: number | string;
  target: number;
  progress: number;
  rangeColor?: boolean;
  strokeWidth?: number;
  children?: ReactNode;
  startWithRed?: boolean; //when you want to show today as red since it's on trial and also the past dates
};
function CalendarStatItem({
  target,
  progress,
  text,
  rangeColor,
  strokeWidth = 5,
  children,
  startWithRed,
}: Props) {
  const percentage = Math.round((progress / target) * 100) || 0;
  let pathColor = "";
  let strokeColor = "";

  if (rangeColor) {
    if (percentage > 90) {
      // Vibrant green for almost fully completed
      pathColor = "hsl(120, 70%, 40%)";
    } else if (percentage > 75) {
      // Green-yellow for good progress
      pathColor = "hsl(90, 70%, 50%)";
    } else if (percentage > 50) {
      // Bright orange for moderate progress
      pathColor = "hsl(30, 90%, 55%)";
    } else if (startWithRed && percentage > 25) {
      // Clear orange for some progress after start
      pathColor = "hsl(30, 55%, 55%)";
    } else if (startWithRed && percentage <= 25) {
      // Bold, saturated red for barely started tasks
      pathColor = "hsl(0, 85%, 50%)";
    } else {
      // Neutral grey for not started tasks
      pathColor = "hsl(0, 0%, 65%)";
    }
    strokeColor = pathColor.replace(")", ", 0.2)"); //add opacity to the pathColor to get stroke color
  } else {
    pathColor = "hsl(var(--primary))";
    strokeColor = "hsl(var(--primary-foreground))";
  }

  return (
    <div className='hover:bg-secondary rounded-full cursor-pointer'>
      <CircularProgressbarWithChildren
        value={percentage}
        // text={`${text}`}
        strokeWidth={strokeWidth}
        styles={{
          trail: {
            stroke: strokeColor,
          },
          path: {
            stroke: pathColor,
          },
          text: {
            stroke: "hsl(var(--secondary-foreground))",
            strokeWidth: 0.5,
          },
        }}
      >
        {children ? children : <p className='text-xs'>{text || ""}</p>}
      </CircularProgressbarWithChildren>
    </div>
  );
}

export default CalendarStatItem;
