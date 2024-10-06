import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className='size-10' />
      <div className='pt-5'>
        <Skeleton className='w-1/3 h-12' />
      </div>
      <div className='pt-2'>
        <Skeleton className='my-3 h-14 rounded-xl dark:border' />
        <Skeleton className='my-3 h-14 rounded-xl dark:border' />
        <Skeleton className='my-3 h-14 rounded-xl dark:border' />
        <Skeleton className='my-3 h-14 rounded-xl dark:border' />
      </div>
    </div>
  );
}
