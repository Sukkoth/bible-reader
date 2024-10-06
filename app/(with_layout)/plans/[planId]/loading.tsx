import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function PlanLoading() {
  return (
    <div>
      <Skeleton className='size-10' />
      <div className='pt-5'>
        <Skeleton className='w-1/3 h-12' />
      </div>
      <div className='mt-6 min-h-[75dvh] border rounded-2xl p-5 px-3 sm:px-6 bg-card'>
        <Skeleton className='size-40 mx-auto rounded-full full' />
        <div className='mt-6 grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 gap-2 w-fit mx-auto'>
          <Skeleton className='h-24 sm:size-40' />
          <Skeleton className='h-24 sm:size-40' />
          <Skeleton className='h-24 sm:size-40' />
          <Skeleton className='h-24 sm:size-40' />
          <Skeleton className='h-24 sm:size-40' />
          <Skeleton className='h-24 sm:size-40' />
        </div>
        <Separator className='my-5' />
        <div>
          <div className='flex gap-[2px] cursor-pointer'>
            <Skeleton className='w-1/4 h-32 rounded-none border border-stone-300 dark:border-stone-600' />
            <Skeleton className='w-1/4 h-32 rounded-none border' />
            <Skeleton className='w-1/4 h-32 rounded-none border' />
            <Skeleton className='w-1/4 h-32 rounded-none border' />
          </div>
        </div>
        <Separator className='my-5' />
        <div className='space-y-3'>
          <div className='flex gap-2'>
            <Skeleton className='size-4' /> <Skeleton className='w-1/2 h-4' />
          </div>
          <div className='flex gap-2'>
            <Skeleton className='size-4' /> <Skeleton className='w-1/2 h-4' />
          </div>
          <div className='flex gap-2'>
            <Skeleton className='size-4' /> <Skeleton className='w-1/2 h-4' />
          </div>
        </div>
        <Separator className='my-5' />
        <Skeleton className='w-full h-12 mt-2' />
      </div>
    </div>
  );
}

export default PlanLoading;
