import { createClient } from '@/utils/supabase/server';
import { GET_TEMPLATES } from '@/utils/supabase/services';
import { Context } from 'grammy';
import { InlineKeyboardButton } from 'grammy/types';
import { chunkArray, handleAnswerCallBack, handleGetUserPlans } from '../(utils)/utils';
import DynamicCallBackHandlers from './callBackUtils';

/**
 * Handles the registration callback query. This callback is triggered when
 * the user clicks on the "Register" button in the main menu.
 *
 * The user is prompted to enter their email, password and gender in the
 * chat. The format of the message must be:
 *
 * email: youremail@email.com
 * password: yourpassword
 * gender: male (or female)
 *
 * @param {Context} ctx - The context of the callback query
 */
export async function registrationCallback(ctx: Context) {
  await ctx.reply(`Please enter your email and password like this: 
        email: youremail@email.com
        password: yourpassword
        gender: male (or female)
          `);
  await handleAnswerCallBack(ctx);
}

/**
 * Handles the my plans callback query. This callback is triggered when
 * the user clicks on the "My plans" button in the main menu.
 *
 * @param {Context} ctx - The context of the callback query
 */
export async function myPlansCallback(ctx: Context) {
  if (!ctx.from) {
    console.error('No chat found to handle callback');
    return;
  }
  const supabase = createClient();

  const user = await supabase
    .from('profiles')
    .select('*')
    .eq('telegram_id', ctx.from.id.toString())
    .single();

  if (user.error) {
    await ctx.reply('⚠️ Error getting user, check that you have registered and try again.');
    await handleAnswerCallBack(ctx);
    return;
  }

  await handleGetUserPlans(ctx, user.data.user_id);
  await handleAnswerCallBack(ctx);
}

/**
 * Handles the popular plans callback query. This callback is triggered when
 * the user clicks on the "Popular Plans" button in the main menu.
 *
 * @param {Context} ctx - The context of the callback query
 */
export async function popularPlansCallback(ctx: Context) {
  try {
    const templates = (await GET_TEMPLATES({ userMade: false })) as Template[];

    if (templates.length === 0) {
      await handleAnswerCallBack(ctx);

      await ctx.reply('⚠️ Could not find any plans for you, try again later!');
      return;
    }

    const mappedPlans: InlineKeyboardButton[] = templates.map((template) => {
      return {
        text: template.plans.name,
        callback_data: `template-${template.id}`,
      };
    });

    await ctx.reply('Popular Plans 📚', {
      reply_markup: {
        inline_keyboard: chunkArray(mappedPlans, 2),
      },
    });
    await handleAnswerCallBack(ctx);
  } catch (error) {
    await handleAnswerCallBack(ctx);
    await ctx.reply(`⚠️ ${error || 'Something went wrong'} `);
  }
}

/**
 * Handles dynamic callback queries. Dynamic callback queries are callbacks that
 * are handled by different functions depending on the data of the callback.
 *
 * @param {Context} ctx - The context of the callback query
 */
export async function dynamicCallBacks(ctx: Context) {
  const callBackData = ctx.callbackQuery ? ctx.callbackQuery.data : null;

  if (!callBackData) {
    handleAnswerCallBack(ctx);
    return;
  }

  if (callBackData.startsWith('plan')) {
    await DynamicCallBackHandlers.plan(ctx);
  } else if (callBackData.startsWith('template')) {
    await DynamicCallBackHandlers.template(ctx);
  } else if (callBackData.startsWith('start-t')) {
    await DynamicCallBackHandlers.startUsingTemplate(ctx);
  }

  handleAnswerCallBack(ctx);
}
