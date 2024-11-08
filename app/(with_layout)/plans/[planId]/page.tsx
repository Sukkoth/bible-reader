import CalendarStatItem from "@/components/CalendarStatItem";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PlanDetailItem from "@/components/PlanDetailItem";
import PlanCalendarView from "@/components/PlanCalendarView";
import BackButton from "@/components/BackButton";
import { format, isPast } from "date-fns";
import React from "react";

import {
  Hourglass,
  Send,
  CheckCheck,
  CalendarDays,
  BookOpenText,
  LayoutDashboard,
} from "lucide-react";

import { GET_PLAN_SCHEDULE, GET_USER } from "@/utils/supabase/services";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import DeleteSchedule from "@/components/DeleteSchedule";
import { notFound } from "next/navigation";
import Confetti from "@/components/Confetti";
import { spartanFont } from "@/lib/fonts";
import { Metadata } from "next";
import { PlanDetailMenu } from "@/components/PlanDetailMenu";

export const metadata: Metadata = {
  title: "Bible Reader | Plan",
  description:
    "Follow up your created plans each day. Easy to follow up with your schedule",
};

async function Plan({ params }: { params: { planId: string } }) {
  const { user } = await GET_USER().catch();
  const plan = await GET_PLAN_SCHEDULE(parseInt(params.planId));

  if (!plan || user!.id !== plan.userId) {
    return notFound();
  }

  const target = plan.totalChapters;
  const today = format(new Date(), "yyyy-MM-dd");
  let indexToShow: number | null = null;

  let lastIncompletedDate: string | null = null; //date string

  const progress = plan.schedules
    .map((schedule, index) => {
      //get last incomplete date
      //if the date is in the past, not same with today, has PENDING items
      //required for catch up
      if (
        !lastIncompletedDate &&
        schedule.items.some((item) => item.status === "PENDING") &&
        isPast(schedule.date) &&
        today !== schedule.date
      )
        lastIncompletedDate = schedule.date;
      //return the schedule items

      //determine which index to show when user first navigates
      if (schedule.date === today) {
        indexToShow = index;
      }
      return schedule.items;
    })
    .flat(2)
    .filter((schedule) => schedule.status === "COMPLETED").length;

  const completedPercent = Math.round((progress / target) * 100) || 0;

  const planDetail = [
    {
      icon: <Send className='size-5' />,
      header: "Started",
      subText: format(plan.startDate, "MMM d,y"),
    },
    {
      icon: <Hourglass className='size-5' />,
      header: "Ends",
      subText: format(plan.endDate, "MMM d,y"),
    },
    {
      icon: <CheckCheck className='size-5' />,
      header: "Completed",
      subText: `${completedPercent}%`,
    },
    {
      icon: <LayoutDashboard className='size-5' />,
      header: "Type",
      subText: "Bible Book",
    },
  ];

  if (plan.userMade) {
    planDetail.push(
      ...[
        {
          icon: <BookOpenText className='size-5' />,
          header: "Per Session",
          subText: `${plan.perDay}`,
        },
        {
          icon: <CalendarDays className='size-5' />,
          header: "Total",
          subText: `${plan.schedules.length} Sessions`,
        },
      ]
    );
  }

  return (
    <div className='grid grid-[auto_1fr] w-full'>
      <div className='flex justify-between items-center'>
        <BackButton />
        <PlanDetailMenu
          scheduleId={plan.id}
          lastInCompleteDate={lastIncompletedDate}
          planPaused={!!plan.pausedAt}
        />
      </div>
      <div className='w-full md:max-w-[600px] mx-auto h-auto pb-10 grid grid-[auto_1fr]'>
        <div className='pt-5 md:text-center'>
          <h1 className={`text-2xl xs:text-4xl ${spartanFont.className}`}>
            {plan.plans.name}
          </h1>
        </div>
        <Card className=' flex items-center flex-col mt-10 gap-3 sm:w-auto h-full  shadow-none'>
          <CardHeader>
            <div className='w-28 xs:w-40'>
              <CalendarStatItem
                target={target}
                progress={progress}
                strokeWidth={10}
              >
                <h1 className='text-3xl font-bold'>{`${completedPercent}%`}</h1>
              </CalendarStatItem>
              {!plan.completedAt && (
                <Confetti
                  planId={plan.id.toString()}
                  progress={progress}
                  target={target}
                />
              )}
            </div>
          </CardHeader>
          <CardContent className='overflow-hidden px-3 sm:px-6 w-full h-full relative'>
            <div
              className={cn("grid grid-cols-1 xxs:grid-cols-2 gap-2", {
                "xs:grid-cols-3": plan.userMade,
              })}
            >
              {planDetail.map((detail) => (
                <PlanDetailItem {...detail} key={detail.header} />
              ))}
            </div>
            <Separator className='my-5' />
            {lastIncompletedDate && (
              <Alert
                className='mt-5 shadow-md bg-transparent mb-5'
                variant={"destructive"}
              >
                <ExclamationTriangleIcon className='h-4 w-4 animate-pulse' />
                <AlertTitle className='font-bold'>
                  You are behind your schedule
                </AlertTitle>
                <AlertDescription className='text-xs'>
                  Try to read more and be on track or use &quot;catch up&quot;
                  from menu to adjust to your readings{" "}
                </AlertDescription>
              </Alert>
            )}
            {plan.pausedAt && (
              <Alert className='mt-5 shadow-md bg-transparent mb-5'>
                <ExclamationTriangleIcon className='h-4 w-4 animate-pulse' />
                <AlertTitle className='font-bold'>Plan Paused!</AlertTitle>
                <AlertDescription>This plan is paused</AlertDescription>
              </Alert>
            )}
            {isPast(plan.endDate) && (
              <Alert className='mt-5 shadow-md bg-transparent mb-5'>
                <ExclamationTriangleIcon className='h-4 w-4 animate-pulse' />
                <AlertTitle className='font-bold'>Plan Ended!</AlertTitle>
                <AlertDescription>
                  This plan should be completed by now
                </AlertDescription>
              </Alert>
            )}
            <PlanCalendarView {...{ plan }} indexToShow={indexToShow} />{" "}
            {/* you could have made plan={plan} WHY? just to confuse myself :) */}
            <Separator className='my-5' />
            <DeleteSchedule userPlanId={plan.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Plan;
