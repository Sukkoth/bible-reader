"use server";
import { parseBookAndChapterFromGoal } from "@/utils/parseBookAndChapterFromGoal";
import {
  CATCHUP_SCHEDULE,
  DELETE_USER_PLAN,
  MarkPlanGoalData,
  PAUSE_PLAN,
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

export async function catchupPlanSchedule(
  scheduleId: number,
  lastInCompleteDate: string,
  daysToAdd: number
) {
  const result = await CATCHUP_SCHEDULE({
    daysToAdd,
    lastInCompleteDate,
    scheduleId,
  });

  if (result.success) {
    revalidatePath(`/plans/${scheduleId}`);
    return {
      success: true,
    };
  }

  return {
    error: "Something went Wrong",
  };
}

export async function pausePlan(scheduleId: number, pause: boolean) {
  const result = await PAUSE_PLAN(scheduleId, pause);
  if (result?.error) {
    return {
      error: result?.error || "Could not pause this plan",
    };
  }
  revalidatePath(`/plans/${scheduleId}`);
  return result;
}
