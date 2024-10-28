import BackButton from "@/components/BackButton";
import FilterMenu from "@/components/plans/FilterMenu";
import PlansItem from "@/components/PlansItem";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { GET_PLANS, GET_USER } from "@/utils/supabase/services";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { isPast } from "date-fns";
import Link from "next/link";

type Props = {
  searchParams: { filter: string };
};
async function Plans({ searchParams }: Props) {
  const filter = searchParams.filter || "In Progress";
  const { user } = await GET_USER();
  const plans = await GET_PLANS(user!.id, filter);

  return (
    <div>
      <BackButton />
      <div className='pt-5'>
        <h1 className='text-sm xxs:text-xl xs:text-2xl'>Your Plans</h1>
      </div>
      <div>
        <FilterMenu />
        <Separator className='my-3' />
        {plans?.map((plan, index) => {
          const completed = plan.schedules
            .map((schedule) => schedule.items)
            .flat(2)
            .filter((schedule) => schedule.status === "COMPLETED").length;

          return (
            <PlansItem
              to={`/plans/${plan.id}`}
              target={plan.totalChapters}
              progress={completed}
              type='chapters'
              text={plan?.plans?.name}
              subText={`${plan.totalChapters}  Chapters`}
              key={index}
              ended={isPast(plan.endDate)}
            />
          );
        })}
        {!plans?.length ? (
          <Alert className='mt-5 shadow-md'>
            <ExclamationTriangleIcon className='h-4 w-4 animate-pulse' />
            <AlertTitle className='font-bold'>No plans</AlertTitle>
            <AlertDescription>
              You got no plans yet. Try{" "}
              <strong className='text-primary underline'>
                <Link href={"/plans/create"}>creating</Link>
              </strong>{" "}
              one for yourself and{" "}
              <strong className='text-primary underline'>
                <Link href={"/plans/popular"}>select</Link>
              </strong>{" "}
              from the most popular ones
            </AlertDescription>
          </Alert>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Plans;
