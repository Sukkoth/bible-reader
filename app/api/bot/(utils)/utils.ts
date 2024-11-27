import { createClient } from '@/utils/supabase/server';
import { CATCHUP_SCHEDULE, GET_PLANS } from '@/utils/supabase/services';
import { differenceInCalendarDays, format, isPast } from 'date-fns';
import { Context } from 'grammy';
import { InlineKeyboardButton, ParseMode } from 'grammy/types';

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

export async function handleGetUserPlans(ctx: Context, userId: string) {
  try {
    const plans = await GET_PLANS(userId, 'All');

    if (plans.length === 0) {
      await ctx.reply('You have no plans created, try creating one!', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Browse popular plans 📚',
                callback_data: 'popular_plans_callback',
              },
            ],
          ],
        },
      });
      return;
    }

    const mappedPlans: InlineKeyboardButton[] = plans.map((plan) => {
      return {
        text: plan.plans.name,
        callback_data: `plan-${plan.id}`,
      };
    });

    const chunk = chunkArray(mappedPlans, 2);

    await ctx.reply('Your plans', {
      reply_markup: {
        inline_keyboard: chunk,
      },
    });
  } catch (error) {
    console.log(error);
    await ctx.reply('You got no plans');
  }
}

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function getBotUser({
  ctx,
  replayError = true,
}: {
  ctx: Context;
  replayError?: boolean;
}) {
  const supabase = createClient();
  const user = await supabase
    .from('profiles')
    .select('*')
    .eq('telegram_id', ctx.from?.id.toString());

  if (user.error || user.data.length === 0) {
    if (replayError) {
      await ctx.reply(
        '⚠️ Error getting user, check that you have registered or verified and try again.'
      );
    }
    return null;
  }

  return user.data[0] as Profile;
}

type PresentationArgs = {
  schedule: Schedule;
  ctx: Context;
  replayTitle: string;
  perRow?: number;
  parseMode?: ParseMode;
  currentPage?: number;
  hideNextButton?: boolean;
  lastIncompletePage: number | null;
};

export async function presentScheduleItems({
  schedule,
  ctx,
  replayTitle,
  perRow,
  parseMode,
  currentPage = 0,
  hideNextButton,
  lastIncompletePage,
}: PresentationArgs) {
  const allItems = schedule.items.map((item, index) => {
    return {
      text: `${item.status === 'PENDING' ? '⭕' : '✅'} ${item.goal} `,
      callback_data: `plan-${schedule.userPlanId}-${currentPage}-${index}`,
    };
  });

  const navigationButtons = [];

  if (currentPage > 0) {
    navigationButtons.push({
      text: ' ⏮️ Previous',
      callback_data: `plan-${schedule.userPlanId}-${currentPage - 1}`,
    });
  }

  if (!hideNextButton) {
    navigationButtons.push({
      text: 'Next ⏭️',
      callback_data: `plan-${schedule.userPlanId}-${currentPage + 1}`,
    });
  }

  let inline_keyboard = chunkArray(allItems, perRow || 2).concat([navigationButtons]);

  if (lastIncompletePage !== null) {
    inline_keyboard = inline_keyboard.concat([
      [
        {
          text: 'Rearrange schedule to catch up ⚠️',
          callback_data: `plan-${schedule.userPlanId}-${lastIncompletePage}-catchup`,
        },
      ],
    ]);
    if (lastIncompletePage !== currentPage) {
      inline_keyboard = inline_keyboard.concat([
        [
          {
            text: 'View incomplete schedule 🔄️',
            callback_data: `plan-${schedule.userPlanId}-${lastIncompletePage}`,
          },
        ],
      ]);
    }
  }

  const replay = ctx.editMessageText(replayTitle, {
    parse_mode: parseMode,
    reply_markup: {
      inline_keyboard,
    },
  });

  try {
    await replay;
  } catch {
    console.log('No data changed');
  }
}

export function extractCredentials(str: string) {
  const emailMatch = str.match(/email:\s*(\S+)/);
  const passwordMatch = str.match(/password:\s*(\S+)/);
  const genderMatch = str.match(/gender:\s*(\S+)/);

  const email = emailMatch ? emailMatch[1] : null;
  const password = passwordMatch ? passwordMatch[1] : null;
  const gender = genderMatch ? genderMatch[1] : null;

  return { email, password, gender };
}

export function calculateProgress(schedules: Schedule[], target: number) {
  if (!schedules || schedules.length === 0) {
    return { progress: 0, lastIncompletePage: null };
  }

  let lastIncompletePage: number | null = null;
  const today = format(new Date(), 'yyyy-MM-dd');

  const progress = schedules
    .map((schedule, index) => {
      //get last incomplete date
      //if the date is in the past, not same with today, has PENDING items
      //required for catch up
      if (
        lastIncompletePage === null &&
        schedule.items.some((item) => item.status === 'PENDING') &&
        isPast(schedule.date) &&
        today !== schedule.date
      ) {
        lastIncompletePage = index;
      }

      return schedule.items;
    })
    .flat(2)
    .filter((schedule) => schedule.status === 'COMPLETED').length;

  const completedPercent = Math.round((progress / target) * 100) || 0;

  return { progress: completedPercent, lastIncompletePage };
}

type CatchUpArgs = {
  lastIncompletePage: number;
  planId: number;
};

export async function handleCatchUpPlan(args: CatchUpArgs) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('userPlans')
    .select('*, plans(*), schedules(*)')
    .order('id', { referencedTable: 'schedules' })
    .eq('id', args.planId)
    .single();

  if (error) {
    console.log('Coult not execute catchup plan', error);
    return;
  }

  const plan = data as UserPlan;

  const lastInCompleteDate = plan.schedules[args.lastIncompletePage].date;
  const daysToAdd = lastInCompleteDate
    ? differenceInCalendarDays(new Date(), lastInCompleteDate)
    : null;

  if (!daysToAdd) {
    console.log('FAILED TO EXECUTE CATCHUP, No daysToAdd', daysToAdd);
    return {
      error: 'Could not execute catch up!',
    };
  }

  const result = await CATCHUP_SCHEDULE({
    daysToAdd,
    lastInCompleteDate,
    scheduleId: plan.id,
  });

  return result;
}

export async function handleAnswerCallBack(ctx: Context) {
  try {
    await ctx.answerCallbackQuery();
  } catch {
    console.log('No callback to answer to');
  }
}
