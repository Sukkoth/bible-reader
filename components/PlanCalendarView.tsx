"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  differenceInCalendarDays,
  format,
  isBefore,
  isPast,
  isSameDay,
} from "date-fns";
import { useEffect, useState, useTransition } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { updateScheduleItemStatus } from "@/app/(with_layout)/plans/[planId]/_actions";

type Props = {
  plan: UserPlan;
};
export default function PlanCalendarView({ plan }: Props) {
  const today = new Date();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(
    isBefore(today, plan.startDate)
      ? 0
      : isPast(plan.endDate)
      ? plan.schedules.length - 1
      : differenceInCalendarDays(today, plan.startDate)
  );
  const [selectedDate, setSelectedDate] = useState(current);
  const [isUpdatingScheduleItem, startUpdatingScheduleItem] = useTransition();
  const [updatingIndex, setUpdatingIndex] = useState<{
    scheduleId: string; //to prevent other schedule indexes from following the loading
    index: number; //the get the exact item
  } | null>(null);

  async function onChangeGoalStatus(
    scheduleId: string,
    goalIndex: number,
    checked: boolean
  ) {
    const items = plan.schedules[selectedDate];
    items.items[goalIndex].status = checked ? "COMPLETED" : "PENDING";
    setUpdatingIndex({
      scheduleId: scheduleId,
      index: goalIndex,
    });
    startUpdatingScheduleItem(async () => {
      await updateScheduleItemStatus({ scheduleId, items });
      //write a sleep mock using timeout
      setUpdatingIndex(null);
    });
  }

  useEffect(() => {
    if (!api) {
      return;
    }

    api.scrollTo(current);

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api, current]);

  useEffect(() => {
    setCurrent(selectedDate);
  }, [selectedDate]);

  return (
    <div className='overflow-hidden'>
      <Carousel
        opts={{
          align: "start",
          containScroll: false,
        }}
        setApi={setApi}
      >
        {isBefore(today, plan.startDate) && (
          <div className='border px-2 py-3 mb-8 rounded-sm mt-3 text-sm flex items-center gap-2'>
            <span className='w-1/4 text-center text-xl'>⚠️</span>{" "}
            <span>
              This plan is yet to start, take a look at it but you will start it
              on {format(plan.startDate, "dd/MM/Y")}
            </span>
          </div>
        )}
        <CarouselContent className='ml-1 w-[150px] xs:w-[280px]'>
          {plan.schedules.map((schedule, index) => {
            const parsedDate = schedule.date;
            return (
              <CarouselItem
                key={index}
                className={`basis-full xxs:basis-1/2 xs:basis-1/3 cursor-pointer border pl-0 dark:hover:border-white hover:border-stone-900 transition-all duration-300 ${
                  selectedDate === index
                    ? "border-stone-900 dark:border-white"
                    : "border-secondary dark:border-stone-700 border-stone-200"
                }`}
                onClick={() => {
                  setSelectedDate(index);
                }}
              >
                <Card
                  className={`rounded-none shadow-none text-secondary-foreground  ${
                    isSameDay(parsedDate, today)
                      ? `bg-primary hover:bg-primary/90 text-white`
                      : `bg-secondary`
                  } border-none`}
                >
                  <CardContent className='flex items-center justify-center p-6 flex-col'>
                    <CalendarDays size={20} />
                    <span className='text-sm pt-2 font-semibold'>
                      {format(parsedDate, "do")}
                    </span>
                    <span className='text-xs pt-1'>
                      {format(parsedDate, "MMMM")}
                    </span>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <Separator className='my-5' />
      <div className='space-y-2'>
        {plan.schedules[selectedDate] &&
          plan.schedules[selectedDate].items.map((item, index) => (
            <CalendarViewItem
              key={item.goal}
              scheduleId={plan.schedules[selectedDate].id}
              index={index}
              item={item}
              onChange={onChangeGoalStatus}
              isUpdating={
                isUpdatingScheduleItem &&
                updatingIndex?.index === index &&
                updatingIndex?.scheduleId === plan.schedules[selectedDate].id //this part prevents items on the left and right dates with the same index, to show loading status
              }
            />
          ))}
      </div>
    </div>
  );
}

function CalendarViewItem({
  item,
  onChange,
  scheduleId,
  index,
  isUpdating,
}: {
  item: ScheduleItem;
  index: number;
  scheduleId: string;
  onChange: (scheduleId: string, goalIndex: number, checked: boolean) => void;
  isUpdating: boolean;
}) {
  return (
    <div className='flex gap-2 items-center'>
      {isUpdating ? (
        <Loader2 className='animate-spin size-4' />
      ) : (
        <Checkbox
          id={item.goal}
          className='cursor-pointer border-gray-500 data-[state=checked]:bg-gray-500 dark:border-white dark:data-[state=checked]:bg-white'
          defaultChecked={item.status === "COMPLETED"}
          onCheckedChange={(checked) =>
            onChange(scheduleId, index, Boolean(checked))
          }
        />
      )}
      <Label htmlFor={item.goal} className='text-sm'>
        {item.goal}
      </Label>
    </div>
  );
}
