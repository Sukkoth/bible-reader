import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className='size-10' />
      <Skeleton className='h-12 w-full mt-4' />
      <Separator className='my-5' />
      <div className=''>
        <Skeleton className='w-1/2 h-10' />
      </div>
      <div className='space-y-2 mt-2'>
        <Skeleton className='w-full h-3' />
        <Skeleton className='w-full h-3' />
        <Skeleton className='w-full h-3' />
        <Skeleton className='w-1/2 h-3' />
      </div>
      <div className='space-y-3 mt-3'>
        <Skeleton className='h-36 w-full' />
        <Skeleton className='h-36 w-full' />
        <Skeleton className='h-36 w-full' />
      </div>
    </div>
  );
}
