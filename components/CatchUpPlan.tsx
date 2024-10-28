"use client";

import { toast } from "@/hooks/use-toast";
import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { catchupPlanSchedule } from "@/app/(with_layout)/plans/[planId]/_actions";

type Props = {
  modalOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  handleOpenChange: (open: boolean) => void;
  scheduleId: number;
  lastInCompleteDate: string;
  daysToAdd: number;
};
function CatchUpPlan({
  modalOpen,
  handleOpenChange,
  scheduleId,
  lastInCompleteDate,
  daysToAdd,
}: Props) {
  const [isPending, startTransition] = useTransition();

  async function handleResetStats() {
    startTransition(async () => {
      const res = await catchupPlanSchedule(
        scheduleId,
        lastInCompleteDate,
        daysToAdd
      );
      if (res?.success) {
        toast({
          title: "Success!",
          description: "Plan rearranged for catchup",
        });
        handleOpenChange(false);
      } else {
        toast({
          title: "Failed!",
          description: res?.error || "Could not re arrange for catch up",
          variant: "destructive",
          duration: 3000,
        });
      }
    });
  }

  return (
    <AlertDialog open={modalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to re-arrange plan?</AlertDialogTitle>
          <AlertDialogDescription>
            By continuing, you{" "}
            <strong className='text-destructive'>update</strong> your plan to
            make room for catching up with your schedule.This will{" "}
            <strong className='text-destructive'>
              update end date of your plan
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className='bg-destructive hover:bg-destructive/90 min-w-32'
            onClick={handleResetStats}
          >
            {isPending ? (
              <span>
                <Loader2 className='size-5 animate-spin' />
              </span>
            ) : (
              "Catchup"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CatchUpPlan;
