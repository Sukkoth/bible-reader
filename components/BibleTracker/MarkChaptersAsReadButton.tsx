"use client";
import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { markAllChaptersInBook } from "@/app/(with_layout)/bible-tracker/_actions";

type Props = {
  bookName: string;
  progressId?: number;
};
function MarkChaptersAsReadButton({ bookName, progressId }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleMarkAllChapters() {
    startTransition(async () => {
      const result = await markAllChaptersInBook({ bookName, progressId });
      if (result.success) {
        toast({
          title: "Success.",
          description: `All chapters in ${bookName} marked as read.`,
        });
      } else {
        toast({
          title: "Failed.",
          description: result.error || "Failed to mark all chapters",
        });
      }
    });
  }
  return (
    <Button
      className='w-full mt-5'
      size={"lg"}
      onClick={handleMarkAllChapters}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className='animate-spin size-4' />
      ) : (
        " Mark all as read"
      )}
    </Button>
  );
}

export default MarkChaptersAsReadButton;
