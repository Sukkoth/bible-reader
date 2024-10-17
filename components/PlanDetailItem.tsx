import { cn } from "@/lib/utils";

type Props = {
  icon: React.ReactNode;
  header: string;
  subText: string;
  variant?: "destructive" | "default";
};

function PlanDetailItem({ icon, header, subText, variant = "default" }: Props) {
  return (
    <div
      className={cn(
        "border flex flex-col items-center p-3 justify-center rounded-lg hover:bg-secondary cursor-pointer transition-colors duration-300 select-none",
        { "text-destructive border-destructive": variant === "destructive" }
      )}
    >
      {icon}
      <div className='flex flex-col items-center pt-2 text-center'>
        <p
          className={cn(
            "text-xs",
            { "text-stone-400": variant === "default" },
            { "text-destructive/50": variant === "destructive" }
          )}
        >
          {header}
        </p>
        <p className='text-sm'>{subText}</p>
      </div>
    </div>
  );
}

export default PlanDetailItem;
