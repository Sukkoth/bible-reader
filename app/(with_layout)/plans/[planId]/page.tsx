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
import { GET_PLAN_SCHEDULE } from "@/utils/supabase/services";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

async function Plan({ params }: { params: { planId: string } }) {
  const plan = (await GET_PLAN_SCHEDULE(parseInt(params.planId))) as UserPlan;

  if (!plan) {
    return (
      <>
        <BackButton />
        <div className='flex flex-col items-center justify-center h-screen'>
          <h1 className='text-3xl font-bold mb-4'>No plan found</h1>
        </div>
      </>
    );
  }

  const target = plan.totalChapters;

  const progress = plan.schedules
    .map((schedule) => schedule.items)
    .flat(2)
    .filter((schedule) => schedule.status === "COMPLETED").length;

  const completedPercent = Math.round((progress / target) * 100) || 0;

  const planDetail = [
    {
      icon: <Send className='size-5 sm:size-7 md:size-7' />,
      header: "Started",
      subText: format(plan.startDate, "MMM d,y"),
    },
    {
      icon: <Hourglass className='size-5 sm:size-7 md:size-7' />,
      header: "Ends",
      subText: format(plan.endDate, "MMM d,y"),
    },
    {
      icon: <BookOpenText className='size-5 sm:size-7 md:size-7' />,
      header: "Per Session",
      subText: `${plan.perDay}`,
    },
    {
      icon: <CalendarDays className='size-5 sm:size-7 md:size-7' />,
      header: "Per Week",
      subText: `${plan.perDay * 7} Sessions `,
    },
    {
      icon: <CheckCheck className='size-5 sm:size-7 md:size-7' />,
      header: "Completed",
      subText: `${completedPercent}%`,
    },
    {
      icon: <LayoutDashboard className='size-5 sm:size-7 md:size-7' />,
      header: "Type",
      subText: "Bible Book",
    },
  ];

  return (
    <div className=''>
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
              type='bible'
              strokeWidth={10}
            >
              <h1 className='text-3xl font-bold'>{`${completedPercent}%`}</h1>
            </CalendarStatItem>
          </div>
        </CardHeader>
        <CardContent className='overflow-hidden px-3 sm:px-6 w-fit'>
          <div className='grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 gap-2 mx-auto'>
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
          <PlanCalendarView schedules={plan} />
          <Separator className='my-5' />

          <AlertDialog>
            <AlertDialogTrigger className='w-full'>
              <div className='w-full bg-destructive h-12 rounded-md px-8 flex items-center justify-center text-sm hover:bg-destructive/90 text-white'>
                Delete Plan
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  By continuing, you delete your{" "}
                  <strong className='text-red-500'>plan</strong> and it&apos;s
                  <strong className='text-red-500'> progress</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className='bg-destructive hover:bg-destructive/90'>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

export default Plan;
