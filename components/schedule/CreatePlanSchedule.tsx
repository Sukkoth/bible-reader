"use client";
import React, { ReactNode } from "react";
import BackButton from "@/components/BackButton";
import { Label } from "@/components/ui/label";
import { books, categorizedBooks } from "@/lib/bible_books_list";
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
  ChevronDown,
} from "lucide-react";
import type { CreatePlanSchedule } from "@/utils/supabase/services";
import * as GeneratePlanSchedule from "@/utils/generateScheduleData";
import { useParams, useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "../ui/separator";

type Props = {
  showBooks: boolean;
  selected: string[][];
  books: string[];
  perDay: number;
  customizable: boolean;
  userMade: boolean;
  template: Template;
};

function CreatePlanSchedule(args: Props) {
  const router = useRouter();

  const { planId } = useParams();
  const selectionRef = useRef<string[]>(
    // JSON.parse(searchParams.get("books") || "[]")
    args.books || []
  ); //to not re-render expensive list of bible books
  const [selected, setSelected] = useState<string[]>([]);
  const [showTime, setShowTime] = useState(!args.showBooks);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [chapterCount, setChapterCount] = useState(args.perDay);

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

  //whenever chapter count and startDay change, push back the end date
  useEffect(() => {
    console.log(
      "LENGTH",
      args.selected.flat(1).length / chapterCount,
      args.customizable,
      args.userMade
    );
    if (startDate)
      setEndDate(
        addDays(
          startDate,
          args.customizable
            ? args.userMade
              ? Math.ceil(totalBooks.chapters / chapterCount) - 1 || 0
              : Math.ceil(args.selected.flat(1).length / chapterCount)
            : args.selected.length
        )
      );
  }, [chapterCount, startDate]);

  //ro redirect when the data is created
  useEffect(() => {
    if (handleAddPlanToDb?.data?.plan?.id) {
      router.replace(`/plans/${handleAddPlanToDb?.data?.plan?.id}`);
    }
  }, [handleAddPlanToDb.data]);

  async function handleGenerateData() {
    if (startDate && endDate && planId) {
      //for user made schedules
      let parsedData;

      if (args.userMade)
        parsedData = GeneratePlanSchedule.forUserMade({
          selectedBooks: selected,
          startDate,
          endDate,
          chapterCount,
          planId: planId as string,
          totalBooks: totalBooks.books,
          totalChapters: totalBooks.chapters,
        });
      else if (args.customizable) {
        parsedData = GeneratePlanSchedule.forCustomized(args.selected, {
          selectedBooks: selected,
          startDate,
          endDate,
          chapterCount,
          planId: planId as string,
          totalBooks: args.template.books.length,
          totalChapters: args.template.chaptersCount,
        });
      } else {
        parsedData = GeneratePlanSchedule.forUnCustomized(args.selected, {
          selectedBooks: selected,
          startDate,
          endDate,
          chapterCount,
          planId: planId as string,
          totalBooks: args.template.books.length,
          totalChapters: args.template.chaptersCount,
        });
      }

      //for customizable popular plans
      //type here
      //for non-customizable popular plans
      //type here

      // console.log(parsedData);

      await handleAddPlanToDb.fetchData({
        body: JSON.stringify(parsedData),
        method: "post",
      });
    }
  }

  return (
    <div className=''>
      <BackButton
        onClick={
          args.showBooks && showTime ? () => setShowTime(false) : undefined
        }
      />
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
          <div className='pt-5'>
            {Object.keys(categorizedBooks).map((category: string) => (
              <Collapsible
                title={category}
                key={category}
                checked={categorizedBooks[category].some((book) =>
                  selectionRef.current?.includes(book.book)
                )}
              >
                {categorizedBooks[category].map((book) => (
                  <div
                    className='py-3 px-3 flex gap-2 text-lg hover:bg-secondary'
                    key={book.book}
                  >
                    <Checkbox
                      id={book.book}
                      className='cursor-pointer border-gray-500 data-[state=checked]:bg-gray-500 dark:border-white dark:data-[state=checked]:bg-white'
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
                ))}
              </Collapsible>
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
              setChapterCount(args.perDay);
            }}
          >
            Select Marked
          </Button>
        )}
        {showTime && (
          <div className='mt-10'>
            {args.userMade ? (
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
            ) : (
              <div className='grid grid-cols-2 gap-3'>
                <PlanDetailItem
                  header='Books'
                  subText={`${args.template.books.length}`}
                  icon={<BookMarked size={20} />}
                />
                <PlanDetailItem
                  header={
                    args.template.templateType === "PORTION"
                      ? "Portions"
                      : "Chapters"
                  }
                  subText={`${args.template.chaptersCount}`}
                  icon={<NotebookText size={20} />}
                />
                {/* <PlanDetailItem
                  header='Verses'
                  subText={`${totalBooks.verses}`}
                  icon={<BookOpenText size={20} />}
                /> */}
              </div>
            )}
            <Card className='mt-10 px-2 '>
              <CardHeader className='text-xl'>
                Plan your reading schedule
                <CardDescription className='pt-2'>
                  Select the date you want to start this plan (defaults to
                  today).{" "}
                  {args.customizable &&
                    `You can use the counter to adjust how many chapters
                  you want to read per day and the end date will be calculated
                  according to it.`}
                  {args.userMade && (
                    <span className='block border px-2 py-3 rounded-sm mt-3'>
                      ⚠️ Minimim is 1 chapter a day
                    </span>
                  )}
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
                    {/* they should be visible only for those plans which are customizable */}
                    {args.customizable && (
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
                    )}
                  </div>
                </div>
                <div
                  className={cn(
                    `grid mt-5 gap-3`,
                    { "grid-cols-3": args.userMade },
                    { "grid-cols-2": !args.userMade }
                  )}
                >
                  {args.userMade && (
                    <PlanDetailItem
                      header='Per Day'
                      subText={`${chapterCount} Chapters`}
                      icon={<BookMarked size={20} />}
                    />
                  )}
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

            {args.customizable && (
              <Button
                size={"lg"}
                className='w-full my-5'
                variant={"outline"}
                onClick={() => setShowTime(false)}
              >
                Back to book selection
              </Button>
            )}
            <Button
              size={"lg"}
              disabled={handleAddPlanToDb.isPending}
              className='w-full my-5'
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

function Collapsible({
  children,
  title,
  checked,
}: {
  children: ReactNode;
  title: string;
  checked: boolean;
}) {
  const [expanded, setExpanded] = useState(checked);
  return (
    <div className='mb-3'>
      <div
        onClick={() => setExpanded((prev) => !prev)}
        className='p-3 pe-5 border rounded-md cursor-pointer hover:bg-secondary/50 flex items-center justify-between shadow-sm'
      >
        {title}

        <ChevronDown
          className={`${cn(
            "size-5 duration-300 transition-all",
            expanded ? "rotate-180" : ""
          )}`}
        />
      </div>
      {expanded && children}
    </div>
  );
}
