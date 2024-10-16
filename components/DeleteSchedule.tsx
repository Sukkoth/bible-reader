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
      const { status } = await deleteUserPlan(userPlanId);
      if (status === 200) {
        toast({
          description: "Plan Schedule removed!",
        });
        router.replace("/plans");
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
        <div className='w-full bg-destructive h-12 rounded-md px-8 flex items-center justify-center text-sm hover:bg-destructive/90 text-white'>
          Delete Plan
        </div>
      </AlertDialogTrigger>
    </AlertModal>
  );
}

export default DeleteSchedule;