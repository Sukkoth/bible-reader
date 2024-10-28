"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import CatchUpPlan from "./CatchUpPlan";
import { differenceInCalendarDays } from "date-fns";

type Props = {
  scheduleId: number;
  lastInCompleteDate: string | null;
};

export function PlanDetailMenu({ scheduleId, lastInCompleteDate }: Props) {
  const [showCatchupModal, setShowCatchupModal] = useState(false);

  function handleCatchupModal(open: boolean) {
    setShowCatchupModal(open);
  }

  const daysToAdd = lastInCompleteDate
    ? differenceInCalendarDays(new Date(), lastInCompleteDate)
    : null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <EllipsisVertical className='size-5' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {lastInCompleteDate && (
              <DropdownMenuItem onClick={() => handleCatchupModal(true)}>
                Catchup Plan
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>Pause Plan</DropdownMenuItem>

            <DropdownMenuItem>Update</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
      {lastInCompleteDate && (
        <CatchUpPlan
          scheduleId={scheduleId}
          modalOpen={showCatchupModal}
          handleOpenChange={handleCatchupModal}
          lastInCompleteDate={lastInCompleteDate}
          daysToAdd={daysToAdd!}
        />
      )}
    </>
  );
}
