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
import PausePlan from "./PausePlan";

type Props = {
  scheduleId: number;
  lastInCompleteDate: string | null;
  planPaused: boolean;
};

export function PlanDetailMenu({
  scheduleId,
  lastInCompleteDate,
  planPaused,
}: Props) {
  const [showCatchupModal, setShowCatchupModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);

  function handleCatchupModal(open: boolean) {
    setShowCatchupModal(open);
  }
  function handlePauseModal(open: boolean) {
    setShowPauseModal(open);
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
            <DropdownMenuItem onClick={() => handlePauseModal(true)}>
              {planPaused ? "Resume Plan" : "Pause Plan"}
            </DropdownMenuItem>

            {/* <DropdownMenuItem>Update</DropdownMenuItem> */}
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

      <PausePlan
        modalOpen={showPauseModal}
        handleOpenChange={handlePauseModal}
        scheduleId={scheduleId}
        planPaused={planPaused}
      />
    </>
  );
}
