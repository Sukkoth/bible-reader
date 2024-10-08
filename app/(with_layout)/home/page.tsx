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

async function Home() {
  const { user, profile } = await GET_USER();

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

  if (user?.id && (!profile || !profile?.first_name)) {
    return <h1>PLEASE COMPLETE PROFILE</h1>;
  }

  return (
    <div className='relative overflow-hidden'>
      <div className='pt-5 flex justify-between'>
        <div>
          <h1 className='text-xl xxs:text-2xl xs:text-3xl'>Hello</h1>
          <h1 className='text-xl xxs:text-2xl xs:text-3xl'>
            {profile?.first_name?.split(" ")[0]}👋
          </h1>
          <span className='text-xs'>{new Date().toDateString()}</span>
        </div>
        <Drawer />
      </div>
      <HomeNavButtons />
      <div className='mt-10 mx-auto w-full'>
        <h1 className='text-sm xxs:text-xl xs:text-2xl'>
          {format(new Date(), "MMMM, y")}
        </h1>
        <div className='grid grid-cols-4 xxs:grid-cols-6 xs:grid-cols-8 max-w-[600px] gap-2 pt-3'>
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
            href='plans'
            className='text-stone-400 text-xs hover:underline cursor-pointer'
          >
            View all
          </Link>
        </div>
        {todaysPlans?.length ? (
          todaysPlans.map((plan) => {
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
          })
        ) : (
          <Alert className='mt-5 shadow-md'>
            <ExclamationTriangleIcon className='h-4 w-4 animate-pulse' />
            <AlertTitle className='font-bold'>No plans</AlertTitle>
            <AlertDescription>You got no plans for today</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

export default Home;
