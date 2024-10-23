"use client";

import { resetBibleReadingStats } from "@/app/(with_layout)/bible-tracker/_actions";
import { toast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
function ResetStatsButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleResetStats() {
    startTransition(async () => {
      const res = await resetBibleReadingStats();
      if (res?.success) {
        toast({
          title: "Success!",
          description: "Reading progress reset!",
        });
        setModalOpen(false);
      } else {
        toast({
          title: "Failed to reset",
          description: res?.error || "Could not reset progress",
          variant: "destructive",
          duration: 3000,
        });
      }
    });
  }

  return (
    <AlertDialog open={modalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant='destructive'
          size={"lg"}
          className='w-full'
          onClick={() => setModalOpen(true)}
        >
          {" "}
          Reset Progress
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            By continuing, you{" "}
            <strong className='text-destructive'>reset</strong> your{" "}
            <strong className='text-destructive'>reading progress.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setModalOpen(false)}>
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
              "Reset"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ResetStatsButton;
