import { Link } from "react-router-dom";
import { IoBookOutline } from "react-icons/io5";
import { IoAlarmSharp } from "react-icons/io5";
import { Separator } from "./ui/separator";

type Props = {
  duration: number;
  title: string;
  description: string;
  quantifier: string;
  queryParam?: string;
  img?: string;
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
      to={`/plans/create/schedule/${queryParam}`}
      className='border my-3 border-stone-200 dark:border-stone-700 hover:bg-secondary cursor-pointer px-2 py-2 rounded-xl flex items-center'
    >
      <img
        src={
          img ||
          `https://hips.hearstapps.com/hmg-prod/images/an-open-bible-royalty-free-image-1681152546.jpg?resize=1200:*`
        }
        alt='plan-img'
        className='size-20 object-cover me-5'
      />
      <div className='w-full pe-5'>
        <div>
          <h3>{title}</h3>
          <p className='text-xs pt-1 line-clamp-3'>{description}</p>
          <Separator className='my-3' />
          <div className='flex items-center justify-between'>
            <div className='rounded-lg p-1 flex gap-2'>
              <IoAlarmSharp />
              <p className='text-xs text-center'> {duration} days</p>
            </div>
            <Separator orientation='vertical' className='h-[1rem]' />
            <div className='text-xs flex items-center gap-2'>
              <IoBookOutline />
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
