import { format } from "date-fns";
import PlansItem from "@/components/PlansItem";

import {
  GET_CURRENT_MONTH_DAILY_PROGRESS,
  GET_TODAYS_PLANS,
  GET_USER,
} from "@/utils/supabase/services";
import Link from "next/link";
import DailyStats from "@/components/DailyStats";
import Drawer from "@/components/Drawer";
import HomeNavButtons from "@/components/HomeNavButtons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import NotificationRequest from "@/components/NotificationRequest";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import DrawerMenu from "@/components/DrawerMenu";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Bible Reader | Home",
  description: "Read your bible, discover the world of amazing grace!",
};
async function Home() {
  const { user, profile } = await GET_USER();

  if (user?.id && (!profile || !profile?.first_name)) {
    redirect("/profile/complete-profile");
  }

  const todaysPlans = await GET_TODAYS_PLANS(user!.id);
  const monthStats = await GET_CURRENT_MONTH_DAILY_PROGRESS(user!.id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toBeMapped: { [key: string]: any } = {};
  let mapped = [];

  if (monthStats) {
    const data = monthStats.map((item) => item.schedules).flat(1);
    data.forEach((schedule) => {
      if (toBeMapped[schedule.date]) {
        toBeMapped[schedule.date].items = [
          ...toBeMapped[schedule.date].items,
          ...schedule.items,
        ];
      } else {
        toBeMapped[schedule.date] = {
          index: parseInt(schedule.date.split("-")[2]),
          date: schedule.date,
          items: schedule.items,
        };
      }
    });
    mapped = Object.values(toBeMapped);
  }

  return (
    <>
      <NotificationRequest />
      <div className='overflow-hidden grid md:grid-cols-[auto_1fr] gap-5'>
        <div className='w-[18rem] dark:bg-card bg-stone-50/90 pt-5 relative hidden md:block rounded-md'>
          <div className='mx-2 flex gap-3 items-center pb-3 mb-5 border-b border-b-stone-300'>
            <Image
              src={"/transparent.png"}
              alt='icon'
              className='dark:invert rounded-full border border-border p-2'
              width={50}
              height={50}
            />
            <h1 className='text-2xl uppercase'>Bible Reader</h1>
          </div>

          <DrawerMenu />
        </div>
        <div>
          <div className='pt-5 flex justify-between'>
            <div>
              <h1 className='text-xl xxs:text-2xl xs:text-3xl'>Hello</h1>
              <h1 className='text-xl xxs:text-2xl xs:text-3xl'>
                {profile?.first_name?.split(" ")[0]}👋
              </h1>
              <span className='text-xs'>{new Date().toDateString()}</span>
            </div>
            <Drawer avatar={profile?.avatar} />
          </div>
          <HomeNavButtons />
          <div className='mt-10 w-full '>
            <h1 className='text-sm xxs:text-xl xs:text-2xl'>
              {format(new Date(), "MMMM, y")}
            </h1>
            <div className='grid grid-cols-4 xxs:grid-cols-6 xs:grid-cols-8 sm:grid-cols-9 lg:grid-cols-11 gap-1 pt-3 select-none'>
              <DailyStats mapped={mapped} />
            </div>

            {/* <p className='pt-2'>
          <span className='text-primary'>+3.2%</span> from last month
        </p> */}
          </div>
          <div className='mt-10'>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-sm xxs:text-xl xs:text-2xl'>
                Today&apos;s plans
              </h1>
              <Link
                prefetch
                href='plans'
                className='text-stone-400 text-xs hover:underline cursor-pointer'
              >
                View all
              </Link>
            </div>

            {todaysPlans?.length ? (
              <div className='mt-3'>
                {todaysPlans.map((plan) => {
                  const target = plan.schedules[0].items.length;
                  const progress = plan.schedules[0].items.filter(
                    (item) => item.status === "COMPLETED"
                  ).length;
                  return (
                    <PlansItem
                      key={plan.id}
                      target={target}
                      progress={progress}
                      type='Chapters'
                      text={plan.plans.name}
                      subText={`${progress}/${target} Chapters`}
                      to={`/plans/${plan.id}`}
                    />
                  );
                })}
              </div>
            ) : (
              <Alert className='mt-5 shadow-md'>
                <ExclamationTriangleIcon className='h-4 w-4 animate-pulse' />
                <AlertTitle className='font-bold'>No plans</AlertTitle>
                <AlertDescription>You got no plans for today</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
