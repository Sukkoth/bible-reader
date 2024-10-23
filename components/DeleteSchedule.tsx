"use client";

import { deleteUserPlan } from "@/app/(with_layout)/plans/[planId]/_actions";
import AlertModal from "./AlertModal";
import { AlertDialogTrigger } from "./ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type Props = {
  userPlanId?: number;
};

function DeleteSchedule({ userPlanId }: Props) {
  const router = useRouter();
  async function handleDeleteSchedule() {
    if (userPlanId) {
      const res = await deleteUserPlan(userPlanId);
      if (res?.status === 200) {
        toast({
          title: "Success!",
          description: "Plan Schedule removed!",
        });
        router.replace("/plans");
      } else {
        toast({
          title: "Failed to delete",
          description: res?.message || "Could not delete the schedule",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  }

  return (
    <AlertModal
      title='Delete plan schedule?'
      description={
        <>
          By continuing, you delete your{" "}
          <strong className='text-destructive'>plan</strong> and it&apos;s
          <strong className='text-destructive'> progress</strong> and this
          action <strong className='text-destructive'>cannot</strong> be
          reversed
        </>
      }
      useConfirmButton
      onConfirm={handleDeleteSchedule}
    >
      <AlertDialogTrigger className='w-full'>
        <div className='w-full bg-red-500 py-3 text-sm text-white hover:bg-red-500/90 rounded-md'>
          Delete Plan
        </div>
      </AlertDialogTrigger>
    </AlertModal>
  );
}

export default DeleteSchedule;
