"use client";
import React, { ReactNode } from "react";
import BackButton from "@/components/BackButton";
import { Label } from "@/components/ui/label";
import { books, categorizedBooks } from "@/lib/bible_books_list";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import PlanDetailItem from "@/components/PlanDetailItem";
import { CalendarIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  addDays,
  format,
  formatDuration,
  intervalToDuration,
  isPast,
  isSameDay,
} from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useAptabase } from "@aptabase/react";

type Props = {
  showBooks: boolean;
  selected: string[][];
  books: string[];
  perDay: number;
  customizable: boolean;
  userMade: boolean;
  template?: Template;
};

function CreatePlanSchedule(args: Props) {
  const router = useRouter();

  const { planId } = useParams();
  const selectionRef = useRef<string[]>(args.books || []); //to not re-render expensive list of bible books
  const [selected, setSelected] = useState<string[]>([]);
  const [showTime, setShowTime] = useState(!args.showBooks);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [chapterCount, setChapterCount] = useState(args.perDay);
  const { trackEvent } = useAptabase();

  /**
   * when you first this platform, you might already had a reading plan you were following
   * so you do not need to restart it here
   * first you come and create the plan, but then you set the start date to the date when you first started reading it
   * then you will be given option to set the previous dates (from today) as marked
   * you do not need to sit and mark each and everyone of them as marked,
   */
  const [markPreviousAsComplete, setMarkPreviousAsComplete] = useState(false);

  const handleAddPlanToDb = useFetch<{ plan: UserPlan }>(
    `/api/plans/schedule/${planId}`,
    false //prevent fetch on initial
  );

  function handleSelected() {
    if (selectionRef.current.length === 0) {
      //if no books selected, do not proceed
      toast({
        title: "No books selected",
        description: "Select books you want to read!",
      });
      return;
    }
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
    if (startDate) {
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

      //date-fns makes marks today as past sometimes(based on time) hence using !isSameDay
      if (!isSameDay(new Date(), startDate) && isPast(startDate)) {
        setMarkPreviousAsComplete(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterCount, startDate]);

  //ro redirect when the data is created
  useEffect(() => {
    if (handleAddPlanToDb?.data?.plan?.id) {
      toast({
        title: "Success",
        description: "Your reading schedule is created, REDIRECTING ",
        duration: 4000,
      });
      router.replace(`/plans/${handleAddPlanToDb?.data?.plan?.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          markPreviousAsComplete: markPreviousAsComplete,
        });
      else if (args.customizable) {
        parsedData = GeneratePlanSchedule.forCustomized(args.selected, {
          selectedBooks: selected,
          startDate,
          endDate,
          chapterCount,
          planId: planId as string,
          totalBooks: args!.template!.books.length,
          totalChapters: args!.template!.chaptersCount,
          markPreviousAsComplete: markPreviousAsComplete,
        });
      } else {
        parsedData = GeneratePlanSchedule.forUnCustomized(args.selected, {
          selectedBooks: selected,
          startDate,
          endDate,
          chapterCount,
          planId: planId as string,
          totalBooks: args!.template!.books.length,
          totalChapters: args!.template!.chaptersCount,
          markPreviousAsComplete: markPreviousAsComplete,
        });
      }
      trackEvent("new-plan", {
        planId: planId as string,
        fromTemplate: !!args?.template,
        planNameFromTemplate: args?.template?.plans?.name || "no-template",
      });
      await handleAddPlanToDb.fetchData({
        body: JSON.stringify(parsedData),
        method: "post",
      });
    }
  }

  const daysToFinishPlan = args.customizable
    ? args.userMade
      ? Math.ceil(totalBooks.chapters / chapterCount) - 1 || 0
      : Math.ceil(args.selected.flat(1).length / chapterCount)
    : args.selected.length;

  const dayToFinishIsInPast = isPast(
    addDays(startDate || new Date(), daysToFinishPlan)
  );

  return (
    <div>
      <BackButton
        onClick={
          args.showBooks && showTime ? () => setShowTime(false) : undefined
        }
      />
      <div className='pt-5'>
        <h1 className='text-2xl xs:text-3xl mb-5'>Create Schedule</h1>
        {!showTime ? (
          <>
            <p className='text-sm'>
              * Books are added to list according to select order
            </p>
            <p className='text-sm'>* Select Books to read </p>
          </>
        ) : args?.template ? (
          <Card className='mt-5'>
            <CardHeader>
              <CardTitle className='text-lg'>
                {" "}
                {args.template.plans.name}
              </CardTitle>
              <CardDescription>
                {args.template.plans.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <p className='text-sm'>
              * Choose your schedule * These schedules are meant to be followed
              everyday
            </p>
          </>
        )}
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
          <div className='mt-5'>
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
                  subText={`${args!.template!.books.length}`}
                  icon={<BookMarked size={20} />}
                />
                <PlanDetailItem
                  header={
                    args!.template!.templateType === "PORTION"
                      ? "Portions"
                      : "Chapters"
                  }
                  subText={`${args!.template!.chaptersCount}`}
                  icon={<NotebookText size={20} />}
                />
              </div>
            )}
            <Card className='my-5 px-2'>
              <CardHeader className='text-lg'>
                <CardTitle>Plan your reading schedule</CardTitle>
                <CardDescription className=''>
                  Select the date you want to start this plan.{" "}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-5'>
                  <div className='space-y-5'>
                    <div className='flex flex-col gap-2'>
                      {dayToFinishIsInPast && (
                        <Alert
                          className='shadow-none mb-5'
                          variant={"destructive"}
                        >
                          <ExclamationTriangleIcon className='h-4 w-4 animate-pulse' />
                          <AlertTitle className='font-bold'>
                            Invalid start date
                          </AlertTitle>
                          <AlertDescription>
                            Adjust your start date after you change chapters per
                            day, so that minimum ending date is tomorrow (
                            {format(addDays(new Date(), 1), "EEEE, d")})
                          </AlertDescription>
                        </Alert>
                      )}
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
                            disabled={(date) =>
                              isPast(addDays(date, daysToFinishPlan))
                            }
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className='flex justify-center flex-col items-center'>
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
                    {/* if startDate is in the past, give option to set previous schedules as marked */}
                    {startDate &&
                    !isSameDay(new Date(), startDate) &&
                    isPast(startDate) ? (
                      <div className='inline-flex gap-2 mt-4 self-start border px-3 py-[16px] rounded-sm w-full bg-background'>
                        <Checkbox
                          id={"setPreviousAsMarked"}
                          className='cursor-pointer border-gray-500 data-[state=checked]:bg-gray-500 dark:border-white dark:data-[state=checked]:bg-white'
                          checked={markPreviousAsComplete}
                          onCheckedChange={(checked) =>
                            typeof checked === "boolean" &&
                            setMarkPreviousAsComplete(checked)
                          }
                        />
                        <Label
                          className='cursor-pointer'
                          htmlFor='setPreviousAsMarked'
                        >
                          Set previous schedules as complete
                        </Label>
                      </div>
                    ) : (
                      ""
                    )}
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

                    <PlanDetailItem
                      variant={
                        dayToFinishIsInPast || !startDate
                          ? "destructive"
                          : "default"
                      }
                      header='Starts'
                      subText={`${
                        startDate ? format(startDate, "MMM d,y") : "N/A"
                      }`}
                      icon={<Send size={20} />}
                    />

                    <PlanDetailItem
                      variant={
                        dayToFinishIsInPast || !startDate || !endDate
                          ? "destructive"
                          : "default"
                      }
                      header='Ends'
                      subText={`${
                        startDate && endDate
                          ? format(endDate, "MMM d,y")
                          : "N/A"
                      }`}
                      icon={<Hourglass size={20} />}
                    />
                  </div>
                </div>

                <div>
                  <p
                    className={cn("text-center text-sm pt-5", {
                      "text-destructive":
                        !startDate || !endDate || dayToFinishIsInPast,
                    })}
                  >
                    {startDate && endDate && !dayToFinishIsInPast
                      ? `You will finish this plan in  ${formatDuration(
                          intervalToDuration({
                            start: addDays(startDate, -1),
                            end: endDate,
                          })
                        )}`
                      : "Select Valid start and end dates"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {args.customizable && (
              <Button
                size={"lg"}
                className='w-full mb-5'
                variant={"outline"}
                onClick={() => setShowTime(false)}
              >
                Back to book selection
              </Button>
            )}
            <Button
              size={"lg"}
              disabled={
                handleAddPlanToDb.isPending ||
                !Boolean(startDate) ||
                dayToFinishIsInPast
              }
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
