"use server";
import {
  DELETE_USER_PLAN,
  MarkPlanGoalData,
  UPDATE_SCHEDULE_ITEM_STATUS,
} from "@/utils/supabase/services";
import { revalidatePath } from "next/cache";

export async function updateScheduleItemStatus(goalData: MarkPlanGoalData) {
  try {
    const schedule = await UPDATE_SCHEDULE_ITEM_STATUS(goalData);
    revalidatePath(`/plans/${schedule.id}`);
  } catch (error) {
    console.error("Could not update plan item status", goalData, error);
    return;
  }
}

export async function deleteUserPlan(scheduleId: number) {
  try {
    const { error } = await DELETE_USER_PLAN(scheduleId);
    if (error) {
      return {
        status: 500,
        message: error?.message || "Could not delete plan",
      };
    }
    revalidatePath("/plans");
    return {
      status: 200,
    };
  } catch (error) {
    console.log("Could not delete the schedule item", error);
    return {
      status: 500,
      message: "Could not delete plan",
    };
  }
}
