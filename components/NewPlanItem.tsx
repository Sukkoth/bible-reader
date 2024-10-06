import Link from "next/link";
import { Separator } from "./ui/separator";
import { AlarmClock, BookMarked } from "lucide-react";
import Image from "next/image";

type Props = {
  duration: number;
  title: string;
  description: string;
  quantifier: string;
  queryParam?: string;
  img?: string | null;
};
function NewPlanItem({
  duration,
  title,
  description,
  quantifier,
  queryParam,
  img,
}: Props) {
  return (
    <Link
      href={`/schedule/${queryParam}`}
      className='border my-3 border-stone-200 dark:border-stone-700 hover:bg-secondary/50 cursor-pointer px-2 py-2 rounded-xl flex items-center'
    >
      <div className='h-28 relative me-5 border w-28'>
        <Image
          src={
            img ||
            `https://hips.hearstapps.com/hmg-prod/images/an-open-bible-royalty-free-image-1681152546.jpg?resize=1200:*`
          }
          alt='plan-img'
          fill
          className='absolute object-cover'
        />
      </div>
      <div className='w-full pe-5'>
        <div>
          <h3>{title}</h3>
          <p className='text-xs pt-1 line-clamp-3'>{description}</p>
          <Separator className='my-3' />
          <div className='flex items-center justify-between'>
            <div className='text-xs flex items-center gap-2'>
              <AlarmClock className='size-5' />
              <p className='text-xs text-center'> {duration} days</p>
            </div>
            <Separator orientation='vertical' className='h-[1rem]' />
            <div className='text-xs flex items-center gap-2'>
              <BookMarked className='size-5' />
              <p className='text-xs text-center'>
                {" "}
                {quantifier} session{parseInt(quantifier) > 1 ? "s" : ""}/day
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default NewPlanItem;
