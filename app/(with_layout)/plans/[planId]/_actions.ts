"use server";
import { parseBookAndChapterFromGoal } from "@/utils/parseBookAndChapterFromGoal";
import {
  DELETE_USER_PLAN,
  MarkPlanGoalData,
  UPDATE_SCHEDULE_ITEM_STATUS,
} from "@/utils/supabase/services";
import { revalidatePath } from "next/cache";
import { handleAddItemToReadList } from "../../bible-tracker/_actions";

type GoalDataArgs = MarkPlanGoalData & { goalIndex: number };
export async function updateScheduleItemStatus(goalData: GoalDataArgs) {
  try {
    const schedule = await UPDATE_SCHEDULE_ITEM_STATUS(goalData);

    const scheduleItem = schedule.items[goalData.goalIndex];
    //if the plan as marked as complete, add to tracker
    if (scheduleItem.status === "COMPLETED") {
      //get book and chapter from the plan goal
      const parsed = parseBookAndChapterFromGoal(scheduleItem.goal);

      if (parsed !== null) {
        // add the book and chapter to bible tracker
        const { book, chapter } = parsed;
        await handleAddItemToReadList(book, chapter);
      }
    }
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
