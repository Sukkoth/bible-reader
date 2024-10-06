"use client";
import React from "react";
import BackButton from "@/components/BackButton";
import { Label } from "@/components/ui/label";
import { books } from "@/lib/bible_books_list";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import PlanDetailItem from "@/components/PlanDetailItem";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format, formatDuration, intervalToDuration } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BookMarked,
  Minus,
  PlusIcon,
  Hourglass,
  Send,
  NotebookText,
  BookOpenText,
} from "lucide-react";
import type { CreatePlanSchedule } from "@/utils/supabase/services";
import { GenerateScheduleDataForDb } from "@/utils/generateScheduleData";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { Checkbox } from "@/components/ui/checkbox";

function CreatePlanSchedule() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { planId } = useParams();
  const selectionRef = useRef<string[]>(
    JSON.parse(searchParams.get("books") || "[]")
  ); //to not re-render expensive list of bible books
  const [selected, setSelected] = useState<string[]>([]);
  const [showTime, setShowTime] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [chapterCount, setChapterCount] = useState(
    parseInt(searchParams.get("perDay") || "1")
  );

  // const handleAddPlanToDb = useCreatePlanSchedule();
  const handleAddPlanToDb = useFetch<{ plan: UserPlan }>(
    `/api/plans/schedule/${planId}`,
    false
  );

  function handleSelected() {
    setSelected(selectionRef.current);
    setShowTime(true);
  }

  const selectedBooksDetail = books.filter(({ book: bookName }) =>
    selected.includes(bookName)
  );

  const totalBooks = selectedBooksDetail.reduce(
    (acc, curr) => {
      return {
        books: acc.books + 1,
        chapters: acc.chapters + curr.chapters,
        verses: acc.verses + curr.verses,
      };
    },
    { chapters: 0, verses: 0, books: 0 }
  );

  useEffect(() => {
    //whenever chapter count and startDay change, push back the end date
    if (startDate)
      setEndDate(
        addDays(
          startDate,
          Math.ceil(totalBooks.chapters / chapterCount) - 1 || 0
        )
      );
  }, [chapterCount, startDate]);

  useEffect(() => {
    if (handleAddPlanToDb?.data?.plan?.id) {
      router.replace(`/plans/${handleAddPlanToDb?.data?.plan?.id}`);
    }
  }, [handleAddPlanToDb.data]);

  async function handleGenerateData() {
    if (startDate && endDate && planId) {
      const parsedData = GenerateScheduleDataForDb({
        selectedBooks: selected,
        startDate,
        endDate,
        chapterCount,
        planId: planId as string,
        totalBooks: totalBooks.books,
        totalChapters: totalBooks.chapters,
      });

      await handleAddPlanToDb.fetchData({
        body: JSON.stringify(parsedData),
        method: "post",
      });
    }
  }

  return (
    <div className=''>
      <BackButton onClick={showTime ? () => setShowTime(false) : undefined} />
      <div className='pt-5'>
        <h1 className='text-2xl xs:text-3xl'>Create Schedule</h1>
        <p className='text-sm'>* Select Books to read </p>
        <p className='text-sm'>
          * Books are added to list according to select order
        </p>
        {handleAddPlanToDb.error?.message && (
          <p className='text-sm pb-1 text-red-400'>
            {handleAddPlanToDb.error?.message}
          </p>
        )}
        {!showTime && (
          <div className='pt-5 grid grid-cols-2'>
            <h2 className='font-medium text-xl col-span-2'>Old Testament</h2>
            {books.map((book, index) => (
              <div key={book.book}>
                {index === 39 && (
                  <h2 className='font-medium text-xl py-2'>New Testament</h2>
                )}
                <div className='py-3 px-3 flex gap-2 text-lg hover:bg-secondary'>
                  <Checkbox
                    id={book.book}
                    className='cursor-pointer'
                    defaultChecked={selectionRef.current.includes(book.book)}
                    onCheckedChange={(checked: boolean) =>
                      checked
                        ? selectionRef.current.push(book.book)
                        : selectionRef.current.splice(
                            selectionRef.current.indexOf(book.book),
                            1
                          )
                    }
                  />
                  <Label htmlFor={book.book} className='cursor-pointer'>
                    {book.book}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showTime && (
          <Button
            size={"lg"}
            className='w-full my-5'
            onClick={() => {
              handleSelected();
              setStartDate(new Date());
              setChapterCount(parseInt(searchParams.get("perDay") || "1"));
            }}
          >
            Select Marked
          </Button>
        )}
        {showTime && (
          <div className='mt-10'>
            <div className='grid grid-cols-3 gap-3'>
              <PlanDetailItem
                header='Books'
                subText={`${totalBooks?.books}`}
                icon={<BookMarked size={20} />}
              />
              <PlanDetailItem
                header='Chapters'
                subText={`${totalBooks.chapters}`}
                icon={<NotebookText size={20} />}
              />
              <PlanDetailItem
                header='Verses'
                subText={`${totalBooks.verses}`}
                icon={<BookOpenText size={20} />}
              />
            </div>
            <Card className='mt-10 px-2 '>
              <CardHeader className='text-xl'>
                Plan your reading schedule
                <CardDescription className='pt-2'>
                  You can select your start date (defaults to today) and your
                  end date. You can use thevcounter to adjust how many chapters
                  you want to read per day and the end date will calculated
                  according to it.
                  <span className='block border px-2 py-3 rounded-sm mt-3'>
                    ⚠️ Minimim is 1 chapter a day
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-5'>
                  <div className='space-y-5'>
                    <div className='flex flex-col gap-2'>
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size={"lg"}
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {startDate ? (
                              format(startDate, "PPP")
                            ) : (
                              <span>Pick Start Date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            disabled={(date) => date < addDays(new Date(), -1)}
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className='flex justify-center'>
                    <div className='flex items-center gap-4'>
                      <Button
                        size={"icon"}
                        variant={"outline"}
                        className='rounded-full size-10'
                        disabled={chapterCount === 1}
                        onClick={() => setChapterCount((prev) => prev - 1)}
                      >
                        <Minus />
                      </Button>
                      <div className=''>
                        <h1 className='text-5xl font-medium w-16 text-center'>
                          {chapterCount.toFixed(0)}
                        </h1>
                        <p className='text-[10px] text-secondary-foreground dark:text-stone-400 text-stone-700'>
                          {` chapter${chapterCount > 1 ? "s" : ""}/day`}
                        </p>
                      </div>

                      <Button
                        size={"icon"}
                        variant={"outline"}
                        className='rounded-full size-10'
                        disabled={chapterCount === totalBooks.chapters}
                        onClick={() => setChapterCount((prev) => prev + 1)}
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-3 mt-5 gap-3'>
                  <PlanDetailItem
                    header='Per Day'
                    subText={`${chapterCount} Chapters`}
                    icon={<BookMarked size={20} />}
                  />
                  {startDate && (
                    <PlanDetailItem
                      header='Starts'
                      subText={`${format(startDate, "MMM d,y")}`}
                      icon={<Send size={20} />}
                      // icon={<BookMarked size={20} />}
                    />
                  )}
                  {endDate && (
                    <PlanDetailItem
                      header='Ends'
                      subText={`${format(endDate, "MMM d,y")}`}
                      icon={<Hourglass size={20} />}
                      // icon={<BookMarked size={20} />}
                    />
                  )}
                </div>
                {startDate && endDate && (
                  <p className='text-center text-sm mt-5'>
                    You will finish this plan in{" "}
                    {formatDuration(
                      intervalToDuration({
                        start: addDays(startDate, -1),
                        end: endDate,
                      })
                    )}
                  </p>
                )}
              </CardContent>
            </Card>

            <Button
              size={"lg"}
              className='w-full my-5'
              variant={"outline"}
              onClick={() => setShowTime(false)}
            >
              Back to book selection
            </Button>
            <Button
              size={"lg"}
              disabled={handleAddPlanToDb.isPending}
              className='w-full'
              onClick={handleGenerateData}
            >
              {handleAddPlanToDb.isPending
                ? "Generating . . ."
                : "Generate Plan"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePlanSchedule;
