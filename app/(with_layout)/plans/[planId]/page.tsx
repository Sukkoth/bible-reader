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

async function Plan({ params }: { params: { planId: string } }) {
  const { user } = await GET_USER().catch();
  const plan = await GET_PLAN_SCHEDULE(parseInt(params.planId));

  if (!plan || user!.id !== plan.userId) {
    return notFound();
  }

  const target = plan.totalChapters;

  const progress = plan.schedules
    .map((schedule) => schedule.items)
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
          header: "Per Week",
          subText: `${plan.perDay * 7} Sessions `,
        },
      ]
    );
  }

  return (
    <div>
      <BackButton />
      <div className='pt-5'>
        <h1 className='text-2xl xs:text-3xl'>{plan.plans.name}</h1>
      </div>
      <Card className='flex items-center flex-col mt-10 gap-3 sm:w-auto border'>
        <CardHeader>
          <div className='w-28 xs:w-40'>
            <CalendarStatItem
              target={target}
              progress={progress}
              strokeWidth={10}
            >
              <h1 className='text-3xl font-bold'>{`${completedPercent}%`}</h1>
            </CalendarStatItem>
          </div>
        </CardHeader>
        <CardContent className='overflow-hidden px-3 sm:px-6 w-full'>
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
          {isPast(plan.endDate) && (
            <Alert className='mt-5 shadow-md bg-transparent mb-5'>
              <ExclamationTriangleIcon className='h-4 w-4 animate-pulse' />
              <AlertTitle className='font-bold'>Plan Ended!</AlertTitle>
              <AlertDescription>
                This plan should be completed by now
              </AlertDescription>
            </Alert>
          )}
          <PlanCalendarView {...{ plan }} />{" "}
          {/* you could have mane plan={plan} WHY? just to confuse myself :) */}
          <Separator className='my-5' />
          <DeleteSchedule userPlanId={plan.id} />
        </CardContent>
      </Card>
    </div>
  );
}

export default Plan;
