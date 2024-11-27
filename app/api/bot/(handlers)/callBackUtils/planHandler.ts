import { Context } from "grammy";
import {
  calculateProgress,
  handleAnswerCallBack,
  handleCatchUpPlan,
  presentScheduleItems,
} from "../../(utils)/utils";
import { createClient } from "@/utils/supabase/server";
import { format, isAfter, isSameDay } from "date-fns";
import {
  MARK_PLAN_AS_COMPLETE,
  UPDATE_SCHEDULE_ITEM_STATUS,
} from "@/utils/supabase/services";

export async function planHandler(ctx: Context) {
  //already handled this condition on top level
  const callBackData = ctx!.callbackQuery!.data!;
  const supabase = createClient();

  const planId = callBackData.split("-")[1];

  //!catchup here
  const executeCatchUp = callBackData.split("-")?.[3];
  if (executeCatchUp === "catchup") {
    const result = await handleCatchUpPlan({
      lastIncompletePage: parseInt(callBackData.split("-")?.[2]),
      planId: parseInt(planId),
    });

    if (result?.error) {
      await ctx.reply("⚠️ Could not execute catch up plan, try again.");
    } else {
      await ctx.reply("Plan rearranged and updated!");
    }
  }

  try {
    const { data, error } = await supabase
      .from("userPlans")
      .select("*, plans(*), schedules(*)")
      .order("id", { referencedTable: "schedules" })
      .eq("id", planId)
      .single();

    if (error) {
      throw new Error("No plan found");
    }
    const plan = data as UserPlan;

    //if there is page it means you are on a specific list
    const thereIsPage = callBackData.split("-")?.[2];
    let page: number | null = null; //null is to show you have to search for todays item

    if (thereIsPage) {
      page = parseInt(thereIsPage);
    }

    let itemToShow: Schedule | undefined;
    const today = new Date();
    const schedulesCount = plan.schedules.length;

    if (page === 0 || !!page) {
      if (page > schedulesCount) {
        page = schedulesCount - 1;
      }
      itemToShow = plan.schedules[page];
    } else {
      //say the plan has no schedule for today, show the nearest (after) day to it
      itemToShow = plan.schedules.find((item, index) => {
        if (isSameDay(today, item.date) || isAfter(item.date, today)) {
          page = index;
          return item;
        }
      });
      //if the plan has ended, show the last item from the schedules
      if (!itemToShow) {
        itemToShow = plan.schedules[schedulesCount - 1];
        page = schedulesCount - 1;
      }
    }

    if (!itemToShow) {
      await handleAnswerCallBack(ctx);
      await ctx.reply("No item found");
      return;
    }

    //! update item here
    const indexToUpdate = callBackData.split("-")?.[3];
    if (indexToUpdate && indexToUpdate !== "catchup") {
      itemToShow.items[parseInt(indexToUpdate)].status =
        itemToShow.items[parseInt(indexToUpdate)].status === "COMPLETED"
          ? "PENDING"
          : "COMPLETED";

      await UPDATE_SCHEDULE_ITEM_STATUS({
        scheduleId: itemToShow.id,
        items: itemToShow,
      }).catch((error) => {
        //reset incase it fails
        itemToShow.items[parseInt(indexToUpdate)].status =
          itemToShow.items[parseInt(indexToUpdate)].status === "COMPLETED"
            ? "PENDING"
            : "COMPLETED";
        console.log("Could not update goal", error);
      });
    }

    const { progress, lastIncompletePage } = calculateProgress(
      plan.schedules,
      plan.totalChapters
    );
    let celebrateCompletion;

    if (progress === 100) {
      const result = await MARK_PLAN_AS_COMPLETE(plan.id).catch();
      if (result?.completedAt) {
        celebrateCompletion = true;
      }
    }

    const planDetails = `
          *Plan Details:*
    
          📗 *Plan Name:* ${plan?.plans.name}
    
          ⌛ *Status:* ${progress || 0}% Completed
    
          📆 *Started:* ${format(plan.startDate, "MMM d, y")}
    
          📆 *Ends:* ${format(plan.endDate, "MMM d, y")}
    
          ${
            plan.userMade
              ? `✨ *Per Session:* ${plan.perDay}
          
          🚀 *Total Sessions:* ${plan.schedules.length}`
              : ""
          }
    
          ⌛ Showing For ${format(itemToShow.date, "LLLL do, y")}
          ${
            lastIncompletePage !== null
              ? "You are behind your plan, try to read and to catch up 🚀"
              : ""
          }
          ${celebrateCompletion ? "✨✨ PLAN COMPLETED, GOOD JOB! 😎 🎉🎉" : ""}
              `;

    await presentScheduleItems({
      ctx,
      replayTitle: planDetails,
      schedule: itemToShow,
      parseMode: "Markdown",
      currentPage: page!,
      hideNextButton: plan.schedules.length <= page! + 1,
      lastIncompletePage,
    });
    if (!plan.completedAt && celebrateCompletion) {
      await ctx.reply("🎉");
    }
  } catch (error) {
    console.log("Error getting plan", error);
    await ctx.reply("Could not process your request, try again!");
  }

  await handleAnswerCallBack(ctx);
}
