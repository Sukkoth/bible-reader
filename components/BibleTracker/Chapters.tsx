"use client";

import { MarkChapterBook } from "@/utils/supabase/services";
import { Button } from "../ui/button";
import { useState, useTransition } from "react";
import { markChapter } from "@/app/(with_layout)/bible-tracker/_actions";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Props = {
  length: number;
  progress: BookProgressItem[];
  book: string;
  id?: number;
};
function Chapters({ length, progress, book, id }: Props) {
  const [isUpdating, startTransition] = useTransition();
  const [chapterToUpdate, setChapterToUpdate] = useState<number | null>(null);
  function handleMark(chapter: number) {
    //you only need to store books which has a chapter which is complete
    let dataToPass: MarkChapterBook;
    //if the chapter not in the array, add it
    const foundChapter = progress.findIndex(
      (progressItem) => progressItem.chapter === chapter
    );
    if (foundChapter === -1) {
      dataToPass = {
        id,
        book,
        progress: [...progress, { chapter, status: "COMPLETED" }],
        markAsComplete: false,
      };
    } else {
      //if the chapter in the array, remove it
      dataToPass = {
        id,
        book,
        progress: progress.filter(
          (progressItem) => progressItem.chapter !== chapter
        ),
        markAsComplete: false,
      };
    }
    dataToPass.markAsComplete = dataToPass.progress.length === length;
    setChapterToUpdate(chapter);
    startTransition(async () => {
      const { success, error } = await markChapter(dataToPass);
      if (success) {
        setChapterToUpdate(null);
        if (dataToPass.progress.length === length) {
          toast({
            title: "Book Complete!",
            description: `You have completed reading ${book}!`,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "Could not mark as complete on server",
        });
      }
    });
  }

  return (
    <div className='grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-6 gap-2 p-3'>
      {Array.from({ length }, (_, index) => index + 1).map((chapter) => (
        <Button
          onClick={() => handleMark(chapter)}
          variant={
            progress.length &&
            progress.find((pr: BookProgressItem) => pr.chapter === chapter)
              ?.status === "COMPLETED"
              ? "default"
              : "secondary"
          }
          key={chapter}
          className='size-16 text-xs px-3 hover:scale-110 duration-500 transition-transform'
        >
          {isUpdating && chapterToUpdate === chapter ? (
            <Loader2 className='animate-spin size-4' />
          ) : (
            chapter
          )}
        </Button>
      ))}
    </div>
  );
}

export default Chapters;
