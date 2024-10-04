import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoader() {
  return (
    <div className='flex flex-col h-full flex-grow items-center justify-center'>
      <Card className='w-full bg-transparent'>
        <CardHeader>
          <Skeleton className='h-14' />
          <Skeleton className='h-4 mt-3' />
        </CardHeader>
        <CardContent>
          <div>
            <Skeleton className='h-4 w-1/2' />
            <Skeleton className='h-12 mt-3' />
          </div>
          <div className='mt-5'>
            <Skeleton className='h-4 w-1/2' />
            <Skeleton className='h-12 mt-3' />
          </div>
          <Skeleton className='float-end w-1/2 h-4 mt-6' />
          <Skeleton className='h-14 mt-16' />
        </CardContent>
      </Card>
      <Card className='w-full bg-transparent mt-10'>
        <CardHeader>
          <Skeleton className='h-4 mx-5' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-12' />
        </CardContent>
      </Card>

      <div className='w-full px-10'>
        <Skeleton className='h-4 w-full mt-7' />
      </div>
    </div>
  );
}
