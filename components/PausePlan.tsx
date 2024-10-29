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
import { pausePlan } from "@/app/(with_layout)/plans/[planId]/_actions";
import { cn } from "@/lib/utils";

type Props = {
  modalOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  handleOpenChange: (open: boolean) => void;
  scheduleId: number;
  planPaused: boolean;
};
function PausePlan({
  modalOpen,
  handleOpenChange,
  scheduleId,
  planPaused,
}: Props) {
  const [isPending, startTransition] = useTransition();

  async function handleResetStats() {
    startTransition(async () => {
      const res = await pausePlan(scheduleId, !planPaused);
      if (res?.success) {
        toast({
          title: "Success!",
          description: `Plan is ${!planPaused ? "paused" : "resumed"}`,
        });
        handleOpenChange(false);
      } else {
        toast({
          title: "Failed!",
          description:
            res?.error || `Could not ${!planPaused ? "resume" : "pause"} plan`,
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
          <AlertDialogTitle>
            {planPaused
              ? "Are you ready to continue this plan again?"
              : "Are you sure to pause this plan?"}
          </AlertDialogTitle>
          {planPaused && (
            <AlertDialogDescription>
              Welcome back and you will be resuming your plan again to continue
              reading. It will be rearranged for catch up automatically.
            </AlertDialogDescription>
          )}
          {!planPaused && (
            <AlertDialogDescription>
              By continuing, you{" "}
              <strong className='text-destructive'>pause</strong> your plan and
              this wont appear in todays plan section and will not show in the
              progress seciton of homepage.
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              { "bg-destructive hover:bg-destructive/90": !planPaused },
              { "bgprimary hover:bgprimary/90": planPaused },
              "min-w-32"
            )}
            onClick={handleResetStats}
          >
            {isPending ? (
              <span>
                <Loader2 className='size-5 animate-spin' />
              </span>
            ) : planPaused ? (
              "Resume"
            ) : (
              "Pause"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PausePlan;
