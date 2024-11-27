import { Context } from "grammy";
import { getBotUser, handleAnswerCallBack } from "../../(utils)/utils";
import { CREATE_PLAN_SCHEDULE, GET_TEMPLATE } from "@/utils/supabase/services";
import { addDays } from "date-fns";
import { forUnCustomized as GenerateScheduleForUncustomizedPlan } from "@/utils/generateScheduleData";

export async function startPlanUsingTemplateHandler(ctx: Context) {
  //already handled this condition on top level
  const callBackData = ctx!.callbackQuery!.data!;

  const user = await getBotUser({ ctx, replayError: true });

  if (!user) {
    await handleAnswerCallBack(ctx);
    return;
  }

  const waitMessage = await ctx.reply("⌛ Please wait . . .");
  const templateId = parseInt(callBackData.replace("start-t-", ""));

  try {
    const template = await GET_TEMPLATE(templateId);
    const parsedData = GenerateScheduleForUncustomizedPlan(
      template.schedules.items,
      {
        selectedBooks: template.books,
        startDate: new Date(),
        endDate: addDays(new Date(), template.schedules.items.length),
        chapterCount: 0, //not needed for uncustomized
        planId: template.plans.id.toString(),
        totalBooks: template.books.length,
        totalChapters: template.chaptersCount,
        markPreviousAsComplete: false,
      }
    );

    await CREATE_PLAN_SCHEDULE(
      {
        ...parsedData,
        perDay: template.schedules.perDay,
        planId: parseInt(parsedData.planId),
      },
      user.user_id.toString()
    );

    if (ctx.chat)
      await ctx.api.deleteMessage(ctx.chat?.id, waitMessage.message_id).catch();

    await ctx.reply(
      `🎉🎉🎉🎉 Plan created successfully, use /todays command to get today's list. or /myplans to get all of your plans`
    );
  } catch (error) {
    if (ctx.chat)
      await ctx.api.deleteMessage(ctx.chat?.id, waitMessage.message_id).catch();
    await ctx.reply(`⚠️ ${error || "Something Went Wrong"}`);
  }
}
