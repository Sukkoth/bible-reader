type Props = {
  icon: React.ReactNode;
  header: string;
  subText: string;
};

function PlanDetailItem({ icon, header, subText }: Props) {
  return (
    <div className='border flex flex-col items-center p-3 justify-center rounded-lg hover:bg-secondary cursor-pointer transition-colors duration-300 select-none'>
      {icon}
      <div className='flex flex-col items-center pt-2 text-center'>
        <p className='text-xs text-stone-400'>{header}</p>
        <p className='text-sm'>{subText}</p>
      </div>
    </div>
  );
}

export default PlanDetailItem;
