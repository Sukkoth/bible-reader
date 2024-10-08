"use client";

import { ReactNode } from "react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Props = {
  text?: number | string;
  type: "chapters" | "pages" | string;
  target: number;
  progress: number;
  rangeColor?: boolean;
  strokeWidth?: number;
  children?: ReactNode;
};
function CalendarStatItem({
  target,
  progress,
  text,
  rangeColor,
  strokeWidth = 5,
  children,
}: Props) {
  const percentage = Math.round((progress / target) * 100) || 0;
  let pathColor = "";
  let strokeColor = "";

  if (rangeColor) {
    if (percentage > 90) {
      pathColor = "hsl(120, 100%, 40%)";
    } else if (percentage > 75) {
      pathColor = "hsl(60, 100%, 50%)";
    } else if (percentage > 50) {
      pathColor = "hsl(30, 100%, 50%)";
    } else if (percentage > 25) {
      pathColor = "hsl(0, 100%, 50%)";
    } else {
      pathColor = "hsl(0, 0.8928571428571397%, 56.07843137254902%)";
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
