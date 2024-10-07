"use server";
import {
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
