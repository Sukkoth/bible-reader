import { GET_TEMPLATE } from "@/utils/supabase/services";
import { addDays, formatDuration, intervalToDuration } from "date-fns";
import { Context } from "grammy";
export async function templateHandler(ctx: Context) {
  //already handled this condition on top level
  const callBackData = ctx!.callbackQuery!.data!;

  const templateId = parseInt(callBackData.replace("template-", ""), 10);

  try {
    const template = await GET_TEMPLATE(templateId);
    const planDetails = `
            **📖 Plan Details:**

            **📗 Plan Name:** *${template.plans.name}*

            **⌛ Description:** *${template.plans.description}*

            **📚 Total Books:** *${template.books.length}*

            **📆 Start Date:** *Today*  

            **📆 Duration:** ${`You will finish this plan in  ${formatDuration(
              intervalToDuration({
                start: new Date(),
                end: addDays(new Date(), template.schedules.items.length),
              })
            )}`}
            ${
              !template.schedules.userMade
                ? `
            **✨ Per Session:** *${template.schedules.perDay}*  

            **🚀 Total Sessions:** *${template.schedules.items.length}*`
                : ""
            }
            `;
    await ctx.reply(planDetails, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Start this plan ✨",
              callback_data: `start-t-${template.id}`,
            },
          ],
        ],
      },
    });
  } catch (error) {
    await ctx.reply(`⚠️ ${error || "Something Went Wrong"}`);
  }
}
