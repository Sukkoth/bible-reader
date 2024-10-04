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
  isSameDay,
} from "date-fns";
import { useEffect, useState } from "react";
import { TbCalendarStats } from "react-icons/tb";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { useUpdateScheduleItemStatus } from "@/react-query/mutations";
import { Checkbox } from "./ui/checkbox";

type Props = {
  schedules: UserPlan;
  onItemStatusUpdate: () => void;
};
export default function PlanCalendarView({
  schedules,
  onItemStatusUpdate,
}: Props) {
  const today = new Date();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(
    isBefore(today, schedules.startDate)
      ? 0
      : differenceInCalendarDays(today, schedules.startDate)
  );
  const [selectedDate, setSelectedDate] = useState(current);
  const handleStatusChange = useUpdateScheduleItemStatus();

  function onChangeGoalStatus(
    scheduleId: string,
    goalIndex: number,
    checked: boolean
  ) {
    const items = schedules.schedules[selectedDate];
    items.items[goalIndex].status = checked ? "COMPLETED" : "PENDING";

    handleStatusChange.mutate({
      scheduleId,
      items,
    });

    // if all the items in that day are complete, scroll to the next day
    // const complete = items.items?.every((item) => item.status === "COMPLETED");
    // if (complete) {
    //   setSelectedDate(current + 1);
    // }
    //don't think nice for UX but keep it anyway

    onItemStatusUpdate();
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
        {isBefore(today, schedules.startDate) && (
          <div className='border px-2 py-3 mb-8 rounded-sm mt-3 text-sm flex items-center gap-2'>
            <span className='w-1/4 text-center text-xl'>⚠️</span>{" "}
            <span>
              This plan is yet to start, take a look at it but you will start it
              on {format(schedules.startDate, "dd/MM/Y")}
            </span>
          </div>
        )}
        <CarouselContent className='ml-1 w-[150px] xs:w-[280px]'>
          {schedules.schedules.map((schedule, index) => {
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
                    <TbCalendarStats size={20} />
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
        {schedules.schedules[selectedDate].items.map((item, index) => (
          <CalendarViewItem
            key={item.goal}
            scheduleId={schedules.schedules[selectedDate].id}
            index={index}
            item={item}
            onChange={onChangeGoalStatus}
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
}: {
  item: ScheduleItem;
  index: number;
  scheduleId: string;
  onChange: (scheduleId: string, goalIndex: number, checked: boolean) => void;
}) {
  return (
    <div className='flex gap-2 items-center'>
      <Checkbox
        id={item.goal}
        className='checked:bg-secondary'
        defaultChecked={item.status === "COMPLETED"}
        onCheckedChange={(checked) =>
          onChange(scheduleId, index, Boolean(checked))
        }
      />
      <Label htmlFor={item.goal} className='text-sm'>
        {item.goal}
      </Label>
    </div>
  );
}
